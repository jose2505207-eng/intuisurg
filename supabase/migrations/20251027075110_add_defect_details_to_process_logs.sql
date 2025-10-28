/*
  # Add Defect Details to Process Logs

  1. Changes to process_logs table
    - Add `part_number` (text) - The part number of the defective component
    - Add `reference_designator` (text) - The reference designator on the PCB/assembly
    - Add `tracking_id` (text) - Serial number or tracking ID for traceability
    - Add `operation_found` (text) - The operation where the defect was discovered
    - Add `technician_found` (text) - The technician who found the defect
    - Add `defect_description` (text) - Detailed description of what was wrong

  2. Notes
    - These fields are optional and only populated for process logs that represent defects or issues
    - This enables full traceability from defect discovery to resolution
*/

DO $$
BEGIN
  -- Add part_number if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'process_logs' AND column_name = 'part_number'
  ) THEN
    ALTER TABLE process_logs ADD COLUMN part_number text;
  END IF;

  -- Add reference_designator if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'process_logs' AND column_name = 'reference_designator'
  ) THEN
    ALTER TABLE process_logs ADD COLUMN reference_designator text;
  END IF;

  -- Add tracking_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'process_logs' AND column_name = 'tracking_id'
  ) THEN
    ALTER TABLE process_logs ADD COLUMN tracking_id text;
  END IF;

  -- Add operation_found if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'process_logs' AND column_name = 'operation_found'
  ) THEN
    ALTER TABLE process_logs ADD COLUMN operation_found text;
  END IF;

  -- Add technician_found if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'process_logs' AND column_name = 'technician_found'
  ) THEN
    ALTER TABLE process_logs ADD COLUMN technician_found text;
  END IF;

  -- Add defect_description if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'process_logs' AND column_name = 'defect_description'
  ) THEN
    ALTER TABLE process_logs ADD COLUMN defect_description text;
  END IF;
END $$;
