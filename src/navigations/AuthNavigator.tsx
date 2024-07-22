import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { BlankNavigationHeader } from '@/components/BlankNavigationHeader';
import { LoginScreen } from '@/screens/LoginScreen';
import { RegisterScreen } from '@/screens/RegisterScreens';

import { RootStackParamList, RootStackScreenProps } from './Navigator';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigation = () => {
  return (
    <AuthStack.Navigator initialRouteName="Login" screenOptions={{ header: BlankNavigationHeader }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};
