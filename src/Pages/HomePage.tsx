import MapboxGL, {Camera, LineLayer, ShapeSource} from '@rnmapbox/maps';
import {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, useColorScheme, useWindowDimensions, View} from 'react-native';
import GLSDK from '../SDK/APIClient';
import {StopPoint} from '../SDK/Models/GLPoint';
import {StopPointMarker} from '../Views/Markers/StopPointMarker';
import * as turf from '@turf/turf';
import {Surface, FAB, Button} from 'react-native-paper';
import MapSearchBar from '../Views/Controls/MapSearchBar';
import {useKeyboard} from '../lib/useKeyboard';

const HomePage = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const styles = StyleSheet.create({
    map: {
      flex: 1,
    },
  });

  const [markers, setMarkers] = useState<StopPoint[]>([]);
  const keyboard = useKeyboard();
  const dimensions = useWindowDimensions();

  useEffect(() => {
    async function loadMarkers() {
      const res = await GLSDK.Search.SearchAround(51.57483, 0.183265);
      if (res) {
        setMarkers(res);
      }
    }

    loadMarkers();
  }, []);

  return (
    <>
      <MapboxGL.MapView
        styleURL={
          isDarkMode
            ? 'mapbox://styles/tomknighton/cl145juvf002h14rkofjuct4r'
            : 'mapbox://styles/tomknighton/cl145dxdf000914m7r7ykij8s'
        }
        style={styles.map}
        logoEnabled={false}
        scaleBarEnabled={false}
        attributionEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}>
        <>
          <Camera
            defaultSettings={{
              centerCoordinate: [0.183265, 51.57483],
              zoomLevel: 14,
            }}
            centerCoordinate={[0.183265, 51.57483]}
            zoomLevel={14}></Camera>

          <ShapeSource id="search-circle-source" shape={getCircleExp()}>
            <LineLayer
              id="search-circle"
              style={{lineColor: 'blue'}}></LineLayer>
          </ShapeSource>

          {markers.map(marker => (
            <StopPointMarker stopPoint={marker} key={marker.lat} />
          ))}
        </>
      </MapboxGL.MapView>

      <>
        <FAB
          style={{position: 'absolute', right: 8, top: 40, borderRadius: 32}}
          icon="train"
          mode="elevated"
          onPress={() => {}}
          variant="surface"
        />
        <FAB
          style={{position: 'absolute', right: 8, top: 110, borderRadius: 32}}
          icon="filter-variant"
          mode="elevated"
          onPress={() => {}}
          variant="surface"
        />
        <FAB
          style={{position: 'absolute', right: 8, top: 180, borderRadius: 32}}
          icon="crosshairs-gps"
          mode="elevated"
          onPress={() => {}}
          variant="surface"
        />
      </>

      <SafeAreaView>
        <MapSearchBar
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 26,
            left: 16,
            right: 16,
            maxHeight: dimensions.height - (keyboard !== 0 ? keyboard + 40 : 120)
          }}
        />
      </SafeAreaView>
    </>
  );
};

export {HomePage};

function getCircleExp(): GeoJSON.Feature {
  var point = turf.point([0.183265, 51.57483]);
  var buffered = turf.buffer(point, 950, {units: 'meters', steps: 22});

  return buffered;
}
