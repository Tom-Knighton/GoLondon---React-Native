import {LineMode} from '../SDK/Models/Imported';
import NationalRailSvg from '../assets/img/svg/NationalRail';
import Roundel from '../assets/img/svg/Roundel';
import {StopPoint} from '../SDK/Models/GLPoint';

function LineModeColourHex(mode: LineMode): String {
  return LineColourHex(mode.toString());
}

function LineColourHex(lineIdentifier: String): String {
  switch (lineIdentifier) {
    case 'bakerloo':
      return '#B36305';
    case 'central':
      return '#E32017';
    case 'circle':
      return '#FFD300';
    case 'district':
      return '#00782A';
    case 'hammersmith-city':
      return '#F3A9BB';
    case 'jubilee':
      return '#A0A5A9';
    case 'metropolitan':
      return '#9B0056';
    case 'northern':
      return '#000000';
    case 'piccadilly':
      return '#003688';
    case 'victoria':
      return '#0098D4';
    case 'waterloo-city':
      return '#95CDBA';

    case 'tube':
      return '#0009AB';
    case 'bus':
      return '#EE2E24';
    case 'dlr':
      return '#00A4A7';
    case 'national-rail':
      return 'red';
    case 'overground':
    case 'london-overground':
      return '#EE7C0E';
    case 'tfl-rail':
    case 'elizabeth-line':
    case 'elizabeth':
      return '#6950a1';

    default:
      return '#E21836';
  }
}

function LineModeFriendlyName(mode: LineMode): string {
  switch (mode) {
    case LineMode.Bus:
      return 'Bus';
    case LineMode.Dlr:
      return 'DLR';
    case LineMode.NationalRail:
      return 'National Rail Services';
    case LineMode.Overground:
      return 'Overground';
    case LineMode.ReplacementBus:
      return 'Replacement Bus Service';
    case LineMode.Tube:
      return 'Tube';
    case LineMode.ElizabethLine:
      return 'Elizabeth Line';
    case LineMode.CableCar:
      return 'Cable Car';
    case LineMode.Tram:
      return 'Tram';
    case LineMode.Unk:
      return '';
    default:
      return '';
  }
}

function LineModeWeighting(mode: LineMode): number {
  switch (mode) {
    case LineMode.Bus:
      return 0;
    case LineMode.Dlr:
      return 1;
    case LineMode.NationalRail:
      return 2;
    case LineMode.Overground:
      return 3;
    case LineMode.ReplacementBus:
      return -1;
    case LineMode.Tube:
      return 4;
    case LineMode.ElizabethLine:
      return 5;
    case LineMode.CableCar:
      return 3;
    case LineMode.Tram:
      return 2;
    case LineMode.Unk:
      return -1;
    default:
      return -1;
  }
}

interface LineModeImageProps {
  mode: LineMode;
  [otherOptions: string]: any;
}

function LineModeIsNRSymbol(mode: LineMode) {
  const modes: LineMode[] = [LineMode.NationalRail, LineMode.InternationalRail, LineMode.Dlr];
  return modes.includes(mode);
}

function LineModeImage({mode, ...otherOptions}: LineModeImageProps) {
  if (LineModeIsNRSymbol(mode)) {
    return (
      <NationalRailSvg stroke={LineModeColourHex(mode)} {...otherOptions} />
    );
  } else {
    if (mode == LineMode.Tube) {
      return <Roundel fill={'#EE2E24'} fill2={'blue'} {...otherOptions} />;
    } else {
      return <Roundel fill={LineModeColourHex(mode)} {...otherOptions} />;

    }
  }
}

export {LineModeIsNRSymbol, LineModeFriendlyName, LineColourHex, LineModeColourHex, LineModeWeighting, LineModeImage};
