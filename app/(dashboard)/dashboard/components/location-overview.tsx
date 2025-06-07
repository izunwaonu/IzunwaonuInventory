'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Package, DollarSign } from 'lucide-react';

interface LocationOverviewProps {
  locations: Array<{
    id: string;
    name: string;
    type: string;
    address?: string;
    totalItems: number;
    totalStock: number;
    totalValue: number;
    monthlySales: number;
    salesCount: number;
  }>;
}

export function LocationOverview({ locations }: LocationOverviewProps) {
  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case 'WAREHOUSE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHOP':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'VIRTUAL':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <MapPin className="h-5 w-5 text-blue-600" />
          Location Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {locations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No locations configured</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {locations.map((location) => (
              <div
                key={location.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 truncate">{location.name}</h3>
                  <Badge variant="outline" className={getLocationTypeColor(location.type)}>
                    {location.type.toLowerCase()}
                  </Badge>
                </div>

                {location.address && (
                  <p className="text-xs text-gray-500 mb-3 truncate">{location.address}</p>
                )}

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Items</p>
                      <p className="font-medium">{location.totalItems}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Monthly Sales</p>
                      <p className="font-medium">₦{location.monthlySales.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{location.totalStock} total stock</span>
                    <span>{location.salesCount} orders</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
