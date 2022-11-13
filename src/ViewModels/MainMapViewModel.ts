import MapboxGL from '@rnmapbox/maps';
import GLSDK from '../SDK/APIClient';
import {StopPoint} from '../SDK/Models/GLPoint';
import * as turf from '@turf/turf';
import {Position} from '@turf/turf';
import {makeAutoObservable} from 'mobx';

export default class MainMapViewModel {
  isLoading: boolean = false;
  stopPoints: StopPoint[] = [];
  userLocation?: Position = [];
  mapHasInit: boolean = false;
  lastSearchedCoords?: Position = [];
  selectedStopId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async Search(lat: number, lon: number) {
    this.setIsLoading(true);

    const res = await GLSDK.Search.SearchAround(lat, lon);
    if (res) {
      this.setLastSearched([lat, lon]);
      this.setStopPoints(res.filter(r => (r.lineModeGroups?.length ?? 0) > 0));
      this.setSelectedStop(null);
    }
    this.setIsLoading(false);
  }

  getCircleExp(): GeoJSON.Feature {
    const lastSearchedCoords =
      this.lastSearchedCoords && this.lastSearchedCoords.length > 0
        ? this.lastSearchedCoords
        : [0, 0];
    var point = turf.point([lastSearchedCoords[1], lastSearchedCoords[0]]);
    var buffered = turf.buffer(point, 950, {units: 'meters', steps: 30});
    return buffered;
  }

  setHasInit() {
    this.mapHasInit = true;
  }

  setSelectedStop(id: string | null) {
    this.selectedStopId = id;
  }

  setuserLocation(location: MapboxGL.Location) {
    this.userLocation = [location.coords.latitude, location.coords.longitude];
  }

  setStopPoints(points: StopPoint[]) {
    this.stopPoints = points;
  }

  setLastSearched(position: Position) {
    this.lastSearchedCoords = position;
  }

  private setIsLoading(val: boolean) {
    this.isLoading = val;
  }
}
