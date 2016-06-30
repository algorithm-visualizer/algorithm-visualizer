'use strict';

const modules = require('../module');

const getNumRows = () => {
    var row_field = document.getElementById("numRows");
    return row_field.value;
};

const getNumColumns = () => {
    var column_field = document.getElementById("numColumns");
    return column_field.value;
};

const fauxData = (r, c) => {
    var arr = new Array(r);
    for (var i = 0; i < c; i++) {
        arr[i] = new Array(c);
    }

    for (var i = 0; i < r; i++) {
        for(var j = 0; j < c; j++){
            arr[i][j] = 0;
        }
    }
    return arr;
};

const makeInputFields = () =>{

    var table = document.querySelector('.mtbl-table');

    var numRows = table.childNodes.length;
    var numColumns = table.childNodes[0].childNodes.length;

    for(var i = 0; i < numRows; i++){
        for(var j = 0; j < numColumns; j++){
            var elem = document.createElement('input');
            elem.type = 'Number';
            elem.value = 1;
            elem.classList.add('mtbl-col','inputField');
            table.childNodes[i].childNodes[j].innerHTML = '';
            table.childNodes[i].childNodes[j].appendChild(elem);
        }
    }

};

const generateJS = () =>{
    var logger = new modules.LogTracer('Generated Javascript');
    var table = document.querySelector('.mtbl-table');

    var numRows = table.childNodes.length;
    var numColumns = table.childNodes[0].childNodes.length;

    var line = '';
    for(var i = 0; i < numRows; i++){
        line = '';
        for(var j = 0; j < numColumns; j++){
            line += table.childNodes[i].childNodes[j].childNodes[0].value + ',';
        }
        logger.print(line);
    }

};

const positionModules = () =>{
    var elems = document.getElementsByClassName('module_wrapper');
    if(elems <= 0) return;

    var n = elems.length;
    var spacing = (100/n);

    for (var i = 0; i < n; i++) {
        if( i === 0){
            elems[i].style.bottom = (spacing * (n-1)) + '%';
        }else if(i === n - 1){
            elems[i].style.top = (spacing * i) + '%';
        }else{
            elems[i].style.top = (spacing * i) + '%';
            elems[i].style.bottom = (spacing * i) + '%';
        }
    }
}

const setupButtons = () => {

    var button_2DMatrix = document.getElementById("button-2DMatrix");
    button_2DMatrix.addEventListener('click',function(){
        var arr2DTracer = new modules.Array2DTracer();
        var numRows = getNumRows();
        var numColumns = getNumColumns();
        var data = fauxData(numRows, numColumns);

        arr2DTracer.setData(data);
        makeInputFields();
        generateJS();
        positionModules();
    },false);

};

module.exports = {
    setupButtons
};
