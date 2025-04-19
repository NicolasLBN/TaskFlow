-- Insert sample users
INSERT INTO users (username, password) VALUES
('john_doe', '$2b$12$eImiTXuWVxfM37uY4JANjQe5Jx1g1zZ1zQe5Jx1g1zZ1zQe5Jx1g1z'), -- hashed password: "password123"
('jane_smith', '$2b$12$eImiTXuWVxfM37uY4JANjQe5Jx1g1zZ1zQe5Jx1g1zZ1zQe5Jx1g1z'), -- hashed password: "password123"
('alice_wonder', '$2b$12$eImiTXuWVxfM37uY4JANjQe5Jx1g1zZ1zQe5Jx1g1zZ1zQe5Jx1g1z'); -- hashed password: "password123"

-- Insert sample projects
INSERT INTO projects (name, description) VALUES
('Project A', 'Description for Project A'),
('Project B', 'Description for Project B'),
('Project C', 'Description for Project C');

-- Assign users to projects (many-to-many relationship)
INSERT INTO user_projects (user_id, project_id) VALUES
(1, 1), -- John Doe is assigned to Project A
(1, 2), -- John Doe is assigned to Project B
(2, 1), -- Jane Smith is assigned to Project A
(3, 3); -- Alice Wonder is assigned to Project C

-- Insert sample tasks
INSERT INTO tasks (title, description, status, user_id, project_id) VALUES
('Task 1', 'Description for Task 1', 'To Do', 1, 1), -- Task for John Doe in Project A
('Task 2', 'Description for Task 2', 'In Progress', 1, 2), -- Task for John Doe in Project B
('Task 3', 'Description for Task 3', 'Done', 2, 1), -- Task for Jane Smith in Project A
('Task 4', 'Description for Task 4', 'To Do', 3, 3); -- Task for Alice Wonder in Project C