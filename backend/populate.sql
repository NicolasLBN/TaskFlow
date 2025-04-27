-- Insérer les utilisateurs dans la table "users"
INSERT INTO users (username, password) VALUES ('alice', '$2b$12$eImiTXuWVxfM37uY4JANjQe5Cj1pLz1H7d3Tz5a3z5a3z5a3z5a3z');
INSERT INTO users (username, password) VALUES ('bob', '$2b$12$eImiTXuWVxfM37uY4JANjQe5Cj1pLz1H7d3Tz5a3z5a3z5a3z5a3z');
INSERT INTO users (username, password) VALUES ('tiako', '$2b$12$eImiTXuWVxfM37uY4JANjQe5Cj1pLz1H7d3Tz5a3z5a3z5a3z5a3z');
INSERT INTO users (username, password) VALUES ('dej', '$2b$12$eImiTXuWVxfM37uY4JANjQe5Cj1pLz1H7d3Tz5a3z5a3z5a3z5a3z');
INSERT INTO users (username, password) VALUES ('luana', '$2b$12$eImiTXuWVxfM37uY4JANjQe5Cj1pLz1H7d3Tz5a3z5a3z5a3z5a3z');

-- Insérer les projets dans la table "projects"
INSERT INTO projects (name, description) VALUES ('optijet', 'A machine that lays cable');
INSERT INTO projects (name, description) VALUES ('mp100', 'A standard HMI for multiple cable laying machines');

-- Associer les utilisateurs aux projets dans la table "user_projects"
-- Projet "optijet"
INSERT INTO user_projects (user_id, project_id) VALUES (1, 1); -- Alice dans optijet
INSERT INTO user_projects (user_id, project_id) VALUES (2, 1); -- Bob dans optijet
INSERT INTO user_projects (user_id, project_id) VALUES (3, 1); -- Tiako dans optijet

-- Projet "mp100"
INSERT INTO user_projects (user_id, project_id) VALUES (4, 2); -- Dej dans mp100
INSERT INTO user_projects (user_id, project_id) VALUES (5, 2); -- Luana dans mp100

-- Ajouter des tâches pour le projet "optijet"
INSERT INTO tasks (project_id, title, description, status, assigned_user_id, created_by, created_date, modified_date)
VALUES (1, 'Task 1 for Optijet', 'Description for Task 1', 'To Do', 1, 1, '2023-04-01T10:00:00Z', '2023-04-01T10:00:00Z');
INSERT INTO tasks (project_id, title, description, status, assigned_user_id, created_by, created_date, modified_date)
VALUES (1, 'Task 2 for Optijet', 'Description for Task 2', 'In Progress', 2, 1, '2023-04-02T11:00:00Z', '2023-04-02T11:00:00Z');
INSERT INTO tasks (project_id, title, description, status, assigned_user_id, created_by, created_date, modified_date)
VALUES (1, 'Task 3 for Optijet', 'Description for Task 3', 'Done', 3, 1, '2023-04-03T12:00:00Z', '2023-04-03T12:00:00Z');
INSERT INTO tasks (project_id, title, description, status, assigned_user_id, created_by, created_date, modified_date)
VALUES (1, 'Task 4 for Optijet', 'Description for Task 4', 'To Do', 2, 1, '2023-04-04T13:00:00Z', '2023-04-04T13:00:00Z');
INSERT INTO tasks (project_id, title, description, status, assigned_user_id, created_by, created_date, modified_date)
VALUES (1, 'Task 5 for Optijet', 'Description for Task 5', 'In Progress', 3, 1, '2023-04-05T14:00:00Z', '2023-04-05T14:00:00Z');

-- Ajouter des tâches pour le projet "mp100"
INSERT INTO tasks (project_id, title, description, status, assigned_user_id, created_by, created_date, modified_date)
VALUES (2, 'Task 1 for MP100', 'Description for Task 1', 'To Do', 4, 4, '2023-04-01T10:00:00Z', '2023-04-01T10:00:00Z');
INSERT INTO tasks (project_id, title, description, status, assigned_user_id, created_by, created_date, modified_date)
VALUES (2, 'Task 2 for MP100', 'Description for Task 2', 'In Progress', 5, 4, '2023-04-02T11:00:00Z', '2023-04-02T11:00:00Z');
INSERT INTO tasks (project_id, title, description, status, assigned_user_id, created_by, created_date, modified_date)
VALUES (2, 'Task 3 for MP100', 'Description for Task 3', 'Done', 4, 4, '2023-04-03T12:00:00Z', '2023-04-03T12:00:00Z');
INSERT INTO tasks (project_id, title, description, status, assigned_user_id, created_by, created_date, modified_date)
VALUES (2, 'Task 4 for MP100', 'Description for Task 4', 'To Do', 5, 4, '2023-04-04T13:00:00Z', '2023-04-04T13:00:00Z');
INSERT INTO tasks (project_id, title, description, status, assigned_user_id, created_by, created_date, modified_date)
VALUES (2, 'Task 5 for MP100', 'Description for Task 5', 'In Progress', 4, 4, '2023-04-05T14:00:00Z', '2023-04-05T14:00:00Z');