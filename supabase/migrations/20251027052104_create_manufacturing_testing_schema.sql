/*
  # Manufacturing Testing System Schema

  ## Overview
  Complete database schema for a manufacturing testing and quality control system
  with AI-powered failure analysis and corrective action tracking.

  ## New Tables

  ### 1. `work_orders`
  - `id` (uuid, primary key)
  - `order_number` (text, unique) - Scannable work order identifier
  - `product_name` (text) - Name of product being manufactured
  - `status` (text) - Current status: 'pending', 'testing', 'failed', 'rework', 'passed'
  - `created_at` (timestamptz) - Order creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `manufacturing_process_instructions` (MPIs)
  - `id` (uuid, primary key)
  - `title` (text) - MPI title
  - `instruction_type` (text) - 'setup', 'testing', 'rework'
  - `step_number` (integer) - Step sequence number
  - `instruction_text` (text) - Detailed instruction content
  - `parent_mpi_id` (uuid, nullable) - Links rework instructions to original
  - `created_at` (timestamptz)

  ### 3. `bill_of_materials` (BOM)
  - `id` (uuid, primary key)
  - `work_order_id` (uuid, foreign key)
  - `vendor_denomination` (text) - Vendor/supplier name
  - `part_number` (text) - Component part number
  - `serial_number` (text) - Unique serial identifier
  - `created_at` (timestamptz)

  ### 4. `technicians`
  - `id` (uuid, primary key)
  - `name` (text) - Technician full name
  - `employee_id` (text, unique) - Employee identifier
  - `created_at` (timestamptz)

  ### 5. `sign_off_operations`
  - `id` (uuid, primary key)
  - `work_order_id` (uuid, foreign key)
  - `technician_id` (uuid, foreign key)
  - `operation_name` (text) - Name of operation performed
  - `operation_order` (integer) - Sequence of operation
  - `completed_at` (timestamptz) - Completion date and time
  - `created_at` (timestamptz)

  ### 6. `process_logs`
  - `id` (uuid, primary key)
  - `work_order_id` (uuid, foreign key)
  - `log_type` (text) - 'info', 'warning', 'error', 'issue'
  - `message` (text) - Log message describing the issue
  - `resolution` (text, nullable) - How the issue was resolved
  - `created_at` (timestamptz)

  ### 7. `test_results`
  - `id` (uuid, primary key)
  - `work_order_id` (uuid, foreign key)
  - `test_run_number` (integer) - Which test attempt (1st, 2nd after rework, etc)
  - `test_status` (text) - 'running', 'passed', 'failed'
  - `sensor_1_value` (numeric) - Hypothetical sensor metric
  - `sensor_2_value` (numeric)
  - `sensor_3_value` (numeric)
  - `temperature` (numeric) - Test temperature
  - `pressure` (numeric) - Test pressure
  - `voltage` (numeric) - Test voltage
  - `failure_codes` (text[]) - Array of failure codes detected
  - `started_at` (timestamptz)
  - `completed_at` (timestamptz, nullable)
  - `created_at` (timestamptz)

  ### 8. `process_logs_database` (PLs)
  - `id` (uuid, primary key)
  - `pl_number` (text, unique) - Process Log reference number
  - `failure_code` (text) - Standardized failure code
  - `failure_description` (text) - Detailed failure description
  - `symptoms` (text[]) - Array of observed symptoms
  - `root_cause` (text) - Identified root cause
  - `corrective_mpi_id` (uuid, foreign key) - Links to corrective MPI
  - `occurrence_count` (integer) - How many times this failure occurred
  - `success_rate` (numeric) - Percentage of successful fixes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated access

  ## Notes
  - This schema supports complete workflow from work order input through testing,
    failure analysis, rework, and final validation
  - AI analysis uses process_logs_database to match failure patterns
  - Success rates help rank probable solutions
*/

