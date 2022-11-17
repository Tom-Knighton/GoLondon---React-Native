import MapboxGL from '@rnmapbox/maps';
import GLSDK from '../SDK/APIClient';
import {StopPoint} from '../SDK/Models/GLPoint';
import * as turf from '@turf/turf';
import {Feature, MultiPoint, Position} from '@turf/turf';
import {makeAutoObservable} from 'mobx';
import MapLineModeFilter from '../Models/MapLineModeFilter';
import {cache} from '../lib/GLCache';
import {LineMode} from '../SDK/Models/Imported';

export default class MainMapViewModel {
  isLoading: boolean = false;
  stopPoints: StopPoint[] = [];
  userLocation?: Position = [];
  mapHasInit: boolean = false;
  lastSearchedCoords?: Position = [];
  selectedStopId: string | null = null;
  filters: MapLineModeFilter[] = [];

  constructor() {
    this.loadMapFilters();
    makeAutoObservable(this);
  }

  async Search(lat: number, lon: number) {
    this.setIsLoading(true);

    const enabled = this.filters.filter(m => m.enabled).map(m => m.lineMode);
    const toFilterBy: LineMode[] = enabled;
    const res = await GLSDK.Search.SearchAround(lat, lon, toFilterBy, 850);
    if (res) {
      this.setLastSearched([lat, lon]);
      res.forEach(r => {
        r.lineModeGroups =
          r.lineModeGroups?.filter(m =>
            enabled.includes(m.modeName ?? LineMode.Unk),
          ) ?? [];
      });
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

  getPointsShape(): GeoJSON.FeatureCollection {
    const points: GeoJSON.Feature[] = this.stopPoints.map(
      s =>
        ({
          id: s.id,
          type: 'Feature',
          geometry: {type: 'Point', coordinates: [s.lon, s.lat]},
          properties: { indicator: s.indicator ?? '!' },
        } as GeoJSON.Feature),
    );

    const multi: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: points
    }
    return multi;
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

  async setMapFilters(filters: MapLineModeFilter[]) {
    this.filters = filters;
    await cache.set('savedMapFilters', JSON.stringify(filters));
  }

  private setIsLoading(val: boolean) {
    this.isLoading = val;
  }

  private async loadMapFilters() {
    const filters = await cache.get('savedMapFilters');
    if (filters && (JSON.parse(filters) as MapLineModeFilter[])) {
      this.setMapFilters(JSON.parse(filters));
    }
  }
}
