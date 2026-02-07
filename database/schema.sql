-- Arts Website Database Schema
-- PostgreSQL Schema for Layatharang and Chakravyuh 2026

-- ENUMS
CREATE TYPE enm_Users_role AS ENUM ('User', 'Admin');
CREATE TYPE enm_Arts_Events_is_group AS ENUM ('Group', 'Single');
CREATE TYPE enm_Arts_Reg_Details_role AS ENUM ('participant', 'accompanist');
CREATE TYPE enm_Sports_Events_is_group AS ENUM ('Team', 'Individual');
CREATE TYPE enm_Arts_Winners_position AS ENUM ('1', '2', '3');

-- TABLE HOUSES
CREATE TABLE IF NOT EXISTS Houses (
  house_id     SERIAL PRIMARY KEY,
  house_name   VARCHAR(255) NOT NULL
);

-- TABLE USERS
CREATE TABLE IF NOT EXISTS Users (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id),
  username   VARCHAR(255) NOT NULL,
  password   VARCHAR(255),
  role       enm_Users_role NOT NULL DEFAULT 'User',
  house_id   INTEGER REFERENCES Houses(house_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE STUDENTS
CREATE TABLE IF NOT EXISTS Students (
  student_id   SERIAL PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  class        VARCHAR(50),
  year         INTEGER,
  house_id     INTEGER REFERENCES Houses(house_id),
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE ARTS_EVENTS
CREATE TABLE IF NOT EXISTS Arts_Events (
  event_id           SERIAL PRIMARY KEY,
  event_name         VARCHAR(255) NOT NULL,
  is_group           enm_Arts_Events_is_group NOT NULL,
  slots_per_house    INTEGER NOT NULL DEFAULT 1,
  max_participants   INTEGER NOT NULL DEFAULT 1,
  max_accompanists   INTEGER DEFAULT 0,
  first_pts          INTEGER NOT NULL DEFAULT 5,
  second_pts         INTEGER NOT NULL DEFAULT 3,
  third_pts          INTEGER NOT NULL DEFAULT 1,
  created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE ARTS_REGISTRATIONS
CREATE TABLE IF NOT EXISTS Arts_Registrations (
  arts_reg_id   SERIAL PRIMARY KEY,
  event_id      INTEGER REFERENCES Arts_Events(event_id),
  house_id      INTEGER REFERENCES Houses(house_id),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE ARTS_REG_DETAILS
CREATE TABLE IF NOT EXISTS Arts_Reg_Details (
  detail_id     SERIAL PRIMARY KEY,
  arts_reg_id   INTEGER REFERENCES Arts_Registrations(arts_reg_id) ON DELETE CASCADE,
  student_id    INTEGER REFERENCES Students(student_id),
  role          enm_Arts_Reg_Details_role NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE SPORTS_EVENTS
CREATE TABLE IF NOT EXISTS Sports_Events (
  event_id           SERIAL PRIMARY KEY,
  event_name         VARCHAR(255) NOT NULL,
  is_group           enm_Sports_Events_is_group NOT NULL,
  slots_per_house    INTEGER NOT NULL DEFAULT 1,
  max_participants   INTEGER NOT NULL DEFAULT 1,
  first_pts          INTEGER NOT NULL DEFAULT 5,
  second_pts         INTEGER NOT NULL DEFAULT 3,
  third_pts          INTEGER NOT NULL DEFAULT 1,
  created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE SPORTS_REGISTRATIONS
CREATE TABLE IF NOT EXISTS Sports_Registrations (
  sports_reg_id   SERIAL PRIMARY KEY,
  event_id        INTEGER REFERENCES Sports_Events(event_id),
  house_id        INTEGER REFERENCES Houses(house_id),
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE SPORTS_REG_DETAILS
CREATE TABLE IF NOT EXISTS Sports_Reg_Details (
  detail_id       SERIAL PRIMARY KEY,
  sports_reg_id   INTEGER REFERENCES Sports_Registrations(sports_reg_id) ON DELETE CASCADE,
  student_id      INTEGER REFERENCES Students(student_id),
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE ARTS_WINNERS
CREATE TABLE IF NOT EXISTS Arts_Winners (
  winner_id     SERIAL PRIMARY KEY,
  event_id      INTEGER REFERENCES Arts_Events(event_id),
  arts_reg_id   INTEGER REFERENCES Arts_Registrations(arts_reg_id),
  position      enm_Arts_Winners_position NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE SPORTS_WINNERS
CREATE TABLE IF NOT EXISTS Sports_Winners (
  winner_id       SERIAL PRIMARY KEY,
  event_id        INTEGER REFERENCES Sports_Events(event_id),
  sports_reg_id   INTEGER REFERENCES Sports_Registrations(sports_reg_id),
  position        INTEGER NOT NULL CHECK (position IN (1, 2, 3)),
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE Houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE Users ENABLE ROW LEVEL SECURITY;
ALTER TABLE Students ENABLE ROW LEVEL SECURITY;
ALTER TABLE Arts_Events ENABLE ROW LEVEL SECURITY;
ALTER TABLE Arts_Registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE Arts_Reg_Details ENABLE ROW LEVEL SECURITY;
ALTER TABLE Sports_Events ENABLE ROW LEVEL SECURITY;
ALTER TABLE Sports_Registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE Sports_Reg_Details ENABLE ROW LEVEL SECURITY;
ALTER TABLE Arts_Winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE Sports_Winners ENABLE ROW LEVEL SECURITY;

-- Policies for Houses (Public Read, Admin Write)
CREATE POLICY "Public can view houses" ON Houses FOR SELECT USING (true);
CREATE POLICY "Admins can insert houses" ON Houses FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM Users WHERE user_id = auth.uid() AND role = 'Admin'
  ));

-- Policies for Users (Users can see themselves, Admins can see all)
CREATE POLICY "Users can view themselves" ON Users FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all users" ON Users FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM Users WHERE user_id = auth.uid() AND role = 'Admin'
  ));

-- Policies for Students (House captains see their house, Admins see all)
CREATE POLICY "Captains can view their house students" ON Students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM Users 
      WHERE user_id = auth.uid() 
      AND (role = 'Admin' OR house_id = Students.house_id)
    )
  );

-- Policies for Events (Public Read, Admin Write)
CREATE POLICY "Public can view arts events" ON Arts_Events FOR SELECT USING (true);
CREATE POLICY "Admins can manage arts events" ON Arts_Events FOR ALL
  WITH CHECK (EXISTS (
    SELECT 1 FROM Users WHERE user_id = auth.uid() AND role = 'Admin'
  ));

CREATE POLICY "Public can view sports events" ON Sports_Events FOR SELECT USING (true);
CREATE POLICY "Admins can manage sports events" ON Sports_Events FOR ALL
  WITH CHECK (EXISTS (
    SELECT 1 FROM Users WHERE user_id = auth.uid() AND role = 'Admin'
  ));

-- Policies for Registrations (House captains for their house, Admins all)
CREATE POLICY "Users can view their house arts registrations" ON Arts_Registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM Users 
      WHERE user_id = auth.uid() 
      AND (role = 'Admin' OR house_id = Arts_Registrations.house_id)
    )
  );

CREATE POLICY "Captains can insert arts registrations for their house" ON Arts_Registrations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM Users 
      WHERE user_id = auth.uid() 
      AND house_id = Arts_Registrations.house_id
    )
  );

