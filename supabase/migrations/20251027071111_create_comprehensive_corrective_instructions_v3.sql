/*
  # Create Comprehensive Corrective Instructions for All Root Causes

  ## Overview
  Creates detailed corrective instructions with success rates ranging from 58.4% to 94.2% (35.8% variance).

  ## Changes
  1. Deletes existing process logs and rework instructions
  2. Creates 6 different failure scenarios with unique corrective procedures
  3. Each procedure has 7-8 detailed steps with part numbers and specifications

  ## Success Rate Distribution
  - 94.2%: Thermal paste reapplication (simple, high success)
  - 88.5%: Voltage regulator module replacement (straightforward hardware swap)
  - 76.8%: Pressure sensor cleaning (medium complexity)
  - 67.5%: Component short diagnosis (requires expertise)
  - 62.3%: Capacitor diagnosis and replacement (complex troubleshooting)
  - 58.4%: Pressure system leak detection (most difficult, hidden issues)
*/

-- Delete existing data (cascade will handle process_logs)
DELETE FROM process_logs_database;
DELETE FROM manufacturing_process_instructions WHERE instruction_type = 'rework';

-- Create corrective instructions

-- 1. Voltage Regulator Module Replacement (88.5% success)
INSERT INTO manufacturing_process_instructions (id, title, instruction_type, step_number, instruction_text, parent_mpi_id, created_at)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Voltage Regulator Module Replacement', 'rework', 1, 'Power down the unit completely and disconnect from test bench. Wait 5 minutes for capacitors to discharge.', NULL, NOW()),
  (gen_random_uuid(), 'Voltage Regulator Module Replacement', 'rework', 2, 'Remove the voltage regulator access panel using T15 Torx driver. Set aside screws in labeled container.', NULL, NOW()),
  (gen_random_uuid(), 'Voltage Regulator Module Replacement', 'rework', 3, 'Document the current wiring configuration with photos. Label all connectors before disconnecting.', NULL, NOW()),
  (gen_random_uuid(), 'Voltage Regulator Module Replacement', 'rework', 4, 'Remove the faulty voltage regulator module (P/N: VR-2845-A). Note any visible damage or burn marks.', NULL, NOW()),
  (gen_random_uuid(), 'Voltage Regulator Module Replacement', 'rework', 5, 'Install new voltage regulator module ensuring proper orientation. Torque mounting screws to 8 in-lbs.', NULL, NOW()),
  (gen_random_uuid(), 'Voltage Regulator Module Replacement', 'rework', 6, 'Reconnect all wiring according to documentation. Verify secure connections with gentle tug test.', NULL, NOW()),
  (gen_random_uuid(), 'Voltage Regulator Module Replacement', 'rework', 7, 'Before reassembly, use multimeter to verify output voltage is within 220-230V range.', NULL, NOW()),
  (gen_random_uuid(), 'Voltage Regulator Module Replacement', 'rework', 8, 'Reassemble access panel and update work order with part number and serial number of new module.', NULL, NOW());

