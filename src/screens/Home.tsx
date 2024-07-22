/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Button, Text, View } from 'react-native';

export function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Go to Details" onPress={() => navigation.navigate('DetailsStack')} />
    </View>
  );
}
