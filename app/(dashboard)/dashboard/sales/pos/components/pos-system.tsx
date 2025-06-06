'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Plus, Minus, X, User, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { getItemsForPOS, getCategoriesForPOS, getRecentPOSSales, getPOSStats } from '@/actions/pos';
import { CustomerDialog } from './customer-dialog';
import { PaymentDialog } from './payment-dialog';
import { ReceiptDialog } from './receipt-dialog';
import { RecentSales } from './recent-sales';
import type { CartItem, Customer, Item } from '@/types/pos';

export function POSSystem() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadItems();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [itemsData, categoriesData, statsData, salesData] = await Promise.all([
        getItemsForPOS(),
        getCategoriesForPOS(),
        getPOSStats(),
        getRecentPOSSales(5),
      ]);

      setItems(itemsData as Item[]);
      setCategories(categoriesData);
      setStats(statsData);
      setRecentSales(salesData);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load POS data');
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async () => {
    try {
      const data = await getItemsForPOS(
        searchQuery,
        selectedCategory === 'all' ? undefined : selectedCategory,
      );
      setItems(data as Item[]);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const addToCart = (item: Item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      if (existingItem.quantity >= item.available) {
        toast.error('Not enough stock available');
        return;
      }
      updateCartItemQuantity(item.id, existingItem.quantity + 1);
    } else {
      if (item.available <= 0) {
        toast.error('Item is out of stock');
        return;
      }
      const cartItem: CartItem = {
        id: item.id,
        name: item.name,
        sku: item.sku,
        price: item.sellingPrice,
        quantity: 1,
        discount: 0,
        total: item.sellingPrice,
        thumbnail: item.thumbnail,
        unit: item.unit,
      };
      setCart([...cart, cartItem]);
    }
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const item = items.find((i) => i.id === itemId);
    if (item && quantity > item.available) {
      toast.error('Not enough stock available');
      return;
    }

    setCart(
      cart.map((item) => {
        if (item.id === itemId) {
          const total = (item.price * quantity * (100 - item.discount)) / 100;
          return { ...item, quantity, total };
        }
        return item;
      }),
    );
  };

  const updateCartItemDiscount = (itemId: string, discount: number) => {
    setCart(
      cart.map((item) => {
        if (item.id === itemId) {
          const total = (item.price * item.quantity * (100 - discount)) / 100;
          return { ...item, discount, total };
        }
        return item;
      }),
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
  };

  const getCartTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = cart.reduce(
      (sum, item) => sum + (item.price * item.quantity * item.discount) / 100,
      0,
    );
    const taxRate = 0; // You can make this configurable
    const taxAmount = ((subtotal - discount) * taxRate) / 100;
    const total = subtotal - discount + taxAmount;

    return { subtotal, discount, taxAmount, total };
  };

  const handlePaymentSuccess = (orderData: any) => {
    setLastOrder(orderData);
    setShowReceipt(true);
    clearCart();
    loadInitialData(); // Refresh stats and recent sales
    toast.success('Sale completed successfully!');
  };

  const { subtotal, discount, taxAmount, total } = getCartTotals();

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Panel - Products */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
              <div className="flex gap-4 mt-2 text-sm text-gray-600">
                <span>Today: ${stats.todaySales?.toFixed(2) || '0.00'}</span>
                <span>Orders: {stats.todayOrders || 0}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <CustomerDialog
                selectedCustomer={selectedCustomer}
                onCustomerSelect={setSelectedCustomer}
              />
              <RecentSales sales={recentSales} />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border-b p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products by name, SKU, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="w-full h-32 bg-gray-200 rounded mb-3" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded mb-2" />
                    <div className="h-6 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
                  onClick={() => addToCart(item)}
                >
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail || '/placeholder.svg'}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <ShoppingCart className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      {item.available <= 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                      )}
                      {item.available > 0 && item.available <= 5 && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500">Low Stock</Badge>
                      )}
                    </div>
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{item.sku}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        ${item.sellingPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500">{item.available} left</span>
                    </div>
                    {item.category && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {item.category.title}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="w-full lg:w-96 bg-white border-l flex flex-col">
        {/* Cart Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart ({cart.length})
            </h2>
            {cart.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearCart}>
                Clear
              </Button>
            )}
          </div>
          {selectedCustomer && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">{selectedCustomer.name}</span>
              </div>
              {selectedCustomer.email && (
                <p className="text-xs text-blue-700 mt-1">{selectedCustomer.email}</p>
              )}
            </div>
          )}
        </div>

        {/* Cart Items */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Your cart is empty</p>
                <p className="text-sm">Add products to get started</p>
              </div>
            ) : (
              cart.map((item) => (
                <Card key={item.id} className="p-3">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail || '/placeholder.svg'}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <ShoppingCart className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.sku}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 ml-auto"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm">${item.price.toFixed(2)} each</span>
                        <span className="font-bold text-green-600">${item.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              {taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <PaymentDialog
              cart={cart}
              customer={selectedCustomer}
              totals={{ subtotal, discount, taxAmount, total }}
              onSuccess={handlePaymentSuccess}
              trigger={
                <Button className="w-full" size="lg">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Checkout
                </Button>
              }
            />
          </div>
        )}
      </div>

      {/* Receipt Dialog */}
      {showReceipt && lastOrder && (
        <ReceiptDialog
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          order={lastOrder}
        />
      )}
    </div>
  );
}
