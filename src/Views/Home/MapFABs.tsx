import {StyleSheet, View} from 'react-native';
import {VStack} from 'react-native-flex-layout';
import {FAB} from 'react-native-paper';
import MapFab from '../../Models/MapFAB';

interface MapFABsProps {
    onPress: (type: MapFab) => void;
    isSearchLoading: boolean;
}

const MapFABs = ({ onPress, isSearchLoading }: MapFABsProps) => {
  return (
    <VStack style={styles.container} spacing={8} pointerEvents="box-none">
      <FAB
        style={styles.fab}
        icon="train"
        mode="elevated"
        onPress={() => onPress(MapFab.MapMode)}
        variant="surface"
      />
      <FAB
        style={styles.fab}
        icon="filter-variant"
        mode="elevated"
        onPress={() => onPress(MapFab.Filter)}
        variant="surface"
      />
      <FAB
        style={styles.fab}
        icon="crosshairs-gps"
        mode="elevated"
        onPress={() => onPress(MapFab.GoToUser)}
        variant="surface"
      />
      <FAB
      loading={isSearchLoading}
        style={styles.fab}
        icon="map-search"
        mode="elevated"
        onPress={() => onPress(MapFab.SearchHere)}
        variant="surface"
      />
    </VStack>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    bottom: 0,
    right: 10,
    width: 55,
  },
  fab: {
    borderRadius: 32,
  },
});

export default MapFABs;
