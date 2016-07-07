'use strict';

const modules = require('../module');
const util = require('./util');


const getTracerName = () =>{
    return document.getElementById("tracerName-2D").value;
}

const getNumRows = () => {
    var row_field = document.getElementById('numRows-2D');
    return row_field.value;
}

const getNumColumns = () => {
    var column_field = document.getElementById('numColumns-2D');
    return column_field.value;
}

const fauxData = (r, c) => {
    var D = [];
    for (var i = 0; i < r; i++) {
      D.push([]);
      for (var j = 0; j < c; j++) {
        D[i].push(Math.floor(Math.random()* 10 + 1));
      }
    }
    return D;
}

const tableToInputFields = (numRows, numColumns) => {
    var table = document.querySelector('.mtbl-table');

    for(var i = 0; i < numRows; i++){
        for(var j = 0; j < numColumns; j++){
            var elem = document.createElement('input');
            elem.type = 'Number';
            elem.value = Math.floor(Math.random() * 10 + 1);
            elem.classList.add('mtbl-col','inputField');
            table.childNodes[i].childNodes[j].innerHTML = '';
            table.childNodes[i].childNodes[j].appendChild(elem);
        }
    }
}

const generateJS = (logger, tracer, tracerName) => {
    if(!logger) return;

    logger.clear();
    var table = document.querySelector('.mtbl-table');

    var numRows = table.childNodes.length;
    var numColumns = table.childNodes[0].childNodes.length;

    logger.print('Copy and paste this code in your data.js file!');
    logger.print('');

    logger.print('let myTable = [');

    var line = '';
    var i;
    var j;
    var comma = ',';
    for(i = 0; i < numRows; i++){
        line = '[';
        for(j = 0; j < numColumns-1; j++){
            line += table.childNodes[i].childNodes[j].childNodes[0].value + ',';
        }
        if(i === numRows - 1){comma = '';}
        line += table.childNodes[i].childNodes[j++].childNodes[0].value + ']' + comma;
        logger.print(line);
    }
    logger.print(']');


    logger.print("let myTableTracer = new "+ tracer +" ('"+tracerName+"')");
    logger.print('myTableTracer._setData (myTable)');

    util.enabledHightlighting();
}

const mousescroll = (e) =>{
    var colmElem = document.querySelector('.mtbl-col');
    var delta = (e.wheelDelta !== undefined && e.wheelDelta) ||
      (e.detail !== undefined && -e.detail);

    var inputFields = document.getElementsByClassName("inputField");
    for (var i = 0; i < inputFields.length; i++) {
        inputFields[i].style.width = (parseFloat(colmElem.style.fontSize) * 2.5) + "px";
     }

}

const setup = () => {
    var button_2DMatrix = document.getElementById("button-2DMatrix");
    var logger;
    var arr2DTracer;
    button_2DMatrix.addEventListener('click',function(){
        util.clearModules();
        arr2DTracer = new modules.Array2DTracer();
        var arrElem = document.querySelector('.module_wrapper');
        arrElem.addEventListener("mousewheel", mousescroll, false);
        arrElem.addEventListener("DOMMouseScroll", mousescroll, false);
        logger = new modules.LogTracer('Generated Javascript');

        var numRows = getNumRows();
        var numColumns = getNumColumns();
        var data = fauxData(numRows, numColumns);

        arr2DTracer.setData(data);
        tableToInputFields(numRows, numColumns);
        util.positionModules();
        arr2DTracer.refresh();
    },false);
    var button_JS = document.getElementById('button-generateJS-2D');
    button_JS.addEventListener('click',function(){
        generateJS(logger, 'Array2DTracer', getTracerName());
    },false);
}

module.exports = {
    setup,
    mousescroll,
    fauxData,
    tableToInputFields,
    generateJS
};
