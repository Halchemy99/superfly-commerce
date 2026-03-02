# Database Setup Implementation Guide

## Overview
Set up a comprehensive PostgreSQL database schema for the Superfly Commerce website, including all tables, relationships, and indexes needed for full functionality.

## Current Status
- ✅ Database references in code
- ✅ Schema outlined in various components
- ❌ No actual database implementation
- ❌ No migrations system
- ❌ No database connection setup

## Recommended Database: PostgreSQL

### Why PostgreSQL?
- **JSON Support**: Native JSONB for flexible data storage
- **Reliability**: ACID compliance and data integrity
- **Scalability**: Handles growth well
- **Extensions**: Rich ecosystem of extensions
- **Free**: Open source with no licensing costs

## Database Setup

### 1. Environment Variables
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/superflycommerce
DB_HOST=localhost
DB_PORT=5432
DB_NAME=superflycommerce
DB_USER=superflycommerce_user
DB_PASSWORD=your_secure_password

# For production
DATABASE_SSL=true
DB_POOL_MIN=2
DB_POOL_MAX=10
```

### 2. Database Connection Setup
```javascript
// config/database.js
const { Pool } = require('pg');
const { Sequelize } = require('sequelize');

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: parseInt(process.env.DB_POOL_MAX) || 10,
  min: parseInt(process.env.DB_POOL_MIN) || 2,
  idle: 10000,
  connectionTimeoutMillis: 5000,
});

// Sequelize ORM setup
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  ssl: process.env.NODE_ENV === 'production',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = { pool, sequelize };
```

### 3. Complete Database Schema

#### Migration Files Structure
```
migrations/
├── 001_create_admin_users.sql
├── 002_create_contacts.sql
├── 003_create_orders.sql
├── 004_create_sustainability_verifications.sql
├── 005_create_newsletter_subscribers.sql
├── 006_create_verified_clients.sql
├── 007_create_email_events.sql
├── 008_create_indexes.sql
└── 009_create_triggers.sql
```

#### 001_create_admin_users.sql
```sql
-- Admin Users Table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin Sessions Table
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create default admin user (password: admin123 - CHANGE IN PRODUCTION!)
INSERT INTO admin_users (email, password_hash, name, role) VALUES 
('harry@superflycommerce.com', '$2b$10$rQZ8kHWfQxwjQjwjQjwjQOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', 'Harry Admin', 'super_admin');
```

#### 002_create_contacts.sql
```sql
-- Contacts Table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  revenue VARCHAR(100),
  service VARCHAR(255),
  message TEXT,
  type VARCHAR(50) DEFAULT 'contact' CHECK (type IN ('contact', 'documentation_help', 'tiktok_beta', 'quote_request')),
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
  source VARCHAR(100) DEFAULT 'website',
  admin_notes TEXT,
  follow_up_date DATE,
  hubspot_contact_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documentation Help Requests (extends contacts)
CREATE TABLE documentation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  current_level INTEGER CHECK (current_level BETWEEN 1 AND 4),
  target_level INTEGER CHECK (target_level BETWEEN 1 AND 4),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  estimated_cost DECIMAL(10,2),
  completion_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 003_create_orders.sql
```sql
-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_payment_intent_id VARCHAR(255),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  phone VARCHAR(50),
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GBP',
  sustainability_level INTEGER DEFAULT 1 CHECK (sustainability_level BETWEEN 1 AND 4),
  sustainability_discount DECIMAL(5,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  fulfillment_status VARCHAR(50) DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'in_progress', 'completed')),
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Items Table (normalized)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  service_id VARCHAR(100) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  metadata JSONB
);

-- Order Status History
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  changed_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 004_create_sustainability_verifications.sql
```sql
-- Sustainability Verifications Table
CREATE TABLE sustainability_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  target_level INTEGER NOT NULL CHECK (target_level BETWEEN 2 AND 4),
  approved_level INTEGER CHECK (approved_level BETWEEN 1 AND 4),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'expired')),
  admin_notes TEXT,
  rejection_reason TEXT,
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Verification Documents Table
CREATE TABLE verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id UUID REFERENCES sustainability_verifications(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  s3_key VARCHAR(500) NOT NULL,
  s3_bucket VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  mimetype VARCHAR(100) NOT NULL,
  is_processed BOOLEAN DEFAULT false,
  virus_scan_status VARCHAR(50) DEFAULT 'pending',
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Verified Clients Table
CREATE TABLE verified_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 4),
  verification_id UUID REFERENCES sustainability_verifications(id),
  verified_date TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 005_create_newsletter_subscribers.sql
```sql
-- Newsletter Subscribers Table
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced', 'complained')),
  source VARCHAR(100) DEFAULT 'website',
  preferences JSONB DEFAULT '{}',
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  last_email_sent TIMESTAMP,
  email_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Newsletter Campaigns Table
CREATE TABLE newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  recipient_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 006_create_email_events.sql
```sql
-- Email Events Table (for tracking)
CREATE TABLE email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('delivered', 'opened', 'clicked', 'bounced', 'dropped', 'unsubscribed', 'complained')),
  message_id VARCHAR(255),
  campaign_id UUID REFERENCES newsletter_campaigns(id),
  timestamp TIMESTAMP NOT NULL,
  reason TEXT,
  url TEXT,
  user_agent TEXT,
  ip_address INET,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Email Templates Table
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  subject VARCHAR(255) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  template_type VARCHAR(50) NOT NULL CHECK (template_type IN ('transactional', 'marketing', 'system')),
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 007_create_system_tables.sql
```sql
-- System Settings Table
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit Log Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  changed_by VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- API Keys Table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) UNIQUE NOT NULL,
  permissions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  last_used TIMESTAMP,
  expires_at TIMESTAMP,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 008_create_indexes.sql
```sql
-- Performance Indexes

