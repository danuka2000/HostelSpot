import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';

export const LoadingSpinner = ({ message = 'Loading HostelSpot residences...' }) => (
  <View className="py-12 px-6 items-center justify-center flex-1 bg-cream-50">
    <View className="w-12 h-12 rounded-full bg-sage-100 items-center justify-center mb-3 border border-sage-200">
      <ActivityIndicator size="small" color="#122C23" />
    </View>
    <Text className="text-sm font-semibold text-charcoal-700 text-center">{message}</Text>
  </View>
);

export const EmptyState = ({ title = 'No Residences Found', message = 'There are no active records to display at this time.', actionTitle, onAction }) => (
  <View className="py-12 px-6 items-center justify-center bg-white rounded-2xl border border-cream-200 my-4 shadow-sm">
    <View className="w-14 h-14 rounded-full bg-cream-100 items-center justify-center mb-3">
      <Text className="text-2xl">🏡</Text>
    </View>
    <Text className="text-base font-bold text-forest-900 mb-1 text-center">{title}</Text>
    <Text className="text-xs text-charcoal-500 text-center max-w-[260px] leading-5 mb-4">{message}</Text>
    {actionTitle && onAction ? (
      <TouchableOpacity
        onPress={onAction}
        className="bg-forest-900 px-5 py-2.5 rounded-xl active:opacity-90"
      >
        <Text className="text-xs font-bold text-cream-50 uppercase tracking-wider">{actionTitle}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

export const ErrorState = ({ message = 'Unable to connect to HostelSpot network.', onRetry }) => (
  <View className="py-12 px-6 items-center justify-center bg-rose-50/60 rounded-2xl border border-rose-200/60 my-4">
    <Text className="text-2xl mb-2">⚠️</Text>
    <Text className="text-base font-bold text-rose-900 mb-1">Network Notice</Text>
    <Text className="text-xs text-rose-700 text-center max-w-[260px] leading-5 mb-4">{message}</Text>
    {onRetry ? (
      <TouchableOpacity
        onPress={onRetry}
        className="bg-rose-800 px-5 py-2.5 rounded-xl active:opacity-90"
      >
        <Text className="text-xs font-bold text-white uppercase tracking-wider">Try Again</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);
