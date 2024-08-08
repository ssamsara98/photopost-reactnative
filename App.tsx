/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { Provider } from 'react-redux';

import 'react-native-gesture-handler';

import { Navigator } from './src/navigations/Navigator';
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
