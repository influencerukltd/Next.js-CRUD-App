-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create angajat (employees) table
CREATE TABLE IF NOT EXISTS angajat (
  id_angajat SERIAL PRIMARY KEY,
  nume VARCHAR(45) NOT NULL,
  prenume VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  departament VARCHAR(100) NOT NULL
);

-- Create curs (courses) table
CREATE TABLE IF NOT EXISTS curs (
  id_curs SERIAL PRIMARY KEY,
  nume VARCHAR(45) NOT NULL,
  durata INT NOT NULL,
  pret INT NOT NULL
);

-- Create inscriere (enrollments) table
CREATE TABLE IF NOT EXISTS inscriere (
  id_inscriere SERIAL PRIMARY KEY,
  id_angajat INT NOT NULL,
  id_curs INT NOT NULL,
  data_inscriere TIMESTAMP NOT NULL,
  stadiu VARCHAR(45) NOT NULL,
  CONSTRAINT id_angajat FOREIGN KEY (id_angajat) REFERENCES angajat(id_angajat) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT id_curs FOREIGN KEY (id_curs) REFERENCES curs(id_curs) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Create indexes for inscriere table
CREATE INDEX IF NOT EXISTS id_angajat_idx ON inscriere(id_angajat);
CREATE INDEX IF NOT EXISTS id_curs_idx ON inscriere(id_curs);
