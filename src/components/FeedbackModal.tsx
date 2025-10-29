import { useState } from 'react';
import { Button } from './ui/button';
import { supabase } from '../lib/supabase';
import { ProcessLogDatabase, ManufacturingProcessInstruction } from '../types/database';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  orderNumber: string;
  processLogDatabase: ProcessLogDatabase;
  correctiveMpi: ManufacturingProcessInstruction[];
  testResultId: string;
  wasSuccessful: boolean;
}

export function FeedbackModal({
  isOpen,
  onClose,
  workOrderId,
  orderNumber,
  processLogDatabase,
  correctiveMpi,
  testResultId,
  wasSuccessful
}: FeedbackModalProps) {
  const [rating, setRating] = useState<1 | 2 | 3 | null>(null);
  const [comments, setComments] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!rating) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('rework_feedback')
        .insert({
          work_order_id: workOrderId,
          process_log_database_id: processLogDatabase.id,
          corrective_mpi_id: correctiveMpi[0]?.id,
          test_result_id: testResultId,
          rating,
          was_successful: wasSuccessful,
          comments: comments.trim() || null,
          technician_name: technicianName.trim() || null
        });

      if (error) throw error;

      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setRating(null);
        setComments('');
        setTechnicianName('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (r: 1 | 2 | 3) => {
    switch (r) {
      case 1: return 'Not Helpful';
      case 2: return 'Somewhat Helpful';
      case 3: return 'Very Helpful';
    }
  };

  const getRatingIcon = (r: 1 | 2 | 3) => {
    switch (r) {
      case 1:
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 000 2h.01a1 1 0 100-2H7zm5.99 0a1 1 0 000 2H13a1 1 0 100-2h-.01z" />
          </svg>
        );
      case 2:
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 3:
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-2a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  if (isSubmitted) {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scale-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
            <p className="text-slate-600">Your feedback helps improve our AI recommendations.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Rate AI Suggestion</h2>
                  <p className="text-blue-100 text-sm">Work Order: {orderNumber}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
            <div className="mb-6">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-slate-900 mb-2">Corrective Action Used:</h3>
                <p className="text-slate-700 font-medium">{processLogDatabase.failure_description}</p>
                <p className="text-sm text-slate-600 mt-1">
                  Process Log: <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">{processLogDatabase.pl_number}</span>
                </p>
              </div>

              <div className={`p-4 rounded-lg ${wasSuccessful ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2">
                  {wasSuccessful ? (
                    <>
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-green-900">Rework Test Passed</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-red-900">Rework Test Failed</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">How helpful was this AI suggestion?</h3>
              <div className="grid grid-cols-3 gap-3">
                {([1, 2, 3] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      rating === r
                        ? r === 1
                          ? 'border-red-500 bg-red-50'
                          : r === 2
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-green-500 bg-green-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`flex flex-col items-center gap-2 ${
                      rating === r
                        ? r === 1
                          ? 'text-red-600'
                          : r === 2
                          ? 'text-yellow-600'
                          : 'text-green-600'
                        : 'text-slate-400'
                    }`}>
                      {getRatingIcon(r)}
                      <span className="text-sm font-medium text-slate-900">{getRatingLabel(r)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-slate-900 mb-2">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-slate-900 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share any additional feedback about this suggestion..."
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-200">
            <Button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700"
              disabled={isSubmitting}
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!rating || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
