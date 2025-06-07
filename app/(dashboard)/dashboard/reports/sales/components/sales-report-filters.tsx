'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { SalesReportFilters } from '@/actions/reports/sales-reports';

interface SalesReportFiltersProps {
  filters: SalesReportFilters;
  onFiltersChange: (filters: SalesReportFilters) => void;
  filterOptions: {
    locations: { id: string; name: string }[];
    paymentMethods: string[];
    orderStatuses: string[];
    paymentStatuses: string[];
  };
}

export default function SalesReportFilters({
  filters,
  onFiltersChange,
  filterOptions,
}: SalesReportFiltersProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleFilterChange = (key: keyof SalesReportFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleMultiSelectChange = (
    key: keyof SalesReportFilters,
    value: string,
    checked: boolean,
  ) => {
    const currentValues = (filters[key] as string[]) || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    handleFilterChange(key, newValues.length > 0 ? newValues : undefined);
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: 'last30days',
      sortBy: 'date',
      sortOrder: 'desc',
    });
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleDateRangeChange = (range: string) => {
    handleFilterChange('dateRange', range);
    if (range !== 'custom') {
      setStartDate(undefined);
      setEndDate(undefined);
      handleFilterChange('startDate', undefined);
      handleFilterChange('endDate', undefined);
    }
  };

  const handleCustomDateChange = (type: 'start' | 'end', date: Date | undefined) => {
    if (type === 'start') {
      setStartDate(date);
      handleFilterChange('startDate', date ? format(date, 'yyyy-MM-dd') : undefined);
    } else {
      setEndDate(date);
      handleFilterChange('endDate', date ? format(date, 'yyyy-MM-dd') : undefined);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Date Range */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <Select value={filters.dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Date Range */}
        {filters.dateRange === 'custom' && (
          <>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => handleCustomDateChange('start', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => handleCustomDateChange('end', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}

        {/* Search */}
        <div className="space-y-2">
          <Label>Search</Label>
          <Input
            placeholder="Order number or customer name..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
          />
        </div>

        {/* Amount Range */}
        <div className="space-y-2">
          <Label>Min Amount</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={filters.minAmount || ''}
            onChange={(e) =>
              handleFilterChange('minAmount', e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Max Amount</Label>
          <Input
            type="number"
            placeholder="1000.00"
            value={filters.maxAmount || ''}
            onChange={(e) =>
              handleFilterChange('maxAmount', e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
      </div>

      {/* Multi-select Filters */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Locations */}
        {filterOptions.locations.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Locations</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filterOptions.locations.map((location) => (
                <div key={location.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location.id}`}
                    checked={(filters.locationIds || []).includes(location.id)}
                    onCheckedChange={(checked) =>
                      handleMultiSelectChange('locationIds', location.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`location-${location.id}`} className="text-sm">
                    {location.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Methods */}
        {filterOptions.paymentMethods.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Payment Methods</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filterOptions.paymentMethods.map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    id={`payment-${method}`}
                    checked={(filters.paymentMethods || []).includes(method)}
                    onCheckedChange={(checked) =>
                      handleMultiSelectChange('paymentMethods', method, checked as boolean)
                    }
                  />
                  <Label htmlFor={`payment-${method}`} className="text-sm">
                    {method}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Status */}
        {filterOptions.orderStatuses.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Order Status</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filterOptions.orderStatuses.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={(filters.orderStatus || []).includes(status)}
                    onCheckedChange={(checked) =>
                      handleMultiSelectChange('orderStatus', status, checked as boolean)
                    }
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Status */}
        {filterOptions.paymentStatuses.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Payment Status</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filterOptions.paymentStatuses.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`payment-status-${status}`}
                    checked={(filters.paymentStatus || []).includes(status)}
                    onCheckedChange={(checked) =>
                      handleMultiSelectChange('paymentStatus', status, checked as boolean)
                    }
                  />
                  <Label htmlFor={`payment-status-${status}`} className="text-sm">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={clearFilters} className="gap-2">
          <X className="h-4 w-4" />
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
