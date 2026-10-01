import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, User, Calendar, Home, Clock, FileText } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import StatusBadge from '../../components/StatusBadge';
import AppButton from '../../components/AppButton';
import { LoadingSpinner, ErrorState } from '../../components/FeedbackStates';

export const BookingDetailsScreen = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const { user } = useContext(AuthContext);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookingDetails = async () => {
    try {
      setError(null);
      const res = await bookingService.getBookingById(bookingId);
      if (res.success) {
        setBooking(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const res = await bookingService.approveBooking(bookingId);
      if (res.success) {
        Alert.alert('Approved', 'Reservation request approved successfully.');
        fetchBookingDetails();
      }
    } catch (err) {
      Alert.alert('Approval Failed', err.message || 'Error approving booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const res = await bookingService.rejectBooking(bookingId);
      if (res.success) {
        Alert.alert('Rejected', 'Reservation request rejected.');
        fetchBookingDetails();
      }
    } catch (err) {
      Alert.alert('Rejection Failed', err.message || 'Error rejecting booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      const res = await bookingService.cancelBooking(bookingId);
      if (res.success) {
        Alert.alert('Cancelled', 'Reservation has been cancelled.');
        fetchBookingDetails();
      }
    } catch (err) {
      Alert.alert('Cancel Failed', err.message || 'Error cancelling booking');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Generating reservation ticket..." />;
  }

  if (error || !booking) {
    return <ErrorState message={error || 'Reservation details unavailable'} onRetry={fetchBookingDetails} />;
  }

  const room = booking.roomId || {};
  const student = booking.userId || {};

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* Ticket Outer Wrapper */}
        <View className="bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-sm mb-6">

          {/* Ticket Banner Header */}
          <View className="bg-forest-900 p-6 flex-row justify-between items-start">
            <View>
              <Text className="text-xs font-bold text-sage-200 uppercase tracking-widest">
                HOSTELSPOT DIGITAL VOUCHER
              </Text>
              <Text className="text-xl font-extrabold text-cream-50 mt-1">
                Ref: #{booking._id ? booking._id.substring(booking._id.length - 8).toUpperCase() : 'RES'}
              </Text>
            </View>
            <StatusBadge status={booking.status} />
          </View>

          <View className="p-6">

            {/* Applicant Section */}
            <View className="mb-5 bg-sand-100 p-4 rounded-2xl border border-cream-200">
              <View className="flex-row items-center mb-2">
                <User color="#122C23" size={16} className="mr-2" />
                <Text className="text-xs font-bold text-forest-900 uppercase tracking-wider ml-1">
                  Applicant Information
                </Text>
              </View>
              <Text className="text-sm font-bold text-charcoal-900">{student.name || 'N/A'}</Text>
              <Text className="text-xs text-charcoal-600 mt-0.5">{student.email || 'N/A'}</Text>
              <Text className="text-xs text-charcoal-600 mt-0.5">{student.phone || 'N/A'}</Text>
            </View>

            {/* Room Specifications */}
            <View className="mb-5 bg-sand-100 p-4 rounded-2xl border border-cream-200">
              <View className="flex-row items-center mb-2">
                <Home color="#122C23" size={16} className="mr-2" />
                <Text className="text-xs font-bold text-forest-900 uppercase tracking-wider ml-1">
                  Residence Specifications
                </Text>
              </View>
              <Text className="text-sm font-bold text-charcoal-900">
                Room {room.roomNumber} ({room.roomType || 'Standard'})
              </Text>
              <Text className="text-xs text-clay-600 font-semibold mt-0.5">
                Monthly Rate: Rs. {room.pricePerMonth?.toLocaleString()}/month
              </Text>
              <Text className="text-xs text-charcoal-600 mt-0.5">
                Current Occupancy: {room.currentOccupancy} / {room.capacity} occupied
              </Text>
            </View>

            {/* Stay Period */}
            <View className="mb-5 bg-sand-100 p-4 rounded-2xl border border-cream-200">
              <View className="flex-row items-center mb-2">
                <Calendar color="#122C23" size={16} className="mr-2" />
                <Text className="text-xs font-bold text-forest-900 uppercase tracking-wider ml-1">
                  Stay Schedule
                </Text>
              </View>
              <Text className="text-xs text-charcoal-700 font-medium">
                Check-in: <Text className="font-bold text-forest-900">{new Date(booking.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</Text>
              </Text>
              <Text className="text-xs text-charcoal-700 font-medium mt-1">
                Check-out: <Text className="font-bold text-forest-900">{new Date(booking.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</Text>
              </Text>
              <Text className="text-[10px] text-charcoal-400 mt-2">
                Applied on: {new Date(booking.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </Text>
            </View>

            {booking.notes ? (
              <View className="mb-2 bg-cream-50 p-4 rounded-2xl border border-cream-200">
                <Text className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                  Applicant Notes & Preferences
                </Text>
                <Text className="text-xs text-charcoal-600 italic leading-5">{booking.notes}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Action Controls */}
        <View className="gap-3">
          {user?.isAdmin && booking.status === 'Pending' && (
            <View className="flex-row gap-3">
              <AppButton
                title="Approve Request"
                variant="primary"
                onPress={handleApprove}
                loading={actionLoading}
                className="flex-1"
              />
              <AppButton
                title="Reject"
                variant="danger"
                onPress={handleReject}
                loading={actionLoading}
                className="flex-1"
              />
            </View>
          )}

          {!user?.isAdmin && booking.status !== 'Cancelled' && (
            <AppButton
              title="Cancel Reservation"
              variant="danger"
              onPress={handleCancel}
              loading={actionLoading}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingDetailsScreen;
