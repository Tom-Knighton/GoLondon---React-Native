import {Image, View} from 'react-native';
import {StopPoint} from '../../SDK/Models/GLPoint';
import {Stack, HStack, VStack} from 'react-native-flex-layout';
import {MarkerView, PointAnnotation} from '@rnmapbox/maps';
import {Text} from 'react-native-paper';
import { LineMode } from '../../SDK/Models/Imported';
interface StopPointMarkerProps {
  stopPoint: StopPoint;
}

const StopPointMarker = ({stopPoint}: StopPointMarkerProps) => {
  function isBusOnly(): Boolean {
    return stopPoint.lineModeGroups?.length == 1 && stopPoint.lineModeGroups[0].modeName == LineMode.Bus
  }

  function isBusStand(): Boolean {
    return stopPoint.lineModeGroups?.length == 0 && stopPoint.indicator?.startsWith("Stand") == true;
  }

  function isBus(): Boolean {
    return isBusOnly() || isBusStand();
  }

  return (
    <>
      <PointAnnotation
        id={Math.random.toString()}
        allowOverlap={true}
        coordinate={[stopPoint.lon, stopPoint.lat]}
        anchor={{x: 0.45, y: 1.5}}>
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
              backgroundColor: `${isBus() ? '#EE2E24' : 'white'}`,
              padding: isBus() ? 0 : 2.5,
            }}>
            {isBus() && (
              <Text
                style={{
                  width: 30,
                  height: 30,
                  textAlign: 'center',
                  lineHeight: 30,
                  fontWeight: 'bold',
                }}>
                {stopPoint.stopLetter}
              </Text>
            )}
            {!isBus() && (
              <Image
                source={require('../../assets/img/tfl.png')}
                style={{
                  width: 25,
                  height: 25,
                }}></Image>
            )}
          </View>
        </View>
      </PointAnnotation>
      <PointAnnotation
        id={Math.random.toString()}
        allowOverlap={true}
        coordinate={[stopPoint.lon, stopPoint.lat]}
        anchor={{x: -1.5, y: 1}}>
        <View
          style={{
            width: 25,
            height: 30,
          }}>
          <View style={{width: 1, height: 30, backgroundColor: 'white'}}></View>
        </View>
      </PointAnnotation>
    </>
  );
};

export {StopPointMarker};
export type {StopPointMarkerProps};
