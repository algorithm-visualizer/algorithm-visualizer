'use strict';

const modules = require('../module');
const array2d = require('./array2d');
const array1d = require('./array1d');
const util = require('./util');
const Server = require('../server');
const DOM = require('../dom');

const {
  getPath
} = require('../server/helpers');

const closeCreate = () => {
        const $btnClose = $('#btn_close');

        $btnClose.click(() => {
            $('.sandbox_container').remove();
            util.clearModules();
            reloadAlgorithm();
        });
};

const reloadAlgorithm = () => {
    const {
      category,
      algorithm,
      file
    } = getPath();

    Server.loadAlgorithm(category, algorithm).then((data) => {
      DOM.showAlgorithm(category, algorithm, data);
    });
};

const createHTML = () => {
    $('.workspace').append("<div class='sandbox_container'>\
            <section class='close_bar'>\
            <div class='btn' id='btn_close'>\
                <div class='wrapper'>\
                    <i class='fa fa-times' aria-hidden='true'></i>\
                </div>\
            </div>\
            </section>\
            <section class='auto-gen'>\
                <div class='grid' id='array1D-gen'>\
                <div> array1DTracer </div>\
                <i class='fa fa-ellipsis-h fa-5x' aria-hidden='true'></i>\
                <div class='fields'>\
                # of Columns: <input class='inputs'id='numColumns-1D' type='number' value='5'>\
                </div>\
                <div class='fields'>\
                Tracer Name: <input class='inputs'id='tracerName-1D' type='text' value='default'>\
                </div>\
                <button class='sb-button' id='button-1DMatrix'>Create 1DMatrix</button>\
                <button class='sb-button' id='button-generateJS-1D'>Generate Javascript</button>\
                </div>\
                <div class='grid' id='array2D-gen'>\
                <div> array2DTracer </div>\
                <i class='fa fa-th fa-5x' aria-hidden='true'></i>\
                <div class='fields'>\
                # of Rows: <input class='inputs'id='numRows-2D' type='number' value='5'>\
                </div>\
                <div class='fields'>\
                # of Columns: <input class='inputs'id='numColumns-2D' type='number' value='5'>\
                </div>\
                <div class='fields'>\
                Tracer Name: <input class='inputs'id='tracerName-2D' type='text' value='default'>\
                </div>\
                <button class='sb-button' id='button-2DMatrix'>Create 2DMatrix</button>\
                <button class='sb-button' id='button-generateJS-2D'>Generate Javascript</button>\
                </div>\
                <div class='grid' id='chart-gen'></div>\
                <div class='grid' id='graph-gen'></div>\
            </section>\
    </div>");
};

const init = () => {

    var check = $('.sandbox_container');
    if(!check.length){
        util.clearModules();
        createHTML();
        array2d.setup();
        array1d.setup();
        closeCreate();
        util.clickTraceTab();
    }
};

module.exports = {
    init
};
