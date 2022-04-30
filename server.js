// My required dependencies
const inquirer = require('inquirer');
const db = require('./db/connection');
const consoleTable = require('console.table');
const confirm = require('inquirer-confirm');



// Connection to MySQL 
db.connect(function (error) {
    if (error) throw error;
    console.log("Welcome to Employee Manager");

    // DB Query for roles
    db.query("SELECT * from role", function (error, res) {
        roles = res.map(role => ({
            name: role.title,
            value: role.id
        }))
    })
    // DB Query for departments
    db.query("SELECT * from department", function (error, res) {
        departments = res.map(dep => ({
            name: dep.name,
            value: dep.id
        }))
    })
    // DB Query for employees
    db.query("SELECT * from employee", function (error, res) {
        employees = res.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }))
    })
    initialPrompt();
});

// Function for Initial Prompt
function initialPrompt() {
    inquirer.prompt([{
        message: "What would you like to do?",
        type: "list",
        name: "action",
        choices: ['View all employees', 'View roles', 'View departments', 'Add employee', 'Add role', 
        'Add department', 'Update employee role', 'exit']

    }]).then((res) => {
        if(res.action === 'viewAllDepartments') {
            viewAllDepartments();
        }
        else if (res.action === 'viewAllRoles') {
            viewAllRoles();
        }
        else if (res.action === 'viewAllEmployees') {
            viewAllEmployees();
        }
        else if (res.action === 'addDepartment') {
            addDepartment();
        }
        else if (res.action === 'addRole') {
            addRole();
        }
        else if (res.action === 'addEmployee') {
            addEmployee();
        }
        else if (res.acion === 'updateRole') {
            updateRole();
        }
        else {
            db.end();
            return;
        }
    });
};

// View all departments function
function viewAllDepartments() {
    db.query("SELECT * FROM department", function (error, res) {
        console.table(res);
        endOrMain();
    });
};

// View all roles function
function viewAllRoles() {
    db.query("SELECT * FROM role", function (error, res) {
        console.table(res);
        endOrMain();
    });
};

// View all employees function
function viewAllEmployees() {
    db.query("SELECT * FROM employee", function (error, res) {
        console.table(res);
        endOrMain();
    });
};

// Add Department function
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

// Add Role function
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

// Add Employee function
function addEmployee() {
    inquirer.prompt([{
        type: 'input',
        message: "What is the employee's first name?",
        name: "firstName",
    },
    {
        type: 'input',
        message: "What is the employee's last name?",
        name: "lastName",
    },
    {
        type: "list",
        message: "What is the title of the employee?",
        name: "title",
        choices: roles
    },
    {
        type: "list",
        message: "Who is the manager of the employee?",
        name: "manager",
        choices: employees
    }
    ])
        .then(function (response) {
            newEmployee(response);
        });
};

function newEmployee(data) {
    db.query("INSERT INTO employee SET ?", {
        first_name: data.firstName,
        last_name: data.lastName,
        role_id: data.title,
        manager_id: data.manager
    }, function (error, res) {
        if (error) throw error;
    });
    endOrMain();
}

// Update role function
function updateRole() {
    inquirer.prompt([{
        type: "list",
        message: "Which employee is updating their role?",
        name: "employeeID",
        choices: employees
    },
    {
        type: "list",
        message: "What is the new role?",
        name: "titleID",
        choices: roles
    }
    ])
        .then(function (response) {
            updateEmployeesRole(response);
        });
};

function updateEmployeesRole(data) {
    db.query(`UPDATE employee SET role_id = ${data.titleID} WHERE id =${data.employeeID}`,
        function (error, res) {
            if (error) throw error;
        });
    endOrMain();
};

// End or back to Main functions
function endOrMain() {
    confirm("Do you want to continue?")
        .then(function confirmed() {
            initialPrompt();
        }, function cancelled() {
            end();
        });
};

function end() {
    console.log("Exiting Employee Manager");
    db.end();
    process.exit();
};