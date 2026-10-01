import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImagePlus, Hash, Users, FileText } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { roomService } from '../../services/roomService';
import { useToast } from '../../context/ToastContext';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';

export const AddEditRoomScreen = ({ route, navigation }) => {
  const { showToast } = useToast();
  const isEditing = route.params?.room ? true : false;
  const existingRoom = route.params?.room || {};

  const [roomNumber, setRoomNumber] = useState(existingRoom.roomNumber || '');
  const [roomType, setRoomType] = useState(existingRoom.roomType || 'Single');
  const [pricePerMonth, setPricePerMonth] = useState(existingRoom.pricePerMonth ? String(existingRoom.pricePerMonth) : '');
  const [capacity, setCapacity] = useState(existingRoom.capacity ? String(existingRoom.capacity) : '1');
  const [description, setDescription] = useState(existingRoom.description || '');
  const [imageUri, setImageUri] = useState(existingRoom.image || null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const roomTypes = ['Single', 'Double', 'Triple'];

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const previewUrl = URL.createObjectURL(file);
          setImageUri(previewUrl);
          setSelectedFile({ file, uri: previewUrl });
        }
      };
      input.click();
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Permission to access photo gallery is required to upload room images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setSelectedFile(asset);
    }
  };

  const validateForm = () => {
    let valid = true;
    let err = {};

    if (!roomNumber.trim()) {
      err.roomNumber = 'Room number is required';
      valid = false;
    }

    if (!pricePerMonth || isNaN(pricePerMonth) || Number(pricePerMonth) < 0) {
      err.pricePerMonth = 'Valid positive price per month is required';
      valid = false;
    }

    if (!capacity || isNaN(capacity) || Number(capacity) < 1) {
      err.capacity = 'Capacity must be an integer at least 1';
      valid = false;
    }

    setErrors(err);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('roomNumber', roomNumber.trim());
      formData.append('roomType', roomType);
      formData.append('pricePerMonth', pricePerMonth);
      formData.append('capacity', capacity);
      formData.append('description', description.trim());

      if (selectedFile) {
        if (selectedFile.file) {
          formData.append('image', selectedFile.file);
        } else if (Platform.OS === 'web' && selectedFile.uri) {
          const response = await fetch(selectedFile.uri);
          const blob = await response.blob();
          const fileExt = selectedFile.uri.split('.').pop() || 'jpg';
          formData.append('image', blob, `room_${Date.now()}.${fileExt}`);
        } else {
          const fileExt = selectedFile.uri.split('.').pop();
          formData.append('image', {
            uri: selectedFile.uri,
            name: `room_${Date.now()}.${fileExt}`,
            type: selectedFile.mimeType || `image/${fileExt}`
          });
        }
      } else if (imageUri && imageUri.startsWith('http')) {
        formData.append('image', imageUri);
      }

      let res;
      if (isEditing) {
        res = await roomService.updateRoom(existingRoom._id, formData);
      } else {
        res = await roomService.createRoom(formData);
      }

      if (res.success) {
        showToast(`Residence entry ${isEditing ? 'updated' : 'created'} successfully!`, 'success');
        navigation.goBack();
      }
    } catch (err) {
      showToast(err.message || 'Error processing room operation', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <Text className="text-xs font-bold text-clay-600 uppercase tracking-widest">CONTENT MANAGEMENT</Text>
        <Text className="text-2xl font-extrabold text-forest-900 mb-4">
          {isEditing ? 'Edit Residence Entry' : 'Create Residence Entry'}
        </Text>

        <View className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm">
          {/* Large Image Upload Drop Zone */}
          <Text className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
            Residence Cover Photo
          </Text>
          <TouchableOpacity
            className="h-48 rounded-2xl bg-sand-100 border-2 border-dashed border-cream-300 overflow-hidden mb-5 justify-center items-center"
            onPress={pickImage}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="items-center px-4">
                <ImagePlus color="#122C23" size={28} className="mb-2" />
                <Text className="text-xs font-bold text-forest-900 mt-1">+ Select Residence Photo</Text>
                <Text className="text-[11px] text-charcoal-500 mt-0.5 text-center">
                  Supports JPG, PNG & WebP (Max 5MB)
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <AppInput
            label="Room Number"
            placeholder="E.g. Room 101, A-204"
            value={roomNumber}
            onChangeText={setRoomNumber}
            error={errors.roomNumber}
            leftIcon={<Hash color="#6D777C" size={18} />}
          />

          <Text className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
            Room Type Classification
          </Text>
          <View className="flex-row gap-2 mb-4">
            {roomTypes.map((type) => (
              <TouchableOpacity
                key={type}
                className={`flex-1 h-11 rounded-xl border items-center justify-center ${
                  roomType === type ? 'bg-forest-900 border-forest-900' : 'bg-sand-100 border-cream-200'
                }`}
                onPress={() => setRoomType(type)}
              >
                <Text className={`text-xs font-bold ${roomType === type ? 'text-cream-50' : 'text-charcoal-700'}`}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <AppInput
            label="Monthly Rent (Rs.)"
            placeholder="25000"
            value={pricePerMonth}
            onChangeText={setPricePerMonth}
            keyboardType="numeric"
            error={errors.pricePerMonth}
            leftIcon={<Text className="text-xs font-bold text-charcoal-500">Rs.</Text>}
          />

          <AppInput
            label="Max Room Capacity (Persons)"
            placeholder="1"
            value={capacity}
            onChangeText={setCapacity}
            keyboardType="number-pad"
            error={errors.capacity}
            leftIcon={<Users color="#6D777C" size={18} />}
          />

          <AppInput
            label="Residence Description & Amenities"
            placeholder="Spacious boutique room with attached washroom, study desk, and high-speed Wi-Fi."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            leftIcon={<FileText color="#6D777C" size={18} />}
          />

          <AppButton
            title={isEditing ? 'Save Changes' : 'Create Residence Entry'}
            variant="accent"
            onPress={handleSubmit}
            loading={loading}
            className="mt-4"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddEditRoomScreen;
