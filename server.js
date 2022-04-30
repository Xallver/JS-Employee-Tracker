// Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const PORT = process.env.PORT || 3001;

// MySQL information
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db'
});

// Connection to MySQL
db.connect(function (error) {
    if (error) throw error;
    console.log("Welcome to Employee Manager");

    db.query("SELECT * from role", function (error, res) {
        roles = res.map(role => ({
            name: role.title,
            value: role.id
        }))
    })
    db.query("SELECT * from department", function (error, res) {
        departments = res.map(dep => ({
            name: dep.name,
            value: dep.id
        }))
    })
    db.query("SELECT * from employee", function (error, res) {
        employees = res.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }))
    })

    inquirerPrompt();
});

function inquirerPrompt() {
    inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "choices",
        choices: [{
                name: "View All Departments",
                value: "viewAllDepartments"
            },
            {
                name: "View All Roles",
                value: "viewAllRoles"
            },
            {
                name: "View All Employees",
                value: "viewAllEmployees"
            },
            {
                name: "Add A Department",
                value: "addDepartment"
            },
            {
                name: "Add A Role",
                value: "addRole"
            },
            {
                name: "Add An Employee",
                value: "addEmployee"
            },
            {
                name: "Update An Employee Role",
                value: "updateRole"
            },
            {
                name: "End",
                value: "end"
            }
        ]
    }).then(function (res) {
        mainMenu(res.choices)
    });
}; 

function mainMenu(options) {
    switch (options) {
        case "viewAllDepartments":
            viewAllDepartments();
            break;
        case "viewAllRoles":
            viewAllRoles();
            break;
        case "viewAllEmployees":
            viewAllEmployees();
            break;
        case "addDepartment":
            addDepartment();
            break;
        case "addRole":
            addRole();
            break;
        case "addEmployee":
            addEmployee();
            break;
        case "updateRole":
            updateRole();
            break;
        case "end":
            end();
    };
};

function viewAllDepartments() {
    db.query("SELECT * FROM department", function (error, res) {
        console.table(res);
        endOrMain();
    });
};

function viewAllRoles() {
    db.query("SELECT * FROM role", function (error, res) {
        console.table(res);
        endOrMain();
    });
};

function viewAllEmployees() {
    db.query("SELECT * FROM employee", function (error, res) {
        console.table(res);
        endOrMain();
    });
}; 

function addDepartment() {
    inquirer.prompt([{
            type: "input",
            message: "What is the new department name?",
            name: "name"
        }])
        .then(function (response) {
            newDepartment(response);
        });
};

function newDepartment(data) {
    db.query("INSERT INTO department SET ?", {
            name: data.name
        },
        function (error, res) {
            if (error) throw error;
        });
    endOrMain();
};

function addRole() {
    inquirer.prompt([{
                type: "input",
                message: "What is the name of the new role?",
                name: "title"
            },
            {
                type: "input",
                message: "What is the salary of the new role?",
                name: "salary"

            },
            {
                type: "list",
                message: "Which department is the new role in?",
                name: "id",
                choices: departments
            }
        ])
        .then(function (response) {
            addNewRole(response);
        });
};

function addNewRole(data) {
    db.query("INSERT INTO role SET ?", {
        title: data.title,
        salary: data.salary,
        department_id: data.id
    }, function (error, res) {
        if (error) throw error;
    });
    endOrMain();
};