-- 2. Capacitor Diagnosis and Replacement (62.3% success)
INSERT INTO manufacturing_process_instructions (id, title, instruction_type, step_number, instruction_text, parent_mpi_id, created_at)
VALUES
  ('c2222222-2222-2222-2222-222222222222', 'Voltage Regulation Circuit Capacitor Diagnosis', 'rework', 1, 'Power down unit and disconnect all power sources. Allow 10 minutes for full capacitor discharge.', NULL, NOW()),
  (gen_random_uuid(), 'Voltage Regulation Circuit Capacitor Diagnosis', 'rework', 2, 'Remove main circuit board access panel. Use ESD wrist strap throughout procedure.', NULL, NOW()),
  (gen_random_uuid(), 'Voltage Regulation Circuit Capacitor Diagnosis', 'rework', 3, 'Visually inspect all capacitors in voltage regulation circuit for bulging, leaking, or discoloration.', NULL, NOW()),
  (gen_random_uuid(), 'Voltage Regulation Circuit Capacitor Diagnosis', 'rework', 4, 'Use ESR meter to test suspected capacitors. Note readings that exceed 5 ohms ESR.', NULL, NOW()),
  (gen_random_uuid(), 'Voltage Regulation Circuit Capacitor Diagnosis', 'rework', 5, 'Desolder and remove faulty capacitors. Clean PCB pads with desoldering braid and isopropyl alcohol.', NULL, NOW()),
  (gen_random_uuid(), 'Voltage Regulation Circuit Capacitor Diagnosis', 'rework', 6, 'Install replacement capacitors (P/N: CAP-1000UF-35V) observing correct polarity. Solder with 700°F iron.', NULL, NOW()),
  (gen_random_uuid(), 'Voltage Regulation Circuit Capacitor Diagnosis', 'rework', 7, 'Perform voltage ripple test with oscilloscope. Verify AC ripple is below 50mV peak-to-peak.', NULL, NOW()),
  (gen_random_uuid(), 'Voltage Regulation Circuit Capacitor Diagnosis', 'rework', 8, 'Reassemble unit and run extended voltage stability test (30 minutes) before final approval.', NULL, NOW());

-- 3. Pressure Sensor Cleaning (76.8% success)
INSERT INTO manufacturing_process_instructions (id, title, instruction_type, step_number, instruction_text, parent_mpi_id, created_at)
VALUES
  ('c3333333-3333-3333-3333-333333333333', 'Pressure Sensor Cleaning and Seal Replacement', 'rework', 1, 'Depressurize system completely. Verify zero pressure on all gauges before proceeding.', NULL, NOW()),
  (gen_random_uuid(), 'Pressure Sensor Cleaning and Seal Replacement', 'rework', 2, 'Disconnect pressure sensor electrical connector. Cover connector with protective cap.', NULL, NOW()),
  (gen_random_uuid(), 'Pressure Sensor Cleaning and Seal Replacement', 'rework', 3, 'Remove pressure sensor using 22mm wrench. Inspect threads for damage or cross-threading.', NULL, NOW()),
  (gen_random_uuid(), 'Pressure Sensor Cleaning and Seal Replacement', 'rework', 4, 'Clean sensor element with isopropyl alcohol and lint-free swabs. Do not touch sensing element directly.', NULL, NOW()),
  (gen_random_uuid(), 'Pressure Sensor Cleaning and Seal Replacement', 'rework', 5, 'Replace O-ring seal (P/N: ORING-234-NBR) with new part. Lubricate lightly with compatible grease.', NULL, NOW()),
  (gen_random_uuid(), 'Pressure Sensor Cleaning and Seal Replacement', 'rework', 6, 'Reinstall sensor with proper torque (25 ft-lbs). Do not over-tighten to avoid crushing seal.', NULL, NOW()),
  (gen_random_uuid(), 'Pressure Sensor Cleaning and Seal Replacement', 'rework', 7, 'Reconnect electrical connector and perform pressure leak test at 120 PSI for 5 minutes.', NULL, NOW());

