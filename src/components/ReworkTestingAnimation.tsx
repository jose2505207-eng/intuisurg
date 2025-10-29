import { useEffect } from 'react';

interface ReworkTestingAnimationProps {
  onComplete: () => void;
}

export function ReworkTestingAnimation({ onComplete }: ReworkTestingAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl w-full">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative flex items-center justify-center w-24 h-24 bg-blue-500 rounded-full">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Preparing Re-Test</h2>
          <p className="text-lg text-slate-600 text-center mb-8">
            Rework completed successfully. Initializing automated testing sequence...
          </p>
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
