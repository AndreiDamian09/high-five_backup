-- ============================================
-- INIT.SQL - Sistem de Matching CV-uri & Joburi
-- ============================================

-- Creare extensie pentru UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
create EXTENSION IF NOT EXISTS vector;

-- ============================================
-- ENUM TYPES
-- ============================================

-- Tipuri de utilizatori
CREATE TYPE user_role AS ENUM ('candidate', 'employer', 'admin');

-- Status aplicație/match
CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');

-- Status job
CREATE TYPE job_status AS ENUM ('active', 'paused', 'closed', 'draft');

-- Industrii disponibile
CREATE TYPE industry_type AS ENUM (
    'IT & Software',
    'Medicină & Sănătate',
    'Educație',
    'Financiar & Contabilitate',
    'Juridic',
    'Inginerie & Construcții',
    'Resurse Umane',
    'Design & Creativitate',
    'Logistică & Transport',
    'Vânzări & Marketing',
    'Horeca & Turism',
    'Auto & Mecanică',
    'Imobiliare',
    'Agricultură & Zootehnie',
    'Administrativ & Secretariat',
    'Client Service & Support',
    'Beauty & Wellness',
    'Securitate & Pază'
);

-- ============================================
-- TABELE PRINCIPALE
-- ============================================

-- Tabel Utilizatori (baza pentru autentificare)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'candidate',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Candidați (profil extins pentru cei care caută job)
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'România',
    date_of_birth DATE,
    profile_picture_url TEXT,
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    about_me TEXT,
    experience_years INTEGER DEFAULT 0,
    education TEXT,
    preferred_industries industry_type[],
    preferred_locations VARCHAR(100)[],
    expected_salary_min INTEGER,
    expected_salary_max INTEGER,
    available_from DATE,
    is_open_to_work BOOLEAN DEFAULT true,
    cv_raw_text TEXT, -- Text extras din CV-ul uploadat
    embedding VECTOR(1536), -- Pentru semantic search (OpenAI embeddings)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Angajatori/Companii
CREATE TABLE employers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_description TEXT,
    industry industry_type,
    company_size VARCHAR(50), -- '1-10', '11-50', '51-200', '201-500', '500+'
    website_url VARCHAR(500),
    logo_url TEXT,
    headquarters_city VARCHAR(100),
    headquarters_country VARCHAR(100) DEFAULT 'România',
    founded_year INTEGER,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    is_verified_company BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Skills (normalizat)
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100), -- 'programming', 'soft-skill', 'tool', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Skills pentru Candidați (many-to-many)
CREATE TABLE candidate_skills (
    id SERIAL PRIMARY KEY,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level INTEGER CHECK (proficiency_level >= 1 AND proficiency_level <= 5), -- 1=începător, 5=expert
    years_experience INTEGER DEFAULT 0,
    UNIQUE(candidate_id, skill_id)
);

-- Tabel Experiență Profesională
CREATE TABLE work_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    location VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE, -- NULL înseamnă job curent
    is_current BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Educație
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    institution_name VARCHAR(255) NOT NULL,
    degree VARCHAR(255),
    field_of_study VARCHAR(255),
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    grade VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Joburi
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    industry industry_type,
    location VARCHAR(100),
    is_remote BOOLEAN DEFAULT false,
    job_type VARCHAR(50) DEFAULT 'full-time', -- 'full-time', 'part-time', 'contract', 'internship'
    experience_level VARCHAR(50), -- 'entry', 'junior', 'mid', 'senior', 'lead'
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(10) DEFAULT 'RON',
    benefits TEXT[],
    status job_status DEFAULT 'active',
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    embedding VECTOR(1536), -- Pentru semantic search
    expires_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Skills cerute pentru Joburi (many-to-many)
CREATE TABLE job_skills (
    id SERIAL PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT true, -- true = obligatoriu, false = nice-to-have
    min_proficiency INTEGER CHECK (min_proficiency >= 1 AND min_proficiency <= 5),
    UNIQUE(job_id, skill_id)
);

-- Tabel Aplicări la Joburi
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    cover_letter TEXT,
    cv_snapshot TEXT, -- Snapshot al CV-ului la momentul aplicării
    status application_status DEFAULT 'pending',
    match_score DECIMAL(5,2), -- Scor de matching 0-100
    employer_notes TEXT,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, candidate_id)
);

