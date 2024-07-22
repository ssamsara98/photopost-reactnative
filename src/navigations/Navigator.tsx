// /* eslint-disable react/no-unstable-nested-components */
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import { Heading, Spinner, VStack } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';

import { BlankNavigationHeader } from '@/components/BlankNavigationHeader';
import { authSlice } from '@/redux/auth/auth.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import { AuthNavigation, AuthStackParamList } from './AuthNavigator';
import { HomeNavigation } from './HomeNavigator';

// import {MyTabBar} from '@/components/MyTabBar';

// RootStack
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Home: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = () => {
  const { isLogin } = useAppSelector((state) => state.auth);
  return (
    <RootStack.Navigator
      initialRouteName={isLogin ? 'Home' : 'Auth'}
      screenOptions={{ header: BlankNavigationHeader }}
    >
      {isLogin ? (
        <RootStack.Screen name="Home" component={HomeNavigation} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigation} />
      )}
    </RootStack.Navigator>
  );
};

export const Navigator = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const { getItem } = useAsyncStorage('auth');

  const readItemFromStorage = useCallback(async () => {
    const item = await getItem();
    return item !== null ? JSON.parse(item) : null;
  }, [getItem]);

  useEffect(() => {
    async function login() {
      const auth = await readItemFromStorage();
      if (auth) {
        dispatch(authSlice.actions.login(auth));
      }
      setIsLoading(() => false);
    }
    login();
    return () => {};
  }, [dispatch, readItemFromStorage]);

  if (isLoading) {
    return (
      <VStack space={'8'} justifyContent="center" alignItems="center" h={'full'}>
        <Spinner size="lg" />
        <Heading color="primary.500">Loading</Heading>
      </VStack>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigation />
    </NavigationContainer>
  );
};
