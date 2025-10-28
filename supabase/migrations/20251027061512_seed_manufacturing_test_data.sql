/*
  # Seed Manufacturing Test Data

  ## Overview
  This migration populates the manufacturing testing system with realistic sample data
  to demonstrate the application's functionality.

  ## Data Added

  ### 1. Work Orders
  - Creates sample work orders with various statuses
  - Includes product names and order numbers for testing

  ### 2. Technicians
  - Adds sample technicians with names and employee IDs
  - Provides realistic technician data for sign-off operations

  ### 3. Sign-Off Operations
  - Creates operation records linked to work orders
  - Includes various operation types with timestamps
  - Links operations to technicians for tracking

  ### 4. Bill of Materials (BOM)
  - Adds component data for each work order
  - Includes vendor names, part numbers, and serial numbers
  - Demonstrates complete materials tracking

  ### 5. Manufacturing Process Instructions
  - Creates sample MPIs for setup, testing, and rework
  - Provides step-by-step instructions for operations

  ## Notes
  - All data uses realistic manufacturing scenarios
  - Timestamps are set relative to recent dates
  - Foreign key relationships are properly maintained
*/

-- Insert sample work orders
INSERT INTO work_orders (id, order_number, product_name, status, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'WO-2024-1001', 'Industrial Control Unit Model X500', 'passed', '2024-10-15 08:00:00', '2024-10-15 16:30:00'),
  ('22222222-2222-2222-2222-222222222222', 'WO-2024-1002', 'Precision Sensor Array PSA-200', 'testing', '2024-10-20 09:15:00', '2024-10-27 10:00:00'),
  ('33333333-3333-3333-3333-333333333333', 'WO-2024-1003', 'Power Distribution Module PDM-400', 'passed', '2024-10-22 07:30:00', '2024-10-26 14:20:00')
ON CONFLICT (id) DO NOTHING;

-- Insert sample technicians
INSERT INTO technicians (id, name, employee_id, created_at)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Sarah Johnson', 'EMP-2401', '2024-01-15 08:00:00'),
  ('a2222222-2222-2222-2222-222222222222', 'Michael Chen', 'EMP-2402', '2024-02-01 08:00:00'),
  ('a3333333-3333-3333-3333-333333333333', 'David Rodriguez', 'EMP-2403', '2024-03-10 08:00:00'),
  ('a4444444-4444-4444-4444-444444444444', 'Emily Watson', 'EMP-2404', '2024-04-05 08:00:00'),
  ('a5555555-5555-5555-5555-555555555555', 'James Miller', 'EMP-2405', '2024-05-20 08:00:00')
ON CONFLICT (employee_id) DO NOTHING;

