// import * as fse from "fs-extra";

// interface Location {
//     id: number;
//     name: string;
//     address: [number, number];
//     connection: number[];
// }

// export interface ShortestPath {
//     path: number[];
//     isAvailable: boolean;
//     distance: number;
// }

// let locations: Location[] = [];
// await fse.readJSON("src/server/map.json").then((data) => {
//     locations = data;
// });

// function calDistance(node1:Location,node2:Location):number{
//     // console.log(node2);
//     return Math.sqrt(Math.pow(node1.address[0]-node2.address[0],2)+Math.pow(node1.address[1]-node2.address[1],2))
// }

// export async function findShortestPath(start: number, end: number, required: number[]): Promise<ShortestPath> {
//     let numAnts = 100;
//     let numIterations = 100;
//     let evaporationRate = 0.1;
//     let q = 1;
//     let pheromoneMatrix: number[][] = Array(locations.length).fill(0).map(() => Array(locations.length).fill(0));
//     let shortestPath: ShortestPath = { path: [], isAvailable: false, distance: Infinity };
    
//     for (let iteration = 0; iteration < numIterations; iteration++) {
//         for (let ant = 0; ant < numAnts; ant++) {
//             let path = [start];
//             let current = start;
//             while (current != end) {
//                 let next = selectNextNode(current, pheromoneMatrix, locations);
//                 if (next == -1) {
//                     break;
//                 }
//                 path.push(next);
//                 current = next;
//             }
//             updatePheromoneMatrix(pheromoneMatrix, path, q, evaporationRate);
//         }
//     }

//     shortestPath = selectShortestPath(numAnts, pheromoneMatrix, locations);
//     return shortestPath;
// }

// function selectNextNode(current: number, pheromoneMatrix: number[][], locations: Location[]): number {
//     let nextNode = -1;
//     let maxProbability = -Infinity;
//     for (let i = 0; i < locations.length; i++) {
//         if (locations[current].connection.includes(locations[i].id)) {
//             let distance = calDistance(locations[current], locations[i]);
//             let probability = pheromoneMatrix[current][i] / distance;
//             if (probability > maxProbability) {
//                 maxProbability = probability;
//                 nextNode = i;
//             }
//         }
//     }
//     return nextNode;
// }

// function updatePheromoneMatrix(pheromoneMatrix: number[][], path: number[], q: number, evaporationRate: number) {
//     for (let i = 0; i < path.length - 1; i++) {
//         let current = path[i];
//         let next = path[i + 1];
//         pheromoneMatrix[current][next] = (1 - evaporationRate) * pheromoneMatrix[current][next] + q / path.length;
//     }
// }

// function selectShortestPath(numAnts: number, pheromoneMatrix: number[][], locations: Location[]): ShortestPath {
//     let shortestPath: ShortestPath = { path: [], isAvailable: false, distance: Infinity };
//  for (let i = 0; i < locations.length; i++) {
//      for (let j = 0; j < locations.length; j++) {
//          if (pheromoneMatrix[i][j] > 0) {
//              let distance = calDistance(locations[i], locations[j]);
//              if (distance < shortestPath.distance) {
//                  shortestPath.path = [locations[i].id, locations[j].id];
//                  shortestPath.isAvailable = true;
//                  shortestPath.distance = distance;
//              }
//          }
//      }
//  }
//  return shortestPath;
//  }

 
 import * as fse from 'fs-extra';

interface Location {
    id: number;
    name: string;
    address: [number, number];
    connection: number[];
}

export interface ShortestPath {
    path: number[];
    isAvailable: boolean;
    distance: number;
}

let locations: Location[] = [];

export async function findShortestPath(start: number, end: number, required: number[]): Promise<ShortestPath> {
    // Initialize pheromone trail
    let pheromone: number[][] = Array(locations.length).fill(0).map(() => Array(locations.length).fill(0));

    let bestPath: number[] = [];
    let bestDistance: number = Infinity;

    // Parameters
    let alpha: number = 1; // Importance of pheromone trail
    let beta: number = 5; // Importance of heuristic information
    let rho: number = 0.5; // Pheromone evaporation rate
    let Q: number = 100; // Pheromone left on the path by each Ant

    // Ant Colony Optimization
    for (let iteration = 0; iteration < 100; iteration++) {
        for (let ant = 0; ant < locations.length; ant++) {
            let path: number[] = [start];
            let current: number = start;
            while (current != end) {
                let next: number = -1;
                let p: number = Math.random();
                let cumulativeProbability: number = 0;
                for (let i = 0; i < locations[current].connection.length; i++) {
                    let candidate: number = locations[current].connection[i];
                    if (!path.includes(candidate)) {
                        let probability = Math.pow(pheromone[current][candidate], alpha) * Math.pow(1.0 / calDistance(locations[current], locations[candidate]), beta);
                        cumulativeProbability += probability;
                        if (p < cumulativeProbability) {
                            next = candidate;
                            break;
                        }
                    }
                }
                if (next == -1) {
                    break;
                }
                path.push(next);
                current = next;
            }
            let distance: number = path.reduce((sum: number, id: number, i: number) => {
                return i > 0 ? sum + calDistance(locations[path[i - 1]], locations[id]) : sum;
            }, 0);
            if (distance < bestDistance && required.every(id => path.includes(id))) {
                bestPath = path;
                bestDistance = distance;
            }
            for (let i = 0; i < path.length - 1; i++) {
               // Continue from previous code snippet
pheromone[path[i]][path[i + 1]] += Q / distance;
            }
        }
        // Evaporate pheromone
        for (let i = 0; i < locations.length; i++) {
            for (let j = 0; j < locations.length; j++) {
                pheromone[i][j] *= (1 - rho);
            }
        }
    }
    return {
        path: bestPath,
        isAvailable: bestPath.length > 0,
        distance: bestDistance
    };
}

export function calDistance(node1: Location, node2: Location): number {
    let dx = node2.address[0] - node1.address[0];
    let dy = node2.address[1] - node1.address[1];
    return Math.sqrt(dx * dx + dy * dy);
}

(async () => {
    await fse.readJSON("src/server/map.json").then((data) => {
        locations = data;
    });
})();

 