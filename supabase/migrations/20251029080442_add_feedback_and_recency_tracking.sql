/*
  # Add Feedback and Recency Tracking System

  ## Overview
  Enhances the manufacturing testing system with AI feedback collection and failure recency tracking
  to improve recommendation quality and provide temporal context for failure patterns.

  ## New Tables

  ### 1. `rework_feedback`
  - `id` (uuid, primary key)
  - `work_order_id` (uuid, foreign key) - Links to the work order where rework was performed
  - `process_log_database_id` (uuid, foreign key) - Links to the PL recommendation that was followed
  - `corrective_mpi_id` (uuid, foreign key) - The MPI that was used for rework
  - `test_result_id` (uuid, foreign key) - The test result after rework
  - `rating` (integer) - Feedback rating: 1 (not helpful), 2 (somewhat helpful), 3 (very helpful)
  - `was_successful` (boolean) - Whether the rework resolved the issue
  - `comments` (text, nullable) - Optional detailed feedback from technician
  - `technician_name` (text, nullable) - Name of technician providing feedback
  - `created_at` (timestamptz) - When feedback was submitted

  ## Modified Tables

  ### `process_logs_database`
  - Add `last_occurrence_date` (timestamptz) - When this failure pattern was last encountered
  - Add `average_feedback_rating` (numeric) - Average rating from feedback (1.0 to 3.0)
  - Add `total_feedback_count` (integer) - Total number of feedback submissions
  - Add `positive_feedback_count` (integer) - Count of helpful feedback (rating >= 2)

  ## Security
  - Enable RLS on new table
  - Add policies for authenticated and anonymous access
  - Update indexes for efficient recency queries

  ## Notes
  - Feedback system creates learning loop for AI recommendations
  - Recency tracking helps prioritize current vs historical failure patterns
  - Average feedback rating influences recommendation scoring
*/

-- Add new columns to process_logs_database
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'process_logs_database' AND column_name = 'last_occurrence_date'
  ) THEN
    ALTER TABLE process_logs_database ADD COLUMN last_occurrence_date timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'process_logs_database' AND column_name = 'average_feedback_rating'
  ) THEN
    ALTER TABLE process_logs_database ADD COLUMN average_feedback_rating numeric DEFAULT 2.0 CHECK (average_feedback_rating >= 1.0 AND average_feedback_rating <= 3.0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'process_logs_database' AND column_name = 'total_feedback_count'
  ) THEN
    ALTER TABLE process_logs_database ADD COLUMN total_feedback_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'process_logs_database' AND column_name = 'positive_feedback_count'
  ) THEN
    ALTER TABLE process_logs_database ADD COLUMN positive_feedback_count integer DEFAULT 0;
  END IF;
END $$;

-- Create rework_feedback table
CREATE TABLE IF NOT EXISTS rework_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  process_log_database_id uuid REFERENCES process_logs_database(id),
  corrective_mpi_id uuid REFERENCES manufacturing_process_instructions(id),
  test_result_id uuid REFERENCES test_results(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 3),
  was_successful boolean DEFAULT false,
  comments text,
  technician_name text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on rework_feedback
ALTER TABLE rework_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rework_feedback (allow anonymous for demo purposes)
CREATE POLICY "Allow all to read rework feedback"
  ON rework_feedback FOR SELECT
  USING (true);

CREATE POLICY "Allow all to insert rework feedback"
  ON rework_feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read rework feedback"
  ON rework_feedback FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert rework feedback"
  ON rework_feedback FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_rework_feedback_work_order ON rework_feedback(work_order_id);
CREATE INDEX IF NOT EXISTS idx_rework_feedback_pl_database ON rework_feedback(process_log_database_id);
CREATE INDEX IF NOT EXISTS idx_rework_feedback_created_at ON rework_feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_pl_database_last_occurrence ON process_logs_database(last_occurrence_date DESC);

-- Create function to update process_logs_database statistics when feedback is added
CREATE OR REPLACE FUNCTION update_pl_feedback_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE process_logs_database
  SET
    total_feedback_count = total_feedback_count + 1,
    positive_feedback_count = positive_feedback_count + CASE WHEN NEW.rating >= 2 THEN 1 ELSE 0 END,
    average_feedback_rating = (
      SELECT AVG(rating)::numeric
      FROM rework_feedback
      WHERE process_log_database_id = NEW.process_log_database_id
    ),
    last_occurrence_date = NEW.created_at
  WHERE id = NEW.process_log_database_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update statistics
DROP TRIGGER IF EXISTS trigger_update_pl_feedback_stats ON rework_feedback;
CREATE TRIGGER trigger_update_pl_feedback_stats
  AFTER INSERT ON rework_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_pl_feedback_stats();

-- Update existing process_logs_database records with initial last_occurrence_date
UPDATE process_logs_database
SET last_occurrence_date = created_at
WHERE last_occurrence_date IS NULL;