export class LinkedList {
    constructor() {
        this.firstNode = null;
        this.lastNode = null;
        this.nextNode = null;
        this.numOfEntries = 0;

        this.Node = class {
            constructor(data, nextNode=null) {
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

    add(newEntry) {
        const newNode = new this.Node(newEntry);
        
        if(isEmpty()) {
            this.firstNode = newNode;
        }else{
            this.lastNode.setNext(newNode);
        }

        this.lastNode = newNode;
        this.numOfEntries++;
    }

    add(givenPosition, newEntry) {
        if ((givenPosition >= 1) && (givenPosition <= this.numOfEntries + 1)) {
            const newNode = new this.Node(newEntry);

            if (isEmpty()) {
                this.firstNode = newNode;
                this.lastNode = newNode;
            } else if (givenPosition == 1) {
                newNode.setNext(this.firstNode);
                this.firstNode = newNode;
            } else if (givenPosition === this.numOfEntries + 1) {
                this.lastNode.setNext(newNode);
                this.lastNode = newNode;
            } else {
                const nodeBefore = getNodeAt(givenPosition-1);
                const nodeAfter = nodeBefore.getNext();

                newNode.setNext(nodeAfter);
                nodeBefore.setNext(newNode);
            }
            this.numOfEntries++;

        } else {
            console.error('Index Out Of Bounds.');
        }
    }   

    remove(givenPosition) {
        const result = null;

        if ((givenPosition >= 1) && (givenPosition <= this.numOfEntries)) {
            if (givenPosition === 1) {
                result = this.firstNode.getData();
                this.firstNode = this.firstNode.getNext();
                if (this.numOfEntries === 1) {
                    this.lastNode = null;
                }
            } else {
                const nodeBefore = getNodeAt(givenPosition - 1);
                const nodeToRemove = nodeBefore.getNext();
                const nodeAfter = nodeToRemove.getNext();
                nodeBefore.setNext(nodeAfter);
                result = nodeToRemove.getData();
                
                if (givenPosition === this.numOfEntries) {
                    this.lastNode = nodeBefore;
                }
            }
            this.numOfEntries--;
        } else {
            console.error('Index Out Of Bounds.');
        }

        return result;
    }

    clear() {
        this.firstNode = null;
        this.lastNode = null;
        this.nextNode = null;
        this.numOfEntries = 0;
    }

    replace(givenPosition, newEntry) {
        if ((givenPosition >= 1) && (givenPosition <= this.numOfEntries)) {
            const newNode = getNodeAt(givenPosition);
            const oldEntry = newNode.getData();
            newNode.setData(newEntry);
            return oldEntry;
        } else {
            console.error('Index Out Of Bounds.');
        }
    }

    getEntry(givenPosition) {
        if ((givenPosition >= 1) && (givenPosition <= this.numOfEntries)) {
            return getNodeAt(givenPosition).getData();
        } else {
            console.error('Index Out Of Bounds.');
        }
    }

    toArray() {
        const result = [];

        const currentNode = this.firstNode;
        let index = 0;
    
        while ((index < this.numOfEntries) && (currentNode != null)) {
            result[index] = currentNode.getData();
            currentNode = currentNode.getNext();
            index++;
        }

        return result;
    }

    contains(entry) { 
        const found = false;
        const currentNode = this.firstNode;

        while (!found && (currentNode != null)) {
            if (entry === currentNode.getData()) {
                found = true;
            } else {
                currentNode = currentNode.getNext();
            }
        }

        return found;
    }

    getLength() {
        const currentNode = this.firstNode;
        this.numOfEntries = 0;

        while (currentNode != null) {
            this.numOfEntries++;
            currentNode = currentNode.getNext();
        }

        return this.numOfEntries;
    }

    isEmpty() {
        return this.numOfEntries === 0;
    }

    getNodeAt(givenPosition) {
        const currentNode = this.firstNode;
        for(let i = 1;i < givenPosition;i++) {
            currentNode = currentNode.getNext();
        }
        return currentNode;
    }

    resetTraversal() {
        this.nextNode = this.firstNode;
    }
}