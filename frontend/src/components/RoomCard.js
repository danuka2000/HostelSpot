import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import StatusBadge from './StatusBadge';

export const RoomCard = ({ room, onPress }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
  const imageUrl = room.image && room.image.trim() !== '' ? room.image : defaultImage;
  const spotsLeft = room.capacity - room.currentOccupancy;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-white rounded-2xl mb-4 overflow-hidden border border-cream-200 shadow-sm"
    >
      <View className="relative h-44 w-full">
        <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
        <View className="absolute top-3 left-3">
          <StatusBadge status={room.availabilityStatus} size="small" />
        </View>
        <View className="absolute top-3 right-3 bg-forest-950/70 px-2.5 py-1 rounded-full border border-white/20">
          <Text className="text-[11px] font-bold text-cream-50">{room.roomType}</Text>
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row justify-between items-baseline mb-2">
          <View>
            <Text className="text-xs font-bold text-sage-600 uppercase tracking-wider">HostelSpot Residence</Text>
            <Text className="text-lg font-bold text-forest-900 mt-0.5">Room {room.roomNumber}</Text>
          </View>
          <View className="items-end">
            <Text className="text-xs text-charcoal-400 font-medium">Monthly Rate</Text>
            <Text className="text-base font-extrabold text-clay-600">
              Rs. {room.pricePerMonth?.toLocaleString()}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between bg-cream-50 rounded-xl p-3 border border-cream-100 mt-1">
          <View className="flex-row items-center">
            <Text className="text-xs text-charcoal-600 font-medium">
              Capacity: <Text className="font-bold text-charcoal-900">{room.capacity} beds</Text>
            </Text>
            <Text className="text-charcoal-300 mx-2">•</Text>
            <Text className="text-xs text-charcoal-600 font-medium">
              Occupied: <Text className="font-bold text-charcoal-900">{room.currentOccupancy}</Text>
            </Text>
          </View>

          <Text className={`text-xs font-bold ${spotsLeft > 0 ? 'text-forest-700' : 'text-rose-700'}`}>
            {spotsLeft > 0 ? `${spotsLeft} available` : 'Full'}
          </Text>
        </View>

        <View className="mt-3 flex-row justify-between items-center pt-2 border-t border-cream-100">
          <Text className="text-xs text-charcoal-500 italic" numberOfLines={1}>
            {room.description || 'Premium student accommodation with full amenities.'}
          </Text>
          <Text className="text-xs font-bold text-forest-900 ml-2">View details →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RoomCard;
