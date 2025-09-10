import { keyHandler,
         dblClickHandler } from './Handlers.js';
import { Stack } from './Stack.js';


export class Graph {

    static GraphClipboard = class {
        constructor(graph) {
            this.graph = graph;
            this.clipboard = [];

            this.stack = new Stack();
                    
            this.operation = new Graph.GraphClipboardOperation();
        }

        copy() {
            this.clipboard = [
                this.graph.vertices.filter(v => v.selected).map(v => ({
                    type: 'vertex',
                    label: v.label,
                    left: parseFloat(v.vertex.style.left),
                    top: parseFloat(v.vertex.style.top)
                })),
                this.graph.edges.filter(e => e.selected).map(e => ({
                    type: 'edge',
                    v1Index: this.graph.vertices.indexOf(e.v1),
                    v2Index: this.graph.vertices.indexOf(e.v2),
                    weight: e.weight
                }))
            ];
        }

        paste() {
            this.clipboard.forEach(item => {
                if(item.type === 'vertex') {
                    new graph.Vertex(item.label, item.left, item.top, { raw: true });
                } else if(item.type === 'edge') {
                    new graph.Edge(this.graph.vertices[item.v1Index], this.graph.vertices[item.v2Index], item.weight);
                }
            });
        }

        cut() {
            this.graph.vertices.filter(v => v.selected).forEach(v => {
                this.clipboard.push(v);
                v.removeVertex();
            });

            this.graph.edges.filter(e => e.selected).forEach(e => {
                this.clipboard.push(e);
                e.removeEdge();
            });
        }
    }

    static GraphClipboardOperation = class {
        constructor() {
            this.type = null;

            this.paste, 
            this.cut, 
            this.remove, 
            this.create, 
            this.edit, 
            this.select, 
            this.move,
            this.open,
            this.close,
            this.run = null;
        }

        setOperation(type, value) {
            this.type = type;
            switch(this.type) {
                case 'paste':
                    this.paste = value;
                    break;
                case 'cut':
                    this.cut = value;
                    break;
                case 'remove':
                    this.remove = value;
                    break;
                case 'create':
                    this.create = value;
                    break;
                case 'edit':
                    this.edit = value;
                    break;
                case 'select':
                    this.select = value;
                    break;
                case 'move':
                    this.move = value;
                    break;
                case 'open':
                    this.open = value;
                    break;
                case 'close':
                    this.close = value;
                    break;
                case 'run':
                    this.run = value;
                    break;
            }
        }

        undo() {
            switch(this.type) {
                case 'paste':
                    this.paste = value;
                    break;
                case 'cut':
                    this.cut = value;
                    break;
                case 'remove':
                    this.remove = value;
                    break;
                case 'create':
                    this.create = value;
                    break;
                case 'edit':
                    this.edit = value;
                    break;
                case 'select':
                    this.select = value;
                    break;
                case 'move':
                    this.move = value;
                    break;
                case 'open':
                    this.open = value;
                    break;
                case 'close':
                    this.close = value;
                    break;
                case 'run':
                    this.run = value;
                    break;
            }
        }

        redo() {
            switch(this.type) {
                case 'paste':
                    this.paste = value;
                    break;
                case 'cut':
                    this.cut = value;
                    break;
                case 'remove':
                    this.remove = value;
                    break;
                case 'create':
                    this.create = value;
                    break;
                case 'edit':
                    this.edit = value;
                    break;
                case 'select':
                    this.select = value;
                    break;
                case 'move':
                    this.move = value;
                    break;
                case 'open':
                    this.open = value;
                    break;
                case 'close':
                    this.close = value;
                    break;
                case 'run':
                    this.run = value;
                    break;
            }
        }
    }

    static Editor = class {
        constructor(graph, existingContent, left, top) {
            this.graph = graph;
            this.editor = document.createElement('input');

            this.isEditing = false;

            this.editor.classList.add('editor');
            this.editor.type = 'text';
            this.editor.value = existingContent;
            this.editor.style.left = `${left}px`;
            this.editor.style.top = `${top}px`;

            this.graph.graph.appendChild(this.editor);
            this.editor.focus();

            this.graph.editors.push(this);
        }

        removeEditor() {
            const i = this.graph.editors.findIndex(e => e.editor === this.editor);

            if(i !== -1)
                this.graph.editors.splice(i, 1);

            if(this.editor && this.editor.parentNode) {
                this.editor.parentNode.removeChild(this.editor);
                this.editor = null;
            }
        }
    }

