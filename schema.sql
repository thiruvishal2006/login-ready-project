CREATE DATABASE IF NOT EXISTS project_portal;
USE project_portal;

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_email VARCHAR(254) NOT NULL,
  title VARCHAR(255) NOT NULL,
  abstract TEXT NOT NULL,
  description TEXT NOT NULL,
  literature_survey TEXT NOT NULL,
  other_details TEXT,
  module_count INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX ix_projects_owner_email (owner_email)
);

CREATE TABLE IF NOT EXISTS modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  module_number INT NOT NULL,
  module_name VARCHAR(255) NOT NULL,
  module_description TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  UNIQUE KEY unique_project_module (project_id, module_number)
);
