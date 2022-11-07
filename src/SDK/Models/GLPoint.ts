interface GLPoint {

    lat: number;
    lon: number;

    pointType: PointType
}

enum PointType {
    StopPoint = "Stop",
    POIPoint = "POI"
}

class StopPoint implements GLPoint {
    constructor(public lat: number, public lon: number, public pointType: PointType, public name?: String, public commonName?: String, public stopLetter?: String, public rand?: Boolean) {}
}

class POIPoint implements GLPoint {
    constructor(public lat: number, public lon: number, public pointType: PointType, public text?: String, public place_name?: String) {}
}

export { StopPoint, POIPoint, PointType };
export type { GLPoint };