-- 4. Pressure System Leak Detection (58.4% success - lowest)
INSERT INTO manufacturing_process_instructions (id, title, instruction_type, step_number, instruction_text, parent_mpi_id, created_at)
VALUES
  ('c4444444-4444-4444-4444-444444444444', 'Comprehensive Pressure System Leak Detection', 'rework', 1, 'Fully depressurize system. Tag all pressure lines with identification labels for tracking.', NULL, NOW()),
  (gen_random_uuid(), 'Comprehensive Pressure System Leak Detection', 'rework', 2, 'Apply soap solution to all fittings and connections. Pressurize system to 100 PSI.', NULL, NOW()),
  (gen_random_uuid(), 'Comprehensive Pressure System Leak Detection', 'rework', 3, 'Observe for bubbles indicating leak points. Mark all suspect areas with marker.', NULL, NOW()),
  (gen_random_uuid(), 'Comprehensive Pressure System Leak Detection', 'rework', 4, 'If no visible leaks, use ultrasonic leak detector to scan entire pressure system including hidden areas.', NULL, NOW()),
  (gen_random_uuid(), 'Comprehensive Pressure System Leak Detection', 'rework', 5, 'Tighten loose fittings to manufacturer specifications. Replace fittings showing thread damage.', NULL, NOW()),
  (gen_random_uuid(), 'Comprehensive Pressure System Leak Detection', 'rework', 6, 'For persistent leaks, replace entire pressure line section (P/N: PRESS-LINE-0.25-SS).', NULL, NOW()),
  (gen_random_uuid(), 'Comprehensive Pressure System Leak Detection', 'rework', 7, 'Perform pressure decay test: Pressurize to 110 PSI, isolate system, monitor for 15 minutes. Max 2 PSI drop allowed.', NULL, NOW()),
  (gen_random_uuid(), 'Comprehensive Pressure System Leak Detection', 'rework', 8, 'Document all repairs and replacement parts. Perform final functional pressure test through full range.', NULL, NOW());

-- 5. Thermal Paste Reapplication (94.2% success - highest)
INSERT INTO manufacturing_process_instructions (id, title, instruction_type, step_number, instruction_text, parent_mpi_id, created_at)
VALUES
  ('c5555555-5555-5555-5555-555555555555', 'Thermal Paste Removal and Reapplication', 'rework', 1, 'Power down unit and allow to cool to room temperature (wait minimum 20 minutes).', NULL, NOW()),
  (gen_random_uuid(), 'Thermal Paste Removal and Reapplication', 'rework', 2, 'Remove heat sink assembly by loosening mounting screws in diagonal pattern to prevent warping.', NULL, NOW()),
  (gen_random_uuid(), 'Thermal Paste Removal and Reapplication', 'rework', 3, 'Clean old thermal paste from both CPU and heat sink using isopropyl alcohol (90%+) and lint-free cloth.', NULL, NOW()),
  (gen_random_uuid(), 'Thermal Paste Removal and Reapplication', 'rework', 4, 'Inspect CPU surface for scratches or damage. Verify heat sink surface is flat and undamaged.', NULL, NOW()),
  (gen_random_uuid(), 'Thermal Paste Removal and Reapplication', 'rework', 5, 'Apply small pea-sized amount of thermal paste (P/N: THERMAL-AG-5) to center of CPU.', NULL, NOW()),
  (gen_random_uuid(), 'Thermal Paste Removal and Reapplication', 'rework', 6, 'Reinstall heat sink with even pressure. Tighten mounting screws in diagonal pattern to 6 in-lbs torque.', NULL, NOW()),
  (gen_random_uuid(), 'Thermal Paste Removal and Reapplication', 'rework', 7, 'Power on unit and monitor temperature during initial 10 minutes. Should stabilize below 65°C at idle.', NULL, NOW());

