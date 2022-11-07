import { Float } from "react-native/Libraries/Types/CodegenTypes";
import axios from 'axios';
import { GLPoint, PointType, POIPoint, StopPoint } from "./Models/GLPoint";

const _apiClient = axios.create({
    baseURL: 'https://api.golondon.tomk.online/api/',
});


interface ISearch {
    SearchAround(lat: Float, lon: Float): Promise<GLPoint[]>
    Search(name: String): Promise<GLPoint[]>
}

interface IGLSDK {
    Search: ISearch
}

let GLSDK: IGLSDK = {

    Search: {
        async SearchAround(lat: number, lon: number): Promise<GLPoint[]> {
            console.log(`${'https://api.golondon.tomk.online/api/'}Search/Around/${lat}/${lon}`)
            let resp = await _apiClient.get<GLPoint[]>(`Search/Around/${lat}/${lon}?radius=850`);
            let data: GLPoint[] = [];
            resp.data.forEach(element => {
                if (element.pointType == PointType.StopPoint) {
                    const e = element as StopPoint;
                    data.push(new StopPoint(e.lat, e.lon, e.pointType, e.name, e.commonName, e.stopLetter, Math.random() > 0.5));
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
                    data.push(new StopPoint(e.lat, e.lon, e.pointType, e.name, e.commonName, e.stopLetter));
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