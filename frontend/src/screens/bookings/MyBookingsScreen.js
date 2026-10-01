import React, { useState, useContext } from 'react';
import { View, Text, FlatList, RefreshControl, Alert, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import BookingCard from '../../components/BookingCard';
import { LoadingSpinner, EmptyState, ErrorState } from '../../components/FeedbackStates';

export const MyBookingsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

  const filterTabs = ['All', 'Pending', 'Approved', 'Cancelled'];

  const fetchBookings = async () => {
    try {
      setError(null);
      const res = await bookingService.getAllBookings();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
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

  const performCancel = async (bookingId) => {
    try {
      const res = await bookingService.cancelBooking(bookingId);
      if (res.success) {
        if (Platform.OS === 'web') {
          alert('Your reservation request has been cancelled.');
        } else {
          Alert.alert('Reservation Cancelled', 'Your reservation request has been cancelled.');
        }
        fetchBookings();
      }
    } catch (err) {
      if (Platform.OS === 'web') {
        alert(err.message || 'Could not cancel booking');
      } else {
        Alert.alert('Error', err.message || 'Could not cancel booking');
      }
    }
  };

  const handleCancelBooking = (bookingId) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to cancel this HostelSpot reservation?')) {
        performCancel(bookingId);
      }
    } else {
      Alert.alert(
        'Cancel Reservation',
        'Are you sure you want to cancel this HostelSpot reservation?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: () => performCancel(bookingId)
          }
        ]
      );
    }
  };

  const filteredBookings = activeTab === 'All'
    ? bookings
    : bookings.filter(b => b.status === activeTab);

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      {/* Header */}
      <View className="px-5 pt-4 pb-3 bg-white border-b border-cream-200 shadow-sm">
        <Text className="text-2xl font-extrabold text-forest-900">
          {user?.isAdmin ? 'Student Applications' : 'My Reservations'}
        </Text>
        <Text className="text-xs text-charcoal-500 mt-0.5">
          Manage your HostelSpot room bookings & digital vouchers
        </Text>

        {/* Filter Bar */}
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

      {/* List Content */}
      {loading ? (
        <LoadingSpinner message="Fetching HostelSpot reservation history..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBookings} />
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              isAdmin={user?.isAdmin}
              onPress={() => navigation.navigate('BookingDetails', { bookingId: item._id })}
              onCancel={() => handleCancelBooking(item._id)}
            />
          )}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#122C23']} />}
          ListEmptyComponent={
            <EmptyState
              title="No Reservations Found"
              message={
                user?.isAdmin
                  ? 'No student applications match the selected status filter.'
                  : 'You do not have any room bookings under this category.'
              }
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default MyBookingsScreen;
