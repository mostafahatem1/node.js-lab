const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const app = express();
const PORT = 3000;

const DB_PATH = path.join(__dirname, "todos.json");

app.use(express.json());

async function getTodosFromFile() {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeTodosToFile(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

app.get("/api/todos", async (req, res) => {
  try {
    const todoList = await getTodosFromFile();
    res.json({
      items: todoList,
      count: todoList.length,
    });
  } catch (err) {
    res.status(500).send("Failed to fetch todos");
  }
});

app.get("/api/todos/:id", async (req, res) => {
  try {
    const todos = await getTodosFromFile();
    const id = parseInt(req.params.id);
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      return res.status(404).send("Todo not found");
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).send("Error retrieving todo");
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    let list = await getTodosFromFile();
    const todoId = Number(req.params.id);
    const idx = list.findIndex((item) => item.id === todoId);

    if (idx === -1) {
      return res.status(404).send("Todo not found");
    }

    list.splice(idx, 1);
    await writeTodosToFile(list);
    res.send({ ok: true });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

app.listen(PORT, async () => {
  console.log("Server started on port", PORT);
  const todos = await getTodosFromFile();
  if (todos.length) console.log("Loaded", todos.length, "todos");
});