-- Tabel Matches (rezultate matching automat)
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    match_score DECIMAL(5,2) NOT NULL, -- Scor de matching 0-100
    match_reasons JSONB, -- Detalii despre ce a contribuit la scor
    is_notified_candidate BOOLEAN DEFAULT false,
    is_notified_employer BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, candidate_id)
);

-- Tabel Salvări/Favorite
CREATE TABLE saved_jobs (
    id SERIAL PRIMARY KEY,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(candidate_id, job_id)
);

CREATE TABLE saved_candidates (
    id SERIAL PRIMARY KEY,
    employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employer_id, candidate_id)
);

-- Tabel Notificări
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'new_match', 'application_update', 'job_viewed', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Audit Log (pentru Admin)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXURI
-- ============================================

-- Indexuri pentru căutări rapide
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_candidates_user_id ON candidates(user_id);
CREATE INDEX idx_candidates_city ON candidates(city);
CREATE INDEX idx_candidates_is_open ON candidates(is_open_to_work);
CREATE INDEX idx_employers_user_id ON employers(user_id);
CREATE INDEX idx_employers_industry ON employers(industry);
CREATE INDEX idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_industry ON jobs(industry);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_matches_job_id ON matches(job_id);
CREATE INDEX idx_matches_candidate_id ON matches(candidate_id);
CREATE INDEX idx_matches_score ON matches(match_score DESC);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ============================================
-- FUNCȚII ȘI TRIGGERE
-- ============================================

-- Funcție pentru actualizare automată a updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggere pentru updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employers_updated_at BEFORE UPDATE ON employers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Funcție pentru incrementare număr aplicări la job
CREATE OR REPLACE FUNCTION increment_applications_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE jobs SET applications_count = applications_count + 1 WHERE id = NEW.job_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_increment_applications AFTER INSERT ON applications
    FOR EACH ROW EXECUTE FUNCTION increment_applications_count();

-- ============================================
-- DATE INIȚIALE
-- ============================================

-- Inserare skills comune
INSERT INTO skills (name, category) VALUES
    -- IT & Programming
    ('JavaScript', 'programming'),
    ('TypeScript', 'programming'),
    ('Python', 'programming'),
    ('Java', 'programming'),
    ('C#', 'programming'),
    ('C++', 'programming'),
    ('React', 'framework'),
    ('Node.js', 'framework'),
    ('Angular', 'framework'),
    ('Vue.js', 'framework'),
    ('Django', 'framework'),
    ('MongoDB', 'database'),
    ('PostgreSQL', 'database'),
    ('MySQL', 'database'),
    ('Docker', 'tool'),
    ('AWS', 'cloud'),
    ('Git', 'tool'),
    ('Selenium', 'testing'),
    ('Manual Testing', 'testing'),
    ('Jira', 'tool'),
    -- Office & Business
    ('Microsoft Office', 'tool'),
    ('Excel', 'tool'),
    ('PowerPoint', 'tool'),
    ('SAP', 'erp'),
    ('SAGA C', 'accounting'),
    -- Soft Skills
    ('Comunicare', 'soft-skill'),
    ('Leadership', 'soft-skill'),
    ('Negociere', 'soft-skill'),
    ('Lucru în echipă', 'soft-skill'),
    ('Creativitate', 'soft-skill'),
    ('Organizare', 'soft-skill'),
    -- Languages
    ('Limba Engleză', 'language'),
    ('Limba Franceză', 'language'),
    ('Limba Germană', 'language'),
    -- Specific Industries
    ('Contabilitate', 'finance'),
    ('Audit', 'finance'),
    ('Recrutare', 'hr'),
    ('Salarizare', 'hr'),
    ('Revisal', 'hr'),
    ('Drept Comercial', 'legal'),
    ('Drept Civil', 'legal'),
    ('AutoCAD', 'design'),
    ('Adobe Photoshop', 'design'),
    ('Adobe Illustrator', 'design'),
    ('Canva', 'design'),
    ('Permis B', 'license'),
    ('Permis C', 'license'),
    ('Permis C+E', 'license'),
    ('HACCP', 'certification'),
    ('Atestat Pază', 'certification')
ON CONFLICT (name) DO NOTHING;

-- Inserare Admin implicit (parola: admin123 - trebuie schimbată!)
INSERT INTO users (email, password_hash, role, is_active, is_verified)
VALUES (
    'admin@matchingsystem.ro',
    crypt('admin123', gen_salt('bf')),
    'admin',
    true,
    true
);

-- ============================================
-- GRANT PERMISSIONS (ajustează după necesități)
-- ============================================

-- Exemplu pentru un user de aplicație
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
