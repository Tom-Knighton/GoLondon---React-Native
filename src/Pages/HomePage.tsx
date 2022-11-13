import MapboxGL, {
  Camera,
  LineLayer,
  MapView,
  ShapeSource,
} from '@rnmapbox/maps';
import {useEffect, useRef                                                                  } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import {StopPoint} from '../SDK/Models/GLPoint';
import {StopPointMarker} from '../Views/Markers/StopPointMarker';
import {Surface, FAB} from 'react-native-paper';
import MapSearchBar from '../Views/Controls/MapSearchBar';
import {useKeyboard} from '../lib/useKeyboard';
import Carousel from 'react-native-snap-carousel';
import {LineModeImage} from '../SDK/Extensions/Line_etc';
import {LineMode} from '../SDK/Models/Imported';
import {VStack, HStack} from 'react-native-flex-layout';
import MainMapViewModel from '../ViewModels/MainMapViewModel';
import {observer} from 'mobx-react-lite';
import {reaction, autorun} from 'mobx';

const HomePage = observer(({viewModel}: {viewModel: MainMapViewModel}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const styles = StyleSheet.create({
    map: {
      flex: 1,
    },
  });

  const keyboard = useKeyboard();
  const dimensions = useWindowDimensions();

  const carouselRef = useRef<Carousel<StopPoint>>(null);
  const mapCameraRef = useRef<Camera>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    MapboxGL.requestAndroidLocationPermissions();
    MapboxGL.locationManager.start();

    return (): void => {
      MapboxGL.locationManager.stop();
    };
  }, []);

  useEffect(() => {
    if (viewModel.selectedStopId) {
      const marker = viewModel.stopPoints.filter(
        m => m.id === viewModel.selectedStopId,
      )[0];
      if (!!marker) {
        carouselRef.current?.snapToItem(
          viewModel.stopPoints.indexOf(marker),
          true,
        );
        mapCameraRef.current?.flyTo([marker.lon, marker.lat], 500);
      }
    }
  }, [viewModel.selectedStopId]);

  const carouselItem = ({index}: {index: number}) => {
    const item = viewModel.stopPoints[index];
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

  function flyToUser() {
    if (viewModel.userLocation) {
      mapCameraRef.current?.flyTo(
        [
          viewModel.userLocation[1],
          viewModel.userLocation[0]
        ],
        750,
      );
      setTimeout(() => mapCameraRef.current?.zoomTo(13), 800);
    }
  }


  useEffect(() => {
    if (viewModel.userLocation) {
      if (!viewModel.mapHasInit && viewModel.userLocation && viewModel.userLocation?.length > 0) {
        mapCameraRef.current?.flyTo(
          [viewModel.userLocation[1], viewModel.userLocation[0]],
          0,
        );
        viewModel.setHasInit();

        viewModel.Search(viewModel.userLocation[0], viewModel.userLocation[1]);
      }
    }
  }, [viewModel.userLocation])

  return (
    <>
      <MapboxGL.MapView
        ref={mapRef}
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
        preferredFramesPerSecond={120}
        onPress={() => {
          viewModel.setSelectedStop(null);
        }}>
        <>
          <Camera
            ref={mapCameraRef}
            zoomLevel={13}
            defaultSettings={{zoomLevel: 13}}
          />

          {viewModel.lastSearchedCoords && (
            <ShapeSource
              id="search-circle-source"
              shape={viewModel.getCircleExp()}
              onPress={() => {
                console.log('2');
              }}>
              <LineLayer
                id="search-circle"
                style={{lineColor: 'blue'}}></LineLayer>
            </ShapeSource>
          )}

          {viewModel.stopPoints.map(marker => (
            <StopPointMarker
              stopPoint={marker}
              key={marker.lat}
              selectedId={viewModel.selectedStopId}
              updateSelected={(newId?: string | null) => {
                if (newId) {
                  viewModel.setSelectedStop(newId);
                }
              }}
            />
          ))}

          <MapboxGL.UserLocation
            visible={true}
            renderMode={'native'}
            showsUserHeadingIndicator
            onUpdate={(l: MapboxGL.Location) => { viewModel.setuserLocation(l) }}
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

        {viewModel.userLocation && (
          <FAB
            style={{position: 'absolute', right: 8, top: 180, borderRadius: 32}}
            icon="crosshairs-gps"
            mode="elevated"
            onPress={() => flyToUser()}
            variant="surface"
          />
        )}

        <FAB
          style={{position: 'absolute', right: 8, top: 250, borderRadius: 32}}
          icon="map-search"
          mode="elevated"
          onPress={() => {
            //TODO: Search
          }}
          variant="surface"
          loading={viewModel.isLoading}
        />
      </>

      {/** Carousel */}
      <>
        {viewModel.selectedStopId && (
          <Carousel
            ref={carouselRef}
            containerCustomStyle={{
              position: 'absolute',
              bottom: 110 + 20,
              flex: 1,
            }}
            data={viewModel.stopPoints}
            renderItem={carouselItem}
            itemWidth={dimensions.width - 90}
            sliderWidth={dimensions.width}
            vertical={false}
            enableSnap={true}
            activeSlideAlignment="center"
            inactiveSlideShift={5}
            inactiveSlideScale={0.9}
            onSnapToItem={(index: number) => {
              viewModel.setSelectedStop(viewModel.stopPoints[index].id ?? null);
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
});

export {HomePage};
