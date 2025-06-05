import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CustomerNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Customer Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The customer you are looking for doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/dashboard/sales/customers">Back to Customers</Link>
      </Button>
    </div>
  );
}
