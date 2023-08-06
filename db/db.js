const mysql = require("mysql2");
const table = require("console.table");

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "root",
        database: ""
    },
);

db.connect((err) => {
    if (err) throw err;
    console.log("Connection to database established");
})

function viewDepartments() {
    const query = "SELECT * FROM departments";
    db.query(query, (err, departments) => {
        if (err) throw err;

        console.table(departments);
        main();
    });
};

function viewRoles() {
    const query = "SELECT * FROM roles";
    db.query(query, (err, roles) => {
        if (err) throw err;

        console.table(roles);
        main();
    });
};

function viewEmployees() {
    const query = "SELECT * FROM employees";
    db.query(query, (err, employees) => {
        if (err) throw err;

        console.table(employees);
        main();
    });
};

function addDepartment() {

};

function addRole() {

};

function addEmployee() {

};

function updateRole() {

};

module.exports = {
    viewDepartments,
    viewRoles,
    viewEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateRole
}