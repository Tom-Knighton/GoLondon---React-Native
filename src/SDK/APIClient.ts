import { Float } from "react-native/Libraries/Types/CodegenTypes";
import axios from 'axios';
import { GLPoint, PointType, POIPoint, StopPoint } from "./Models/GLPoint";
import { LineMode } from "./Models/Imported";

const _apiClient = axios.create({
    baseURL: 'https://api.golondon.tomk.online/api/',
});


interface ISearch {
    SearchAround(lat: Float, lon: Float, filterBy: LineMode[], radius: number): Promise<StopPoint[]>
    Search(name: String): Promise<GLPoint[]>
}

interface IGLSDK {
    Search: ISearch
}

let GLSDK: IGLSDK = {

    Search: {
        async SearchAround(lat: number, lon: number, filterBy?: LineMode[], radius?: number): Promise<GLPoint[]> {
            let url = `Search/Around/${lat}/${lon}?radius=${radius ?? 850}`;
            filterBy?.forEach((m) => {
                url += `&modesToFilterBy=${m}`;
            });
            console.log(url);
            let resp = await _apiClient.get<GLPoint[]>(url);
            let data: GLPoint[] = [];
            resp.data.forEach(element => {
                if (element.pointType == PointType.StopPoint) {
                    const e = element as StopPoint;
                    data.push(new StopPoint(e.lat, e.lon, e.pointType, e.icsId, e.icsCode, e.zone, e.id, e.naptanId, e.name, e.commonName, e.indicator, e.stopLetter, e.hubNaptanCode, e.modes, e.lineModes, e.quietTimeData, e.lineGroup, e.lineModeGroups, e.additionalProperties, e.children, e.properties, e.childStationIds));
                } else if (element.pointType == PointType.POIPoint) {
                    const e = element as POIPoint;
                    data.push(new POIPoint(e.lat, e.lon, e.pointType, e.text, e.place_name));
                }
            });
            return data;
        },
        async Search(name: String): Promise<GLPoint[]>{
            let resp = await _apiClient.get<GLPoint[]>(`Search/${name}?includePOI=${true}&includeAddresses=${true}`);
            let data: GLPoint[] = [];
            resp.data.forEach(element => {
                if (element.pointType == PointType.StopPoint) {
                    const e = element as StopPoint;
                    data.push(new StopPoint(e.lat, e.lon, e.pointType, e.icsId, e.icsCode, e.zone, e.id, e.naptanId, e.name, e.commonName, e.indicator, e.stopLetter, e.hubNaptanCode, e.modes, e.lineModes, e.quietTimeData, e.lineGroup, e.lineModeGroups, e.additionalProperties, e.children, e.properties, e.childStationIds));
                } else if (element.pointType == PointType.POIPoint) {
                    const e = element as POIPoint;
                    data.push(new POIPoint(e.lat, e.lon, e.pointType, e.text, e.place_name));
                }
            });
            return data;
        }
    }
}


export default GLSDK;