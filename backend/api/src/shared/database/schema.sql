-- Biogrix schema for Supabase (PostgreSQL)
-- snake_case, plural tables, id primary key, created_at, updated_at

-- Villages
CREATE TABLE IF NOT EXISTS villages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plants
CREATE TABLE IF NOT EXISTS plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  village_id UUID REFERENCES villages(id) ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_plants_village_id ON plants(village_id);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  village_id UUID REFERENCES villages(id) ON DELETE RESTRICT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_customers_village_id ON customers(village_id);

-- Meters
CREATE TABLE IF NOT EXISTS meters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
  meter_number VARCHAR(100) NOT NULL,
  status VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_meters_customer_id ON meters(customer_id);

-- Gas usage
CREATE TABLE IF NOT EXISTS gas_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meter_id UUID REFERENCES meters(id) ON DELETE RESTRICT,
  reading_date DATE NOT NULL,
  reading_value NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_gas_usage_meter_id ON gas_usage(meter_id);

-- Bills
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  status VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_bills_customer_id ON bills(customer_id);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID REFERENCES bills(id) ON DELETE RESTRICT,
  amount NUMERIC(12, 2) NOT NULL,
  payment_method VARCHAR(50),
  payment_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_payments_bill_id ON payments(bill_id);

-- Complaints
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
  description TEXT,
  status VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_complaints_customer_id ON complaints(customer_id);

-- Maintenance logs
CREATE TABLE IF NOT EXISTS maintenance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID REFERENCES plants(id) ON DELETE RESTRICT,
  description TEXT,
  status VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_maintenance_logs_plant_id ON maintenance_logs(plant_id);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
