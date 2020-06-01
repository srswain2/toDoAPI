const Task = require("../models/todo.model.js");

// Create and Save a new Customer
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Customer
    const task = new Task({
        id: req.body.id,
        title: req.body.title
    });

    // Save Customer in the database
    Task.create(task, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the Task."
            });
        else res.send(data);
    });
};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
    Task.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving tasks."
            });
        else res.send(data);
    });
};

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
    Tsk.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Task with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Task with id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.update = async (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    console.log(req.body);
    let result = 1;
    await req.body.forEach((obj) => {
        Task.update(
            obj.id,
            new Task(obj),
            (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found Task`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating Task with id "
                        });
                    }
                    result = 0;
                }
            }
        );
    });
    if (result === 1) {
        await Task.getAll((err, data) => {
            if (err)
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while retrieving tasks."
                });
            else {
                let deleteIds = '';
                data.forEach((deleteObj) => {
                    console.log('-------');
                    console.log(deleteObj);
                    console.log('----------')
                    let flag = 0;
                    req.body.forEach((obj) => {
                        if (obj.id === deleteObj.id) {
                            flag = 1;
                        }
                    });

                    if (!flag) {
                        deleteIds = deleteIds + deleteObj.id + ',';
                    }
                });
                if (deleteIds !== '' && deleteIds !== null && deleteIds !== undefined) {
                    deleteIds = deleteIds.slice(0, -1);
                    Task.bulkDelete(deleteIds,(delErr, delData) => {
                        if (delErr) {
                            if (delErr.kind === "not_found") {
                                res.status(404).send({
                                    message: `Not found Task [Delete Operation]]`
                                });
                            } else {
                                res.status(500).send({
                                    message: "Could not delete Task"
                                });
                            }
                        } else res.send({ message: `Task updated successfully!` });
                    })
                } else {
                    res.send({ message: `Task updated successfully!` })
                }

            }
        });
    }
};

// Delete a Customer with the specified customerId in the request
exports.delete = (req, res) => {
    Task.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Task with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Task with id " + req.params.id
                });
            }
        } else res.send({ message: `Task was deleted successfully!` });
    });
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
    Task.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                err.message || "Some error occurred while removing all tasks."
            });
        else res.send({ message: `All Tasks were deleted successfully!` });
    });
};
