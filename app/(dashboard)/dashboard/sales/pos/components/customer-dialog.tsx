// 'use client';

// import { useState, useEffect } from 'react';
// import { Search, User, Plus, UserPlus } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Card, CardContent } from '@/components/ui/card';
// import { toast } from 'sonner';
// import { getCustomersForPOS, createCustomer } from '@/actions/pos';
// import type { Customer } from '@/types/pos';

// interface CustomerDialogProps {
//   selectedCustomer: Customer | null;
//   onCustomerSelect: (customer: Customer | null) => void;
// }

// export function CustomerDialog({ selectedCustomer, onCustomerSelect }: CustomerDialogProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newCustomer, setNewCustomer] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//   });

//   useEffect(() => {
//     if (isOpen) {
//       loadCustomers();
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (isOpen) {
//         loadCustomers();
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [searchQuery, isOpen]);

//   const loadCustomers = async () => {
//     setLoading(true);
//     try {
//       const data = await getCustomersForPOS(searchQuery);
//       setCustomers(data as Customer[]);
//     } catch (error) {
//       console.error('Error loading customers:', error);
//       toast.error('Failed to load customers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateCustomer = async () => {
//     if (!newCustomer.name.trim()) {
//       toast.error('Customer name is required');
//       return;
//     }

//     try {
//       const result = await createCustomer(newCustomer);
//       if (result.success) {
//         toast.success('Customer created successfully');
//         setNewCustomer({ name: '', email: '', phone: '', address: '' });
//         setShowAddForm(false);
//         loadCustomers();
//       } else {
//         toast.error(result.error || 'Failed to create customer');
//       }
//     } catch (error) {
//       console.error('Error creating customer:', error);
//       toast.error('Failed to create customer');
//     }
//   };

//   const handleSelectCustomer = (customer: Customer) => {
//     onCustomerSelect(customer);
//     setIsOpen(false);
//   };

//   const handleWalkInCustomer = () => {
//     onCustomerSelect(null);
//     setIsOpen(false);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline" size="sm">
//           <User className="h-4 w-4 mr-2" />
//           {selectedCustomer ? selectedCustomer.name : 'Select Customer'}
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Select Customer</DialogTitle>
//         </DialogHeader>

//         {!showAddForm ? (
//           <>
//             <div className="space-y-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <Input
//                   placeholder="Search customers..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>

//               <div className="flex gap-2">
//                 <Button variant="outline" className="flex-1" onClick={handleWalkInCustomer}>
//                   Walk-in Customer
//                 </Button>
//                 <Button variant="outline" onClick={() => setShowAddForm(true)}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add New
//                 </Button>
//               </div>
//             </div>

//             <ScrollArea className="h-64">
//               <div className="space-y-2">
//                 {loading ? (
//                   Array.from({ length: 3 }).map((_, i) => (
//                     <Card key={i} className="animate-pulse">
//                       <CardContent className="p-3">
//                         <div className="h-4 bg-gray-200 rounded mb-2" />
//                         <div className="h-3 bg-gray-200 rounded" />
//                       </CardContent>
//                     </Card>
//                   ))
//                 ) : customers.length === 0 ? (
//                   <div className="text-center py-8 text-gray-500">
//                     <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                     <p>No customers found</p>
//                   </div>
//                 ) : (
//                   customers.map((customer) => (
//                     <Card
//                       key={customer.id}
//                       className="cursor-pointer hover:bg-gray-50 transition-colors"
//                       onClick={() => handleSelectCustomer(customer)}
//                     >
//                       <CardContent className="p-3">
//                         <h4 className="font-medium">{customer.name}</h4>
//                         {customer.email && (
//                           <p className="text-sm text-gray-500">{customer.email}</p>
//                         )}
//                         {customer.phone && (
//                           <p className="text-sm text-gray-500">{customer.phone}</p>
//                         )}
//                       </CardContent>
//                     </Card>
//                   ))
//                 )}
//               </div>
//             </ScrollArea>
//           </>
//         ) : (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Name *</Label>
//               <Input
//                 id="name"
//                 value={newCustomer.name}
//                 onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
//                 placeholder="Customer name"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={newCustomer.email}
//                 onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
//                 placeholder="customer@example.com"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone</Label>
//               <Input
//                 id="phone"
//                 value={newCustomer.phone}
//                 onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
//                 placeholder="Phone number"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="address">Address</Label>
//               <Input
//                 id="address"
//                 value={newCustomer.address}
//                 onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
//                 placeholder="Customer address"
//               />
//             </div>
//           </div>
//         )}

//         <DialogFooter>
//           {showAddForm ? (
//             <>
//               <Button variant="outline" onClick={() => setShowAddForm(false)}>
//                 Back
//               </Button>
//               <Button onClick={handleCreateCustomer}>
//                 <UserPlus className="h-4 w-4 mr-2" />
//                 Create Customer
//               </Button>
//             </>
//           ) : (
//             <Button variant="outline" onClick={() => setIsOpen(false)}>
//               Close
//             </Button>
//           )}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { Search, User, Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { getCustomersForPOS, createCustomer } from '@/actions/pos';
import type { Customer } from '@/types/pos';

interface CustomerDialogProps {
  selectedCustomer: Customer | null;
  onCustomerSelect: (customer: Customer | null) => void;
}

export function CustomerDialog({ selectedCustomer, onCustomerSelect }: CustomerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadCustomers();
    }
  }, [isOpen]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isOpen) {
        loadCustomers();
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, isOpen]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomersForPOS(searchQuery);
      setCustomers(data as Customer[]);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.name.trim()) {
      toast.error('Customer name is required');
      return;
    }

    try {
      const result = await createCustomer(newCustomer);
      if (result.success) {
        toast.success('Customer created successfully');
        setNewCustomer({ name: '', email: '', phone: '', address: '' });
        setShowAddForm(false);
        loadCustomers();
      } else {
        toast.error(result.error || 'Failed to create customer');
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Failed to create customer');
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    onCustomerSelect(customer);
    setIsOpen(false);
  };

  const handleWalkInCustomer = () => {
    onCustomerSelect(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <User className="h-4 w-4 mr-2" />
          {selectedCustomer ? selectedCustomer.name : 'Select Customer'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Select Customer</DialogTitle>
        </DialogHeader>

        {!showAddForm ? (
          <>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleWalkInCustomer}>
                  Walk-in Customer
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>
            </div>

            <ScrollArea className="h-64">
              <div className="space-y-2">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-3">
                        <div className="h-4 bg-gray-200 rounded mb-2" />
                        <div className="h-3 bg-gray-200 rounded" />
                      </CardContent>
                    </Card>
                  ))
                ) : customers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No customers found</p>
                  </div>
                ) : (
                  customers.map((customer) => (
                    <Card
                      key={customer.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      <CardContent className="p-3">
                        <h4 className="font-medium">{customer.name}</h4>
                        {customer.email && (
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        )}
                        {customer.phone && (
                          <p className="text-sm text-gray-500">{customer.phone}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                placeholder="Customer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                placeholder="customer@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                placeholder="Phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                placeholder="Customer address"
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          {showAddForm ? (
            <>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="w-full sm:w-auto"
              >
                Back
              </Button>
              <Button onClick={handleCreateCustomer} className="w-full sm:w-auto">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Customer
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
