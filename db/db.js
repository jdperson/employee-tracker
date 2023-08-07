const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "root",
        database: "employees_db"
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
    const query = `
        SELECT
            roles.id AS "id",
            roles.title AS "title",
            departments.name AS "department",
            roles.salary AS "salary"
        FROM roles
        INNER JOIN departments ON roles.department_id = departments.id
    `;

    db.query(query, (err, roles) => {
        if (err) throw err;

        console.table(roles);
        main();
    });
};

function viewEmployees() {
    const query = `
        SELECT
            emp.id AS "id",
            emp.first_name AS "first_name",
            emp.last_name AS "last_name",
            roles.title AS "title",
            departments.name AS "department",
            roles.salary AS "salary",
            CASE
                WHEN managers.id IS NULL THEN "null"
                ELSE CONCAT(managers.first_name, " ", managers.last_name)
            END AS "manager"
        FROM employees AS emp
        INNER JOIN roles ON emp.role_id = roles.id
        INNER JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees AS managers ON emp.manager_id = managers.id
    `;

    db.query(query, (err, employees) => {
        if (err) throw err;

        console.table(employees);
        main();
    });
};

function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "departmentName",
            message: "What is the name of the department?",
            validate: (input) => {
                if (input.trim() === "") {
                    return "Department name required";
                }   return true;
            }
        })
        .then((answer) => {
            const departmentName = answer.departmentName;
            
            const query = "INSERT INTO departments (name) VALUES (?)";
            db.query(query, [departmentName], (err, result) => {
                if (err) throw err;

                console.log(`Added ${departmentName} to the database`);
                main();
            })
        })
};

function addRole() {
    db.query("SELECT * FROM departments", (err, departments) => {
        if (err) throw err;
        
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "roleName",
                    message: "What is the name of the role?",
                    validate: (input) => {
                        if (input.trim() === "") {
                            return "Role name required";
                        }   return true;
                    }
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary of the role?",
                    validate: (input) => {
                        if (isNaN(input)) {
                            return "A valid salary only contains numbers";
                        }   return true;
                    }
                },
                {
                    type: "list",
                    name: "departmentName",
                    message: "Which department does the role belong to?",
                    choices: departments.map((dept) => dept.name)
                }
            ])
            .then((answers) => {
                const roleName = answers.roleName;
                const salary = parseInt(answers.salary);
                const departmentName = answers.departmentName;

                const department = departments.find((dept) => dept.name === departmentName);
                const departmentID  = department.id;

                const query = "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
                db.query(query, [roleName, salary, departmentID],
                    (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${roleName} to database`);
                        main();
                    }
                );
            });
    });
};

function addEmployee() {
    db.query("SELECT * FROM roles", (err, roles) => {
        if (err) throw err;

        db.query("SELECT * FROM employees", (err, employees) => {
            if (err) throw err;

            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "firstName",
                        message: "What is the employee's first name?",
                        validate: (input) => {
                            if (input.trim() === "") {
                                return "First name required";
                            }   return true;
                        }
                    },
                    {
                        type: "input",
                        name: "lastName",
                        message: "What is the employee's last name?",
                        validate: (input) => {
                            if (input.trim() === "") {
                                return "Last name required";
                            }   return true;
                        }
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "What is the employee's role?",
                        choices: roles.map((role) => role.title)
                    },
                    {
                        type: "list",
                        name: "manager",
                        message: "Who is the employee's manager?",
                        choices: [...employees.map((emp) => emp.first_name + " " + emp.last_name), "null"]
                    }
                ])
                .then((answers) => {
                    const firstName = answers.firstName;
                    const lastName = answers.lastName;
                    const roleName = answers.role;
                    const managerName = answers.manager;

                    const role = roles.find((role) => role.title === roleName);
                    const roleID = role.id;

                    let managerID = null;
                    if (managerName !== "null") {
                        const manager = employees.find(
                            (emp) => emp.first_name + " " + emp.last_name === managerName
                        );
                        managerID = manager.id;
                    }

                    const query = "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?)";
                    db.query(query, [firstName, lastName, roleID, managerID],
                        (err, result) => {
                            if (err) throw err;
                            console.log(`Added ${firstName} ${lastName} to database`);
                            main();
                        } 
                    )
                })
        })
    })
};

function updateRole() {
    db.query("SELECT * FROM employees", (err, employees) => {
        if (err) throw err;

        db.query("SELECT * FROM roles", (err, roles) => {
            if (err) throw err;

            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Which employee's role do you want to update?",
                        choices: employees.map((emp) => emp.first_name + " " + emp.last_name)
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Which role do you want to assign the selected employee?",
                        choices: roles.map((role) => role.title)
                    }
                ])
                .then((answers) => {
                    const employeeName = answers.employee;
                    const roleName = answers.role;

                    const employee = employees.find(
                        (emp) => emp.first_name + " " + emp.last_name === employeeName
                    );
                    const employeeID = employee.id;

                    const role = roles.find((role) => role.title === roleName);
                    const roleID = role.id;

                    const query = "UPDATE employees SET role_id = ? WHERE id = ?";
                    db.query(query, [roleID, employeeID],
                        (err, result) => {
                            if (err) throw err;
                            console.log(`Updated ${employeeName}'s role`)
                            main();
                        }
                    );
                });
        });
    });
};

module.exports = {
    inquirer,
    viewDepartments,
    viewRoles,
    viewEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateRole
};