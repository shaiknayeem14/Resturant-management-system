import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Truck, 
  PackageCheck, 
  XCircle, 
  Calendar,
  Users
} from 'lucide-react';

export const StatusBadge = ({ status, type = 'order' }) => {
  const getOrderBadge = () => {
    switch (status) {
      case 'placed':
        return {
          label: 'Order Placed',
          className: 'badge-blue',
          icon: <Clock size={13} />,
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          className: 'badge-amber',
          icon: <CheckCircle2 size={13} />,
        };
      case 'preparing':
        return {
          label: 'In Kitchen',
          className: 'badge-gold',
          icon: <ChefHat size={13} />,
        };
      case 'out_for_delivery':
        return {
          label: 'On Delivery',
          className: 'badge-blue',
          icon: <Truck size={13} />,
        };
      case 'delivered':
        return {
          label: 'Delivered',
          className: 'badge-emerald',
          icon: <PackageCheck size={13} />,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'badge-rose',
          icon: <XCircle size={13} />,
        };
      default:
        return {
          label: status,
          className: 'badge-gold',
          icon: <Clock size={13} />,
        };
    }
  };

  const getReservationBadge = () => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending Approval',
          className: 'badge-amber',
          icon: <Clock size={13} />,
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          className: 'badge-emerald',
          icon: <CheckCircle2 size={13} />,
        };
      case 'seated':
        return {
          label: 'Currently Seated',
          className: 'badge-blue',
          icon: <Users size={13} />,
        };
      case 'completed':
        return {
          label: 'Completed',
          className: 'badge-emerald',
          icon: <CheckCircle2 size={13} />,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'badge-rose',
          icon: <XCircle size={13} />,
        };
      default:
        return {
          label: status,
          className: 'badge-gold',
          icon: <Calendar size={13} />,
        };
    }
  };

  const badge = type === 'order' ? getOrderBadge() : getReservationBadge();

  return (
    <span className={`badge ${badge.className}`}>
      {badge.icon}
      {badge.label}
    </span>
  );
};
