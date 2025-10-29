/*
  # Rename vendor_denomination to component_name and Update Data

  ## Overview
  This migration renames the `vendor_denomination` column to `component_name` in the
  `bill_of_materials` table and updates all existing data to use generic component names
  instead of real company names.

  ## Changes
  1. Rename column from `vendor_denomination` to `component_name`
  2. Update all existing records with appropriate component names based on their category
  3. Maintain all part numbers, serial numbers, and relationships

  ## Component Name Mappings
  Real company names are replaced with generic component types:
  - Microcontrollers: Texas Instruments → ARM Microcontroller, etc.
  - Sensors: Bosch Sensortec → Temperature Sensor, etc.
  - Power: Mean Well → DC-DC Converter, etc.
  - Capacitors: Murata → Ceramic Capacitor, etc.
  - Resistors: Vishay → Precision Resistor, etc.
  - Connectors: Molex → Board Connector, etc.
  - Protection: Littelfuse → Fuse, etc.
  - Communication: Maxim → CAN Transceiver, etc.
  - Memory: Micron → Flash Memory, etc.

  ## Notes
  - All part numbers and serial numbers remain unchanged
  - Migration is idempotent and can be run multiple times safely
  - Component names are generic and do not reference real companies
*/

-- Rename the column from vendor_denomination to component_name
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bill_of_materials' AND column_name = 'vendor_denomination'
  ) THEN
    ALTER TABLE bill_of_materials RENAME COLUMN vendor_denomination TO component_name;
  END IF;
END $$;

-- Update existing data with generic component names
UPDATE bill_of_materials SET component_name = 'ARM Microcontroller' WHERE component_name = 'Texas Instruments';
UPDATE bill_of_materials SET component_name = 'DSP Processor' WHERE component_name = 'STMicroelectronics';
UPDATE bill_of_materials SET component_name = 'System Controller' WHERE component_name = 'Microchip Technology';

UPDATE bill_of_materials SET component_name = 'Temperature Sensor' WHERE component_name = 'Bosch Sensortec';
UPDATE bill_of_materials SET component_name = 'Pressure Sensor' WHERE component_name = 'Honeywell';
UPDATE bill_of_materials SET component_name = 'Humidity Sensor' WHERE component_name = 'Sensirion';
UPDATE bill_of_materials SET component_name = 'Hall Effect Sensor' WHERE component_name = 'Infineon Technologies';

UPDATE bill_of_materials SET component_name = 'DC-DC Converter' WHERE component_name = 'Mean Well';
UPDATE bill_of_materials SET component_name = 'Power Supply Module' WHERE component_name = 'Phoenix Contact';
UPDATE bill_of_materials SET component_name = 'Voltage Regulator' WHERE component_name = 'TDK-Lambda';

UPDATE bill_of_materials SET component_name = 'Ceramic Capacitor' WHERE component_name = 'Murata Electronics';
UPDATE bill_of_materials SET component_name = 'Electrolytic Capacitor' WHERE component_name = 'Kemet Corporation';
UPDATE bill_of_materials SET component_name = 'Tantalum Capacitor' WHERE component_name = 'TDK Corporation';

UPDATE bill_of_materials SET component_name = 'Precision Resistor' WHERE component_name = 'Vishay Intertechnology';
UPDATE bill_of_materials SET component_name = 'Power Resistor' WHERE component_name = 'Yageo Corporation';

UPDATE bill_of_materials SET component_name = 'Board Connector' WHERE component_name = 'Molex';
UPDATE bill_of_materials SET component_name = 'Cable Connector' WHERE component_name = 'TE Connectivity';
UPDATE bill_of_materials SET component_name = 'Terminal Block' WHERE component_name = 'Amphenol';

UPDATE bill_of_materials SET component_name = 'Fuse' WHERE component_name = 'Littelfuse';
UPDATE bill_of_materials SET component_name = 'TVS Diode' WHERE component_name = 'Bourns';

UPDATE bill_of_materials SET component_name = 'CAN Transceiver' WHERE component_name = 'Maxim Integrated';
UPDATE bill_of_materials SET component_name = 'RS-485 Interface' WHERE component_name = 'Analog Devices';

UPDATE bill_of_materials SET component_name = 'Flash Memory' WHERE component_name = 'Micron Technology';
UPDATE bill_of_materials SET component_name = 'EEPROM' WHERE component_name = 'Winbond Electronics';
