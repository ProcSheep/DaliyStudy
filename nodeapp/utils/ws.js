const websocket = require("ws");
const http = require("http");

const server = http.createServer((req, res) => {
  req.writeHead(200);
  res.end("websocket run!");
});

// http升级ws
const wss = new websocket.Server({ server });

// 所有客户端空间
const clients = new Set([]);
wss.on("connection", (ws) => {
  console.log("新用户连接");
  clients.add(ws);

  // 监听消息
  ws.on("message", (data) => {
    const message = data.toString();
    console.log("收到客户消息", message);

    // 广播发送
    clients.forEach((client) => {
      // 给状态为OPEN的客户发送 OPEN:1
      if (client.readyState === websocket.OPEN) {
        client.send(`服务器转发: ${message}`);
      }
    });
  });

  // 监听断开
  ws.on("close", () => {
    console.log("客户端已离开");
    clients.delete(ws);
  });

  // 监听错误
  ws.on("error", (err) => {
    console.log("websocket出错", err);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`ws服务器启动，地址为: ws://localhost:${PORT}`);
});