-- Insert sign-off operations for WO-2024-1001
INSERT INTO sign_off_operations (work_order_id, technician_id, operation_name, operation_order, completed_at, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Initial Component Inspection', 1, '2024-10-15 08:30:00', '2024-10-15 08:30:00'),
  ('11111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'PCB Assembly', 2, '2024-10-15 10:15:00', '2024-10-15 10:15:00'),
  ('11111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 'Wire Harness Installation', 3, '2024-10-15 12:00:00', '2024-10-15 12:00:00'),
  ('11111111-1111-1111-1111-111111111111', 'a4444444-4444-4444-4444-444444444444', 'Firmware Programming', 4, '2024-10-15 13:45:00', '2024-10-15 13:45:00'),
  ('11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Final Quality Inspection', 5, '2024-10-15 16:30:00', '2024-10-15 16:30:00')
ON CONFLICT DO NOTHING;

-- Insert sign-off operations for WO-2024-1002
INSERT INTO sign_off_operations (work_order_id, technician_id, operation_name, operation_order, completed_at, created_at)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'Component Receiving & Verification', 1, '2024-10-20 09:30:00', '2024-10-20 09:30:00'),
  ('22222222-2222-2222-2222-222222222222', 'a5555555-5555-5555-5555-555555555555', 'Sensor Calibration', 2, '2024-10-20 11:20:00', '2024-10-20 11:20:00'),
  ('22222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', 'Main Assembly', 3, '2024-10-20 14:45:00', '2024-10-20 14:45:00'),
  ('22222222-2222-2222-2222-222222222222', 'a4444444-4444-4444-4444-444444444444', 'Software Configuration', 4, '2024-10-21 09:00:00', '2024-10-21 09:00:00')
ON CONFLICT DO NOTHING;

-- Insert sign-off operations for WO-2024-1003
INSERT INTO sign_off_operations (work_order_id, technician_id, operation_name, operation_order, completed_at, created_at)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'Parts Kitting', 1, '2024-10-22 07:45:00', '2024-10-22 07:45:00'),
  ('33333333-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222', 'Power Module Assembly', 2, '2024-10-22 09:30:00', '2024-10-22 09:30:00'),
  ('33333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'Electrical Testing', 3, '2024-10-22 11:15:00', '2024-10-22 11:15:00'),
  ('33333333-3333-3333-3333-333333333333', 'a5555555-5555-5555-5555-555555555555', 'Thermal Stress Testing', 4, '2024-10-26 10:00:00', '2024-10-26 10:00:00'),
  ('33333333-3333-3333-3333-333333333333', 'a4444444-4444-4444-4444-444444444444', 'Final Certification', 5, '2024-10-26 14:20:00', '2024-10-26 14:20:00')
ON CONFLICT DO NOTHING;

-- Insert bill of materials for WO-2024-1001
INSERT INTO bill_of_materials (work_order_id, vendor_denomination, part_number, serial_number, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Texas Instruments', 'TI-MSP430F5529', 'SN-TI-2024-5529-001', '2024-10-15 08:00:00'),
  ('11111111-1111-1111-1111-111111111111', 'STMicroelectronics', 'STM32F407VGT6', 'SN-STM-2024-407-045', '2024-10-15 08:00:00'),
  ('11111111-1111-1111-1111-111111111111', 'Analog Devices', 'ADM3251EARWZ', 'SN-ADI-2024-3251-078', '2024-10-15 08:00:00'),
  ('11111111-1111-1111-1111-111111111111', 'Murata Electronics', 'GRM31CR61A476ME15L', 'SN-MUR-2024-476-123', '2024-10-15 08:00:00'),
  ('11111111-1111-1111-1111-111111111111', 'Vishay Intertechnology', 'CRCW080510K0FKEA', 'SN-VIS-2024-10K-456', '2024-10-15 08:00:00')
ON CONFLICT DO NOTHING;

-- Insert bill of materials for WO-2024-1002
INSERT INTO bill_of_materials (work_order_id, vendor_denomination, part_number, serial_number, created_at)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'Bosch Sensortec', 'BME680', 'SN-BSH-2024-680-234', '2024-10-20 09:15:00'),
  ('22222222-2222-2222-2222-222222222222', 'Honeywell', 'HSC-SSCDANN150PG2A5', 'SN-HON-2024-150-567', '2024-10-20 09:15:00'),
  ('22222222-2222-2222-2222-222222222222', 'TE Connectivity', 'M12X-03PMMR-SF8001', 'SN-TEC-2024-M12-890', '2024-10-20 09:15:00'),
  ('22222222-2222-2222-2222-222222222222', 'Infineon Technologies', 'TLE4905L', 'SN-IFX-2024-490-112', '2024-10-20 09:15:00'),
  ('22222222-2222-2222-2222-222222222222', 'NXP Semiconductors', 'LPC1768FBD100', 'SN-NXP-2024-176-334', '2024-10-20 09:15:00'),
  ('22222222-2222-2222-2222-222222222222', 'Maxim Integrated', 'MAX3232ESE+', 'SN-MAX-2024-323-445', '2024-10-20 09:15:00')
ON CONFLICT DO NOTHING;

-- Insert bill of materials for WO-2024-1003
INSERT INTO bill_of_materials (work_order_id, vendor_denomination, part_number, serial_number, created_at)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'Mean Well', 'HLG-240H-48A', 'SN-MEW-2024-240-678', '2024-10-22 07:30:00'),
  ('33333333-3333-3333-3333-333333333333', 'Littelfuse', 'PICO-II-025', 'SN-LIT-2024-025-901', '2024-10-22 07:30:00'),
  ('33333333-3333-3333-3333-333333333333', 'Phoenix Contact', 'QUINT-PS/1AC/24DC/10', 'SN-PHX-2024-QPS-223', '2024-10-22 07:30:00'),
  ('33333333-3333-3333-3333-333333333333', 'Omron Electronics', 'G3NA-210B-UTU', 'SN-OMR-2024-G3N-556', '2024-10-22 07:30:00'),
  ('33333333-3333-3333-3333-333333333333', 'WAGO', '280-304', 'SN-WAG-2024-280-778', '2024-10-22 07:30:00'),
  ('33333333-3333-3333-3333-333333333333', 'Molex', '43045-0218', 'SN-MOL-2024-430-889', '2024-10-22 07:30:00'),
  ('33333333-3333-3333-3333-333333333333', 'TE Connectivity', 'AMP-215877-1', 'SN-TEC-2024-215-990', '2024-10-22 07:30:00')
ON CONFLICT DO NOTHING;

-- Insert sample manufacturing process instructions
INSERT INTO manufacturing_process_instructions (id, title, instruction_type, step_number, instruction_text, parent_mpi_id, created_at)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Standard Setup Procedure', 'setup', 1, 'Verify all components are present and match the BOM. Inspect for any visible damage.', NULL, '2024-01-01 08:00:00'),
  ('b2222222-2222-2222-2222-222222222222', 'Standard Setup Procedure', 'setup', 2, 'Prepare workstation with ESD protection. Ground yourself with wrist strap.', NULL, '2024-01-01 08:00:00'),
  ('b3333333-3333-3333-3333-333333333333', 'Standard Testing Procedure', 'testing', 1, 'Power on the unit and verify LED indicators show green status.', NULL, '2024-01-01 08:00:00'),
  ('b4444444-4444-4444-4444-444444444444', 'Standard Testing Procedure', 'testing', 2, 'Run automated test sequence and monitor sensor readings.', NULL, '2024-01-01 08:00:00'),
  ('b5555555-5555-5555-5555-555555555555', 'Thermal Correction Procedure', 'rework', 1, 'Allow unit to cool for 30 minutes before proceeding with rework.', NULL, '2024-01-01 08:00:00')
ON CONFLICT DO NOTHING;