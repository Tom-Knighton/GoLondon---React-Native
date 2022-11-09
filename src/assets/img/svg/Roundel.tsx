import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Roundel = (props: any) => (
  <Svg
    color='black'
    fill="none"
    viewBox="0 0 615.3 500"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path fill={props.fill ?? 'black' } d="M469.5 250c0 89.1-72.3 161.3-161.3 161.3-89.1 0-161.3-72.2-161.3-161.3S219 88.7 308.1 88.7 469.5 160.9 469.5 250M308.1 0C170 0 58.1 111.9 58.1 250s111.9 250 250 250 250-111.9 250-250S446.2 0 308.1 0" />
    <Path fill={props.fill ?? 'black' } d="M0 199.5h615.3v101.1H0z" />
  </Svg>
);
export default Roundel;
