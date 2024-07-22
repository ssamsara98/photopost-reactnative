/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Button, Text, View } from 'react-native';

export function DetailsScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button title="Go to Details... again" onPress={() => navigation.navigate('HomeStack')} />
    </View>
  );
}
