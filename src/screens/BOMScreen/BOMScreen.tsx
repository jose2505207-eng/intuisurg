import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabase';
import { BillOfMaterial } from '../../types/database';

interface BOMScreenProps {
  workOrderId: string;
  orderNumber: string;
  onClose: () => void;
}

export function BOMScreen({ workOrderId, orderNumber, onClose }: BOMScreenProps) {
  const [bomItems, setBomItems] = useState<BillOfMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBOM();
  }, [workOrderId]);

  const loadBOM = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bill_of_materials')
        .select('*')
        .eq('work_order_id', workOrderId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setBomItems(data || []);
    } catch (err) {
      console.error('Error loading BOM:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <div style={{ backgroundColor: '#5B7FA6' }} className="px-6 py-4 text-white flex items-center justify-between flex-shrink-0">
        <h1 className="text-2xl font-bold tracking-wide">WORK ORDER DETAILS</h1>
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
        ) : bomItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No BOM items found for this work order</p>
          </div>
        ) : (
          <div className="bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: '#E8EEF3' }}>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 uppercase tracking-wider border-b border-slate-300">
                    PART NUMBER
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 uppercase tracking-wider border-b border-slate-300">
                    COMPONENT NAME
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 uppercase tracking-wider border-b border-slate-300">
                    TRACKING ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {bomItems.map((item) => (
                  <tr key={item.id} className="bg-white">
                    <td className="px-6 py-4 text-sm text-slate-700 border-b border-slate-200">
                      {item.part_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 border-b border-slate-200">
                      {item.component_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 border-b border-slate-200">
                      {item.serial_number}
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
