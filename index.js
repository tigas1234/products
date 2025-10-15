import http from "http";
import fs from "fs";
const usersFile = "./users.json";
const productsFile = "./products.json";
function readFile(path) {
  try {
    return JSON.parse(fs.readFileSync(path, "utf-8"));
  } catch {
    return [];
  }}
function saveFile(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}
const server = http.createServer((req, res) => {
  const { method, url } = req;
  res.setHeader("Content-Type", "application/json");
  if (url === "/user" && method === "GET") {
    return res.end(JSON.stringify(readFile(usersFile)));
  }
  if (url === "/user" && method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try {
        const { name, email } = JSON.parse(body);
        if (!name || !email) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: "Nome e e-mail são obrigatórios!" }));
        }
        const users = readFile(usersFile);
        if (users.some(u => u.email === email)) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: "E-mail já cadastrado!" }));
        }
        const newUser = { id: Date.now(), name, email };
        users.push(newUser);
        saveFile(usersFile, users);
        res.statusCode = 201;
        return res.end(JSON.stringify(newUser));
      } catch {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Erro no formato do JSON." }));
      }
    });
    return;
  }
  if (url === "/product" && method === "GET") {
    return res.end(JSON.stringify(readFile(productsFile)));
  }
  if (url === "/product" && method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try {
        const { name, price } = JSON.parse(body);
        if (!name || price == null) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: "Nome e preço são obrigatórios!" }));
        }
        const products = readFile(productsFile);
        const newProduct = { id: Date.now(), name, price: Number(price) };
        products.push(newProduct);
        saveFile(productsFile, products);

        res.statusCode = 201;
        return res.end(JSON.stringify(newProduct));
      } catch {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Erro no formato do JSON." }));
      }
    });
    return;
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ message: "Rota não encontrada" }));
});
server.listen(3333, () => {
  console.log("🚀 Servidor rodando em http://localhost:3333");
});
