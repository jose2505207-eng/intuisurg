import { Button } from './ui/button';

interface NavigationBarProps {
  orderNumber: string;
  onViewBOM: () => void;
  onViewSignOff: () => void;
  onViewProcessLogs: () => void;
  onOpenAssistant: () => void;
}

export function NavigationBar({ orderNumber, onViewBOM, onViewSignOff, onViewProcessLogs, onOpenAssistant }: NavigationBarProps) {
  return (
    <div style={{ backgroundColor: '#5B7FA6' }} className="px-6 py-4 text-white flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="text-xl font-bold tracking-wide">Manufacturing Testing System</h1>
        <p className="text-sm text-white/80">Work Order: {orderNumber}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onViewBOM} variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          BOM
        </Button>
        <Button onClick={onViewSignOff} variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          Sign-Off
        </Button>
        <Button onClick={onViewProcessLogs} variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          Process Logs
        </Button>
        <Button onClick={onOpenAssistant} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white border-0 font-semibold">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Intuitive Assistant
        </Button>
      </div>
    </div>
  );
}
