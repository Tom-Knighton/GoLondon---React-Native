import MapboxGL, {Camera, LineLayer, ShapeSource} from '@rnmapbox/maps';
import {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import GLSDK from '../SDK/APIClient';
import {StopPoint} from '../SDK/Models/GLPoint';
import {StopPointMarker} from '../Views/Markers/StopPointMarker';
import * as turf from '@turf/turf';
import {Surface, FAB} from 'react-native-paper';
import MapSearchBar from '../Views/Controls/MapSearchBar';
import {useKeyboard} from '../lib/useKeyboard';
import Carousel from 'react-native-snap-carousel';
import {LineModeImage} from '../SDK/Extensions/Line_etc';
import {LineMode} from '../SDK/Models/Imported';
import {VStack, HStack} from 'react-native-flex-layout';

const HomePage = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const styles = StyleSheet.create({
    map: {
      flex: 1,
    },
  });

  // const ref = useRef<Carousel>(null);
  const [markers, setMarkers] = useState<StopPoint[]>([]);
  const keyboard = useKeyboard();
  const dimensions = useWindowDimensions();

  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const ref = useRef<Carousel<StopPoint>>(null);

  useEffect(() => {
    async function loadMarkers() {
      const res = await GLSDK.Search.SearchAround(51.57483, 0.183265);
      if (res) {
        setMarkers(res);
        setSelectedDetailId(null);
      }
    }

    loadMarkers();
  }, []);

  useEffect(() => {
    if (selectedDetailId) {
      const marker = markers.filter(m => m.id === selectedDetailId)[0];
      if (!!marker) {
        ref.current?.snapToItem(markers.indexOf(marker), true);
      }
    }
  }, [selectedDetailId]);

  const carouselItem = ({index}: {index: number}) => {
    const item = markers[index];
    if (item instanceof StopPoint) {
      const stop = item as StopPoint;
      return (
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Surface
            style={{
              padding: 12,
              borderRadius: 10,
              minHeight: 30,
            }}>
            <VStack style={{display: 'flex', alignItems: 'center'}}>
              <Text style={{marginBottom: 2}}>
                {stop.name ?? stop.commonName ?? ':('}
              </Text>
              {item.lineModeGroups?.map(mode => (
                <LineModeImage
                  mode={mode.modeName ?? LineMode.Unk}
                  width={25}
                  height={25}
                  key={mode.modeName}
                  style={{marginTop: 2}}
                />
              ))}

              <HStack>
                {item.lineModeGroups?.map(mode => (
                  <View
                    key={mode.modeName}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      marginTop: 4,
                    }}>
                    {mode.modeName == LineMode.Bus && (
                      <>
                        {mode.lineIdentifier?.map(id => (
                          <Surface
                            key={id}
                            style={{
                              backgroundColor: 'red',
                              padding: 2,
                              margin: 2,
                              minWidth: 30,
                              borderRadius: 5,
                            }}
                            elevation={3}>
                            <Text style={{textAlign: 'center'}}>{id}</Text>
                          </Surface>
                        ))}
                      </>
                    )}
                  </View>
                ))}
              </HStack>
            </VStack>
          </Surface>
        </View>
      );
    }
  };

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
        rotateEnabled={false}
        onPress={() => {
          setSelectedDetailId(null);
        }}>
        <>
          <Camera
            defaultSettings={{
              centerCoordinate: [0.183265, 51.57483],
              zoomLevel: 14,
            }}
            centerCoordinate={[0.183265, 51.57483]}
            zoomLevel={14}></Camera>

          <ShapeSource
            id="search-circle-source"
            shape={getCircleExp()}
            onPress={() => {
              console.log('2');
            }}>
            <LineLayer
              id="search-circle"
              style={{lineColor: 'blue'}}></LineLayer>
          </ShapeSource>

          {markers.map(marker => (
            <StopPointMarker
              stopPoint={marker}
              key={marker.lat}
              selectedId={selectedDetailId}
              updateSelected={(newId?: string | null) => {
                if (newId) {
                  setSelectedDetailId(newId);
                }
              }}
            />
          ))}
        </>
      </MapboxGL.MapView>

      {/** FAB Buttons */}
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

      {/** Carousel */}
      <>
        {selectedDetailId && (
          <Carousel
            ref={ref}
            containerCustomStyle={{
              position: 'absolute',
              bottom: 110 + 20,
              flex: 1,
            }}
            data={markers}
            renderItem={carouselItem}
            itemWidth={dimensions.width - 90}
            sliderWidth={dimensions.width}
            vertical={false}
            enableSnap={true}
            activeSlideAlignment="center"
            inactiveSlideShift={5}
            inactiveSlideScale={0.9}
            onSnapToItem={(index: number) => {
              setSelectedDetailId(markers[index].id ?? null);
            }}
            // @ts-ignore
            disableIntervalMomentum={true}
          />
        )}
      </>

      {/**Search Bar */}
      <SafeAreaView>
        <MapSearchBar
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 26,
            left: 16,
            right: 16,
            maxHeight:
              dimensions.height - (keyboard !== 0 ? keyboard + 40 : 120),
          }}
        />
      </SafeAreaView>
    </>
  );
};

export {HomePage};

function getCircleExp(): GeoJSON.Feature {
  var point = turf.point([0.183265, 51.57483]);
  var buffered = turf.buffer(point, 950, {units: 'meters', steps: 30});

  return buffered;
}
