import fse from "fs-extra";
import { ShortestPath } from "../common/definitions";
import { Location } from "../common/definitions";


export async function findShortestPath(start: number, end: number): Promise<ShortestPath> {
    let locations: Location[] = [];
    await fse.readJSON("src/server/map.json").then((data) => {
        locations = data;
    });
    // console.log(locations);
    let visited: boolean[] = new Array(locations.length);
    let dis: number[] = new Array(locations.length);
    dis.fill(Number.MAX_VALUE);
    visited.fill(false);
    visited[start] = true;
    //初始化dis数组，方式是将start点的所有邻接点的距离放入dis数组中
    dis[start] = 0;
    for (let i = 0; i < locations[start].connection.length; i++) {
        let v = locations[start].connection[i];
        dis[v] = calDistance(locations[start], locations[v]);
    }
    let pre: number[] = new Array(locations.length);
    for (let i = 0; i < pre.length; i++) pre[i] = -1;
    for (let i = 0; i < locations[start].connection.length; i++) pre[locations[start].connection[i]] = start;
    pre[start] = start;
    let u: number = -1;
    while (1) {
        // console.log("!");
        // console.log(dis);
        // console.log(visited);
        // console.log(pre);
        let min = Number.MAX_VALUE;
        u = -1;
        //找到还没有确定最短距离的点中与确定的点中距离最短的点
        for (let i = 0; i < dis.length; i++) {
            if (!visited[i] && dis[i] < min) {
                min = dis[i];
                u = i;
            }
        }
        if (u == -1) break;
        visited[u] = true;
        if (u == end) break;
        //更新dis数组
        for (let i = 0; i < locations[u].connection.length; i++) {
            let v = locations[u].connection[i];
            if (!visited[v] && dis[u] + calDistance(locations[u], locations[v]) < dis[v]) {
                dis[v] = dis[u] + calDistance(locations[u], locations[v]);
                pre[v] = u;
            }
        }
    }
    //如果u==-1，说明没有找到从start到end的路径
    if (u == -1) return {
        path: [],
        isAvilable: false,
        distance: 0
    };
    let path: number[] = [];
    while (u != start) {
        path.push(u);
        u = pre[u];
    }
    path.push(start);
    console.log(path);
    path.reverse();
    return {
        path: path,
        isAvilable: true,
        distance: dis[end]
    };

}

function calDistance(node1: Location, node2: Location): number {
    // console.log(node2);
    return Math.sqrt(Math.pow(node1.address[0] - node2.address[0], 2) + Math.pow(node1.address[1] - node2.address[1], 2))
}

/*
export class shortestPath {
    private locations: Location[] = [];
    constructor() {
        fse.readJSON("src/server/ShortestPath.json").then((data) => {
            locations = data;
        });
        
    }
    private calDistance(node1:Location,node2:Location):number{
        return Math.sqrt(Math.pow(node1.address[0]-node2.address[0],2)+Math.pow(node1.address[1]-node2.address[1],2))
    }

        
    // public findShortestPath(start:number,end:number,require:number[]):number[]{

    // }
}
*/