-- Create work_orders table
CREATE TABLE IF NOT EXISTS work_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  product_name text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'testing', 'failed', 'rework', 'passed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create manufacturing_process_instructions table
CREATE TABLE IF NOT EXISTS manufacturing_process_instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  instruction_type text NOT NULL CHECK (instruction_type IN ('setup', 'testing', 'rework')),
  step_number integer NOT NULL,
  instruction_text text NOT NULL,
  parent_mpi_id uuid REFERENCES manufacturing_process_instructions(id),
  created_at timestamptz DEFAULT now()
);

-- Create bill_of_materials table
CREATE TABLE IF NOT EXISTS bill_of_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  vendor_denomination text NOT NULL,
  part_number text NOT NULL,
  serial_number text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create technicians table
CREATE TABLE IF NOT EXISTS technicians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  employee_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create sign_off_operations table
CREATE TABLE IF NOT EXISTS sign_off_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  technician_id uuid REFERENCES technicians(id),
  operation_name text NOT NULL,
  operation_order integer NOT NULL,
  completed_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create process_logs table
CREATE TABLE IF NOT EXISTS process_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  log_type text DEFAULT 'info' CHECK (log_type IN ('info', 'warning', 'error', 'issue')),
  message text NOT NULL,
  resolution text,
  created_at timestamptz DEFAULT now()
);

-- Create test_results table
CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  test_run_number integer DEFAULT 1,
  test_status text DEFAULT 'running' CHECK (test_status IN ('running', 'passed', 'failed')),
  sensor_1_value numeric,
  sensor_2_value numeric,
  sensor_3_value numeric,
  temperature numeric,
  pressure numeric,
  voltage numeric,
  failure_codes text[],
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create process_logs_database table (PL repository)
CREATE TABLE IF NOT EXISTS process_logs_database (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pl_number text UNIQUE NOT NULL,
  failure_code text NOT NULL,
  failure_description text NOT NULL,
  symptoms text[] NOT NULL,
  root_cause text NOT NULL,
  corrective_mpi_id uuid REFERENCES manufacturing_process_instructions(id),
  occurrence_count integer DEFAULT 1,
  success_rate numeric DEFAULT 0.0 CHECK (success_rate >= 0 AND success_rate <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturing_process_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_of_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE sign_off_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_logs_database ENABLE ROW LEVEL SECURITY;

-- RLS Policies for work_orders
CREATE POLICY "Allow authenticated users to read work orders"
  ON work_orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert work orders"
  ON work_orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update work orders"
  ON work_orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for manufacturing_process_instructions
CREATE POLICY "Allow authenticated users to read MPIs"
  ON manufacturing_process_instructions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert MPIs"
  ON manufacturing_process_instructions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for bill_of_materials
CREATE POLICY "Allow authenticated users to read BOM"
  ON bill_of_materials FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert BOM"
  ON bill_of_materials FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for technicians
CREATE POLICY "Allow authenticated users to read technicians"
  ON technicians FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert technicians"
  ON technicians FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for sign_off_operations
CREATE POLICY "Allow authenticated users to read sign offs"
  ON sign_off_operations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert sign offs"
  ON sign_off_operations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for process_logs
CREATE POLICY "Allow authenticated users to read process logs"
  ON process_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert process logs"
  ON process_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for test_results
CREATE POLICY "Allow authenticated users to read test results"
  ON test_results FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert test results"
  ON test_results FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update test results"
  ON test_results FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for process_logs_database
CREATE POLICY "Allow authenticated users to read PL database"
  ON process_logs_database FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert PL database"
  ON process_logs_database FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update PL database"
  ON process_logs_database FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_work_orders_order_number ON work_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_mpi_type ON manufacturing_process_instructions(instruction_type);
CREATE INDEX IF NOT EXISTS idx_bom_work_order ON bill_of_materials(work_order_id);
CREATE INDEX IF NOT EXISTS idx_sign_offs_work_order ON sign_off_operations(work_order_id);
CREATE INDEX IF NOT EXISTS idx_process_logs_work_order ON process_logs(work_order_id);
CREATE INDEX IF NOT EXISTS idx_test_results_work_order ON test_results(work_order_id);
CREATE INDEX IF NOT EXISTS idx_pl_database_failure_code ON process_logs_database(failure_code);