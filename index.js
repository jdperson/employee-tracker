const inquirer = require("inquirer");
const {
    viewDepartments,
    viewRoles,
    viewEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateRole
} = require("./db/db.js");

function main() {
    inquirer
        .prompt({
            type: "list",
            name: "res",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Exit"
            ]
        })
        .then((answer) => {
            switch (answer.res) {
                case "View all departments":
                    viewDepartments();
                    main();
                    break;
                case "View all roles":
                    viewRoles();
                    main();
                    break;
                case "View all employees":
                    viewEmployees();
                    main();
                    break;
                case "Add a department":
                    addDepartment();
                    main();
                    break;
                case "Add a role":
                    addRole();
                    main();
                    break;
                case "Add an employee":
                    addEmployee();
                    main();
                    break;
                case "Update an employee role":
                    updateRole();
                    main();
                    break;
                case "Exit":
                    process.exit();
                default:
                    console.log("Selection invalid");
                    main();
                    break;
            }
        })
}

main();