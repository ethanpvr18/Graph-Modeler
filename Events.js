import { Graph } from './Graph.js';
import { windowReloadHandler, 
         dblClickHandler, 
         keyHandler, 
         documentMouseDownHandler, 
         documentMouseMoveHandler, 
         documentMouseUpHandler, 
         dfsBtnHandler, 
         bfsBtnHandler, 
         topoSortBtnHandler, 
         maxFlowBtnHandler, 
         shortestPathBtnHandler, 
         openBtnHandler, 
         closeBtnHandler,
         saveBtnHandler,
         saveAsBtnHandler,
         printBtnHandler } from './Handlers.js';

export const graph = new Graph();

window.addEventListener('load', (event) => windowReloadHandler(graph, event));
window.addEventListener('beforeunload', (event) => windowReloadHandler(graph, event));

document.addEventListener('dblclick', (event) => dblClickHandler(graph, event));
document.addEventListener('mousedown', (event) => documentMouseDownHandler(graph, event));
document.addEventListener('mousemove', (event) => documentMouseMoveHandler(graph, event));
document.addEventListener('mouseup', (event) => documentMouseUpHandler(graph, event));
document.addEventListener('keydown', (event) => keyHandler(graph, event));

const dfsBtn = document.querySelector('.depth-first-search');
dfsBtn.addEventListener('click', (event) => dfsBtnHandler(graph, event));

const bfsBtn = document.querySelector('.breadth-first-search');
bfsBtn.addEventListener('click', (event) => bfsBtnHandler(graph, event));

// const topoSortBtn = document.querySelector('.topo-sort');
// topoSortBtn.addEventListener('click', (event) => topoSortBtnHandler(graph, event));

// const maxFlowBtn = document.querySelector('.max-flow');
// maxFlowBtn.addEventListener('click', (event) => maxFlowBtnHandler(graph, event));

// const shortestPathBtn = document.querySelector('.shortest-path');
// shortestPathBtn.addEventListener('click', (event) => shortestPathBtnHandler(graph, event));

const openBtn = document.querySelector('.open');
openBtn.addEventListener('click', (event) => openBtnHandler(graph, event));

const closeBtn = document.querySelector('.close');
closeBtn.addEventListener('click', (event) => closeBtnHandler(graph, event));

const saveBtn = document.querySelector('.save');
saveBtn.addEventListener('click', (event) => saveBtnHandler(graph, event));

const saveAsBtn = document.querySelector('.save-as');
saveAsBtn.addEventListener('click', (event) => saveAsBtnHandler(graph, event));

const printBtn = document.querySelector('.print');
printBtn.addEventListener('click', (event) => printBtnHandler(graph, event));