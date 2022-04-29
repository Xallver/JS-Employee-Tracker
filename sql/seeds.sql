USE employee_db;

INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Manager', 100000, 1),
    ('Sales Lead', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES
    ('Jim', 'Beam', 1, 'Ainsley Crume'),
    ('Tito', 'Chan', 2, 'Jim Beam'),
    ('Ainsley', 'Crume', 3, null),
    ('Kevin', 'Tupik', 4, 'Ainsley Crume'),
    ('Malia', 'Brown', 5, null),
    ('Buddy', 'Guy', 6, null),
    ('Tom', 'Allen', 7, 'Buddy Guy');
