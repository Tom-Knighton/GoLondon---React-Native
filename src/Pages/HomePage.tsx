import MapboxGL, {
  Camera,
  LineLayer,
  MapView,
  ShapeSource,
} from '@rnmapbox/maps';
import {useEffect, useMemo, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {StopPoint} from '../SDK/Models/GLPoint';
import StopPointMarker from '../Views/Markers/StopPointMarker';
import {Portal, useTheme} from 'react-native-paper';
import MapSearchBar from '../Views/Controls/MapSearchBar';
import {useKeyboard} from '../lib/useKeyboard';
import MainMapViewModel from '../ViewModels/MainMapViewModel';
import {observer} from 'mobx-react-lite';
import {MapSearchFilterView} from '../Views/Sheets/MapSearchFilterView';
import BottomSheet from '@gorhom/bottom-sheet';
import MapLineModeFilter from '../Models/MapLineModeFilter';
import {useCallback} from 'react';
import MapCarousel from '../Views/Home/Carousel';
import MapFABs from '../Views/Home/MapFABs';
import MapFab from '../Models/MapFAB';

const HomePage = observer(({viewModel}: {viewModel: MainMapViewModel}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCarousel, setShowCarousel] = useState<boolean>(false);
  const [mapStyle, setMapStyle] = useState<string | null>(null);
  const keyboard = useKeyboard();
  const dimensions = useWindowDimensions();

  const carouselRef = useRef<FlatList>(null);
  const mapCameraRef = useRef<Camera>(null);
  const mapRef = useRef<MapView>(null);
  const filterRef = useRef<BottomSheet>(null);

  const filterSheetSnaps = useMemo(() => ['85%'], []);
  const theme = useTheme();

  const markers = useMemo(() => viewModel.stopPoints, [viewModel.stopPoints]);

  const setSelected = useCallback(
    (id: string | null) => {
      setSelectedId(id);
    },
    [selectedId],
  );

  useEffect(() => {
    MapboxGL.requestAndroidLocationPermissions();
    MapboxGL.locationManager.start();

    setMapStyle(
      isDarkMode
        ? 'mapbox://styles/tomknighton/cl145juvf002h14rkofjuct4r'
        : 'mapbox://styles/tomknighton/cl145dxdf000914m7r7ykij8s',
    );

    return (): void => {
      MapboxGL.locationManager.stop();
    };
  }, []);

  useEffect(() => {
    console.log('changing');
    setMapStyle(
      isDarkMode
        ? 'mapbox://styles/tomknighton/cl145juvf002h14rkofjuct4r'
        : 'mapbox://styles/tomknighton/cl145dxdf000914m7r7ykij8s',
    );
    mapRef.current?.forceUpdate();
  }, [isDarkMode]);

  useEffect(() => {
    if (viewModel.userLocation) {
      if (
        !viewModel.mapHasInit &&
        viewModel.userLocation &&
        viewModel.userLocation?.length > 0
      ) {
        mapCameraRef.current?.flyTo(
          [viewModel.userLocation[1], viewModel.userLocation[0]],
          0,
        );
        viewModel.setHasInit();

        viewModel.Search(viewModel.userLocation[0], viewModel.userLocation[1]);
      }
    }
  }, [viewModel.userLocation]);

  const styles = StyleSheet.create({
    map: {
      flex: 1,
    },
    sheet: {
      backgroundColor: theme.colors.elevation.level1,
    },
    searchbar: {
      flex: 1,
      position: 'absolute',
      bottom: 26,
      left: 16,
      right: 16,
      maxHeight: dimensions.height - (keyboard !== 0 ? keyboard + 40 : 120),
    },
  });

  function flyToUser() {
    if (viewModel.userLocation) {
      mapCameraRef.current?.flyTo(
        [viewModel.userLocation[1], viewModel.userLocation[0]],
        750,
      );
      setTimeout(() => mapCameraRef.current?.zoomTo(13), 800);
    }
  }

  const MapMarkers = useMemo(
    () => (
      <>
        {markers.map(marker => (
          <StopPointMarker
            stopPoint={marker}
            key={marker.id}
            selectedId={selectedId}
            updateSelected={(id: string | null) => {
              setShowCarousel(true);
              setSelected(id);
              if (id) {
                setTimeout(() => {
                  const index = viewModel.stopPoints.findIndex(
                    m => m.id === id,
                  );
                  const marker = viewModel.stopPoints[index];
                  if (index && !!marker) {
                    console.log(index);
                    carouselRef.current?.scrollToIndex({
                      animated: true,
                      index: index,
                      viewOffset: dimensions.width * 0.1,
                    });
                    mapCameraRef.current?.moveTo([marker.lon, marker.lat], 500);
                  }
                }, 500);
              } else {
                setShowCarousel(false);
              }
            }}
          />
        ))}
      </>
    ),
    [selectedId, viewModel.stopPoints],
  );

  const Map = useMemo(
    () => (
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
          setSelected(null);
          setShowCarousel(false);
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

          {MapMarkers}

          <MapboxGL.UserLocation
            visible={true}
            renderMode={'native'}
            showsUserHeadingIndicator
            onUpdate={(l: MapboxGL.Location) => {
              viewModel.setuserLocation(l);
            }}
          />
        </>
      </MapboxGL.MapView>
    ),
    [viewModel.stopPoints, selectedId],
  );

  return (
    <>
      {mapStyle && Map}

      <Portal>
        <BottomSheet
          ref={filterRef}
          index={-1}
          snapPoints={filterSheetSnaps}
          enablePanDownToClose={true}
          enableOverDrag={true}
          backgroundStyle={styles.sheet}>
          <MapSearchFilterView
            onNewFilters={(f: MapLineModeFilter[]) => {
              filterRef.current?.forceClose();
              const oldCoords = viewModel.lastSearchedCoords;
              if (oldCoords) {
                viewModel.setMapFilters(f);
                viewModel.Search(oldCoords[0], oldCoords[1]);
              }
            }}
          />
        </BottomSheet>
      </Portal>

      <MapFABs
        isSearchLoading={viewModel.isLoading}
        onPress={async (event: MapFab) => {
          switch (event) {
            case MapFab.Filter:
              filterRef.current?.expand();
              break;
            case MapFab.MapMode:
              break;
            case MapFab.GoToUser:
              flyToUser();
              break;
            case MapFab.SearchHere:
              const coords = await mapRef.current?.getCenter();
              if (coords) {
                viewModel.Search(coords[1], coords[0]);
              }
              break;
          }
        }}
      />

      <MapCarousel
        ref={carouselRef}
        data={viewModel.stopPoints}
        showCarousel={showCarousel}
        onScrollEnd={(selected: StopPoint | null) => {
          if (selected) {
            mapCameraRef.current?.moveTo([selected.lon, selected.lat], 500);
          }
          setSelected(selected?.id ?? null);
        }}
      />

      <SafeAreaView>
        <MapSearchBar style={styles.searchbar} />
      </SafeAreaView>
    </>
  );
});

export {HomePage};
