import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { roomService } from '../../services/roomService';
import RoomCard from '../../components/RoomCard';
import { LoadingSpinner, EmptyState, ErrorState } from '../../components/FeedbackStates';

export const RoomListScreen = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const roomTypes = ['All', 'Single', 'Double', 'Triple'];
  const availabilityStatuses = ['All', 'Available', 'Full', 'Unavailable'];

  const fetchRooms = async () => {
    try {
      setError(null);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedType !== 'All') params.roomType = selectedType;
      if (selectedStatus !== 'All') params.availabilityStatus = selectedStatus;

      const res = await roomService.getAllRooms(params);
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

  useEffect(() => {
    fetchRooms();
  }, [selectedType, selectedStatus]);

  const handleSearchSubmit = () => {
    setLoading(true);
    fetchRooms();
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRooms();
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      {/* Header Search & Filter Bar */}
      <View className="px-5 pt-4 pb-3 bg-white border-b border-cream-200 shadow-sm">
        <Text className="text-2xl font-extrabold text-forest-900 mb-3">Find Your Stay</Text>

        <View className="flex-row gap-2 mb-3">
          <View className="flex-1 flex-row items-center bg-sand-100 rounded-2xl px-3.5 border border-cream-200 h-11">
            <Search color="#122C23" size={18} className="mr-2" />
            <TextInput
              className="flex-1 text-sm text-charcoal-900 font-medium ml-2"
              placeholder="Search room number (e.g. A-101)..."
              placeholderTextColor="#A0A9AE"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            className="bg-forest-900 rounded-2xl px-4 justify-center items-center h-11"
            onPress={handleSearchSubmit}
          >
            <Text className="text-cream-50 font-bold text-xs">Search</Text>
          </TouchableOpacity>
        </View>

        {/* Room Type Filter Chips */}
        <View className="flex-row items-center my-1">
          <Text className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider w-12">Type:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {roomTypes.map((type) => (
              <TouchableOpacity
                key={type}
                className={`px-3.5 py-1 rounded-full border ${
                  selectedType === type ? 'bg-forest-900 border-forest-900' : 'bg-sand-100 border-cream-200'
                }`}
                onPress={() => setSelectedType(type)}
              >
                <Text className={`text-xs font-bold ${selectedType === type ? 'text-cream-50' : 'text-charcoal-700'}`}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Status Filter Chips */}
        <View className="flex-row items-center mt-1.5">
          <Text className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider w-12">Status:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {availabilityStatuses.map((status) => (
              <TouchableOpacity
                key={status}
                className={`px-3.5 py-1 rounded-full border ${
                  selectedStatus === status ? 'bg-clay-600 border-clay-600' : 'bg-sand-100 border-cream-200'
                }`}
                onPress={() => setSelectedStatus(status)}
              >
                <Text className={`text-xs font-bold ${selectedStatus === status ? 'text-cream-50' : 'text-charcoal-700'}`}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Main List */}
      {loading ? (
        <LoadingSpinner message="Searching HostelSpot catalog..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRooms} />
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <RoomCard
              room={item}
              onPress={() => navigation.navigate('RoomDetails', { roomId: item._id })}
            />
          )}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#122C23']} />}
          ListEmptyComponent={
            <EmptyState
              title="No Residences Found"
              message="No room matches your search parameters. Try changing filters."
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default RoomListScreen;
