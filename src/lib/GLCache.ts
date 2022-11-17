import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cache} from 'react-native-cache';

const cache = new Cache({
  namespace: 'GLCache',
  policy: {
    maxEntries: 10000,
    stdTTL: 0,
  },
  backend: AsyncStorage,
});

export {cache};
