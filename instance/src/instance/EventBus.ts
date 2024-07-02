import { WebSocket } from "ws";
import * as events from "../lib/events";
import { readFileSync } from "fs";
import { EventEmitter } from "events";

export interface EventBus {
  connect(): void;
  disconnect(): void;
  send(data: any): void;
  on(event: "socketError", handler: (error: any) => void): this;
  on(event: "ready", handler: () => void): this;
  on(event: "rekey", handler: (key: string) => void): this;
  on(event: "event", handler: (event: any) => void): this;
}

export class EventBus extends EventEmitter {
  private readonly uri: string;
  private readonly identifer: string;
  private key: string;
  private state: "IDLE" | "CONNECTING" | "CONNECTED" | "READY" | "EXITING";
  private socket?: WebSocket;
  private _onOpen: () => void;
  private _onClose: () => void;
  private _onError: (error: any) => void;
  private _onMessage: (data: Buffer) => void;
  private _onPong: () => void;
  private _onPongTimeout: () => void;
  private _pingInterval?: NodeJS.Timeout;
  private _pingTimeout?: NodeJS.Timeout;
  constructor(identifer: string, uri: string, key: string) {
    super();
    this.identifer = identifer;
    this.uri = uri;
    this.key = key;
    this.state = "IDLE";
    this._onOpen = this.onOpen.bind(this);
    this._onClose = this.onClose.bind(this);
    this._onError = this.onError.bind(this);
    this._onMessage = this.onMessage.bind(this);
    this._onPong = this.onPong.bind(this);
    this._onPongTimeout = this.onPongTimeout.bind(this);
    this.connect();
  }
  disconnect() {
    this.state = "EXITING";
    this.cleanupSocket();
  }
  connect() {
    this.cleanupSocket();
    clearTimeout(this._pingTimeout);
    this.state = "CONNECTING";
    this.socket = new WebSocket(this.uri, {
      ca: readFileSync("cert.pem")
    });
    this.socket.on("open", this._onOpen);
    this.socket.on("close", this._onClose);
    this.socket.on("error", this._onError);
    this.socket.on("message", this._onMessage);
    this.socket.on("pong", this._onPong);
    this._pingInterval = setInterval(() => this.socket?.ping(), 15000);
  }
  send(event: any) {
    if (this.state === "IDLE" || this.socket === undefined) {
      throw new Error("Can't send to idle socket");
    }
    this.socket.send(JSON.stringify(event));
  }
  private cleanupSocket() {
    if (this.socket) {
      this.socket.off("open", this._onOpen);
      this.socket.off("close", this._onClose);
      this.socket.off("error", this._onError);
      this.socket.off("message", this._onMessage);
      this.socket.off("pong", this._onPong);
      clearInterval(this._pingInterval);
      this.socket.terminate();
    }
  }
  private onOpen() {
    if (this.state === "CONNECTING") this.state = "CONNECTED";
    this.onPong();
    this.send({
      type: events.InstanceToMaster.EventType.Authorize,
      key: this.key,
      identifer: this.identifer
    });
  }
  private onClose() {
    this.cleanupSocket();
    if (this.state !== "EXITING") {
      setTimeout(() => {
        this.connect();
      }, 500);
    }
  }
  private onError(error: any) {
    this.emit("socketError", error);
  }
  private onMessage(data: Buffer) {
    const event = JSON.parse(data.toString("utf8"));
    switch (event.type) {
      case events.MasterToInstace.EventType.UpdateKey: {
        this.key = event.key;
        this.emit("rekey", this.key);
        this.connect();
        return;
      }
      case events.MasterToInstace.EventType.Authorized: {
        this.state = "READY";
        this.emit("ready");
        return;
      }
      default: {
        this.emit("event", event);
      }
    }
  }
  private onPong() {
    clearTimeout(this._pingTimeout);
    this._pingTimeout = setTimeout(this._onPongTimeout, 30000 + 1000);
  }
  private onPongTimeout() {
    this.connect();
  }
}
