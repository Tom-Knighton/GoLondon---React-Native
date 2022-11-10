import {Image, View} from 'react-native';
import {StopPoint} from '../../SDK/Models/GLPoint';
import {Stack, HStack, VStack} from 'react-native-flex-layout';
import MapboxGL, {MarkerView} from '@rnmapbox/maps';
import {Text} from 'react-native-paper';
import {LineMode} from '../../SDK/Models/Imported';
import Roundel from '../../assets/img/svg/Roundel';
import {useEffect, useRef, useState} from 'react';
import PointAnnotation from '@rnmapbox/maps/javascript/components/PointAnnotation';
interface StopPointMarkerProps {
  stopPoint: StopPoint;
  selectedId: string;
}

const StopPointMarker = ({stopPoint, selectedId}: StopPointMarkerProps) => {
  function isBusOnly(): Boolean {
    return (
      stopPoint.lineModeGroups?.length == 1 &&
      stopPoint.lineModeGroups[0].modeName == LineMode.Bus
    );
  }

  function isBusStand(): Boolean {
    return (
      stopPoint.lineModeGroups?.length == 0 &&
      stopPoint.indicator?.startsWith('Stand') == true
    );
  }

  function isBus(): Boolean {
    return isBusOnly() || isBusStand();
  }

  function shouldDisplayStopLetter(): Boolean {
    return isBus() && stopPoint.stopLetter != undefined;
  }

  const [isSelected, setSelected] = useState<Boolean>(false);

  const circleRef = useRef<PointAnnotation>();
  const lineRef = useRef<PointAnnotation>();

  useEffect(() => {
    if (selectedId === stopPoint.id) {
      console.log('I am selected! ' + selectedId + stopPoint.indicator);
      setSelected(true);
    } else {
      setSelected(false);
    }

    setTimeout(() => {
      circleRef?.current?.refresh();
      lineRef?.current?.refresh();
    }, 100);

  }, [selectedId]);

  useEffect(() => {}, [isSelected]);

  return (
    <>
      <MapboxGL.PointAnnotation
        id={Math.random.toString()}
        allowOverlap={true}
        coordinate={[stopPoint.lon, stopPoint.lat]}
        anchor={{x: 0.45, y: 1.5}}
        ref={circleRef}
        selected={isSelected}>
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
              padding: shouldDisplayStopLetter() ? 0 : 2.5,
              backgroundColor: `${
                isBus() ? `#EE2E24${isSelected ? 'FF' : '22'}` : 'white'
              }`,
            }}>
            {shouldDisplayStopLetter() && (
              <Text
                style={{
                  width: 30,
                  height: 30,
                  textAlign: 'center',
                  lineHeight: 30,
                  fontWeight: 'bold',
                  color: `#FFFFFF${isSelected ? 'FF' : '22'}`
                }}>
                {stopPoint.stopLetter}
              </Text>
            )}
            {!shouldDisplayStopLetter() && (
              <Roundel
                width={25}
                height={25}
                fill={isBus() ? 'white' : 'purple'}
                opacity={isSelected ? 1 : 0.3}
              />
            )}
          </View>
        </View>
      </MapboxGL.PointAnnotation>

      <MapboxGL.PointAnnotation
        id={Math.random.toString()}
        allowOverlap={true}
        coordinate={[stopPoint.lon, stopPoint.lat]}
        anchor={{x: -1.5, y: 1}}
        ref={lineRef}
        selected={isSelected}>
        <View
          style={{
            width: 25,
            height: 30,
          }}>
          <View
            style={{
              width: 1,
              height: 30,
              backgroundColor: `#FFFFFF${isSelected ? 'FF' : '55'}`,
            }}></View>
        </View>
      </MapboxGL.PointAnnotation>
    </>
  );
};

export {StopPointMarker};
export type {StopPointMarkerProps};
