import {useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import {Searchbar, Surface, List} from 'react-native-paper';
import GLSDK from '../../SDK/APIClient';
import {GLPoint, POIPoint, StopPoint} from '../../SDK/Models/GLPoint';
import {HStack} from 'react-native-flex-layout';
import {LineMode} from '../../SDK/Models/Imported';
import NationalRailSvg from '../../assets/img/svg/NationalRail';
import Roundel from '../../assets/img/svg/Roundel';
import {
  LineColourHex,
  LineModeColourHex,
  LineModeWeighting,
} from '../../SDK/Extensions/Line_etc';

interface MapSearchBarProps {
  style: ViewStyle;
}

const MapSearchBar = ({style}: MapSearchBarProps) => {
  const [results, setResults] = useState<GLPoint[]>([]);
  const [text, setText] = useState<string>('');
  const [isLoading, setLoading] = useState<Boolean>(false);

  useEffect(() => {

    const getData = setTimeout(async() => {
        if (text.length >= 3) {
            setLoading(true);
            const res = await GLSDK.Search.Search(text);
            setResults(res);
            setLoading(false);
        }
    }, 1000);

    if (!text || text.length == 0) {
      setResults([]);
    }

    return () => clearTimeout(getData);
  }, [text]);

  const modeIcon = (mode: LineMode) => {
    switch (mode) {
      case LineMode.NationalRail:
      case LineMode.Dlr:
        return (
          <NationalRailSvg
            width={20}
            height={15}
            stroke={LineModeColourHex(mode)}
          />
        );
      default:
        return (
          <Roundel width={20} height={20} fill={LineModeColourHex(mode)} />
        );
    }
  };

  const tubeIcons = (point: StopPoint) => {
    const tubeGroup = point.lineModeGroups?.filter(
      g => g.modeName == LineMode.Tube,
    )[0];

    if (tubeGroup) {
      return (
        <HStack spacing={4}>
          {tubeGroup.lineIdentifier?.map(tg => (
            <Surface
            elevation={4}
              style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                backgroundColor: `${LineColourHex(tg)}`,
              }}>
            </Surface>
          ))}
        </HStack>
      );
    }
  };

  function sortedLineModes(point: StopPoint): LineMode[] {
    return (
      point.lineModes?.sort((a: LineMode, b: LineMode) => {
        return LineModeWeighting(a) < LineModeWeighting(b) ? 1 : -1;
      }) ?? []
    );
  }

  const poiItem = (point: POIPoint) => {
    return (
      <Surface elevation={2} style={{margin: 5, borderRadius: 15, padding: 15}}>
        <Text style={{fontWeight: 'bold'}}>{point.text}</Text>
        <Text>{point.place_name}</Text>
      </Surface>
    );
  };

  const stopItem = (point: StopPoint) => {
    return (
      <Surface elevation={2} style={{margin: 5, borderRadius: 15, padding: 15}}>
        <Text style={{fontWeight: 'bold'}}>
          {point.name ?? point.commonName ?? point.id ?? ':('}
        </Text>
        <HStack spacing={4}>
          {sortedLineModes(point).map(mode => {
            return (
              <View
                style={{
                  display: 'flex',
                  minWidth: 20,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <>
                  {mode != LineMode.Tube && modeIcon(mode)}
                  {mode == LineMode.Tube && tubeIcons(point)}
                </>
              </View>
            );
          })}
        </HStack>
      </Surface>
    );
  };

  return (
    <SafeAreaView>
      <Surface style={{...style, padding: 16, borderRadius: 20, flex: 1}}>
        {results.length > 0 ? (
          <ScrollView style={{flex: 1}}>
            {results.map(r => (
              <View key={r.lat + r.lon}>
                {r instanceof StopPoint && stopItem(r as StopPoint)}
                {r instanceof POIPoint && poiItem(r as POIPoint)}
              </View>
            ))}
          </ScrollView>
        ) : null}
        <Searchbar
          placeholder="search"
          onChangeText={setText}
          value={text}
          elevation={0}
          style={{borderWidth: 1, borderRadius: 10, marginTop: 4}}
          loading={isLoading}
        />
      </Surface>
    </SafeAreaView>
  );
};

export default MapSearchBar;
