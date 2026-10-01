import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BedDouble, CheckCircle, AlertTriangle, Clock, PlusCircle, ClipboardList, Settings } from 'lucide-react-native';
import { roomService } from '../../services/roomService';
import { bookingService } from '../../services/bookingService';
import AppButton from '../../components/AppButton';
import { LoadingSpinner } from '../../components/FeedbackStates';

export const AdminDashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    fullRooms: 0,
    pendingBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const roomRes = await roomService.getAllRooms();
      const bookingRes = await bookingService.getAllBookings();

      if (roomRes.success && bookingRes.success) {
        const rooms = roomRes.data;
        const bookings = bookingRes.data;

        setStats({
          totalRooms: rooms.length,
          availableRooms: rooms.filter(r => r.availabilityStatus === 'Available').length,
          fullRooms: rooms.filter(r => r.availabilityStatus === 'Full').length,
          pendingBookings: bookings.filter(b => b.status === 'Pending').length
        });
      }
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchStats();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return <LoadingSpinner message="Loading HostelSpot operational metrics..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#122C23']} />}
      >
        <Text className="text-[11px] font-bold text-clay-600 uppercase tracking-widest">
          PROPERTY ADMINISTRATION
        </Text>
        <Text className="text-2xl font-extrabold text-forest-900 mb-1">Operational Overview</Text>
        <Text className="text-xs text-charcoal-500 mb-6 font-medium">
          Live residence statistics & management hub
        </Text>

        {/* 4 Metrics Cards Grid */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          <View className="w-[48%] bg-white rounded-2xl p-4 border border-cream-200 shadow-sm">
            <BedDouble color="#122C23" size={20} className="mb-2" />
            <Text className="text-2xl font-black text-forest-900">{stats.totalRooms}</Text>
            <Text className="text-[11px] font-bold text-charcoal-500 mt-0.5">Total Residences</Text>
          </View>

          <View className="w-[48%] bg-emerald-50 rounded-2xl p-4 border border-emerald-200 shadow-sm">
            <CheckCircle color="#2E6F40" size={20} className="mb-2" />
            <Text className="text-2xl font-black text-emerald-900">{stats.availableRooms}</Text>
            <Text className="text-[11px] font-bold text-emerald-800 mt-0.5">Available Rooms</Text>
          </View>

          <View className="w-[48%] bg-rose-50 rounded-2xl p-4 border border-rose-200 shadow-sm">
            <AlertTriangle color="#B93838" size={20} className="mb-2" />
            <Text className="text-2xl font-black text-rose-900">{stats.fullRooms}</Text>
            <Text className="text-[11px] font-bold text-rose-800 mt-0.5">Full Capacity</Text>
          </View>

          <View className="w-[48%] bg-amber-50 rounded-2xl p-4 border border-amber-200 shadow-sm">
            <Clock color="#C27803" size={20} className="mb-2" />
            <Text className="text-2xl font-black text-amber-900">{stats.pendingBookings}</Text>
            <Text className="text-[11px] font-bold text-amber-800 mt-0.5">Pending Approvals</Text>
          </View>
        </View>

        {/* Operational Action Stack */}
        <View className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm gap-3">
          <Text className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-2">
            Operational Management Controls
          </Text>

          <AppButton
            title="Manage Residence Inventory"
            onPress={() => navigation.navigate('ManageRooms')}
          />

          <AppButton
            title="+ Add New Residence"
            variant="secondary"
            onPress={() => navigation.navigate('AddRoom')}
          />

          <AppButton
            title="Review Pending Applications"
            variant="secondary"
            onPress={() => navigation.navigate('ManageBookings')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboardScreen;
