/* eslint-disable react/no-unstable-nested-components */
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Text} from 'native-base';
import React from 'react';
import {authLogout} from '../redux/auth/auth.slice';
import {useAppDispatch} from '../redux/store';
// import {MyTabBar} from '../components/MyTabBar';
// import Main from '../Main';
import {DetailsScreen} from '../screens/Details';
import {HomeScreen} from '../screens/Home';
import {PostsScreen} from '../screens/PostsScreen';
import {UserScreen} from '../screens/UserScreen';
import {RootStackParamList, RootStackScreenProps} from './Navigator';

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
    >
      {/* <HomeTab.Screen name="Post" component={Main} /> */}
      <HomeTab.Screen name="Posts" component={PostsScreen} />
      <HomeTab.Screen
        name="User"
        component={UserScreen}
        options={{
          headerTitleAlign: 'left',
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