    constructor() {
        this.graphFile = null;

        this.graph = document.createElement('div');
        this.graphRect = null;

        this.graph.classList.add('graph');
        this.graph.tabIndex = 0;

        document.body.appendChild(this.graph);

        this.vertices = [];
        this.edges = [];

        this.editors = [];
        this.Editor = Graph.Editor;

        this.result = null;
        this.dialog = null;

        const graph = this;

        this.clipboard = new Graph.GraphClipboard(this);

        this.v1 = null;
        this.v2 = null;
        this.e1 = null;
        this.DEFAULT_WEIGHT = 1;

        this.draggedVertex = null;
        this.draggedResult = null;
        this.selectionArea = null;

        this.Dialog = class {
            constructor(text) {
                this.input = null;
                if(!this.dialog){
                    this.dialog = document.createElement('form');
                    this.dialog.action = '';
                    this.dialog.classList.add('dialog');

                    this.dialogText = document.createElement('label');
                    this.dialogText.textContent = text;
                    this.dialogText.for = 'sourceVertex';

                    this.dialogInput = document.createElement('input');
                    this.dialogInput.type = 'text';
                    this.dialogInput.id = 'sourceVertex';
                    this.dialogInput.name = 'sourceVertex';
                    this.dialogInput.value = 'v0';
                    
                    this.submit = document.createElement('input');
                    this.submit.type = 'submit';
                    this.submit.value = 'Run';
                    this.submit.classList.add('run');
                    this.submit.classList.add('submit');

                    this.close = document.createElement('input');
                    this.close.type = 'button';
                    this.close.value = 'Cancel';
                    this.close.classList.add('submit');

                    this.dialog.appendChild(this.dialogText);
                    this.dialog.appendChild(this.dialogInput);
                    this.dialog.appendChild(this.submit);
                    this.dialog.appendChild(this.close);
                    graph.graph.appendChild(this.dialog);

                    this.isDragging = false;

                    this.offsetX = 0;
                    this.offsetY = 0;

                    graph.dialog = this;
                }
            }

            remove() {
                graph.graph.removeChild(this.dialog);
            }
        }

        this.Result = class {
            constructor() {
                if(!this.result){
                    this.result = document.createElement('div');
                    this.result.classList.add('result');
                    graph.graph.appendChild(this.result);

                    this.resultContent = '';
                    this.isDragging = false;

                    this.offsetX = 0;
                    this.offsetY = 0;

                    graph.result = this;
                }
            }

            add(content) {
                if(this.result) {
                    this.resultContent += ' ' + content;
                    this.result.textContent = this.resultContent;
                }
            }

            clear() {
                if(this.result) {
                    this.result.textContent = '';
                    this.resultContent = '';
                }
            }
        }

        this.SelectionArea = class {
            constructor() {
                this.selectionArea = document.createElement('div');
                this.selectionArea.classList.add('selection-area');
                this.isDragging = false;

                this.startX = null;
                this.startY = null;

                this.endX = null;
                this.endY = null;
            }

            open(x=0, y=0) {
                this.startX = x;
                this.startY = y;

                this.selectionArea.style.left = `${x}px`;
                this.selectionArea.style.top = `${y}px`;
                this.selectionArea.style.width = `0px`;
                this.selectionArea.style.height = `0px`;

                graph.graph.appendChild(this.selectionArea);
            }

            set(x=0, y=0) {
                this.endX = x;
                this.endY = y;

                if(this.endX < this.startX && this.endY < this.startY) {
                    this.selectionArea.style.left = `${this.endX}px`;
                    this.selectionArea.style.top = `${this.endY}px`;

                    this.selectionArea.style.width = `${this.startX - this.endX}px`;
                    this.selectionArea.style.height = `${this.startY - this.endY}px`;

                } else if(this.endX < this.startX && this.endY >= this.startY) {
                    this.selectionArea.style.left = `${this.endX}px`;
                    this.selectionArea.style.top = `${this.startY}px`;

                    this.selectionArea.style.width = `${this.startX - this.endX}px`;
                    this.selectionArea.style.height = `${this.endY - this.startY}px`;

                } else if(this.endX >= this.startX && this.endY < this.startY) {
                    this.selectionArea.style.left = `${this.startX}px`;
                    this.selectionArea.style.top = `${this.endY}px`;

                    this.selectionArea.style.width = `${this.endX - this.startX}px`;
                    this.selectionArea.style.height = `${this.startY - this.endY}px`;

                } else if(this.endX >= this.startX && this.endY >= this.startY) {
                    this.selectionArea.style.left = `${this.startX}px`;
                    this.selectionArea.style.top = `${this.startY}px`;

                    this.selectionArea.style.width = `${this.endX - this.startX}px`;
                    this.selectionArea.style.height = `${this.endY - this.startY}px`;
                } else {
                    this.selectionArea.style.left = `${this.startX}px`;
                    this.selectionArea.style.top = `${this.startY}px`;

                    this.selectionArea.style.width = `0px`;
                    this.selectionArea.style.height = `0px`;
                }

            }

            close() {
                if(this.selectionArea && this.selectionArea.parentNode)
                    this.selectionArea.parentNode.removeChild(this.selectionArea);
            }

            select() {                
                graph.vertices.forEach(v => {
                    const vertexRect = v.vertex.getBoundingClientRect();
                    const selectionAreaRect = this.selectionArea.getBoundingClientRect();
                    if(((vertexRect.top) >= (selectionAreaRect.top)) && 
                       ((vertexRect.bottom) <= (selectionAreaRect.bottom)) && 
                       ((vertexRect.left) >= (selectionAreaRect.left)) && 
                       ((vertexRect.right) <= (selectionAreaRect.right))) {
                        v.select('red');
                    }
                });

                graph.edges.forEach(e => {
                    const edgeRect = e.edge.getBoundingClientRect();
                    const selectionAreaRect = this.selectionArea.getBoundingClientRect();
                    if(((edgeRect.top) >= (selectionAreaRect.top)) && 
                       ((edgeRect.bottom) <= (selectionAreaRect.bottom)) && 
                       ((edgeRect.left) >= (selectionAreaRect.left)) && 
                       ((edgeRect.right) <= (selectionAreaRect.right))) {
                        e.select('red');
                    }
                });
            }
        }

        

        this.Vertex = class {
            constructor(label, x, y, { raw=false } = {}) {
                this.vertex = document.createElement('div');

                this.selected = false;
                this.isDragging = false;

                this.color = null;
                this.predecessor = null;
                this.discoveryTime = null;
                this.finishTime = null;

                this.isEditing = false;
                this.vertexEditor = null;

                this.vertex.classList.add('vertex');
                this.vertex.textContent = label;

                graph.graphRect = graph.graph.getBoundingClientRect();
                
                if (raw) {
                    this.vertex.style.left = `${x}px`;
                    this.vertex.style.top = `${y}px`;
                } else {
                    this.vertex.style.left = `${x - graph.graphRect.left - 24}px`;
                    this.vertex.style.top = `${y - graph.graphRect.top - 24}px`;
                }

                this.label = label;
                this.existingLabel = this.label;
                
                if(this.vertex)
                    this.vertex.addEventListener('dblclick', (event) => dblClickHandler(graph, event, this));

                graph.graph.appendChild(this.vertex);

                this.vertex.vertexRect = this.vertex.getBoundingClientRect();
                graph.graphRect = graph.graph.getBoundingClientRect();

                graph.vertices.push(this);
            }

            select(color='red') {
                this.vertex.classList.add('selected');
                this.vertex.style.boxShadow = '0px 0px 3px 5px ' + color;
                this.selected = true;
            }

            deselect(color='transparent') {
                if(this.vertex.classList.contains('selected')) {
                    this.vertex.classList.remove('selected');
                    this.vertex.style.boxShadow = '0px 0px 3px 5px ' + color;
                    this.selected = false;
                }
            }

            setVertex(label) {
                this.vertex.textContent = label;
                this.label = label;

                this.deselect('transparent');
            }

            getVertex(label) {
                return graph.vertices.filter(v => v.label === label);
            }

            removeVertex() {
                const i = graph.vertices.findIndex(v => v.vertex === this.vertex);

                if(i !== -1)
                    graph.vertices.splice(i, 1);

                if(this.vertex && this.vertex.parentNode) {
                    this.vertex.removeEventListener('dblclick', this.dblClickHandler);
                    this.vertex.parentNode.removeChild(this.vertex);
                }

                if(this.vertexEditor.editor) {
                    this.vertexEditor.editor.removeEventListener('keydown', keyHandler);
                    this.vertexEditor.editor.removeEventListener('blur', this._vertexBlurHandler);
                    this.vertexEditor.removeEditor();
                    this.vertexEditor = null;
                }
            }

            getChildren(label) {
                let children = [];                
                
                graph.vertices.filter(v => v.label === label).forEach(vertex => {
                    graph.edges.filter(e => e.v1 === vertex).forEach(edge => {
                        children.push(edge.v2);
                    });
                });
                
                return children;
            }

            getParent(label) {
                let parent = [];                

                graph.vertices.filter(v => v.label === label).forEach(vertex => {
                    graph.edges.filter(e => e.v2 === vertex).forEach(edge => {
                        parent.push(edge.v1);
                    });
                });

                return parent;
            }
        };

        this.Edge = class {
            constructor(v1, v2, weight) {
                this.edge = document.createElement('div');
                this.label = document.createElement('div');
                this.arrow = document.createElement('div');

                this.selected = false;
                this.visited = false;

                this.edge.classList.add('edge');

                this.label.classList.add('edge-label');
                this.label.textContent = weight;
                this.existingLabel = this.label.textContent;
                this.edgeEditor = null;

                this.arrow.classList.add('edge-arrow');

                this.update = () => {
                    graph.graphRect = graph.graph.getBoundingClientRect();
                    
                    this.v1Rect = v1.vertex.getBoundingClientRect();
                    this.v2Rect = v2.vertex.getBoundingClientRect();

                    if(this.v1Rect.width === 0 || this.v2Rect.width === 0)
                        return;

                    const x1 = (this.v1Rect.left + (this.v1Rect.width / 2)) - graph.graphRect.left;
                    const y1 = (this.v1Rect.top + (this.v1Rect.height / 2)) - graph.graphRect.top;
                    const x2 = (this.v2Rect.left + (this.v2Rect.width / 2)) - graph.graphRect.left;
                    const y2 = (this.v2Rect.top + (this.v2Rect.height / 2)) - graph.graphRect.top;

                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                    this.edge.style.left = `${x1}px`;
                    this.edge.style.top = `${y1}px`;
                    this.edge.style.width = `${length}px`;
                    this.edge.style.transform = `rotate(${angle}deg)`;

                    const labelX = (x1 + x2) / 2;
                    const labelY = (y1 + y2) / 2;
                    this.label.style.left = `${labelX - (this.label.offsetWidth || 20) / 2}px`;
                    this.label.style.top = `${labelY - (this.label.offsetHeight || 10) / 2}px`;   
                    
                    this.arrow.style.left = `${x2 - (dx / length) * 24}px`;
                    this.arrow.style.top = `${y2 - (dy / length) * 24}px`;
                    this.arrow.style.transform = `translate(-50%, 0) rotate(${angle + 90}deg)`;

                };

                graph.graph.appendChild(this.arrow);
                graph.graph.appendChild(this.edge);
                graph.graph.appendChild(this.label);

                this.update();

                this.weight = weight;
                this.v1 = v1;
                this.v2 = v2;

                if(this.edge) {
                    this.dblClickHandler = (event) => dblClickHandler(graph, event, this);
                    this.edge.addEventListener('dblclick', this.dblClickHandler);
                }

                if(this.label) {
                    this.dblClickHandler = (event) => dblClickHandler(graph, event, this);
                    this.label.addEventListener('dblclick', this.dblClickHandler);
                }

                graph.edges.push(this);
            }

            select(color='red') {
                this.edge.classList.add('selected');
                this.edge.style.boxShadow = '0px 0px 3px 5px ' + color;
                this.selected = true;
            }

            deselect(color='transparent') {
                if(this.edge.classList.contains('selected')) {
                    this.edge.classList.remove('selected');
                    this.edge.style.boxShadow = '0px 0px 3px 5px ' + color;
                    this.selected = false;
                }
            }

            setEdge(weight) {
                this.label.textContent = weight;
                this.weight = weight;
            }

            removeEdge() {
                const i = graph.edges.findIndex(e => e.edge === this.edge);

                if(i !== -1)
                    graph.edges.splice(i, 1);

                if(this.edge && this.edge.parentNode) {
                    this.edge.removeEventListener('dblclick', this.dblClickHandler);
                    this.edge.parentNode.removeChild(this.edge);
                }

                if(this.label && this.label.parentNode) {
                    this.label.removeEventListener('dblclick', this.dblClickHandler);
                    this.label.parentNode.removeChild(this.label);
                }

                if(this.arrow && this.arrow.parentNode) {
                    this.arrow.parentNode.removeChild(this.arrow);
                }

                if(this.edgeEditor.editor) {
                    this.edgeEditor.editor.removeEventListener('keydown', this.keyHandler);
                    this.edgeEditor.removeEditor();
                    this.edgeEditor = null;
                }
            }
        };

        if(document)
            document.addEventListener('keydown', (event) => keyHandler(graph, event));
    }

