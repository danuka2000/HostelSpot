import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Compass, Shield, Sparkles, CalendarCheck } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import { roomService } from '../../services/roomService';
import { bookingService } from '../../services/bookingService';
import RoomCard from '../../components/RoomCard';
import FeaturedRoomCard from '../../components/FeaturedRoomCard';
import BookingCard from '../../components/BookingCard';
import { LoadingSpinner } from '../../components/FeedbackStates';

export const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const roomRes = await roomService.getAllRooms({ availabilityStatus: 'Available' });
      if (roomRes.success) {
        setRooms(roomRes.data);
      }

      if (!user?.isAdmin) {
        const bookingRes = await bookingService.getAllBookings();
        if (bookingRes.success && bookingRes.data.length > 0) {
          const approvedOrPending = bookingRes.data.find(
            b => b.status === 'Approved' || b.status === 'Pending'
          );
          setActiveBooking(approvedOrPending || bookingRes.data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDashboardData();
    }, [user?.isAdmin])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleSearchSubmit = () => {
    navigation.navigate('RoomsTab');
  };

  if (loading) {
    return <LoadingSpinner message="Curating HostelSpot residences..." />;
  }

  const featuredRooms = rooms.slice(0, 4);

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#122C23']} />}
      >
        {/* Editorial Greeting Header */}
        <View className="px-5 pt-4 pb-6 bg-forest-900 rounded-b-3xl shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-xs font-bold text-sage-200 uppercase tracking-widest">
                HOSTELSPOT RESIDENCES
              </Text>
              <Text className="text-2xl font-extrabold text-cream-50 mt-0.5">
                Good morning, {user?.name ? user.name.split(' ')[0] : 'Resident'}
              </Text>
            </View>
            <View className="bg-forest-800 border border-forest-700 px-3 py-1 rounded-full flex-row items-center">
              <Sparkles color="#E4ECE7" size={12} className="mr-1" />
              <Text className="text-cream-50 font-bold text-[10px] uppercase tracking-wider ml-1">
                {user?.isAdmin ? 'ADMIN' : 'STUDENT'}
              </Text>
            </View>
          </View>

          <Text className="text-xs text-sage-100 font-medium">
            Find a boutique accommodation that feels like home.
          </Text>
        </View>

        {/* Content Section */}
        <View className="px-5 pt-6">

          {/* Current Active Stay Ticket (if student has booking) */}
          {!user?.isAdmin && activeBooking && (
            <View className="mb-6">
              <View className="flex-row justify-between items-baseline mb-3">
                <Text className="text-base font-bold text-forest-900">Your Active Reservation</Text>
                <TouchableOpacity onPress={() => navigation.navigate('BookingsTab')}>
                  <Text className="text-xs font-bold text-clay-600">View All →</Text>
                </TouchableOpacity>
              </View>
              <BookingCard
                booking={activeBooking}
                onPress={() => navigation.navigate('BookingDetails', { bookingId: activeBooking._id })}
              />
            </View>
          )}

          {/* Horizontal Featured Rooms Carousel */}
          <View className="mb-6">
            <View className="flex-row justify-between items-baseline mb-3">
              <Text className="text-base font-bold text-forest-900">Featured Residences</Text>
              <TouchableOpacity onPress={() => navigation.navigate('RoomsTab')}>
                <Text className="text-xs font-bold text-clay-600">Explore ({rooms.length})</Text>
              </TouchableOpacity>
            </View>

            {featuredRooms.length === 0 ? (
              <View className="bg-white rounded-2xl p-6 items-center border border-cream-200">
                <Text className="text-charcoal-500 text-xs font-medium">No available residences at this time.</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
                {featuredRooms.map((room) => (
                  <FeaturedRoomCard
                    key={room._id}
                    room={room}
                    onPress={() => navigation.navigate('RoomDetails', { roomId: room._id })}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          {/* Quick Category Banner */}
          <View className="bg-sage-100/70 rounded-2xl p-4 mb-6 border border-sage-200 flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-xs font-bold text-forest-900 uppercase tracking-wider">
                Boutique Amenities Included
              </Text>
              <Text className="text-xs text-charcoal-700 mt-1 leading-5">
                High-speed Wi-Fi, study lounges, 24/7 security, and attached washrooms.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('RoomsTab')}
              className="bg-forest-900 px-3 py-2 rounded-xl"
            >
              <Text className="text-[11px] font-bold text-cream-50">Browse</Text>
            </TouchableOpacity>
          </View>

          {/* All Available Rooms Section */}
          <View className="mb-4">
            <View className="flex-row justify-between items-baseline mb-3">
              <Text className="text-base font-bold text-forest-900">All Available Residences</Text>
            </View>

            {rooms.length === 0 ? (
              <View className="bg-white rounded-2xl p-6 items-center border border-cream-200">
                <Text className="text-charcoal-500 text-xs font-medium">No residences found.</Text>
              </View>
            ) : (
              rooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onPress={() => navigation.navigate('RoomDetails', { roomId: room._id })}
                />
              ))
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
