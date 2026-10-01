import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Users, ShieldCheck, Wifi, Sparkles, CheckCircle2 } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import { roomService } from '../../services/roomService';
import StatusBadge from '../../components/StatusBadge';
import AppButton from '../../components/AppButton';
import { LoadingSpinner, ErrorState } from '../../components/FeedbackStates';

export const RoomDetailsScreen = ({ route, navigation }) => {
  const { roomId } = route.params;
  const { user } = useContext(AuthContext);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoomDetails = async () => {
    try {
      setError(null);
      const res = await roomService.getRoomById(roomId);
      if (res.success) {
        setRoom(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load room details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  if (loading) {
    return <LoadingSpinner message="Retrieving residence details..." />;
  }

  if (error || !room) {
    return <ErrorState message={error || 'Residence record not found'} onRetry={fetchRoomDetails} />;
  }

  const defaultImage = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
  const imageUrl = room.image && room.image.trim() !== '' ? room.image : defaultImage;
  const remainingCapacity = room.capacity - room.currentOccupancy;
  const isBookable = room.availabilityStatus === 'Available' && remainingCapacity > 0;

  return (
    <SafeAreaView className="flex-1 bg-cream-50" edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Hero Image Container */}
        <View className="relative h-72 w-full">
          <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-12 left-4 w-10 h-10 rounded-full bg-forest-950/70 items-center justify-center border border-white/20"
          >
            <ArrowLeft color="#FAF8F5" size={20} />
          </TouchableOpacity>

          <View className="absolute bottom-4 left-4">
            <StatusBadge status={room.availabilityStatus} />
          </View>
        </View>

        {/* Floating Residence Sheet */}
        <View className="bg-white rounded-t-3xl -mt-5 p-6 border-t border-cream-200">
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-xs font-bold text-clay-600 uppercase tracking-widest">
                HOSTELSPOT RESIDENCE
              </Text>
              <Text className="text-2xl font-extrabold text-forest-900 mt-0.5">
                Room {room.roomNumber}
              </Text>
              <Text className="text-sm font-medium text-charcoal-500">
                {room.roomType} Accommodation
              </Text>
            </View>

            <View className="bg-sand-100 p-3 rounded-2xl border border-cream-200 items-end">
              <Text className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider">MONTHLY RENT</Text>
              <Text className="text-xl font-black text-clay-600">
                Rs. {room.pricePerMonth?.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Occupancy & Capacity Metrics Grid */}
          <View className="flex-row bg-sand-100 rounded-2xl p-4 my-5 border border-cream-200">
            <View className="flex-1 items-center border-r border-cream-200 pr-2">
              <Text className="text-[9px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">TOTAL CAPACITY</Text>
              <Text className="text-sm font-extrabold text-forest-900">{room.capacity} Beds</Text>
            </View>

            <View className="flex-1 items-center border-r border-cream-200 px-2">
              <Text className="text-[9px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">CURRENTLY OCCUPIED</Text>
              <Text className="text-sm font-extrabold text-forest-900">{room.currentOccupancy} Occupied</Text>
            </View>

            <View className="flex-1 items-center pl-2">
              <Text className="text-[9px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">SPOTS REMAINING</Text>
              <Text className={`text-sm font-extrabold ${remainingCapacity > 0 ? 'text-forest-700' : 'text-rose-700'}`}>
                {remainingCapacity} Spots
              </Text>
            </View>
          </View>

          {/* Description & Features */}
          <View className="mb-6">
            <Text className="text-base font-bold text-forest-900 mb-2">About This Residence</Text>
            <Text className="text-xs text-charcoal-600 leading-6">
              {room.description || 'This HostelSpot residence offers modern student living, high-speed Wi-Fi, study spaces, and 24/7 security in a quiet environment.'}
            </Text>
          </View>

          {/* Residence Highlights */}
          <View className="bg-cream-50 p-4 rounded-2xl border border-cream-200 mb-4">
            <Text className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-3">
              Included Amenities & Amenities
            </Text>
            <View className="gap-2">
              <View className="flex-row items-center">
                <CheckCircle2 color="#2F6A56" size={16} className="mr-2" />
                <Text className="text-xs font-medium text-charcoal-700 ml-2">High-speed Campus Wi-Fi Access</Text>
              </View>
              <View className="flex-row items-center">
                <CheckCircle2 color="#2F6A56" size={16} className="mr-2" />
                <Text className="text-xs font-medium text-charcoal-700 ml-2">24/7 Gated Security & CCTV Coverage</Text>
              </View>
              <View className="flex-row items-center">
                <CheckCircle2 color="#2F6A56" size={16} className="mr-2" />
                <Text className="text-xs font-medium text-charcoal-700 ml-2">Dedicated Study Table & Storage Lockers</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      {!user?.isAdmin && (
        <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-cream-200 flex-row justify-between items-center shadow-lg">
          <View className="mr-4">
            <Text className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider">Total Monthly</Text>
            <Text className="text-lg font-black text-forest-900">
              Rs. {room.pricePerMonth?.toLocaleString()}
            </Text>
          </View>
          <AppButton
            title={isBookable ? 'Reserve This Room' : 'Unavailable'}
            variant={isBookable ? 'accent' : 'primary'}
            disabled={!isBookable}
            onPress={() => navigation.navigate('CreateBooking', { room })}
            className="flex-1 max-w-[200px]"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default RoomDetailsScreen;
