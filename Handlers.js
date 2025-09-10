import { dfs, bfs, topoSort, maxFlow, shortestPath } from './Functions.js';

let operation = null;

export function windowReloadHandler(graph, event) {

    const currentGraph = JSON.parse(localStorage.getItem('graph'));
    
    if (!currentGraph) return;
    
    graph.closeGraph();

    currentGraph.vertices.forEach(vertex => {
        graph.graphRect = graph.graph.getBoundingClientRect();
        new graph.Vertex(vertex.label, vertex.left, vertex.top, { raw: true });
    });

    currentGraph.edges.forEach(edge => {
        graph.graphRect = graph.graph.getBoundingClientRect();
        new graph.Edge(graph.vertices[edge.v1Index], graph.vertices[edge.v2Index], edge.weight);
    });

    graph.edges.forEach(edge => edge.update());

}

export function keyHandler(graph, event) {
    if((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        graph.saveGraph();
    }

    if((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') {
        graph.clipboard.operation.setOperation('copy', graph);
        event.preventDefault();
    }

    if((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v') {
        graph.clipboard.operation.setOperation('paste', graph);
        event.preventDefault();
    }

    if((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'x') {
        graph.clipboard.operation.setOperation('cut', graph);
        event.preventDefault();
    }
    
    if((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        event.stopPropagation();

        graph.vertices.forEach(v => {
            v.deselect('transparent');
        });
        graph.edges.forEach(e => {
            e.deselect('transparent');
        });

        window.print();
    }

    if(event.key === 'Escape') {
        graph.clipboard.operation.setOperation('deselect', graph);
        event.preventDefault();
        graph.clearSelection();
    }

    if((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        graph.clipboard.operation.setOperation('edit', edge);

        edge.setEdge(edge.edgeEditor.editor.value);
        
        edge.edgeEditor.removeEditor();
        edge.edgeEditor = null;
        edge.isEditing = false;

        edge.deselect('transparent');
        graph.clipboard.operation.setOperation('deselect', edge);
    }

    if((event.ctrlKey || event.metaKey) && event.key === 'Enter') {

        graph.clipboard.operation.setOperation('edit', vertex);

        vertex.setVertex(vertex.vertexEditor.editor.value);
        vertex.vertexEditor.removeEditor();
        vertex.vertexEditor = null;
        vertex.deselect('transparent');
    }
    
    if((event.ctrlKey || event.metaKey) && event.key === 'Backspace') {
        graph.edges.filter(edge => edge.selected).forEach(edge => {
            if(edge.edge.parentNode) {
                graph.clipboard.operation.setOperation('remove', edge);
                edge.removeEdge();

                localStorage.setItem('graph', JSON.stringify({
                    vertices: graph.vertices.map(vertex => ({
                        label: vertex.label, 
                        left: ((parseFloat(vertex.vertex.style.left)) - (parseFloat(vertex.vertex.style.left) % 24)), 
                        top: ((parseFloat(vertex.vertex.style.top)) - (parseFloat(vertex.vertex.style.top) % 24))
                    })),
                    edges: graph.edges.map(edge => ({
                        v1Index: graph.vertices.indexOf(edge.v1), 
                        v2Index: graph.vertices.indexOf(edge.v2), 
                        weight: edge.weight
                    }))
                }));
            }
        });

        graph.vertices.filter(vertex => vertex.selected).forEach(vertex => {
            graph.edges.filter(edge => (vertex === edge.v1 || vertex === edge.v2)).forEach(edge => {
                if(edge.edge.parentNode) {
                    graph.clipboard.operation.setOperation('remove', edge);
                    edge.removeEdge();

                    localStorage.setItem('graph', JSON.stringify({
                        vertices: graph.vertices.map(vertex => ({
                            label: vertex.label, 
                            left: ((parseFloat(vertex.vertex.style.left)) - (parseFloat(vertex.vertex.style.left) % 24)), 
                            top: ((parseFloat(vertex.vertex.style.top)) - (parseFloat(vertex.vertex.style.top) % 24))
                        })),
                        edges: graph.edges.map(edge => ({
                            v1Index: graph.vertices.indexOf(edge.v1), 
                            v2Index: graph.vertices.indexOf(edge.v2), 
                            weight: edge.weight
                        }))
                    }));
                }
            });

            if(vertex.vertex.parentNode) {
                graph.clipboard.operation.setOperation('remove', vertex);
                vertex.removeVertex();

                localStorage.setItem('graph', JSON.stringify({
                    vertices: graph.vertices.map(vertex => ({
                        label: vertex.label, 
                        left: ((parseFloat(vertex.vertex.style.left)) - (parseFloat(vertex.vertex.style.left) % 24)), 
                        top: ((parseFloat(vertex.vertex.style.top)) - (parseFloat(vertex.vertex.style.top) % 24))
                    })),
                    edges: graph.edges.map(edge => ({
                        v1Index: graph.vertices.indexOf(edge.v1), 
                        v2Index: graph.vertices.indexOf(edge.v2), 
                        weight: edge.weight
                    }))
                }));
            }
        });
        
        graph.clipboard.operation.setOperation('deselect', graph);
        graph.clearSelection();
    }


}

export function dblClickHandler(graph, event) {
    document.body.style.cursor = 'pointer';

    if(event.target.classList.contains('vertex')) {
        if(!graph.v1) {
            graph.v1 = graph.vertices.find(v => v.vertex === event.target);
            graph.v1.select('red');
            graph.clipboard.operation.setOperation('select', graph.v1);
        } else if (!graph.v2) {
            graph.v2 = graph.vertices.find(v => v.vertex === event.target);
            graph.v2.select('red');
            graph.clipboard.operation.setOperation('select', graph.v2);
            graph.clearSelection();
            graph.clipboard.operation.setOperation('deselect', graph.v1);
            graph.clipboard.operation.setOperation('deselect', graph.v2);

            if(graph.v1 && graph.v2 && graph.v1 !== graph.v2){
                graph.clearSelection();
                graph.graphRect = graph.graph.getBoundingClientRect();
                graph.e1 = new graph.Edge(graph.v1, graph.v2, graph.DEFAULT_WEIGHT);
                graph.clipboard.operation.setOperation('create', graph.e1);
            }

            graph.v1 = graph.v2 = graph.e1 = null;
        }

        return;
    }
    
    if(!event.target.classList.contains('vertex') && !event.target.classList.contains('edge') && !event.target.classList.contains('edge-label') && !event.target.classList.contains('editor') && !event.target.classList.contains('toolbar') && !event.target.classList.contains('result')  && !event.target.classList.contains('dialog')) {
        graph.graphRect = graph.graph.getBoundingClientRect();        

        let nextVertexNumber = 0;

        while(graph.vertices.find(v => v.label === `v${nextVertexNumber}`)) {
            nextVertexNumber++;
        }

        const vertex = new graph.Vertex(`v${nextVertexNumber}`, event.clientX - graph.graphRect.left - 24, event.clientY - graph.graphRect.top - 24, { raw: true });
        graph.clipboard.operation.setOperation('create', vertex);
    }

    if(vertex.selected) {
        graph.clipboard.operation.setOperation('deselect', vertex);
        vertex.deselect('transparent');
    } else {
        graph.clipboard.operation.setOperation('select', vertex);
        graph.clipboard.operation.setOperation('edit', vertex);
        vertex.select('red');

        vertex.existingLabel = vertex.label.textContent;

        graph.graphRect = graph.graph.getBoundingClientRect();

        if(!vertex.isEditing) {
            vertex.isEditing = true;
            vertex.vertexEditor = new graph.Editor(graph, vertex.vertex.textContent, 
                                        (event.clientX - graph.graphRect.left - 24),
                                        (event.clientY - graph.graphRect.top - 24));
        
            vertex.vertexEditor.editor.addEventListener('keydown', (event) => keyHandler(graph, event, vertex));
        }
        
    }

    if(edge.selected) {
        graph.clipboard.operation.setOperation('deselect', edge);
        edge.deselect('transparent');
    } else {
        graph.clipboard.operation.setOperation('select', edge);
        edge.select('red');

        edge.existingLabel = edge.label.textContent;

        graph.graphRect = graph.graph.getBoundingClientRect();

        if(!edge.isEditing) {
            edge.isEditing = true;
            edge.edgeEditor = new graph.Editor(edge.existingLabel, 
                                        (event.clientX - graph.graphRect.left - 24),
                                        (event.clientY - graph.graphRect.top - 24));

            edge.edgeEditor.editor.addEventListener('keydown', (event) => keyHandler(graph, event, edge));
        }
        
    }

    if(edge.selected) {
        graph.clipboard.operation.setOperation('deselect', edge);
        edge.deselect('transparent');
    } else {
        graph.clipboard.operation.setOperation('select', edge);
        graph.clipboard.operation.setOperation('edit', edge);
        edge.select('red');

        edge.existingLabel = edge.label.textContent;

        graph.graphRect = graph.graph.getBoundingClientRect();

        if(!edge.isEditing) {
            edge.isEditing = true;
            edge.edgeEditor = new graph.Editor(edge.label.textContent, 
                                            (event.clientX - graph.graphRect.left - 24),
                                            (event.clientY - graph.graphRect.top - 24));

            edge.edgeEditor.editor.keyHandler = (event) => {
                if((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                    edge.edgeEditor.setEdge(edge.edgeEditor.editor.value);
                    
                    edge.edgeEditor.removeEditor();
                    edge.edgeEditor = null;

                    graph.clipboard.operation.setOperation('deselect', edge);
                    edge.deselect('transparent');
                }
            };

            edge.edgeEditor.editor.addEventListener('keydown', (event) => keyHandler(graph, event, edge));
        }
    }
};

export function documentMouseDownHandler(graph, event) {
    graph.clipboard.operation.setOperation('move', graph);

    if(event.target.classList.contains('vertex')) {
        document.body.style.cursor = 'grabbing';

        graph.draggedVertex = graph.vertices.find(v => v.vertex === event.target);
        if(graph.draggedVertex) {
            graph.draggedVertex.isDragging = true;
        }
    }

    if(event.target.classList.contains('result')) {
        document.body.style.cursor = 'grabbing';

        graph.draggedResult = {
            element: event.target,
            offsetX: ((event.clientX - event.target.offsetLeft) - ((event.clientX - event.target.offsetLeft) % 24)),
            offsetY: ((event.clientY - event.target.offsetTop) - ((event.clientY - event.target.offsetTop) % 24)),
            isDragging: true
        };
    }

    if(event.target.classList.contains('dialog')) {
        document.body.style.cursor = 'grabbing';

        graph.draggedDialog = {
            element: event.target,
            offsetX: ((event.clientX - event.target.offsetLeft) - ((event.clientX - event.target.offsetLeft) % 24)),
            offsetY: ((event.clientY - event.target.offsetTop) - ((event.clientY - event.target.offsetTop) % 24)),
            isDragging: true
        };
    }

    if(!event.target.classList.contains('vertex') && !event.target.classList.contains('edge') && !event.target.classList.contains('edge-label') && !event.target.classList.contains('editor') && !event.target.classList.contains('toolbar') && !event.target.classList.contains('result')) {
        graph.selectionArea = new graph.SelectionArea();

        graph.selectionArea.isDragging = true;
        const graphRect = graph.graph.getBoundingClientRect();
        let x = ((event.clientX - graphRect.left) - ((event.clientX - graphRect.left) % 24));
        let y = ((event.clientY - graphRect.top) - ((event.clientY - graphRect.top) % 24));

        graph.selectionArea.open(x, y);
    } 
}

export function documentMouseMoveHandler(graph, event) {
    if(graph.draggedVertex && graph.draggedVertex.isDragging) {
        document.body.style.cursor = 'grabbing';

        graph.graphRect = graph.graph.getBoundingClientRect();
        graph.draggedVertex.vertex.style.left = `${(event.clientX - graph.graphRect.left - 24) - ((event.clientX - graph.graphRect.left - 24) % 24)}px`;
        graph.draggedVertex.vertex.style.top = `${(event.clientY - graph.graphRect.top - 24) - ((event.clientY - graph.graphRect.top - 24) % 24)}px`;
        
        graph.edges.filter(edge => edge.v1 === graph.draggedVertex || edge.v2 === graph.draggedVertex).forEach(edge => edge.update());
    }

    if(graph.draggedResult && graph.draggedResult.isDragging) {
        document.body.style.cursor = 'grabbing';

        graph.graphRect = graph.graph.getBoundingClientRect();
        graph.draggedResult.element.style.left = `${(event.clientX - graph.draggedResult.offsetX) - ((event.clientX - graph.draggedResult.offsetX) % 24)}px`;
        graph.draggedResult.element.style.top = `${(event.clientY - graph.draggedResult.offsetY) - ((event.clientY - graph.draggedResult.offsetY) % 24)}px`;
    }
    
    if(graph.draggedDialog && graph.draggedDialog.isDragging) {
        document.body.style.cursor = 'grabbing';

        graph.graphRect = graph.graph.getBoundingClientRect();
        graph.draggedDialog.element.style.left = `${(event.clientX - graph.draggedDialog.offsetX) - ((event.clientX - graph.draggedDialog.offsetX) % 24)}px`;
        graph.draggedDialog.element.style.top = `${(event.clientY - graph.draggedDialog.offsetY) - ((event.clientY - graph.draggedDialog.offsetY) % 24)}px`;
    }

    if(graph.selectionArea && graph.selectionArea.isDragging) {
        document.body.style.cursor = 'grabbing';

        const graphRect = graph.graph.getBoundingClientRect();
        const x = event.clientX - graphRect.left;
        const y = event.clientY - graphRect.top;
    
        graph.selectionArea.set(x, y);
        graph.selectionArea.select();
    }
}

export function documentMouseUpHandler(graph, event) {
    graph.clipboard.operation.setOperation('move', graph);

    if(graph.draggedVertex) {
        document.body.style.cursor = 'default';
   
        graph.draggedVertex.isDragging = false;
        graph.draggedVertex = null;

        localStorage.setItem('graph', JSON.stringify({
            vertices: graph.vertices.map(vertex => ({
                label: vertex.label, 
                left: ((parseFloat(vertex.vertex.style.left)) - (parseFloat(vertex.vertex.style.left) % 24)), 
                top: ((parseFloat(vertex.vertex.style.top)) - (parseFloat(vertex.vertex.style.top) % 24))
            })),
            edges: graph.edges.map(edge => ({
                v1Index: graph.vertices.indexOf(edge.v1), 
                v2Index: graph.vertices.indexOf(edge.v2), 
                weight: edge.weight
            }))
        }));
    }

    if(graph.draggedResult) {
        document.body.style.cursor = 'default';

        graph.draggedResult.isDragging = false;
        graph.draggedResult = null;
    }

    if(graph.draggedDialog) {
        document.body.style.cursor = 'default';

        graph.draggedDialog.isDragging = false;
        graph.draggedDialog = null;
    }

    if(graph.selectionArea && graph.selectionArea.isDragging) {
        document.body.style.cursor = 'default';

        graph.selectionArea.isDragging = false;
        graph.selectionArea.select();
        graph.selectionArea.close();
        graph.selectionArea = null;
    }
}

export function dfsBtnHandler(graph, event) {
    graph.clipboard.operation.setOperation('run', graph);
    operation = 'dfs';
    event.stopPropagation();

    if(!graph.dialog) {
        graph.dialog = new graph.Dialog('Enter Source Vertex Label:  ');
    }

    const runBtn = document.querySelector('.run');
    const _runBtnHandler = ((event) => {
        if(!graph.result) {
            graph.clearSelection();
            graph.result = new graph.Result();
        } else {
            graph.clearSelection();
            graph.result.clear();  
        }

        const sourceLabel = graph.dialog.dialogInput.value;
        graph.dialog.remove();
        graph.result.add('Depth First Search: ');
        dfs(graph, sourceLabel);
    });

    if(runBtn)
        runBtn.addEventListener('click', _runBtnHandler);

    const cancelBtn = document.querySelector('.cancel');
    const _cancelBtnHandler = ((event) => {
        graph.dialog.remove();
    });
    if(cancelBtn)
        cancelBtn.addEventListener('click', _cancelBtnHandler);

    operation = '';
}

export function bfsBtnHandler(graph, event) {
    graph.clipboard.operation.setOperation('run', graph);
    operation = 'bfs';
    event.stopPropagation();

    if(!graph.dialog) {
        graph.dialog = new graph.Dialog('Enter Source Vertex Label:  ');
    }

    const runBtn = document.querySelector('.run');
    const _runBtnHandler = ((event) => {
        if(!graph.result) {
            graph.clearSelection();
            graph.result = new graph.Result();
        } else {
            graph.clearSelection();
            graph.result.clear();  
        }

        const sourceLabel = graph.dialog.dialogInput.value;
        graph.dialog.remove();
        graph.result.add('Breadth First Search: ');
        bfs(graph, sourceLabel);
    });

    runBtn.addEventListener('click', _runBtnHandler);

    const cancelBtn = document.querySelector('.cancel');
    const _cancelBtnHandler = ((event) => {
        graph.dialog.remove();
    });
    cancelBtn.addEventListener('click', _cancelBtnHandler);

    operation = '';
}

export function topoSortBtnHandler(graph, event) {
    operation = 'topoSort';
    graph.clipboard.operation.setOperation('run', graph);
    event.stopPropagation();

    if(!graph.dialog) {
        graph.dialog = new graph.Dialog('Enter Source Vertex Label:  ');
    }

    const runBtn = document.querySelector('.run');
    const _runBtnHandler = ((event) => {
        if(!graph.result) {
            graph.clearSelection();
            graph.result = new graph.Result();
        } else {
            graph.clearSelection();
            graph.result.clear();  
        }

        const sourceLabel = graph.dialog.dialogInput.value;
        graph.dialog.remove();
        graph.result.add('Topological Sort: ');
        topoSort(graph, sourceLabel);
    });

    runBtn.addEventListener('click', _runBtnHandler);
    

    const cancelBtn = document.querySelector('.cancel');
    const _cancelBtnHandler = ((event) => {
        graph.dialog.remove();
    });
    cancelBtn.addEventListener('click', _cancelBtnHandler);

    operation = '';
}

export function maxFlowBtnHandler(graph, event) {
    graph.clipboard.operation.setOperation('run', graph);
    operation = 'maxFlow';
    event.stopPropagation();

    if(!graph.dialog) {
        graph.dialog = new graph.Dialog('Enter Source Vertex Label:  ');
    }

    const runBtn = document.querySelector('.run');
    const _runBtnHandler = ((event) => {
        if(!graph.result) {
            graph.clearSelection();
            graph.result = new graph.Result();
        } else {
            graph.clearSelection();
            graph.result.clear();  
        }

        const sourceLabel = graph.dialog.dialogInput.value;
        graph.dialog.remove();
        graph.result.add('Max Flow: ');
        maxFlow(graph, sourceLabel);
    });

    runBtn.addEventListener('click', _runBtnHandler);

    const cancelBtn = document.querySelector('.cancel');
    const _cancelBtnHandler = ((event) => {
        graph.dialog.remove();
    });
    cancelBtn.addEventListener('click', _cancelBtnHandler);

    operation = '';
}

export function shortestPathBtnHandler(graph, event) {
    graph.clipboard.operation.setOperation('run', graph);
    operation = 'shortestPath';
    event.stopPropagation();

    if(!graph.dialog) {
        graph.dialog = new graph.Dialog('Enter Source Vertex Label:  ');
    }

    const runBtn = document.querySelector('.run');
    const _runBtnHandler = ((event) => {
        if(!graph.result) {
            graph.clearSelection();
            graph.result = new graph.Result();
        } else {
            graph.clearSelection();
            graph.result.clear();  
        }

        const sourceLabel = graph.dialog.dialogInput.value;
        graph.dialog.remove();
        graph.result.add('Shortest Path: ');
        shortestPath(graph, sourceLabel);
    });

    runBtn.addEventListener('click', _runBtnHandler);

    const cancelBtn = document.querySelector('.cancel');
    const _cancelBtnHandler = ((event) => {
        graph.dialog.remove();
    });
    cancelBtn.addEventListener('click', _cancelBtnHandler);

    operation = '';
}

export function openBtnHandler(graph, event) {
    graph.clipboard.operation.setOperation('open', graph);
    event.stopPropagation();
    graph.openGraph();
}

export function closeBtnHandler(graph, event) {
    graph.clipboard.operation.setOperation('close', graph);

    event.stopPropagation();
    graph.closeGraph();

    localStorage.removeItem('graph');
}

export function saveBtnHandler(graph, event) {
    event.stopPropagation();
    graph.saveGraph();
}

export function saveAsBtnHandler(graph, event) {
    event.stopPropagation();
    graph.saveAsGraph();
}

export function printBtnHandler(graph, event) {
    event.stopPropagation();

    graph.vertices.forEach(v => {
        v.deselect('transparent');
    });
    graph.edges.forEach(e => {
        e.deselect('transparent');
    });

    window.print();
}

