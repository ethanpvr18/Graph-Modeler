import { Queue } from './Queue.js';
import { LinkedList } from './LinkedList.js';

let time = 0;

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function dfs(graph, source='v0') {
    graph.vertices.forEach(vertex => {
        vertex.color = 'transparent';
        vertex.deselect('transparent');
        vertex.predecessor = null;
    });

    time = 0;

    const sourceVertex = graph.vertices.find(v => ((v.label == source) && (v.color == 'transparent')));
    
    if (!sourceVertex) {
        console.error(`Source vertex ${source} not found.`);
        return;
    }
    
    await dfsVisit(graph, sourceVertex);
}

async function dfsVisit(graph, vertex) {
    if(vertex.color !== 'black') {
        time++;

        await wait(400);

        vertex.discoveryTime = time;
        vertex.color = 'gray';
        vertex.select('gray');

        const vertexChildren = vertex.getChildren(vertex.label);

        for (const v of vertexChildren) {
            if ((v.color === 'transparent')) {
                v.predecessor = vertex;
                await dfsVisit(graph, v);
            } 
        }

        time++;

        await wait(400);
        vertex.finishTime = time;
        vertex.color = 'black';
        vertex?.select('black');
        graph.result.add(vertex.label);
    }
    
    await wait(400);
    graph.edges.find(e => (e.v1 === vertex.predecessor) && (e.v2 === vertex) && (e.color !== 'black'))?.select('black');
}


export async function bfs(graph, source='v0') {
    const sourceVertex = graph.vertices.find(v => v.label === source);

    if (!sourceVertex) {
        console.error(`Source vertex ${source} not found.`);
        return;
    }
    
    graph.vertices.forEach(vertex => {
        vertex.color = 'transparent';
        vertex.deselect('transparent');
        vertex.discoveryTime = Infinity;
        vertex.predecessor = null;
    });

    await wait(400);
    sourceVertex.color = 'gray';
    sourceVertex.select('gray');
    sourceVertex.discoveryTime = 0;
    sourceVertex.predecessor = null;

    const queue = new Queue();

    queue.enqueue(sourceVertex);

    while(!queue.isEmpty()){
        const u = queue.dequeue();

        const vertexChildren = u.getChildren(u.label);

        for(const v of vertexChildren) {
            if (v.color === 'transparent') {
                await wait(400);
                v.color = 'gray';
                v.select('gray');
                v.discoveryTime = u.discoveryTime + 1;
                v.predecessor = u;
                queue.enqueue(v);
            }
        }

        await wait(400);
        graph.edges.find(e => (e.v1 === u.predecessor) && (e.v2 === u) && (e.color !== 'black'))?.select('black');
        
        await wait(400);
        if(u.color !== 'black') {
            u.color = 'black';
            u.select('black');
            graph.result.add(u.label);
        }
    }
}

export function topoSort(graph, source='v0') {
    dfs(graph, source);

    const linkedList = new LinkedList();

    return linkedList;
}

export function maxFlow(graph, source) {

}

export function shortestPath(graph, source) {

}