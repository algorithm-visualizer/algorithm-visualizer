'use strict';

const modules = require('../module');
const array2d = require('./array2d');
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



const init = () => {

    var check = $('.sandbox_container');
    if(!check.length){
        util.clearModules();

        $('.workspace').append("<div class='sandbox_container'>\
                <section class='close_bar'>\
                <div class='btn' id='btn_close'>\
                    <div class='wrapper'>\
                        <i class='fa fa-times' aria-hidden='true'></i>\
                    </div>\
                </div>\
                </section>\
                <section class='auto-gen auto-gen-tracers'>\
                    <button class='sb-button' id='button-2DMatrix'>Create 2DMatrix</button>\
                </section>\
                <section class='auto-gen auto-gen-options'>\
                    <div>\
                    # of Rows: <input class='inputs'id='numRows' type='number' value='5'>\
                    </div>\
                    <div>\
                    # of Columns: <input class='inputs'id='numColumns' type='number' value='5'>\
                    </div>\
                    <div>\
                    Tracer Name: <input class='inputs'id='tracerName' type='text' value='default'>\
                    </div>\
                </section>\
                <section class='auto-gen auto-gen-generate'>\
                    <button class='sb-button' id='button-generateJS'>Generate Javascript</button>\
                </section>\
        </div>");
        array2d.setup();

        closeCreate(moduleWrappers);
    }
};

module.exports = {
    init
};
