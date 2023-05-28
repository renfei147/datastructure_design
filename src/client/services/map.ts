import mapData from '../assets/map.json';

export const mapInfo = mapData;

export const displayLocations = mapData.filter(i => !i.name.match('路口') && !i.name.match('无'));