import http from "http";
import fs from "fs/promises";
import { content } from "./main.js";

const PORT = 3000;
let cssContent = "";
let parsedUsers = [];


    cssContent = await fs.readFile("styles.css", "utf-8");
    const users = await fs.readFile("users.json", "utf-8");
    parsedUsers = JSON.parse(users);

async function saveUsers() {
  await fs.writeFile("users.json", JSON.stringify(parsedUsers, null, 2));
}

const server = http.createServer(async (req, res) => {
  console.log(req.method, req.url);

  const reg = /^\/users\/\d+$/;

  switch (req.method) {
    case "GET":
      if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        return res.end(content("Mostafa"));
      }
      if (req.url === "/styles.css") {
        res.writeHead(200, { "Content-Type": "text/css" });
        return res.end(cssContent);
      }
      if (req.url === "/users") {
        res.writeHead(200, { "content-type": "application/json" });
        return res.end(JSON.stringify(parsedUsers));
      }
      if (reg.test(req.url)) {
        const id = parseInt(req.url.split("/")[2]);
        const user = parsedUsers.find((u) => u.id === id);
        if (!user) {
          res.writeHead(404);
          return res.end("not found");
        }
        res.writeHead(200, { "content-type": "application/json" });
        return res.end(JSON.stringify(user));
      }
      res.writeHead(404);
      res.end("error");
      break;

    case "POST":
      if (req.url === "/users") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", async () => {
          try {
            const user = JSON.parse(body);
            const newId =
              parsedUsers.length > 0
                ? parsedUsers[parsedUsers.length - 1].id + 1
                : 1;
            user.id = newId;
            parsedUsers.push(user);
            await saveUsers();
            res.writeHead(201, { "content-type": "application/json" });
            res.end(JSON.stringify(user));
          } catch {
            res.writeHead(400);
            res.end("invalid json");
          }
        });
      }
      break;

    case "PUT":
      if (reg.test(req.url)) {
        const id = parseInt(req.url.split("/")[2]);
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", async () => {
          try {
            const { name } = JSON.parse(body);
            const user = parsedUsers.find((u) => u.id === id);
            if (!user) {
              res.writeHead(404);
              return res.end("NOT FOUND");
            }
            user.name = name;
            await saveUsers();
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify(user));
          } catch {
            res.writeHead(400);
            res.end("invalid json");
          }
        });
      }
      break;

    case "DELETE":
      if (reg.test(req.url)) {
        const id = parseInt(req.url.split("/")[2]);
        const index = parsedUsers.findIndex((u) => u.id === id);
        if (index === -1) {
          res.writeHead(404);
          return res.end("not found");
        }
        const deleted = parsedUsers.splice(index, 1);
        await saveUsers();
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(deleted[0]));
      }
      break;

    default:
      res.writeHead(405);
      res.end("method not allowed");
      break;
  }
});


  server.listen(PORT, "localhost", () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });

