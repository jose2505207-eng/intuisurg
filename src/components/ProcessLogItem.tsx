import { ProcessLog } from '../types/database';

interface ProcessLogItemProps {
  log: ProcessLog;
  onClick?: (log: ProcessLog) => void;
  formatDateTime: (dateString: string) => string;
}

export function ProcessLogItem({ log, onClick, formatDateTime }: ProcessLogItemProps) {
  const hasDefectDetails = !!(
    log.defect_description ||
    log.tracking_id ||
    log.operation_found ||
    log.part_number ||
    log.reference_designator
  );

  const isClickable = hasDefectDetails && onClick;

  const handleClick = () => {
    if (isClickable) {
      onClick(log);
    }
  };

  return (
    <div
      className={`border border-slate-200 rounded-lg p-4 transition-colors ${
        isClickable ? 'cursor-pointer hover:bg-slate-50 hover:border-slate-300' : ''
      }`}
      onClick={handleClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
            log.log_type === 'error' ? 'bg-red-100 text-red-800' :
            log.log_type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            log.log_type === 'issue' ? 'bg-orange-100 text-orange-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {log.log_type}
          </span>
          {hasDefectDetails && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {isClickable && 'Click for details'}
            </span>
          )}
        </div>
        <span className="text-sm text-slate-500">
          {formatDateTime(log.created_at)}
        </span>
      </div>
      <p className="text-slate-900 mb-2">{log.message}</p>
      {log.resolution && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-800">
            <span className="font-medium">Resolution: </span>
            {log.resolution}
          </p>
        </div>
      )}
    </div>
  );
}