    clearSelection() {
        this.edges.forEach(edge => {
            edge.isEditing = false;
            edge.deselect('transparent');

            if(edge.edgeEditor) {
                edge.edgeEditor.removeEditor();
                edge.edgeEditor = null;
            }
        });

        this.vertices.forEach(vertex => {
            vertex.isEditing = false;
            vertex.deselect('transparent');

            if(vertex.vertexEditor) {
                vertex.vertexEditor.removeEditor();
                vertex.vertexEditor = null;
            }
        });

        this.editors.forEach(editor => {
            editor.removeEditor();
        });

        this.editors = [];
    }

    async saveGraph(filename='Graph') {
        const vertexData = this.vertices.map(vertex => ({
            label: vertex.label, 
            left: parseFloat(vertex.vertex.style.left), 
            top: parseFloat(vertex.vertex.style.top)
        }));

        const edgeData = this.edges.map(edge => ({
            v1Index: this.vertices.indexOf(edge.v1), 
            v2Index: this.vertices.indexOf(edge.v2), 
            weight: edge.weight
        }));

        localStorage.setItem('graph', JSON.stringify({
            vertices: this.vertices.map(vertex => ({
                label: vertex.label, 
                left: parseFloat(vertex.vertex.style.left), 
                top: parseFloat(vertex.vertex.style.top)
            })),
            edges: this.edges.map(edge => ({
                v1Index: this.vertices.indexOf(edge.v1), 
                v2Index: this.vertices.indexOf(edge.v2), 
                weight: edge.weight
            }))
        }));

        const data = { vertices: vertexData, edges: edgeData };
        const dataString = JSON.stringify(data, null, 2);
                
        if(Graph._fileDialogOpen)
            return;

        Graph._fileDialogOpen = true;

        try {
            if (!this.graphFile) {
                this.graphFile = await window.showSaveFilePicker({
                    suggestedName: filename,
                    types: [{
                        description: "JSON Files",
                        accept: { "application/json": [".json"] }
                    }]
                });
            }

            const writable = await this.graphFile.createWritable();
            await writable.write(dataString);
            await writable.close();
        } catch(error) {
            if(error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
                console.error('Load file failed: ' + error);
            }
        } finally {
            Graph._fileDialogOpen = false;
        }
    }

