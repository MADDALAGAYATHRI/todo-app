db = db.getSiblingDB('tododb');
db.todos.insertMany([
  { title: "First task", completed: false },
  { title: "Second task", completed: false }
]);
