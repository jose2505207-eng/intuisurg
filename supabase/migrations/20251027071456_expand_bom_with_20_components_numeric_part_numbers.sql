/*
  # Expand BOM to 20+ Components with Numeric Part Numbers

  ## Overview
  This migration updates the Bill of Materials to include at least 20 components per work order
  with part numbers that are numeric only (no letters or special characters).

  ## Changes
  1. Deletes existing BOM entries
  2. Creates comprehensive BOM with 20+ components per work order
  3. Uses numeric-only part numbers (e.g., 458201, 299847, 284502)
  4. Includes realistic vendor names and tracking IDs

  ## Component Categories
  - Microcontrollers and processors
  - Sensors and measurement devices
  - Power supply components
  - Passive components (resistors, capacitors)
  - Connectors and interfaces
  - Protection devices
  - Communication modules
  - Memory devices

  ## Notes
  - Part numbers are 6-digit numeric codes
  - Serial numbers maintain SN- prefix for tracking
  - All components have realistic vendor names
*/

-- Delete existing BOM entries
DELETE FROM bill_of_materials;

-- Insert comprehensive BOM for all work orders with 20+ components each
-- Using a function to generate BOMs for all existing work orders

DO $$
DECLARE
  wo_record RECORD;
BEGIN
  -- Loop through all work orders and create 20+ component BOMs
  FOR wo_record IN SELECT id, created_at FROM work_orders LOOP
    
    INSERT INTO bill_of_materials (work_order_id, vendor_denomination, part_number, serial_number, created_at)
    VALUES
      -- Microcontrollers and Processors (3 components)
      (wo_record.id, 'Texas Instruments', '458201', 'SN-1761543762988-001', wo_record.created_at),
      (wo_record.id, 'STMicroelectronics', '407689', 'SN-1761543762988-002', wo_record.created_at),
      (wo_record.id, 'Microchip Technology', '325184', 'SN-1761543762988-003', wo_record.created_at),
      
      -- Sensors (4 components)
      (wo_record.id, 'Bosch Sensortec', '299847', 'SN-1761543762988-004', wo_record.created_at),
      (wo_record.id, 'Honeywell', '150238', 'SN-1761543762988-005', wo_record.created_at),
      (wo_record.id, 'Sensirion', '682045', 'SN-1761543762988-006', wo_record.created_at),
      (wo_record.id, 'Infineon Technologies', '490512', 'SN-1761543762988-007', wo_record.created_at),
      
      -- Power Components (3 components)
      (wo_record.id, 'Mean Well', '284502', 'SN-1761543762988-008', wo_record.created_at),
      (wo_record.id, 'Phoenix Contact', '241024', 'SN-1761543762988-009', wo_record.created_at),
      (wo_record.id, 'TDK-Lambda', '480536', 'SN-1761543762988-010', wo_record.created_at),
      
      -- Capacitors (3 components)
      (wo_record.id, 'Murata Electronics', '476915', 'SN-1761543762988-011', wo_record.created_at),
      (wo_record.id, 'Kemet Corporation', '105847', 'SN-1761543762988-012', wo_record.created_at),
      (wo_record.id, 'TDK Corporation', '226938', 'SN-1761543762988-013', wo_record.created_at),
      
      -- Resistors (2 components)
      (wo_record.id, 'Vishay Intertechnology', '100045', 'SN-1761543762988-014', wo_record.created_at),
      (wo_record.id, 'Yageo Corporation', '510362', 'SN-1761543762988-015', wo_record.created_at),
      
      -- Connectors (3 components)
      (wo_record.id, 'Molex', '430450', 'SN-1761543762988-016', wo_record.created_at),
      (wo_record.id, 'TE Connectivity', '215877', 'SN-1761543762988-017', wo_record.created_at),
      (wo_record.id, 'Amphenol', '820145', 'SN-1761543762988-018', wo_record.created_at),
      
      -- Protection Devices (2 components)
      (wo_record.id, 'Littelfuse', '025084', 'SN-1761543762988-019', wo_record.created_at),
      (wo_record.id, 'Bourns', '360724', 'SN-1761543762988-020', wo_record.created_at),
      
      -- Communication Modules (2 components)
      (wo_record.id, 'Maxim Integrated', '323245', 'SN-1761543762988-021', wo_record.created_at),
      (wo_record.id, 'Analog Devices', '325197', 'SN-1761543762988-022', wo_record.created_at),
      
      -- Memory & Storage (2 components)
      (wo_record.id, 'Micron Technology', '256384', 'SN-1761543762988-023', wo_record.created_at),
      (wo_record.id, 'Winbond Electronics', '128745', 'SN-1761543762988-024', wo_record.created_at);
      
  END LOOP;
END $$;
