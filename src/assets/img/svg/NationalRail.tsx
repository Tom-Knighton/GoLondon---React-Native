import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
const NationalRailSvg = (props: any) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 62 39`} {...props}>
    <G stroke={props.stroke ?? 'red'}>
      <Path d="m1-8.9 45 21.3-30 14.2 45 21.3" strokeWidth={6} />
      <Path d="M0 12.4h62m0 14.2H0" strokeWidth={6.4} />
    </G>
  </Svg>
);
export default NationalRailSvg;
