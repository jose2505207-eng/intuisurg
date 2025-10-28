import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabase';
import { ProcessLog } from '../../types/database';
import { DefectDetailsModal } from '../../components/DefectDetailsModal';
import { ProcessLogItem } from '../../components/ProcessLogItem';

interface ProcessLogsScreenProps {
  workOrderId: string;
  orderNumber: string;
  onClose: () => void;
}

export function ProcessLogsScreen({ workOrderId, orderNumber, onClose }: ProcessLogsScreenProps) {
  const [logs, setLogs] = useState<ProcessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<ProcessLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [workOrderId]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('process_logs')
        .select('*')
        .eq('work_order_id', workOrderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error('Error loading logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error':
        return (
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'issue':
        return (
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const getLogBorderColor = (type: string) => {
    switch (type) {
      case 'error': return 'border-l-red-500';
      case 'warning': return 'border-l-yellow-500';
      case 'issue': return 'border-l-orange-500';
      default: return 'border-l-blue-500';
    }
  };

  const hasDefectDetails = (log: ProcessLog) => {
    return log.part_number || log.reference_designator || log.tracking_id || log.operation_found || log.technician_found || log.defect_description;
  };

  const handleLogClick = (log: ProcessLog) => {
    if (hasDefectDetails(log)) {
      setSelectedLog(log);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Process Logs</h1>
                <p className="text-slate-300">Work Order: {orderNumber}</p>
              </div>
              <Button
                onClick={onClose}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Close
              </Button>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-600">No process logs found for this work order</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <ProcessLogItem
                    key={log.id}
                    log={log}
                    onClick={handleLogClick}
                    formatDateTime={formatDateTime}
                  />
                ))}
              </div>
            )}

            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">Process Log History</p>
                  <p className="text-sm text-slate-700">
                    This page shows all issues and events that occurred during the manufacturing and testing process.
                    Logs are displayed in reverse chronological order (most recent first).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedLog && (
        <DefectDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLog(null);
          }}
          log={selectedLog}
        />
      )}
    </div>
  );
}
