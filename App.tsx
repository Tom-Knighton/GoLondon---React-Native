/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import MapboxGL, {Camera, MarkerView, PointAnnotation} from '@rnmapbox/maps';
import React, {useEffect, useState, type PropsWithChildren} from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {POIPoint, StopPoint} from './src/SDK/Models/GLPoint';
import { HomePage } from './src/Pages/HomePage';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoidG9ta25pZ2h0b24iLCJhIjoiY2p0ZWhyb2s2MTR1NzN5bzdtZm9udmJueSJ9.c4dShyMCfZ6JhsnFRf72Rg',
);

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };


  return (
    <PaperProvider>
      <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor='transparent'
          translucent
        />
        <View style={styles.page}>
          <View style={styles.container}>
            <HomePage/>
          </View>
        </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },

  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    backgroundColor: 'tomato',
    width: '100%',
  },
});

export default App;
