/*
  # Update Process Logs with Defect Details

  1. Updates
    - Add defect details to existing process logs that represent issues/errors
    - Include part numbers, reference designators, tracking IDs, operations, and technicians
    - Provide realistic manufacturing defect scenarios

  2. Notes
    - Only updates error and issue type logs
    - Creates comprehensive traceability information
*/

-- Update existing process logs with defect details for error/issue logs
UPDATE process_logs
SET 
  part_number = CASE 
    WHEN message LIKE '%magnet%' OR message LIKE '%MAGNET%' THEN '977063-01'
    WHEN message LIKE '%voltage%' OR message LIKE '%VOLT%' THEN '308699-46'
    WHEN message LIKE '%pressure%' OR message LIKE '%PRESS%' THEN '106802-04'
    WHEN message LIKE '%capacitor%' THEN '998877-22'
    WHEN message LIKE '%resistor%' THEN '887766-11'
    ELSE '308699-46'
  END,
  reference_designator = CASE 
    WHEN message LIKE '%magnet%' OR message LIKE '%MAGNET%' THEN 'MAGNET'
    WHEN message LIKE '%voltage%' OR message LIKE '%VOLT%' THEN 'U12'
    WHEN message LIKE '%pressure%' OR message LIKE '%PRESS%' THEN 'P1'
    WHEN message LIKE '%capacitor%' THEN 'C8'
    WHEN message LIKE '%resistor%' THEN 'R15'
    ELSE 'U12'
  END,
  tracking_id = CASE 
    WHEN message LIKE '%magnet%' OR message LIKE '%MAGNET%' THEN 'DB01703531'
    WHEN message LIKE '%voltage%' OR message LIKE '%VOLT%' THEN '10803310'
    WHEN message LIKE '%pressure%' OR message LIKE '%PRESS%' THEN 'SN2024-P1-789'
    WHEN message LIKE '%capacitor%' THEN 'CAP-2024-456'
    WHEN message LIKE '%resistor%' THEN 'RES-2024-123'
    ELSE '10803310'
  END,
  operation_found = CASE 
    WHEN log_type = 'error' THEN '1120 - Testing'
    WHEN log_type = 'issue' THEN '0850 - Assembly'
    ELSE '1120 - Testing'
  END,
  technician_found = CASE 
    WHEN random() < 0.33 THEN 'Jose Zaragoza (JZARAGOZA1)'
    WHEN random() < 0.66 THEN 'Maria Rodriguez (MRODRIGUEZ)'
    ELSE 'John Smith (JSMITH)'
  END,
  defect_description = CASE 
    WHEN message LIKE '%magnet%' OR message LIKE '%MAGNET%' THEN 'During assembly technician found damage on MAGNET. Component shows visible physical damage and cannot be used.'
    WHEN message LIKE '%voltage%' THEN 'Voltage reading exceeded limits (252V) during functional testing. Power supply module U12 is out of specification.'
    WHEN message LIKE '%pressure%' THEN 'Pressure sensor P1 reading below minimum (48 PSI). Sensor may be defective or improperly calibrated.'
    WHEN message LIKE '%capacitor%' THEN 'Capacitor C8 shows incorrect capacitance value during testing. Component may be defective or wrong value installed.'
    WHEN message LIKE '%resistor%' THEN 'Resistor R15 measured value outside tolerance. Wrong component value or damaged resistor.'
    ELSE 'Component failed quality inspection during testing phase. Requires replacement or rework.'
  END
WHERE log_type IN ('error', 'issue')
  AND (part_number IS NULL OR part_number = '');
