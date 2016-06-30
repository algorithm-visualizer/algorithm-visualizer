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

const setupButtons = () => {

    var button_2DMatrix = document.getElementById("button-2DMatrix");
    button_2DMatrix.addEventListener('click',function(){
        var arr2DTracer = new modules.Array2DTracer();
        var numRows = getNumRows();
        var numColumns = getNumColumns();
        var data = fauxData(numRows, numColumns);
        console.log(data);
        arr2DTracer.setData(data);
    },false);
};

module.exports = {
    setupButtons
};
