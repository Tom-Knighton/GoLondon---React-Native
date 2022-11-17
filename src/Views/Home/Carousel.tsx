import { ForwardedRef, forwardRef, memo, RefObject } from 'react';
import {useWindowDimensions} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {StopPoint} from '../../SDK/Models/GLPoint';
import CarouselItem from './CarouselItem';

interface MapCarouselProps {
  ref: RefObject<FlatList>;
  showCarousel: boolean;
  data: StopPoint[];
  onScrollEnd: (selected: StopPoint|null) => void;
}

const MapCarousel = forwardRef(({showCarousel, data, onScrollEnd}: MapCarouselProps, ref: ForwardedRef<FlatList>) => {
  const dimensions = useWindowDimensions();

  return (
    <FlatList
      ref={ref}
      horizontal
      centerContent
      removeClippedSubviews
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      disableIntervalMomentum={true}
      snapToAlignment="center"
      style={{
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 110 + 20,
        zIndex: showCarousel ? 99 : -99,
      }}
      contentContainerStyle={{
        paddingHorizontal: dimensions.width * 0.1,
      }}
      initialNumToRender={200}
      data={data}
      renderToHardwareTextureAndroid
    //   onMomentumScrollEnd={event => onScrollEnd(event.nativeEvent.contentOffset.x)}
      onMomentumScrollEnd={event => {
        const index = Math.floor(
          Math.floor(event.nativeEvent.contentOffset.x) /
            Math.floor(dimensions.width * 0.8),
        );
        const marker = data[index];

        onScrollEnd(marker);
      }}
      onScrollToIndexFailed={() => {}}
      renderItem={item => <CarouselItem item={item.item} />}
    />
  );
});

export default MapCarousel;
