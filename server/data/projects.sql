
CREATE TABLE users (
    -- UUID字符串作为主键
    id CHAR(36) NOT NULL PRIMARY KEY,             
    username VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(128) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'user',
    status VARCHAR(16) NOT NULL DEFAULT 'pending',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE projects (
    -- 自增主键
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,     
    -- 业务ID，即你的字符串ID   
    p_id VARCHAR(32) NOT NULL UNIQUE,                
    address VARCHAR(128),
    city VARCHAR(64),
    zipcode VARCHAR(16),
    year VARCHAR(8),
    insurance VARCHAR(64),
    type VARCHAR(32),
    company VARCHAR(64),
    referrer VARCHAR(64),
    manager VARCHAR(64),
    start DATETIME,
    end DATETIME
);


CREATE TABLE project_progress (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    p_id VARCHAR(32) NOT NULL,
    arol BOOLEAN,
    test BOOLEAN,
    pak_active BOOLEAN,
    pak_start_date DATE,
    pak_pout BOOLEAN,
    pak_pack BOOLEAN,
    pak_estimate_send BOOLEAN,
    pak_estimate_send_amount DECIMAL(12,2),
    pak_estimate_review BOOLEAN,
    pak_estimate_review_amount DECIMAL(12,2),
    pak_estimate_agree BOOLEAN,
    pak_estimate_agree_amount DECIMAL(12,2),

    wtr_active BOOLEAN,
    wtr_start_date DATE,
    wtr_ctrc BOOLEAN,
    wtr_demo BOOLEAN,
    wtr_itel BOOLEAN,
    wtr_eq BOOLEAN,
    wtr_pick BOOLEAN,
    wtr_estimate_send BOOLEAN,
    wtr_estimate_send_amount DECIMAL(12,2),
    wtr_estimate_review BOOLEAN,
    wtr_estimate_review_amount DECIMAL(12,2),
    wtr_estimate_agree BOOLEAN,
    wtr_estimate_agree_amount DECIMAL(12,2),

    str_active BOOLEAN,
    str_start_date DATE,
    str_ctrc BOOLEAN,
    str_estimate_send BOOLEAN,
    str_estimate_send_amount DECIMAL(12,2),
    str_estimate_review BOOLEAN,
    str_estimate_review_amount DECIMAL(12,2),
    str_estimate_agree BOOLEAN,
    str_estimate_agree_amount DECIMAL(12,2),

    payment DECIMAL(12,2),
    comments VARCHAR(255),
    CONSTRAINT fk_projects FOREIGN KEY (p_id) REFERENCES projects(p_id)
);
