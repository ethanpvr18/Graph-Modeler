export class Queue {
    constructor() {
        this.firstNode = null;
        this.lastNode = null;

        this.Node = class {
            constructor(data, nextNode) {
                this.data = data;
                this.nextNode = nextNode;
            }

            getData() {
                return this.data;
            }

            getNextNode() {
                return this.nextNode;
            }

            setData(data) {
                this.data = data;
            }

            setNextNode(nextNode) {
                this.nextNode = nextNode;
            }
        }
    }

    enqueue(newEntry) {
        const newNode = new this.Node(newEntry, null);
        
        if(this.isEmpty()) {
            this.firstNode = newNode;
        }else{
            this.lastNode.setNextNode(newNode);
        }

        this.lastNode = newNode;
    }

    dequeue() {
        const front = this.getFront();
        this.firstNode.setData(null);
        this.firstNode = this.firstNode.getNextNode();
        if(this.firstNode == null) {
            this.lastNode = null;
        }
        return front;
    }   

    getFront() {
        if(this.isEmpty()) {
            console.error('Queue Empty.');
        }else{
            return this.firstNode.getData();
        }
    }

    isEmpty() {
        return (this.firstNode == null) && (this.lastNode == null);
    }

    clear() {
        this.firstNode = null;
        this.lastNode = null;
    }

    showArray(currentNode) {
        console.log(currentNode.getData() + ' ');
        if(currentNode.getNextNode() != null) {
            showArray(currentNode.getNextNode());
        }
    }

    getFirstNode() {
        if(this.isEmpty()) {
            console.error('Queue Empty.');
        }else{
            return this.firstNode;
        }
    }
}