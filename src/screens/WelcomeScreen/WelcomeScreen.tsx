import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabase';
import { generateBOMComponents } from '../../lib/bomGenerator';

interface WelcomeScreenProps {
  onWorkOrderScanned: (workOrderId: string, orderNumber: string) => void;
}

export function WelcomeScreen({ onWorkOrderScanned }: WelcomeScreenProps) {
  const [orderNumber, setOrderNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!orderNumber.trim()) {
      setError('Please enter a work order number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Checking for existing work order:', orderNumber.trim());
      const { data: existingOrder, error: fetchError } = await supabase
        .from('work_orders')
        .select('*')
        .eq('order_number', orderNumber.trim())
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching work order:', fetchError);
        throw new Error(`Database error: ${fetchError.message}`);
      }

      let workOrder = existingOrder;

      if (!workOrder) {
        console.log('Creating new work order:', orderNumber.trim());
        const { data: newOrder, error: insertError } = await supabase
          .from('work_orders')
          .insert({
            order_number: orderNumber.trim(),
            product_name: 'Manufacturing Unit',
            status: 'pending'
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating work order:', insertError);
          throw new Error(`Failed to create work order: ${insertError.message}`);
        }
        workOrder = newOrder;
        console.log('Work order created successfully:', workOrder.id);

        console.log('Fetching technicians...');
        const { data: technicians, error: techError } = await supabase
          .from('technicians')
          .select('*')
          .limit(5);

        if (techError) {
          console.error('Error fetching technicians:', techError);
          throw new Error(`Failed to fetch technicians: ${techError.message}`);
        }

        if (!technicians || technicians.length === 0) {
          console.error('No technicians found in database');
          throw new Error('No technicians available. Please contact system administrator.');
        }

        console.log(`Found ${technicians.length} technicians`);

        console.log('Generating BOM components...');
        const bomComponents = generateBOMComponents(workOrder.id);
        const { error: bomError } = await supabase.from('bill_of_materials').insert(bomComponents);

        if (bomError) {
          console.error('Error inserting BOM:', bomError);
          throw new Error(`Failed to create BOM: ${bomError.message}`);
        }
        console.log('BOM created successfully');

        console.log('Creating sign-off operations...');
        const operations = [
          { name: 'Initial Component Inspection', order: 1, technicianIndex: 0 },
          { name: 'PCB Assembly', order: 2, technicianIndex: 1 },
          { name: 'Wire Harness Installation', order: 3, technicianIndex: 2 },
          { name: 'Firmware Programming', order: 4, technicianIndex: 3 },
          { name: 'Final Quality Inspection', order: 5, technicianIndex: 0 }
        ];

        const signOffOperations = operations.map(op => ({
          work_order_id: workOrder.id,
          technician_id: technicians[op.technicianIndex % technicians.length].id,
          operation_name: op.name,
          operation_order: op.order,
          completed_at: new Date(Date.now() - (5 - op.order) * 3600000).toISOString()
        }));

        const { error: signOffError } = await supabase.from('sign_off_operations').insert(signOffOperations);

        if (signOffError) {
          console.error('Error creating sign-offs:', signOffError);
          throw new Error(`Failed to create sign-offs: ${signOffError.message}`);
        }
        console.log('Sign-off operations created successfully');
      } else {
        console.log('Work order already exists:', workOrder.id);
      }

      console.log('Processing complete, redirecting to setup instructions');
      onWorkOrderScanned(workOrder.id, workOrder.order_number);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error processing work order:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  return (
    <div className="h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full animate-fade-in">
        <div className="bg-surface rounded-lg shadow-08-dp p-8 space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-x02-secondary200 bg-opacity-10 rounded-full mb-4">
              <svg className="w-10 h-10 text-x01-primary500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="font-headline-6 text-[length:var(--headline-6-font-size)] font-[number:var(--headline-6-font-weight)] tracking-[var(--headline-6-letter-spacing)] leading-[var(--headline-6-line-height)] text-x00-on-surface-high-emphasis">
              Manufacturing Testing
            </h1>
            <p className="font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-x00-on-surface-medium-emphasis">
              Scan or enter work order to begin testing process
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="workOrder"
                className="font-body-2 text-[length:var(--body-2-font-size)] font-medium tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-x00-on-surface-high-emphasis"
              >
                Work Order Number
              </label>
              <input
                id="workOrder"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter or scan work order"
                className="w-full px-4 py-3 border border-gray-300 rounded font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-x00-on-surface-high-emphasis focus:outline-none focus:ring-2 focus:ring-x01-primary500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-error rounded">
                <p className="font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-error">{error}</p>
              </div>
            )}

            <Button
              onClick={handleScan}
              disabled={isLoading}
              className="w-full h-12 font-button text-[length:var(--button-font-size)] font-[number:var(--button-font-weight)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] bg-x01-primary500 hover:bg-x01-primary600 text-x03-on-primary-high-emphasis transition-colors shadow-04-dp"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-x03-on-primary-high-emphasis" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'START TESTING PROCESS'
              )}
            </Button>
          </div>

          <div className="pt-6 border-t border-gray-200 space-y-2">
            <p className="font-body-2 text-[11px] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-center text-grey-700">
              Ensure all safety protocols are followed before beginning testing
            </p>
            <p className="font-body-2 text-[11px] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] text-center text-x01-primary500">
              Try: WO-2024-1001, WO-2024-1002, or WO-2024-1003
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
