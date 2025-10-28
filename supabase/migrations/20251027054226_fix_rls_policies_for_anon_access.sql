/*
  # Fix RLS Policies for Anonymous Access

  ## Overview
  Updates Row Level Security policies to allow anonymous users to access the manufacturing testing system.
  This enables the application to work with the anon key without requiring authentication.

  ## Changes Made

  ### 1. Work Orders Table
  - Drop existing authenticated-only policies
  - Add new policies allowing anon users to SELECT, INSERT, and UPDATE work orders

  ### 2. Bill of Materials Table
  - Drop existing authenticated-only policies
  - Add new policies allowing anon users to SELECT and INSERT BOM entries

  ### 3. Manufacturing Process Instructions Table
  - Drop existing authenticated-only policies
  - Add new policy allowing anon users to SELECT MPIs

  ### 4. Technicians Table
  - Drop existing authenticated-only policies
  - Add new policy allowing anon users to SELECT technicians

  ### 5. Sign Off Operations Table
  - Drop existing authenticated-only policies
  - Add new policies allowing anon users to SELECT and INSERT sign offs

  ### 6. Process Logs Table
  - Drop existing authenticated-only policies
  - Add new policies allowing anon users to SELECT and INSERT process logs

  ### 7. Test Results Table
  - Drop existing authenticated-only policies
  - Add new policies allowing anon users to SELECT, INSERT, and UPDATE test results

  ### 8. Process Logs Database Table
  - Drop existing authenticated-only policies
  - Add new policies allowing anon users to SELECT, INSERT, and UPDATE PL database entries

  ## Security Notes
  - Policies now allow anonymous access for core manufacturing operations
  - All users (authenticated and anonymous) have full access to the system
  - For production environments, consider implementing proper authentication
*/

-- Drop existing policies for work_orders
DROP POLICY IF EXISTS "Allow authenticated users to read work orders" ON work_orders;
DROP POLICY IF EXISTS "Allow authenticated users to insert work orders" ON work_orders;
DROP POLICY IF EXISTS "Allow authenticated users to update work orders" ON work_orders;

-- Create new policies for work_orders (allow anon)
CREATE POLICY "Allow all users to read work orders"
  ON work_orders FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow all users to insert work orders"
  ON work_orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow all users to update work orders"
  ON work_orders FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Drop existing policies for manufacturing_process_instructions
DROP POLICY IF EXISTS "Allow authenticated users to read MPIs" ON manufacturing_process_instructions;
DROP POLICY IF EXISTS "Allow authenticated users to insert MPIs" ON manufacturing_process_instructions;

-- Create new policies for manufacturing_process_instructions (allow anon)
CREATE POLICY "Allow all users to read MPIs"
  ON manufacturing_process_instructions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow all users to insert MPIs"
  ON manufacturing_process_instructions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Drop existing policies for bill_of_materials
DROP POLICY IF EXISTS "Allow authenticated users to read BOM" ON bill_of_materials;
DROP POLICY IF EXISTS "Allow authenticated users to insert BOM" ON bill_of_materials;

-- Create new policies for bill_of_materials (allow anon)
CREATE POLICY "Allow all users to read BOM"
  ON bill_of_materials FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow all users to insert BOM"
  ON bill_of_materials FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Drop existing policies for technicians
DROP POLICY IF EXISTS "Allow authenticated users to read technicians" ON technicians;
DROP POLICY IF EXISTS "Allow authenticated users to insert technicians" ON technicians;

-- Create new policies for technicians (allow anon)
CREATE POLICY "Allow all users to read technicians"
  ON technicians FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow all users to insert technicians"
  ON technicians FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Drop existing policies for sign_off_operations
DROP POLICY IF EXISTS "Allow authenticated users to read sign offs" ON sign_off_operations;
DROP POLICY IF EXISTS "Allow authenticated users to insert sign offs" ON sign_off_operations;

-- Create new policies for sign_off_operations (allow anon)
CREATE POLICY "Allow all users to read sign offs"
  ON sign_off_operations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow all users to insert sign offs"
  ON sign_off_operations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Drop existing policies for process_logs
DROP POLICY IF EXISTS "Allow authenticated users to read process logs" ON process_logs;
DROP POLICY IF EXISTS "Allow authenticated users to insert process logs" ON process_logs;

-- Create new policies for process_logs (allow anon)
CREATE POLICY "Allow all users to read process logs"
  ON process_logs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow all users to insert process logs"
  ON process_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Drop existing policies for test_results
DROP POLICY IF EXISTS "Allow authenticated users to read test results" ON test_results;
DROP POLICY IF EXISTS "Allow authenticated users to insert test results" ON test_results;
DROP POLICY IF EXISTS "Allow authenticated users to update test results" ON test_results;

-- Create new policies for test_results (allow anon)
CREATE POLICY "Allow all users to read test results"
  ON test_results FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow all users to insert test results"
  ON test_results FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow all users to update test results"
  ON test_results FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Drop existing policies for process_logs_database
DROP POLICY IF EXISTS "Allow authenticated users to read PL database" ON process_logs_database;
DROP POLICY IF EXISTS "Allow authenticated users to insert PL database" ON process_logs_database;
DROP POLICY IF EXISTS "Allow authenticated users to update PL database" ON process_logs_database;

-- Create new policies for process_logs_database (allow anon)
CREATE POLICY "Allow all users to read PL database"
  ON process_logs_database FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow all users to insert PL database"
  ON process_logs_database FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow all users to update PL database"
  ON process_logs_database FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);