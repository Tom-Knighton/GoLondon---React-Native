import {Image, View} from 'react-native';
import {StopPoint} from '../../SDK/Models/GLPoint';
import {Stack, HStack, VStack} from 'react-native-flex-layout';
import MapboxGL, {MapView, MarkerView} from '@rnmapbox/maps';
import {Text} from 'react-native-paper';
import {LineMode} from '../../SDK/Models/Imported';
import {useEffect, useRef, useState} from 'react';
import PointAnnotation from '@rnmapbox/maps/javascript/components/PointAnnotation';
import {LineModeColourHex, LineModeImage} from '../../Extensions/Line_etc';
import { MostWeightedMode } from '../../Extensions/StopPointExtensions';
import { memo } from 'react';
interface StopPointMarkerProps {
  stopPoint: StopPoint;
  selectedId: string | null;
  updateSelected: (newId: string | null) => void;
}

const StopPointMarker = ({
  stopPoint,
  selectedId,
  updateSelected,
}: StopPointMarkerProps) => {

  const [isBus, setIsBus] = useState<boolean>(false);
  const [shouldDisplayStopLetter, setShouldDisplayStopLetter] = useState<boolean>(false);
  const [isNRSymbol, setIsNRSymbol] = useState<boolean>(false);

  useEffect(() => {
    const _isBusOnly = stopPoint.lineModeGroups?.length == 1 && stopPoint.lineModeGroups[0].modeName == LineMode.Bus;
    const _isStand = stopPoint.lineModeGroups?.length == 0 && stopPoint.indicator?.startsWith("Stand") == true;
    const _isBus = _isBusOnly || _isStand;
    setIsBus(_isBus);

    const _shouldDisplayStopLetter = _isBus && (!!stopPoint.stopLetter || stopPoint.stopLetter != undefined);
    setShouldDisplayStopLetter(_shouldDisplayStopLetter);

    const mode = MostWeightedMode(stopPoint);
    const nr = [LineMode.NationalRail, LineMode.InternationalRail, LineMode.Dlr];
    setIsNRSymbol(nr.includes(mode));
  }, [stopPoint]);

  function paddingForSymbol(): number[] {
    const isNr = isNRSymbol;
    if (isBus) {
      return [0, 0, 0, 0];
    }

    if (isNr) {
      return [7, 2.5, 0, 2.5];
    }

    return [2.5, 2.5, 2.5, 2.5];
  }

  const [isSelected, setSelected] = useState<Boolean>(true);

  const circleRef = useRef<PointAnnotation>();
  const lineRef = useRef<PointAnnotation>();

  useEffect(() => {
    console.log('hey')
    if (selectedId === stopPoint.id) {
      setSelected(true);
    } else {
      setSelected(!selectedId);
    }

    setTimeout(() => {
      circleRef?.current?.refresh();
      lineRef?.current?.refresh();
    }, 1);
  }, [selectedId]);


  return (
    <View>
      <MapboxGL.PointAnnotation
        id={stopPoint.id + 'top'}
        coordinate={[stopPoint.lon, stopPoint.lat]}
        anchor={{x: 0.45, y: 1.5}}
        ref={circleRef}
        onSelected={() => {
          updateSelected(stopPoint.id ?? null);
        }}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 30 / 2,
              paddingTop: paddingForSymbol()[0],
              paddingEnd: paddingForSymbol()[1],
              paddingBottom: paddingForSymbol()[2],
              paddingStart: paddingForSymbol()[3],
              backgroundColor: `${
                isBus ? `${isSelected ? '#EE2E24FF' : '#EE2E2422'}` : `#FFFFFF${isSelected ? 'FF' : '11'}`
              }`
            }}>
            {shouldDisplayStopLetter && (
              <Text
                style={{
                  width: 30,
                  height: 30,
                  textAlign: 'center',
                  lineHeight: 30,
                  fontWeight: 'bold',
                  color: `#FFFFFF${isSelected ? 'FF' : '22'}`,
                }}>
                {stopPoint.stopLetter}
              </Text>
            )}
            {!shouldDisplayStopLetter && (
              <LineModeImage
                mode={MostWeightedMode(stopPoint)}
                width={25}
                height={isNRSymbol ? 15 : 25}
                opacity={isSelected ? 1 : 0.1}
              />
            )}
          </View>
        </View>
      </MapboxGL.PointAnnotation>

      <MapboxGL.PointAnnotation
        id={stopPoint.id + 'bottom'}
        allowOverlap={false}
        coordinate={[stopPoint.lon, stopPoint.lat]}
        anchor={{x: -1.5, y: 1}}
        ref={lineRef}>
        <View
          style={{
            width: 25,
            height: 30,
          }}>
          <View
            style={{
              width: 1,
              height: 30,
              backgroundColor: `#FFFFFF${isSelected ? 'FF' : '00'}`,
            }}></View>
        </View>
      </MapboxGL.PointAnnotation>
    </View>
  );
};

StopPointMarker.whyDidYouRender = true;

export default memo(StopPointMarker);
export type {StopPointMarkerProps};
