// /* eslint-disable react/no-unstable-nested-components */
import React, {useCallback, useEffect} from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {NavigationContainer, NavigatorScreenParams} from '@react-navigation/native';
import {BlankNavigationHeader} from '../components/BlankNavigationHeader';
import {AuthNavigation, AuthStackParamList} from './AuthNavigator';
import {HomeNavigation} from './HomeNavigator';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {authSlice} from '../redux/auth/auth.slice';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
// import {MyTabBar} from '../components/MyTabBar';

// RootStack
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Home: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = () => {
  const {isLogin} = useAppSelector((state) => state.auth);
  return (
    <RootStack.Navigator
      initialRouteName={isLogin ? 'Home' : 'Auth'}
      screenOptions={{header: BlankNavigationHeader}}>
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

  const {getItem} = useAsyncStorage('auth');

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
    }
    login();
    return () => {};
  }, [dispatch, readItemFromStorage]);

  return (
    <NavigationContainer>
      <RootNavigation />
    </NavigationContainer>
  );
};
