module.exports = app => {
  const tasks = require("../controllers/todo.controller.js");

  // Create a new Customer
  app.post("/tasks", tasks.create);

  // Retrieve all Customers
  app.get("/tasks", tasks.findAll);

  // Retrieve a single Customer with customerId
  app.get("/tasks/:id", tasks.findOne);

  // Update a Customer with customerId
  app.post("/tasks/update", tasks.update);

  // Delete a Customer with customerId
  app.delete("/tasks/:id", tasks.delete);

  // Create a new Customer
  app.delete("/tasks", tasks.deleteAll);
};
