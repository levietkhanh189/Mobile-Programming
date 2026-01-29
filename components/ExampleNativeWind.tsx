import React from 'react';
import { View, Text } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';

/**
 * Example component showing how to use NativeWind with React Native Paper
 *
 * NativeWind classes work on standard React Native components (View, Text, etc)
 * React Native Paper components use their own props for styling
 */
export default function ExampleNativeWind() {
  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* NativeWind Styling with standard components */}
      <View className="bg-white rounded-lg shadow-md p-6 mb-4">
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          NativeWind + React Native Paper
        </Text>
        <Text className="text-gray-600 mb-4">
          Kết hợp Tailwind CSS với Material Design
        </Text>
      </View>

      {/* React Native Paper Card with NativeWind wrapper */}
      <View className="mb-4">
        <Card>
          <Card.Title title="React Native Paper Card" subtitle="Styled with Paper props" />
          <Card.Content>
            <Text className="text-gray-700">
              Paper components use their own props, but can be wrapped in Views with NativeWind classes
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* NativeWind flexbox layout */}
      <View className="flex-row justify-between items-center bg-white rounded-lg p-4 mb-4">
        <Text className="text-lg font-semibold text-gray-800">Flexbox Layout</Text>
        <View className="bg-blue-500 px-4 py-2 rounded-full">
          <Text className="text-white font-medium">Badge</Text>
        </View>
      </View>

      {/* React Native Paper Input */}
      <View className="mb-4">
        <TextInput
          label="Email"
          mode="outlined"
          placeholder="example@email.com"
          className="bg-white"
        />
      </View>

      {/* React Native Paper Buttons with NativeWind spacing */}
      <View className="flex-row gap-2">
        <Button mode="contained" className="flex-1">
          Primary
        </Button>
        <Button mode="outlined" className="flex-1">
          Secondary
        </Button>
      </View>

      {/* NativeWind grid-like layout */}
      <View className="flex-row flex-wrap mt-4 gap-2">
        {['iOS', 'Android', 'Web', 'Desktop'].map((platform) => (
          <View
            key={platform}
            className="bg-purple-100 px-4 py-2 rounded-lg"
          >
            <Text className="text-purple-700 font-medium">{platform}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
