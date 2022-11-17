import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {FlatList, TapGestureHandler} from 'react-native-gesture-handler';
import {Surface, Text, useTheme, Button} from 'react-native-paper';
import {LineModeFriendlyName, LineModeImage} from '../../Extensions/Line_etc';
import {cache} from '../../lib/GLCache';
import MapLineModeFilter from '../../Models/MapLineModeFilter';
import {LineMode} from '../../SDK/Models/Imported';

interface MapSearchFilterProps {
  onNewFilters: (filters: MapLineModeFilter[]) => void;
}
const MapSearchFilterView = ({onNewFilters}: MapSearchFilterProps) => {
  const theme = useTheme();
  const [filters, setFilters] = useState<MapLineModeFilter[]>([]);

  useEffect(() => {
    async function load() {
      setFilters(await createDefaultFilters());
    }
    load();
  }, []);

  async function save() {
    onNewFilters(filters);
  }

  function updateFilter(mode: LineMode, enabled: boolean) {
    const newFilters = filters.slice();
    const index = newFilters.findIndex(f => f.lineMode == mode);
    newFilters[index].enabled = enabled;
    setFilters(newFilters);
  }

  const renderItem = ({item}: {item: MapLineModeFilter}) => {
    return (
      <Surface
        style={{
          ...styles.filter,
          backgroundColor: item.enabled
            ? 'rgb(0,122,255)'
            : theme.colors.elevation.level3,
        }}
        key={item.lineMode}>
        <Pressable
          style={{alignItems: 'center'}}
          onPress={() => updateFilter(item.lineMode, !item.enabled)}>
          <Text style={styles.filterTitle} variant="titleSmall">
            {LineModeFriendlyName(item.lineMode)}
          </Text>
          <View style={{flex: 1}}></View>
          <LineModeImage
            mode={item.lineMode}
            width={50}
            height={isNRSymbol(item.lineMode) ? 25 : 30}
          />
          <View style={{height: 30}}></View>
        </Pressable>
      </Surface>
    );
  };

  return (
    <Surface style={styles.sheet}>
      <Text style={styles.title} variant="titleLarge">
        Filters:
      </Text>
      <Text>
        Enable/disable certain types of stops when searching on the map
      </Text>
      <FlatList
        contentContainerStyle={styles.grid}
        numColumns={3}
        data={filters}
        renderItem={renderItem}
      />
      <View style={styles.saveContainer}>
        <Button
          mode="contained"
          style={styles.saveButton}
          onPress={async () => {
            await save();
          }}>
          <Text>Save</Text>
        </Button>
      </View>
    </Surface>
  );
};

function isNRSymbol(mode: LineMode): boolean {
  const nr = [LineMode.NationalRail, LineMode.InternationalRail, LineMode.Dlr];
  return nr.includes(mode);
}

async function createDefaultFilters(): Promise<MapLineModeFilter[]> {
  const modes: LineMode[] = [
    LineMode.Bus,
    LineMode.ElizabethLine,
    LineMode.Tube,
    LineMode.Overground,
    LineMode.NationalRail,
    LineMode.Dlr,
  ];
  const cached = await cache.peek('savedMapFilters');
  if (cached && (JSON.parse(cached) as MapLineModeFilter[])) {
    return JSON.parse(cached);
  }

  const filters: MapLineModeFilter[] = modes.map<MapLineModeFilter>(m => ({
    lineMode: m,
    enabled: true,
  }));
  return filters;
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    paddingStart: 16,
    paddingEnd: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  grid: {
    marginTop: 25,
  },
  filter: {
    height: 150,
    padding: 10,
    flex: 1,
    margin: 6,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
  },
  filterTitle: {
    textAlign: 'center',
  },
  saveContainer: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: 'rgb(0,122,255)',
    borderRadius: 10,
    paddingVertical: 5,
  },
});

export {MapSearchFilterView};
