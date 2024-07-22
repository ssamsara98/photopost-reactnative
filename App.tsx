/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import { Navigator } from './src/navigations/Navigator';

import { NativeBaseProvider } from 'native-base';

import { store } from './src/redux/store';

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <Navigator />
      </NativeBaseProvider>
    </Provider>
  );
}

export default App;
