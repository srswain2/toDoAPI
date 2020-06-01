const sql = require("./db.js");

// constructor
const Task = function(task) {
  this.id = task.id;
  this.title = task.title;
  this.created_on = new Date();
};

Task.create = (newTask, result) => {
  sql.query("INSERT INTO todo SET ?", newTask, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created task: ", { id: res.insertId, ...newTask });
    result(null, { id: res.insertId, ...newTask });
  });
};

Task.findById = (taskId, result) => {
  sql.query(`SELECT * FROM todo WHERE id = ${taskId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found task: ", res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

Task.getAll = result => {
  sql.query("SELECT * FROM todo", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("tasks: ", res);
    result(null, res);
  });
};
//
Task.update = (id, task, result) => {
  sql.query(
    "INSERT INTO todo (id, title, created_on) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE title=?, created_on=?",
    [id, task.title, task.created_on, task.title, task.created_on],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated task: ", { id: id, ...task });
      result(null, { id: id, ...task });
    }
  );
};

Task.bulkDelete = (ids, result) => {
    console.log('*************');
    console.log(ids);
    sql.query(
        "DELETE FROM todo WHERE id IN (?)",
        [ids],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("deleted task: ", ids);
            result(null, ids);
        }
    );
};

Task.remove = (id, result) => {
  sql.query("DELETE FROM todo WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted task with id: ", id);
    result(null, res);
  });
};

Task.removeAll = result => {
  sql.query("DELETE FROM todo", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} tasks`);
    result(null, res);
  });
};

module.exports = Task;
