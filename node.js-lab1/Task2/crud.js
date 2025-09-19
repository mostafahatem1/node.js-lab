import fs from "fs/promises";

let data;

try {
  data = await fs.readFile("./users.json", "utf-8");
} catch (err) {
  data = "[]";
}

let parsedData = JSON.parse(data);

const [,, action, ...args] = process.argv;


//  getOne
function getOne(id) {
  const user = parsedData.find((u) => u.id === parseInt(id));
  if (user) console.log(user);
  else console.log(`not found id = ${id}`);
}

// add user
function add(name) {
  const newId = parsedData.length > 0 ? parsedData[parsedData.length - 1].id + 1 : 1;
  const newUser = { id: newId, name };

  parsedData.push(newUser);
  console.log(" added user:", newUser);
}

// remove user
function remove(id) {
  const index = parsedData.findIndex((u) => u.id === parseInt(id));
  if (index !== -1) {
    const deletedUser = parsedData.splice(index, 1);
    console.log(" removed user:", deletedUser);
  } else {
    console.log(`not found id = ${id}`);
  }
}

// edit user
function edit(id, name) {
  const user = parsedData.find((u) => u.id === parseInt(id));
  if (user) {
    user.Name = name;
    console.log(" edited user:", user);
  } else {
    console.log(`not found id = ${id}`);
  }
}


switch (action) {
  case "getall":
    getAll();
    break;
  case "getone":
    getOne(args[0]);
    break;
  case "add":
    add(args[0]);
    break;
  case "remove":
    remove(args[0]);
    break;
  case "edit":
    edit(args[0], args[1]);
    break;
  default:
    console.log("error action");
    break;
}

await fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));


