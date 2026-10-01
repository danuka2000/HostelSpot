import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import StatusBadge from './StatusBadge';

export const FeaturedRoomCard = ({ room, onPress }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
  const imageUrl = room.image && room.image.trim() !== '' ? room.image : defaultImage;
  const spotsLeft = room.capacity - room.currentOccupancy;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.92}
      className="w-72 bg-white rounded-3xl overflow-hidden border border-cream-200 mr-4 shadow-sm"
    >
      <View className="relative h-44 w-full">
        <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
        <View className="absolute top-3 left-3">
          <StatusBadge status={room.availabilityStatus} size="small" />
        </View>
        <View className="absolute bottom-3 right-3 bg-forest-950/80 px-3 py-1 rounded-full border border-white/10">
          <Text className="text-xs font-bold text-cream-50">
            Rs. {room.pricePerMonth?.toLocaleString()} <Text className="text-[10px] font-normal text-cream-200">/mo</Text>
          </Text>
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-base font-bold text-forest-900">Residence {room.roomNumber}</Text>
          <Text className="text-xs font-semibold text-clay-600 bg-clay-50 px-2 py-0.5 rounded-md">
            {room.roomType}
          </Text>
        </View>

        <View className="flex-row items-center justify-between border-t border-cream-100 pt-2.5 mt-2">
          <Text className="text-xs text-charcoal-500 font-medium">
            Capacity: <Text className="text-charcoal-900 font-semibold">{room.capacity} Persons</Text>
          </Text>
          <Text className={`text-xs font-bold ${spotsLeft > 0 ? 'text-sage-700' : 'text-rose-700'}`}>
            {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft > 1 ? 's' : ''} left` : 'Full'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FeaturedRoomCard;
