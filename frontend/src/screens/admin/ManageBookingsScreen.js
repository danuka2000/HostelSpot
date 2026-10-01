import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { bookingService } from '../../services/bookingService';
import BookingCard from '../../components/BookingCard';
import { LoadingSpinner, EmptyState, ErrorState } from '../../components/FeedbackStates';

export const ManageBookingsScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Pending');

  const filterTabs = ['Pending', 'Approved', 'Rejected', 'Cancelled', 'All'];

  const fetchBookings = async () => {
    try {
      setError(null);
      const res = await bookingService.getAllBookings();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings list');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBookings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleApprove = async (bookingId) => {
    try {
      const res = await bookingService.approveBooking(bookingId);
      if (res.success) {
        Alert.alert('Approved', 'Reservation request approved successfully.');
        fetchBookings();
      }
    } catch (err) {
      Alert.alert('Approval Error', err.message || 'Could not approve booking');
    }
  };

  const handleReject = async (bookingId) => {
    try {
      const res = await bookingService.rejectBooking(bookingId);
      if (res.success) {
        Alert.alert('Rejected', 'Reservation request rejected.');
        fetchBookings();
      }
    } catch (err) {
      Alert.alert('Rejection Error', err.message || 'Could not reject booking');
    }
  };

  const filteredBookings = activeTab === 'All'
    ? bookings
    : bookings.filter(b => b.status === activeTab);

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      {/* Header */}
      <View className="px-5 pt-4 pb-3 bg-white border-b border-cream-200 shadow-sm">
        <Text className="text-xl font-extrabold text-forest-900">Application Queue</Text>
        <Text className="text-xs text-charcoal-500 font-medium mt-0.5">
          Review student room booking applications
        </Text>

        {/* Filter Tabs */}
        <View className="flex-row gap-2 mt-3">
          {filterTabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full border ${
                activeTab === tab
                  ? 'bg-forest-900 border-forest-900'
                  : 'bg-sand-100 border-cream-200'
              }`}
            >
              <Text className={`text-xs font-bold ${activeTab === tab ? 'text-cream-50' : 'text-charcoal-700'}`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Operations List */}
      {loading ? (
        <LoadingSpinner message="Fetching pending applications..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBookings} />
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              isAdmin={true}
              onPress={() => navigation.navigate('BookingDetails', { bookingId: item._id })}
              onApprove={() => handleApprove(item._id)}
              onReject={() => handleReject(item._id)}
            />
          )}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#122C23']} />}
          ListEmptyComponent={
            <EmptyState
              title="Queue Clear"
              message={`There are currently no student applications under '${activeTab}'.`}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ManageBookingsScreen;