CREATE POLICY "Users can view their house sports registrations" ON Sports_Registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM Users 
      WHERE user_id = auth.uid() 
      AND (role = 'Admin' OR house_id = Sports_Registrations.house_id)
    )
  );

CREATE POLICY "Captains can insert sports registrations for their house" ON Sports_Registrations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM Users 
      WHERE user_id = auth.uid() 
      AND house_id = Sports_Registrations.house_id
    )
  );

-- Policies for Registration Details
CREATE POLICY "Users can view arts reg details" ON Arts_Reg_Details FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM Arts_Registrations ar
      JOIN Users u ON (u.role = 'Admin' OR u.house_id = ar.house_id)
      WHERE ar.arts_reg_id = Arts_Reg_Details.arts_reg_id
      AND u.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert arts reg details" ON Arts_Reg_Details FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM Arts_Registrations ar
      JOIN Users u ON u.house_id = ar.house_id
      WHERE ar.arts_reg_id = Arts_Reg_Details.arts_reg_id
      AND u.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view sports reg details" ON Sports_Reg_Details FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM Sports_Registrations sr
      JOIN Users u ON (u.role = 'Admin' OR u.house_id = sr.house_id)
      WHERE sr.sports_reg_id = Sports_Reg_Details.sports_reg_id
      AND u.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert sports reg details" ON Sports_Reg_Details FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM Sports_Registrations sr
      JOIN Users u ON u.house_id = sr.house_id
      WHERE sr.sports_reg_id = Sports_Reg_Details.sports_reg_id
      AND u.user_id = auth.uid()
    )
  );

-- Policies for Winners (Public Read, Admin Write)
CREATE POLICY "Public can view arts winners" ON Arts_Winners FOR SELECT USING (true);
CREATE POLICY "Admins can manage arts winners" ON Arts_Winners FOR ALL
  WITH CHECK (EXISTS (
    SELECT 1 FROM Users WHERE user_id = auth.uid() AND role = 'Admin'
  ));

CREATE POLICY "Public can view sports winners" ON Sports_Winners FOR SELECT USING (true);
CREATE POLICY "Admins can manage sports winners" ON Sports_Winners FOR ALL
  WITH CHECK (EXISTS (
    SELECT 1 FROM Users WHERE user_id = auth.uid() AND role = 'Admin'
  ));
