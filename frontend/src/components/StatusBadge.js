import React from 'react';
import { View, Text } from 'react-native';

export const StatusBadge = ({ status, size = 'normal' }) => {
  let bgClass = "bg-cream-200";
  let textClass = "text-charcoal-700";
  let dotColor = "bg-charcoal-500";

  switch (status) {
    case 'Available':
    case 'Approved':
      bgClass = "bg-emerald-50 border border-emerald-200";
      textClass = "text-emerald-800";
      dotColor = "bg-emerald-600";
      break;
    case 'Pending':
      bgClass = "bg-amber-50 border border-amber-200";
      textClass = "text-amber-800";
      dotColor = "bg-amber-500";
      break;
    case 'Full':
    case 'Rejected':
    case 'Cancelled':
    case 'Unavailable':
      bgClass = "bg-rose-50 border border-rose-200";
      textClass = "text-rose-800";
      dotColor = "bg-rose-500";
      break;
  }

  const isSmall = size === 'small';

  return (
    <View className={`flex-row items-center rounded-full self-start ${isSmall ? 'px-2 py-0.5' : 'px-3 py-1'} ${bgClass}`}>
      <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`} />
      <Text className={`${isSmall ? 'text-[10px]' : 'text-xs'} font-bold tracking-wide uppercase ${textClass}`}>
        {status}
      </Text>
    </View>
  );
};

export default StatusBadge;
