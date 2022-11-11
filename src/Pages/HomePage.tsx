import MapboxGL, {
  Camera,
  LineLayer,
  MapView,
  ShapeSource,
} from '@rnmapbox/maps';
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

  const [markers, setMarkers] = useState<StopPoint[]>([]);
  const [location, setLocation] = useState<MapboxGL.Location>();
  const [hasSetLoc, setHasSetLoc] = useState<Boolean>(false);
  const [lastSearchedLocation, setLastSearchedLocation] = useState<number[]>(
    [],
  );
  const keyboard = useKeyboard();
  const dimensions = useWindowDimensions();

  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const carouselRef = useRef<Carousel<StopPoint>>(null);
  const mapCameraRef = useRef<Camera>(null);

  useEffect(() => {
    MapboxGL.requestAndroidLocationPermissions();
    MapboxGL.locationManager.start();

    return (): void => {
      MapboxGL.locationManager.stop();
    };
  }, []);

  useEffect(() => {
    if (selectedDetailId) {
      const marker = markers.filter(m => m.id === selectedDetailId)[0];
      if (!!marker) {
        carouselRef.current?.snapToItem(markers.indexOf(marker), true);
        mapCameraRef.current?.flyTo([marker.lon, marker.lat], 500);
      }
    }
  }, [selectedDetailId]);

  useEffect(() => {
    if (!hasSetLoc && location) {
      mapCameraRef.current?.flyTo(
        [location.coords.longitude, location.coords.latitude],
        0,
      );
      setHasSetLoc(true);

      async function loadMarkers(lat: number, lon: number) {
        const res = await GLSDK.Search.SearchAround(lat, lon);
        if (res) {
          setLastSearchedLocation([lat, lon]);
          setMarkers(res);
          setSelectedDetailId(null);
        }
      }

      loadMarkers(location.coords.latitude, location.coords.longitude);
    }
  }, [location]);

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

  function getCircleExp(): GeoJSON.Feature {
    var point = turf.point([lastSearchedLocation[1], lastSearchedLocation[0]]);
    var buffered = turf.buffer(point, 950, {units: 'meters', steps: 30});

    return buffered;
  }

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
          <Camera ref={mapCameraRef} zoomLevel={14} />

          {lastSearchedLocation.length > 0 && (
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
          )}

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

          <MapboxGL.UserLocation
            visible={true}
            renderMode={'native'}
            showsUserHeadingIndicator
            onUpdate={setLocation}
          />
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
            ref={carouselRef}
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
