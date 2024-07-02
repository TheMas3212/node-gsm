import { WebSocketServer } from "ws";
import { createServer } from "https";
import { readFileSync } from "fs";

const server = createServer({
  cert: readFileSync("cert.pem"),
  key: readFileSync("key.pem")
});
const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    const event = JSON.parse(data.toString("utf8"));
    console.log(event);
    if (event.type === "Authorize" && event.key === "ONETIMEKEY") {
      ws.send(JSON.stringify({ type: "UpdateKey", key: "LONGKEY" }));
      ws.close();
      return;
    }
    if (event.type === "Authorize" && event.key === "LONGKEY") {
      ws.send(JSON.stringify({ type: "Authorized" }));
      return;
    }
  });

  // ws.send("{}");
});

server.listen(8080);