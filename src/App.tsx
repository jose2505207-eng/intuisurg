import { useState, useEffect } from 'react';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { MPIViewer } from './screens/MPIViewer';
import { TestingScreen } from './screens/TestingScreen';
import { BOMScreen } from './screens/BOMScreen';
import { SignOffScreen } from './screens/SignOffScreen';
import { ProcessLogsScreen } from './screens/ProcessLogsScreen';
import { FailureAnalysisScreen } from './screens/FailureAnalysisScreen';
import { FinalDocumentationScreen } from './screens/FinalDocumentationScreen';
import { IntuitiveAssistant } from './components/IntuitiveAssistant';
import { TestResult } from './types/database';

type AppScreen =
  | 'welcome'
  | 'setup-instructions'
  | 'testing'
  | 'bom'
  | 'signoff'
  | 'process-logs'
  | 'failure-analysis'
  | 'rework-instructions'
  | 'retesting'
  | 'success'
  | 'final-documentation';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [workOrderId, setWorkOrderId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [selectedReworkMpiId, setSelectedReworkMpiId] = useState<string>('');
  const [previousScreen, setPreviousScreen] = useState<AppScreen>('testing');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Test state management
  const [testProgress, setTestProgress] = useState(0);
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'complete'>('idle');
  const [isRetesting, setIsRetesting] = useState(false);
  const [sensorData, setSensorData] = useState({
    sensor_1: 0,
    sensor_2: 0,
    sensor_3: 0,
    temperature: 0,
    pressure: 0,
    voltage: 0
  });

  const handleWorkOrderScanned = (id: string, number: string) => {
    setWorkOrderId(id);
    setOrderNumber(number);
    setCurrentScreen('setup-instructions');
  };

  const handleSetupComplete = () => {
    setCurrentScreen('testing');
  };

  const handleTestComplete = (result: TestResult) => {
    setTestResult(result);
    if (result.test_status === 'failed') {
      setCurrentScreen('failure-analysis');
    } else {
      setCurrentScreen('success');
    }
  };

  const handleViewBOM = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('bom');
  };

  const handleViewSignOff = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('signoff');
  };

  const handleViewProcessLogs = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('process-logs');
  };

  const handleViewFinalDocumentation = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('final-documentation');
  };

  const handleCloseOverlay = () => {
    setCurrentScreen(previousScreen);
  };

  const handleSelectRework = (mpiId: string) => {
    setSelectedReworkMpiId(mpiId);
    setCurrentScreen('rework-instructions');
  };

  const handleReworkComplete = () => {
    setCurrentScreen('retesting');
  };

  const handleRetestComplete = (result: TestResult) => {
    setTestResult(result);
    if (result.test_status === 'passed') {
      setCurrentScreen('success');
    } else {
      setCurrentScreen('failure-analysis');
    }
  };

  const handleStartOver = () => {
    setCurrentScreen('welcome');
    setWorkOrderId('');
    setOrderNumber('');
    setTestResult(null);
    setSelectedReworkMpiId('');
    setTestProgress(0);
    setTestStatus('idle');
    setIsRetesting(false);
  };

  // Test progress effect - runs in background
  useEffect(() => {
    if (testStatus === 'running') {
      const interval = setInterval(() => {
        setTestProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });

        setSensorData({
          sensor_1: 95 + Math.random() * 10,
          sensor_2: 48 + Math.random() * 8,
          sensor_3: 72 + Math.random() * 6,
          temperature: isRetesting ? 68 + Math.random() * 8 : 82 + Math.random() * 12,
          pressure: isRetesting ? 95 + Math.random() * 10 : 45 + Math.random() * 10,
          voltage: isRetesting ? 220 + Math.random() * 15 : 245 + Math.random() * 20
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [testStatus, isRetesting]);

  // Auto-complete test when progress reaches 100
  useEffect(() => {
    if (testProgress === 100 && testStatus === 'running') {
      setTestStatus('complete');
    }
  }, [testProgress, testStatus]);

  return (
    <div className="h-full">
      {currentScreen === 'welcome' && (
        <WelcomeScreen onWorkOrderScanned={handleWorkOrderScanned} />
      )}

      {currentScreen === 'setup-instructions' && (
        <MPIViewer
          workOrderId={workOrderId}
          orderNumber={orderNumber}
          instructionType="setup"
          onComplete={handleSetupComplete}
          onViewBOM={handleViewBOM}
          onViewSignOff={handleViewSignOff}
          onViewProcessLogs={handleViewProcessLogs}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />
      )}

      {currentScreen === 'testing' && (
        <TestingScreen
          workOrderId={workOrderId}
          orderNumber={orderNumber}
          isRetesting={false}
          testProgress={testProgress}
          testStatus={testStatus}
          sensorData={sensorData}
          onStartTest={() => {
            setTestStatus('running');
            setTestProgress(0);
            setIsRetesting(false);
          }}
          onTestComplete={handleTestComplete}
          onViewBOM={handleViewBOM}
          onViewSignOff={handleViewSignOff}
          onViewProcessLogs={handleViewProcessLogs}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />
      )}

      {currentScreen === 'bom' && (
        <BOMScreen
          workOrderId={workOrderId}
          orderNumber={orderNumber}
          onClose={handleCloseOverlay}
        />
      )}

      {currentScreen === 'signoff' && (
        <SignOffScreen
          workOrderId={workOrderId}
          orderNumber={orderNumber}
          onClose={handleCloseOverlay}
        />
      )}

      {currentScreen === 'process-logs' && (
        <ProcessLogsScreen
          workOrderId={workOrderId}
          orderNumber={orderNumber}
          onClose={handleCloseOverlay}
        />
      )}

      {currentScreen === 'final-documentation' && (
        <FinalDocumentationScreen
          workOrderId={workOrderId}
          orderNumber={orderNumber}
          onClose={handleCloseOverlay}
        />
      )}

      {currentScreen === 'failure-analysis' && testResult && (
        <FailureAnalysisScreen
          workOrderId={workOrderId}
          orderNumber={orderNumber}
          testResult={testResult}
          onSelectRework={handleSelectRework}
          onViewBOM={handleViewBOM}
          onViewSignOff={handleViewSignOff}
          onViewProcessLogs={handleViewProcessLogs}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />
      )}

      {currentScreen === 'rework-instructions' && (
        <MPIViewer
          workOrderId={workOrderId}
          orderNumber={orderNumber}
          instructionType="rework"
          specificMpiId={selectedReworkMpiId}
          onComplete={handleReworkComplete}
          onCancel={() => setCurrentScreen('failure-analysis')}
          onViewBOM={handleViewBOM}
          onViewSignOff={handleViewSignOff}
          onViewProcessLogs={handleViewProcessLogs}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />
      )}

      {currentScreen === 'retesting' && (
        <TestingScreen
          workOrderId={workOrderId}
          orderNumber={orderNumber}
          isRetesting={true}
          testProgress={testProgress}
          testStatus={testStatus}
          sensorData={sensorData}
          onStartTest={() => {
            setTestStatus('running');
            setTestProgress(0);
            setIsRetesting(true);
          }}
          onTestComplete={handleRetestComplete}
          onViewBOM={handleViewBOM}
          onViewSignOff={handleViewSignOff}
          onViewProcessLogs={handleViewProcessLogs}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />
      )}

      {currentScreen === 'success' && (
        <div className="h-screen bg-surface flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-surface rounded-lg shadow-08-dp p-12 w-full text-center max-w-4xl">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="font-headline-6 text-[28px] font-[number:var(--headline-6-font-weight)] tracking-[var(--headline-6-letter-spacing)] leading-[var(--headline-6-line-height)] text-x00-on-surface-high-emphasis mb-2">
              Test Passed!
            </h1>
            <p className="font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-x00-on-surface-medium-emphasis mb-6">
              Work Order: {orderNumber}
            </p>
            <p className="font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-x00-on-surface-high-emphasis mb-8">
              The unit has successfully passed all testing requirements and is ready for deployment.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleStartOver}
                className="w-full px-6 py-3 font-button text-[length:var(--button-font-size)] font-[number:var(--button-font-weight)] tracking-[var(--button-letter-spacing)] bg-x01-primary500 hover:bg-x01-primary600 text-x03-on-primary-high-emphasis rounded shadow-04-dp transition-all"
              >
                TEST ANOTHER UNIT
              </button>
              <button
                onClick={handleViewFinalDocumentation}
                className="w-full px-6 py-3 font-button text-[length:var(--button-font-size)] font-[number:var(--button-font-weight)] tracking-[var(--button-letter-spacing)] bg-gray-100 hover:bg-gray-200 text-x00-on-surface-high-emphasis rounded shadow-04-dp transition-all"
              >
                VIEW FINAL DOCUMENTATION
              </button>
            </div>
          </div>
        </div>
      )}

      {workOrderId && orderNumber && (
        <IntuitiveAssistant
          isOpen={isAssistantOpen}
          onClose={() => setIsAssistantOpen(false)}
          workOrderId={workOrderId}
          orderNumber={orderNumber}
        />
      )}
    </div>
  );
}
