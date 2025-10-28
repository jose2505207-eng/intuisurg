import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { ManufacturingProcessInstruction, InstructionType } from '../../types/database';
import { supabase } from '../../lib/supabase';
import { NavigationBar } from '../../components/NavigationBar';

interface MPIViewerProps {
  workOrderId: string;
  orderNumber: string;
  instructionType: InstructionType;
  specificMpiId?: string;
  onComplete: () => void;
  onCancel?: () => void;
  onViewBOM?: () => void;
  onViewSignOff?: () => void;
  onViewProcessLogs?: () => void;
  onOpenAssistant?: () => void;
}

export function MPIViewer({ workOrderId, orderNumber, instructionType, specificMpiId, onComplete, onCancel, onViewBOM, onViewSignOff, onViewProcessLogs, onOpenAssistant }: MPIViewerProps) {
  const [instructions, setInstructions] = useState<ManufacturingProcessInstruction[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInstructions();
  }, [instructionType, specificMpiId]);

  const loadInstructions = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('manufacturing_process_instructions')
        .select('*')
        .order('step_number', { ascending: true });

      if (specificMpiId) {
        const { data: specificMpi } = await supabase
          .from('manufacturing_process_instructions')
          .select('*')
          .eq('id', specificMpiId)
          .maybeSingle();

        if (specificMpi) {
          query = supabase
            .from('manufacturing_process_instructions')
            .select('*')
            .eq('title', specificMpi.title.split(' - ')[0])
            .order('step_number', { ascending: true });
        }
      } else {
        query = query.eq('instruction_type', instructionType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setInstructions(data || []);
    } catch (err) {
      console.error('Error loading instructions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (instructions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-slate-600">No instructions found</p>
          <Button onClick={onComplete} className="mt-4">Continue</Button>
        </div>
      </div>
    );
  }

  const currentInstruction = instructions[currentStep];
  const progress = ((currentStep + 1) / instructions.length) * 100;

  return (
    <div className="h-screen bg-surface flex flex-col animate-fade-in">
        {onViewBOM && onViewSignOff && onViewProcessLogs && onOpenAssistant && (
          <NavigationBar
            orderNumber={orderNumber}
            onViewBOM={onViewBOM}
            onViewSignOff={onViewSignOff}
            onViewProcessLogs={onViewProcessLogs}
            onOpenAssistant={onOpenAssistant}
          />
        )}
        <div className="flex-1 overflow-auto p-6">
        <div className="bg-surface rounded-lg shadow-08-dp overflow-hidden h-full flex flex-col">
          <div className="bg-x01-primary500 p-6 text-x03-on-primary-high-emphasis">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-headline-6 text-[24px] font-[number:var(--headline-6-font-weight)] tracking-[var(--headline-6-letter-spacing)] leading-[var(--headline-6-line-height)]">
                {instructionType === 'setup' ? 'Testing Setup Instructions' :
                 instructionType === 'rework' ? 'Rework Instructions' :
                 'Testing Instructions'}
              </h1>
              {onCancel && (
                <Button
                  onClick={onCancel}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-x03-on-primary-high-emphasis hover:bg-white/20 font-button text-[length:var(--button-font-size)] font-[number:var(--button-font-weight)] tracking-[var(--button-letter-spacing)] shadow-04-dp"
                >
                  CANCEL
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                <span>Step {currentStep + 1} of {instructions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-x03-on-primary-high-emphasis rounded-full h-3 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="font-headline-6 text-[22px] font-[number:var(--headline-6-font-weight)] tracking-[var(--headline-6-letter-spacing)] leading-[var(--headline-6-line-height)] text-x00-on-surface-high-emphasis mb-2">
                {currentInstruction.title}
              </h2>
              <div className="inline-flex items-center px-3 py-1 rounded-full font-body-2 text-[length:var(--body-2-font-size)] font-medium tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] bg-x02-secondary200 bg-opacity-10 text-x01-primary500">
                Step {currentInstruction.step_number}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded p-6 mb-8 shadow-04-dp">
              <p className="font-body-2 text-[16px] tracking-[var(--body-2-letter-spacing)] leading-relaxed text-x00-on-surface-high-emphasis">
                {currentInstruction.instruction_text}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
                className="min-w-32"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Button>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    {currentStep === instructions.length - 1
                      ? 'Complete this step to continue'
                      : `${instructions.length - currentStep - 1} steps remaining`}
                  </p>
                </div>
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="text-slate-600 hover:text-slate-900"
                >
                  Skip All
                </Button>
              </div>

              <Button
                onClick={handleNext}
                className="min-w-32"
              >
                {currentStep === instructions.length - 1 ? (
                  'Complete'
                ) : (
                  <>
                    Next
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-yellow-800">
              Follow all safety protocols and ensure proper equipment calibration before proceeding with each step.
            </p>
          </div>
        </div>
        </div>
        </div>
    </div>
  );
}
