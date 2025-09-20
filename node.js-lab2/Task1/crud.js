import { Command } from "commander";
import fs from "fs/promises";

const program = new Command();

let data;
try {
  data = await fs.readFile("./users.json", "utf-8");
} catch (err) {
  data = "[]";
}

let parsedData = JSON.parse(data);


function getOne(id) {
  const user = parsedData.find((u) => u.id === parseInt(id));
  if (user) console.log(user);
  else console.log(`not found id = ${id}`);
}

function add(name) {
  const newId = parsedData.length > 0 ? parsedData[parsedData.length - 1].id + 1 : 1;
  const newUser = { id: newId, Name };
  parsedData.push(newUser);
  console.log(" added user:", newUser);
}

function removeUser(id) {
  const index = parsedData.findIndex((u) => u.id === parseInt(id));
  if (index !== -1) {
    const deletedUser = parsedData.splice(index, 1);
    console.log(" removed user:", deletedUser);
  } else {
    console.log(`not found id = ${id}`);
  }
}

function edit(id, name) {
  const user = parsedData.find((u) => u.id === parseInt(id));
  if (user) {
    user.Name = name;
    console.log(" edited user:", user);
  } else {
    console.log(`not found id = ${id}`);
  }
}


program
  .command("getone <id>")
  .description("get one user")
  .action((id) => {
    getOne(id);
  });

program
  .command("add <name>")
  .description("add new user")
  .action((name) => {
    add(name);
  });

program
  .command("remove <id>")
  .description("remove user")
  .action((id) => {
    removeUser(id);
  });

program
  .command("edit <id> <name>")
  .description("edit user")
  .action((id, name) => {
    edit(id, name);
  });

program.parse(process.argv);


await fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));
