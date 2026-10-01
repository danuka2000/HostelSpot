import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Info, ShieldCheck, Check } from 'lucide-react-native';
import { bookingService } from '../../services/bookingService';
import { useToast } from '../../context/ToastContext';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';

export const CreateBookingScreen = ({ route, navigation }) => {
  const { showToast } = useToast();
  const { room } = route.params;

  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(nextMonth);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let valid = true;
    let err = {};

    if (!startDate) {
      err.startDate = 'Start date is required (YYYY-MM-DD)';
      valid = false;
    }

    if (!endDate) {
      err.endDate = 'End date is required (YYYY-MM-DD)';
      valid = false;
    } else if (new Date(endDate) <= new Date(startDate)) {
      err.endDate = 'End date must be after start date';
      valid = false;
    }

    setErrors(err);
    return valid;
  };

  const handleBookingSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        roomId: room._id,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        notes: notes.trim()
      };

      const res = await bookingService.createBooking(payload);
      if (res.success) {
        showToast('HostelSpot reservation request submitted!', 'success');
        navigation.navigate('BookingsTab');
      }
    } catch (error) {
      showToast(error.message || 'Failed to process reservation request', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">

        {/* STEP 1 Header Card */}
        <View className="bg-forest-900 rounded-3xl p-5 mb-5 shadow-sm border border-forest-800">
          <View className="flex-row items-center mb-2">
            <View className="w-6 h-6 rounded-full bg-clay-500 items-center justify-center mr-2">
              <Text className="text-cream-50 text-[10px] font-bold">01</Text>
            </View>
            <Text className="text-xs font-bold text-sage-200 uppercase tracking-widest ml-1">
              SELECTED RESIDENCE SUMMARY
            </Text>
          </View>
          <Text className="text-xl font-extrabold text-cream-50 mt-1">
            Room {room.roomNumber} ({room.roomType})
          </Text>
          <Text className="text-xs font-semibold text-clay-400 mt-1">
            Rs. {room.pricePerMonth?.toLocaleString()} / month
          </Text>
        </View>

        {/* STEP 2 Stay Details Form */}
        <View className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm mb-5">
          <View className="flex-row items-center mb-4 pb-2 border-b border-cream-100">
            <View className="w-6 h-6 rounded-full bg-forest-900 items-center justify-center mr-2">
              <Text className="text-cream-50 text-[10px] font-bold">02</Text>
            </View>
            <Text className="text-sm font-bold text-forest-900 uppercase tracking-wider ml-1">
              Select Stay Dates
            </Text>
          </View>

          <AppInput
            label="Check-in Date (YYYY-MM-DD)"
            placeholder="2026-10-01"
            value={startDate}
            onChangeText={setStartDate}
            error={errors.startDate}
            leftIcon={<Calendar color="#6D777C" size={18} />}
          />

          <AppInput
            label="Check-out Date (YYYY-MM-DD)"
            placeholder="2026-11-01"
            value={endDate}
            onChangeText={setEndDate}
            error={errors.endDate}
            leftIcon={<Calendar color="#6D777C" size={18} />}
          />

          <AppInput
            label="Special Preferences / Notes (Optional)"
            placeholder="E.g. Ground floor request, quiet study area preference..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            leftIcon={<Info color="#6D777C" size={18} />}
          />
        </View>

        {/* STEP 3 Confirmation & Guarantee Panel */}
        <View className="bg-sand-100 rounded-3xl p-5 border border-cream-200 mb-6">
          <View className="flex-row items-center mb-2">
            <ShieldCheck color="#122C23" size={18} className="mr-2" />
            <Text className="text-xs font-bold text-forest-900 uppercase tracking-wider ml-2">
              HostelSpot Reservation Terms
            </Text>
          </View>
          <Text className="text-xs text-charcoal-600 leading-5">
            Your reservation request will be reviewed by property management. Upon approval, your room spot is guaranteed.
          </Text>
        </View>

        <AppButton
          title="Submit Reservation Request"
          variant="accent"
          onPress={handleBookingSubmit}
          loading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateBookingScreen;
