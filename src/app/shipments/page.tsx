import { createClient } from '@/utils/supabase/server';
import type { Shipment, ShipmentDimensions } from '@/types/database.types';

export default async function ShipmentsPage() {
  const supabase = await createClient();

  const { data: shipments, error } = await supabase
    .from('shipments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            <h2 className="text-lg font-semibold">Error loading shipments</h2>
            <p className="mt-1 text-sm">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Shipments
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Track and manage all your shipments in one place
          </p>
        </div>

        <div className="grid gap-6">
          {shipments && shipments.length > 0 ? (
            shipments.map((shipment) => (
              <ShipmentCard key={shipment.id} shipment={shipment} />
            ))
          ) : (
            <div className="rounded-lg bg-white p-8 text-center shadow">
              <p className="text-gray-500">No shipments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ShipmentCardProps {
  shipment: Shipment;
}

function ShipmentCard({ shipment }: ShipmentCardProps) {
  const dimensions = shipment.dimensions as ShipmentDimensions | null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {shipment.tracking_number}
              </h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                  shipment.status
                )}`}
              >
                {formatStatus(shipment.status)}
              </span>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p className="font-medium">Weight: {shipment.weight} lbs</p>
            {dimensions && (
              <p className="mt-1">
                Dimensions: {dimensions.length}&quot; × {dimensions.width}&quot; ×{' '}
                {dimensions.height}&quot;
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-900">From</h4>
            <div className="rounded-md bg-gray-50 p-3">
              <p className="font-medium text-gray-900">{shipment.sender_name}</p>
              <p className="mt-1 text-sm text-gray-600">
                {shipment.sender_address}
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-900">To</h4>
            <div className="rounded-md bg-gray-50 p-3">
              <p className="font-medium text-gray-900">
                {shipment.recipient_name}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {shipment.recipient_address}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t pt-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-gray-500">Shipped Date</p>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(shipment.shipped_date)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">
              Estimated Delivery
            </p>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(shipment.estimated_delivery)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">
              Actual Delivery
            </p>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(shipment.actual_delivery)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

