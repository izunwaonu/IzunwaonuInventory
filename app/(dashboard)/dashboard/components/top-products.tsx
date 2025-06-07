'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, Package } from 'lucide-react';

interface TopProductsProps {
  products: Array<{
    id: string;
    name: string;
    sku: string;
    salesCount: number;
    salesTotal: number;
    category?: string;
    currentStock: number;
  }>;
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Top Selling Products
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <div className="space-y-3 p-6 pt-0">
            {products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No sales data available</p>
              </div>
            ) : (
              products.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">
                          ₦{product.salesTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">{product.sku}</p>
                        {product.category && (
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">{product.salesCount} sold</p>
                        <p className="text-xs text-gray-500">{product.currentStock} in stock</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