    async saveAsGraph(filename='Graph') {
        this.graphFile = null;
        return this.saveGraph(filename)
    }

    async openGraph() {
        this.clearSelection();

        if(Graph._fileDialogOpen)
            return;

        Graph._fileDialogOpen = true;

        try {
            if (!this.graphFile) {
                const [handle] = await window.showOpenFilePicker();
                this.graphFile = handle;
            }

            const file = await this.graphFile.getFile();
            const fileContent = await file.text();
            const fileGraph = JSON.parse(fileContent);

            this.closeGraph();

            fileGraph.vertices.forEach(vertex => {
                new this.Vertex(vertex.label, vertex.left, vertex.top, { raw: true })
            });
            
            fileGraph.edges.forEach(edge => new this.Edge(this.vertices[edge.v1Index], this.vertices[edge.v2Index], edge.weight));
        
            this.edges.forEach(edge => edge.update());

            localStorage.setItem('graph', JSON.stringify({
                vertices: this.vertices.map(vertex => ({
                    label: vertex.label, 
                    left: parseFloat(vertex.vertex.style.left), 
                    top: parseFloat(vertex.vertex.style.top)
                })),
                edges: this.edges.map(edge => ({
                    v1Index: this.vertices.indexOf(edge.v1), 
                    v2Index: this.vertices.indexOf(edge.v2), 
                    weight: edge.weight
                }))
            }));

        } catch(error) {
            if(error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
                console.error('Load file failed: ' + error);
            }
        } finally {
            Graph._fileDialogOpen = false;
        }
    }

    closeGraph() {
        if (this.graph) {
            this.graph.innerHTML = '';
        }

        this.vertices = [];
        this.edges = [];
        this.editors = [];

        this.graphFile = null;
    }
}