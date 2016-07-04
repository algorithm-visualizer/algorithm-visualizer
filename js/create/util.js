'use strict';


const getTracerName = () =>{
    return document.getElementById("tracerName").value;
}

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

const clearModules = () =>{
    var elems = document.getElementsByClassName('module_wrapper');
    if(elems.length > 0){
        var parent = elems[0].parentElement;
        var numChild = parent.childNodes.length;
        for(var i = 0; i < numChild; i++){
            parent.removeChild(parent.firstChild);
        }
    }
}

const enabledHightlighting = () =>{
    var elems = document.getElementsByClassName('module_wrapper');
    var logger = elems[1];
    var wrapper = logger.childNodes[1];
    for (var i = 0; i < wrapper.childNodes.length; i++) {
        wrapper.childNodes[i].style["-webkit-user-select"] = "all";
    }
}

module.exports = {
    enabledHightlighting,
    positionModules,
    clearModules,
    getTracerName
};
