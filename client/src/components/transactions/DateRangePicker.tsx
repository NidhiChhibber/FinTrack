// client/src/components/transactions/DateRangePicker.tsx
import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { getDateRange } from '../../utils/dateUtils';
import { DATE_RANGES } from '../../constants';

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onDateRangeChange: (startDate?: string, endDate?: string) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateRangeChange
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(startDate || '');
  const [customEndDate, setCustomEndDate] = useState(endDate || '');

  const handlePresetSelect = (preset: keyof typeof DATE_RANGES) => {
    const range = getDateRange(preset);
    onDateRangeChange(range.startDate, range.endDate);
  };

  const handleCustomApply = () => {
    if (customStartDate && customEndDate) {
      onDateRangeChange(customStartDate, customEndDate);
      setShowCustom(false);
    }
  };

  const handleClear = () => {
    onDateRangeChange(undefined, undefined);
    setCustomStartDate('');
    setCustomEndDate('');
    setShowCustom(false);
  };

  const getDisplayText = () => {
    if (!startDate || !endDate) return 'Select Date Range';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-start">
          <Calendar className="w-4 h-4 mr-2" />
          {getDisplayText()}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {!showCustom ? (
          <>
            {Object.entries(DATE_RANGES).map(([key, range]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => handlePresetSelect(key as keyof typeof DATE_RANGES)}
              >
                {range.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowCustom(true)}>
              Custom Range
            </DropdownMenuItem>
            {(startDate || endDate) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleClear}>
                  Clear Selection
                </DropdownMenuItem>
              </>
            )}
          </>
        ) : (
          <div className="p-3 space-y-3">
            <div className="text-sm font-medium text-foreground">Custom Date Range</div>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-muted-foreground">Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full mt-1 px-3 py-1 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full mt-1 px-3 py-1 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleCustomApply}
                disabled={!customStartDate || !customEndDate}
              >
                Apply
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCustom(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};