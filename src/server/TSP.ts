import { promises } from "dns";
import { tmpdir } from "os";
import { ShortestPath } from "../common/definitions";

interface Location {
    id: number;
    name: string;
    address: [number, number];
    connection: number[];
}
function calDistance(node1:Location,node2:Location):number{
    // console.log(node2);
    return Math.sqrt(Math.pow(node1.address[0]-node2.address[0],2)+Math.pow(node1.address[1]-node2.address[1],2));//计算两点间距离
}
//模拟退火算法解决TSP问题
function getAns(nodeSet:Location[]):number{
    let ans:number = 0;
    for(let i=0;i<nodeSet.length-1;i++){
        if(nodeSet[i].connection.indexOf(nodeSet[i+1].id)==-1) return Number.MAX_VALUE;//如果有点没有连接到下一个点，说明没有路径
        ans+=calDistance(nodeSet[i],nodeSet[i+1]);
    }
    return ans;
}
const BeginTemperature:number = 5000;//初始温度
const EndTemperature:number = 1e-10;//终止温度
const DecreaseRate:number = 0.91017;//温度下降率
const SAdance = 77;
function SA(nodeSet:Location[]):number{
    let ans:number = getAns(nodeSet);
    let temperature:number = BeginTemperature;
    for(;temperature>EndTemperature;temperature*=DecreaseRate){
        let i:number = Math.floor(Math.random()*nodeSet.length);
        let j:number = Math.floor(Math.random()*nodeSet.length);
        let temp:Location = nodeSet[i];
        nodeSet[i] = nodeSet[j];
        nodeSet[j] = temp;
        let newAns:number = getAns(nodeSet);
        let delta:number = newAns-ans;
        if(delta<0){
            ans = newAns;
        }else{
            let p:number = Math.exp(-delta/temperature);
            if(Math.random()<p){
                ans = newAns;
            }else{
                temp = nodeSet[i];
                nodeSet[i] = nodeSet[j];
                nodeSet[j] = temp;
            }
        }
        temperature*=DecreaseRate;
    }
    return ans;
}
export async function TSP(nodeSet: Location[]) :Promise<TSP>{
    for(let i=1;i<=SAdance;i++){
        SA(nodeSet);
    }
    let ans:number = getAns(nodeSet);
    let isAvilable:boolean = true;
    let path:number[] = [];

    if (ans > 1e9)  isAvilable = false;
    for(let i=0;i<nodeSet.length;i++){
        path.push(nodeSet[i].id);
    }
    return{
        path:path,
        isAvilable:isAvilable,
        distance:ans
    }

}