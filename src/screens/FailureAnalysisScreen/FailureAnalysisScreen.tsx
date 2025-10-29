import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabase';
import { TestResult, ProcessLogDatabase, ManufacturingProcessInstruction, FailureAnalysisResult } from '../../types/database';
import { NavigationBar } from '../../components/NavigationBar';

interface FailureAnalysisScreenProps {
  workOrderId: string;
  orderNumber: string;
  testResult: TestResult;
  onSelectRework: (mpiId: string) => void;
  onViewBOM: () => void;
  onViewSignOff: () => void;
  onViewProcessLogs: () => void;
  onOpenAssistant: () => void;
}

export function FailureAnalysisScreen({
  workOrderId,
  orderNumber,
  testResult,
  onSelectRework,
  onViewBOM,
  onViewSignOff,
  onViewProcessLogs,
  onOpenAssistant
}: FailureAnalysisScreenProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResults, setAnalysisResults] = useState<FailureAnalysisResult[]>([]);

  useEffect(() => {
    performAnalysis();
  }, [testResult]);

  const performAnalysis = async () => {
    setIsAnalyzing(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      if (!testResult.failure_codes || testResult.failure_codes.length === 0) {
        setAnalysisResults([]);
        setIsAnalyzing(false);
        return;
      }

      const { data: plData, error: plError } = await supabase
        .from('process_logs_database')
        .select('*')
        .in('failure_code', testResult.failure_codes);

      if (plError) throw plError;

      const resultsWithMPIs: FailureAnalysisResult[] = [];

      for (const pl of plData || []) {
        const { data: mpiData } = await supabase
          .from('manufacturing_process_instructions')
          .select('*')
          .eq('id', pl.corrective_mpi_id)
          .maybeSingle();

        if (mpiData) {
          const { data: allSteps } = await supabase
            .from('manufacturing_process_instructions')
            .select('*')
            .eq('title', mpiData.title.split(' - ')[0])
            .order('step_number', { ascending: true });

          const similarityScore = calculateSimilarity(testResult, pl);

          resultsWithMPIs.push({
            pl,
            similarity_score: similarityScore,
            mpi_steps: allSteps || []
          });
        }
      }

      resultsWithMPIs.sort((a, b) => {
        const scoreA = (a.similarity_score * 0.4) + (a.pl.success_rate * 0.6);
        const scoreB = (b.similarity_score * 0.4) + (b.pl.success_rate * 0.6);
        return scoreB - scoreA;
      });

      setAnalysisResults(resultsWithMPIs);
    } catch (err) {
      console.error('Error performing analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateSimilarity = (test: TestResult, pl: ProcessLogDatabase): number => {
    let score = 0;

    if (test.failure_codes?.includes(pl.failure_code)) {
      score += 40;
    }

    if (test.voltage && test.voltage > 240 && pl.symptoms.some(s => s.toLowerCase().includes('voltage'))) {
      score += 20;
    }

    if (test.pressure && test.pressure < 50 && pl.symptoms.some(s => s.toLowerCase().includes('pressure'))) {
      score += 20;
    }

    if (test.temperature && test.temperature > 80 && pl.symptoms.some(s => s.toLowerCase().includes('temperature'))) {
      score += 20;
    }

    return Math.min(score, 100);
  };


  if (isAnalyzing) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Failure</h2>
            <p className="text-slate-600 mb-4">
              Comparing test results with historical process logs...
            </p>
            <div className="space-y-2 text-left">
              <div className="flex items-center text-sm text-slate-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Extracting failure patterns
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Matching with database PLs
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Calculating probability scores
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <NavigationBar
        orderNumber={orderNumber}
        onViewBOM={onViewBOM}
        onViewSignOff={onViewSignOff}
        onViewProcessLogs={onViewProcessLogs}
        onOpenAssistant={onOpenAssistant}
      />
      <div className="flex-1 overflow-auto p-6">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Failure Analysis Results
            </h1>
            <p className="text-slate-600">Work Order: {orderNumber}</p>
          </div>

          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Test Failed - Issues Detected</h3>
                <div className="space-y-1 text-sm text-red-800">
                  {testResult.failure_codes?.map((code, index) => (
                    <div key={index} className="flex items-center">
                      <span className="font-mono bg-red-100 px-2 py-0.5 rounded mr-2">{code}</span>
                      {code === 'VOLT-HIGH' && <span>Voltage exceeded acceptable range ({testResult.voltage?.toFixed(1)}V)</span>}
                      {code === 'PRESS-LOW' && <span>Pressure below minimum threshold ({testResult.pressure?.toFixed(1)} PSI)</span>}
                      {code === 'TEMP-HIGH' && <span>Temperature exceeded operational limits ({testResult.temperature?.toFixed(1)}°C)</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {analysisResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600">No matching process logs found in the database.</p>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Recommended Corrective Actions
                <span className="text-sm font-normal text-slate-600 ml-2">
                  (Ranked by probability of success)
                </span>
              </h2>

              <div className="space-y-4">
                {analysisResults.map((result, index) => {
                  const combinedProbability = (result.similarity_score * 0.4) + (result.pl.success_rate * 0.6);

                  return (
                    <div
                      key={result.pl.id}
                      className="border border-gray-300 rounded-lg overflow-hidden shadow-04-dp hover:shadow-08-dp transition-all"
                    >
                      <div className="bg-surface p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-x02-secondary200 bg-opacity-10 text-x01-primary500 rounded-full font-headline-6 font-[number:var(--headline-6-font-weight)] text-lg flex-shrink-0">
                            #{index + 1}
                          </div>
                          <div>
                            <h3 className="font-headline-6 text-[20px] font-[number:var(--headline-6-font-weight)] tracking-[var(--headline-6-letter-spacing)] leading-[var(--headline-6-line-height)] text-x00-on-surface-high-emphasis mb-1">
                              {result.pl.failure_description}
                            </h3>
                            <p className="font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-x00-on-surface-medium-emphasis mb-2">
                              Process Log: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-x00-on-surface-high-emphasis">{result.pl.pl_number}</span>
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-surface p-3 rounded border border-gray-300 shadow-04-dp">
                            <p className="font-body-2 text-[11px] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-x00-on-surface-medium-emphasis mb-1">Historical Occurrences</p>
                            <p className="font-headline-6 text-[22px] font-[number:var(--headline-6-font-weight)] text-x00-on-surface-high-emphasis">{result.pl.occurrence_count}</p>
                          </div>
                          <div className="bg-surface p-3 rounded border border-gray-300 shadow-04-dp">
                            <p className="font-body-2 text-[11px] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-x00-on-surface-medium-emphasis mb-1">Success Rate</p>
                            <p className="font-headline-6 text-[22px] font-[number:var(--headline-6-font-weight)] text-green-600">{result.pl.success_rate}%</p>
                          </div>
                          <div className="bg-surface p-3 rounded border border-gray-300 shadow-04-dp">
                            <p className="font-body-2 text-[11px] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-x00-on-surface-medium-emphasis mb-1">Match Score</p>
                            <p className="font-headline-6 text-[22px] font-[number:var(--headline-6-font-weight)] text-x01-primary500">{result.similarity_score}%</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="font-body-2 text-[length:var(--body-2-font-size)] font-medium tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-x00-on-surface-high-emphasis mb-2">Root Cause:</p>
                          <p className="font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-x00-on-surface-medium-emphasis bg-gray-50 p-3 rounded border border-gray-200">
                            {result.pl.root_cause}
                          </p>
                        </div>

                        <Button
                          onClick={() => onSelectRework(result.pl.corrective_mpi_id)}
                          className="w-full font-button text-[length:var(--button-font-size)] font-[number:var(--button-font-weight)] tracking-[var(--button-letter-spacing)] bg-x01-primary500 hover:bg-x01-primary600 text-x03-on-primary-high-emphasis shadow-04-dp"
                        >
                          VIEW CORRECTIVE INSTRUCTIONS ({result.mpi_steps.length} STEPS)
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
