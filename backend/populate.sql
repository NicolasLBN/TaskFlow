
-- Insérer les utilisateurs dans la table "users"
INSERT INTO users (username, password) VALUES ('alice', '$2b$12$eImiTXuWVxfM37uY4JANjQe5Cj1pLz1H7d3Tz5a3z5a3z5a3z5a3z');
INSERT INTO users (username, password) VALUES ('bob', '$2b$12$eImiTXuWVxfM37uY4JANjQe5Cj1pLz1H7d3Tz5a3z5a3z5a3z5a3z');
INSERT INTO users (username, password) VALUES ('tiako', '$2b$12$eImiTXuWVxfM37uY4JANjQe5Cj1pLz1H7d3Tz5a3z5a3z5a3z5a3z');
INSERT INTO users (username, password) VALUES ('dej', '$2b$12$eImiTXuWVxfM37uY4JANjQe5Cj1pLz1H7d3Tz5a3z5a3z5a3z5a3z');
INSERT INTO users (username, password) VALUES ('luana', '$2b$12$eImiTXuWVxfM37uY4JANjQe5Cj1pLz1H7d3Tz5a3z5a3z5a3z5a3z');

-- Insérer les projets dans la table "projects"
INSERT INTO projects (name, description) VALUES ('optijet', 'Project for Alice, Bob, and Tiako');
INSERT INTO projects (name, description) VALUES ('mp100', 'Project for Dej and Luana');

-- Associer les utilisateurs aux projets dans la table "user_projects"
-- Projet "optijet"
INSERT INTO user_projects (user_id, project_id) VALUES (1, 1); -- Alice dans optijet
INSERT INTO user_projects (user_id, project_id) VALUES (2, 1); -- Bob dans optijet
INSERT INTO user_projects (user_id, project_id) VALUES (3, 1); -- Tiako dans optijet

-- Projet "mp100"
INSERT INTO user_projects (user_id, project_id) VALUES (4, 2); -- Dej dans mp100
INSERT INTO user_projects (user_id, project_id) VALUES (5, 2); -- Luana dans mp100s