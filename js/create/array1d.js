'use strict';

const array2D = require('./array2d');
const modules = require('../module');
const util = require('./util');

const getTracerName = () =>{
    return document.getElementById("tracerName-1D").value;
}

const getNumColumns = () => {
    var column_field = document.getElementById('numColumns-1D');
    return column_field.value;
};

const setup = () => {
    var button_1DMatrix = document.getElementById("button-1DMatrix");
    var logger;
    var arr1DTracer;
    button_1DMatrix.addEventListener('click',function(){
        util.clearModules();
        arr1DTracer = new modules.Array1DTracer();
        var arrElem = document.querySelector('.module_wrapper');
        arrElem.addEventListener("mousewheel", array2D.mousescroll, false);
        arrElem.addEventListener("DOMMouseScroll", array2D.mousescroll, false);
        logger = new modules.LogTracer('Generated Javascript');

        var numColumns = getNumColumns();
        var data = array2D.fauxData(1,numColumns)[0];

        arr1DTracer.setData(data);
        array2D.tableToInputFields(1, numColumns);
        util.positionModules();
        arr1DTracer.refresh();
    },false);
    var button_JS = document.getElementById('button-generateJS-1D');
    button_JS.addEventListener('click',function(){
        array2D.generateJS(logger, 'Array1DTracer');
    },false);
};


module.exports = {
    setup
};
