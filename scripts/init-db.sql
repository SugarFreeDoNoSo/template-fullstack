-- Database initialization script for Prueba Fullstack
-- This script sets up the initial database schema and seed data

-- ===========================================
-- EXTENSIONS
-- ===========================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ===========================================
-- ENUMS
-- ===========================================

-- Create service status enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_status_enum') THEN
        CREATE TYPE service_status_enum AS ENUM ('pending', 'completed', 'cancelled');
    END IF;
END
$$;

-- ===========================================
-- TABLES
-- ===========================================

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(255) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    status service_status_enum NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- INDEXES
-- ===========================================

-- Performance indexes for common queries
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_scheduled_at ON services(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at);
CREATE INDEX IF NOT EXISTS idx_services_customer_name ON services USING gin(customer_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_services_service_type ON services(service_type);

-- Composite index for dashboard queries
CREATE INDEX IF NOT EXISTS idx_services_status_scheduled ON services(status, scheduled_at DESC);

-- ===========================================
-- TRIGGERS
-- ===========================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for services table
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- CONSTRAINTS
-- ===========================================

-- Additional constraints for data integrity
ALTER TABLE services
ADD CONSTRAINT IF NOT EXISTS chk_customer_name_length
CHECK (LENGTH(TRIM(customer_name)) >= 2);

ALTER TABLE services
ADD CONSTRAINT IF NOT EXISTS chk_service_type_length
CHECK (LENGTH(TRIM(service_type)) >= 2);

ALTER TABLE services
ADD CONSTRAINT IF NOT EXISTS chk_scheduled_at_future
CHECK (scheduled_at >= CURRENT_DATE - INTERVAL '1 year');

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to get service statistics by status
CREATE OR REPLACE FUNCTION get_service_stats()
RETURNS TABLE(
    status service_status_enum,
    count BIGINT,
    total_revenue DECIMAL(12,2),
    avg_price DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.status,
        COUNT(*) as count,
        COALESCE(SUM(s.price), 0) as total_revenue,
        COALESCE(AVG(s.price), 0) as avg_price
    FROM services s
    GROUP BY s.status
    ORDER BY s.status;
END;
$$ LANGUAGE plpgsql;

-- Function to get services by date range
CREATE OR REPLACE FUNCTION get_services_by_date_range(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    service_date DATE,
    service_count BIGINT,
    daily_revenue DECIMAL(12,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        DATE(s.scheduled_at) as service_date,
        COUNT(*) as service_count,
        COALESCE(SUM(s.price), 0) as daily_revenue
    FROM services s
    WHERE DATE(s.scheduled_at) BETWEEN start_date AND end_date
    GROUP BY DATE(s.scheduled_at)
    ORDER BY service_date DESC;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- VIEWS
-- ===========================================

-- View for dashboard statistics
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
    COUNT(*) as total_services,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_services,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_services,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_services,
    COALESCE(SUM(price), 0) as total_revenue,
    COALESCE(SUM(price) FILTER (WHERE status = 'completed'), 0) as completed_revenue,
    COALESCE(AVG(price), 0) as avg_service_price,
    COUNT(*) FILTER (WHERE DATE(scheduled_at) = CURRENT_DATE) as today_services,
    COUNT(*) FILTER (WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '7 days') as week_services
FROM services;

-- View for recent services
CREATE OR REPLACE VIEW recent_services AS
SELECT
    id,
    customer_name,
    service_type,
    scheduled_at,
    price,
    status,
    created_at
FROM services
ORDER BY created_at DESC
LIMIT 100;

-- ===========================================
-- SEED DATA (Development/Demo)
-- ===========================================

-- Insert sample data only if the table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM services LIMIT 1) THEN
        INSERT INTO services (customer_name, service_type, scheduled_at, price, status) VALUES
        -- Recent services (last 7 days)
        ('Juan Pérez', 'Consultoría IT', CURRENT_TIMESTAMP - INTERVAL '1 day', 150.00, 'completed'),
        ('María González', 'Desarrollo Web', CURRENT_TIMESTAMP - INTERVAL '2 days', 800.00, 'pending'),
        ('Carlos López', 'Mantenimiento', CURRENT_TIMESTAMP - INTERVAL '3 days', 75.00, 'completed'),
        ('Ana Martínez', 'Soporte Técnico', CURRENT_TIMESTAMP - INTERVAL '4 days', 100.00, 'completed'),
        ('Luis Rodríguez', 'Consultoría IT', CURRENT_TIMESTAMP - INTERVAL '5 days', 200.00, 'cancelled'),

        -- This week
        ('Elena Sánchez', 'Desarrollo Mobile', CURRENT_TIMESTAMP - INTERVAL '6 days', 1200.00, 'pending'),
        ('Miguel Torres', 'Auditoría', CURRENT_TIMESTAMP - INTERVAL '7 days', 300.00, 'completed'),

        -- Previous weeks
        ('Patricia Ruiz', 'Capacitación', CURRENT_TIMESTAMP - INTERVAL '10 days', 400.00, 'completed'),
        ('Roberto Silva', 'Consultoría IT', CURRENT_TIMESTAMP - INTERVAL '12 days', 180.00, 'completed'),
        ('Carmen Díaz', 'Desarrollo Web', CURRENT_TIMESTAMP - INTERVAL '15 days', 950.00, 'completed'),

        -- Monthly data for charts
        ('José Morales', 'Soporte Técnico', CURRENT_TIMESTAMP - INTERVAL '20 days', 85.00, 'completed'),
        ('Isabel Vargas', 'Mantenimiento', CURRENT_TIMESTAMP - INTERVAL '25 days', 120.00, 'completed'),
        ('Antonio Herrera', 'Consultoría IT', CURRENT_TIMESTAMP - INTERVAL '28 days', 220.00, 'cancelled'),

        -- Future services
        ('Sofía Castro', 'Desarrollo Web', CURRENT_TIMESTAMP + INTERVAL '1 day', 600.00, 'pending'),
        ('Diego Mendoza', 'Consultoría IT', CURRENT_TIMESTAMP + INTERVAL '3 days', 175.00, 'pending'),
        ('Lucía Jiménez', 'Capacitación', CURRENT_TIMESTAMP + INTERVAL '5 days', 350.00, 'pending'),
        ('Fernando Ortiz', 'Auditoría', CURRENT_TIMESTAMP + INTERVAL '7 days', 280.00, 'pending'),
        ('Valeria Ramos', 'Desarrollo Mobile', CURRENT_TIMESTAMP + INTERVAL '10 days', 1100.00, 'pending');

        RAISE NOTICE 'Sample data inserted successfully';
    ELSE
        RAISE NOTICE 'Services table already contains data, skipping seed data insertion';
    END IF;
END
$$;

-- ===========================================
-- PERMISSIONS (if needed for specific roles)
-- ===========================================

-- Grant permissions for application user (uncomment if using specific database user)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON services TO app_user;
-- GRANT USAGE, SELECT ON SEQUENCE services_id_seq TO app_user;
-- GRANT EXECUTE ON FUNCTION get_service_stats() TO app_user;
-- GRANT EXECUTE ON FUNCTION get_services_by_date_range(DATE, DATE) TO app_user;

-- ===========================================
-- MAINTENANCE
-- ===========================================

-- Update table statistics for query optimization
ANALYZE services;

-- ===========================================
-- VALIDATION
-- ===========================================

-- Validate the setup
DO $$
DECLARE
    service_count INTEGER;
    index_count INTEGER;
BEGIN
    -- Check if services table exists and has data
    SELECT COUNT(*) INTO service_count FROM services;
    RAISE NOTICE 'Services table initialized with % records', service_count;

    -- Check if indexes were created
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes
    WHERE tablename = 'services';
    RAISE NOTICE 'Created % indexes on services table', index_count;

    -- Verify functions exist
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_service_stats') THEN
        RAISE NOTICE 'Service statistics function created successfully';
    END IF;

    -- Verify views exist
    IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'dashboard_stats') THEN
        RAISE NOTICE 'Dashboard statistics view created successfully';
    END IF;

    RAISE NOTICE 'Database initialization completed successfully';
END
$$;
