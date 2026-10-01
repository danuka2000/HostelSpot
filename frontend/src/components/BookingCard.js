import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import StatusBadge from './StatusBadge';

export const BookingCard = ({ booking, onPress, onCancel, onApprove, onReject, isAdmin = false }) => {
  const room = booking.roomId || {};
  const user = booking.userId || {};

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      className="bg-white rounded-2xl mb-4 overflow-hidden border border-cream-200 shadow-sm"
    >
      {/* Ticket Header Bar */}
      <View className="bg-forest-900 px-4 py-2.5 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Text className="text-xs font-bold text-cream-200 uppercase tracking-widest">
            HOSTELSPOT VOUCHER
          </Text>
          <Text className="text-[10px] text-sage-200 ml-2 font-mono">
            #{booking._id ? booking._id.substring(booking._id.length - 6).toUpperCase() : 'RES'}
          </Text>
        </View>
        <StatusBadge status={booking.status} size="small" />
      </View>

      <View className="p-4">
        <View className="flex-row justify-between items-start mb-3">
          <View>
            <Text className="text-base font-bold text-forest-900">
              Room {room.roomNumber || 'N/A'} <Text className="text-xs font-normal text-charcoal-500">({room.roomType || 'Standard'})</Text>
            </Text>
            {isAdmin && (
              <Text className="text-xs text-clay-600 font-semibold mt-0.5">
                Applicant: {user.name || 'Unknown User'} ({user.email || ''})
              </Text>
            )}
          </View>
          <Text className="text-sm font-bold text-clay-600">
            Rs. {room.pricePerMonth?.toLocaleString()}<Text className="text-[10px] text-charcoal-400 font-normal">/mo</Text>
          </Text>
        </View>

        {/* Date Breakdown Row */}
        <View className="flex-row bg-sand-100 rounded-xl p-3 my-1 items-center border border-cream-200">
          <View className="flex-1 items-center">
            <Text className="text-[9px] font-bold text-charcoal-500 uppercase tracking-wider">CHECK-IN</Text>
            <Text className="text-xs font-bold text-forest-900 mt-0.5">{formatDate(booking.startDate)}</Text>
          </View>
          <View className="w-[1px] h-6 bg-cream-300" />
          <View className="flex-1 items-center">
            <Text className="text-[9px] font-bold text-charcoal-500 uppercase tracking-wider">CHECK-OUT</Text>
            <Text className="text-xs font-bold text-forest-900 mt-0.5">{formatDate(booking.endDate)}</Text>
          </View>
        </View>

        {booking.notes ? (
          <Text className="text-xs text-charcoal-500 mt-2 italic bg-cream-50 p-2 rounded-lg border border-cream-100" numberOfLines={2}>
            Note: {booking.notes}
          </Text>
        ) : null}

        {/* Action Controls */}
        <View className="mt-3 pt-2.5 border-t border-cream-100 flex-row justify-between items-center">
          <Text className="text-[11px] font-bold text-forest-900">Tap to inspect details →</Text>

          {!isAdmin && booking.status !== 'Cancelled' && onCancel && (
            <TouchableOpacity className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg" onPress={onCancel}>
              <Text className="text-rose-700 font-bold text-xs">Cancel Request</Text>
            </TouchableOpacity>
          )}

          {isAdmin && booking.status === 'Pending' && (
            <View className="flex-row gap-2">
              {onApprove && (
                <TouchableOpacity className="bg-forest-900 px-3 py-1.5 rounded-lg" onPress={onApprove}>
                  <Text className="text-cream-50 font-bold text-xs">Approve</Text>
                </TouchableOpacity>
              )}
              {onReject && (
                <TouchableOpacity className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg" onPress={onReject}>
                  <Text className="text-rose-700 font-bold text-xs">Reject</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BookingCard;
