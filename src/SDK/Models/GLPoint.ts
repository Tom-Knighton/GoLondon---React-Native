import {
  InternalStopPointProperty,
  LineGroup,
  LineMode,
  LineModeGroup,
  StopPointCrowding,
  StopPointProperty,
} from './Imported';

interface GLPoint {
  lat: number;
  lon: number;

  pointType: PointType;
}

enum PointType {
  StopPoint = 'Stop',
  POIPoint = 'POI',
}

class StopPoint implements GLPoint {
  constructor(
    public lat: number,
    public lon: number,
    public pointType: PointType,
    public icsId?: string | null,
    public icsCode?: string | null,
    public zone?: string | null,
    public id?: string | null,
    public naptanId?: string | null,
    public name?: string | null,
    public commonName?: string | null,
    public indicator?: string | null,
    public stopLetter?: string | null,
    public hubNaptanCode?: string | null,
    public modes?: string[] | null,
    public lineModes?: LineMode[] | null,
    public quietTimeData?: StopPointCrowding,
    public lineGroup?: LineGroup[] | null,
    public lineModeGroups?: LineModeGroup[] | null,
    public additionalProperties?: InternalStopPointProperty[] | null,
    public children?: StopPoint[] | null,
    public properties?: StopPointProperty[] | null,
    public childStationIds?: string[] | null,

  ) {}
}

class POIPoint implements GLPoint {
  constructor(
    public lat: number,
    public lon: number,
    public pointType: PointType,
    public text?: String,
    public place_name?: String,
  ) {}
}

export {StopPoint, POIPoint, PointType};
export type {GLPoint};