-- 6. Thermal Imaging Component Diagnosis (67.5% success)
INSERT INTO manufacturing_process_instructions (id, title, instruction_type, step_number, instruction_text, parent_mpi_id, created_at)
VALUES
  ('c6666666-6666-6666-6666-666666666666', 'Thermal Imaging Diagnosis and Component Replacement', 'rework', 1, 'Power on unit and allow to heat up while monitoring with thermal imaging camera.', NULL, NOW()),
  (gen_random_uuid(), 'Thermal Imaging Diagnosis and Component Replacement', 'rework', 2, 'Identify hot spots on PCB exceeding 80°C. Document locations and temperatures with photos.', NULL, NOW()),
  (gen_random_uuid(), 'Thermal Imaging Diagnosis and Component Replacement', 'rework', 3, 'Power down and measure resistance of suspected components. Compare to schematic values.', NULL, NOW()),
  (gen_random_uuid(), 'Thermal Imaging Diagnosis and Component Replacement', 'rework', 4, 'Check for shorts between adjacent components using continuity tester. Note any unexpected connections.', NULL, NOW()),
  (gen_random_uuid(), 'Thermal Imaging Diagnosis and Component Replacement', 'rework', 5, 'Remove shorted or damaged components using hot air rework station at 350°C.', NULL, NOW()),
  (gen_random_uuid(), 'Thermal Imaging Diagnosis and Component Replacement', 'rework', 6, 'Clean PCB pads and inspect for trace damage. Repair any damaged traces with jumper wire if needed.', NULL, NOW()),
  (gen_random_uuid(), 'Thermal Imaging Diagnosis and Component Replacement', 'rework', 7, 'Install replacement components with proper orientation. Verify part numbers match BOM exactly.', NULL, NOW()),
  (gen_random_uuid(), 'Thermal Imaging Diagnosis and Component Replacement', 'rework', 8, 'Power on and repeat thermal imaging scan. Verify no hot spots exceed 75°C under full load test.', NULL, NOW());

-- Insert process logs with varied success rates (58.4% to 94.2% = 35.8% variance)
INSERT INTO process_logs_database (
  pl_number, failure_code, failure_description, root_cause,
  occurrence_count, success_rate, symptoms, corrective_mpi_id, created_at
)
VALUES
  (
    'PL-2024-V001',
    'VOLT-HIGH',
    'Voltage output exceeds acceptable range during testing',
    'Faulty voltage regulator module requiring replacement',
    47,
    88.5,
    ARRAY['Voltage readings above 250V', 'Inconsistent power output', 'Circuit protection triggered'],
    'c1111111-1111-1111-1111-111111111111',
    '2024-06-15 10:00:00'
  ),
  (
    'PL-2024-V002',
    'VOLT-HIGH',
    'Intermittent voltage spikes during extended operation',
    'Degraded capacitor in voltage regulation circuit',
    23,
    62.3,
    ARRAY['Random voltage spikes', 'Erratic meter readings', 'Audible clicking from power supply'],
    'c2222222-2222-2222-2222-222222222222',
    '2024-07-20 14:30:00'
  ),
  (
    'PL-2024-P001',
    'PRESS-LOW',
    'Pressure readings consistently below minimum threshold',
    'Contaminated pressure sensor or damaged O-ring seal',
    62,
    76.8,
    ARRAY['Pressure below 50 PSI', 'Slow pressure buildup', 'Visible contamination on sensor'],
    'c3333333-3333-3333-3333-333333333333',
    '2024-08-10 09:15:00'
  ),
  (
    'PL-2024-P002',
    'PRESS-LOW',
    'Gradual pressure loss during sustained testing',
    'Micro-fracture in pressure line or loose fitting connections',
    34,
    58.4,
    ARRAY['Gradual pressure drop', 'Hissing sound during operation', 'Oil residue near fittings'],
    'c4444444-4444-4444-4444-444444444444',
    '2024-09-05 11:45:00'
  ),
  (
    'PL-2024-T001',
    'TEMP-HIGH',
    'Temperature exceeds 85°C during stress test',
    'Inadequate thermal paste application or dried compound',
    89,
    94.2,
    ARRAY['CPU temperature above 85°C', 'Excessive heat from processor area', 'Thermal sensor alarm'],
    'c5555555-5555-5555-5555-555555555555',
    '2024-08-25 13:20:00'
  ),
  (
    'PL-2024-T002',
    'TEMP-HIGH',
    'Persistent overheating despite adequate cooling',
    'Internal component short causing excessive current draw and heat',
    18,
    67.5,
    ARRAY['Temperature steadily rising', 'Abnormal power consumption', 'Hot spots on PCB'],
    'c6666666-6666-6666-6666-666666666666',
    '2024-09-18 16:00:00'
  );
