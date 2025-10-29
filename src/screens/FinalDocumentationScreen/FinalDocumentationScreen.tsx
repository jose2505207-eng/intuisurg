import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabase';
import { SignOffOperation, ProcessLog, BillOfMaterial, WorkOrder } from '../../types/database';
import { ProcessLogItem } from '../../components/ProcessLogItem';
import { DefectDetailsModal } from '../../components/DefectDetailsModal';

interface FinalDocumentationScreenProps {
  workOrderId: string;
  orderNumber: string;
  onClose: () => void;
}

export function FinalDocumentationScreen({ workOrderId, orderNumber, onClose }: FinalDocumentationScreenProps) {
  const [signOffs, setSignOffs] = useState<SignOffOperation[]>([]);
  const [logs, setLogs] = useState<ProcessLog[]>([]);
  const [bomItems, setBomItems] = useState<BillOfMaterial[]>([]);
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<ProcessLog | null>(null);

  useEffect(() => {
    loadAllData();
  }, [workOrderId]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [signOffRes, logsRes, bomRes, woRes] = await Promise.all([
        supabase
          .from('sign_off_operations')
          .select('*, technician:technicians(*)')
          .eq('work_order_id', workOrderId)
          .order('operation_order', { ascending: true }),

        supabase
          .from('process_logs')
          .select('*')
          .eq('work_order_id', workOrderId)
          .order('created_at', { ascending: false }),

        supabase
          .from('bill_of_materials')
          .select('*')
          .eq('work_order_id', workOrderId)
          .order('part_number', { ascending: true }),

        supabase
          .from('work_orders')
          .select('*')
          .eq('id', workOrderId)
          .maybeSingle()
      ]);

      if (!signOffRes.error) setSignOffs(signOffRes.data || []);
      if (!logsRes.error) setLogs(logsRes.data || []);
      if (!bomRes.error) setBomItems(bomRes.data || []);
      if (!woRes.error) setWorkOrder(woRes.data);
    } catch (err) {
      console.error('Error loading documentation:', err);
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

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      <div style={{ backgroundColor: '#5B7FA6' }} className="px-6 py-4 text-white flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold tracking-wide">FINAL DOCUMENTATION</h1>
        <div className="flex gap-3">
          <Button
            onClick={handlePrint}
            className="bg-white/10 border border-white/20 text-white hover:bg-white/20 font-medium px-6"
          >
            PRINT
          </Button>
          <Button
            onClick={onClose}
            className="bg-white text-slate-800 hover:bg-gray-100 font-medium px-6"
          >
            CLOSE
          </Button>
        </div>
      </div>

      <div className="px-6 py-4 space-y-8 flex-1 overflow-auto">
        {/* Work Order Summary */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div style={{ backgroundColor: '#5B7FA6' }} className="px-6 py-3 text-white">
            <h2 className="text-xl font-bold tracking-wide">WORK ORDER DETAILS</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase mb-1">Order Number</p>
                <p className="text-lg font-bold text-slate-900">{orderNumber}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase mb-1">Status</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase mb-1">Completion Date</p>
                <p className="text-lg text-slate-900">{formatDateTime(new Date().toISOString())}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign-Off Operations */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div style={{ backgroundColor: '#5B7FA6' }} className="px-6 py-3 text-white">
            <h2 className="text-xl font-bold tracking-wide">SIGN-OFF OPERATIONS</h2>
          </div>
          <div className="overflow-x-auto">
            {signOffs.length === 0 ? (
              <div className="p-6 text-center text-slate-600">
                No sign-off records available
              </div>
            ) : (
              <table className="w-full">
                <thead style={{ backgroundColor: '#E8EEF3' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 uppercase tracking-wider">
                      Operation
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 uppercase tracking-wider">
                      Technician
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {signOffs.map((signOff, index) => (
                    <tr key={signOff.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                        {signOff.operation_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {signOff.technician?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {formatDateTime(signOff.signed_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Process Logs */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div style={{ backgroundColor: '#5B7FA6' }} className="px-6 py-3 text-white">
            <h2 className="text-xl font-bold tracking-wide">PROCESS LOGS</h2>
          </div>
          <div className="p-6">
            {logs.length === 0 ? (
              <div className="text-center text-slate-600">
                No process logs recorded
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <ProcessLogItem
                    key={log.id}
                    log={log}
                    onClick={(log) => setSelectedLog(log)}
                    formatDateTime={formatDateTime}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bill of Materials */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div style={{ backgroundColor: '#5B7FA6' }} className="px-6 py-3 text-white">
            <h2 className="text-xl font-bold tracking-wide">BILL OF MATERIALS</h2>
          </div>
          <div className="overflow-x-auto">
            {bomItems.length === 0 ? (
              <div className="p-6 text-center text-slate-600">
                No BOM items available
              </div>
            ) : (
              <table className="w-full">
                <thead style={{ backgroundColor: '#E8EEF3' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 uppercase tracking-wider">
                      Part Number
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 uppercase tracking-wider">
                      Component Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 uppercase tracking-wider">
                      Tracking ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bomItems.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {item.part_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {item.component_name}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-700">
                        {item.serial_number}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
          <p className="text-sm text-slate-600">
            This document contains the complete manufacturing and testing record for Work Order {orderNumber}.
            All operations have been completed and signed off by authorized technicians.
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      {selectedLog && (
        <DefectDetailsModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
}
