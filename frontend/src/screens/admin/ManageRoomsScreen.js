import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl, Alert, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Plus, Edit3, Trash2, BedDouble } from 'lucide-react-native';
import { roomService } from '../../services/roomService';
import { useToast } from '../../context/ToastContext';
import AppButton from '../../components/AppButton';
import StatusBadge from '../../components/StatusBadge';
import { LoadingSpinner, EmptyState, ErrorState } from '../../components/FeedbackStates';

export const ManageRoomsScreen = ({ navigation }) => {
  const { showToast } = useToast();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    try {
      setError(null);
      const res = await roomService.getAllRooms();
      if (res.success) {
        setRooms(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRooms();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchRooms();
  };

  const performDelete = async (roomId, roomNumber) => {
    try {
      const res = await roomService.deleteRoom(roomId);
      if (res.success) {
        showToast(`Room ${roomNumber} deleted successfully!`, 'success');
        fetchRooms();
      }
    } catch (err) {
      showToast(err.message || 'Cannot delete room with active bookings', 'danger');
    }
  };

  const handleDeleteRoom = (roomId, roomNumber) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Are you sure you want to delete Room ${roomNumber}?`)) {
        performDelete(roomId, roomNumber);
      }
    } else {
      Alert.alert(
        'Delete Room',
        `Are you sure you want to delete Room ${roomNumber}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => performDelete(roomId, roomNumber)
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-4 bg-white border-b border-cream-200 shadow-sm">
        <View>
          <Text className="text-xl font-extrabold text-forest-900">Inventory</Text>
          <Text className="text-xs text-charcoal-500 font-medium">Manage HostelSpot rooms</Text>
        </View>
        <AppButton
          title="+ Add Room"
          variant="accent"
          onPress={() => navigation.navigate('AddRoom')}
          className="h-10 px-4"
        />
      </View>

      {loading ? (
        <LoadingSpinner message="Fetching residence inventory..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRooms} />
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="bg-white rounded-2xl p-4 mb-3 border border-cream-200 flex-row justify-between items-center shadow-sm">
              <View className="flex-1 pr-3">
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="text-base font-bold text-forest-900">Room {item.roomNumber}</Text>
                  <StatusBadge status={item.availabilityStatus} size="small" />
                </View>
                <Text className="text-xs text-charcoal-600 font-medium">
                  {item.roomType} • Rs. {item.pricePerMonth?.toLocaleString()}/mo • {item.currentOccupancy}/{item.capacity} Occupied
                </Text>
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="bg-sage-100 p-2 rounded-xl border border-sage-200"
                  onPress={() => navigation.navigate('EditRoom', { room: item })}
                >
                  <Edit3 color="#122C23" size={16} />
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-rose-50 p-2 rounded-xl border border-rose-200"
                  onPress={() => handleDeleteRoom(item._id, item.roomNumber)}
                >
                  <Trash2 color="#B93838" size={16} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#122C23']} />}
          ListEmptyComponent={
            <EmptyState
              title="No Residences Configured"
              message="Click '+ Add Room' above to create your first residence entry."
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ManageRoomsScreen;
