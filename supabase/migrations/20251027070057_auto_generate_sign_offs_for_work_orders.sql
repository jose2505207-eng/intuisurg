/*
  # Auto-Generate Sign-Off Operations for New Work Orders

  ## Overview
  This migration creates a trigger that automatically generates standard sign-off operations
  whenever a new work order is created or scanned.

  ## Changes
  1. Creates a function to generate standard sign-off operations
  2. Creates a trigger that fires when a new work order is inserted
  3. Automatically assigns operations to available technicians in rotation

  ## Standard Operations Created
  - Initial Component Inspection
  - PCB Assembly
  - Wire Harness Installation
  - Firmware Programming
  - Final Quality Inspection

  ## Notes
  - Operations are created with timestamps set to the work order creation time
  - Technicians are assigned in a round-robin fashion
  - This ensures every work order has a complete sign-off record
*/

-- Function to automatically create sign-off operations for new work orders
CREATE OR REPLACE FUNCTION create_default_sign_offs()
RETURNS TRIGGER AS $$
DECLARE
  tech_ids uuid[];
  tech_count integer;
  current_tech_id uuid;
BEGIN
  -- Get all available technician IDs
  SELECT ARRAY(SELECT id FROM technicians ORDER BY created_at LIMIT 5) INTO tech_ids;
  tech_count := array_length(tech_ids, 1);

  -- Only proceed if we have technicians
  IF tech_count > 0 THEN
    -- Insert standard sign-off operations
    INSERT INTO sign_off_operations (work_order_id, technician_id, operation_name, operation_order, completed_at, created_at)
    VALUES
      (NEW.id, tech_ids[1], 'Initial Component Inspection', 1, NEW.created_at + INTERVAL '30 minutes', NEW.created_at + INTERVAL '30 minutes'),
      (NEW.id, tech_ids[(1 % tech_count) + 1], 'PCB Assembly', 2, NEW.created_at + INTERVAL '2 hours', NEW.created_at + INTERVAL '2 hours'),
      (NEW.id, tech_ids[(2 % tech_count) + 1], 'Wire Harness Installation', 3, NEW.created_at + INTERVAL '4 hours', NEW.created_at + INTERVAL '4 hours'),
      (NEW.id, tech_ids[(3 % tech_count) + 1], 'Firmware Programming', 4, NEW.created_at + INTERVAL '6 hours', NEW.created_at + INTERVAL '6 hours'),
      (NEW.id, tech_ids[(4 % tech_count) + 1], 'Final Quality Inspection', 5, NEW.created_at + INTERVAL '8 hours', NEW.created_at + INTERVAL '8 hours');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists and create it
DROP TRIGGER IF EXISTS trigger_create_default_sign_offs ON work_orders;

CREATE TRIGGER trigger_create_default_sign_offs
  AFTER INSERT ON work_orders
  FOR EACH ROW
  EXECUTE FUNCTION create_default_sign_offs();

-- Backfill sign-offs for existing work orders that don't have any
DO $$
DECLARE
  wo RECORD;
  tech_ids uuid[];
  tech_count integer;
BEGIN
  -- Get all technician IDs
  SELECT ARRAY(SELECT id FROM technicians ORDER BY created_at LIMIT 5) INTO tech_ids;
  tech_count := array_length(tech_ids, 1);

  -- Only proceed if we have technicians
  IF tech_count > 0 THEN
    -- Loop through work orders that don't have sign-offs
    FOR wo IN 
      SELECT w.id, w.created_at 
      FROM work_orders w
      WHERE NOT EXISTS (
        SELECT 1 FROM sign_off_operations so WHERE so.work_order_id = w.id
      )
    LOOP
      -- Create sign-offs for this work order
      INSERT INTO sign_off_operations (work_order_id, technician_id, operation_name, operation_order, completed_at, created_at)
      VALUES
        (wo.id, tech_ids[1], 'Initial Component Inspection', 1, wo.created_at + INTERVAL '30 minutes', wo.created_at + INTERVAL '30 minutes'),
        (wo.id, tech_ids[(1 % tech_count) + 1], 'PCB Assembly', 2, wo.created_at + INTERVAL '2 hours', wo.created_at + INTERVAL '2 hours'),
        (wo.id, tech_ids[(2 % tech_count) + 1], 'Wire Harness Installation', 3, wo.created_at + INTERVAL '4 hours', wo.created_at + INTERVAL '4 hours'),
        (wo.id, tech_ids[(3 % tech_count) + 1], 'Firmware Programming', 4, wo.created_at + INTERVAL '6 hours', wo.created_at + INTERVAL '6 hours'),
        (wo.id, tech_ids[(4 % tech_count) + 1], 'Final Quality Inspection', 5, wo.created_at + INTERVAL '8 hours', wo.created_at + INTERVAL '8 hours');
    END LOOP;
  END IF;
END $$;
