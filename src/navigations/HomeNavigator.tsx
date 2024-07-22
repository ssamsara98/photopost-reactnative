/* eslint-disable react/no-unstable-nested-components */
import { BottomTabScreenProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon, Text } from 'native-base';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { authLogout } from '@/redux/auth/auth.slice';
import { useAppDispatch } from '@/redux/hooks';
// import {MyTabBar} from '@/components/MyTabBar';
// import Main from '@/Main';
import { DetailsScreen } from '@/screens/Details';
import { HomeScreen } from '@/screens/Home';
import { PostsScreen } from '@/screens/PostsScreen';
import { UploadScreen } from '@/screens/UploadScreen';
import { UserScreen } from '@/screens/UserScreen';

import { RootStackParamList, RootStackScreenProps } from './Navigator';

const Stack = createNativeStackNavigator();

export const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="HomeStack">
      <Stack.Screen name="HomeStack" component={HomeScreen} />
      <Stack.Screen name="DetailsStack" component={DetailsScreen} />
    </Stack.Navigator>
  );
};

export type HomeTabParamList = {
  Posts: undefined;
  User: undefined;
  Upload: undefined;
};

export type AuthStackScreenProps<T extends keyof HomeTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

const HomeTab = createBottomTabNavigator<HomeTabParamList>();

export const HomeNavigation = () => {
  const dispatch = useAppDispatch();

  function handleLogout() {
    dispatch(authLogout());
  }

  return (
    <HomeTab.Navigator
      initialRouteName="Posts"
      // tabBar={props => <MyTabBar {...props} />}
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      {/* <HomeTab.Screen name="Post" component={Main} /> */}
      <HomeTab.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          tabBarIcon({ focused }) {
            return (
              <Icon
                as={AntDesign}
                name="home"
                color={focused ? 'gray.800' : 'gray.400'}
                size={'lg'}
              />
            );
          },
        }}
      />
      <HomeTab.Screen
        name="Upload"
        component={UploadScreen}
        options={{
          tabBarIcon({ focused }) {
            return (
              <Icon
                as={AntDesign}
                name="plussquare"
                color={focused ? 'gray.800' : 'gray.400'}
                size={'lg'}
              />
            );
          },
        }}
      />
      <HomeTab.Screen
        name="User"
        component={UserScreen}
        options={{
          headerTitleAlign: 'left',
          tabBarIcon({ focused }) {
            return (
              <Icon
                as={AntDesign}
                name="user"
                color={focused ? 'gray.800' : 'gray.400'}
                size={'lg'}
              />
            );
          },
          headerRight() {
            return (
              <Text onPress={handleLogout} px={4}>
                Logout
              </Text>
            );
          },
        }}
      />
    </HomeTab.Navigator>
  );
};
