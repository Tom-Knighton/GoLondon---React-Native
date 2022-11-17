import {memo, useMemo} from 'react';
import {Dimensions, View} from 'react-native';
import {HStack, VStack} from 'react-native-flex-layout';
import {Surface, Text} from 'react-native-paper';
import {LineModeImage, LineModeIsNRSymbol} from '../../Extensions/Line_etc';
import {StopPoint} from '../../SDK/Models/GLPoint';
import {LineMode} from '../../SDK/Models/Imported';

const CarouselItem = ({item}: {item: StopPoint}) => {
  const dimensions = Dimensions.get('window');
  const stop = item as StopPoint;

  return (
    <View
      key={stop.id}
      style={{
        justifyContent: 'flex-end',
        width: dimensions.width * 0.8,
      }}>
      <Surface
        style={{
          marginHorizontal: 5,
          padding: 12,
          borderRadius: 10,
          minHeight: 30,
        }}>
        <VStack style={{display: 'flex', alignItems: 'center'}}>
          <Text style={{marginBottom: 2}}>
            {stop.name ?? stop.commonName ?? ':('}
          </Text>
          <HStack spacing={4} style={{display: 'flex', alignItems: 'center'}}>
            {item.lineModeGroups?.map(mode => (
              <LineModeImage
                mode={mode.modeName ?? LineMode.Unk}
                width={25}
                height={LineModeIsNRSymbol(mode.modeName ?? LineMode.Unk) ? 15 : 25}
                key={mode.modeName}
                style={{marginTop: 2}}
              />
            ))}
          </HStack>
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
};

export default memo(CarouselItem);
