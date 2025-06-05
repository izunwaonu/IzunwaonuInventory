import { getCustomerId } from '@/actions/customers';
import CustomerEditForm from './customer-edit-form';
import { notFound } from 'next/navigation';

export default async function CustomerEditPage({ params }: { params: Promise<{ id: string }> }) {
  const customer = await getCustomerId((await params).id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Edit Customer</h1>
      <CustomerEditForm customer={customer} />
    </div>
  );
}
