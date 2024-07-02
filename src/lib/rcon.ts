import { createConnection, Socket } from "net";
import { Transform, TransformCallback, DuplexOptions } from "stream";

type RCONPacket = {
  id: number;
  type: number;
  body: string;
};

class RCONPacketToStream extends Transform {
  constructor(options: DuplexOptions = {}) {
    super({ ...options, writableObjectMode: true });
  }
  _transform(packet: RCONPacket, encoding: BufferEncoding, callback: TransformCallback): void {
    const msg = Buffer.alloc(packet.body.length + 14);
    msg.writeInt32LE(msg.length-4, 0); // Size
    msg.writeInt32LE(packet.id, 4); // Id
    msg.writeInt32LE(packet.type, 8); // Type
    msg.write(packet.body, 12, "ascii");
    callback(null, msg);
  }
}
class RCONStreamToPacket extends Transform {
  private _buffer: Buffer;
  constructor(options: DuplexOptions = {}) {
    super({ ...options, readableObjectMode: true });
    this._buffer = Buffer.alloc(0);
  }
  _transform(chunk: Buffer | string, encoding: BufferEncoding, callback: TransformCallback): void {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
    const data = this._buffer.length > 0 ? Buffer.concat([this._buffer, buf]) : buf;
    let index = 0;
    while (true) {
      if ((data.length - index) < 4) break;
      const size = data.readInt32LE(index);
      if ((data.length - (index + 4)) < size) break;
      const id = data.readInt32LE(index+4);
      const type = data.readInt32LE(index+8);
      const body = data.subarray(index+12, index+4+(size-1)-1).toString("ascii");
      this.push({ id, type, body });
      index = index + size+4;
    }
    this._buffer = data.subarray(index);
    callback();

  }
}

type RCONRequest = {
  resolve: (result: string) => void;
  reject: (error: Error) => void;
};

enum PacketType {
  SERVERDATA_RESPONSE_VALUE  = 0,
  SERVERDATA_EXECCOMMAND = 2,
  SERVERDATA_AUTH_RESPONSE = 2,
  SERVERDATA_AUTH = 3,
}

export class RCON {
  private socket?: Socket;
  private rx?: RCONStreamToPacket;
  private tx?:RCONPacketToStream;
  private nonce: number;
  private pending: Map<string,RCONRequest>;
  public constructor(private host: string, private port: number, private password?: string) {
    this.nonce = Math.floor(Math.random() * (2**31));
    this.pending = new Map();
  }
  private _disconnect(err: Error) {
    for (const [id, request] of this.pending) {
      request.reject(err);
      this.pending.delete(id);
    }
    if (this.socket) { this.socket.destroy(); }
    if (this.tx) { this.tx?.destroy(); }
    if (this.rx) { this.rx?.destroy(); }
  }
  private _packet(packet: RCONPacket) {
    if (packet.id < 0) {
      const error = new Error("Authentication Error");
      for (const [id, request] of this.pending) {
        request.reject(error);
      }
    }
    const request = this.pending.get(packet.id.toString());
    if (request) {
      request.resolve(packet.body);
      this.pending.delete(packet.id.toString());
    }
  }
  private _nonce(): number {
    const n = this.nonce;
    this.nonce = (n + 1) % (2**31);
    return n;
  }
  public send(type: PacketType, body: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.tx) {
        const id = this._nonce();
        this.tx.write({ id, type, body });
        const req = { resolve, reject };
        this.pending.set(id.toString(), req);
      } else {
        return reject(new Error("Not Connected"));
      }
    });
  }
  public connect(): Promise<string> {
    return new Promise((resolve) => {
      this._disconnect(new Error("Reconnecting"));
      this.socket = createConnection({ host: this.host, port: this.port });
      this.tx = new RCONPacketToStream();
      this.rx = new RCONStreamToPacket();
      this.socket.pipe(this.rx);
      this.tx.pipe(this.socket);
      this.rx.on("data", this._packet.bind(this));
      this.socket.once("connect", () => {
        if (this.password) {
          resolve(this.send(PacketType.SERVERDATA_AUTH, this.password));
        } else {
          resolve("");
        }
      });
    });
  }
  public disconnect(): void {
    this._disconnect(new Error("Disconnected"));
  }
  public run(command: string): Promise<string> {
    return this.send(PacketType.SERVERDATA_EXECCOMMAND, command);
  }
}

(async function() {
  const { createInterface } = await import("readline");
  const rcon = new RCON("127.0.0.1", 50042, "QEkQybqdV2sYUYiLCBoVUNZtSmLMV9ox");
  await rcon.connect();
  const inter = createInterface({ input: process.stdin, output: process.stdout, prompt: "> "});
  inter.prompt();
  inter.on("line", (line) => rcon.run(line).then((line) => {
    console.log(line);
    inter.prompt();
  }));
})();

