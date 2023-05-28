import { promises } from "dns";
import { tmpdir } from "os";
import { resolve } from "path";
import { TSP } from "../common/definitions";
import { ShortestPath } from "../common/definitions";
import fse from "fs-extra";
import { Location   } from "../common/definitions";        
import { findShortestPath } from "./ShortestPath";
function calDistance(node1:Location,node2:Location):number{
    // console.log(node2);
    return Math.sqrt(Math.pow(node1.address[0]-node2.address[0],2)+Math.pow(node1.address[1]-node2.address[1],2));//计算两点间距离
}
//模拟退火算法解决TSP问题

const BeginTemperature:number = 48000*20;//初始温度
const EndTemperature:number = 1.2;//终止温度
const DecreaseRate:number = 0.99931;//温度下降率
const SAdance = 777;
//预处理邻接矩阵，得到两点最短距离
function getMartix(nodeSet:Location[]):number[][]{
    let martix:number[][] = [];
    let n:number = nodeSet.length;
    for(let i=0;i<n;i++){
        martix.push([]);
        for(let j=0;j<n;j++) martix[i].push(0);
    }
    for(let i=0;i<n;i++){
        for(let j=0;j<n;j++){
            if(i!=j) martix[i][j]=1e9;
            else martix[i][j]=0;
        }
    }
    for(let i=0;i<nodeSet.length;i++){
        for(let j=0;j<nodeSet[i].connection.length;j++){
            let v:number = nodeSet[i].connection[j];
            //console.log(i,v);
            martix[i][v]=martix[v][i]=Math.min(martix[i][v],calDistance(nodeSet[i],nodeSet[v]));
        }
    }
    for(let k=0;k<n;k++){
       for(let i=0;i<n;i++){
              for(let j=0;j<n;j++){
                martix[i][j]=Math.min(martix[i][j],martix[i][k]+martix[k][j]);
              }
         }
    }
    return martix; 
}
function getAns(nodeSet:Location[],martix:number[][]):number{
    let ans:number = 0;
    for(let i=0;i<nodeSet.length-1;i++){
        ans+=martix[nodeSet[i].id][nodeSet[i+1].id];
    }
    return ans;
}
function SA(nodeSet:Location[],martix: number[][]):number{
    let ans:number = getAns(nodeSet,martix);
    let ansNodeSet:Location[] = nodeSet; 
    let n= nodeSet.length;
    let temperature:number = BeginTemperature;
    for(;temperature>EndTemperature;temperature*=DecreaseRate){
        let i:number = Math.floor(Math.random()*(nodeSet.length-1))+1;
        let j:number = Math.floor(Math.random()*(nodeSet.length-1))+1;
    while(i==n-1||j==n-1||i==j) { i=Math.floor(Math.random()*(nodeSet.length-1))+1;j=Math.floor(Math.random()*(nodeSet.length-1))+1;}
        let temp:Location = nodeSet[i];
        nodeSet[i] = nodeSet[j];
        nodeSet[j] = temp;
        let newAns:number = getAns(nodeSet,martix);
        let delta:number = newAns-ans;
        if(newAns<ans){
            ans=newAns;
            ansNodeSet = nodeSet;
        }
        else{
            let p:number = Math.exp(-delta/temperature);
            if(Math.random()>p){
                temp = nodeSet[i];
                nodeSet[i] = nodeSet[j];
                nodeSet[j] = temp;
            }
        }
    }
    nodeSet = ansNodeSet;
    return ans;
}
export async function findTSP(nodeSet: any) :Promise<TSP>{
    let locations: Location[] = [];
    await fse.readJSON("src/server/map.json").then((data) => {
        locations = data;
    });
    // console.log("!!!!");
    // console.log(locations);
    let martix:number[][] = getMartix(locations);
    let SArun:number = SAdance;
    while(SArun--){
        SA(nodeSet,martix);
    }
    
    for(let i=0;i<nodeSet.length;i++) console.log(nodeSet[i].id);
    console.log(getAns(nodeSet,martix));
    
    let ans:number = getAns(nodeSet,martix);
    let isAvilable:boolean = true;
    let pathTsp:number[] = [];
    

    if (ans > 1e9)  isAvilable = false;
    for(let i=0;i<nodeSet.length-1;i++){
        //将相邻两点间的最短路径加入pathTsp
        let path:ShortestPath = await findShortestPath(nodeSet[i].id,nodeSet[i+1].id);
        if(!path.isAvilable) isAvilable = false;
        else{
            for(let j=0;j<path.path.length;j++){
                if(j==0&&i!=0) continue;
                pathTsp.push(path.path[j]);
            }
        }
    }
    console.log("BEGIN!!!_---------")
    console.log(pathTsp);
    console.log("END!!!_---------")
    return{
        path:pathTsp,
        isAvilable:isAvilable,
        distance:ans
    }

}