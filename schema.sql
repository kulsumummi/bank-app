-- Banking Simulation App Schema (PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. bank_users table
CREATE TABLE bank_users (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 10000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. user_tokens table
CREATE TABLE user_tokens (
    token_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_value TEXT NOT NULL,
    customer_id UUID NOT NULL REFERENCES bank_users(customer_id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX idx_users_email ON bank_users(email);
CREATE INDEX idx_tokens_customer ON user_tokens(customer_id);
CREATE INDEX idx_tokens_value ON user_tokens(token_value);
