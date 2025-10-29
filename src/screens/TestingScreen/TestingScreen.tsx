import { useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabase';
import { TestResult } from '../../types/database';
import { NavigationBar } from '../../components/NavigationBar';

interface TestingScreenProps {
  workOrderId: string;
  orderNumber: string;
  isRetesting?: boolean;
  testProgress: number;
  testStatus: 'idle' | 'running' | 'complete';
  sensorData: {
    sensor_1: number;
    sensor_2: number;
    sensor_3: number;
    temperature: number;
    pressure: number;
    voltage: number;
  };
  onStartTest: () => void;
  onTestComplete: (testResult: TestResult) => void;
  onViewBOM: () => void;
  onViewSignOff: () => void;
  onViewProcessLogs: () => void;
  onOpenAssistant: () => void;
}

export function TestingScreen({
  workOrderId,
  orderNumber,
  isRetesting = false,
  testProgress,
  testStatus,
  sensorData,
  onStartTest,
  onTestComplete,
  onViewBOM,
  onViewSignOff,
  onViewProcessLogs,
  onOpenAssistant
}: TestingScreenProps) {

  // Trigger test completion when status changes to complete
  useEffect(() => {
    if (testStatus === 'complete') {
      completeTest();
    }
  }, [testStatus]);

  const startTest = async () => {
    onStartTest();

    const testRunNumber = isRetesting ? 2 : 1;

    await supabase.from('test_results').insert({
      work_order_id: workOrderId,
      test_run_number: testRunNumber,
      test_status: 'running',
      started_at: new Date().toISOString()
    });

    await supabase.from('work_orders').update({
      status: 'testing',
      updated_at: new Date().toISOString()
    }).eq('id', workOrderId);
  };

  const completeTest = async () => {

    const failureCodes = isRetesting ? [] : ['VOLT-HIGH', 'PRESS-LOW'];
    const finalStatus = isRetesting ? 'passed' : 'failed';
    const testRunNumber = isRetesting ? 2 : 1;

    const testResultData = {
      work_order_id: workOrderId,
      test_run_number: testRunNumber,
      test_status: finalStatus,
      sensor_1_value: sensorData.sensor_1,
      sensor_2_value: sensorData.sensor_2,
      sensor_3_value: sensorData.sensor_3,
      temperature: sensorData.temperature,
      pressure: sensorData.pressure,
      voltage: sensorData.voltage,
      failure_codes: failureCodes.length > 0 ? failureCodes : null,
      completed_at: new Date().toISOString()
    };

    const { data: testResult, error } = await supabase
      .from('test_results')
      .insert(testResultData)
      .select()
      .single();

    if (!error && testResult) {
      await supabase.from('work_orders').update({
        status: finalStatus,
        updated_at: new Date().toISOString()
      }).eq('id', workOrderId);

      if (!isRetesting) {
        await supabase.from('process_logs').insert({
          work_order_id: workOrderId,
          log_type: 'error',
          message: 'Test failed: Voltage exceeded limits (252V) and pressure below minimum (48 PSI)',
          resolution: null,
          defect_description: `Multiple test parameters exceeded acceptable ranges during automated testing. Voltage measured at ${sensorData.voltage.toFixed(1)}V (threshold: 240V max). Pressure measured at ${sensorData.pressure.toFixed(1)} PSI (threshold: 50 PSI min). Temperature: ${sensorData.temperature.toFixed(1)}°C.`,
          tracking_id: `TEST-RUN-${testRunNumber}-${Date.now()}`,
          operation_found: 'Automated Testing',
          part_number: failureCodes.includes('VOLT-HIGH') ? '284502' : '150238',
          reference_designator: failureCodes.includes('VOLT-HIGH') ? 'Power Supply Module' : 'Pressure Sensor'
        });
      }

      onTestComplete(testResult);
    }
  };

  const getStatusColor = (value: number, type: string) => {
    if (type === 'voltage') {
      return value > 240 ? 'text-red-600' : 'text-green-600';
    }
    if (type === 'pressure') {
      return value < 50 ? 'text-red-600' : 'text-green-600';
    }
    if (type === 'temperature') {
      return value > 80 ? 'text-yellow-600' : 'text-green-600';
    }
    return 'text-green-600';
  };

  return (
    <div className="h-screen bg-surface flex flex-col animate-fade-in">
      <NavigationBar
        orderNumber={orderNumber}
        onViewBOM={onViewBOM}
        onViewSignOff={onViewSignOff}
        onViewProcessLogs={onViewProcessLogs}
        onOpenAssistant={onOpenAssistant}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-surface rounded-lg shadow-08-dp p-6 h-full">
          <div className="mb-6">
            <h1 className="font-headline-6 text-[24px] font-[number:var(--headline-6-font-weight)] tracking-[var(--headline-6-letter-spacing)] leading-[var(--headline-6-line-height)] text-x00-on-surface-high-emphasis">
              {isRetesting ? 'Re-Testing Unit' : 'Testing Unit'}
            </h1>
          </div>

          {testStatus === 'idle' && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-x02-secondary200 bg-opacity-10 rounded-full mb-4">
                <svg className="w-10 h-10 text-x01-primary500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-headline-6 text-[22px] font-[number:var(--headline-6-font-weight)] tracking-[var(--headline-6-letter-spacing)] leading-[var(--headline-6-line-height)] text-x00-on-surface-high-emphasis mb-2">
                Ready to Begin Testing
              </h2>
              <p className="font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-x00-on-surface-medium-emphasis mb-6">
                Click the button below to start the automated testing process
              </p>
              <Button onClick={startTest} size="lg" className="px-8 font-button text-[length:var(--button-font-size)] font-[number:var(--button-font-weight)] tracking-[var(--button-letter-spacing)] bg-x01-primary500 hover:bg-x01-primary600 text-x03-on-primary-high-emphasis shadow-04-dp">
                START TEST
              </Button>
            </div>
          )}

          {testStatus === 'running' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="font-body-2 text-[length:var(--body-2-font-size)] font-medium tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                  <span className="text-x00-on-surface-high-emphasis">Test Progress</span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-x01-primary500 transition-all duration-200 flex items-center justify-end rounded-full"
                    style={{ width: `${testProgress}%` }}
                  >
                    <div className="w-2 h-full bg-white/30 animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                  title="Sensor 1"
                  value={sensorData.sensor_1.toFixed(2)}
                  unit="units"
                  status="normal"
                />
                <MetricCard
                  title="Sensor 2"
                  value={sensorData.sensor_2.toFixed(2)}
                  unit="units"
                  status="normal"
                />
                <MetricCard
                  title="Sensor 3"
                  value={sensorData.sensor_3.toFixed(2)}
                  unit="units"
                  status="normal"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                  title="Temperature"
                  value={sensorData.temperature.toFixed(1)}
                  unit="°C"
                  status={sensorData.temperature > 80 ? 'warning' : 'normal'}
                  statusColor={getStatusColor(sensorData.temperature, 'temperature')}
                />
                <MetricCard
                  title="Pressure"
                  value={sensorData.pressure.toFixed(1)}
                  unit="PSI"
                  status={sensorData.pressure < 50 ? 'error' : 'normal'}
                  statusColor={getStatusColor(sensorData.pressure, 'pressure')}
                />
                <MetricCard
                  title="Voltage"
                  value={sensorData.voltage.toFixed(1)}
                  unit="V"
                  status={sensorData.voltage > 240 ? 'error' : 'normal'}
                  statusColor={getStatusColor(sensorData.voltage, 'voltage')}
                />
              </div>

              <div className="flex items-center justify-center p-4 bg-x02-secondary200 bg-opacity-10 border border-x02-secondary200 rounded">
                <svg className="animate-spin h-5 w-5 text-x01-primary500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-body-2 text-[length:var(--body-2-font-size)] font-medium tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-x01-primary500">Testing in progress...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'error';
  statusColor?: string;
}

function MetricCard({ title, value, unit, status, statusColor }: MetricCardProps) {
  const bgColor = status === 'error' ? 'bg-red-50 border-error' :
                  status === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-green-50 border-green-500';

  return (
    <div className={`p-4 border rounded shadow-04-dp ${bgColor} transition-all hover:shadow-08-dp`}>
      <p className="font-body-2 text-[length:var(--body-2-font-size)] font-medium tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-x00-on-surface-medium-emphasis mb-2">{title}</p>
      <div className="flex items-baseline">
        <span className={`font-headline-6 text-[32px] font-[number:var(--headline-6-font-weight)] ${statusColor || 'text-x00-on-surface-high-emphasis'}`}>
          {value}
        </span>
        <span className="ml-2 font-body-2 text-[12px] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-x00-on-surface-medium-emphasis">{unit}</span>
      </div>
    </div>
  );
}
