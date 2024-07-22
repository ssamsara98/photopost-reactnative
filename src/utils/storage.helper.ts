import AsyncStorage from '@react-native-async-storage/async-storage';

import { jsonStringify } from './json-stringify';

export const storeData = async (key: string, value: any) => {
  try {
    const valueString = jsonStringify(value);
    await AsyncStorage.setItem(key, valueString);
  } catch (err) {
    // saving error
    console.error(err);
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (err) {
    // error reading value
    console.error(err);
  }
};

export const deleteData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    // error reading value
    console.error(err);
  }
};
