import MapboxGL, {
  Camera,
  LineLayer,
  ShapeSource,
} from '@rnmapbox/maps';
import {useEffect, useState} from 'react';
import {StyleSheet, useColorScheme, View} from 'react-native';
import GLSDK from '../SDK/APIClient';
import {StopPoint} from '../SDK/Models/GLPoint';
import {StopPointMarker } from '../Views/Markers/StopPointMarker';
import * as turf from '@turf/turf';

const HomePage = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const styles = StyleSheet.create({
    map: {
      flex: 1,
    },
  });

  const [markers, setMarkers] = useState<StopPoint[]>([]);

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
    </>
  );
};

export {HomePage};

function pointsShape(points: StopPoint[]): GeoJSON.FeatureCollection {
  let feats: GeoJSON.Feature[] = [];

  points.forEach(point => {
    feats.push({
      type: 'Feature',
      properties: {
        icon: `file:///data/user/0/com.golondonrn/cache/${point.id}.jpg`,
      },
      geometry: {
        type: 'Point',
        coordinates: [point.lon, point.lat],
      },
    });
  });

  return {
    type: 'FeatureCollection',
    features: feats,
  };
}

function getCircleExp(): GeoJSON.Feature {
  var point = turf.point([0.183265, 51.57483]);
  var buffered = turf.buffer(point, 950, {units: 'meters', steps: 22});

  return buffered;
}
