import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabase';
import { SignOffOperation } from '../../types/database';

interface SignOffScreenProps {
  workOrderId: string;
  orderNumber: string;
  onClose: () => void;
}

export function SignOffScreen({ workOrderId, orderNumber, onClose }: SignOffScreenProps) {
  const [signOffs, setSignOffs] = useState<SignOffOperation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSignOffs();
  }, [workOrderId]);

  const loadSignOffs = async () => {
    setIsLoading(true);
    try {
      console.log('Loading sign-offs for work order ID:', workOrderId);
      const { data, error } = await supabase
        .from('sign_off_operations')
        .select(`
          *,
          technician:technicians(*)
        `)
        .eq('work_order_id', workOrderId)
        .order('operation_order', { ascending: true });

      if (error) {
        console.error('Error from Supabase:', error);
        throw error;
      }
      console.log('Sign-offs loaded:', data);
      setSignOffs(data || []);
    } catch (err) {
      console.error('Error loading sign-offs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <div style={{ backgroundColor: '#5B7FA6' }} className="px-6 py-4 text-white flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-wide">SIGN OFF</h1>
        <Button
          onClick={onClose}
          className="bg-white text-slate-800 hover:bg-gray-100 font-medium px-6"
        >
          MAIN
        </Button>
      </div>

      <div className="px-6 py-4 flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
          </div>
        ) : signOffs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No sign-off records found for this work order</p>
          </div>
        ) : (
          <div className="bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: '#E8EEF3' }}>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 uppercase tracking-wider border-b border-slate-300">
                    TECHNICIAN
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 uppercase tracking-wider border-b border-slate-300">
                    OPERATION
                  </th>
                </tr>
              </thead>
              <tbody>
                {signOffs.map((signOff) => (
                  <tr key={signOff.id} className="bg-white">
                    <td className="px-6 py-4 text-sm text-slate-700 border-b border-slate-200">
                      {signOff.technician?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 border-b border-slate-200">
                      {signOff.operation_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
