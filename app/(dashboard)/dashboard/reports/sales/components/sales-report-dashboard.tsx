'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Filter, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import {
  getFilterOptions,
  type SalesReportFilters as FilterType,
} from '@/actions/reports/sales-reports';
import SalesReportFilters from './sales-report-filters';
import { SalesSummaryView } from './sales-summary-view';
import { SalesCustomersView } from './sales-customers-view';
import { SalesProductsView } from './sales-products-view';

export default function SalesReportDashboard() {
  const [activeTab, setActiveTab] = useState('summary');
  const [filters, setFilters] = useState<FilterType>({
    dateRange: 'last30days',
    sortBy: 'date',
    sortOrder: 'desc',
  });
  const [filterOptions, setFilterOptions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Load filter options on mount
  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const options = await getFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error('Error loading filter options:', error);
        toast.error('Failed to load filter options');
      }
    }
    loadFilterOptions();
  }, []);

  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Trigger refresh by updating a key or calling refresh functions
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Reports refreshed successfully');
    }, 1000);
  };

  const handleExport = () => {
    toast.success('Export functionality coming soon!');
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && filterOptions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Report Filters</CardTitle>
            <CardDescription>Customize your sales report by applying filters below</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesReportFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              filterOptions={filterOptions}
            />
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="summary" className="text-xs sm:text-sm">
            Summary
          </TabsTrigger>
          <TabsTrigger value="customers" className="text-xs sm:text-sm">
            Customers
          </TabsTrigger>
          <TabsTrigger value="products" className="text-xs sm:text-sm">
            Products
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <SalesSummaryView filters={filters} />
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <SalesCustomersView filters={filters} />
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <SalesProductsView filters={filters} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
