import {Image, View} from 'react-native';
import {StopPoint} from '../../SDK/Models/GLPoint';
import {Stack, HStack, VStack} from 'react-native-flex-layout';
import {MarkerView, PointAnnotation} from '@rnmapbox/maps';
import {Text} from 'react-native-paper';
interface StopPointMarkerProps {
  stopPoint: StopPoint;
}

const StopPointMarker = ({stopPoint}: StopPointMarkerProps) => {
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
              backgroundColor: `${stopPoint.rand ? '#EE2E24' : 'white'}`,
              padding: 2.5
            }}>
            {stopPoint.rand && (
              <Text
                style={{
                  width: 25,
                  height: 25,
                  textAlign: 'center',
                  lineHeight: 25,
                  fontWeight: 'bold',
                }}>
                {stopPoint.stopLetter ?? ':)'}
              </Text>
            )}
            {!stopPoint.rand && (
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
