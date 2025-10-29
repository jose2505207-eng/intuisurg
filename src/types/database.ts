export type WorkOrderStatus = 'pending' | 'testing' | 'failed' | 'rework' | 'passed';
export type InstructionType = 'setup' | 'testing' | 'rework';
export type LogType = 'info' | 'warning' | 'error' | 'issue';
export type TestStatus = 'running' | 'passed' | 'failed';

export interface WorkOrder {
  id: string;
  order_number: string;
  product_name: string;
  status: WorkOrderStatus;
  created_at: string;
  updated_at: string;
}

export interface ManufacturingProcessInstruction {
  id: string;
  title: string;
  instruction_type: InstructionType;
  step_number: number;
  instruction_text: string;
  parent_mpi_id: string | null;
  created_at: string;
}

export interface BillOfMaterial {
  id: string;
  work_order_id: string;
  component_name: string;
  part_number: string;
  serial_number: string;
  created_at: string;
}

export interface Technician {
  id: string;
  name: string;
  employee_id: string;
  created_at: string;
}

export interface SignOffOperation {
  id: string;
  work_order_id: string;
  technician_id: string;
  operation_name: string;
  operation_order: number;
  completed_at: string;
  created_at: string;
  technician?: Technician;
}

export interface ProcessLog {
  id: string;
  work_order_id: string;
  log_type: LogType;
  message: string;
  resolution: string | null;
  part_number: string | null;
  reference_designator: string | null;
  tracking_id: string | null;
  operation_found: string | null;
  technician_found: string | null;
  defect_description: string | null;
  created_at: string;
}

export interface TestResult {
  id: string;
  work_order_id: string;
  test_run_number: number;
  test_status: TestStatus;
  sensor_1_value: number | null;
  sensor_2_value: number | null;
  sensor_3_value: number | null;
  temperature: number | null;
  pressure: number | null;
  voltage: number | null;
  failure_codes: string[] | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface ProcessLogDatabase {
  id: string;
  pl_number: string;
  failure_code: string;
  failure_description: string;
  symptoms: string[];
  root_cause: string;
  corrective_mpi_id: string;
  occurrence_count: number;
  success_rate: number;
  created_at: string;
  updated_at: string;
}

export interface FailureAnalysisResult {
  pl: ProcessLogDatabase;
  similarity_score: number;
  mpi_steps: ManufacturingProcessInstruction[];
}
