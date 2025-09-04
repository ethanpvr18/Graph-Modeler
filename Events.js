import { Graph } from './Graph.js';
import { windowReloadHandler, 
         documentDblClickHandler, 
         documentRemoveKeyHandler, 
         documentMouseDownHandler, 
         documentMouseMoveHandler, 
         documentMouseUpHandler, 
         documentKeyPrintHandler, 
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

if(window) {
    const _windowReloadHandler = ((event) => windowReloadHandler(graph, event));
    window.addEventListener('load', _windowReloadHandler);
}

if(document) {
    const _documentDblClickHandler = ((event) => documentDblClickHandler(graph, event));
    document.addEventListener('dblclick', _documentDblClickHandler);

    const _documentRemoveKeyHandler = ((event) => documentRemoveKeyHandler(graph, event));
    document.addEventListener('keydown', _documentRemoveKeyHandler);

    const _documentMouseDownHandler = ((event) => documentMouseDownHandler(graph, event));
    document.addEventListener('mousedown', _documentMouseDownHandler);

    const _documentMouseMoveHandler = ((event) => documentMouseMoveHandler(graph, event));
    document.addEventListener('mousemove', _documentMouseMoveHandler);

    const _documentMouseUpHandler = ((event) => documentMouseUpHandler(graph, event));
    document.addEventListener('mouseup', _documentMouseUpHandler);

    const _documentKeyPrintHandler = ((event) => documentKeyPrintHandler(graph, event));
    document.addEventListener('keydown', _documentKeyPrintHandler);
}

const dfsBtn = document.querySelector('.depth-first-search');
const _dfsBtnHandler = ((event) => dfsBtnHandler(graph, event));
if(dfsBtn)
    dfsBtn.addEventListener('click', _dfsBtnHandler);

const bfsBtn = document.querySelector('.breadth-first-search');
const _bfsBtnHandler = ((event) => bfsBtnHandler(graph, event));
if(bfsBtn)
    bfsBtn.addEventListener('click', _bfsBtnHandler);

const topoSortBtn = document.querySelector('.topo-sort');
const _topoSortBtnHandler = ((event) => topoSortBtnHandler(graph, event));
if(topoSortBtn)
    topoSortBtn.addEventListener('click', _topoSortBtnHandler );

const maxFlowBtn = document.querySelector('.max-flow');
const _maxFlowBtnHandler = ((event) => maxFlowBtnHandler(graph, event));
if(maxFlowBtn)
    maxFlowBtn.addEventListener('click', _maxFlowBtnHandler);

const shortestPathBtn = document.querySelector('.shortest-path');
const _shortestPathBtnHandler = ((event) => shortestPathBtnHandler(graph, event));
if(shortestPathBtn)
    shortestPathBtn.addEventListener('click', _shortestPathBtnHandler);

const openBtn = document.querySelector('.open');
const _openBtnHandler = ((event) => openBtnHandler(graph, event));
if(openBtn)
    openBtn.addEventListener('click', _openBtnHandler);

const closeBtn = document.querySelector('.close');
const _closeBtnHandler = ((event) => closeBtnHandler(graph, event));
if(closeBtn)
    closeBtn.addEventListener('click', _closeBtnHandler);

const saveBtn = document.querySelector('.save');
const _saveBtnHandler = ((event) => saveBtnHandler(graph, event));
if(saveBtn)
    saveBtn.addEventListener('click', _saveBtnHandler);

const saveAsBtn = document.querySelector('.save-as');
const _saveAsBtnHandler = ((event) => saveAsBtnHandler(graph, event));
if(saveAsBtn)
    saveAsBtn.addEventListener('click', _saveAsBtnHandler);

const printBtn = document.querySelector('.print');
const _printBtnHandler = ((event) => printBtnHandler(graph, event));
if(printBtn)
    printBtn.addEventListener('click', _printBtnHandler);