-- Contacts
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX idx_contacts_type ON contacts(type);

-- Orders
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_stripe_session_id ON orders(stripe_session_id);

-- Sustainability Verifications
CREATE INDEX idx_verifications_email ON sustainability_verifications(email);
CREATE INDEX idx_verifications_status ON sustainability_verifications(status);
CREATE INDEX idx_verifications_created_at ON sustainability_verifications(created_at DESC);

-- Verified Clients
CREATE INDEX idx_verified_clients_email ON verified_clients(email);
CREATE INDEX idx_verified_clients_level ON verified_clients(level);
CREATE INDEX idx_verified_clients_active ON verified_clients(is_active);

-- Newsletter
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);

-- Email Events
CREATE INDEX idx_email_events_email ON email_events(email);
CREATE INDEX idx_email_events_type ON email_events(event_type);
CREATE INDEX idx_email_events_timestamp ON email_events(timestamp DESC);

-- Admin
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Audit Logs
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

#### 009_create_triggers.sql
```sql
-- Automatic Updated At Triggers

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verifications_updated_at BEFORE UPDATE ON sustainability_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verified_clients_updated_at BEFORE UPDATE ON verified_clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_updated_at BEFORE UPDATE ON newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit Log Trigger
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (table_name, record_id, action, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to important tables
CREATE TRIGGER audit_contacts AFTER INSERT OR UPDATE OR DELETE ON contacts FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_orders AFTER INSERT OR UPDATE OR DELETE ON orders FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_verified_clients AFTER INSERT OR UPDATE OR DELETE ON verified_clients FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

### 4. Database Migration System

#### Migration Runner
```javascript
// scripts/migrate.js
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

class MigrationRunner {
  constructor() {
    this.migrationsPath = path.join(__dirname, '../migrations');
  }

  async createMigrationsTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await pool.query(query);
  }

  async getExecutedMigrations() {
    const result = await pool.query('SELECT filename FROM migrations ORDER BY id');
    return result.rows.map(row => row.filename);
  }

  async getMigrationFiles() {
    const files = fs.readdirSync(this.migrationsPath)
      .filter(file => file.endsWith('.sql'))
      .sort();
    return files;
  }

  async executeMigration(filename) {
    const filePath = path.join(this.migrationsPath, filename);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    console.log(`Executing migration: ${filename}`);
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO migrations (filename) VALUES ($1)', [filename]);
      await client.query('COMMIT');
      console.log(`✅ Migration completed: ${filename}`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`❌ Migration failed: ${filename}`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  async runMigrations() {
    await this.createMigrationsTable();
    
    const executedMigrations = await this.getExecutedMigrations();
    const migrationFiles = await this.getMigrationFiles();
    
    const pendingMigrations = migrationFiles.filter(
      file => !executedMigrations.includes(file)
    );

    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }

    console.log(`📦 Running ${pendingMigrations.length} migrations...`);
    
    for (const migration of pendingMigrations) {
      await this.executeMigration(migration);
    }
    
    console.log('🎉 All migrations completed successfully!');
  }
}

// Run migrations if called directly
if (require.main === module) {
  const runner = new MigrationRunner();
  runner.runMigrations()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = MigrationRunner;
```

### 5. Database Models (Sequelize)

#### Base Model Setup
```javascript
// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Import all models
const Contact = require('./Contact')(sequelize, DataTypes);
const Order = require('./Order')(sequelize, DataTypes);
const SustainabilityVerification = require('./SustainabilityVerification')(sequelize, DataTypes);
const VerifiedClient = require('./VerifiedClient')(sequelize, DataTypes);
const NewsletterSubscriber = require('./NewsletterSubscriber')(sequelize, DataTypes);
const AdminUser = require('./AdminUser')(sequelize, DataTypes);

// Define associations
Contact.hasMany(DocumentationRequest, { foreignKey: 'contact_id', as: 'documentationRequests' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
SustainabilityVerification.hasMany(VerificationDocument, { foreignKey: 'verification_id', as: 'documents' });

const db = {
  sequelize,
  Sequelize,
  Contact,
  Order,
  SustainabilityVerification,
  VerifiedClient,
  NewsletterSubscriber,
  AdminUser
};

module.exports = db;
```

### 6. Database Seeding

#### Seed Data
```javascript
// scripts/seed.js
const db = require('../models');

const seedData = async () => {
  try {
    // Create default admin user
    await db.AdminUser.findOrCreate({
      where: { email: 'harry@superflycommerce.com' },
      defaults: {
        name: 'Harry Admin',
        password_hash: '$2b$10$rQZ8kHWfQxwjQjwjQjwjQOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', // admin123
        role: 'super_admin'
      }
    });

    // Create system settings
    const settings = [
      { key: 'site_name', value: 'Superfly Commerce', description: 'Website name' },
      { key: 'contact_email', value: 'harry@superflycommerce.com', description: 'Main contact email' },
      { key: 'stripe_webhook_secret', value: '', description: 'Stripe webhook secret' },
      { key: 'maintenance_mode', value: 'false', type: 'boolean', description: 'Maintenance mode toggle' }
    ];

    for (const setting of settings) {
      await db.SystemSetting.findOrCreate({
        where: { key: setting.key },
        defaults: setting
      });
    }

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedData;
```

## Implementation Checklist
- [ ] Set up PostgreSQL database
- [ ] Configure database connection
- [ ] Create all migration files
- [ ] Set up migration runner system
- [ ] Create Sequelize models
- [ ] Set up database seeding
- [ ] Create database backup strategy
- [ ] Set up monitoring and logging
- [ ] Configure connection pooling
- [ ] Test all database operations
- [ ] Set up database indexes for performance
- [ ] Configure database security (SSL, users, permissions)