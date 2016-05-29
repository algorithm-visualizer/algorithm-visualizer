/**
 * algorithm-visualizer - Algorithm Visualizer
 * @version v0.1.0
 * @author Jason Park & contributors
 * @link https://github.com/parkjs814/AlgorithmVisualizer#readme
 * @license MIT
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _$ = $;
var extend = _$.extend;


var cache = {
  lastFileUsed: '',
  files: {}
};

var assertFileName = function assertFileName(name) {
  if (!name) {
    throw 'Missing file name';
  }
};

/**
 * Global application cache
 */
module.exports = {
  getCachedFile: function getCachedFile(name) {
    assertFileName(name);
    return cache.files[name];
  },
  updateCachedFile: function updateCachedFile(name, updates) {
    assertFileName(name);
    if (!cache.files[name]) {
      cache.files[name] = {};
    }
    extend(cache.files[name], updates);
  },
  getLastFileUsed: function getLastFileUsed() {
    return cache.lastFileUsed;
  },
  setLastFileUsed: function setLastFileUsed(file) {
    cache.lastFileUsed = file;
  }
};

},{}],2:[function(require,module,exports){
'use strict';

var Editor = require('../editor');
var TracerManager = require('../tracer_manager');
var DOM = require('../dom/setup');

var _require = require('../utils');

var getFileDir = _require.getFileDir;


var Cache = require('./cache');

var _$ = $;
var each = _$.each;


var state = {
  isLoading: null,
  editor: null,
  tracerManager: null,
  categories: null
};

var initState = function initState(tracerManager) {
  state.isLoading = false;
  state.editor = new Editor(tracerManager);
  state.tracerManager = tracerManager;
  state.categories = {};
};

/**
 * Global application singleton.
 */
var App = function App() {

  this.getIsLoading = function () {
    return state.isLoading;
  };

  this.setIsLoading = function (loading) {
    state.isLoading = loading;
    if (loading) {
      $('#loading-slider').removeClass('loaded');
    } else {
      $('#loading-slider').addClass('loaded');
    }
  };

  this.getEditor = function () {
    return state.editor;
  };

  this.getCategories = function () {
    return state.categories;
  };

  this.getCategory = function (name) {
    return state.categories[name];
  };

  this.setCategories = function (categories) {
    state.categories = categories;
  };

  this.updateCategory = function (name, updates) {
    $.extend(state.categories[name], updates);
  };

  this.getTracerManager = function () {
    return state.tracerManager;
  };

  var tracerManager = TracerManager.init();

  initState(tracerManager);
  DOM.setup(tracerManager);
};

App.prototype = Cache;

module.exports = App;

},{"../dom/setup":5,"../editor":24,"../tracer_manager":47,"../utils":53,"./cache":1}],3:[function(require,module,exports){
'use strict';

/**
 * This is the main application instance.
 * Gets populated on page load. 
 */

module.exports = {};

},{}],4:[function(require,module,exports){
'use strict';

var showAlgorithm = require('./show_algorithm');
var showCategories = require('./show_categories');
var showDescription = require('./show_description');
var showFiles = require('./show_files');
var showFirstAlgorithm = require('./show_first_algorithm');

module.exports = {
  showAlgorithm: showAlgorithm,
  showCategories: showCategories,
  showDescription: showDescription,
  showFiles: showFiles,
  showFirstAlgorithm: showFirstAlgorithm
};

},{"./show_algorithm":16,"./show_categories":17,"./show_description":18,"./show_files":19,"./show_first_algorithm":20}],5:[function(require,module,exports){
'use strict';

var setupDividers = require('./setup_dividers');
var setupDocument = require('./setup_document');
var setupFilesBar = require('./setup_files_bar');
var setupInterval = require('./setup_interval');
var setupModuleContainer = require('./setup_module_container');
var setupPoweredBy = require('./setup_powered_by');
var setupScratchPaper = require('./setup_scratch_paper');
var setupSideMenu = require('./setup_side_menu');
var setupTopMenu = require('./setup_top_menu');
var setupWindow = require('./setup_window');

/**
 * Initializes elements once the app loads in the DOM. 
 */
var setup = function setup() {

  $('.btn input').click(function (e) {
    e.stopPropagation();
  });

  // dividers
  setupDividers();

  // document
  setupDocument();

  // files bar
  setupFilesBar();

  // interval
  setupInterval();

  // module container
  setupModuleContainer();

  // powered by
  setupPoweredBy();

  // scratch paper
  setupScratchPaper();

  // side menu
  setupSideMenu();

  // top menu
  setupTopMenu();

  // window
  setupWindow();
};

module.exports = {
  setup: setup
};

},{"./setup_dividers":6,"./setup_document":7,"./setup_files_bar":8,"./setup_interval":9,"./setup_module_container":10,"./setup_powered_by":11,"./setup_scratch_paper":12,"./setup_side_menu":13,"./setup_top_menu":14,"./setup_window":15}],6:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var appInstance = require('../../app');

var addDividerToDom = function addDividerToDom(divider) {
  var _divider = _slicedToArray(divider, 3);

  var vertical = _divider[0];
  var $first = _divider[1];
  var $second = _divider[2];

  var $parent = $first.parent();
  var thickness = 5;

  var $divider = $('<div class="divider">');

  var dragging = false;
  if (vertical) {
    (function () {
      $divider.addClass('vertical');

      var _left = -thickness / 2;
      $divider.css({
        top: 0,
        bottom: 0,
        left: _left,
        width: thickness
      });

      var x = void 0;
      $divider.mousedown(function (_ref) {
        var pageX = _ref.pageX;

        x = pageX;
        dragging = true;
      });

      $(document).mousemove(function (_ref2) {
        var pageX = _ref2.pageX;

        if (dragging) {
          var new_left = $second.position().left + pageX - x;
          var percent = new_left / $parent.width() * 100;
          percent = Math.min(90, Math.max(10, percent));
          $first.css('right', 100 - percent + '%');
          $second.css('left', percent + '%');
          x = pageX;
          appInstance.getTracerManager().resize();
          $('.files_bar > .wrapper').scroll();
        }
      });

      $(document).mouseup(function (e) {
        dragging = false;
      });
    })();
  } else {
    (function () {

      $divider.addClass('horizontal');
      var _top = -thickness / 2;
      $divider.css({
        top: _top,
        height: thickness,
        left: 0,
        right: 0
      });

      var y = void 0;
      $divider.mousedown(function (_ref3) {
        var pageY = _ref3.pageY;

        y = pageY;
        dragging = true;
      });

      $(document).mousemove(function (_ref4) {
        var pageY = _ref4.pageY;

        if (dragging) {
          var new_top = $second.position().top + pageY - y;
          var percent = new_top / $parent.height() * 100;
          percent = Math.min(90, Math.max(10, percent));
          $first.css('bottom', 100 - percent + '%');
          $second.css('top', percent + '%');
          y = pageY;
          appInstance.getTracerManager().resize();
        }
      });

      $(document).mouseup(function (e) {
        dragging = false;
      });
    })();
  }

  $second.append($divider);
};

module.exports = function () {
  var dividers = [['v', $('.sidemenu'), $('.workspace')], ['v', $('.viewer_container'), $('.editor_container')], ['h', $('.data_container'), $('.code_container')]];
  for (var i = 0; i < dividers.length; i++) {
    addDividerToDom(dividers[i]);
  }
};

},{"../../app":3}],7:[function(require,module,exports){
'use strict';

var appInstance = require('../../app');

module.exports = function () {
  $(document).on('click', 'a', function (e) {
    e.preventDefault();

    if (!window.open($(undefined).attr('href'), '_blank')) {
      alert('Please allow popups for this site');
    }
  });

  $(document).mouseup(function (e) {
    appInstance.getTracerManager().command('mouseup', e);
  });
};

},{"../../app":3}],8:[function(require,module,exports){
'use strict';

var definitelyBigger = function definitelyBigger(x, y) {
  return x > y + 2;
};

module.exports = function () {

  $('.files_bar > .btn-left').click(function () {
    var $wrapper = $('.files_bar > .wrapper');
    var clipWidth = $wrapper.width();
    var scrollLeft = $wrapper.scrollLeft();

    $($wrapper.children('button').get().reverse()).each(function () {
      var left = $(this).position().left;
      var right = left + $(this).outerWidth();
      if (0 > left) {
        $wrapper.scrollLeft(scrollLeft + right - clipWidth);
        return false;
      }
    });
  });

  $('.files_bar > .btn-right').click(function () {
    var $wrapper = $('.files_bar > .wrapper');
    var clipWidth = $wrapper.width();
    var scrollLeft = $wrapper.scrollLeft();

    $wrapper.children('button').each(function () {
      var left = $(this).position().left;
      var right = left + $(this).outerWidth();
      if (clipWidth < right) {
        $wrapper.scrollLeft(scrollLeft + left);
        return false;
      }
    });
  });

  $('.files_bar > .wrapper').scroll(function () {

    var $wrapper = $('.files_bar > .wrapper');
    var clipWidth = $wrapper.width();
    var $left = $wrapper.children('button:first-child');
    var $right = $wrapper.children('button:last-child');
    var left = $left.position().left;
    var right = $right.position().left + $right.outerWidth();

    if (definitelyBigger(0, left) && definitelyBigger(clipWidth, right)) {
      var scrollLeft = $wrapper.scrollLeft();
      $wrapper.scrollLeft(scrollLeft + clipWidth - right);
      return;
    }

    var lefter = definitelyBigger(0, left);
    var righter = definitelyBigger(right, clipWidth);
    $wrapper.toggleClass('shadow-left', lefter);
    $wrapper.toggleClass('shadow-right', righter);
    $('.files_bar > .btn-left').attr('disabled', !lefter);
    $('.files_bar > .btn-right').attr('disabled', !righter);
  });
};

},{}],9:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var appInstance = require('../../app');
var Toast = require('../toast');

var parseFloat = Number.parseFloat;


var minInterval = 0.1;
var maxInterval = 10;
var startInterval = 0.5;
var stepInterval = 0.1;

var normalize = function normalize(sec) {

  var interval = void 0;
  var message = void 0;
  if (sec < minInterval) {
    interval = minInterval;
    message = 'Interval of ' + sec + ' seconds is too low. Setting to min allowed interval of ' + minInterval + ' second(s).';
  } else if (sec > maxInterval) {
    interval = minInterval;
    message = 'Interval of ' + sec + ' seconds is too high. Setting to max allowed interval of ' + maxInterval + ' second(s).';
  } else {
    interval = sec;
    message = 'Interval has been set to ' + sec + ' second(s).';
  }

  return [interval, message];
};

module.exports = function () {

  var $interval = $('#interval');
  $interval.val(startInterval);
  $interval.attr({
    max: maxInterval,
    min: minInterval,
    step: stepInterval
  });

  $('#interval').on('change', function () {
    var tracerManager = appInstance.getTracerManager();

    var _normalize = normalize(parseFloat($(this).val()));

    var _normalize2 = _slicedToArray(_normalize, 2);

    var seconds = _normalize2[0];
    var message = _normalize2[1];


    $(this).val(seconds);
    tracerManager.interval = seconds * 1000;
    Toast.showInfoToast(message);
  });
};

},{"../../app":3,"../toast":21}],10:[function(require,module,exports){
'use strict';

var appInstance = require('../../app');

module.exports = function () {

  var $module_container = $('.module_container');

  $module_container.on('mousedown', '.module_wrapper', function (e) {
    appInstance.getTracerManager().findOwner(this).mousedown(e);
  });

  $module_container.on('mousemove', '.module_wrapper', function (e) {
    appInstance.getTracerManager().findOwner(this).mousemove(e);
  });

  $module_container.on('DOMMouseScroll mousewheel', '.module_wrapper', function (e) {
    appInstance.getTracerManager().findOwner(this).mousewheel(e);
  });
};

},{"../../app":3}],11:[function(require,module,exports){
'use strict';

module.exports = function () {
  $('#powered-by').click(function () {
    $('#powered-by-list button').toggleClass('collapse');
  });
};

},{}],12:[function(require,module,exports){
'use strict';

var Server = require('../../server');
var showAlgorithm = require('../show_algorithm');

module.exports = function () {
  $('#scratch-paper').click(function () {
    var category = null;
    var algorithm = 'scratch_paper';
    Server.loadAlgorithm(category, algorithm).then(function (data) {
      showAlgorithm(category, algorithm, data);
    });
  });
};

},{"../../server":41,"../show_algorithm":16}],13:[function(require,module,exports){
'use strict';

var appInstance = require('../../app');

var sidemenu_percent = void 0;

module.exports = function () {
  $('#navigation').click(function () {
    var $sidemenu = $('.sidemenu');
    var $workspace = $('.workspace');

    $sidemenu.toggleClass('active');
    $('.nav-dropdown').toggleClass('fa-caret-down fa-caret-up');

    if ($sidemenu.hasClass('active')) {
      $sidemenu.css('right', 100 - sidemenu_percent + '%');
      $workspace.css('left', sidemenu_percent + '%');
    } else {
      sidemenu_percent = $workspace.position().left / $('body').width() * 100;
      $sidemenu.css('right', 0);
      $workspace.css('left', 0);
    }

    appInstance.getTracerManager().resize();
  });
};

},{"../../app":3}],14:[function(require,module,exports){
'use strict';

var appInstance = require('../../app');
var Server = require('../../server');
var Toast = require('../toast');

module.exports = function () {

  // shared
  $('#shared').mouseup(function () {
    $(this).select();
  });

  $('#btn_share').click(function () {

    var $icon = $(this).find('.fa-share');
    $icon.addClass('fa-spin fa-spin-faster');

    Server.shareScratchPaper().then(function (url) {
      $icon.removeClass('fa-spin fa-spin-faster');
      $('#shared').removeClass('collapse');
      $('#shared').val(url);
      Toast.showInfoToast('Shareable link is created.');
    });
  });

  // control

  $('#btn_run').click(function () {
    $('#btn_trace').click();
    var err = appInstance.getEditor().execute();
    if (err) {
      console.error(err);
      Toast.showErrorToast(err);
    }
  });
  $('#btn_pause').click(function () {
    if (appInstance.getTracerManager().isPause()) {
      appInstance.getTracerManager().resumeStep();
    } else {
      appInstance.getTracerManager().pauseStep();
    }
  });
  $('#btn_prev').click(function () {
    appInstance.getTracerManager().pauseStep();
    appInstance.getTracerManager().prevStep();
  });
  $('#btn_next').click(function () {
    appInstance.getTracerManager().pauseStep();
    appInstance.getTracerManager().nextStep();
  });

  // description & trace

  $('#btn_desc').click(function () {
    $('.tab_container > .tab').removeClass('active');
    $('#tab_desc').addClass('active');
    $('.tab_bar > button').removeClass('active');
    $(this).addClass('active');
  });

  $('#btn_trace').click(function () {
    $('.tab_container > .tab').removeClass('active');
    $('#tab_module').addClass('active');
    $('.tab_bar > button').removeClass('active');
    $(this).addClass('active');
  });
};

},{"../../app":3,"../../server":41,"../toast":21}],15:[function(require,module,exports){
'use strict';

var appInstance = require('../../app');

module.exports = function () {
  $(window).resize(function () {
    appInstance.getTracerManager().resize();
  });
};

},{"../../app":3}],16:[function(require,module,exports){
'use strict';

var appInstance = require('../app');

var _require = require('../utils');

var isScratchPaper = _require.isScratchPaper;


var showDescription = require('./show_description');
var showFiles = require('./show_files');

module.exports = function (category, algorithm, data) {
  var $menu = void 0;
  var category_name = void 0;
  var algorithm_name = void 0;

  if (isScratchPaper(category, algorithm)) {
    $menu = $('#scratch-paper');
    category_name = '';
    algorithm_name = 'Scratch Paper';
  } else {
    $menu = $('[data-category="' + category + '"][data-algorithm="' + algorithm + '"]');
    var categoryObj = appInstance.getCategory(category);
    category_name = categoryObj.name;
    algorithm_name = categoryObj.list[algorithm];
  }

  $('.sidemenu button').removeClass('active');
  $menu.addClass('active');
  $('#btn_desc').click();

  $('#category').html(category_name);
  $('#algorithm').html(algorithm_name);
  $('#tab_desc > .wrapper').empty();
  $('.files_bar > .wrapper').empty();
  $('#explanation').html('');

  appInstance.setLastFileUsed(null);
  appInstance.getEditor().clearContent();

  var files = data.files;


  delete data.files;

  showDescription(data);
  showFiles(category, algorithm, files);
};

},{"../app":3,"../utils":53,"./show_description":18,"./show_files":19}],17:[function(require,module,exports){
'use strict';

var appInstance = require('../app');
var Server = require('../server');
var showAlgorithm = require('./show_algorithm');

var _$ = $;
var each = _$.each;


var addAlgorithmToCategoryDOM = function addAlgorithmToCategoryDOM(category, subList, algorithm) {
  var $algorithm = $('<button class="indent collapse">').append(subList[algorithm]).attr('data-algorithm', algorithm).attr('data-category', category).click(function () {
    Server.loadAlgorithm(category, algorithm).then(function (data) {
      showAlgorithm(category, algorithm, data);
    });
  });

  $('#list').append($algorithm);
};

var addCategoryToDOM = function addCategoryToDOM(category) {
  var _appInstance$getCateg = appInstance.getCategory(category);

  var categoryName = _appInstance$getCateg.name;
  var categorySubList = _appInstance$getCateg.list;


  var $category = $('<button class="category">').append('<i class="fa fa-fw fa-caret-right">').append(categoryName);

  $category.click(function () {
    $('[data-category="' + category + '"]').toggleClass('collapse');
    $(this).find('i.fa').toggleClass('fa-caret-right fa-caret-down');
  });

  $('#list').append($category);

  each(categorySubList, function (algorithm) {
    addAlgorithmToCategoryDOM(category, categorySubList, algorithm);
  });
};

module.exports = function () {
  each(appInstance.getCategories(), addCategoryToDOM);
};

},{"../app":3,"../server":41,"./show_algorithm":16}],18:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var isArray = Array.isArray;
var _$ = $;
var each = _$.each;


module.exports = function (data) {
  var $container = $('#tab_desc > .wrapper');
  $container.empty();

  each(data, function (key, value) {

    if (key) {
      $container.append($('<h3>').html(key));
    }

    if (typeof value === 'string') {
      $container.append($('<p>').html(value));
    } else if (isArray(value)) {
      (function () {

        var $ul = $('<ul>');
        $container.append($ul);

        value.forEach(function (li) {
          $ul.append($('<li>').html(li));
        });
      })();
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      (function () {

        var $ul = $('<ul>');
        $container.append($ul);

        each(value, function (prop) {
          $ul.append($('<li>').append($('<strong>').html(prop)).append(' ' + value[prop]));
        });
      })();
    }
  });
};

},{}],19:[function(require,module,exports){
'use strict';

var Server = require('../server');

var _$ = $;
var each = _$.each;


var addFileToDOM = function addFileToDOM(category, algorithm, file, explanation) {
  var $file = $('<button>').append(file).click(function () {
    Server.loadFile(category, algorithm, file, explanation);
    $('.files_bar > .wrapper > button').removeClass('active');
    $(this).addClass('active');
  });
  $('.files_bar > .wrapper').append($file);
};

module.exports = function (category, algorithm, files) {
  $('.files_bar > .wrapper').empty();

  each(files, function (file, explanation) {
    addFileToDOM(category, algorithm, file, explanation);
  });

  $('.files_bar > .wrapper > button').first().click();
  $('.files_bar > .wrapper').scroll();
};

},{"../server":41}],20:[function(require,module,exports){
'use strict';

// click the first algorithm in the first category

module.exports = function () {
  $('#list button.category').first().click();
  $('#list button.category + .indent').first().click();
};

},{}],21:[function(require,module,exports){
'use strict';

var showToast = function showToast(data, type) {
  var $toast = $('<div class="toast ' + type + '">').append(data);

  $('.toast_container').append($toast);
  setTimeout(function () {
    $toast.fadeOut(function () {
      $toast.remove();
    });
  }, 3000);
};

var showErrorToast = function showErrorToast(err) {
  showToast(err, 'error');
};

var showInfoToast = function showInfoToast(err) {
  showToast(err, 'info');
};

module.exports = {
  showErrorToast: showErrorToast,
  showInfoToast: showInfoToast
};

},{}],22:[function(require,module,exports){
'use strict';

module.exports = function (id) {
  var editor = ace.edit(id);

  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
  });

  editor.setTheme('ace/theme/tomorrow_night_eighties');
  editor.session.setMode('ace/mode/javascript');
  editor.$blockScrolling = Infinity;

  return editor;
};

},{}],23:[function(require,module,exports){
'use strict';

var execute = function execute(tracerManager, code) {
  // all modules available to eval are obtained from window
  try {
    tracerManager.deallocateAll();
    eval(code);
    tracerManager.visualize();
  } catch (err) {
    return err;
  } finally {
    tracerManager.removeUnallocated();
  }
};

var executeData = function executeData(tracerManager, algoData) {
  return execute(tracerManager, algoData);
};

var executeDataAndCode = function executeDataAndCode(tracerManager, algoData, algoCode) {
  return execute(tracerManager, algoData + ';' + algoCode);
};

module.exports = {
  executeData: executeData,
  executeDataAndCode: executeDataAndCode
};

},{}],24:[function(require,module,exports){
'use strict';

var appInstance = require('../app');
var createEditor = require('./create');
var Executor = require('./executor');

function Editor(tracerManager) {
  var _this = this;

  if (!tracerManager) {
    throw 'Cannot create Editor. Missing the tracerManager';
  }

  ace.require('ace/ext/language_tools');

  this.dataEditor = createEditor('data');
  this.codeEditor = createEditor('code');

  // Setting data

  this.setData = function (data) {
    _this.dataEditor.setValue(data, -1);
  };

  this.setCode = function (code) {
    _this.codeEditor.setValue(code, -1);
  };

  this.setContent = function (_ref) {
    var data = _ref.data;
    var code = _ref.code;

    _this.setData(data);
    _this.setCode(code);
  };

  // Clearing data

  this.clearData = function () {
    _this.dataEditor.setValue('');
  };

  this.clearCode = function () {
    _this.codeEditor.setValue('');
  };

  this.clearContent = function () {
    _this.clearData();
    _this.clearCode();
  };

  this.execute = function () {
    var data = _this.dataEditor.getValue();
    var code = _this.codeEditor.getValue();
    return Executor.executeDataAndCode(tracerManager, data, code);
  };

  // listeners

  this.dataEditor.on('change', function () {
    var data = _this.dataEditor.getValue();
    var lastFileUsed = appInstance.getLastFileUsed();
    if (lastFileUsed) {
      appInstance.updateCachedFile(lastFileUsed, {
        data: data
      });
    }
    Executor.executeData(tracerManager, data);
  });

  this.codeEditor.on('change', function () {
    var code = _this.codeEditor.getValue();
    var lastFileUsed = appInstance.getLastFileUsed();
    if (lastFileUsed) {
      appInstance.updateCachedFile(lastFileUsed, {
        code: code
      });
    }
  });
};

module.exports = Editor;

},{"../app":3,"./create":22,"./executor":23}],25:[function(require,module,exports){
'use strict';

var RSVP = require('rsvp');
var appInstance = require('./app');
var AppConstructor = require('./app/constructor');
var DOM = require('./dom');
var Server = require('./server');
var Helpers = require('./server/helpers');

var modules = require('./module');

var _$ = $;
var extend = _$.extend;


$.ajaxSetup({
  cache: false,
  dataType: 'text'
});

// set global promise error handler
RSVP.on('error', function (reason) {
  console.assert(false, reason);
});

$(function () {

  // initialize the application and attach in to the instance module
  var app = new AppConstructor();
  extend(true, appInstance, app);

  // load modules to the global scope so they can be evaled
  extend(true, window, modules);

  Server.loadCategories().then(function (data) {
    appInstance.setCategories(data);
    DOM.showCategories();

    // determine if the app is loading a pre-existing scratch-pad
    // or the home page
    var gistID = Helpers.getParameterByName('scratch-paper');
    if (gistID) {
      Server.loadScratchPaper(gistID).then(function (_ref) {
        var category = _ref.category;
        var algorithm = _ref.algorithm;
        var data = _ref.data;

        DOM.showAlgorithm(category, algorithm, data);
      });
    } else {
      DOM.showFirstAlgorithm();
    }
  });

  // http://localhost:8080/?scratch-paper=dcf0d0de60a4ad335b3b0cb5c39035e7
});

},{"./app":3,"./app/constructor":2,"./dom":4,"./module":30,"./server":41,"./server/helpers":40,"rsvp":55}],26:[function(require,module,exports){
'use strict';

var _require = require('./array2d');

var Array2D = _require.Array2D;
var Array2DTracer = _require.Array2DTracer;


function Array1DTracer() {
    return Array2DTracer.apply(this, arguments);
}

Array1DTracer.prototype = $.extend(true, Object.create(Array2DTracer.prototype), {
    constructor: Array1DTracer,
    _notify: function _notify(idx, v) {
        Array2DTracer.prototype._notify.call(this, 0, idx, v);
        return this;
    },
    _denotify: function _denotify(idx) {
        Array2DTracer.prototype._denotify.call(this, 0, idx);
        return this;
    },
    _select: function _select(s, e) {
        if (e === undefined) {
            Array2DTracer.prototype._select.call(this, 0, s);
        } else {
            Array2DTracer.prototype._selectRow.call(this, 0, s, e);
        }
        return this;
    },
    _deselect: function _deselect(s, e) {
        if (e === undefined) {
            Array2DTracer.prototype._deselect.call(this, 0, s);
        } else {
            Array2DTracer.prototype._deselectRow.call(this, 0, s, e);
        }
        return this;
    },
    setData: function setData(D) {
        return Array2DTracer.prototype.setData.call(this, [D]);
    }
});

var Array1D = {
    random: function random(N, min, max) {
        return Array2D.random(1, N, min, max)[0];
    },
    randomSorted: function randomSorted(N, min, max) {
        return Array2D.randomSorted(1, N, min, max)[0];
    }
};

module.exports = {
    Array1D: Array1D,
    Array1DTracer: Array1DTracer
};

},{"./array2d":27}],27:[function(require,module,exports){
'use strict';

var Tracer = require('./tracer');

var _require = require('../tracer_manager/util');

var refineByType = _require.refineByType;


function Array2DTracer() {
    if (Tracer.apply(this, arguments)) {
        Array2DTracer.prototype.init.call(this);
        return true;
    }
    return false;
}

Array2DTracer.prototype = $.extend(true, Object.create(Tracer.prototype), {
    constructor: Array2DTracer,
    init: function init() {
        this.$table = this.capsule.$table = $('<div class="mtbl-table">');
        this.$container.append(this.$table);
    },
    _notify: function _notify(x, y, v) {
        this.manager.pushStep(this.capsule, {
            type: 'notify',
            x: x,
            y: y,
            v: v
        });
        return this;
    },
    _denotify: function _denotify(x, y) {
        this.manager.pushStep(this.capsule, {
            type: 'denotify',
            x: x,
            y: y
        });
        return this;
    },
    _select: function _select(sx, sy, ex, ey) {
        this.pushSelectingStep('select', null, arguments);
        return this;
    },
    _selectRow: function _selectRow(x, sy, ey) {
        this.pushSelectingStep('select', 'row', arguments);
        return this;
    },
    _selectCol: function _selectCol(y, sx, ex) {
        this.pushSelectingStep('select', 'col', arguments);
        return this;
    },
    _deselect: function _deselect(sx, sy, ex, ey) {
        this.pushSelectingStep('deselect', null, arguments);
        return this;
    },
    _deselectRow: function _deselectRow(x, sy, ey) {
        this.pushSelectingStep('deselect', 'row', arguments);
        return this;
    },
    _deselectCol: function _deselectCol(y, sx, ex) {
        this.pushSelectingStep('deselect', 'col', arguments);
        return this;
    },
    _separate: function _separate(x, y) {
        this.manager.pushStep(this.capsule, {
            type: 'separate',
            x: x,
            y: y
        });
        return this;
    },
    _separateRow: function _separateRow(x) {
        this._separate(x, -1);
        return this;
    },
    _separateCol: function _separateCol(y) {
        this._separate(-1, y);
        return this;
    },
    _deseparate: function _deseparate(x, y) {
        this.manager.pushStep(this.capsule, {
            type: 'deseparate',
            x: x,
            y: y
        });
        return this;
    },
    _deseparateRow: function _deseparateRow(x) {
        this._deseparate(x, -1);
        return this;
    },
    _deseparateCol: function _deseparateCol(y) {
        this._deseparate(-1, y);
        return this;
    },
    pushSelectingStep: function pushSelectingStep() {
        var args = Array.prototype.slice.call(arguments);
        var type = args.shift();
        var mode = args.shift();
        args = Array.prototype.slice.call(args.shift());
        var coord;
        switch (mode) {
            case 'row':
                coord = {
                    x: args[0],
                    sy: args[1],
                    ey: args[2]
                };
                break;
            case 'col':
                coord = {
                    y: args[0],
                    sx: args[1],
                    ex: args[2]
                };
                break;
            default:
                if (args[2] === undefined && args[3] === undefined) {
                    coord = {
                        x: args[0],
                        y: args[1]
                    };
                } else {
                    coord = {
                        sx: args[0],
                        sy: args[1],
                        ex: args[2],
                        ey: args[3]
                    };
                }
        }
        var step = {
            type: type
        };
        $.extend(step, coord);
        this.manager.pushStep(this.capsule, step);
    },
    processStep: function processStep(step, options) {
        switch (step.type) {
            case 'notify':
                if (step.v === 0 || step.v) {
                    var $row = this.$table.find('.mtbl-row').eq(step.x);
                    var $col = $row.find('.mtbl-col').eq(step.y);
                    $col.text(refineByType(step.v));
                }
            case 'denotify':
            case 'select':
            case 'deselect':
                var colorClass = step.type == 'select' || step.type == 'deselect' ? this.colorClass.selected : this.colorClass.notified;
                var addClass = step.type == 'select' || step.type == 'notify';
                var sx = step.sx;
                var sy = step.sy;
                var ex = step.ex;
                var ey = step.ey;
                if (sx === undefined) sx = step.x;
                if (sy === undefined) sy = step.y;
                if (ex === undefined) ex = step.x;
                if (ey === undefined) ey = step.y;
                this.paintColor(sx, sy, ex, ey, colorClass, addClass);
                break;
            case 'separate':
                this.deseparate(step.x, step.y);
                this.separate(step.x, step.y);
                break;
            case 'deseparate':
                this.deseparate(step.x, step.y);
                break;
            default:
                Tracer.prototype.processStep.call(this, step, options);
        }
    },
    setData: function setData(D) {
        this.viewX = this.viewY = 0;
        this.paddingH = 6;
        this.paddingV = 3;
        this.fontSize = 16;

        if (Tracer.prototype.setData.apply(this, arguments)) {
            this.$table.find('.mtbl-row').each(function (i) {
                $(this).find('.mtbl-col').each(function (j) {
                    $(this).text(refineByType(D[i][j]));
                });
            });
            return true;
        }

        this.$table.empty();
        for (var i = 0; i < D.length; i++) {
            var $row = $('<div class="mtbl-row">');
            this.$table.append($row);
            for (var j = 0; j < D[i].length; j++) {
                var $col = $('<div class="mtbl-col">').css(this.getCellCss()).text(refineByType(D[i][j]));
                $row.append($col);
            }
        }
        this.resize();

        return false;
    },
    resize: function resize() {
        Tracer.prototype.resize.call(this);

        this.refresh();
    },
    clear: function clear() {
        Tracer.prototype.clear.call(this);

        this.clearColor();
        this.deseparateAll();
    },
    getCellCss: function getCellCss() {
        return {
            padding: this.paddingV.toFixed(1) + 'px ' + this.paddingH.toFixed(1) + 'px',
            'font-size': this.fontSize.toFixed(1) + 'px'
        };
    },
    refresh: function refresh() {
        Tracer.prototype.refresh.call(this);

        var $parent = this.$table.parent();
        var top = $parent.height() / 2 - this.$table.height() / 2 + this.viewY;
        var left = $parent.width() / 2 - this.$table.width() / 2 + this.viewX;
        this.$table.css('margin-top', top);
        this.$table.css('margin-left', left);
    },
    mousedown: function mousedown(e) {
        Tracer.prototype.mousedown.call(this, e);

        this.dragX = e.pageX;
        this.dragY = e.pageY;
        this.dragging = true;
    },
    mousemove: function mousemove(e) {
        Tracer.prototype.mousemove.call(this, e);

        if (this.dragging) {
            this.viewX += e.pageX - this.dragX;
            this.viewY += e.pageY - this.dragY;
            this.dragX = e.pageX;
            this.dragY = e.pageY;
            this.refresh();
        }
    },
    mouseup: function mouseup(e) {
        Tracer.prototype.mouseup.call(this, e);

        this.dragging = false;
    },
    mousewheel: function mousewheel(e) {
        Tracer.prototype.mousewheel.call(this, e);

        e.preventDefault();
        e = e.originalEvent;
        var delta = e.wheelDelta !== undefined && e.wheelDelta || e.detail !== undefined && -e.detail;
        var weight = 1.01;
        var ratio = delta > 0 ? 1 / weight : weight;
        if (this.fontSize < 4 && ratio < 1) return;
        if (this.fontSize > 40 && ratio > 1) return;
        this.paddingV *= ratio;
        this.paddingH *= ratio;
        this.fontSize *= ratio;
        this.$table.find('.mtbl-col').css(this.getCellCss());
        this.refresh();
    },
    paintColor: function paintColor(sx, sy, ex, ey, colorClass, addClass) {
        for (var i = sx; i <= ex; i++) {
            var $row = this.$table.find('.mtbl-row').eq(i);
            for (var j = sy; j <= ey; j++) {
                var $col = $row.find('.mtbl-col').eq(j);
                if (addClass) $col.addClass(colorClass);else $col.removeClass(colorClass);
            }
        }
    },
    clearColor: function clearColor() {
        this.$table.find('.mtbl-col').removeClass(Object.keys(this.colorClass).join(' '));
    },
    colorClass: {
        selected: 'selected',
        notified: 'notified'
    },
    separate: function separate(x, y) {
        this.$table.find('.mtbl-row').each(function (i) {
            var $row = $(this);
            if (i == x) {
                $row.after($('<div class="mtbl-empty-row">').attr('data-row', i));
            }
            $row.find('.mtbl-col').each(function (j) {
                var $col = $(this);
                if (j == y) {
                    $col.after($('<div class="mtbl-empty-col">').attr('data-col', j));
                }
            });
        });
    },
    deseparate: function deseparate(x, y) {
        this.$table.find('[data-row=' + x + ']').remove();
        this.$table.find('[data-col=' + y + ']').remove();
    },
    deseparateAll: function deseparateAll() {
        this.$table.find('.mtbl-empty-row, .mtbl-empty-col').remove();
    }
});

var Array2D = {
    random: function random(N, M, min, max) {
        if (!N) N = 10;
        if (!M) M = 10;
        if (min === undefined) min = 1;
        if (max === undefined) max = 9;
        var D = [];
        for (var i = 0; i < N; i++) {
            D.push([]);
            for (var j = 0; j < M; j++) {
                D[i].push((Math.random() * (max - min + 1) | 0) + min);
            }
        }
        return D;
    },
    randomSorted: function randomSorted(N, M, min, max) {
        return this.random(N, M, min, max).map(function (arr) {
            return arr.sort(function (a, b) {
                return a - b;
            });
        });
    }
};

module.exports = {
    Array2D: Array2D,
    Array2DTracer: Array2DTracer
};

},{"../tracer_manager/util":50,"./tracer":32}],28:[function(require,module,exports){
'use strict';

var Tracer = require('./tracer');

function ChartTracer() {
    if (Tracer.apply(this, arguments)) {
        ChartTracer.prototype.init.call(this, arguments);
        return true;
    }
    return false;
}

ChartTracer.prototype = $.extend(true, Object.create(Tracer.prototype), {
    constructor: ChartTracer,
    init: function init() {
        this.$wrapper = this.capsule.$wrapper = $('<canvas id="chart">');
        this.$container.append(this.$wrapper);
    },
    setData: function setData(C) {
        if (Tracer.prototype.setData.apply(this, arguments)) return true;
        var tracer = this;
        var color = [];
        for (var i = 0; i < C.length; i++) {
            color.push('rgba(136, 136, 136, 1)');
        }var data = {
            type: 'bar',
            data: {
                labels: C.map(String),
                datasets: [{
                    backgroundColor: color,
                    data: C
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        };
        this.chart = this.capsule.chart = new Chart(this.$wrapper, data);
    },
    _notify: function _notify(s, v) {
        this.manager.pushStep(this.capsule, {
            type: 'notify',
            s: s,
            v: v
        });
        return this;
    },
    _denotify: function _denotify(s) {
        this.manager.pushStep(this.capsule, {
            type: 'denotify',
            s: s
        });
        return this;
    },
    _select: function _select(s, e) {
        this.manager.pushStep(this.capsule, {
            type: 'select',
            s: s,
            e: e
        });
        return this;
    },
    _deselect: function _deselect(s, e) {
        this.manager.pushStep(this.capsule, {
            type: 'deselect',
            s: s,
            e: e
        });
        return this;
    },
    processStep: function processStep(step, options) {
        switch (step.type) {
            case 'notify':
                if (step.v) {
                    this.chart.config.data.datasets[0].data[step.s] = step.v;
                    this.chart.config.data.labels[step.s] = step.v.toString();
                }
            case 'denotify':
            case 'deselect':
                var color = step.type == 'denotify' || step.type == 'deselect' ? 'rgba(136, 136, 136, 1)' : 'rgba(255, 0, 0, 1)';
            case 'select':
                if (color === undefined) var color = 'rgba(0, 0, 255, 1)';
                if (step.e !== undefined) for (var i = step.s; i <= step.e; i++) {
                    this.chart.config.data.datasets[0].backgroundColor[i] = color;
                } else this.chart.config.data.datasets[0].backgroundColor[step.s] = color;
                this.chart.update();
                break;
            default:
                Tracer.prototype.processStep.call(this, step, options);
        }
    }
});

module.exports = ChartTracer;

},{"./tracer":32}],29:[function(require,module,exports){
'use strict';

var Tracer = require('./tracer');

function DirectedGraphTracer() {
    if (Tracer.apply(this, arguments)) {
        DirectedGraphTracer.prototype.init.call(this);
        return true;
    }
    return false;
}

DirectedGraphTracer.prototype = $.extend(true, Object.create(Tracer.prototype), {
    constructor: DirectedGraphTracer,
    init: function init() {
        var tracer = this;

        this.s = this.capsule.s = new sigma({
            renderer: {
                container: this.$container[0],
                type: 'canvas'
            },
            settings: {
                minArrowSize: 8,
                defaultEdgeType: 'arrow',
                maxEdgeSize: 2.5,
                labelThreshold: 4,
                font: 'Roboto',
                defaultLabelColor: '#fff',
                zoomMin: 0.6,
                zoomMax: 1.2,
                skipErrors: true,
                minNodeSize: .5,
                maxNodeSize: 12,
                labelSize: 'proportional',
                labelSizeRatio: 1.3,
                funcLabelsDef: function funcLabelsDef(node, context, settings) {
                    tracer.drawLabel(node, context, settings);
                },
                funcHoversDef: function funcHoversDef(node, context, settings, next) {
                    tracer.drawOnHover(node, context, settings, next);
                },
                funcEdgesArrow: function funcEdgesArrow(edge, source, target, context, settings) {
                    var color = tracer.getColor(edge, source, target, settings);
                    tracer.drawArrow(edge, source, target, color, context, settings);
                }
            }
        });
        sigma.plugins.dragNodes(this.s, this.s.renderers[0]);
        this.graph = this.capsule.graph = this.s.graph;
    },
    _setTreeData: function _setTreeData(G, root) {
        this.manager.pushStep(this.capsule, {
            type: 'setTreeData',
            arguments: arguments
        });
        return this;
    },
    _visit: function _visit(target, source) {
        this.manager.pushStep(this.capsule, {
            type: 'visit',
            target: target,
            source: source
        });
        return this;
    },
    _leave: function _leave(target, source) {
        this.manager.pushStep(this.capsule, {
            type: 'leave',
            target: target,
            source: source
        });
        return this;
    },
    processStep: function processStep(step, options) {
        switch (step.type) {
            case 'setTreeData':
                this.setTreeData.apply(this, step.arguments);
                break;
            case 'visit':
            case 'leave':
                var visit = step.type == 'visit';
                var targetNode = this.graph.nodes(this.n(step.target));
                var color = visit ? this.color.visited : this.color.left;
                targetNode.color = color;
                if (step.source !== undefined) {
                    var edgeId = this.e(step.source, step.target);
                    var edge = this.graph.edges(edgeId);
                    edge.color = color;
                    this.graph.dropEdge(edgeId).addEdge(edge);
                }
                if (this.logTracer) {
                    var source = step.source;
                    if (source === undefined) source = '';
                    this.logTracer.print(visit ? source + ' -> ' + step.target : source + ' <- ' + step.target);
                }
                break;
            default:
                Tracer.prototype.processStep.call(this, step, options);
        }
    },
    setTreeData: function setTreeData(G, root) {
        var tracer = this;

        root = root || 0;
        var maxDepth = -1;

        var chk = new Array(G.length);
        var getDepth = function getDepth(node, depth) {
            if (chk[node]) throw "the given graph is not a tree because it forms a circuit";
            chk[node] = true;
            if (maxDepth < depth) maxDepth = depth;
            for (var i = 0; i < G[node].length; i++) {
                if (G[node][i]) getDepth(i, depth + 1);
            }
        };
        getDepth(root, 1);

        if (this.setData.apply(this, arguments)) return true;

        var place = function place(node, x, y) {
            var temp = tracer.graph.nodes(tracer.n(node));
            temp.x = x;
            temp.y = y;
        };

        var wgap = 1 / (maxDepth - 1);
        var dfs = function dfs(node, depth, top, bottom) {
            place(node, top + bottom, depth * wgap);
            var children = 0;
            for (var i = 0; i < G[node].length; i++) {
                if (G[node][i]) children++;
            }
            var vgap = (bottom - top) / children;
            var cnt = 0;
            for (var i = 0; i < G[node].length; i++) {
                if (G[node][i]) dfs(i, depth + 1, top + vgap * cnt, top + vgap * ++cnt);
            }
        };
        dfs(root, 0, 0, 1);

        this.refresh();
    },
    setData: function setData(G) {
        if (Tracer.prototype.setData.apply(this, arguments)) return true;

        this.graph.clear();
        var nodes = [];
        var edges = [];
        var unitAngle = 2 * Math.PI / G.length;
        var currentAngle = 0;
        for (var i = 0; i < G.length; i++) {
            currentAngle += unitAngle;
            nodes.push({
                id: this.n(i),
                label: '' + i,
                x: .5 + Math.sin(currentAngle) / 2,
                y: .5 + Math.cos(currentAngle) / 2,
                size: 1,
                color: this.color.default
            });
            for (var j = 0; j < G[i].length; j++) {
                if (G[i][j]) {
                    edges.push({
                        id: this.e(i, j),
                        source: this.n(i),
                        target: this.n(j),
                        color: this.color.default,
                        size: 1
                    });
                }
            }
        }

        this.graph.read({
            nodes: nodes,
            edges: edges
        });
        this.s.camera.goTo({
            x: 0,
            y: 0,
            angle: 0,
            ratio: 1
        });
        this.refresh();

        return false;
    },
    resize: function resize() {
        Tracer.prototype.resize.call(this);

        this.s.renderers[0].resize();
        this.refresh();
    },
    refresh: function refresh() {
        Tracer.prototype.refresh.call(this);

        this.s.refresh();
    },
    clear: function clear() {
        Tracer.prototype.clear.call(this);

        this.clearGraphColor();
    },
    color: {
        visited: '#f00',
        left: '#000',
        default: '#888'
    },
    clearGraphColor: function clearGraphColor() {
        var tracer = this;

        this.graph.nodes().forEach(function (node) {
            node.color = tracer.color.default;
        });
        this.graph.edges().forEach(function (edge) {
            edge.color = tracer.color.default;
        });
    },
    n: function n(v) {
        return 'n' + v;
    },
    e: function e(v1, v2) {
        return 'e' + v1 + '_' + v2;
    },
    getColor: function getColor(edge, source, target, settings) {
        var color = edge.color,
            edgeColor = settings('edgeColor'),
            defaultNodeColor = settings('defaultNodeColor'),
            defaultEdgeColor = settings('defaultEdgeColor');
        if (!color) switch (edgeColor) {
            case 'source':
                color = source.color || defaultNodeColor;
                break;
            case 'target':
                color = target.color || defaultNodeColor;
                break;
            default:
                color = defaultEdgeColor;
                break;
        }

        return color;
    },
    drawLabel: function drawLabel(node, context, settings) {
        var fontSize,
            prefix = settings('prefix') || '',
            size = node[prefix + 'size'];

        if (size < settings('labelThreshold')) return;

        if (!node.label || typeof node.label !== 'string') return;

        fontSize = settings('labelSize') === 'fixed' ? settings('defaultLabelSize') : settings('labelSizeRatio') * size;

        context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') + fontSize + 'px ' + settings('font');
        context.fillStyle = settings('labelColor') === 'node' ? node.color || settings('defaultNodeColor') : settings('defaultLabelColor');

        context.textAlign = 'center';
        context.fillText(node.label, Math.round(node[prefix + 'x']), Math.round(node[prefix + 'y'] + fontSize / 3));
    },
    drawArrow: function drawArrow(edge, source, target, color, context, settings) {
        var prefix = settings('prefix') || '',
            size = edge[prefix + 'size'] || 1,
            tSize = target[prefix + 'size'],
            sX = source[prefix + 'x'],
            sY = source[prefix + 'y'],
            tX = target[prefix + 'x'],
            tY = target[prefix + 'y'],
            angle = Math.atan2(tY - sY, tX - sX),
            dist = 3;
        sX += Math.sin(angle) * dist;
        tX += Math.sin(angle) * dist;
        sY += -Math.cos(angle) * dist;
        tY += -Math.cos(angle) * dist;
        var aSize = Math.max(size * 2.5, settings('minArrowSize')),
            d = Math.sqrt(Math.pow(tX - sX, 2) + Math.pow(tY - sY, 2)),
            aX = sX + (tX - sX) * (d - aSize - tSize) / d,
            aY = sY + (tY - sY) * (d - aSize - tSize) / d,
            vX = (tX - sX) * aSize / d,
            vY = (tY - sY) * aSize / d;

        context.strokeStyle = color;
        context.lineWidth = size;
        context.beginPath();
        context.moveTo(sX, sY);
        context.lineTo(aX, aY);
        context.stroke();

        context.fillStyle = color;
        context.beginPath();
        context.moveTo(aX + vX, aY + vY);
        context.lineTo(aX + vY * 0.6, aY - vX * 0.6);
        context.lineTo(aX - vY * 0.6, aY + vX * 0.6);
        context.lineTo(aX + vX, aY + vY);
        context.closePath();
        context.fill();
    },
    drawOnHover: function drawOnHover(node, context, settings, next) {
        var tracer = this;

        context.setLineDash([5, 5]);
        var nodeIdx = node.id.substring(1);
        this.graph.edges().forEach(function (edge) {
            var ends = edge.id.substring(1).split("_");
            if (ends[0] == nodeIdx) {
                var color = '#0ff';
                var source = node;
                var target = tracer.graph.nodes('n' + ends[1]);
                tracer.drawArrow(edge, source, target, color, context, settings);
                if (next) next(edge, source, target, color, context, settings);
            } else if (ends[1] == nodeIdx) {
                var color = '#ff0';
                var source = tracer.graph.nodes('n' + ends[0]);
                var target = node;
                tracer.drawArrow(edge, source, target, color, context, settings);
                if (next) next(edge, source, target, color, context, settings);
            }
        });
    }
});

var DirectedGraph = {
    random: function random(N, ratio) {
        if (!N) N = 5;
        if (!ratio) ratio = .3;
        var G = new Array(N);
        for (var i = 0; i < N; i++) {
            G[i] = new Array(N);
            for (var j = 0; j < N; j++) {
                if (i != j) {
                    G[i][j] = (Math.random() * (1 / ratio) | 0) == 0 ? 1 : 0;
                }
            }
        }
        return G;
    }
};

sigma.canvas.labels.def = function (node, context, settings) {
    var func = settings('funcLabelsDef');
    if (func) {
        func(node, context, settings);
    }
};
sigma.canvas.hovers.def = function (node, context, settings) {
    var func = settings('funcHoversDef');
    if (func) {
        func(node, context, settings);
    }
};
sigma.canvas.edges.def = function (edge, source, target, context, settings) {
    var func = settings('funcEdgesDef');
    if (func) {
        func(edge, source, target, context, settings);
    }
};
sigma.canvas.edges.arrow = function (edge, source, target, context, settings) {
    var func = settings('funcEdgesArrow');
    if (func) {
        func(edge, source, target, context, settings);
    }
};

module.exports = {
    DirectedGraph: DirectedGraph,
    DirectedGraphTracer: DirectedGraphTracer
};

},{"./tracer":32}],30:[function(require,module,exports){
'use strict';

var Tracer = require('./tracer');

var LogTracer = require('./log_tracer');

var _require = require('./array1d');

var Array1D = _require.Array1D;
var Array1DTracer = _require.Array1DTracer;

var _require2 = require('./array2d');

var Array2D = _require2.Array2D;
var Array2DTracer = _require2.Array2DTracer;


var ChartTracer = require('./chart');

var _require3 = require('./directed_graph');

var DirectedGraph = _require3.DirectedGraph;
var DirectedGraphTracer = _require3.DirectedGraphTracer;

var _require4 = require('./undirected_graph');

var UndirectedGraph = _require4.UndirectedGraph;
var UndirectedGraphTracer = _require4.UndirectedGraphTracer;

var _require5 = require('./weighted_directed_graph');

var WeightedDirectedGraph = _require5.WeightedDirectedGraph;
var WeightedDirectedGraphTracer = _require5.WeightedDirectedGraphTracer;

var _require6 = require('./weighted_undirected_graph');

var WeightedUndirectedGraph = _require6.WeightedUndirectedGraph;
var WeightedUndirectedGraphTracer = _require6.WeightedUndirectedGraphTracer;


module.exports = {
  Tracer: Tracer,
  LogTracer: LogTracer,
  Array1D: Array1D,
  Array1DTracer: Array1DTracer,
  Array2D: Array2D,
  Array2DTracer: Array2DTracer,
  ChartTracer: ChartTracer,
  DirectedGraph: DirectedGraph,
  DirectedGraphTracer: DirectedGraphTracer,
  UndirectedGraph: UndirectedGraph,
  UndirectedGraphTracer: UndirectedGraphTracer,
  WeightedDirectedGraph: WeightedDirectedGraph,
  WeightedDirectedGraphTracer: WeightedDirectedGraphTracer,
  WeightedUndirectedGraph: WeightedUndirectedGraph,
  WeightedUndirectedGraphTracer: WeightedUndirectedGraphTracer
};

},{"./array1d":26,"./array2d":27,"./chart":28,"./directed_graph":29,"./log_tracer":31,"./tracer":32,"./undirected_graph":33,"./weighted_directed_graph":34,"./weighted_undirected_graph":35}],31:[function(require,module,exports){
'use strict';

var Tracer = require('./tracer');

function LogTracer() {
    if (Tracer.apply(this, arguments)) {
        LogTracer.prototype.init.call(this);
        return true;
    }
    return false;
}

LogTracer.prototype = $.extend(true, Object.create(Tracer.prototype), {
    constructor: LogTracer,
    init: function init() {
        this.$wrapper = this.capsule.$wrapper = $('<div class="wrapper">');
        this.$container.append(this.$wrapper);
    },
    _print: function _print(msg) {
        this.manager.pushStep(this.capsule, {
            type: 'print',
            msg: msg
        });
        return this;
    },
    processStep: function processStep(step, options) {
        switch (step.type) {
            case 'print':
                this.print(step.msg);
                break;
        }
    },
    refresh: function refresh() {
        this.scrollToEnd(Math.min(50, this.interval));
    },
    clear: function clear() {
        Tracer.prototype.clear.call(this);

        this.$wrapper.empty();
    },
    print: function print(message) {
        this.$wrapper.append($('<span>').append(message + '<br/>'));
    },
    scrollToEnd: function scrollToEnd(duration) {
        this.$container.animate({
            scrollTop: this.$container[0].scrollHeight
        }, duration);
    }
});

module.exports = LogTracer;

},{"./tracer":32}],32:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('../tracer_manager/util');

var toJSON = _require.toJSON;
var fromJSON = _require.fromJSON;


function Tracer(name) {
    this.module = this.constructor;
    this.capsule = this.manager.allocate(this);
    $.extend(this, this.capsule);
    this.setName(name);
    return this.isNew;
}

Tracer.prototype = {

    constructor: Tracer,
    manager: null,

    _setData: function _setData() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        this.manager.pushStep(this.capsule, {
            type: 'setData',
            args: toJSON(args)
        });
        return this;
    },
    _clear: function _clear() {
        this.manager.pushStep(this.capsule, {
            type: 'clear'
        });
        return this;
    },
    _wait: function _wait() {
        this.manager.newStep();
        return this;
    },
    processStep: function processStep(step, options) {
        var type = step.type;
        var args = step.args;


        switch (type) {
            case 'setData':
                this.setData.apply(this, _toConsumableArray(fromJSON(args)));
                break;
            case 'clear':
                this.clear();
                break;
        }
    },
    setName: function setName(name) {
        var $name = void 0;
        if (this.isNew) {
            $name = $('<span class="name">');
            this.$container.append($name);
        } else {
            $name = this.$container.find('span.name');
        }
        $name.text(name || this.defaultName);
    },
    setData: function setData() {
        var data = toJSON(arguments);
        if (!this.isNew && this.lastData === data) {
            return true;
        }
        this.isNew = this.capsule.isNew = false;
        this.lastData = this.capsule.lastData = data;
        return false;
    },
    resize: function resize() {},
    refresh: function refresh() {},
    clear: function clear() {},
    attach: function attach(tracer) {
        if (tracer.module === LogTracer) {
            this.logTracer = tracer;
        }
        return this;
    },
    mousedown: function mousedown(e) {},
    mousemove: function mousemove(e) {},
    mouseup: function mouseup(e) {},
    mousewheel: function mousewheel(e) {}
};

module.exports = Tracer;

},{"../tracer_manager/util":50}],33:[function(require,module,exports){
'use strict';

var _require = require('./directed_graph');

var DirectedGraph = _require.DirectedGraph;
var DirectedGraphTracer = _require.DirectedGraphTracer;


function UndirectedGraphTracer() {
    if (DirectedGraphTracer.apply(this, arguments)) {
        UndirectedGraphTracer.prototype.init.call(this);
        return true;
    }
    return false;
}

UndirectedGraphTracer.prototype = $.extend(true, Object.create(DirectedGraphTracer.prototype), {
    constructor: UndirectedGraphTracer,
    init: function init() {
        var tracer = this;

        this.s.settings({
            defaultEdgeType: 'def',
            funcEdgesDef: function funcEdgesDef(edge, source, target, context, settings) {
                var color = tracer.getColor(edge, source, target, settings);
                tracer.drawEdge(edge, source, target, color, context, settings);
            }
        });
    },
    setData: function setData(G) {
        if (Tracer.prototype.setData.apply(this, arguments)) return true;

        this.graph.clear();
        var nodes = [];
        var edges = [];
        var unitAngle = 2 * Math.PI / G.length;
        var currentAngle = 0;
        for (var i = 0; i < G.length; i++) {
            currentAngle += unitAngle;
            nodes.push({
                id: this.n(i),
                label: '' + i,
                x: .5 + Math.sin(currentAngle) / 2,
                y: .5 + Math.cos(currentAngle) / 2,
                size: 1,
                color: this.color.default
            });
        }
        for (var i = 0; i < G.length; i++) {
            for (var j = 0; j <= i; j++) {
                if (G[i][j] || G[j][i]) {
                    edges.push({
                        id: this.e(i, j),
                        source: this.n(i),
                        target: this.n(j),
                        color: this.color.default,
                        size: 1
                    });
                }
            }
        }

        this.graph.read({
            nodes: nodes,
            edges: edges
        });
        this.s.camera.goTo({
            x: 0,
            y: 0,
            angle: 0,
            ratio: 1
        });
        this.refresh();

        return false;
    },
    e: function e(v1, v2) {
        if (v1 > v2) {
            var temp = v1;
            v1 = v2;
            v2 = temp;
        }
        return 'e' + v1 + '_' + v2;
    },
    drawOnHover: function drawOnHover(node, context, settings, next) {
        var tracer = this;

        context.setLineDash([5, 5]);
        var nodeIdx = node.id.substring(1);
        this.graph.edges().forEach(function (edge) {
            var ends = edge.id.substring(1).split("_");
            if (ends[0] == nodeIdx) {
                var color = '#0ff';
                var source = node;
                var target = tracer.graph.nodes('n' + ends[1]);
                tracer.drawEdge(edge, source, target, color, context, settings);
                if (next) next(edge, source, target, color, context, settings);
            } else if (ends[1] == nodeIdx) {
                var color = '#0ff';
                var source = tracer.graph.nodes('n' + ends[0]);
                var target = node;
                tracer.drawEdge(edge, source, target, color, context, settings);
                if (next) next(edge, source, target, color, context, settings);
            }
        });
    },
    drawEdge: function drawEdge(edge, source, target, color, context, settings) {
        var prefix = settings('prefix') || '',
            size = edge[prefix + 'size'] || 1;

        context.strokeStyle = color;
        context.lineWidth = size;
        context.beginPath();
        context.moveTo(source[prefix + 'x'], source[prefix + 'y']);
        context.lineTo(target[prefix + 'x'], target[prefix + 'y']);
        context.stroke();
    }
});

var UndirectedGraph = {
    random: function random(N, ratio) {
        if (!N) N = 5;
        if (!ratio) ratio = .3;
        var G = new Array(N);
        for (var i = 0; i < N; i++) {
            G[i] = new Array(N);
        }for (var i = 0; i < N; i++) {
            for (var j = 0; j < N; j++) {
                if (i > j) {
                    G[i][j] = G[j][i] = (Math.random() * (1 / ratio) | 0) == 0 ? 1 : 0;
                }
            }
        }
        return G;
    }
};

module.exports = {
    UndirectedGraph: UndirectedGraph,
    UndirectedGraphTracer: UndirectedGraphTracer
};

},{"./directed_graph":29}],34:[function(require,module,exports){
'use strict';

var _require = require('./directed_graph');

var DirectedGraph = _require.DirectedGraph;
var DirectedGraphTracer = _require.DirectedGraphTracer;

var _require2 = require('../tracer_manager/util');

var refineByType = _require2.refineByType;


function WeightedDirectedGraphTracer() {
    if (DirectedGraphTracer.apply(this, arguments)) {
        WeightedDirectedGraphTracer.prototype.init.call(this);
        return true;
    }
    return false;
}

WeightedDirectedGraphTracer.prototype = $.extend(true, Object.create(DirectedGraphTracer.prototype), {
    constructor: WeightedDirectedGraphTracer,
    init: function init() {
        var tracer = this;

        this.s.settings({
            edgeLabelSize: 'proportional',
            defaultEdgeLabelSize: 20,
            edgeLabelSizePowRatio: 0.8,
            funcLabelsDef: function funcLabelsDef(node, context, settings) {
                tracer.drawNodeWeight(node, context, settings);
                tracer.drawLabel(node, context, settings);
            },
            funcHoversDef: function funcHoversDef(node, context, settings) {
                tracer.drawOnHover(node, context, settings, tracer.drawEdgeWeight);
            },
            funcEdgesArrow: function funcEdgesArrow(edge, source, target, context, settings) {
                var color = tracer.getColor(edge, source, target, settings);
                tracer.drawArrow(edge, source, target, color, context, settings);
                tracer.drawEdgeWeight(edge, source, target, color, context, settings);
            }
        });
    },
    _weight: function _weight(target, weight) {
        this.manager.pushStep(this.capsule, {
            type: 'weight',
            target: target,
            weight: weight
        });
        return this;
    },
    _visit: function _visit(target, source, weight) {
        this.manager.pushStep(this.capsule, {
            type: 'visit',
            target: target,
            source: source,
            weight: weight
        });
        return this;
    },
    _leave: function _leave(target, source, weight) {
        this.manager.pushStep(this.capsule, {
            type: 'leave',
            target: target,
            source: source,
            weight: weight
        });
        return this;
    },
    processStep: function processStep(step, options) {
        switch (step.type) {
            case 'weight':
                var targetNode = this.graph.nodes(this.n(step.target));
                if (step.weight !== undefined) targetNode.weight = refineByType(step.weight);
                break;
            case 'visit':
            case 'leave':
                var visit = step.type == 'visit';
                var targetNode = this.graph.nodes(this.n(step.target));
                var color = visit ? this.color.visited : this.color.left;
                targetNode.color = color;
                if (step.weight !== undefined) targetNode.weight = refineByType(step.weight);
                if (step.source !== undefined) {
                    var edgeId = this.e(step.source, step.target);
                    var edge = this.graph.edges(edgeId);
                    edge.color = color;
                    this.graph.dropEdge(edgeId).addEdge(edge);
                }
                if (this.logTracer) {
                    var source = step.source;
                    if (source === undefined) source = '';
                    this.logTracer.print(visit ? source + ' -> ' + step.target : source + ' <- ' + step.target);
                }
                break;
            default:
                DirectedGraphTracer.prototype.processStep.call(this, step, options);
        }
    },
    setData: function setData(G) {
        if (Tracer.prototype.setData.apply(this, arguments)) return true;

        this.graph.clear();
        var nodes = [];
        var edges = [];
        var unitAngle = 2 * Math.PI / G.length;
        var currentAngle = 0;
        for (var i = 0; i < G.length; i++) {
            currentAngle += unitAngle;
            nodes.push({
                id: this.n(i),
                label: '' + i,
                x: .5 + Math.sin(currentAngle) / 2,
                y: .5 + Math.cos(currentAngle) / 2,
                size: 1,
                color: this.color.default,
                weight: 0
            });
            for (var j = 0; j < G[i].length; j++) {
                if (G[i][j]) {
                    edges.push({
                        id: this.e(i, j),
                        source: this.n(i),
                        target: this.n(j),
                        color: this.color.default,
                        size: 1,
                        weight: refineByType(G[i][j])
                    });
                }
            }
        }

        this.graph.read({
            nodes: nodes,
            edges: edges
        });
        this.s.camera.goTo({
            x: 0,
            y: 0,
            angle: 0,
            ratio: 1
        });
        this.refresh();

        return false;
    },
    clear: function clear() {
        DirectedGraphTracer.prototype.clear.call(this);

        this.clearWeights();
    },
    clearWeights: function clearWeights() {
        this.graph.nodes().forEach(function (node) {
            node.weight = 0;
        });
    },
    drawEdgeWeight: function drawEdgeWeight(edge, source, target, color, context, settings) {
        if (source == target) return;

        var prefix = settings('prefix') || '',
            size = edge[prefix + 'size'] || 1;

        if (size < settings('edgeLabelThreshold')) return;

        if (0 === settings('edgeLabelSizePowRatio')) throw '"edgeLabelSizePowRatio" must not be 0.';

        var fontSize,
            x = (source[prefix + 'x'] + target[prefix + 'x']) / 2,
            y = (source[prefix + 'y'] + target[prefix + 'y']) / 2,
            dX = target[prefix + 'x'] - source[prefix + 'x'],
            dY = target[prefix + 'y'] - source[prefix + 'y'],
            angle = Math.atan2(dY, dX);

        fontSize = settings('edgeLabelSize') === 'fixed' ? settings('defaultEdgeLabelSize') : settings('defaultEdgeLabelSize') * size * Math.pow(size, -1 / settings('edgeLabelSizePowRatio'));

        context.save();

        if (edge.active) {
            context.font = [settings('activeFontStyle'), fontSize + 'px', settings('activeFont') || settings('font')].join(' ');

            context.fillStyle = color;
        } else {
            context.font = [settings('fontStyle'), fontSize + 'px', settings('font')].join(' ');

            context.fillStyle = color;
        }

        context.textAlign = 'center';
        context.textBaseline = 'alphabetic';

        context.translate(x, y);
        context.rotate(angle);
        context.fillText(edge.weight, 0, -size / 2 - 3);

        context.restore();
    },
    drawNodeWeight: function drawNodeWeight(node, context, settings) {
        var fontSize,
            prefix = settings('prefix') || '',
            size = node[prefix + 'size'];

        if (size < settings('labelThreshold')) return;

        fontSize = settings('labelSize') === 'fixed' ? settings('defaultLabelSize') : settings('labelSizeRatio') * size;

        context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') + fontSize + 'px ' + settings('font');
        context.fillStyle = settings('labelColor') === 'node' ? node.color || settings('defaultNodeColor') : settings('defaultLabelColor');

        context.textAlign = 'left';
        context.fillText(node.weight, Math.round(node[prefix + 'x'] + size * 1.5), Math.round(node[prefix + 'y'] + fontSize / 3));
    }
});

var WeightedDirectedGraph = {
    random: function random(N, ratio, min, max) {
        if (!N) N = 5;
        if (!ratio) ratio = .3;
        if (!min) min = 1;
        if (!max) max = 5;
        var G = new Array(N);
        for (var i = 0; i < N; i++) {
            G[i] = new Array(N);
            for (var j = 0; j < N; j++) {
                if (i != j && (Math.random() * (1 / ratio) | 0) == 0) {
                    G[i][j] = (Math.random() * (max - min + 1) | 0) + min;
                }
            }
        }
        return G;
    }
};

module.exports = {
    WeightedDirectedGraph: WeightedDirectedGraph,
    WeightedDirectedGraphTracer: WeightedDirectedGraphTracer
};

},{"../tracer_manager/util":50,"./directed_graph":29}],35:[function(require,module,exports){
'use strict';

var _require = require('./weighted_directed_graph');

var WeightedDirectedGraph = _require.WeightedDirectedGraph;
var WeightedDirectedGraphTracer = _require.WeightedDirectedGraphTracer;

var _require2 = require('./undirected_graph');

var UndirectedGraphTracer = _require2.UndirectedGraphTracer;


function WeightedUndirectedGraphTracer() {
    if (WeightedDirectedGraphTracer.apply(this, arguments)) {
        WeightedUndirectedGraphTracer.prototype.init.call(this);
        return true;
    }
    return false;
}

WeightedUndirectedGraphTracer.prototype = $.extend(true, Object.create(WeightedDirectedGraphTracer.prototype), {
    constructor: WeightedUndirectedGraphTracer,
    init: function init() {
        var tracer = this;

        this.s.settings({
            defaultEdgeType: 'def',
            funcEdgesDef: function funcEdgesDef(edge, source, target, context, settings) {
                var color = tracer.getColor(edge, source, target, settings);
                tracer.drawEdge(edge, source, target, color, context, settings);
                tracer.drawEdgeWeight(edge, source, target, color, context, settings);
            }
        });
    },
    setData: function setData(G) {
        if (Tracer.prototype.setData.apply(this, arguments)) return true;

        this.graph.clear();
        var nodes = [];
        var edges = [];
        var unitAngle = 2 * Math.PI / G.length;
        var currentAngle = 0;
        for (var i = 0; i < G.length; i++) {
            currentAngle += unitAngle;
            nodes.push({
                id: this.n(i),
                label: '' + i,
                x: .5 + Math.sin(currentAngle) / 2,
                y: .5 + Math.cos(currentAngle) / 2,
                size: 1,
                color: this.color.default,
                weight: 0
            });
        }
        for (var i = 0; i < G.length; i++) {
            for (var j = 0; j <= i; j++) {
                if (G[i][j] || G[j][i]) {
                    edges.push({
                        id: this.e(i, j),
                        source: this.n(i),
                        target: this.n(j),
                        color: this.color.default,
                        size: 1,
                        weight: G[i][j]
                    });
                }
            }
        }

        this.graph.read({
            nodes: nodes,
            edges: edges
        });
        this.s.camera.goTo({
            x: 0,
            y: 0,
            angle: 0,
            ratio: 1
        });
        this.refresh();

        return false;
    },
    e: UndirectedGraphTracer.prototype.e,
    drawOnHover: UndirectedGraphTracer.prototype.drawOnHover,
    drawEdge: UndirectedGraphTracer.prototype.drawEdge,
    drawEdgeWeight: function drawEdgeWeight(edge, source, target, color, context, settings) {
        var prefix = settings('prefix') || '';
        if (source[prefix + 'x'] > target[prefix + 'x']) {
            var temp = source;
            source = target;
            target = temp;
        }
        WeightedDirectedGraphTracer.prototype.drawEdgeWeight.call(this, edge, source, target, color, context, settings);
    }
});

var WeightedUndirectedGraph = {
    random: function random(N, ratio, min, max) {
        if (!N) N = 5;
        if (!ratio) ratio = .3;
        if (!min) min = 1;
        if (!max) max = 5;
        var G = new Array(N);
        for (var i = 0; i < N; i++) {
            G[i] = new Array(N);
        }for (var i = 0; i < N; i++) {
            for (var j = 0; j < N; j++) {
                if (i > j && (Math.random() * (1 / ratio) | 0) == 0) {
                    G[i][j] = G[j][i] = (Math.random() * (max - min + 1) | 0) + min;
                }
            }
        }
        return G;
    }
};

module.exports = {
    WeightedUndirectedGraph: WeightedUndirectedGraph,
    WeightedUndirectedGraphTracer: WeightedUndirectedGraphTracer
};

},{"./undirected_graph":33,"./weighted_directed_graph":34}],36:[function(require,module,exports){
'use strict';

var request = require('./request');

module.exports = function (url) {

  return request(url, {
    type: 'GET'
  });
};

},{"./request":39}],37:[function(require,module,exports){
'use strict';

var request = require('./request');

module.exports = function (url) {
  return request(url, {
    dataType: 'json',
    type: 'GET'
  });
};

},{"./request":39}],38:[function(require,module,exports){
'use strict';

var request = require('./request');

module.exports = function (url, data) {
  return request(url, {
    dataType: 'json',
    type: 'POST',
    data: JSON.stringify(data)
  });
};

},{"./request":39}],39:[function(require,module,exports){
'use strict';

var RSVP = require('rsvp');
var appInstance = require('../../app');

var _$ = $;
var ajax = _$.ajax;
var extend = _$.extend;


var defaults = {};

module.exports = function (url) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  appInstance.setIsLoading(true);

  return new RSVP.Promise(function (resolve, reject) {
    var callbacks = {
      success: function success(response) {
        appInstance.setIsLoading(false);
        resolve(response);
      },
      error: function error(reason) {
        appInstance.setIsLoading(false);
        reject(reason);
      }
    };

    var opts = extend({}, defaults, options, callbacks, {
      url: url
    });

    ajax(opts);
  });
};

},{"../../app":3,"rsvp":55}],40:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var appInstance = require('../app');
var Toast = require('../dom/toast');

var checkLoading = function checkLoading() {
  if (appInstance.getIsLoading()) {
    Toast.showErrorToast('Wait until it completes loading of previous file.');
    return true;
  }
  return false;
};

var getParameterByName = function getParameterByName(name) {
  var url = window.location.href;
  var cleanName = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');

  var results = regex.exec(url);

  if (!results || results.length !== 3) {
    return null;
  }

  var _results = _slicedToArray(results, 3);

  var id = _results[2];


  return id;
};

module.exports = {
  checkLoading: checkLoading,
  getParameterByName: getParameterByName
};

},{"../app":3,"../dom/toast":21}],41:[function(require,module,exports){
'use strict';

var loadAlgorithm = require('./load_algorithm');
var loadCategories = require('./load_categories');
var loadFile = require('./load_file');
var loadScratchPaper = require('./load_scratch_paper');
var shareScratchPaper = require('./share_scratch_paper');

module.exports = {
  loadAlgorithm: loadAlgorithm,
  loadCategories: loadCategories,
  loadFile: loadFile,
  loadScratchPaper: loadScratchPaper,
  shareScratchPaper: shareScratchPaper
};

},{"./load_algorithm":42,"./load_categories":43,"./load_file":44,"./load_scratch_paper":45,"./share_scratch_paper":46}],42:[function(require,module,exports){
'use strict';

var Utils = require('../utils');
var getJSON = require('./ajax/get_json');

module.exports = function (category, algorithm) {
  var dir = Utils.getAlgorithmDir(category, algorithm);
  return getJSON(dir + 'desc.json');
};

},{"../utils":53,"./ajax/get_json":37}],43:[function(require,module,exports){
'use strict';

var appInstance = require('../app');
var getJSON = require('./ajax/get_json');

module.exports = function () {
  return getJSON('./algorithm/category.json');
};

},{"../app":3,"./ajax/get_json":37}],44:[function(require,module,exports){
'use strict';

var RSVP = require('rsvp');

var appInstance = require('../app');
var Utils = require('../utils');

var _require = require('./helpers');

var checkLoading = _require.checkLoading;


var get = require('./ajax/get');

var loadDataAndCode = function loadDataAndCode(dir) {
  return RSVP.hash({
    data: get(dir + 'data.js'),
    code: get(dir + 'code.js')
  });
};

var loadFileAndUpdateContent = function loadFileAndUpdateContent(dir) {
  appInstance.setIsLoading(true);
  appInstance.getEditor().clearContent();

  return loadDataAndCode(dir).then(function (content) {
    appInstance.updateCachedFile(dir, content);
    appInstance.getEditor().setContent(content);
  });
};

var cachedContentExists = function cachedContentExists(cachedFile) {
  return cachedFile && cachedFile.data !== undefined && cachedFile.code !== undefined;
};

module.exports = function (category, algorithm, file, explanation) {
  return new RSVP.Promise(function (resolve, reject) {

    if (checkLoading()) {
      reject();
    } else {
      $('#explanation').html(explanation);

      var dir = Utils.getFileDir(category, algorithm, file);
      appInstance.setLastFileUsed(dir);
      var cachedFile = appInstance.getCachedFile(dir);

      if (cachedContentExists(cachedFile)) {
        appInstance.getEditor().setContent(cachedFile);
        resolve();
      } else {
        loadFileAndUpdateContent(dir).then(resolve, reject);
      }
    }
  });
};

},{"../app":3,"../utils":53,"./ajax/get":36,"./helpers":40,"rsvp":55}],45:[function(require,module,exports){
'use strict';

var RSVP = require('rsvp');

var Utils = require('../utils');
var appInstance = require('../app');

var getJSON = require('./ajax/get_json');
var loadAlgorithm = require('./load_algorithm');

var extractGistCode = function extractGistCode(files, name) {
  return files[name + '.js'].content;
};

module.exports = function (gistID) {
  return new RSVP.Promise(function (resolve, reject) {
    getJSON('https://api.github.com/gists/' + gistID).then(function (_ref) {
      var files = _ref.files;


      var algorithm = 'scratch_paper';
      var category = null;

      loadAlgorithm(category, algorithm).then(function (data) {

        var algoData = extractGistCode(files, 'data');
        var algoCode = extractGistCode(files, 'code');

        // update scratch paper algo code with the loaded gist code
        var dir = Utils.getFileDir(category, algorithm, 'scratch_paper');
        appInstance.updateCachedFile(dir, {
          data: algoData,
          code: algoCode,
          'CREDIT.md': 'Shared by an anonymous user from http://parkjs814.github.io/AlgorithmVisualizer'
        });

        resolve({
          category: category,
          algorithm: algorithm,
          data: data
        });
      });
    });
  });
};

},{"../app":3,"../utils":53,"./ajax/get_json":37,"./load_algorithm":42,"rsvp":55}],46:[function(require,module,exports){
'use strict';

var RSVP = require('rsvp');
var appInstance = require('../app');

var postJSON = require('./ajax/post_json');

module.exports = function () {
  return new RSVP.Promise(function (resolve, reject) {
    var _appInstance$getEdito = appInstance.getEditor();

    var dataEditor = _appInstance$getEdito.dataEditor;
    var codeEditor = _appInstance$getEdito.codeEditor;


    var gist = {
      'description': 'temp',
      'public': true,
      'files': {
        'data.js': {
          'content': dataEditor.getValue()
        },
        'code.js': {
          'content': codeEditor.getValue()
        }
      }
    };

    postJSON('https://api.github.com/gists', gist).then(function (_ref) {
      var id = _ref.id;
      var _location = location;
      var protocol = _location.protocol;
      var host = _location.host;
      var pathname = _location.pathname;


      var url = protocol + '//' + host + pathname + '?scratch-paper=' + id;
      resolve(url);
    });
  });
};

},{"../app":3,"./ajax/post_json":38,"rsvp":55}],47:[function(require,module,exports){
'use strict';

var TracerManager = require('./manager');
var Tracer = require('../module/tracer');

module.exports = {
  init: function init() {
    var tm = new TracerManager();
    Tracer.prototype.manager = tm;
    return tm;
  }
};

},{"../module/tracer":32,"./manager":48}],48:[function(require,module,exports){
'use strict';

var stepLimit = 1e6;

var TracerManager = function TracerManager() {
  this.timer = null;
  this.pause = false;
  this.capsules = [];
  this.interval = 500;
};

TracerManager.prototype = {
  add: function add(tracer) {

    var $container = $('<section class="module_wrapper">');
    $('.module_container').append($container);

    var capsule = {
      module: tracer.module,
      tracer: tracer,
      allocated: true,
      defaultName: null,
      $container: $container,
      isNew: true
    };

    this.capsules.push(capsule);
    return capsule;
  },
  allocate: function allocate(newTracer) {
    var selectedCapsule = null;
    var count = 0;

    $.each(this.capsules, function (i, capsule) {
      if (capsule.module === newTracer.module) {
        count++;
        if (!capsule.allocated) {
          capsule.tracer = newTracer;
          capsule.allocated = true;
          capsule.isNew = false;
          selectedCapsule = capsule;
          return false;
        }
      }
    });

    if (selectedCapsule === null) {
      count++;
      selectedCapsule = this.add(newTracer);
    }

    selectedCapsule.defaultName = newTracer.constructor.name + ' ' + count;
    return selectedCapsule;
  },
  deallocateAll: function deallocateAll() {
    this.reset();
    $.each(this.capsules, function (i, capsule) {
      capsule.allocated = false;
    });
  },
  removeUnallocated: function removeUnallocated() {
    var changed = false;

    this.capsules = $.grep(this.capsules, function (capsule) {
      var removed = !capsule.allocated;

      if (capsule.isNew || removed) {
        changed = true;
      }
      if (removed) {
        capsule.$container.remove();
      }

      return !removed;
    });

    if (changed) {
      this.place();
    }
  },
  place: function place() {
    var capsules = this.capsules;


    $.each(capsules, function (i, capsule) {
      var width = 100;
      var height = 100 / capsules.length;
      var top = height * i;

      capsule.$container.css({
        top: top + '%',
        width: width + '%',
        height: height + '%'
      });

      capsule.tracer.resize();
    });
  },
  resize: function resize() {
    this.command('resize');
  },
  isPause: function isPause() {
    return this.pause;
  },
  setInterval: function setInterval(interval) {
    $('#interval').val(interval);
  },
  reset: function reset() {
    this.traces = [];
    this.traceIndex = -1;
    this.stepCnt = 0;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.command('clear');
  },
  pushStep: function pushStep(capsule, step) {
    if (this.stepCnt++ > stepLimit) throw "Tracer's stack overflow";
    var len = this.traces.length;
    var last = [];
    if (len === 0) {
      this.traces.push(last);
    } else {
      last = this.traces[len - 1];
    }
    last.push($.extend(step, {
      capsule: capsule
    }));
  },
  newStep: function newStep() {
    this.traces.push([]);
  },
  pauseStep: function pauseStep() {
    if (this.traceIndex < 0) return;
    this.pause = true;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    $('#btn_pause').addClass('active');
  },
  resumeStep: function resumeStep() {
    this.pause = false;
    this.step(this.traceIndex + 1);
    $('#btn_pause').removeClass('active');
  },
  step: function step(i) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var tracer = this;

    if (isNaN(i) || i >= this.traces.length || i < 0) return;

    this.traceIndex = i;
    var trace = this.traces[i];
    trace.forEach(function (step) {
      step.capsule.tracer.processStep(step, options);
    });

    if (!options.virtual) {
      this.command('refresh');
    }

    if (this.pause) return;

    this.timer = setTimeout(function () {
      tracer.step(i + 1, options);
    }, this.interval);
  },
  prevStep: function prevStep() {
    this.command('clear');

    var finalIndex = this.traceIndex - 1;
    if (finalIndex < 0) {
      this.traceIndex = -1;
      this.command('refresh');
      return;
    }

    for (var i = 0; i < finalIndex; i++) {
      this.step(i, {
        virtual: true
      });
    }

    this.step(finalIndex);
  },
  nextStep: function nextStep() {
    this.step(this.traceIndex + 1);
  },
  visualize: function visualize() {
    this.traceIndex = -1;
    this.resumeStep();
  },
  command: function command() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var functionName = args.shift();
    $.each(this.capsules, function (i, capsule) {
      if (capsule.allocated) {
        capsule.tracer.module.prototype[functionName].apply(capsule.tracer, args);
      }
    });
  },
  findOwner: function findOwner(container) {
    var selectedCapsule = null;
    $.each(this.capsules, function (i, capsule) {
      if (capsule.$container[0] === container) {
        selectedCapsule = capsule;
        return false;
      }
    });
    return selectedCapsule.tracer;
  }
};

module.exports = TracerManager;

},{}],49:[function(require,module,exports){
'use strict';

var parse = JSON.parse;


var fromJSON = function fromJSON(obj) {
  return parse(obj, function (key, value) {
    return value === 'Infinity' ? Infinity : value;
  });
};

module.exports = fromJSON;

},{}],50:[function(require,module,exports){
'use strict';

var toJSON = require('./to_json');
var fromJSON = require('./from_json');
var refineByType = require('./refine_by_type');

module.exports = {
  toJSON: toJSON,
  fromJSON: fromJSON,
  refineByType: refineByType
};

},{"./from_json":49,"./refine_by_type":51,"./to_json":52}],51:[function(require,module,exports){
'use strict';

var refineByType = function refineByType(item) {
  return typeof item === 'number' ? refineNumber(item) : refineString(item);
};

var refineString = function refineString(str) {
  return str === '' ? ' ' : str;
};

var refineNumber = function refineNumber(num) {
  return num === Infinity ? '∞' : num;
};

module.exports = refineByType;

},{}],52:[function(require,module,exports){
'use strict';

var stringify = JSON.stringify;


var toJSON = function toJSON(obj) {
  return stringify(obj, function (key, value) {
    return value === Infinity ? 'Infinity' : value;
  });
};

module.exports = toJSON;

},{}],53:[function(require,module,exports){
'use strict';

var isScratchPaper = function isScratchPaper(category, algorithm) {
  return category === null && algorithm === 'scratch_paper';
};

var getAlgorithmDir = function getAlgorithmDir(category, algorithm) {
  if (isScratchPaper(category, algorithm)) {
    return './algorithm/scratch_paper/';
  }
  return './algorithm/' + category + '/' + algorithm + '/';
};

var getFileDir = function getFileDir(category, algorithm, file) {
  if (isScratchPaper(category, algorithm)) {
    return './algorithm/scratch_paper/';
  }

  return './algorithm/' + category + '/' + algorithm + '/' + file + '/';
};

module.exports = {
  isScratchPaper: isScratchPaper,
  getAlgorithmDir: getAlgorithmDir,
  getFileDir: getFileDir
};

},{}],54:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],55:[function(require,module,exports){
(function (process,global){
/*!
 * @overview RSVP - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/tildeio/rsvp.js/master/LICENSE
 * @version   3.2.1
 */

(function() {
    "use strict";
    function lib$rsvp$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$rsvp$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$rsvp$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$rsvp$utils$$_isArray;
    if (!Array.isArray) {
      lib$rsvp$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$rsvp$utils$$_isArray = Array.isArray;
    }

    var lib$rsvp$utils$$isArray = lib$rsvp$utils$$_isArray;

    var lib$rsvp$utils$$now = Date.now || function() { return new Date().getTime(); };

    function lib$rsvp$utils$$F() { }

    var lib$rsvp$utils$$o_create = (Object.create || function (o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (typeof o !== 'object') {
        throw new TypeError('Argument must be an object');
      }
      lib$rsvp$utils$$F.prototype = o;
      return new lib$rsvp$utils$$F();
    });
    function lib$rsvp$events$$indexOf(callbacks, callback) {
      for (var i=0, l=callbacks.length; i<l; i++) {
        if (callbacks[i] === callback) { return i; }
      }

      return -1;
    }

    function lib$rsvp$events$$callbacksFor(object) {
      var callbacks = object._promiseCallbacks;

      if (!callbacks) {
        callbacks = object._promiseCallbacks = {};
      }

      return callbacks;
    }

    var lib$rsvp$events$$default = {

      /**
        `RSVP.EventTarget.mixin` extends an object with EventTarget methods. For
        Example:

        ```javascript
        var object = {};

        RSVP.EventTarget.mixin(object);

        object.on('finished', function(event) {
          // handle event
        });

        object.trigger('finished', { detail: value });
        ```

        `EventTarget.mixin` also works with prototypes:

        ```javascript
        var Person = function() {};
        RSVP.EventTarget.mixin(Person.prototype);

        var yehuda = new Person();
        var tom = new Person();

        yehuda.on('poke', function(event) {
          console.log('Yehuda says OW');
        });

        tom.on('poke', function(event) {
          console.log('Tom says OW');
        });

        yehuda.trigger('poke');
        tom.trigger('poke');
        ```

        @method mixin
        @for RSVP.EventTarget
        @private
        @param {Object} object object to extend with EventTarget methods
      */
      'mixin': function(object) {
        object['on']      = this['on'];
        object['off']     = this['off'];
        object['trigger'] = this['trigger'];
        object._promiseCallbacks = undefined;
        return object;
      },

      /**
        Registers a callback to be executed when `eventName` is triggered

        ```javascript
        object.on('event', function(eventInfo){
          // handle the event
        });

        object.trigger('event');
        ```

        @method on
        @for RSVP.EventTarget
        @private
        @param {String} eventName name of the event to listen for
        @param {Function} callback function to be called when the event is triggered.
      */
      'on': function(eventName, callback) {
        if (typeof callback !== 'function') {
          throw new TypeError('Callback must be a function');
        }

        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks;

        callbacks = allCallbacks[eventName];

        if (!callbacks) {
          callbacks = allCallbacks[eventName] = [];
        }

        if (lib$rsvp$events$$indexOf(callbacks, callback) === -1) {
          callbacks.push(callback);
        }
      },

      /**
        You can use `off` to stop firing a particular callback for an event:

        ```javascript
        function doStuff() { // do stuff! }
        object.on('stuff', doStuff);

        object.trigger('stuff'); // doStuff will be called

        // Unregister ONLY the doStuff callback
        object.off('stuff', doStuff);
        object.trigger('stuff'); // doStuff will NOT be called
        ```

        If you don't pass a `callback` argument to `off`, ALL callbacks for the
        event will not be executed when the event fires. For example:

        ```javascript
        var callback1 = function(){};
        var callback2 = function(){};

        object.on('stuff', callback1);
        object.on('stuff', callback2);

        object.trigger('stuff'); // callback1 and callback2 will be executed.

        object.off('stuff');
        object.trigger('stuff'); // callback1 and callback2 will not be executed!
        ```

        @method off
        @for RSVP.EventTarget
        @private
        @param {String} eventName event to stop listening to
        @param {Function} callback optional argument. If given, only the function
        given will be removed from the event's callback queue. If no `callback`
        argument is given, all callbacks will be removed from the event's callback
        queue.
      */
      'off': function(eventName, callback) {
        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks, index;

        if (!callback) {
          allCallbacks[eventName] = [];
          return;
        }

        callbacks = allCallbacks[eventName];

        index = lib$rsvp$events$$indexOf(callbacks, callback);

        if (index !== -1) { callbacks.splice(index, 1); }
      },

      /**
        Use `trigger` to fire custom events. For example:

        ```javascript
        object.on('foo', function(){
          console.log('foo event happened!');
        });
        object.trigger('foo');
        // 'foo event happened!' logged to the console
        ```

        You can also pass a value as a second argument to `trigger` that will be
        passed as an argument to all event listeners for the event:

        ```javascript
        object.on('foo', function(value){
          console.log(value.name);
        });

        object.trigger('foo', { name: 'bar' });
        // 'bar' logged to the console
        ```

        @method trigger
        @for RSVP.EventTarget
        @private
        @param {String} eventName name of the event to be triggered
        @param {*} options optional value to be passed to any event handlers for
        the given `eventName`
      */
      'trigger': function(eventName, options, label) {
        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks, callback;

        if (callbacks = allCallbacks[eventName]) {
          // Don't cache the callbacks.length since it may grow
          for (var i=0; i<callbacks.length; i++) {
            callback = callbacks[i];

            callback(options, label);
          }
        }
      }
    };

    var lib$rsvp$config$$config = {
      instrument: false
    };

    lib$rsvp$events$$default['mixin'](lib$rsvp$config$$config);

    function lib$rsvp$config$$configure(name, value) {
      if (name === 'onerror') {
        // handle for legacy users that expect the actual
        // error to be passed to their function added via
        // `RSVP.configure('onerror', someFunctionHere);`
        lib$rsvp$config$$config['on']('error', value);
        return;
      }

      if (arguments.length === 2) {
        lib$rsvp$config$$config[name] = value;
      } else {
        return lib$rsvp$config$$config[name];
      }
    }

    var lib$rsvp$instrument$$queue = [];

    function lib$rsvp$instrument$$scheduleFlush() {
      setTimeout(function() {
        var entry;
        for (var i = 0; i < lib$rsvp$instrument$$queue.length; i++) {
          entry = lib$rsvp$instrument$$queue[i];

          var payload = entry.payload;

          payload.guid = payload.key + payload.id;
          payload.childGuid = payload.key + payload.childId;
          if (payload.error) {
            payload.stack = payload.error.stack;
          }

          lib$rsvp$config$$config['trigger'](entry.name, entry.payload);
        }
        lib$rsvp$instrument$$queue.length = 0;
      }, 50);
    }

    function lib$rsvp$instrument$$instrument(eventName, promise, child) {
      if (1 === lib$rsvp$instrument$$queue.push({
        name: eventName,
        payload: {
          key: promise._guidKey,
          id:  promise._id,
          eventName: eventName,
          detail: promise._result,
          childId: child && child._id,
          label: promise._label,
          timeStamp: lib$rsvp$utils$$now(),
          error: lib$rsvp$config$$config["instrument-with-stack"] ? new Error(promise._label) : null
        }})) {
          lib$rsvp$instrument$$scheduleFlush();
        }
      }
    var lib$rsvp$instrument$$default = lib$rsvp$instrument$$instrument;
    function lib$rsvp$then$$then(onFulfillment, onRejection, label) {
      var parent = this;
      var state = parent._state;

      if (state === lib$rsvp$$internal$$FULFILLED && !onFulfillment || state === lib$rsvp$$internal$$REJECTED && !onRejection) {
        lib$rsvp$config$$config.instrument && lib$rsvp$instrument$$default('chained', parent, parent);
        return parent;
      }

      parent._onError = null;

      var child = new parent.constructor(lib$rsvp$$internal$$noop, label);
      var result = parent._result;

      lib$rsvp$config$$config.instrument && lib$rsvp$instrument$$default('chained', parent, child);

      if (state) {
        var callback = arguments[state - 1];
        lib$rsvp$config$$config.async(function(){
          lib$rsvp$$internal$$invokeCallback(state, child, callback, result);
        });
      } else {
        lib$rsvp$$internal$$subscribe(parent, child, onFulfillment, onRejection);
      }

      return child;
    }
    var lib$rsvp$then$$default = lib$rsvp$then$$then;
    function lib$rsvp$promise$resolve$$resolve(object, label) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$rsvp$$internal$$noop, label);
      lib$rsvp$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$rsvp$promise$resolve$$default = lib$rsvp$promise$resolve$$resolve;
    function lib$rsvp$enumerator$$makeSettledResult(state, position, value) {
      if (state === lib$rsvp$$internal$$FULFILLED) {
        return {
          state: 'fulfilled',
          value: value
        };
      } else {
         return {
          state: 'rejected',
          reason: value
        };
      }
    }

    function lib$rsvp$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor(lib$rsvp$$internal$$noop, label);
      this._abortOnReject = abortOnReject;

      if (this._validateInput(input)) {
        this._input     = input;
        this.length     = input.length;
        this._remaining = input.length;

        this._init();

        if (this.length === 0) {
          lib$rsvp$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            lib$rsvp$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        lib$rsvp$$internal$$reject(this.promise, this._validationError());
      }
    }

    var lib$rsvp$enumerator$$default = lib$rsvp$enumerator$$Enumerator;

    lib$rsvp$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$rsvp$utils$$isArray(input);
    };

    lib$rsvp$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$rsvp$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    lib$rsvp$enumerator$$Enumerator.prototype._enumerate = function() {
      var length     = this.length;
      var promise    = this.promise;
      var input      = this._input;

      for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._settleMaybeThenable = function(entry, i) {
      var c = this._instanceConstructor;
      var resolve = c.resolve;

      if (resolve === lib$rsvp$promise$resolve$$default) {
        var then = lib$rsvp$$internal$$getThen(entry);

        if (then === lib$rsvp$then$$default &&
            entry._state !== lib$rsvp$$internal$$PENDING) {
          entry._onError = null;
          this._settledAt(entry._state, i, entry._result);
        } else if (typeof then !== 'function') {
          this._remaining--;
          this._result[i] = this._makeResult(lib$rsvp$$internal$$FULFILLED, i, entry);
        } else if (c === lib$rsvp$promise$$default) {
          var promise = new c(lib$rsvp$$internal$$noop);
          lib$rsvp$$internal$$handleMaybeThenable(promise, entry, then);
          this._willSettleAt(promise, i);
        } else {
          this._willSettleAt(new c(function(resolve) { resolve(entry); }), i);
        }
      } else {
        this._willSettleAt(resolve(entry), i);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      if (lib$rsvp$utils$$isMaybeThenable(entry)) {
        this._settleMaybeThenable(entry, i);
      } else {
        this._remaining--;
        this._result[i] = this._makeResult(lib$rsvp$$internal$$FULFILLED, i, entry);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;

      if (promise._state === lib$rsvp$$internal$$PENDING) {
        this._remaining--;

        if (this._abortOnReject && state === lib$rsvp$$internal$$REJECTED) {
          lib$rsvp$$internal$$reject(promise, value);
        } else {
          this._result[i] = this._makeResult(state, i, value);
        }
      }

      if (this._remaining === 0) {
        lib$rsvp$$internal$$fulfill(promise, this._result);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
      return value;
    };

    lib$rsvp$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$rsvp$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$rsvp$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$rsvp$$internal$$REJECTED, i, reason);
      });
    };
    function lib$rsvp$promise$all$$all(entries, label) {
      return new lib$rsvp$enumerator$$default(this, entries, true /* abort on reject */, label).promise;
    }
    var lib$rsvp$promise$all$$default = lib$rsvp$promise$all$$all;
    function lib$rsvp$promise$race$$race(entries, label) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$rsvp$$internal$$noop, label);

      if (!lib$rsvp$utils$$isArray(entries)) {
        lib$rsvp$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$rsvp$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$rsvp$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        lib$rsvp$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$rsvp$promise$race$$default = lib$rsvp$promise$race$$race;
    function lib$rsvp$promise$reject$$reject(reason, label) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$rsvp$$internal$$noop, label);
      lib$rsvp$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$rsvp$promise$reject$$default = lib$rsvp$promise$reject$$reject;

    var lib$rsvp$promise$$guidKey = 'rsvp_' + lib$rsvp$utils$$now() + '-';
    var lib$rsvp$promise$$counter = 0;

    function lib$rsvp$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$rsvp$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    function lib$rsvp$promise$$Promise(resolver, label) {
      this._id = lib$rsvp$promise$$counter++;
      this._label = label;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      lib$rsvp$config$$config.instrument && lib$rsvp$instrument$$default('created', this);

      if (lib$rsvp$$internal$$noop !== resolver) {
        typeof resolver !== 'function' && lib$rsvp$promise$$needsResolver();
        this instanceof lib$rsvp$promise$$Promise ? lib$rsvp$$internal$$initializePromise(this, resolver) : lib$rsvp$promise$$needsNew();
      }
    }

    var lib$rsvp$promise$$default = lib$rsvp$promise$$Promise;

    // deprecated
    lib$rsvp$promise$$Promise.cast = lib$rsvp$promise$resolve$$default;
    lib$rsvp$promise$$Promise.all = lib$rsvp$promise$all$$default;
    lib$rsvp$promise$$Promise.race = lib$rsvp$promise$race$$default;
    lib$rsvp$promise$$Promise.resolve = lib$rsvp$promise$resolve$$default;
    lib$rsvp$promise$$Promise.reject = lib$rsvp$promise$reject$$default;

    lib$rsvp$promise$$Promise.prototype = {
      constructor: lib$rsvp$promise$$Promise,

      _guidKey: lib$rsvp$promise$$guidKey,

      _onError: function (reason) {
        var promise = this;
        lib$rsvp$config$$config.after(function() {
          if (promise._onError) {
            lib$rsvp$config$$config['trigger']('error', reason, promise._label);
          }
        });
      },

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfillment
      @param {Function} onRejection
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      then: lib$rsvp$then$$default,

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection, label) {
        return this.then(undefined, onRejection, label);
      },

    /**
      `finally` will be invoked regardless of the promise's fate just as native
      try/catch/finally behaves

      Synchronous example:

      ```js
      findAuthor() {
        if (Math.random() > 0.5) {
          throw new Error();
        }
        return new Author();
      }

      try {
        return findAuthor(); // succeed or fail
      } catch(error) {
        return findOtherAuther();
      } finally {
        // always runs
        // doesn't affect the return value
      }
      ```

      Asynchronous example:

      ```js
      findAuthor().catch(function(reason){
        return findOtherAuther();
      }).finally(function(){
        // author was either found, or not
      });
      ```

      @method finally
      @param {Function} callback
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'finally': function(callback, label) {
        var promise = this;
        var constructor = promise.constructor;

        return promise.then(function(value) {
          return constructor.resolve(callback()).then(function() {
            return value;
          });
        }, function(reason) {
          return constructor.resolve(callback()).then(function() {
            return constructor.reject(reason);
          });
        }, label);
      }
    };
    function  lib$rsvp$$internal$$withOwnPromise() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$rsvp$$internal$$noop() {}

    var lib$rsvp$$internal$$PENDING   = void 0;
    var lib$rsvp$$internal$$FULFILLED = 1;
    var lib$rsvp$$internal$$REJECTED  = 2;

    var lib$rsvp$$internal$$GET_THEN_ERROR = new lib$rsvp$$internal$$ErrorObject();

    function lib$rsvp$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$rsvp$$internal$$GET_THEN_ERROR.error = error;
        return lib$rsvp$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$rsvp$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$rsvp$$internal$$handleForeignThenable(promise, thenable, then) {
      lib$rsvp$config$$config.async(function(promise) {
        var sealed = false;
        var error = lib$rsvp$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$rsvp$$internal$$resolve(promise, value, undefined);
          } else {
            lib$rsvp$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$rsvp$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$rsvp$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$rsvp$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$rsvp$$internal$$FULFILLED) {
        lib$rsvp$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$rsvp$$internal$$REJECTED) {
        thenable._onError = null;
        lib$rsvp$$internal$$reject(promise, thenable._result);
      } else {
        lib$rsvp$$internal$$subscribe(thenable, undefined, function(value) {
          if (thenable !== value) {
            lib$rsvp$$internal$$resolve(promise, value, undefined);
          } else {
            lib$rsvp$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          lib$rsvp$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$rsvp$$internal$$handleMaybeThenable(promise, maybeThenable, then) {
      if (maybeThenable.constructor === promise.constructor &&
          then === lib$rsvp$then$$default &&
          constructor.resolve === lib$rsvp$promise$resolve$$default) {
        lib$rsvp$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        if (then === lib$rsvp$$internal$$GET_THEN_ERROR) {
          lib$rsvp$$internal$$reject(promise, lib$rsvp$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$rsvp$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$rsvp$utils$$isFunction(then)) {
          lib$rsvp$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$rsvp$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$rsvp$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$rsvp$$internal$$fulfill(promise, value);
      } else if (lib$rsvp$utils$$objectOrFunction(value)) {
        lib$rsvp$$internal$$handleMaybeThenable(promise, value, lib$rsvp$$internal$$getThen(value));
      } else {
        lib$rsvp$$internal$$fulfill(promise, value);
      }
    }

    function lib$rsvp$$internal$$publishRejection(promise) {
      if (promise._onError) {
        promise._onError(promise._result);
      }

      lib$rsvp$$internal$$publish(promise);
    }

    function lib$rsvp$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$rsvp$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$rsvp$$internal$$FULFILLED;

      if (promise._subscribers.length === 0) {
        if (lib$rsvp$config$$config.instrument) {
          lib$rsvp$instrument$$default('fulfilled', promise);
        }
      } else {
        lib$rsvp$config$$config.async(lib$rsvp$$internal$$publish, promise);
      }
    }

    function lib$rsvp$$internal$$reject(promise, reason) {
      if (promise._state !== lib$rsvp$$internal$$PENDING) { return; }
      promise._state = lib$rsvp$$internal$$REJECTED;
      promise._result = reason;
      lib$rsvp$config$$config.async(lib$rsvp$$internal$$publishRejection, promise);
    }

    function lib$rsvp$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onError = null;

      subscribers[length] = child;
      subscribers[length + lib$rsvp$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$rsvp$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$rsvp$config$$config.async(lib$rsvp$$internal$$publish, parent);
      }
    }

    function lib$rsvp$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (lib$rsvp$config$$config.instrument) {
        lib$rsvp$instrument$$default(settled === lib$rsvp$$internal$$FULFILLED ? 'fulfilled' : 'rejected', promise);
      }

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$rsvp$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$rsvp$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$rsvp$$internal$$TRY_CATCH_ERROR = new lib$rsvp$$internal$$ErrorObject();

    function lib$rsvp$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$rsvp$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$rsvp$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$rsvp$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$rsvp$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$rsvp$$internal$$tryCatch(callback, detail);

        if (value === lib$rsvp$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$rsvp$$internal$$reject(promise, lib$rsvp$$internal$$withOwnPromise());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$rsvp$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$rsvp$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$rsvp$$internal$$reject(promise, error);
      } else if (settled === lib$rsvp$$internal$$FULFILLED) {
        lib$rsvp$$internal$$fulfill(promise, value);
      } else if (settled === lib$rsvp$$internal$$REJECTED) {
        lib$rsvp$$internal$$reject(promise, value);
      }
    }

    function lib$rsvp$$internal$$initializePromise(promise, resolver) {
      var resolved = false;
      try {
        resolver(function resolvePromise(value){
          if (resolved) { return; }
          resolved = true;
          lib$rsvp$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          if (resolved) { return; }
          resolved = true;
          lib$rsvp$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$rsvp$$internal$$reject(promise, e);
      }
    }

    function lib$rsvp$all$settled$$AllSettled(Constructor, entries, label) {
      this._superConstructor(Constructor, entries, false /* don't abort on reject */, label);
    }

    lib$rsvp$all$settled$$AllSettled.prototype = lib$rsvp$utils$$o_create(lib$rsvp$enumerator$$default.prototype);
    lib$rsvp$all$settled$$AllSettled.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$all$settled$$AllSettled.prototype._makeResult = lib$rsvp$enumerator$$makeSettledResult;
    lib$rsvp$all$settled$$AllSettled.prototype._validationError = function() {
      return new Error('allSettled must be called with an array');
    };

    function lib$rsvp$all$settled$$allSettled(entries, label) {
      return new lib$rsvp$all$settled$$AllSettled(lib$rsvp$promise$$default, entries, label).promise;
    }
    var lib$rsvp$all$settled$$default = lib$rsvp$all$settled$$allSettled;
    function lib$rsvp$all$$all(array, label) {
      return lib$rsvp$promise$$default.all(array, label);
    }
    var lib$rsvp$all$$default = lib$rsvp$all$$all;
    var lib$rsvp$asap$$len = 0;
    var lib$rsvp$asap$$toString = {}.toString;
    var lib$rsvp$asap$$vertxNext;
    function lib$rsvp$asap$$asap(callback, arg) {
      lib$rsvp$asap$$queue[lib$rsvp$asap$$len] = callback;
      lib$rsvp$asap$$queue[lib$rsvp$asap$$len + 1] = arg;
      lib$rsvp$asap$$len += 2;
      if (lib$rsvp$asap$$len === 2) {
        // If len is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        lib$rsvp$asap$$scheduleFlush();
      }
    }

    var lib$rsvp$asap$$default = lib$rsvp$asap$$asap;

    var lib$rsvp$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$rsvp$asap$$browserGlobal = lib$rsvp$asap$$browserWindow || {};
    var lib$rsvp$asap$$BrowserMutationObserver = lib$rsvp$asap$$browserGlobal.MutationObserver || lib$rsvp$asap$$browserGlobal.WebKitMutationObserver;
    var lib$rsvp$asap$$isNode = typeof self === 'undefined' &&
      typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$rsvp$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$rsvp$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$rsvp$asap$$flush);
      };
    }

    // vertx
    function lib$rsvp$asap$$useVertxTimer() {
      return function() {
        lib$rsvp$asap$$vertxNext(lib$rsvp$asap$$flush);
      };
    }

    function lib$rsvp$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$rsvp$asap$$BrowserMutationObserver(lib$rsvp$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$rsvp$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$rsvp$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$rsvp$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$rsvp$asap$$flush, 1);
      };
    }

    var lib$rsvp$asap$$queue = new Array(1000);
    function lib$rsvp$asap$$flush() {
      for (var i = 0; i < lib$rsvp$asap$$len; i+=2) {
        var callback = lib$rsvp$asap$$queue[i];
        var arg = lib$rsvp$asap$$queue[i+1];

        callback(arg);

        lib$rsvp$asap$$queue[i] = undefined;
        lib$rsvp$asap$$queue[i+1] = undefined;
      }

      lib$rsvp$asap$$len = 0;
    }

    function lib$rsvp$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$rsvp$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$rsvp$asap$$useVertxTimer();
      } catch(e) {
        return lib$rsvp$asap$$useSetTimeout();
      }
    }

    var lib$rsvp$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$rsvp$asap$$isNode) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useNextTick();
    } else if (lib$rsvp$asap$$BrowserMutationObserver) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useMutationObserver();
    } else if (lib$rsvp$asap$$isWorker) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useMessageChannel();
    } else if (lib$rsvp$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$attemptVertex();
    } else {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useSetTimeout();
    }
    function lib$rsvp$defer$$defer(label) {
      var deferred = {};

      deferred['promise'] = new lib$rsvp$promise$$default(function(resolve, reject) {
        deferred['resolve'] = resolve;
        deferred['reject'] = reject;
      }, label);

      return deferred;
    }
    var lib$rsvp$defer$$default = lib$rsvp$defer$$defer;
    function lib$rsvp$filter$$filter(promises, filterFn, label) {
      return lib$rsvp$promise$$default.all(promises, label).then(function(values) {
        if (!lib$rsvp$utils$$isFunction(filterFn)) {
          throw new TypeError("You must pass a function as filter's second argument.");
        }

        var length = values.length;
        var filtered = new Array(length);

        for (var i = 0; i < length; i++) {
          filtered[i] = filterFn(values[i]);
        }

        return lib$rsvp$promise$$default.all(filtered, label).then(function(filtered) {
          var results = new Array(length);
          var newLength = 0;

          for (var i = 0; i < length; i++) {
            if (filtered[i]) {
              results[newLength] = values[i];
              newLength++;
            }
          }

          results.length = newLength;

          return results;
        });
      });
    }
    var lib$rsvp$filter$$default = lib$rsvp$filter$$filter;

    function lib$rsvp$promise$hash$$PromiseHash(Constructor, object, label) {
      this._superConstructor(Constructor, object, true, label);
    }

    var lib$rsvp$promise$hash$$default = lib$rsvp$promise$hash$$PromiseHash;

    lib$rsvp$promise$hash$$PromiseHash.prototype = lib$rsvp$utils$$o_create(lib$rsvp$enumerator$$default.prototype);
    lib$rsvp$promise$hash$$PromiseHash.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$promise$hash$$PromiseHash.prototype._init = function() {
      this._result = {};
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._validateInput = function(input) {
      return input && typeof input === 'object';
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._validationError = function() {
      return new Error('Promise.hash must be called with an object');
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._enumerate = function() {
      var enumerator = this;
      var promise    = enumerator.promise;
      var input      = enumerator._input;
      var results    = [];

      for (var key in input) {
        if (promise._state === lib$rsvp$$internal$$PENDING && Object.prototype.hasOwnProperty.call(input, key)) {
          results.push({
            position: key,
            entry: input[key]
          });
        }
      }

      var length = results.length;
      enumerator._remaining = length;
      var result;

      for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        result = results[i];
        enumerator._eachEntry(result.entry, result.position);
      }
    };

    function lib$rsvp$hash$settled$$HashSettled(Constructor, object, label) {
      this._superConstructor(Constructor, object, false, label);
    }

    lib$rsvp$hash$settled$$HashSettled.prototype = lib$rsvp$utils$$o_create(lib$rsvp$promise$hash$$default.prototype);
    lib$rsvp$hash$settled$$HashSettled.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$hash$settled$$HashSettled.prototype._makeResult = lib$rsvp$enumerator$$makeSettledResult;

    lib$rsvp$hash$settled$$HashSettled.prototype._validationError = function() {
      return new Error('hashSettled must be called with an object');
    };

    function lib$rsvp$hash$settled$$hashSettled(object, label) {
      return new lib$rsvp$hash$settled$$HashSettled(lib$rsvp$promise$$default, object, label).promise;
    }
    var lib$rsvp$hash$settled$$default = lib$rsvp$hash$settled$$hashSettled;
    function lib$rsvp$hash$$hash(object, label) {
      return new lib$rsvp$promise$hash$$default(lib$rsvp$promise$$default, object, label).promise;
    }
    var lib$rsvp$hash$$default = lib$rsvp$hash$$hash;
    function lib$rsvp$map$$map(promises, mapFn, label) {
      return lib$rsvp$promise$$default.all(promises, label).then(function(values) {
        if (!lib$rsvp$utils$$isFunction(mapFn)) {
          throw new TypeError("You must pass a function as map's second argument.");
        }

        var length = values.length;
        var results = new Array(length);

        for (var i = 0; i < length; i++) {
          results[i] = mapFn(values[i]);
        }

        return lib$rsvp$promise$$default.all(results, label);
      });
    }
    var lib$rsvp$map$$default = lib$rsvp$map$$map;

    function lib$rsvp$node$$Result() {
      this.value = undefined;
    }

    var lib$rsvp$node$$ERROR = new lib$rsvp$node$$Result();
    var lib$rsvp$node$$GET_THEN_ERROR = new lib$rsvp$node$$Result();

    function lib$rsvp$node$$getThen(obj) {
      try {
       return obj.then;
      } catch(error) {
        lib$rsvp$node$$ERROR.value= error;
        return lib$rsvp$node$$ERROR;
      }
    }


    function lib$rsvp$node$$tryApply(f, s, a) {
      try {
        f.apply(s, a);
      } catch(error) {
        lib$rsvp$node$$ERROR.value = error;
        return lib$rsvp$node$$ERROR;
      }
    }

    function lib$rsvp$node$$makeObject(_, argumentNames) {
      var obj = {};
      var name;
      var i;
      var length = _.length;
      var args = new Array(length);

      for (var x = 0; x < length; x++) {
        args[x] = _[x];
      }

      for (i = 0; i < argumentNames.length; i++) {
        name = argumentNames[i];
        obj[name] = args[i + 1];
      }

      return obj;
    }

    function lib$rsvp$node$$arrayResult(_) {
      var length = _.length;
      var args = new Array(length - 1);

      for (var i = 1; i < length; i++) {
        args[i - 1] = _[i];
      }

      return args;
    }

    function lib$rsvp$node$$wrapThenable(then, promise) {
      return {
        then: function(onFulFillment, onRejection) {
          return then.call(promise, onFulFillment, onRejection);
        }
      };
    }

    function lib$rsvp$node$$denodeify(nodeFunc, options) {
      var fn = function() {
        var self = this;
        var l = arguments.length;
        var args = new Array(l + 1);
        var arg;
        var promiseInput = false;

        for (var i = 0; i < l; ++i) {
          arg = arguments[i];

          if (!promiseInput) {
            // TODO: clean this up
            promiseInput = lib$rsvp$node$$needsPromiseInput(arg);
            if (promiseInput === lib$rsvp$node$$GET_THEN_ERROR) {
              var p = new lib$rsvp$promise$$default(lib$rsvp$$internal$$noop);
              lib$rsvp$$internal$$reject(p, lib$rsvp$node$$GET_THEN_ERROR.value);
              return p;
            } else if (promiseInput && promiseInput !== true) {
              arg = lib$rsvp$node$$wrapThenable(promiseInput, arg);
            }
          }
          args[i] = arg;
        }

        var promise = new lib$rsvp$promise$$default(lib$rsvp$$internal$$noop);

        args[l] = function(err, val) {
          if (err)
            lib$rsvp$$internal$$reject(promise, err);
          else if (options === undefined)
            lib$rsvp$$internal$$resolve(promise, val);
          else if (options === true)
            lib$rsvp$$internal$$resolve(promise, lib$rsvp$node$$arrayResult(arguments));
          else if (lib$rsvp$utils$$isArray(options))
            lib$rsvp$$internal$$resolve(promise, lib$rsvp$node$$makeObject(arguments, options));
          else
            lib$rsvp$$internal$$resolve(promise, val);
        };

        if (promiseInput) {
          return lib$rsvp$node$$handlePromiseInput(promise, args, nodeFunc, self);
        } else {
          return lib$rsvp$node$$handleValueInput(promise, args, nodeFunc, self);
        }
      };

      fn.__proto__ = nodeFunc;

      return fn;
    }

    var lib$rsvp$node$$default = lib$rsvp$node$$denodeify;

    function lib$rsvp$node$$handleValueInput(promise, args, nodeFunc, self) {
      var result = lib$rsvp$node$$tryApply(nodeFunc, self, args);
      if (result === lib$rsvp$node$$ERROR) {
        lib$rsvp$$internal$$reject(promise, result.value);
      }
      return promise;
    }

    function lib$rsvp$node$$handlePromiseInput(promise, args, nodeFunc, self){
      return lib$rsvp$promise$$default.all(args).then(function(args){
        var result = lib$rsvp$node$$tryApply(nodeFunc, self, args);
        if (result === lib$rsvp$node$$ERROR) {
          lib$rsvp$$internal$$reject(promise, result.value);
        }
        return promise;
      });
    }

    function lib$rsvp$node$$needsPromiseInput(arg) {
      if (arg && typeof arg === 'object') {
        if (arg.constructor === lib$rsvp$promise$$default) {
          return true;
        } else {
          return lib$rsvp$node$$getThen(arg);
        }
      } else {
        return false;
      }
    }
    var lib$rsvp$platform$$platform;

    /* global self */
    if (typeof self === 'object') {
      lib$rsvp$platform$$platform = self;

    /* global global */
    } else if (typeof global === 'object') {
      lib$rsvp$platform$$platform = global;
    } else {
      throw new Error('no global: `self` or `global` found');
    }

    var lib$rsvp$platform$$default = lib$rsvp$platform$$platform;
    function lib$rsvp$race$$race(array, label) {
      return lib$rsvp$promise$$default.race(array, label);
    }
    var lib$rsvp$race$$default = lib$rsvp$race$$race;
    function lib$rsvp$reject$$reject(reason, label) {
      return lib$rsvp$promise$$default.reject(reason, label);
    }
    var lib$rsvp$reject$$default = lib$rsvp$reject$$reject;
    function lib$rsvp$resolve$$resolve(value, label) {
      return lib$rsvp$promise$$default.resolve(value, label);
    }
    var lib$rsvp$resolve$$default = lib$rsvp$resolve$$resolve;
    function lib$rsvp$rethrow$$rethrow(reason) {
      setTimeout(function() {
        throw reason;
      });
      throw reason;
    }
    var lib$rsvp$rethrow$$default = lib$rsvp$rethrow$$rethrow;

    // defaults
    lib$rsvp$config$$config.async = lib$rsvp$asap$$default;
    lib$rsvp$config$$config.after = function(cb) {
      setTimeout(cb, 0);
    };
    var lib$rsvp$$cast = lib$rsvp$resolve$$default;
    function lib$rsvp$$async(callback, arg) {
      lib$rsvp$config$$config.async(callback, arg);
    }

    function lib$rsvp$$on() {
      lib$rsvp$config$$config['on'].apply(lib$rsvp$config$$config, arguments);
    }

    function lib$rsvp$$off() {
      lib$rsvp$config$$config['off'].apply(lib$rsvp$config$$config, arguments);
    }

    // Set up instrumentation through `window.__PROMISE_INTRUMENTATION__`
    if (typeof window !== 'undefined' && typeof window['__PROMISE_INSTRUMENTATION__'] === 'object') {
      var lib$rsvp$$callbacks = window['__PROMISE_INSTRUMENTATION__'];
      lib$rsvp$config$$configure('instrument', true);
      for (var lib$rsvp$$eventName in lib$rsvp$$callbacks) {
        if (lib$rsvp$$callbacks.hasOwnProperty(lib$rsvp$$eventName)) {
          lib$rsvp$$on(lib$rsvp$$eventName, lib$rsvp$$callbacks[lib$rsvp$$eventName]);
        }
      }
    }

    var lib$rsvp$umd$$RSVP = {
      'race': lib$rsvp$race$$default,
      'Promise': lib$rsvp$promise$$default,
      'allSettled': lib$rsvp$all$settled$$default,
      'hash': lib$rsvp$hash$$default,
      'hashSettled': lib$rsvp$hash$settled$$default,
      'denodeify': lib$rsvp$node$$default,
      'on': lib$rsvp$$on,
      'off': lib$rsvp$$off,
      'map': lib$rsvp$map$$default,
      'filter': lib$rsvp$filter$$default,
      'resolve': lib$rsvp$resolve$$default,
      'reject': lib$rsvp$reject$$default,
      'all': lib$rsvp$all$$default,
      'rethrow': lib$rsvp$rethrow$$default,
      'defer': lib$rsvp$defer$$default,
      'EventTarget': lib$rsvp$events$$default,
      'configure': lib$rsvp$config$$configure,
      'async': lib$rsvp$$async
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$rsvp$umd$$RSVP; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$rsvp$umd$$RSVP;
    } else if (typeof lib$rsvp$platform$$default !== 'undefined') {
      lib$rsvp$platform$$default['RSVP'] = lib$rsvp$umd$$RSVP;
    }
}).call(this);


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":54}]},{},[25])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAvY2FjaGUuanMiLCJqcy9hcHAvY29uc3RydWN0b3IuanMiLCJqcy9hcHAvaW5kZXguanMiLCJqcy9kb20vaW5kZXguanMiLCJqcy9kb20vc2V0dXAvaW5kZXguanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfZGl2aWRlcnMuanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfZG9jdW1lbnQuanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfZmlsZXNfYmFyLmpzIiwianMvZG9tL3NldHVwL3NldHVwX2ludGVydmFsLmpzIiwianMvZG9tL3NldHVwL3NldHVwX21vZHVsZV9jb250YWluZXIuanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfcG93ZXJlZF9ieS5qcyIsImpzL2RvbS9zZXR1cC9zZXR1cF9zY3JhdGNoX3BhcGVyLmpzIiwianMvZG9tL3NldHVwL3NldHVwX3NpZGVfbWVudS5qcyIsImpzL2RvbS9zZXR1cC9zZXR1cF90b3BfbWVudS5qcyIsImpzL2RvbS9zZXR1cC9zZXR1cF93aW5kb3cuanMiLCJqcy9kb20vc2hvd19hbGdvcml0aG0uanMiLCJqcy9kb20vc2hvd19jYXRlZ29yaWVzLmpzIiwianMvZG9tL3Nob3dfZGVzY3JpcHRpb24uanMiLCJqcy9kb20vc2hvd19maWxlcy5qcyIsImpzL2RvbS9zaG93X2ZpcnN0X2FsZ29yaXRobS5qcyIsImpzL2RvbS90b2FzdC5qcyIsImpzL2VkaXRvci9jcmVhdGUuanMiLCJqcy9lZGl0b3IvZXhlY3V0b3IuanMiLCJqcy9lZGl0b3IvaW5kZXguanMiLCJqcy9pbmRleC5qcyIsImpzL21vZHVsZS9hcnJheTFkLmpzIiwianMvbW9kdWxlL2FycmF5MmQuanMiLCJqcy9tb2R1bGUvY2hhcnQuanMiLCJqcy9tb2R1bGUvZGlyZWN0ZWRfZ3JhcGguanMiLCJqcy9tb2R1bGUvaW5kZXguanMiLCJqcy9tb2R1bGUvbG9nX3RyYWNlci5qcyIsImpzL21vZHVsZS90cmFjZXIuanMiLCJqcy9tb2R1bGUvdW5kaXJlY3RlZF9ncmFwaC5qcyIsImpzL21vZHVsZS93ZWlnaHRlZF9kaXJlY3RlZF9ncmFwaC5qcyIsImpzL21vZHVsZS93ZWlnaHRlZF91bmRpcmVjdGVkX2dyYXBoLmpzIiwianMvc2VydmVyL2FqYXgvZ2V0LmpzIiwianMvc2VydmVyL2FqYXgvZ2V0X2pzb24uanMiLCJqcy9zZXJ2ZXIvYWpheC9wb3N0X2pzb24uanMiLCJqcy9zZXJ2ZXIvYWpheC9yZXF1ZXN0LmpzIiwianMvc2VydmVyL2hlbHBlcnMuanMiLCJqcy9zZXJ2ZXIvaW5kZXguanMiLCJqcy9zZXJ2ZXIvbG9hZF9hbGdvcml0aG0uanMiLCJqcy9zZXJ2ZXIvbG9hZF9jYXRlZ29yaWVzLmpzIiwianMvc2VydmVyL2xvYWRfZmlsZS5qcyIsImpzL3NlcnZlci9sb2FkX3NjcmF0Y2hfcGFwZXIuanMiLCJqcy9zZXJ2ZXIvc2hhcmVfc2NyYXRjaF9wYXBlci5qcyIsImpzL3RyYWNlcl9tYW5hZ2VyL2luZGV4LmpzIiwianMvdHJhY2VyX21hbmFnZXIvbWFuYWdlci5qcyIsImpzL3RyYWNlcl9tYW5hZ2VyL3V0aWwvZnJvbV9qc29uLmpzIiwianMvdHJhY2VyX21hbmFnZXIvdXRpbC9pbmRleC5qcyIsImpzL3RyYWNlcl9tYW5hZ2VyL3V0aWwvcmVmaW5lX2J5X3R5cGUuanMiLCJqcy90cmFjZXJfbWFuYWdlci91dGlsL3RvX2pzb24uanMiLCJqcy91dGlscy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcnN2cC9kaXN0L3JzdnAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7U0FJSSxDO0lBREYsTSxNQUFBLE07OztBQUdGLElBQU0sUUFBUTtBQUNaLGdCQUFjLEVBREY7QUFFWixTQUFPO0FBRkssQ0FBZDs7QUFLQSxJQUFNLGlCQUFpQixTQUFqQixjQUFpQixDQUFDLElBQUQsRUFBVTtBQUMvQixNQUFJ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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qge1xuICBleHRlbmRcbn0gPSAkO1xuXG5jb25zdCBjYWNoZSA9IHtcbiAgbGFzdEZpbGVVc2VkOiAnJyxcbiAgZmlsZXM6IHt9XG59O1xuXG5jb25zdCBhc3NlcnRGaWxlTmFtZSA9IChuYW1lKSA9PiB7XG4gIGlmICghbmFtZSkge1xuICAgIHRocm93ICdNaXNzaW5nIGZpbGUgbmFtZSc7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBHbG9iYWwgYXBwbGljYXRpb24gY2FjaGVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgZ2V0Q2FjaGVkRmlsZShuYW1lKSB7XG4gICAgYXNzZXJ0RmlsZU5hbWUobmFtZSk7XG4gICAgcmV0dXJuIGNhY2hlLmZpbGVzW25hbWVdO1xuICB9LFxuXG4gIHVwZGF0ZUNhY2hlZEZpbGUobmFtZSwgdXBkYXRlcykge1xuICAgIGFzc2VydEZpbGVOYW1lKG5hbWUpO1xuICAgIGlmICghY2FjaGUuZmlsZXNbbmFtZV0pIHtcbiAgICAgIGNhY2hlLmZpbGVzW25hbWVdID0ge307XG4gICAgfVxuICAgIGV4dGVuZChjYWNoZS5maWxlc1tuYW1lXSwgdXBkYXRlcyk7XG4gIH0sXG5cbiAgZ2V0TGFzdEZpbGVVc2VkKCkge1xuICAgIHJldHVybiBjYWNoZS5sYXN0RmlsZVVzZWQ7XG4gIH0sXG5cbiAgc2V0TGFzdEZpbGVVc2VkKGZpbGUpIHtcbiAgICBjYWNoZS5sYXN0RmlsZVVzZWQgPSBmaWxlO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgRWRpdG9yID0gcmVxdWlyZSgnLi4vZWRpdG9yJyk7XG5jb25zdCBUcmFjZXJNYW5hZ2VyID0gcmVxdWlyZSgnLi4vdHJhY2VyX21hbmFnZXInKTtcbmNvbnN0IERPTSA9IHJlcXVpcmUoJy4uL2RvbS9zZXR1cCcpO1xuY29uc3Qge1xuICBnZXRGaWxlRGlyXG59ID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuY29uc3QgQ2FjaGUgPSByZXF1aXJlKCcuL2NhY2hlJyk7XG5cbmNvbnN0IHtcbiAgZWFjaFxufSA9ICQ7XG5cbmNvbnN0IHN0YXRlID0ge1xuICBpc0xvYWRpbmc6IG51bGwsXG4gIGVkaXRvcjogbnVsbCxcbiAgdHJhY2VyTWFuYWdlcjogbnVsbCxcbiAgY2F0ZWdvcmllczogbnVsbFxufTtcblxuY29uc3QgaW5pdFN0YXRlID0gKHRyYWNlck1hbmFnZXIpID0+IHtcbiAgc3RhdGUuaXNMb2FkaW5nID0gZmFsc2U7XG4gIHN0YXRlLmVkaXRvciA9IG5ldyBFZGl0b3IodHJhY2VyTWFuYWdlcik7XG4gIHN0YXRlLnRyYWNlck1hbmFnZXIgPSB0cmFjZXJNYW5hZ2VyO1xuICBzdGF0ZS5jYXRlZ29yaWVzID0ge307XG59O1xuXG4vKipcbiAqIEdsb2JhbCBhcHBsaWNhdGlvbiBzaW5nbGV0b24uXG4gKi9cbmNvbnN0IEFwcCA9IGZ1bmN0aW9uKCkge1xuXG4gIHRoaXMuZ2V0SXNMb2FkaW5nID0gKCkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5pc0xvYWRpbmc7XG4gIH07XG5cbiAgdGhpcy5zZXRJc0xvYWRpbmcgPSAobG9hZGluZykgPT4ge1xuICAgIHN0YXRlLmlzTG9hZGluZyA9IGxvYWRpbmc7XG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgICQoJyNsb2FkaW5nLXNsaWRlcicpLnJlbW92ZUNsYXNzKCdsb2FkZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnI2xvYWRpbmctc2xpZGVyJykuYWRkQ2xhc3MoJ2xvYWRlZCcpO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLmdldEVkaXRvciA9ICgpID0+IHtcbiAgICByZXR1cm4gc3RhdGUuZWRpdG9yO1xuICB9O1xuXG4gIHRoaXMuZ2V0Q2F0ZWdvcmllcyA9ICgpID0+IHtcbiAgICByZXR1cm4gc3RhdGUuY2F0ZWdvcmllcztcbiAgfTtcblxuICB0aGlzLmdldENhdGVnb3J5ID0gKG5hbWUpID0+IHtcbiAgICByZXR1cm4gc3RhdGUuY2F0ZWdvcmllc1tuYW1lXTtcbiAgfTtcblxuICB0aGlzLnNldENhdGVnb3JpZXMgPSAoY2F0ZWdvcmllcykgPT4ge1xuICAgIHN0YXRlLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzO1xuICB9O1xuXG4gIHRoaXMudXBkYXRlQ2F0ZWdvcnkgPSAobmFtZSwgdXBkYXRlcykgPT4ge1xuICAgICQuZXh0ZW5kKHN0YXRlLmNhdGVnb3JpZXNbbmFtZV0sIHVwZGF0ZXMpO1xuICB9O1xuXG4gIHRoaXMuZ2V0VHJhY2VyTWFuYWdlciA9ICgpID0+IHtcbiAgICByZXR1cm4gc3RhdGUudHJhY2VyTWFuYWdlcjtcbiAgfTtcblxuICBjb25zdCB0cmFjZXJNYW5hZ2VyID0gVHJhY2VyTWFuYWdlci5pbml0KCk7XG5cbiAgaW5pdFN0YXRlKHRyYWNlck1hbmFnZXIpO1xuICBET00uc2V0dXAodHJhY2VyTWFuYWdlcik7XG5cbn07XG5cbkFwcC5wcm90b3R5cGUgPSBDYWNoZTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHA7IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIG1haW4gYXBwbGljYXRpb24gaW5zdGFuY2UuXG4gKiBHZXRzIHBvcHVsYXRlZCBvbiBwYWdlIGxvYWQuIFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHt9OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc2hvd0FsZ29yaXRobSA9IHJlcXVpcmUoJy4vc2hvd19hbGdvcml0aG0nKTtcbmNvbnN0IHNob3dDYXRlZ29yaWVzID0gcmVxdWlyZSgnLi9zaG93X2NhdGVnb3JpZXMnKTtcbmNvbnN0IHNob3dEZXNjcmlwdGlvbiA9IHJlcXVpcmUoJy4vc2hvd19kZXNjcmlwdGlvbicpO1xuY29uc3Qgc2hvd0ZpbGVzID0gcmVxdWlyZSgnLi9zaG93X2ZpbGVzJyk7XG5jb25zdCBzaG93Rmlyc3RBbGdvcml0aG0gPSByZXF1aXJlKCcuL3Nob3dfZmlyc3RfYWxnb3JpdGhtJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzaG93QWxnb3JpdGhtLFxuICBzaG93Q2F0ZWdvcmllcyxcbiAgc2hvd0Rlc2NyaXB0aW9uLFxuICBzaG93RmlsZXMsXG4gIHNob3dGaXJzdEFsZ29yaXRobVxufTsiLCJjb25zdCBzZXR1cERpdmlkZXJzID0gcmVxdWlyZSgnLi9zZXR1cF9kaXZpZGVycycpO1xuY29uc3Qgc2V0dXBEb2N1bWVudCA9IHJlcXVpcmUoJy4vc2V0dXBfZG9jdW1lbnQnKTtcbmNvbnN0IHNldHVwRmlsZXNCYXIgPSByZXF1aXJlKCcuL3NldHVwX2ZpbGVzX2JhcicpO1xuY29uc3Qgc2V0dXBJbnRlcnZhbCA9IHJlcXVpcmUoJy4vc2V0dXBfaW50ZXJ2YWwnKTtcbmNvbnN0IHNldHVwTW9kdWxlQ29udGFpbmVyID0gcmVxdWlyZSgnLi9zZXR1cF9tb2R1bGVfY29udGFpbmVyJyk7XG5jb25zdCBzZXR1cFBvd2VyZWRCeSA9IHJlcXVpcmUoJy4vc2V0dXBfcG93ZXJlZF9ieScpO1xuY29uc3Qgc2V0dXBTY3JhdGNoUGFwZXIgPSByZXF1aXJlKCcuL3NldHVwX3NjcmF0Y2hfcGFwZXInKTtcbmNvbnN0IHNldHVwU2lkZU1lbnUgPSByZXF1aXJlKCcuL3NldHVwX3NpZGVfbWVudScpO1xuY29uc3Qgc2V0dXBUb3BNZW51ID0gcmVxdWlyZSgnLi9zZXR1cF90b3BfbWVudScpO1xuY29uc3Qgc2V0dXBXaW5kb3cgPSByZXF1aXJlKCcuL3NldHVwX3dpbmRvdycpO1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGVsZW1lbnRzIG9uY2UgdGhlIGFwcCBsb2FkcyBpbiB0aGUgRE9NLiBcbiAqL1xuY29uc3Qgc2V0dXAgPSAoKSA9PiB7XG5cbiAgJCgnLmJ0biBpbnB1dCcpLmNsaWNrKChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfSk7XG5cbiAgLy8gZGl2aWRlcnNcbiAgc2V0dXBEaXZpZGVycygpO1xuXG4gIC8vIGRvY3VtZW50XG4gIHNldHVwRG9jdW1lbnQoKTtcblxuICAvLyBmaWxlcyBiYXJcbiAgc2V0dXBGaWxlc0JhcigpO1xuXG4gIC8vIGludGVydmFsXG4gIHNldHVwSW50ZXJ2YWwoKTtcblxuICAvLyBtb2R1bGUgY29udGFpbmVyXG4gIHNldHVwTW9kdWxlQ29udGFpbmVyKCk7XG5cbiAgLy8gcG93ZXJlZCBieVxuICBzZXR1cFBvd2VyZWRCeSgpO1xuXG4gIC8vIHNjcmF0Y2ggcGFwZXJcbiAgc2V0dXBTY3JhdGNoUGFwZXIoKTtcblxuICAvLyBzaWRlIG1lbnVcbiAgc2V0dXBTaWRlTWVudSgpO1xuXG4gIC8vIHRvcCBtZW51XG4gIHNldHVwVG9wTWVudSgpO1xuXG4gIC8vIHdpbmRvd1xuICBzZXR1cFdpbmRvdygpO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0dXBcbn07IiwiY29uc3QgYXBwSW5zdGFuY2UgPSByZXF1aXJlKCcuLi8uLi9hcHAnKTtcblxuY29uc3QgYWRkRGl2aWRlclRvRG9tID0gKGRpdmlkZXIpID0+IHtcbiAgY29uc3QgW3ZlcnRpY2FsLCAkZmlyc3QsICRzZWNvbmRdID0gZGl2aWRlcjtcbiAgY29uc3QgJHBhcmVudCA9ICRmaXJzdC5wYXJlbnQoKTtcbiAgY29uc3QgdGhpY2tuZXNzID0gNTtcblxuICBjb25zdCAkZGl2aWRlciA9ICQoJzxkaXYgY2xhc3M9XCJkaXZpZGVyXCI+Jyk7XG5cbiAgbGV0IGRyYWdnaW5nID0gZmFsc2U7XG4gIGlmICh2ZXJ0aWNhbCkge1xuICAgICRkaXZpZGVyLmFkZENsYXNzKCd2ZXJ0aWNhbCcpO1xuXG4gICAgbGV0IF9sZWZ0ID0gLXRoaWNrbmVzcyAvIDI7XG4gICAgJGRpdmlkZXIuY3NzKHtcbiAgICAgIHRvcDogMCxcbiAgICAgIGJvdHRvbTogMCxcbiAgICAgIGxlZnQ6IF9sZWZ0LFxuICAgICAgd2lkdGg6IHRoaWNrbmVzc1xuICAgIH0pO1xuXG4gICAgbGV0IHg7XG4gICAgJGRpdmlkZXIubW91c2Vkb3duKCh7XG4gICAgICBwYWdlWFxuICAgIH0pID0+IHtcbiAgICAgIHggPSBwYWdlWDtcbiAgICAgIGRyYWdnaW5nID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm1vdXNlbW92ZSgoe1xuICAgICAgcGFnZVhcbiAgICB9KSA9PiB7XG4gICAgICBpZiAoZHJhZ2dpbmcpIHtcbiAgICAgICAgY29uc3QgbmV3X2xlZnQgPSAkc2Vjb25kLnBvc2l0aW9uKCkubGVmdCArIHBhZ2VYIC0geDtcbiAgICAgICAgbGV0IHBlcmNlbnQgPSBuZXdfbGVmdCAvICRwYXJlbnQud2lkdGgoKSAqIDEwMDtcbiAgICAgICAgcGVyY2VudCA9IE1hdGgubWluKDkwLCBNYXRoLm1heCgxMCwgcGVyY2VudCkpO1xuICAgICAgICAkZmlyc3QuY3NzKCdyaWdodCcsICgxMDAgLSBwZXJjZW50KSArICclJyk7XG4gICAgICAgICRzZWNvbmQuY3NzKCdsZWZ0JywgcGVyY2VudCArICclJyk7XG4gICAgICAgIHggPSBwYWdlWDtcbiAgICAgICAgYXBwSW5zdGFuY2UuZ2V0VHJhY2VyTWFuYWdlcigpLnJlc2l6ZSgpO1xuICAgICAgICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5zY3JvbGwoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oZSkge1xuICAgICAgZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICB9KTtcblxuICB9IGVsc2Uge1xuXG4gICAgJGRpdmlkZXIuYWRkQ2xhc3MoJ2hvcml6b250YWwnKTtcbiAgICBjb25zdCBfdG9wID0gLXRoaWNrbmVzcyAvIDI7XG4gICAgJGRpdmlkZXIuY3NzKHtcbiAgICAgIHRvcDogX3RvcCxcbiAgICAgIGhlaWdodDogdGhpY2tuZXNzLFxuICAgICAgbGVmdDogMCxcbiAgICAgIHJpZ2h0OiAwXG4gICAgfSk7XG5cbiAgICBsZXQgeTtcbiAgICAkZGl2aWRlci5tb3VzZWRvd24oZnVuY3Rpb24oe1xuICAgICAgcGFnZVlcbiAgICB9KSB7XG4gICAgICB5ID0gcGFnZVk7XG4gICAgICBkcmFnZ2luZyA9IHRydWU7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5tb3VzZW1vdmUoZnVuY3Rpb24oe1xuICAgICAgcGFnZVlcbiAgICB9KSB7XG4gICAgICBpZiAoZHJhZ2dpbmcpIHtcbiAgICAgICAgY29uc3QgbmV3X3RvcCA9ICRzZWNvbmQucG9zaXRpb24oKS50b3AgKyBwYWdlWSAtIHk7XG4gICAgICAgIGxldCBwZXJjZW50ID0gbmV3X3RvcCAvICRwYXJlbnQuaGVpZ2h0KCkgKiAxMDA7XG4gICAgICAgIHBlcmNlbnQgPSBNYXRoLm1pbig5MCwgTWF0aC5tYXgoMTAsIHBlcmNlbnQpKTtcbiAgICAgICAgJGZpcnN0LmNzcygnYm90dG9tJywgKDEwMCAtIHBlcmNlbnQpICsgJyUnKTtcbiAgICAgICAgJHNlY29uZC5jc3MoJ3RvcCcsIHBlcmNlbnQgKyAnJScpO1xuICAgICAgICB5ID0gcGFnZVk7XG4gICAgICAgIGFwcEluc3RhbmNlLmdldFRyYWNlck1hbmFnZXIoKS5yZXNpemUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oZSkge1xuICAgICAgZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gICRzZWNvbmQuYXBwZW5kKCRkaXZpZGVyKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuICBjb25zdCBkaXZpZGVycyA9IFtcbiAgICBbJ3YnLCAkKCcuc2lkZW1lbnUnKSwgJCgnLndvcmtzcGFjZScpXSxcbiAgICBbJ3YnLCAkKCcudmlld2VyX2NvbnRhaW5lcicpLCAkKCcuZWRpdG9yX2NvbnRhaW5lcicpXSxcbiAgICBbJ2gnLCAkKCcuZGF0YV9jb250YWluZXInKSwgJCgnLmNvZGVfY29udGFpbmVyJyldXG4gIF07XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGl2aWRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICBhZGREaXZpZGVyVG9Eb20oZGl2aWRlcnNbaV0pO1xuICB9XG59IiwiY29uc3QgYXBwSW5zdGFuY2UgPSByZXF1aXJlKCcuLi8uLi9hcHAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG4gICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdhJywgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZiAoIXdpbmRvdy5vcGVuKCQodGhpcykuYXR0cignaHJlZicpLCAnX2JsYW5rJykpIHtcbiAgICAgIGFsZXJ0KCdQbGVhc2UgYWxsb3cgcG9wdXBzIGZvciB0aGlzIHNpdGUnKTtcbiAgICB9XG4gIH0pO1xuXG4gICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oZSkge1xuICAgIGFwcEluc3RhbmNlLmdldFRyYWNlck1hbmFnZXIoKS5jb21tYW5kKCdtb3VzZXVwJywgZSk7XG4gIH0pO1xufTsiLCJjb25zdCBkZWZpbml0ZWx5QmlnZ2VyID0gKHgsIHkpID0+IHggPiAoeSArIDIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcblxuICAkKCcuZmlsZXNfYmFyID4gLmJ0bi1sZWZ0JykuY2xpY2soKCkgPT4ge1xuICAgIGNvbnN0ICR3cmFwcGVyID0gJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyJyk7XG4gICAgY29uc3QgY2xpcFdpZHRoID0gJHdyYXBwZXIud2lkdGgoKTtcbiAgICBjb25zdCBzY3JvbGxMZWZ0ID0gJHdyYXBwZXIuc2Nyb2xsTGVmdCgpO1xuXG4gICAgJCgkd3JhcHBlci5jaGlsZHJlbignYnV0dG9uJykuZ2V0KCkucmV2ZXJzZSgpKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbGVmdCA9ICQodGhpcykucG9zaXRpb24oKS5sZWZ0O1xuICAgICAgY29uc3QgcmlnaHQgPSBsZWZ0ICsgJCh0aGlzKS5vdXRlcldpZHRoKCk7XG4gICAgICBpZiAoMCA+IGxlZnQpIHtcbiAgICAgICAgJHdyYXBwZXIuc2Nyb2xsTGVmdChzY3JvbGxMZWZ0ICsgcmlnaHQgLSBjbGlwV2lkdGgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gICQoJy5maWxlc19iYXIgPiAuYnRuLXJpZ2h0JykuY2xpY2soKCkgPT4ge1xuICAgIGNvbnN0ICR3cmFwcGVyID0gJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyJyk7XG4gICAgY29uc3QgY2xpcFdpZHRoID0gJHdyYXBwZXIud2lkdGgoKTtcbiAgICBjb25zdCBzY3JvbGxMZWZ0ID0gJHdyYXBwZXIuc2Nyb2xsTGVmdCgpO1xuXG4gICAgJHdyYXBwZXIuY2hpbGRyZW4oJ2J1dHRvbicpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBsZWZ0ID0gJCh0aGlzKS5wb3NpdGlvbigpLmxlZnQ7XG4gICAgICBjb25zdCByaWdodCA9IGxlZnQgKyAkKHRoaXMpLm91dGVyV2lkdGgoKTtcbiAgICAgIGlmIChjbGlwV2lkdGggPCByaWdodCkge1xuICAgICAgICAkd3JhcHBlci5zY3JvbGxMZWZ0KHNjcm9sbExlZnQgKyBsZWZ0KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5zY3JvbGwoZnVuY3Rpb24oKSB7XG5cbiAgICBjb25zdCAkd3JhcHBlciA9ICQoJy5maWxlc19iYXIgPiAud3JhcHBlcicpO1xuICAgIGNvbnN0IGNsaXBXaWR0aCA9ICR3cmFwcGVyLndpZHRoKCk7XG4gICAgY29uc3QgJGxlZnQgPSAkd3JhcHBlci5jaGlsZHJlbignYnV0dG9uOmZpcnN0LWNoaWxkJyk7XG4gICAgY29uc3QgJHJpZ2h0ID0gJHdyYXBwZXIuY2hpbGRyZW4oJ2J1dHRvbjpsYXN0LWNoaWxkJyk7XG4gICAgY29uc3QgbGVmdCA9ICRsZWZ0LnBvc2l0aW9uKCkubGVmdDtcbiAgICBjb25zdCByaWdodCA9ICRyaWdodC5wb3NpdGlvbigpLmxlZnQgKyAkcmlnaHQub3V0ZXJXaWR0aCgpO1xuXG4gICAgaWYgKGRlZmluaXRlbHlCaWdnZXIoMCwgbGVmdCkgJiYgZGVmaW5pdGVseUJpZ2dlcihjbGlwV2lkdGgsIHJpZ2h0KSkge1xuICAgICAgY29uc3Qgc2Nyb2xsTGVmdCA9ICR3cmFwcGVyLnNjcm9sbExlZnQoKTtcbiAgICAgICR3cmFwcGVyLnNjcm9sbExlZnQoc2Nyb2xsTGVmdCArIGNsaXBXaWR0aCAtIHJpZ2h0KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsZWZ0ZXIgPSBkZWZpbml0ZWx5QmlnZ2VyKDAsIGxlZnQpO1xuICAgIGNvbnN0IHJpZ2h0ZXIgPSBkZWZpbml0ZWx5QmlnZ2VyKHJpZ2h0LCBjbGlwV2lkdGgpO1xuICAgICR3cmFwcGVyLnRvZ2dsZUNsYXNzKCdzaGFkb3ctbGVmdCcsIGxlZnRlcik7XG4gICAgJHdyYXBwZXIudG9nZ2xlQ2xhc3MoJ3NoYWRvdy1yaWdodCcsIHJpZ2h0ZXIpO1xuICAgICQoJy5maWxlc19iYXIgPiAuYnRuLWxlZnQnKS5hdHRyKCdkaXNhYmxlZCcsICFsZWZ0ZXIpO1xuICAgICQoJy5maWxlc19iYXIgPiAuYnRuLXJpZ2h0JykuYXR0cignZGlzYWJsZWQnLCAhcmlnaHRlcik7XG4gIH0pO1xufSIsImNvbnN0IGFwcEluc3RhbmNlID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5jb25zdCBUb2FzdCA9IHJlcXVpcmUoJy4uL3RvYXN0Jyk7XG5cbmNvbnN0IHtcbiAgcGFyc2VGbG9hdFxufSA9IE51bWJlcjtcblxuY29uc3QgbWluSW50ZXJ2YWwgPSAwLjE7XG5jb25zdCBtYXhJbnRlcnZhbCA9IDEwO1xuY29uc3Qgc3RhcnRJbnRlcnZhbCA9IDAuNTtcbmNvbnN0IHN0ZXBJbnRlcnZhbCA9IDAuMTtcblxuY29uc3Qgbm9ybWFsaXplID0gKHNlYykgPT4ge1xuXG5cbiAgbGV0IGludGVydmFsO1xuICBsZXQgbWVzc2FnZTtcbiAgaWYgKHNlYyA8IG1pbkludGVydmFsKSB7XG4gICAgaW50ZXJ2YWwgPSBtaW5JbnRlcnZhbDtcbiAgICBtZXNzYWdlID0gYEludGVydmFsIG9mICR7c2VjfSBzZWNvbmRzIGlzIHRvbyBsb3cuIFNldHRpbmcgdG8gbWluIGFsbG93ZWQgaW50ZXJ2YWwgb2YgJHttaW5JbnRlcnZhbH0gc2Vjb25kKHMpLmA7XG4gIH0gZWxzZSBpZiAoc2VjID4gbWF4SW50ZXJ2YWwpIHtcbiAgICBpbnRlcnZhbCA9IG1pbkludGVydmFsO1xuICAgIG1lc3NhZ2UgPSBgSW50ZXJ2YWwgb2YgJHtzZWN9IHNlY29uZHMgaXMgdG9vIGhpZ2guIFNldHRpbmcgdG8gbWF4IGFsbG93ZWQgaW50ZXJ2YWwgb2YgJHttYXhJbnRlcnZhbH0gc2Vjb25kKHMpLmA7XG4gIH0gZWxzZSB7XG4gICAgaW50ZXJ2YWwgPSBzZWM7XG4gICAgbWVzc2FnZSA9IGBJbnRlcnZhbCBoYXMgYmVlbiBzZXQgdG8gJHtzZWN9IHNlY29uZChzKS5gXG4gIH1cblxuICByZXR1cm4gW2ludGVydmFsLCBtZXNzYWdlXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuXG4gIGNvbnN0ICRpbnRlcnZhbCA9ICQoJyNpbnRlcnZhbCcpO1xuICAkaW50ZXJ2YWwudmFsKHN0YXJ0SW50ZXJ2YWwpO1xuICAkaW50ZXJ2YWwuYXR0cih7XG4gICAgbWF4OiBtYXhJbnRlcnZhbCxcbiAgICBtaW46IG1pbkludGVydmFsLFxuICAgIHN0ZXA6IHN0ZXBJbnRlcnZhbFxuICB9KTtcblxuICAkKCcjaW50ZXJ2YWwnKS5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgdHJhY2VyTWFuYWdlciA9IGFwcEluc3RhbmNlLmdldFRyYWNlck1hbmFnZXIoKTtcbiAgICBjb25zdCBbc2Vjb25kcywgbWVzc2FnZV0gPSBub3JtYWxpemUocGFyc2VGbG9hdCgkKHRoaXMpLnZhbCgpKSk7XG5cbiAgICAkKHRoaXMpLnZhbChzZWNvbmRzKTtcbiAgICB0cmFjZXJNYW5hZ2VyLmludGVydmFsID0gc2Vjb25kcyAqIDEwMDA7XG4gICAgVG9hc3Quc2hvd0luZm9Ub2FzdChtZXNzYWdlKTtcbiAgfSk7XG59OyIsImNvbnN0IGFwcEluc3RhbmNlID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuXG4gIGNvbnN0ICRtb2R1bGVfY29udGFpbmVyID0gJCgnLm1vZHVsZV9jb250YWluZXInKTtcblxuICAkbW9kdWxlX2NvbnRhaW5lci5vbignbW91c2Vkb3duJywgJy5tb2R1bGVfd3JhcHBlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICBhcHBJbnN0YW5jZS5nZXRUcmFjZXJNYW5hZ2VyKCkuZmluZE93bmVyKHRoaXMpLm1vdXNlZG93bihlKTtcbiAgfSk7XG5cbiAgJG1vZHVsZV9jb250YWluZXIub24oJ21vdXNlbW92ZScsICcubW9kdWxlX3dyYXBwZXInLCBmdW5jdGlvbihlKSB7XG4gICAgYXBwSW5zdGFuY2UuZ2V0VHJhY2VyTWFuYWdlcigpLmZpbmRPd25lcih0aGlzKS5tb3VzZW1vdmUoZSk7XG4gIH0pO1xuXG4gICRtb2R1bGVfY29udGFpbmVyLm9uKCdET01Nb3VzZVNjcm9sbCBtb3VzZXdoZWVsJywgJy5tb2R1bGVfd3JhcHBlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICBhcHBJbnN0YW5jZS5nZXRUcmFjZXJNYW5hZ2VyKCkuZmluZE93bmVyKHRoaXMpLm1vdXNld2hlZWwoZSk7XG4gIH0pO1xufSIsIm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuICAkKCcjcG93ZXJlZC1ieScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICQoJyNwb3dlcmVkLWJ5LWxpc3QgYnV0dG9uJykudG9nZ2xlQ2xhc3MoJ2NvbGxhcHNlJyk7XG4gIH0pO1xufTsiLCJjb25zdCBTZXJ2ZXIgPSByZXF1aXJlKCcuLi8uLi9zZXJ2ZXInKTtcbmNvbnN0IHNob3dBbGdvcml0aG0gPSByZXF1aXJlKCcuLi9zaG93X2FsZ29yaXRobScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgJCgnI3NjcmF0Y2gtcGFwZXInKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICBjb25zdCBjYXRlZ29yeSA9IG51bGw7XG4gICAgY29uc3QgYWxnb3JpdGhtID0gJ3NjcmF0Y2hfcGFwZXInO1xuICAgIFNlcnZlci5sb2FkQWxnb3JpdGhtKGNhdGVnb3J5LCBhbGdvcml0aG0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIHNob3dBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YSk7XG4gICAgfSk7XG4gIH0pO1xufTsiLCJjb25zdCBhcHBJbnN0YW5jZSA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xuXG5sZXQgc2lkZW1lbnVfcGVyY2VudDtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG4gICQoJyNuYXZpZ2F0aW9uJykuY2xpY2soKCkgPT4ge1xuICAgIGNvbnN0ICRzaWRlbWVudSA9ICQoJy5zaWRlbWVudScpO1xuICAgIGNvbnN0ICR3b3Jrc3BhY2UgPSAkKCcud29ya3NwYWNlJyk7XG5cbiAgICAkc2lkZW1lbnUudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQoJy5uYXYtZHJvcGRvd24nKS50b2dnbGVDbGFzcygnZmEtY2FyZXQtZG93biBmYS1jYXJldC11cCcpO1xuXG4gICAgaWYgKCRzaWRlbWVudS5oYXNDbGFzcygnYWN0aXZlJykpIHtcbiAgICAgICRzaWRlbWVudS5jc3MoJ3JpZ2h0JywgKDEwMCAtIHNpZGVtZW51X3BlcmNlbnQpICsgJyUnKTtcbiAgICAgICR3b3Jrc3BhY2UuY3NzKCdsZWZ0Jywgc2lkZW1lbnVfcGVyY2VudCArICclJyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgc2lkZW1lbnVfcGVyY2VudCA9ICR3b3Jrc3BhY2UucG9zaXRpb24oKS5sZWZ0IC8gJCgnYm9keScpLndpZHRoKCkgKiAxMDA7XG4gICAgICAkc2lkZW1lbnUuY3NzKCdyaWdodCcsIDApO1xuICAgICAgJHdvcmtzcGFjZS5jc3MoJ2xlZnQnLCAwKTtcbiAgICB9XG5cbiAgICBhcHBJbnN0YW5jZS5nZXRUcmFjZXJNYW5hZ2VyKCkucmVzaXplKCk7XG4gIH0pO1xufSIsImNvbnN0IGFwcEluc3RhbmNlID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5jb25zdCBTZXJ2ZXIgPSByZXF1aXJlKCcuLi8uLi9zZXJ2ZXInKTtcbmNvbnN0IFRvYXN0ID0gcmVxdWlyZSgnLi4vdG9hc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG5cbiAgLy8gc2hhcmVkXG4gICQoJyNzaGFyZWQnKS5tb3VzZXVwKGZ1bmN0aW9uKCkge1xuICAgICQodGhpcykuc2VsZWN0KCk7XG4gIH0pO1xuXG4gICQoJyNidG5fc2hhcmUnKS5jbGljayhmdW5jdGlvbigpIHtcblxuICAgIGNvbnN0ICRpY29uID0gJCh0aGlzKS5maW5kKCcuZmEtc2hhcmUnKTtcbiAgICAkaWNvbi5hZGRDbGFzcygnZmEtc3BpbiBmYS1zcGluLWZhc3RlcicpO1xuXG4gICAgU2VydmVyLnNoYXJlU2NyYXRjaFBhcGVyKCkudGhlbigodXJsKSA9PiB7XG4gICAgICAkaWNvbi5yZW1vdmVDbGFzcygnZmEtc3BpbiBmYS1zcGluLWZhc3RlcicpO1xuICAgICAgJCgnI3NoYXJlZCcpLnJlbW92ZUNsYXNzKCdjb2xsYXBzZScpO1xuICAgICAgJCgnI3NoYXJlZCcpLnZhbCh1cmwpO1xuICAgICAgVG9hc3Quc2hvd0luZm9Ub2FzdCgnU2hhcmVhYmxlIGxpbmsgaXMgY3JlYXRlZC4nKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gY29udHJvbFxuXG4gICQoJyNidG5fcnVuJykuY2xpY2soKCkgPT4ge1xuICAgICQoJyNidG5fdHJhY2UnKS5jbGljaygpO1xuICAgIHZhciBlcnIgPSBhcHBJbnN0YW5jZS5nZXRFZGl0b3IoKS5leGVjdXRlKCk7XG4gICAgaWYgKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgVG9hc3Quc2hvd0Vycm9yVG9hc3QoZXJyKTtcbiAgICB9XG4gIH0pO1xuICAkKCcjYnRuX3BhdXNlJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgaWYgKGFwcEluc3RhbmNlLmdldFRyYWNlck1hbmFnZXIoKS5pc1BhdXNlKCkpIHtcbiAgICAgIGFwcEluc3RhbmNlLmdldFRyYWNlck1hbmFnZXIoKS5yZXN1bWVTdGVwKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwcEluc3RhbmNlLmdldFRyYWNlck1hbmFnZXIoKS5wYXVzZVN0ZXAoKTtcbiAgICB9XG4gIH0pO1xuICAkKCcjYnRuX3ByZXYnKS5jbGljaygoKSA9PiB7XG4gICAgYXBwSW5zdGFuY2UuZ2V0VHJhY2VyTWFuYWdlcigpLnBhdXNlU3RlcCgpO1xuICAgIGFwcEluc3RhbmNlLmdldFRyYWNlck1hbmFnZXIoKS5wcmV2U3RlcCgpO1xuICB9KTtcbiAgJCgnI2J0bl9uZXh0JykuY2xpY2soKCkgPT4ge1xuICAgIGFwcEluc3RhbmNlLmdldFRyYWNlck1hbmFnZXIoKS5wYXVzZVN0ZXAoKTtcbiAgICBhcHBJbnN0YW5jZS5nZXRUcmFjZXJNYW5hZ2VyKCkubmV4dFN0ZXAoKTtcbiAgfSk7XG5cbiAgLy8gZGVzY3JpcHRpb24gJiB0cmFjZVxuXG4gICQoJyNidG5fZGVzYycpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICQoJy50YWJfY29udGFpbmVyID4gLnRhYicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCcjdGFiX2Rlc2MnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgnLnRhYl9iYXIgPiBidXR0b24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gIH0pO1xuXG4gICQoJyNidG5fdHJhY2UnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAkKCcudGFiX2NvbnRhaW5lciA+IC50YWInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgnI3RhYl9tb2R1bGUnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgnLnRhYl9iYXIgPiBidXR0b24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gIH0pO1xuXG59OyIsImNvbnN0IGFwcEluc3RhbmNlID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XG4gICAgYXBwSW5zdGFuY2UuZ2V0VHJhY2VyTWFuYWdlcigpLnJlc2l6ZSgpO1xuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBhcHBJbnN0YW5jZSA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuY29uc3Qge1xuICBpc1NjcmF0Y2hQYXBlclxufSA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbmNvbnN0IHNob3dEZXNjcmlwdGlvbiA9IHJlcXVpcmUoJy4vc2hvd19kZXNjcmlwdGlvbicpO1xuY29uc3Qgc2hvd0ZpbGVzID0gcmVxdWlyZSgnLi9zaG93X2ZpbGVzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YSkgPT4ge1xuICBsZXQgJG1lbnU7XG4gIGxldCBjYXRlZ29yeV9uYW1lO1xuICBsZXQgYWxnb3JpdGhtX25hbWU7XG5cbiAgaWYgKGlzU2NyYXRjaFBhcGVyKGNhdGVnb3J5LCBhbGdvcml0aG0pKSB7XG4gICAgJG1lbnUgPSAkKCcjc2NyYXRjaC1wYXBlcicpO1xuICAgIGNhdGVnb3J5X25hbWUgPSAnJztcbiAgICBhbGdvcml0aG1fbmFtZSA9ICdTY3JhdGNoIFBhcGVyJztcbiAgfSBlbHNlIHtcbiAgICAkbWVudSA9ICQoYFtkYXRhLWNhdGVnb3J5PVwiJHtjYXRlZ29yeX1cIl1bZGF0YS1hbGdvcml0aG09XCIke2FsZ29yaXRobX1cIl1gKTtcbiAgICBjb25zdCBjYXRlZ29yeU9iaiA9IGFwcEluc3RhbmNlLmdldENhdGVnb3J5KGNhdGVnb3J5KTtcbiAgICBjYXRlZ29yeV9uYW1lID0gY2F0ZWdvcnlPYmoubmFtZTtcbiAgICBhbGdvcml0aG1fbmFtZSA9IGNhdGVnb3J5T2JqLmxpc3RbYWxnb3JpdGhtXTtcbiAgfVxuXG4gICQoJy5zaWRlbWVudSBidXR0b24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICRtZW51LmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgJCgnI2J0bl9kZXNjJykuY2xpY2soKTtcblxuICAkKCcjY2F0ZWdvcnknKS5odG1sKGNhdGVnb3J5X25hbWUpO1xuICAkKCcjYWxnb3JpdGhtJykuaHRtbChhbGdvcml0aG1fbmFtZSk7XG4gICQoJyN0YWJfZGVzYyA+IC53cmFwcGVyJykuZW1wdHkoKTtcbiAgJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyJykuZW1wdHkoKTtcbiAgJCgnI2V4cGxhbmF0aW9uJykuaHRtbCgnJyk7XG5cbiAgYXBwSW5zdGFuY2Uuc2V0TGFzdEZpbGVVc2VkKG51bGwpO1xuICBhcHBJbnN0YW5jZS5nZXRFZGl0b3IoKS5jbGVhckNvbnRlbnQoKTtcblxuICBjb25zdCB7XG4gICAgZmlsZXNcbiAgfSA9IGRhdGE7XG5cbiAgZGVsZXRlIGRhdGEuZmlsZXM7XG5cbiAgc2hvd0Rlc2NyaXB0aW9uKGRhdGEpO1xuICBzaG93RmlsZXMoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZXMpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGFwcEluc3RhbmNlID0gcmVxdWlyZSgnLi4vYXBwJyk7XG5jb25zdCBTZXJ2ZXIgPSByZXF1aXJlKCcuLi9zZXJ2ZXInKTtcbmNvbnN0IHNob3dBbGdvcml0aG0gPSByZXF1aXJlKCcuL3Nob3dfYWxnb3JpdGhtJyk7XG5cbmNvbnN0IHtcbiAgZWFjaFxufSA9ICQ7XG5cbmNvbnN0IGFkZEFsZ29yaXRobVRvQ2F0ZWdvcnlET00gPSAoY2F0ZWdvcnksIHN1Ykxpc3QsIGFsZ29yaXRobSkgPT4ge1xuICBjb25zdCAkYWxnb3JpdGhtID0gJCgnPGJ1dHRvbiBjbGFzcz1cImluZGVudCBjb2xsYXBzZVwiPicpXG4gICAgLmFwcGVuZChzdWJMaXN0W2FsZ29yaXRobV0pXG4gICAgLmF0dHIoJ2RhdGEtYWxnb3JpdGhtJywgYWxnb3JpdGhtKVxuICAgIC5hdHRyKCdkYXRhLWNhdGVnb3J5JywgY2F0ZWdvcnkpXG4gICAgLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgU2VydmVyLmxvYWRBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBzaG93QWxnb3JpdGhtKGNhdGVnb3J5LCBhbGdvcml0aG0sIGRhdGEpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgJCgnI2xpc3QnKS5hcHBlbmQoJGFsZ29yaXRobSk7XG59O1xuXG5jb25zdCBhZGRDYXRlZ29yeVRvRE9NID0gKGNhdGVnb3J5KSA9PiB7XG5cbiAgY29uc3Qge1xuICAgIG5hbWU6IGNhdGVnb3J5TmFtZSxcbiAgICBsaXN0OiBjYXRlZ29yeVN1Ykxpc3RcbiAgfSA9IGFwcEluc3RhbmNlLmdldENhdGVnb3J5KGNhdGVnb3J5KTtcblxuICBjb25zdCAkY2F0ZWdvcnkgPSAkKCc8YnV0dG9uIGNsYXNzPVwiY2F0ZWdvcnlcIj4nKVxuICAgIC5hcHBlbmQoJzxpIGNsYXNzPVwiZmEgZmEtZncgZmEtY2FyZXQtcmlnaHRcIj4nKVxuICAgIC5hcHBlbmQoY2F0ZWdvcnlOYW1lKTtcblxuICAkY2F0ZWdvcnkuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgJChgW2RhdGEtY2F0ZWdvcnk9XCIke2NhdGVnb3J5fVwiXWApLnRvZ2dsZUNsYXNzKCdjb2xsYXBzZScpO1xuICAgICQodGhpcykuZmluZCgnaS5mYScpLnRvZ2dsZUNsYXNzKCdmYS1jYXJldC1yaWdodCBmYS1jYXJldC1kb3duJyk7XG4gIH0pO1xuXG4gICQoJyNsaXN0JykuYXBwZW5kKCRjYXRlZ29yeSk7XG5cbiAgZWFjaChjYXRlZ29yeVN1Ykxpc3QsIChhbGdvcml0aG0pID0+IHtcbiAgICBhZGRBbGdvcml0aG1Ub0NhdGVnb3J5RE9NKGNhdGVnb3J5LCBjYXRlZ29yeVN1Ykxpc3QsIGFsZ29yaXRobSk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG4gIGVhY2goYXBwSW5zdGFuY2UuZ2V0Q2F0ZWdvcmllcygpLCBhZGRDYXRlZ29yeVRvRE9NKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB7XG4gIGlzQXJyYXlcbn0gPSBBcnJheTtcblxuY29uc3Qge1xuICBlYWNoXG59ID0gJDtcblxubW9kdWxlLmV4cG9ydHMgPSAoZGF0YSkgPT4ge1xuICBjb25zdCAkY29udGFpbmVyID0gJCgnI3RhYl9kZXNjID4gLndyYXBwZXInKTtcbiAgJGNvbnRhaW5lci5lbXB0eSgpO1xuXG4gIGVhY2goZGF0YSwgKGtleSwgdmFsdWUpID0+IHtcblxuICAgIGlmIChrZXkpIHtcbiAgICAgICRjb250YWluZXIuYXBwZW5kKCQoJzxoMz4nKS5odG1sKGtleSkpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAkY29udGFpbmVyLmFwcGVuZCgkKCc8cD4nKS5odG1sKHZhbHVlKSk7XG5cbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG5cbiAgICAgIGNvbnN0ICR1bCA9ICQoJzx1bD4nKTtcbiAgICAgICRjb250YWluZXIuYXBwZW5kKCR1bCk7XG5cbiAgICAgIHZhbHVlLmZvckVhY2goKGxpKSA9PiB7XG4gICAgICAgICR1bC5hcHBlbmQoJCgnPGxpPicpLmh0bWwobGkpKTtcbiAgICAgIH0pO1xuXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG5cbiAgICAgIGNvbnN0ICR1bCA9ICQoJzx1bD4nKTtcbiAgICAgICRjb250YWluZXIuYXBwZW5kKCR1bCk7XG5cbiAgICAgIGVhY2godmFsdWUsIChwcm9wKSA9PiB7XG4gICAgICAgICR1bC5hcHBlbmQoJCgnPGxpPicpLmFwcGVuZCgkKCc8c3Ryb25nPicpLmh0bWwocHJvcCkpLmFwcGVuZChgICR7dmFsdWVbcHJvcF19YCkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBTZXJ2ZXIgPSByZXF1aXJlKCcuLi9zZXJ2ZXInKTtcblxuY29uc3Qge1xuICBlYWNoXG59ID0gJDtcblxuY29uc3QgYWRkRmlsZVRvRE9NID0gKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUsIGV4cGxhbmF0aW9uKSA9PiB7XG4gIHZhciAkZmlsZSA9ICQoJzxidXR0b24+JykuYXBwZW5kKGZpbGUpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgIFNlcnZlci5sb2FkRmlsZShjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlLCBleHBsYW5hdGlvbik7XG4gICAgJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyID4gYnV0dG9uJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICB9KTtcbiAgJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyJykuYXBwZW5kKCRmaWxlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGVzKSA9PiB7XG4gICQoJy5maWxlc19iYXIgPiAud3JhcHBlcicpLmVtcHR5KCk7XG5cbiAgZWFjaChmaWxlcywgKGZpbGUsIGV4cGxhbmF0aW9uKSA9PiB7XG4gICAgYWRkRmlsZVRvRE9NKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUsIGV4cGxhbmF0aW9uKTtcbiAgfSk7XG5cbiAgJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyID4gYnV0dG9uJykuZmlyc3QoKS5jbGljaygpO1xuICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5zY3JvbGwoKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBjbGljayB0aGUgZmlyc3QgYWxnb3JpdGhtIGluIHRoZSBmaXJzdCBjYXRlZ29yeVxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG4gICQoJyNsaXN0IGJ1dHRvbi5jYXRlZ29yeScpLmZpcnN0KCkuY2xpY2soKTtcbiAgJCgnI2xpc3QgYnV0dG9uLmNhdGVnb3J5ICsgLmluZGVudCcpLmZpcnN0KCkuY2xpY2soKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBzaG93VG9hc3QgPSAoZGF0YSwgdHlwZSkgPT4ge1xuICBjb25zdCAkdG9hc3QgPSAkKGA8ZGl2IGNsYXNzPVwidG9hc3QgJHt0eXBlfVwiPmApLmFwcGVuZChkYXRhKTtcblxuICAkKCcudG9hc3RfY29udGFpbmVyJykuYXBwZW5kKCR0b2FzdCk7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICR0b2FzdC5mYWRlT3V0KCgpID0+IHtcbiAgICAgICR0b2FzdC5yZW1vdmUoKTtcbiAgICB9KTtcbiAgfSwgMzAwMCk7XG59O1xuXG5jb25zdCBzaG93RXJyb3JUb2FzdCA9IChlcnIpID0+IHtcbiAgc2hvd1RvYXN0KGVyciwgJ2Vycm9yJyk7XG59O1xuXG5jb25zdCBzaG93SW5mb1RvYXN0ID0gKGVycikgPT4ge1xuICBzaG93VG9hc3QoZXJyLCAnaW5mbycpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNob3dFcnJvclRvYXN0LFxuICBzaG93SW5mb1RvYXN0XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpZCkge1xuICBjb25zdCBlZGl0b3IgPSBhY2UuZWRpdChpZCk7XG5cbiAgZWRpdG9yLnNldE9wdGlvbnMoe1xuICAgIGVuYWJsZUJhc2ljQXV0b2NvbXBsZXRpb246IHRydWUsXG4gICAgZW5hYmxlU25pcHBldHM6IHRydWUsXG4gICAgZW5hYmxlTGl2ZUF1dG9jb21wbGV0aW9uOiB0cnVlXG4gIH0pO1xuXG4gIGVkaXRvci5zZXRUaGVtZSgnYWNlL3RoZW1lL3RvbW9ycm93X25pZ2h0X2VpZ2h0aWVzJyk7XG4gIGVkaXRvci5zZXNzaW9uLnNldE1vZGUoJ2FjZS9tb2RlL2phdmFzY3JpcHQnKTtcbiAgZWRpdG9yLiRibG9ja1Njcm9sbGluZyA9IEluZmluaXR5O1xuXG4gIHJldHVybiBlZGl0b3I7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZXhlY3V0ZSA9ICh0cmFjZXJNYW5hZ2VyLCBjb2RlKSA9PiB7XG4gIC8vIGFsbCBtb2R1bGVzIGF2YWlsYWJsZSB0byBldmFsIGFyZSBvYnRhaW5lZCBmcm9tIHdpbmRvd1xuICB0cnkge1xuICAgIHRyYWNlck1hbmFnZXIuZGVhbGxvY2F0ZUFsbCgpO1xuICAgIGV2YWwoY29kZSk7XG4gICAgdHJhY2VyTWFuYWdlci52aXN1YWxpemUoKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIGVycjtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cmFjZXJNYW5hZ2VyLnJlbW92ZVVuYWxsb2NhdGVkKCk7XG4gIH1cbn07XG5cbmNvbnN0IGV4ZWN1dGVEYXRhID0gKHRyYWNlck1hbmFnZXIsIGFsZ29EYXRhKSA9PiB7XG4gIHJldHVybiBleGVjdXRlKHRyYWNlck1hbmFnZXIsIGFsZ29EYXRhKTtcbn07XG5cbmNvbnN0IGV4ZWN1dGVEYXRhQW5kQ29kZSA9ICh0cmFjZXJNYW5hZ2VyLCBhbGdvRGF0YSwgYWxnb0NvZGUpID0+IHtcbiAgcmV0dXJuIGV4ZWN1dGUodHJhY2VyTWFuYWdlciwgYCR7YWxnb0RhdGF9OyR7YWxnb0NvZGV9YCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZXhlY3V0ZURhdGEsXG4gIGV4ZWN1dGVEYXRhQW5kQ29kZVxufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGFwcEluc3RhbmNlID0gcmVxdWlyZSgnLi4vYXBwJyk7XG5jb25zdCBjcmVhdGVFZGl0b3IgPSByZXF1aXJlKCcuL2NyZWF0ZScpO1xuY29uc3QgRXhlY3V0b3IgPSByZXF1aXJlKCcuL2V4ZWN1dG9yJyk7XG5cbmZ1bmN0aW9uIEVkaXRvcih0cmFjZXJNYW5hZ2VyKSB7XG4gIGlmICghdHJhY2VyTWFuYWdlcikge1xuICAgIHRocm93ICdDYW5ub3QgY3JlYXRlIEVkaXRvci4gTWlzc2luZyB0aGUgdHJhY2VyTWFuYWdlcic7XG4gIH1cblxuICBhY2UucmVxdWlyZSgnYWNlL2V4dC9sYW5ndWFnZV90b29scycpO1xuXG4gIHRoaXMuZGF0YUVkaXRvciA9IGNyZWF0ZUVkaXRvcignZGF0YScpO1xuICB0aGlzLmNvZGVFZGl0b3IgPSBjcmVhdGVFZGl0b3IoJ2NvZGUnKTtcblxuICAvLyBTZXR0aW5nIGRhdGFcblxuICB0aGlzLnNldERhdGEgPSAoZGF0YSkgPT4ge1xuICAgIHRoaXMuZGF0YUVkaXRvci5zZXRWYWx1ZShkYXRhLCAtMSk7XG4gIH07XG5cbiAgdGhpcy5zZXRDb2RlID0gKGNvZGUpID0+IHtcbiAgICB0aGlzLmNvZGVFZGl0b3Iuc2V0VmFsdWUoY29kZSwgLTEpO1xuICB9O1xuXG4gIHRoaXMuc2V0Q29udGVudCA9ICgoe1xuICAgIGRhdGEsXG4gICAgY29kZVxuICB9KSA9PiB7XG4gICAgdGhpcy5zZXREYXRhKGRhdGEpO1xuICAgIHRoaXMuc2V0Q29kZShjb2RlKTtcbiAgfSk7XG5cbiAgLy8gQ2xlYXJpbmcgZGF0YVxuXG4gIHRoaXMuY2xlYXJEYXRhID0gKCkgPT4ge1xuICAgIHRoaXMuZGF0YUVkaXRvci5zZXRWYWx1ZSgnJyk7XG4gIH07XG5cbiAgdGhpcy5jbGVhckNvZGUgPSAoKSA9PiB7XG4gICAgdGhpcy5jb2RlRWRpdG9yLnNldFZhbHVlKCcnKTtcbiAgfTtcblxuICB0aGlzLmNsZWFyQ29udGVudCA9ICgpID0+IHtcbiAgICB0aGlzLmNsZWFyRGF0YSgpO1xuICAgIHRoaXMuY2xlYXJDb2RlKCk7XG4gIH07XG5cbiAgdGhpcy5leGVjdXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGFFZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICBjb25zdCBjb2RlID0gdGhpcy5jb2RlRWRpdG9yLmdldFZhbHVlKCk7XG4gICAgcmV0dXJuIEV4ZWN1dG9yLmV4ZWN1dGVEYXRhQW5kQ29kZSh0cmFjZXJNYW5hZ2VyLCBkYXRhLCBjb2RlKTtcbiAgfTtcblxuICAvLyBsaXN0ZW5lcnNcblxuICB0aGlzLmRhdGFFZGl0b3Iub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5kYXRhRWRpdG9yLmdldFZhbHVlKCk7XG4gICAgY29uc3QgbGFzdEZpbGVVc2VkID0gYXBwSW5zdGFuY2UuZ2V0TGFzdEZpbGVVc2VkKCk7XG4gICAgaWYgKGxhc3RGaWxlVXNlZCkge1xuICAgICAgYXBwSW5zdGFuY2UudXBkYXRlQ2FjaGVkRmlsZShsYXN0RmlsZVVzZWQsIHtcbiAgICAgICAgZGF0YVxuICAgICAgfSk7XG4gICAgfVxuICAgIEV4ZWN1dG9yLmV4ZWN1dGVEYXRhKHRyYWNlck1hbmFnZXIsIGRhdGEpO1xuICB9KTtcblxuICB0aGlzLmNvZGVFZGl0b3Iub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICBjb25zdCBjb2RlID0gdGhpcy5jb2RlRWRpdG9yLmdldFZhbHVlKCk7XG4gICAgY29uc3QgbGFzdEZpbGVVc2VkID0gYXBwSW5zdGFuY2UuZ2V0TGFzdEZpbGVVc2VkKCk7XG4gICAgaWYgKGxhc3RGaWxlVXNlZCkge1xuICAgICAgYXBwSW5zdGFuY2UudXBkYXRlQ2FjaGVkRmlsZShsYXN0RmlsZVVzZWQsIHtcbiAgICAgICAgY29kZVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRWRpdG9yOyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgUlNWUCA9IHJlcXVpcmUoJ3JzdnAnKTtcbmNvbnN0IGFwcEluc3RhbmNlID0gcmVxdWlyZSgnLi9hcHAnKTtcbmNvbnN0IEFwcENvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9hcHAvY29uc3RydWN0b3InKTtcbmNvbnN0IERPTSA9IHJlcXVpcmUoJy4vZG9tJyk7XG5jb25zdCBTZXJ2ZXIgPSByZXF1aXJlKCcuL3NlcnZlcicpO1xuY29uc3QgSGVscGVycyA9IHJlcXVpcmUoJy4vc2VydmVyL2hlbHBlcnMnKTtcblxuY29uc3QgbW9kdWxlcyA9IHJlcXVpcmUoJy4vbW9kdWxlJyk7XG5cbmNvbnN0IHtcbiAgZXh0ZW5kXG59ID0gJDtcblxuJC5hamF4U2V0dXAoe1xuICBjYWNoZTogZmFsc2UsXG4gIGRhdGFUeXBlOiAndGV4dCdcbn0pO1xuXG4vLyBzZXQgZ2xvYmFsIHByb21pc2UgZXJyb3IgaGFuZGxlclxuUlNWUC5vbignZXJyb3InLCBmdW5jdGlvbihyZWFzb24pIHtcbiAgY29uc29sZS5hc3NlcnQoZmFsc2UsIHJlYXNvbik7XG59KTtcblxuJCgoKSA9PiB7XG5cbiAgLy8gaW5pdGlhbGl6ZSB0aGUgYXBwbGljYXRpb24gYW5kIGF0dGFjaCBpbiB0byB0aGUgaW5zdGFuY2UgbW9kdWxlXG4gIGNvbnN0IGFwcCA9IG5ldyBBcHBDb25zdHJ1Y3RvcigpO1xuICBleHRlbmQodHJ1ZSwgYXBwSW5zdGFuY2UsIGFwcCk7XG5cbiAgLy8gbG9hZCBtb2R1bGVzIHRvIHRoZSBnbG9iYWwgc2NvcGUgc28gdGhleSBjYW4gYmUgZXZhbGVkXG4gIGV4dGVuZCh0cnVlLCB3aW5kb3csIG1vZHVsZXMpO1xuXG4gIFNlcnZlci5sb2FkQ2F0ZWdvcmllcygpLnRoZW4oKGRhdGEpID0+IHtcbiAgICBhcHBJbnN0YW5jZS5zZXRDYXRlZ29yaWVzKGRhdGEpO1xuICAgIERPTS5zaG93Q2F0ZWdvcmllcygpO1xuXG4gICAgLy8gZGV0ZXJtaW5lIGlmIHRoZSBhcHAgaXMgbG9hZGluZyBhIHByZS1leGlzdGluZyBzY3JhdGNoLXBhZFxuICAgIC8vIG9yIHRoZSBob21lIHBhZ2VcbiAgICBjb25zdCBnaXN0SUQgPSBIZWxwZXJzLmdldFBhcmFtZXRlckJ5TmFtZSgnc2NyYXRjaC1wYXBlcicpO1xuICAgIGlmIChnaXN0SUQpIHtcbiAgICAgIFNlcnZlci5sb2FkU2NyYXRjaFBhcGVyKGdpc3RJRCkudGhlbigoe1xuICAgICAgICBjYXRlZ29yeSxcbiAgICAgICAgYWxnb3JpdGhtLFxuICAgICAgICBkYXRhXG4gICAgICB9KSA9PiB7XG4gICAgICAgIERPTS5zaG93QWxnb3JpdGhtKGNhdGVnb3J5LCBhbGdvcml0aG0sIGRhdGEpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIERPTS5zaG93Rmlyc3RBbGdvcml0aG0oKTtcbiAgICB9XG5cbiAgfSk7XG5cbiAgLy8gaHR0cDovL2xvY2FsaG9zdDo4MDgwLz9zY3JhdGNoLXBhcGVyPWRjZjBkMGRlNjBhNGFkMzM1YjNiMGNiNWMzOTAzNWU3XG5cbn0pOyIsImNvbnN0IHtcbiAgICBBcnJheTJELFxuICAgIEFycmF5MkRUcmFjZXJcbn0gPSByZXF1aXJlKCcuL2FycmF5MmQnKTtcblxuZnVuY3Rpb24gQXJyYXkxRFRyYWNlcigpIHtcbiAgICByZXR1cm4gQXJyYXkyRFRyYWNlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5BcnJheTFEVHJhY2VyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHRydWUsIE9iamVjdC5jcmVhdGUoQXJyYXkyRFRyYWNlci5wcm90b3R5cGUpLCB7XG4gICAgY29uc3RydWN0b3I6IEFycmF5MURUcmFjZXIsXG4gICAgX25vdGlmeTogZnVuY3Rpb24oaWR4LCB2KSB7XG4gICAgICAgIEFycmF5MkRUcmFjZXIucHJvdG90eXBlLl9ub3RpZnkuY2FsbCh0aGlzLCAwLCBpZHgsIHYpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9kZW5vdGlmeTogZnVuY3Rpb24oaWR4KSB7XG4gICAgICAgIEFycmF5MkRUcmFjZXIucHJvdG90eXBlLl9kZW5vdGlmeS5jYWxsKHRoaXMsIDAsIGlkeCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX3NlbGVjdDogZnVuY3Rpb24ocywgZSkge1xuICAgICAgICBpZiAoZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBBcnJheTJEVHJhY2VyLnByb3RvdHlwZS5fc2VsZWN0LmNhbGwodGhpcywgMCwgcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBBcnJheTJEVHJhY2VyLnByb3RvdHlwZS5fc2VsZWN0Um93LmNhbGwodGhpcywgMCwgcywgZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfZGVzZWxlY3Q6IGZ1bmN0aW9uKHMsIGUpIHtcbiAgICAgICAgaWYgKGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgQXJyYXkyRFRyYWNlci5wcm90b3R5cGUuX2Rlc2VsZWN0LmNhbGwodGhpcywgMCwgcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBBcnJheTJEVHJhY2VyLnByb3RvdHlwZS5fZGVzZWxlY3RSb3cuY2FsbCh0aGlzLCAwLCBzLCBlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldERhdGE6IGZ1bmN0aW9uKEQpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5MkRUcmFjZXIucHJvdG90eXBlLnNldERhdGEuY2FsbCh0aGlzLCBbRF0pO1xuICAgIH1cbn0pO1xuXG52YXIgQXJyYXkxRCA9IHtcbiAgICByYW5kb206IGZ1bmN0aW9uKE4sIG1pbiwgbWF4KSB7XG4gICAgICAgIHJldHVybiBBcnJheTJELnJhbmRvbSgxLCBOLCBtaW4sIG1heClbMF07XG4gICAgfSxcbiAgICByYW5kb21Tb3J0ZWQ6IGZ1bmN0aW9uKE4sIG1pbiwgbWF4KSB7XG4gICAgICAgIHJldHVybiBBcnJheTJELnJhbmRvbVNvcnRlZCgxLCBOLCBtaW4sIG1heClbMF07XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgQXJyYXkxRCxcbiAgICBBcnJheTFEVHJhY2VyXG59OyIsImNvbnN0IFRyYWNlciA9IHJlcXVpcmUoJy4vdHJhY2VyJyk7XG5jb25zdCB7XG4gICAgcmVmaW5lQnlUeXBlXG59ID0gcmVxdWlyZSgnLi4vdHJhY2VyX21hbmFnZXIvdXRpbCcpO1xuXG5mdW5jdGlvbiBBcnJheTJEVHJhY2VyKCkge1xuICAgIGlmIChUcmFjZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICBBcnJheTJEVHJhY2VyLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbkFycmF5MkRUcmFjZXIucHJvdG90eXBlID0gJC5leHRlbmQodHJ1ZSwgT2JqZWN0LmNyZWF0ZShUcmFjZXIucHJvdG90eXBlKSwge1xuICAgIGNvbnN0cnVjdG9yOiBBcnJheTJEVHJhY2VyLFxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiR0YWJsZSA9IHRoaXMuY2Fwc3VsZS4kdGFibGUgPSAkKCc8ZGl2IGNsYXNzPVwibXRibC10YWJsZVwiPicpO1xuICAgICAgICB0aGlzLiRjb250YWluZXIuYXBwZW5kKHRoaXMuJHRhYmxlKTtcbiAgICB9LFxuICAgIF9ub3RpZnk6IGZ1bmN0aW9uKHgsIHksIHYpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ25vdGlmeScsXG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeSxcbiAgICAgICAgICAgIHY6IHZcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX2Rlbm90aWZ5OiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICdkZW5vdGlmeScsXG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfc2VsZWN0OiBmdW5jdGlvbihzeCwgc3ksIGV4LCBleSkge1xuICAgICAgICB0aGlzLnB1c2hTZWxlY3RpbmdTdGVwKCdzZWxlY3QnLCBudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9zZWxlY3RSb3c6IGZ1bmN0aW9uKHgsIHN5LCBleSkge1xuICAgICAgICB0aGlzLnB1c2hTZWxlY3RpbmdTdGVwKCdzZWxlY3QnLCAncm93JywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfc2VsZWN0Q29sOiBmdW5jdGlvbih5LCBzeCwgZXgpIHtcbiAgICAgICAgdGhpcy5wdXNoU2VsZWN0aW5nU3RlcCgnc2VsZWN0JywgJ2NvbCcsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX2Rlc2VsZWN0OiBmdW5jdGlvbihzeCwgc3ksIGV4LCBleSkge1xuICAgICAgICB0aGlzLnB1c2hTZWxlY3RpbmdTdGVwKCdkZXNlbGVjdCcsIG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX2Rlc2VsZWN0Um93OiBmdW5jdGlvbih4LCBzeSwgZXkpIHtcbiAgICAgICAgdGhpcy5wdXNoU2VsZWN0aW5nU3RlcCgnZGVzZWxlY3QnLCAncm93JywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfZGVzZWxlY3RDb2w6IGZ1bmN0aW9uKHksIHN4LCBleCkge1xuICAgICAgICB0aGlzLnB1c2hTZWxlY3RpbmdTdGVwKCdkZXNlbGVjdCcsICdjb2wnLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9zZXBhcmF0ZTogZnVuY3Rpb24oeCwgeSkge1xuICAgICAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICAgICAgICB0eXBlOiAnc2VwYXJhdGUnLFxuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHlcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX3NlcGFyYXRlUm93OiBmdW5jdGlvbih4KSB7XG4gICAgICAgIHRoaXMuX3NlcGFyYXRlKHgsIC0xKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfc2VwYXJhdGVDb2w6IGZ1bmN0aW9uKHkpIHtcbiAgICAgICAgdGhpcy5fc2VwYXJhdGUoLTEsIHkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9kZXNlcGFyYXRlOiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICdkZXNlcGFyYXRlJyxcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9kZXNlcGFyYXRlUm93OiBmdW5jdGlvbih4KSB7XG4gICAgICAgIHRoaXMuX2Rlc2VwYXJhdGUoeCwgLTEpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9kZXNlcGFyYXRlQ29sOiBmdW5jdGlvbih5KSB7XG4gICAgICAgIHRoaXMuX2Rlc2VwYXJhdGUoLTEsIHkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHB1c2hTZWxlY3RpbmdTdGVwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICB2YXIgdHlwZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgICAgdmFyIG1vZGUgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzLnNoaWZ0KCkpO1xuICAgICAgICB2YXIgY29vcmQ7XG4gICAgICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgICAgICAgY2FzZSAncm93JzpcbiAgICAgICAgICAgICAgICBjb29yZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgeDogYXJnc1swXSxcbiAgICAgICAgICAgICAgICAgICAgc3k6IGFyZ3NbMV0sXG4gICAgICAgICAgICAgICAgICAgIGV5OiBhcmdzWzJdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NvbCc6XG4gICAgICAgICAgICAgICAgY29vcmQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHk6IGFyZ3NbMF0sXG4gICAgICAgICAgICAgICAgICAgIHN4OiBhcmdzWzFdLFxuICAgICAgICAgICAgICAgICAgICBleDogYXJnc1syXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmIChhcmdzWzJdID09PSB1bmRlZmluZWQgJiYgYXJnc1szXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvb3JkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogYXJnc1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IGFyZ3NbMV1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb29yZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN4OiBhcmdzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3k6IGFyZ3NbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBleDogYXJnc1syXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV5OiBhcmdzWzNdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBzdGVwID0ge1xuICAgICAgICAgICAgdHlwZTogdHlwZVxuICAgICAgICB9O1xuICAgICAgICAkLmV4dGVuZChzdGVwLCBjb29yZCk7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHN0ZXApO1xuICAgIH0sXG4gICAgcHJvY2Vzc1N0ZXA6IGZ1bmN0aW9uKHN0ZXAsIG9wdGlvbnMpIHtcbiAgICAgICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ25vdGlmeSc6XG4gICAgICAgICAgICAgICAgaWYgKHN0ZXAudiA9PT0gMCB8fCBzdGVwLnYpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRyb3cgPSB0aGlzLiR0YWJsZS5maW5kKCcubXRibC1yb3cnKS5lcShzdGVwLngpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgJGNvbCA9ICRyb3cuZmluZCgnLm10YmwtY29sJykuZXEoc3RlcC55KTtcbiAgICAgICAgICAgICAgICAgICAgJGNvbC50ZXh0KHJlZmluZUJ5VHlwZShzdGVwLnYpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICdkZW5vdGlmeSc6XG4gICAgICAgICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICAgICAgY2FzZSAnZGVzZWxlY3QnOlxuICAgICAgICAgICAgICAgIHZhciBjb2xvckNsYXNzID0gc3RlcC50eXBlID09ICdzZWxlY3QnIHx8IHN0ZXAudHlwZSA9PSAnZGVzZWxlY3QnID8gdGhpcy5jb2xvckNsYXNzLnNlbGVjdGVkIDogdGhpcy5jb2xvckNsYXNzLm5vdGlmaWVkO1xuICAgICAgICAgICAgICAgIHZhciBhZGRDbGFzcyA9IHN0ZXAudHlwZSA9PSAnc2VsZWN0JyB8fCBzdGVwLnR5cGUgPT0gJ25vdGlmeSc7XG4gICAgICAgICAgICAgICAgdmFyIHN4ID0gc3RlcC5zeDtcbiAgICAgICAgICAgICAgICB2YXIgc3kgPSBzdGVwLnN5O1xuICAgICAgICAgICAgICAgIHZhciBleCA9IHN0ZXAuZXg7XG4gICAgICAgICAgICAgICAgdmFyIGV5ID0gc3RlcC5leTtcbiAgICAgICAgICAgICAgICBpZiAoc3ggPT09IHVuZGVmaW5lZCkgc3ggPSBzdGVwLng7XG4gICAgICAgICAgICAgICAgaWYgKHN5ID09PSB1bmRlZmluZWQpIHN5ID0gc3RlcC55O1xuICAgICAgICAgICAgICAgIGlmIChleCA9PT0gdW5kZWZpbmVkKSBleCA9IHN0ZXAueDtcbiAgICAgICAgICAgICAgICBpZiAoZXkgPT09IHVuZGVmaW5lZCkgZXkgPSBzdGVwLnk7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWludENvbG9yKHN4LCBzeSwgZXgsIGV5LCBjb2xvckNsYXNzLCBhZGRDbGFzcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzZXBhcmF0ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5kZXNlcGFyYXRlKHN0ZXAueCwgc3RlcC55KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcGFyYXRlKHN0ZXAueCwgc3RlcC55KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Rlc2VwYXJhdGUnOlxuICAgICAgICAgICAgICAgIHRoaXMuZGVzZXBhcmF0ZShzdGVwLngsIHN0ZXAueSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIFRyYWNlci5wcm90b3R5cGUucHJvY2Vzc1N0ZXAuY2FsbCh0aGlzLCBzdGVwLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0RGF0YTogZnVuY3Rpb24oRCkge1xuICAgICAgICB0aGlzLnZpZXdYID0gdGhpcy52aWV3WSA9IDA7XG4gICAgICAgIHRoaXMucGFkZGluZ0ggPSA2O1xuICAgICAgICB0aGlzLnBhZGRpbmdWID0gMztcbiAgICAgICAgdGhpcy5mb250U2l6ZSA9IDE2O1xuXG4gICAgICAgIGlmIChUcmFjZXIucHJvdG90eXBlLnNldERhdGEuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgdGhpcy4kdGFibGUuZmluZCgnLm10Ymwtcm93JykuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcubXRibC1jb2wnKS5lYWNoKGZ1bmN0aW9uKGopIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50ZXh0KHJlZmluZUJ5VHlwZShEW2ldW2pdKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kdGFibGUuZW1wdHkoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBELmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgJHJvdyA9ICQoJzxkaXYgY2xhc3M9XCJtdGJsLXJvd1wiPicpO1xuICAgICAgICAgICAgdGhpcy4kdGFibGUuYXBwZW5kKCRyb3cpO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBEW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyICRjb2wgPSAkKCc8ZGl2IGNsYXNzPVwibXRibC1jb2xcIj4nKVxuICAgICAgICAgICAgICAgICAgICAuY3NzKHRoaXMuZ2V0Q2VsbENzcygpKVxuICAgICAgICAgICAgICAgICAgICAudGV4dChyZWZpbmVCeVR5cGUoRFtpXVtqXSkpO1xuICAgICAgICAgICAgICAgICRyb3cuYXBwZW5kKCRjb2wpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgcmVzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5yZXNpemUuY2FsbCh0aGlzKTtcblxuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5jbGVhci5jYWxsKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuY2xlYXJDb2xvcigpO1xuICAgICAgICB0aGlzLmRlc2VwYXJhdGVBbGwoKTtcbiAgICB9LFxuICAgIGdldENlbGxDc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGFkZGluZzogdGhpcy5wYWRkaW5nVi50b0ZpeGVkKDEpICsgJ3B4ICcgKyB0aGlzLnBhZGRpbmdILnRvRml4ZWQoMSkgKyAncHgnLFxuICAgICAgICAgICAgJ2ZvbnQtc2l6ZSc6IHRoaXMuZm9udFNpemUudG9GaXhlZCgxKSArICdweCdcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHJlZnJlc2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICBUcmFjZXIucHJvdG90eXBlLnJlZnJlc2guY2FsbCh0aGlzKTtcblxuICAgICAgICB2YXIgJHBhcmVudCA9IHRoaXMuJHRhYmxlLnBhcmVudCgpO1xuICAgICAgICB2YXIgdG9wID0gJHBhcmVudC5oZWlnaHQoKSAvIDIgLSB0aGlzLiR0YWJsZS5oZWlnaHQoKSAvIDIgKyB0aGlzLnZpZXdZO1xuICAgICAgICB2YXIgbGVmdCA9ICRwYXJlbnQud2lkdGgoKSAvIDIgLSB0aGlzLiR0YWJsZS53aWR0aCgpIC8gMiArIHRoaXMudmlld1g7XG4gICAgICAgIHRoaXMuJHRhYmxlLmNzcygnbWFyZ2luLXRvcCcsIHRvcCk7XG4gICAgICAgIHRoaXMuJHRhYmxlLmNzcygnbWFyZ2luLWxlZnQnLCBsZWZ0KTtcbiAgICB9LFxuICAgIG1vdXNlZG93bjogZnVuY3Rpb24oZSkge1xuICAgICAgICBUcmFjZXIucHJvdG90eXBlLm1vdXNlZG93bi5jYWxsKHRoaXMsIGUpO1xuXG4gICAgICAgIHRoaXMuZHJhZ1ggPSBlLnBhZ2VYO1xuICAgICAgICB0aGlzLmRyYWdZID0gZS5wYWdlWTtcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XG4gICAgfSxcbiAgICBtb3VzZW1vdmU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5tb3VzZW1vdmUuY2FsbCh0aGlzLCBlKTtcblxuICAgICAgICBpZiAodGhpcy5kcmFnZ2luZykge1xuICAgICAgICAgICAgdGhpcy52aWV3WCArPSBlLnBhZ2VYIC0gdGhpcy5kcmFnWDtcbiAgICAgICAgICAgIHRoaXMudmlld1kgKz0gZS5wYWdlWSAtIHRoaXMuZHJhZ1k7XG4gICAgICAgICAgICB0aGlzLmRyYWdYID0gZS5wYWdlWDtcbiAgICAgICAgICAgIHRoaXMuZHJhZ1kgPSBlLnBhZ2VZO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1vdXNldXA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5tb3VzZXVwLmNhbGwodGhpcywgZSk7XG5cbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuICAgIH0sXG4gICAgbW91c2V3aGVlbDogZnVuY3Rpb24oZSkge1xuICAgICAgICBUcmFjZXIucHJvdG90eXBlLm1vdXNld2hlZWwuY2FsbCh0aGlzLCBlKTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUgPSBlLm9yaWdpbmFsRXZlbnQ7XG4gICAgICAgIHZhciBkZWx0YSA9IChlLndoZWVsRGVsdGEgIT09IHVuZGVmaW5lZCAmJiBlLndoZWVsRGVsdGEpIHx8XG4gICAgICAgICAgICAoZS5kZXRhaWwgIT09IHVuZGVmaW5lZCAmJiAtZS5kZXRhaWwpO1xuICAgICAgICB2YXIgd2VpZ2h0ID0gMS4wMTtcbiAgICAgICAgdmFyIHJhdGlvID0gZGVsdGEgPiAwID8gMSAvIHdlaWdodCA6IHdlaWdodDtcbiAgICAgICAgaWYgKHRoaXMuZm9udFNpemUgPCA0ICYmIHJhdGlvIDwgMSkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5mb250U2l6ZSA+IDQwICYmIHJhdGlvID4gMSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnBhZGRpbmdWICo9IHJhdGlvO1xuICAgICAgICB0aGlzLnBhZGRpbmdIICo9IHJhdGlvO1xuICAgICAgICB0aGlzLmZvbnRTaXplICo9IHJhdGlvO1xuICAgICAgICB0aGlzLiR0YWJsZS5maW5kKCcubXRibC1jb2wnKS5jc3ModGhpcy5nZXRDZWxsQ3NzKCkpO1xuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB9LFxuICAgIHBhaW50Q29sb3I6IGZ1bmN0aW9uKHN4LCBzeSwgZXgsIGV5LCBjb2xvckNsYXNzLCBhZGRDbGFzcykge1xuICAgICAgICBmb3IgKHZhciBpID0gc3g7IGkgPD0gZXg7IGkrKykge1xuICAgICAgICAgICAgdmFyICRyb3cgPSB0aGlzLiR0YWJsZS5maW5kKCcubXRibC1yb3cnKS5lcShpKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSBzeTsgaiA8PSBleTsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyICRjb2wgPSAkcm93LmZpbmQoJy5tdGJsLWNvbCcpLmVxKGopO1xuICAgICAgICAgICAgICAgIGlmIChhZGRDbGFzcykgJGNvbC5hZGRDbGFzcyhjb2xvckNsYXNzKTtcbiAgICAgICAgICAgICAgICBlbHNlICRjb2wucmVtb3ZlQ2xhc3MoY29sb3JDbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNsZWFyQ29sb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiR0YWJsZS5maW5kKCcubXRibC1jb2wnKS5yZW1vdmVDbGFzcyhPYmplY3Qua2V5cyh0aGlzLmNvbG9yQ2xhc3MpLmpvaW4oJyAnKSk7XG4gICAgfSxcbiAgICBjb2xvckNsYXNzOiB7XG4gICAgICAgIHNlbGVjdGVkOiAnc2VsZWN0ZWQnLFxuICAgICAgICBub3RpZmllZDogJ25vdGlmaWVkJ1xuICAgIH0sXG4gICAgc2VwYXJhdGU6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgdGhpcy4kdGFibGUuZmluZCgnLm10Ymwtcm93JykuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICB2YXIgJHJvdyA9ICQodGhpcyk7XG4gICAgICAgICAgICBpZiAoaSA9PSB4KSB7XG4gICAgICAgICAgICAgICAgJHJvdy5hZnRlcigkKCc8ZGl2IGNsYXNzPVwibXRibC1lbXB0eS1yb3dcIj4nKS5hdHRyKCdkYXRhLXJvdycsIGkpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHJvdy5maW5kKCcubXRibC1jb2wnKS5lYWNoKGZ1bmN0aW9uKGopIHtcbiAgICAgICAgICAgICAgICB2YXIgJGNvbCA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgaWYgKGogPT0geSkge1xuICAgICAgICAgICAgICAgICAgICAkY29sLmFmdGVyKCQoJzxkaXYgY2xhc3M9XCJtdGJsLWVtcHR5LWNvbFwiPicpLmF0dHIoJ2RhdGEtY29sJywgaikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGRlc2VwYXJhdGU6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgdGhpcy4kdGFibGUuZmluZCgnW2RhdGEtcm93PScgKyB4ICsgJ10nKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy4kdGFibGUuZmluZCgnW2RhdGEtY29sPScgKyB5ICsgJ10nKS5yZW1vdmUoKTtcbiAgICB9LFxuICAgIGRlc2VwYXJhdGVBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiR0YWJsZS5maW5kKCcubXRibC1lbXB0eS1yb3csIC5tdGJsLWVtcHR5LWNvbCcpLnJlbW92ZSgpO1xuICAgIH1cbn0pO1xuXG52YXIgQXJyYXkyRCA9IHtcbiAgICByYW5kb206IGZ1bmN0aW9uKE4sIE0sIG1pbiwgbWF4KSB7XG4gICAgICAgIGlmICghTikgTiA9IDEwO1xuICAgICAgICBpZiAoIU0pIE0gPSAxMDtcbiAgICAgICAgaWYgKG1pbiA9PT0gdW5kZWZpbmVkKSBtaW4gPSAxO1xuICAgICAgICBpZiAobWF4ID09PSB1bmRlZmluZWQpIG1heCA9IDk7XG4gICAgICAgIHZhciBEID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XG4gICAgICAgICAgICBELnB1c2goW10pO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBNOyBqKyspIHtcbiAgICAgICAgICAgICAgICBEW2ldLnB1c2goKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgfCAwKSArIG1pbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEQ7XG4gICAgfSxcbiAgICByYW5kb21Tb3J0ZWQ6IGZ1bmN0aW9uKE4sIE0sIG1pbiwgbWF4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJhbmRvbShOLCBNLCBtaW4sIG1heCkubWFwKGZ1bmN0aW9uKGFycikge1xuICAgICAgICAgICAgcmV0dXJuIGFyci5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgQXJyYXkyRCxcbiAgICBBcnJheTJEVHJhY2VyXG59OyIsImNvbnN0IFRyYWNlciA9IHJlcXVpcmUoJy4vdHJhY2VyJyk7XG5cbmZ1bmN0aW9uIENoYXJ0VHJhY2VyKCkge1xuICAgIGlmIChUcmFjZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICBDaGFydFRyYWNlci5wcm90b3R5cGUuaW5pdC5jYWxsKHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbkNoYXJ0VHJhY2VyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHRydWUsIE9iamVjdC5jcmVhdGUoVHJhY2VyLnByb3RvdHlwZSksIHtcbiAgICBjb25zdHJ1Y3RvcjogQ2hhcnRUcmFjZXIsXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJHdyYXBwZXIgPSB0aGlzLmNhcHN1bGUuJHdyYXBwZXIgPSAkKCc8Y2FudmFzIGlkPVwiY2hhcnRcIj4nKTtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLmFwcGVuZCh0aGlzLiR3cmFwcGVyKTtcbiAgICB9LFxuICAgIHNldERhdGE6IGZ1bmN0aW9uKEMpIHtcbiAgICAgICAgaWYgKFRyYWNlci5wcm90b3R5cGUuc2V0RGF0YS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgdmFyIHRyYWNlciA9IHRoaXM7XG4gICAgICAgIHZhciBjb2xvciA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEMubGVuZ3RoOyBpKyspIGNvbG9yLnB1c2goJ3JnYmEoMTM2LCAxMzYsIDEzNiwgMSknKTtcbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBsYWJlbHM6IEMubWFwKFN0cmluZyksXG4gICAgICAgICAgICAgICAgZGF0YXNldHM6IFt7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3IsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IENcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBzY2FsZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgeUF4ZXM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlZ2luQXRaZXJvOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoYXJ0ID0gdGhpcy5jYXBzdWxlLmNoYXJ0ID0gbmV3IENoYXJ0KHRoaXMuJHdyYXBwZXIsIGRhdGEpO1xuICAgIH0sXG4gICAgX25vdGlmeTogZnVuY3Rpb24ocywgdikge1xuICAgICAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICAgICAgICB0eXBlOiAnbm90aWZ5JyxcbiAgICAgICAgICAgIHM6IHMsXG4gICAgICAgICAgICB2OiB2XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9kZW5vdGlmeTogZnVuY3Rpb24ocykge1xuICAgICAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICAgICAgICB0eXBlOiAnZGVub3RpZnknLFxuICAgICAgICAgICAgczogc1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfc2VsZWN0OiBmdW5jdGlvbihzLCBlKSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgICAgICAgczogcyxcbiAgICAgICAgICAgIGU6IGVcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX2Rlc2VsZWN0OiBmdW5jdGlvbihzLCBlKSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICdkZXNlbGVjdCcsXG4gICAgICAgICAgICBzOiBzLFxuICAgICAgICAgICAgZTogZVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBwcm9jZXNzU3RlcDogZnVuY3Rpb24oc3RlcCwgb3B0aW9ucykge1xuICAgICAgICBzd2l0Y2ggKHN0ZXAudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnbm90aWZ5JzpcbiAgICAgICAgICAgICAgICBpZiAoc3RlcC52KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcnQuY29uZmlnLmRhdGEuZGF0YXNldHNbMF0uZGF0YVtzdGVwLnNdID0gc3RlcC52O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0LmNvbmZpZy5kYXRhLmxhYmVsc1tzdGVwLnNdID0gc3RlcC52LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnZGVub3RpZnknOlxuICAgICAgICAgICAgY2FzZSAnZGVzZWxlY3QnOlxuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IHN0ZXAudHlwZSA9PSAnZGVub3RpZnknIHx8IHN0ZXAudHlwZSA9PSAnZGVzZWxlY3QnID8gJ3JnYmEoMTM2LCAxMzYsIDEzNiwgMSknIDogJ3JnYmEoMjU1LCAwLCAwLCAxKSc7XG4gICAgICAgICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICAgICAgICAgIGlmIChjb2xvciA9PT0gdW5kZWZpbmVkKSB2YXIgY29sb3IgPSAncmdiYSgwLCAwLCAyNTUsIDEpJztcbiAgICAgICAgICAgICAgICBpZiAoc3RlcC5lICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBzdGVwLnM7IGkgPD0gc3RlcC5lOyBpKyspXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0LmNvbmZpZy5kYXRhLmRhdGFzZXRzWzBdLmJhY2tncm91bmRDb2xvcltpXSA9IGNvbG9yO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFydC5jb25maWcuZGF0YS5kYXRhc2V0c1swXS5iYWNrZ3JvdW5kQ29sb3Jbc3RlcC5zXSA9IGNvbG9yO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhcnQudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIFRyYWNlci5wcm90b3R5cGUucHJvY2Vzc1N0ZXAuY2FsbCh0aGlzLCBzdGVwLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGFydFRyYWNlcjsiLCJjb25zdCBUcmFjZXIgPSByZXF1aXJlKCcuL3RyYWNlcicpO1xuXG5mdW5jdGlvbiBEaXJlY3RlZEdyYXBoVHJhY2VyKCkge1xuICAgIGlmIChUcmFjZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICBEaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbkRpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlID0gJC5leHRlbmQodHJ1ZSwgT2JqZWN0LmNyZWF0ZShUcmFjZXIucHJvdG90eXBlKSwge1xuICAgIGNvbnN0cnVjdG9yOiBEaXJlY3RlZEdyYXBoVHJhY2VyLFxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdHJhY2VyID0gdGhpcztcblxuICAgICAgICB0aGlzLnMgPSB0aGlzLmNhcHN1bGUucyA9IG5ldyBzaWdtYSh7XG4gICAgICAgICAgICByZW5kZXJlcjoge1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogdGhpcy4kY29udGFpbmVyWzBdLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdjYW52YXMnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICBtaW5BcnJvd1NpemU6IDgsXG4gICAgICAgICAgICAgICAgZGVmYXVsdEVkZ2VUeXBlOiAnYXJyb3cnLFxuICAgICAgICAgICAgICAgIG1heEVkZ2VTaXplOiAyLjUsXG4gICAgICAgICAgICAgICAgbGFiZWxUaHJlc2hvbGQ6IDQsXG4gICAgICAgICAgICAgICAgZm9udDogJ1JvYm90bycsXG4gICAgICAgICAgICAgICAgZGVmYXVsdExhYmVsQ29sb3I6ICcjZmZmJyxcbiAgICAgICAgICAgICAgICB6b29tTWluOiAwLjYsXG4gICAgICAgICAgICAgICAgem9vbU1heDogMS4yLFxuICAgICAgICAgICAgICAgIHNraXBFcnJvcnM6IHRydWUsXG4gICAgICAgICAgICAgICAgbWluTm9kZVNpemU6IC41LFxuICAgICAgICAgICAgICAgIG1heE5vZGVTaXplOiAxMixcbiAgICAgICAgICAgICAgICBsYWJlbFNpemU6ICdwcm9wb3J0aW9uYWwnLFxuICAgICAgICAgICAgICAgIGxhYmVsU2l6ZVJhdGlvOiAxLjMsXG4gICAgICAgICAgICAgICAgZnVuY0xhYmVsc0RlZjogZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdMYWJlbChub2RlLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmdW5jSG92ZXJzRGVmOiBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncywgbmV4dCkge1xuICAgICAgICAgICAgICAgICAgICB0cmFjZXIuZHJhd09uSG92ZXIobm9kZSwgY29udGV4dCwgc2V0dGluZ3MsIG5leHQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY0VkZ2VzQXJyb3c6IGZ1bmN0aW9uKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSB0cmFjZXIuZ2V0Q29sb3IoZWRnZSwgc291cmNlLCB0YXJnZXQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdBcnJvdyhlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzaWdtYS5wbHVnaW5zLmRyYWdOb2Rlcyh0aGlzLnMsIHRoaXMucy5yZW5kZXJlcnNbMF0pO1xuICAgICAgICB0aGlzLmdyYXBoID0gdGhpcy5jYXBzdWxlLmdyYXBoID0gdGhpcy5zLmdyYXBoO1xuICAgIH0sXG4gICAgX3NldFRyZWVEYXRhOiBmdW5jdGlvbihHLCByb290KSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICdzZXRUcmVlRGF0YScsXG4gICAgICAgICAgICBhcmd1bWVudHM6IGFyZ3VtZW50c1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfdmlzaXQ6IGZ1bmN0aW9uKHRhcmdldCwgc291cmNlKSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICd2aXNpdCcsXG4gICAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICAgIHNvdXJjZTogc291cmNlXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9sZWF2ZTogZnVuY3Rpb24odGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ2xlYXZlJyxcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgICAgc291cmNlOiBzb3VyY2VcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcHJvY2Vzc1N0ZXA6IGZ1bmN0aW9uKHN0ZXAsIG9wdGlvbnMpIHtcbiAgICAgICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NldFRyZWVEYXRhJzpcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRyZWVEYXRhLmFwcGx5KHRoaXMsIHN0ZXAuYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2l0JzpcbiAgICAgICAgICAgIGNhc2UgJ2xlYXZlJzpcbiAgICAgICAgICAgICAgICB2YXIgdmlzaXQgPSBzdGVwLnR5cGUgPT0gJ3Zpc2l0JztcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0Tm9kZSA9IHRoaXMuZ3JhcGgubm9kZXModGhpcy5uKHN0ZXAudGFyZ2V0KSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gdmlzaXQgPyB0aGlzLmNvbG9yLnZpc2l0ZWQgOiB0aGlzLmNvbG9yLmxlZnQ7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZS5jb2xvciA9IGNvbG9yO1xuICAgICAgICAgICAgICAgIGlmIChzdGVwLnNvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlZGdlSWQgPSB0aGlzLmUoc3RlcC5zb3VyY2UsIHN0ZXAudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2UgPSB0aGlzLmdyYXBoLmVkZ2VzKGVkZ2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIGVkZ2UuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmFwaC5kcm9wRWRnZShlZGdlSWQpLmFkZEVkZ2UoZWRnZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvZ1RyYWNlcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gc3RlcC5zb3VyY2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2UgPT09IHVuZGVmaW5lZCkgc291cmNlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nVHJhY2VyLnByaW50KHZpc2l0ID8gc291cmNlICsgJyAtPiAnICsgc3RlcC50YXJnZXQgOiBzb3VyY2UgKyAnIDwtICcgKyBzdGVwLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBUcmFjZXIucHJvdG90eXBlLnByb2Nlc3NTdGVwLmNhbGwodGhpcywgc3RlcCwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldFRyZWVEYXRhOiBmdW5jdGlvbihHLCByb290KSB7XG4gICAgICAgIHZhciB0cmFjZXIgPSB0aGlzO1xuXG4gICAgICAgIHJvb3QgPSByb290IHx8IDA7XG4gICAgICAgIHZhciBtYXhEZXB0aCA9IC0xO1xuXG4gICAgICAgIHZhciBjaGsgPSBuZXcgQXJyYXkoRy5sZW5ndGgpO1xuICAgICAgICB2YXIgZ2V0RGVwdGggPSBmdW5jdGlvbihub2RlLCBkZXB0aCkge1xuICAgICAgICAgICAgaWYgKGNoa1tub2RlXSkgdGhyb3cgXCJ0aGUgZ2l2ZW4gZ3JhcGggaXMgbm90IGEgdHJlZSBiZWNhdXNlIGl0IGZvcm1zIGEgY2lyY3VpdFwiO1xuICAgICAgICAgICAgY2hrW25vZGVdID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChtYXhEZXB0aCA8IGRlcHRoKSBtYXhEZXB0aCA9IGRlcHRoO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBHW25vZGVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKEdbbm9kZV1baV0pIGdldERlcHRoKGksIGRlcHRoICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGdldERlcHRoKHJvb3QsIDEpO1xuXG4gICAgICAgIGlmICh0aGlzLnNldERhdGEuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgdmFyIHBsYWNlID0gZnVuY3Rpb24obm9kZSwgeCwgeSkge1xuICAgICAgICAgICAgdmFyIHRlbXAgPSB0cmFjZXIuZ3JhcGgubm9kZXModHJhY2VyLm4obm9kZSkpO1xuICAgICAgICAgICAgdGVtcC54ID0geDtcbiAgICAgICAgICAgIHRlbXAueSA9IHk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHdnYXAgPSAxIC8gKG1heERlcHRoIC0gMSk7XG4gICAgICAgIHZhciBkZnMgPSBmdW5jdGlvbihub2RlLCBkZXB0aCwgdG9wLCBib3R0b20pIHtcbiAgICAgICAgICAgIHBsYWNlKG5vZGUsIHRvcCArIGJvdHRvbSwgZGVwdGggKiB3Z2FwKTtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEdbbm9kZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoR1tub2RlXVtpXSkgY2hpbGRyZW4rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2Z2FwID0gKGJvdHRvbSAtIHRvcCkgLyBjaGlsZHJlbjtcbiAgICAgICAgICAgIHZhciBjbnQgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBHW25vZGVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKEdbbm9kZV1baV0pIGRmcyhpLCBkZXB0aCArIDEsIHRvcCArIHZnYXAgKiBjbnQsIHRvcCArIHZnYXAgKiArK2NudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGRmcyhyb290LCAwLCAwLCAxKTtcblxuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB9LFxuICAgIHNldERhdGE6IGZ1bmN0aW9uKEcpIHtcbiAgICAgICAgaWYgKFRyYWNlci5wcm90b3R5cGUuc2V0RGF0YS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB0aGlzLmdyYXBoLmNsZWFyKCk7XG4gICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICB2YXIgZWRnZXMgPSBbXTtcbiAgICAgICAgdmFyIHVuaXRBbmdsZSA9IDIgKiBNYXRoLlBJIC8gRy5sZW5ndGg7XG4gICAgICAgIHZhciBjdXJyZW50QW5nbGUgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGN1cnJlbnRBbmdsZSArPSB1bml0QW5nbGU7XG4gICAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5uKGkpLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnJyArIGksXG4gICAgICAgICAgICAgICAgeDogLjUgKyBNYXRoLnNpbihjdXJyZW50QW5nbGUpIC8gMixcbiAgICAgICAgICAgICAgICB5OiAuNSArIE1hdGguY29zKGN1cnJlbnRBbmdsZSkgLyAyLFxuICAgICAgICAgICAgICAgIHNpemU6IDEsXG4gICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IEdbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoR1tpXVtqXSkge1xuICAgICAgICAgICAgICAgICAgICBlZGdlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLmUoaSwgaiksXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMubihpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy5uKGopLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IDFcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ncmFwaC5yZWFkKHtcbiAgICAgICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgICAgIGVkZ2VzOiBlZGdlc1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zLmNhbWVyYS5nb1RvKHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICByYXRpbzogMVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgcmVzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5yZXNpemUuY2FsbCh0aGlzKTtcblxuICAgICAgICB0aGlzLnMucmVuZGVyZXJzWzBdLnJlc2l6ZSgpO1xuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB9LFxuICAgIHJlZnJlc2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICBUcmFjZXIucHJvdG90eXBlLnJlZnJlc2guY2FsbCh0aGlzKTtcblxuICAgICAgICB0aGlzLnMucmVmcmVzaCgpO1xuICAgIH0sXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBUcmFjZXIucHJvdG90eXBlLmNsZWFyLmNhbGwodGhpcyk7XG5cbiAgICAgICAgdGhpcy5jbGVhckdyYXBoQ29sb3IoKTtcbiAgICB9LFxuICAgIGNvbG9yOiB7XG4gICAgICAgIHZpc2l0ZWQ6ICcjZjAwJyxcbiAgICAgICAgbGVmdDogJyMwMDAnLFxuICAgICAgICBkZWZhdWx0OiAnIzg4OCdcbiAgICB9LFxuICAgIGNsZWFyR3JhcGhDb2xvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0cmFjZXIgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuZ3JhcGgubm9kZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIG5vZGUuY29sb3IgPSB0cmFjZXIuY29sb3IuZGVmYXVsdDtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZ3JhcGguZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2UpIHtcbiAgICAgICAgICAgIGVkZ2UuY29sb3IgPSB0cmFjZXIuY29sb3IuZGVmYXVsdDtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBuOiBmdW5jdGlvbih2KSB7XG4gICAgICAgIHJldHVybiAnbicgKyB2O1xuICAgIH0sXG4gICAgZTogZnVuY3Rpb24odjEsIHYyKSB7XG4gICAgICAgIHJldHVybiAnZScgKyB2MSArICdfJyArIHYyO1xuICAgIH0sXG4gICAgZ2V0Q29sb3I6IGZ1bmN0aW9uKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgY29sb3IgPSBlZGdlLmNvbG9yLFxuICAgICAgICAgICAgZWRnZUNvbG9yID0gc2V0dGluZ3MoJ2VkZ2VDb2xvcicpLFxuICAgICAgICAgICAgZGVmYXVsdE5vZGVDb2xvciA9IHNldHRpbmdzKCdkZWZhdWx0Tm9kZUNvbG9yJyksXG4gICAgICAgICAgICBkZWZhdWx0RWRnZUNvbG9yID0gc2V0dGluZ3MoJ2RlZmF1bHRFZGdlQ29sb3InKTtcbiAgICAgICAgaWYgKCFjb2xvcilcbiAgICAgICAgICAgIHN3aXRjaCAoZWRnZUNvbG9yKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnc291cmNlJzpcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgPSBzb3VyY2UuY29sb3IgfHwgZGVmYXVsdE5vZGVDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndGFyZ2V0JzpcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgPSB0YXJnZXQuY29sb3IgfHwgZGVmYXVsdE5vZGVDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgPSBkZWZhdWx0RWRnZUNvbG9yO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29sb3I7XG4gICAgfSxcbiAgICBkcmF3TGFiZWw6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBmb250U2l6ZSxcbiAgICAgICAgICAgIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJyxcbiAgICAgICAgICAgIHNpemUgPSBub2RlW3ByZWZpeCArICdzaXplJ107XG5cbiAgICAgICAgaWYgKHNpemUgPCBzZXR0aW5ncygnbGFiZWxUaHJlc2hvbGQnKSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBpZiAoIW5vZGUubGFiZWwgfHwgdHlwZW9mIG5vZGUubGFiZWwgIT09ICdzdHJpbmcnKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGZvbnRTaXplID0gKHNldHRpbmdzKCdsYWJlbFNpemUnKSA9PT0gJ2ZpeGVkJykgP1xuICAgICAgICAgICAgc2V0dGluZ3MoJ2RlZmF1bHRMYWJlbFNpemUnKSA6XG4gICAgICAgICAgICBzZXR0aW5ncygnbGFiZWxTaXplUmF0aW8nKSAqIHNpemU7XG5cbiAgICAgICAgY29udGV4dC5mb250ID0gKHNldHRpbmdzKCdmb250U3R5bGUnKSA/IHNldHRpbmdzKCdmb250U3R5bGUnKSArICcgJyA6ICcnKSArXG4gICAgICAgICAgICBmb250U2l6ZSArICdweCAnICsgc2V0dGluZ3MoJ2ZvbnQnKTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAoc2V0dGluZ3MoJ2xhYmVsQ29sb3InKSA9PT0gJ25vZGUnKSA/XG4gICAgICAgICAgICAobm9kZS5jb2xvciB8fCBzZXR0aW5ncygnZGVmYXVsdE5vZGVDb2xvcicpKSA6XG4gICAgICAgICAgICBzZXR0aW5ncygnZGVmYXVsdExhYmVsQ29sb3InKTtcblxuICAgICAgICBjb250ZXh0LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KFxuICAgICAgICAgICAgbm9kZS5sYWJlbCxcbiAgICAgICAgICAgIE1hdGgucm91bmQobm9kZVtwcmVmaXggKyAneCddKSxcbiAgICAgICAgICAgIE1hdGgucm91bmQobm9kZVtwcmVmaXggKyAneSddICsgZm9udFNpemUgLyAzKVxuICAgICAgICApO1xuICAgIH0sXG4gICAgZHJhd0Fycm93OiBmdW5jdGlvbihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXG4gICAgICAgICAgICBzaXplID0gZWRnZVtwcmVmaXggKyAnc2l6ZSddIHx8IDEsXG4gICAgICAgICAgICB0U2l6ZSA9IHRhcmdldFtwcmVmaXggKyAnc2l6ZSddLFxuICAgICAgICAgICAgc1ggPSBzb3VyY2VbcHJlZml4ICsgJ3gnXSxcbiAgICAgICAgICAgIHNZID0gc291cmNlW3ByZWZpeCArICd5J10sXG4gICAgICAgICAgICB0WCA9IHRhcmdldFtwcmVmaXggKyAneCddLFxuICAgICAgICAgICAgdFkgPSB0YXJnZXRbcHJlZml4ICsgJ3knXSxcbiAgICAgICAgICAgIGFuZ2xlID0gTWF0aC5hdGFuMih0WSAtIHNZLCB0WCAtIHNYKSxcbiAgICAgICAgICAgIGRpc3QgPSAzO1xuICAgICAgICBzWCArPSBNYXRoLnNpbihhbmdsZSkgKiBkaXN0O1xuICAgICAgICB0WCArPSBNYXRoLnNpbihhbmdsZSkgKiBkaXN0O1xuICAgICAgICBzWSArPSAtTWF0aC5jb3MoYW5nbGUpICogZGlzdDtcbiAgICAgICAgdFkgKz0gLU1hdGguY29zKGFuZ2xlKSAqIGRpc3Q7XG4gICAgICAgIHZhciBhU2l6ZSA9IE1hdGgubWF4KHNpemUgKiAyLjUsIHNldHRpbmdzKCdtaW5BcnJvd1NpemUnKSksXG4gICAgICAgICAgICBkID0gTWF0aC5zcXJ0KE1hdGgucG93KHRYIC0gc1gsIDIpICsgTWF0aC5wb3codFkgLSBzWSwgMikpLFxuICAgICAgICAgICAgYVggPSBzWCArICh0WCAtIHNYKSAqIChkIC0gYVNpemUgLSB0U2l6ZSkgLyBkLFxuICAgICAgICAgICAgYVkgPSBzWSArICh0WSAtIHNZKSAqIChkIC0gYVNpemUgLSB0U2l6ZSkgLyBkLFxuICAgICAgICAgICAgdlggPSAodFggLSBzWCkgKiBhU2l6ZSAvIGQsXG4gICAgICAgICAgICB2WSA9ICh0WSAtIHNZKSAqIGFTaXplIC8gZDtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gc2l6ZTtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oc1gsIHNZKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oXG4gICAgICAgICAgICBhWCxcbiAgICAgICAgICAgIGFZXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oYVggKyB2WCwgYVkgKyB2WSk7XG4gICAgICAgIGNvbnRleHQubGluZVRvKGFYICsgdlkgKiAwLjYsIGFZIC0gdlggKiAwLjYpO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhhWCAtIHZZICogMC42LCBhWSArIHZYICogMC42KTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oYVggKyB2WCwgYVkgKyB2WSk7XG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgIH0sXG4gICAgZHJhd09uSG92ZXI6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzLCBuZXh0KSB7XG4gICAgICAgIHZhciB0cmFjZXIgPSB0aGlzO1xuXG4gICAgICAgIGNvbnRleHQuc2V0TGluZURhc2goWzUsIDVdKTtcbiAgICAgICAgdmFyIG5vZGVJZHggPSBub2RlLmlkLnN1YnN0cmluZygxKTtcbiAgICAgICAgdGhpcy5ncmFwaC5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24oZWRnZSkge1xuICAgICAgICAgICAgdmFyIGVuZHMgPSBlZGdlLmlkLnN1YnN0cmluZygxKS5zcGxpdChcIl9cIik7XG4gICAgICAgICAgICBpZiAoZW5kc1swXSA9PSBub2RlSWR4KSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gJyMwZmYnO1xuICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBub2RlO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSB0cmFjZXIuZ3JhcGgubm9kZXMoJ24nICsgZW5kc1sxXSk7XG4gICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdBcnJvdyhlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICBpZiAobmV4dCkgbmV4dChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZW5kc1sxXSA9PSBub2RlSWR4KSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gJyNmZjAnO1xuICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSB0cmFjZXIuZ3JhcGgubm9kZXMoJ24nICsgZW5kc1swXSk7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IG5vZGU7XG4gICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdBcnJvdyhlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICBpZiAobmV4dCkgbmV4dChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbnZhciBEaXJlY3RlZEdyYXBoID0ge1xuICAgIHJhbmRvbTogZnVuY3Rpb24oTiwgcmF0aW8pIHtcbiAgICAgICAgaWYgKCFOKSBOID0gNTtcbiAgICAgICAgaWYgKCFyYXRpbykgcmF0aW8gPSAuMztcbiAgICAgICAgdmFyIEcgPSBuZXcgQXJyYXkoTik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XG4gICAgICAgICAgICBHW2ldID0gbmV3IEFycmF5KE4pO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBOOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSAhPSBqKSB7XG4gICAgICAgICAgICAgICAgICAgIEdbaV1bal0gPSAoTWF0aC5yYW5kb20oKSAqICgxIC8gcmF0aW8pIHwgMCkgPT0gMCA/IDEgOiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRztcbiAgICB9XG59O1xuXG5zaWdtYS5jYW52YXMubGFiZWxzLmRlZiA9IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgdmFyIGZ1bmMgPSBzZXR0aW5ncygnZnVuY0xhYmVsc0RlZicpO1xuICAgIGlmIChmdW5jKSB7XG4gICAgICAgIGZ1bmMobm9kZSwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgIH1cbn07XG5zaWdtYS5jYW52YXMuaG92ZXJzLmRlZiA9IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgdmFyIGZ1bmMgPSBzZXR0aW5ncygnZnVuY0hvdmVyc0RlZicpO1xuICAgIGlmIChmdW5jKSB7XG4gICAgICAgIGZ1bmMobm9kZSwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgIH1cbn07XG5zaWdtYS5jYW52YXMuZWRnZXMuZGVmID0gZnVuY3Rpb24oZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgdmFyIGZ1bmMgPSBzZXR0aW5ncygnZnVuY0VkZ2VzRGVmJyk7XG4gICAgaWYgKGZ1bmMpIHtcbiAgICAgICAgZnVuYyhlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgIH1cbn07XG5zaWdtYS5jYW52YXMuZWRnZXMuYXJyb3cgPSBmdW5jdGlvbihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgZnVuYyA9IHNldHRpbmdzKCdmdW5jRWRnZXNBcnJvdycpO1xuICAgIGlmIChmdW5jKSB7XG4gICAgICAgIGZ1bmMoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBEaXJlY3RlZEdyYXBoLFxuICAgIERpcmVjdGVkR3JhcGhUcmFjZXJcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBUcmFjZXIgPSByZXF1aXJlKCcuL3RyYWNlcicpO1xuXG5jb25zdCBMb2dUcmFjZXIgPSByZXF1aXJlKCcuL2xvZ190cmFjZXInKTtcblxuY29uc3Qge1xuICBBcnJheTFELFxuICBBcnJheTFEVHJhY2VyXG59ID0gcmVxdWlyZSgnLi9hcnJheTFkJyk7XG5jb25zdCB7XG4gIEFycmF5MkQsXG4gIEFycmF5MkRUcmFjZXJcbn0gPSByZXF1aXJlKCcuL2FycmF5MmQnKTtcblxuY29uc3QgQ2hhcnRUcmFjZXIgPSByZXF1aXJlKCcuL2NoYXJ0Jyk7XG5cbmNvbnN0IHtcbiAgRGlyZWN0ZWRHcmFwaCxcbiAgRGlyZWN0ZWRHcmFwaFRyYWNlclxufSA9IHJlcXVpcmUoJy4vZGlyZWN0ZWRfZ3JhcGgnKTtcbmNvbnN0IHtcbiAgVW5kaXJlY3RlZEdyYXBoLFxuICBVbmRpcmVjdGVkR3JhcGhUcmFjZXJcbn0gPSByZXF1aXJlKCcuL3VuZGlyZWN0ZWRfZ3JhcGgnKTtcblxuY29uc3Qge1xuICBXZWlnaHRlZERpcmVjdGVkR3JhcGgsXG4gIFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlclxufSA9IHJlcXVpcmUoJy4vd2VpZ2h0ZWRfZGlyZWN0ZWRfZ3JhcGgnKTtcbmNvbnN0IHtcbiAgV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGgsXG4gIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyXG59ID0gcmVxdWlyZSgnLi93ZWlnaHRlZF91bmRpcmVjdGVkX2dyYXBoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBUcmFjZXIsXG4gIExvZ1RyYWNlcixcbiAgQXJyYXkxRCxcbiAgQXJyYXkxRFRyYWNlcixcbiAgQXJyYXkyRCxcbiAgQXJyYXkyRFRyYWNlcixcbiAgQ2hhcnRUcmFjZXIsXG4gIERpcmVjdGVkR3JhcGgsXG4gIERpcmVjdGVkR3JhcGhUcmFjZXIsXG4gIFVuZGlyZWN0ZWRHcmFwaCxcbiAgVW5kaXJlY3RlZEdyYXBoVHJhY2VyLFxuICBXZWlnaHRlZERpcmVjdGVkR3JhcGgsXG4gIFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlcixcbiAgV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGgsXG4gIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyXG59OyIsImNvbnN0IFRyYWNlciA9IHJlcXVpcmUoJy4vdHJhY2VyJyk7XG5cbmZ1bmN0aW9uIExvZ1RyYWNlcigpIHtcbiAgICBpZiAoVHJhY2VyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgTG9nVHJhY2VyLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbkxvZ1RyYWNlci5wcm90b3R5cGUgPSAkLmV4dGVuZCh0cnVlLCBPYmplY3QuY3JlYXRlKFRyYWNlci5wcm90b3R5cGUpLCB7XG4gICAgY29uc3RydWN0b3I6IExvZ1RyYWNlcixcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kd3JhcHBlciA9IHRoaXMuY2Fwc3VsZS4kd3JhcHBlciA9ICQoJzxkaXYgY2xhc3M9XCJ3cmFwcGVyXCI+Jyk7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5hcHBlbmQodGhpcy4kd3JhcHBlcik7XG4gICAgfSxcbiAgICBfcHJpbnQ6IGZ1bmN0aW9uKG1zZykge1xuICAgICAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICAgICAgICB0eXBlOiAncHJpbnQnLFxuICAgICAgICAgICAgbXNnOiBtc2dcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcHJvY2Vzc1N0ZXA6IGZ1bmN0aW9uKHN0ZXAsIG9wdGlvbnMpIHtcbiAgICAgICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3ByaW50JzpcbiAgICAgICAgICAgICAgICB0aGlzLnByaW50KHN0ZXAubXNnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVmcmVzaDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9FbmQoTWF0aC5taW4oNTAsIHRoaXMuaW50ZXJ2YWwpKTtcbiAgICB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5jbGVhci5jYWxsKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuJHdyYXBwZXIuZW1wdHkoKTtcbiAgICB9LFxuICAgIHByaW50OiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICAgIHRoaXMuJHdyYXBwZXIuYXBwZW5kKCQoJzxzcGFuPicpLmFwcGVuZChtZXNzYWdlICsgJzxici8+JykpO1xuICAgIH0sXG4gICAgc2Nyb2xsVG9FbmQ6IGZ1bmN0aW9uKGR1cmF0aW9uKSB7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5hbmltYXRlKHtcbiAgICAgICAgICAgIHNjcm9sbFRvcDogdGhpcy4kY29udGFpbmVyWzBdLnNjcm9sbEhlaWdodFxuICAgICAgICB9LCBkdXJhdGlvbik7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9nVHJhY2VyOyIsImNvbnN0IHtcbiAgICB0b0pTT04sXG4gICAgZnJvbUpTT05cbn0gPSByZXF1aXJlKCcuLi90cmFjZXJfbWFuYWdlci91dGlsJyk7XG5cbmZ1bmN0aW9uIFRyYWNlcihuYW1lKSB7XG4gICAgdGhpcy5tb2R1bGUgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgIHRoaXMuY2Fwc3VsZSA9IHRoaXMubWFuYWdlci5hbGxvY2F0ZSh0aGlzKTtcbiAgICAkLmV4dGVuZCh0aGlzLCB0aGlzLmNhcHN1bGUpO1xuICAgIHRoaXMuc2V0TmFtZShuYW1lKTtcbiAgICByZXR1cm4gdGhpcy5pc05ldztcbn1cblxuVHJhY2VyLnByb3RvdHlwZSA9IHtcblxuICAgIGNvbnN0cnVjdG9yOiBUcmFjZXIsXG4gICAgbWFuYWdlcjogbnVsbCxcblxuICAgIF9zZXREYXRhKC4uLmFyZ3MpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ3NldERhdGEnLFxuICAgICAgICAgICAgYXJnczogdG9KU09OKGFyZ3MpXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgX2NsZWFyKCkge1xuICAgICAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICAgICAgICB0eXBlOiAnY2xlYXInXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgX3dhaXQoKSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5uZXdTdGVwKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBwcm9jZXNzU3RlcChzdGVwLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICBhcmdzXG4gICAgICAgIH0gPSBzdGVwO1xuXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnc2V0RGF0YSc6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhKC4uLmZyb21KU09OKGFyZ3MpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NsZWFyJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0TmFtZShuYW1lKSB7XG4gICAgICAgIGxldCAkbmFtZTtcbiAgICAgICAgaWYgKHRoaXMuaXNOZXcpIHtcbiAgICAgICAgICAgICRuYW1lID0gJCgnPHNwYW4gY2xhc3M9XCJuYW1lXCI+Jyk7XG4gICAgICAgICAgICB0aGlzLiRjb250YWluZXIuYXBwZW5kKCRuYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRuYW1lID0gdGhpcy4kY29udGFpbmVyLmZpbmQoJ3NwYW4ubmFtZScpO1xuICAgICAgICB9XG4gICAgICAgICRuYW1lLnRleHQobmFtZSB8fCB0aGlzLmRlZmF1bHROYW1lKTtcbiAgICB9LFxuXG4gICAgc2V0RGF0YSgpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRvSlNPTihhcmd1bWVudHMpO1xuICAgICAgICBpZiAoIXRoaXMuaXNOZXcgJiYgdGhpcy5sYXN0RGF0YSA9PT0gZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc05ldyA9IHRoaXMuY2Fwc3VsZS5pc05ldyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxhc3REYXRhID0gdGhpcy5jYXBzdWxlLmxhc3REYXRhID0gZGF0YTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICByZXNpemUoKSB7fSxcbiAgICByZWZyZXNoKCkge30sXG4gICAgY2xlYXIoKSB7fSxcblxuICAgIGF0dGFjaCh0cmFjZXIpIHtcbiAgICAgICAgaWYgKHRyYWNlci5tb2R1bGUgPT09IExvZ1RyYWNlcikge1xuICAgICAgICAgICAgdGhpcy5sb2dUcmFjZXIgPSB0cmFjZXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIG1vdXNlZG93bihlKSB7fSxcbiAgICBtb3VzZW1vdmUoZSkge30sXG4gICAgbW91c2V1cChlKSB7fSxcbiAgICBtb3VzZXdoZWVsKGUpIHt9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlcjsiLCJjb25zdCB7XG4gICAgRGlyZWN0ZWRHcmFwaCxcbiAgICBEaXJlY3RlZEdyYXBoVHJhY2VyXG59ID0gcmVxdWlyZSgnLi9kaXJlY3RlZF9ncmFwaCcpO1xuXG5mdW5jdGlvbiBVbmRpcmVjdGVkR3JhcGhUcmFjZXIoKSB7XG4gICAgaWYgKERpcmVjdGVkR3JhcGhUcmFjZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICBVbmRpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLmluaXQuY2FsbCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuVW5kaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHRydWUsIE9iamVjdC5jcmVhdGUoRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUpLCB7XG4gICAgY29uc3RydWN0b3I6IFVuZGlyZWN0ZWRHcmFwaFRyYWNlcixcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHRyYWNlciA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5zLnNldHRpbmdzKHtcbiAgICAgICAgICAgIGRlZmF1bHRFZGdlVHlwZTogJ2RlZicsXG4gICAgICAgICAgICBmdW5jRWRnZXNEZWY6IGZ1bmN0aW9uKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IHRyYWNlci5nZXRDb2xvcihlZGdlLCBzb3VyY2UsIHRhcmdldCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3RWRnZShlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBzZXREYXRhOiBmdW5jdGlvbihHKSB7XG4gICAgICAgIGlmIChUcmFjZXIucHJvdG90eXBlLnNldERhdGEuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgdGhpcy5ncmFwaC5jbGVhcigpO1xuICAgICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgICAgdmFyIGVkZ2VzID0gW107XG4gICAgICAgIHZhciB1bml0QW5nbGUgPSAyICogTWF0aC5QSSAvIEcubGVuZ3RoO1xuICAgICAgICB2YXIgY3VycmVudEFuZ2xlID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBHLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjdXJyZW50QW5nbGUgKz0gdW5pdEFuZ2xlO1xuICAgICAgICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMubihpKSxcbiAgICAgICAgICAgICAgICBsYWJlbDogJycgKyBpLFxuICAgICAgICAgICAgICAgIHg6IC41ICsgTWF0aC5zaW4oY3VycmVudEFuZ2xlKSAvIDIsXG4gICAgICAgICAgICAgICAgeTogLjUgKyBNYXRoLmNvcyhjdXJyZW50QW5nbGUpIC8gMixcbiAgICAgICAgICAgICAgICBzaXplOiAxLFxuICAgICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLmRlZmF1bHRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgRy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPD0gaTsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKEdbaV1bal0gfHwgR1tqXVtpXSkge1xuICAgICAgICAgICAgICAgICAgICBlZGdlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLmUoaSwgaiksXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMubihpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy5uKGopLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IDFcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ncmFwaC5yZWFkKHtcbiAgICAgICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgICAgIGVkZ2VzOiBlZGdlc1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zLmNhbWVyYS5nb1RvKHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICByYXRpbzogMVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgZTogZnVuY3Rpb24odjEsIHYyKSB7XG4gICAgICAgIGlmICh2MSA+IHYyKSB7XG4gICAgICAgICAgICB2YXIgdGVtcCA9IHYxO1xuICAgICAgICAgICAgdjEgPSB2MjtcbiAgICAgICAgICAgIHYyID0gdGVtcDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ2UnICsgdjEgKyAnXycgKyB2MjtcbiAgICB9LFxuICAgIGRyYXdPbkhvdmVyOiBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncywgbmV4dCkge1xuICAgICAgICB2YXIgdHJhY2VyID0gdGhpcztcblxuICAgICAgICBjb250ZXh0LnNldExpbmVEYXNoKFs1LCA1XSk7XG4gICAgICAgIHZhciBub2RlSWR4ID0gbm9kZS5pZC5zdWJzdHJpbmcoMSk7XG4gICAgICAgIHRoaXMuZ3JhcGguZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2UpIHtcbiAgICAgICAgICAgIHZhciBlbmRzID0gZWRnZS5pZC5zdWJzdHJpbmcoMSkuc3BsaXQoXCJfXCIpO1xuICAgICAgICAgICAgaWYgKGVuZHNbMF0gPT0gbm9kZUlkeCkge1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9ICcjMGZmJztcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gbm9kZTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gdHJhY2VyLmdyYXBoLm5vZGVzKCduJyArIGVuZHNbMV0pO1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3RWRnZShlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICBpZiAobmV4dCkgbmV4dChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZW5kc1sxXSA9PSBub2RlSWR4KSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gJyMwZmYnO1xuICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSB0cmFjZXIuZ3JhcGgubm9kZXMoJ24nICsgZW5kc1swXSk7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IG5vZGU7XG4gICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdFZGdlKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIGlmIChuZXh0KSBuZXh0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGRyYXdFZGdlOiBmdW5jdGlvbihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXG4gICAgICAgICAgICBzaXplID0gZWRnZVtwcmVmaXggKyAnc2l6ZSddIHx8IDE7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHNpemU7XG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQubW92ZVRvKFxuICAgICAgICAgICAgc291cmNlW3ByZWZpeCArICd4J10sXG4gICAgICAgICAgICBzb3VyY2VbcHJlZml4ICsgJ3knXVxuICAgICAgICApO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhcbiAgICAgICAgICAgIHRhcmdldFtwcmVmaXggKyAneCddLFxuICAgICAgICAgICAgdGFyZ2V0W3ByZWZpeCArICd5J11cbiAgICAgICAgKTtcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICB9XG59KTtcblxudmFyIFVuZGlyZWN0ZWRHcmFwaCA9IHtcbiAgICByYW5kb206IGZ1bmN0aW9uKE4sIHJhdGlvKSB7XG4gICAgICAgIGlmICghTikgTiA9IDU7XG4gICAgICAgIGlmICghcmF0aW8pIHJhdGlvID0gLjM7XG4gICAgICAgIHZhciBHID0gbmV3IEFycmF5KE4pO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE47IGkrKykgR1tpXSA9IG5ldyBBcnJheShOKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgTjsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPiBqKSB7XG4gICAgICAgICAgICAgICAgICAgIEdbaV1bal0gPSBHW2pdW2ldID0gKE1hdGgucmFuZG9tKCkgKiAoMSAvIHJhdGlvKSB8IDApID09IDAgPyAxIDogMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEc7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgVW5kaXJlY3RlZEdyYXBoLFxuICAgIFVuZGlyZWN0ZWRHcmFwaFRyYWNlclxufTsiLCJjb25zdCB7XG4gICAgRGlyZWN0ZWRHcmFwaCxcbiAgICBEaXJlY3RlZEdyYXBoVHJhY2VyXG59ID0gcmVxdWlyZSgnLi9kaXJlY3RlZF9ncmFwaCcpO1xuXG5jb25zdCB7XG4gICAgcmVmaW5lQnlUeXBlXG59ID0gcmVxdWlyZSgnLi4vdHJhY2VyX21hbmFnZXIvdXRpbCcpO1xuXG5mdW5jdGlvbiBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIoKSB7XG4gICAgaWYgKERpcmVjdGVkR3JhcGhUcmFjZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLmluaXQuY2FsbCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuV2VpZ2h0ZWREaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHRydWUsIE9iamVjdC5jcmVhdGUoRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUpLCB7XG4gICAgY29uc3RydWN0b3I6IFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlcixcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHRyYWNlciA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5zLnNldHRpbmdzKHtcbiAgICAgICAgICAgIGVkZ2VMYWJlbFNpemU6ICdwcm9wb3J0aW9uYWwnLFxuICAgICAgICAgICAgZGVmYXVsdEVkZ2VMYWJlbFNpemU6IDIwLFxuICAgICAgICAgICAgZWRnZUxhYmVsU2l6ZVBvd1JhdGlvOiAwLjgsXG4gICAgICAgICAgICBmdW5jTGFiZWxzRGVmOiBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3Tm9kZVdlaWdodChub2RlLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdMYWJlbChub2RlLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY0hvdmVyc0RlZjogZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICB0cmFjZXIuZHJhd09uSG92ZXIobm9kZSwgY29udGV4dCwgc2V0dGluZ3MsIHRyYWNlci5kcmF3RWRnZVdlaWdodCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY0VkZ2VzQXJyb3c6IGZ1bmN0aW9uKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IHRyYWNlci5nZXRDb2xvcihlZGdlLCBzb3VyY2UsIHRhcmdldCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3QXJyb3coZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdFZGdlV2VpZ2h0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIF93ZWlnaHQ6IGZ1bmN0aW9uKHRhcmdldCwgd2VpZ2h0KSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICd3ZWlnaHQnLFxuICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgICB3ZWlnaHQ6IHdlaWdodFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfdmlzaXQ6IGZ1bmN0aW9uKHRhcmdldCwgc291cmNlLCB3ZWlnaHQpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ3Zpc2l0JyxcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgICB3ZWlnaHQ6IHdlaWdodFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfbGVhdmU6IGZ1bmN0aW9uKHRhcmdldCwgc291cmNlLCB3ZWlnaHQpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ2xlYXZlJyxcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgICB3ZWlnaHQ6IHdlaWdodFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBwcm9jZXNzU3RlcDogZnVuY3Rpb24oc3RlcCwgb3B0aW9ucykge1xuICAgICAgICBzd2l0Y2ggKHN0ZXAudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnd2VpZ2h0JzpcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0Tm9kZSA9IHRoaXMuZ3JhcGgubm9kZXModGhpcy5uKHN0ZXAudGFyZ2V0KSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0ZXAud2VpZ2h0ICE9PSB1bmRlZmluZWQpIHRhcmdldE5vZGUud2VpZ2h0ID0gcmVmaW5lQnlUeXBlKHN0ZXAud2VpZ2h0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2l0JzpcbiAgICAgICAgICAgIGNhc2UgJ2xlYXZlJzpcbiAgICAgICAgICAgICAgICB2YXIgdmlzaXQgPSBzdGVwLnR5cGUgPT0gJ3Zpc2l0JztcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0Tm9kZSA9IHRoaXMuZ3JhcGgubm9kZXModGhpcy5uKHN0ZXAudGFyZ2V0KSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gdmlzaXQgPyB0aGlzLmNvbG9yLnZpc2l0ZWQgOiB0aGlzLmNvbG9yLmxlZnQ7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZS5jb2xvciA9IGNvbG9yO1xuICAgICAgICAgICAgICAgIGlmIChzdGVwLndlaWdodCAhPT0gdW5kZWZpbmVkKSB0YXJnZXROb2RlLndlaWdodCA9IHJlZmluZUJ5VHlwZShzdGVwLndlaWdodCk7XG4gICAgICAgICAgICAgICAgaWYgKHN0ZXAuc291cmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2VJZCA9IHRoaXMuZShzdGVwLnNvdXJjZSwgc3RlcC50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWRnZSA9IHRoaXMuZ3JhcGguZWRnZXMoZWRnZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgZWRnZS5jb2xvciA9IGNvbG9yO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYXBoLmRyb3BFZGdlKGVkZ2VJZCkuYWRkRWRnZShlZGdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubG9nVHJhY2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBzdGVwLnNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZSA9PT0gdW5kZWZpbmVkKSBzb3VyY2UgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dUcmFjZXIucHJpbnQodmlzaXQgPyBzb3VyY2UgKyAnIC0+ICcgKyBzdGVwLnRhcmdldCA6IHNvdXJjZSArICcgPC0gJyArIHN0ZXAudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIERpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLnByb2Nlc3NTdGVwLmNhbGwodGhpcywgc3RlcCwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldERhdGE6IGZ1bmN0aW9uKEcpIHtcbiAgICAgICAgaWYgKFRyYWNlci5wcm90b3R5cGUuc2V0RGF0YS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB0aGlzLmdyYXBoLmNsZWFyKCk7XG4gICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICB2YXIgZWRnZXMgPSBbXTtcbiAgICAgICAgdmFyIHVuaXRBbmdsZSA9IDIgKiBNYXRoLlBJIC8gRy5sZW5ndGg7XG4gICAgICAgIHZhciBjdXJyZW50QW5nbGUgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGN1cnJlbnRBbmdsZSArPSB1bml0QW5nbGU7XG4gICAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5uKGkpLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnJyArIGksXG4gICAgICAgICAgICAgICAgeDogLjUgKyBNYXRoLnNpbihjdXJyZW50QW5nbGUpIC8gMixcbiAgICAgICAgICAgICAgICB5OiAuNSArIE1hdGguY29zKGN1cnJlbnRBbmdsZSkgLyAyLFxuICAgICAgICAgICAgICAgIHNpemU6IDEsXG4gICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBHW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKEdbaV1bal0pIHtcbiAgICAgICAgICAgICAgICAgICAgZWRnZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy5lKGksIGopLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLm4oaSksXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRoaXMubihqKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLmRlZmF1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiByZWZpbmVCeVR5cGUoR1tpXVtqXSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ncmFwaC5yZWFkKHtcbiAgICAgICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgICAgIGVkZ2VzOiBlZGdlc1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zLmNhbWVyYS5nb1RvKHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICByYXRpbzogMVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBEaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5jbGVhci5jYWxsKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuY2xlYXJXZWlnaHRzKCk7XG4gICAgfSxcbiAgICBjbGVhcldlaWdodHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmdyYXBoLm5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICBub2RlLndlaWdodCA9IDA7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZHJhd0VkZ2VXZWlnaHQ6IGZ1bmN0aW9uKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHNvdXJjZSA9PSB0YXJnZXQpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJyxcbiAgICAgICAgICAgIHNpemUgPSBlZGdlW3ByZWZpeCArICdzaXplJ10gfHwgMTtcblxuICAgICAgICBpZiAoc2l6ZSA8IHNldHRpbmdzKCdlZGdlTGFiZWxUaHJlc2hvbGQnKSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBpZiAoMCA9PT0gc2V0dGluZ3MoJ2VkZ2VMYWJlbFNpemVQb3dSYXRpbycpKVxuICAgICAgICAgICAgdGhyb3cgJ1wiZWRnZUxhYmVsU2l6ZVBvd1JhdGlvXCIgbXVzdCBub3QgYmUgMC4nO1xuXG4gICAgICAgIHZhciBmb250U2l6ZSxcbiAgICAgICAgICAgIHggPSAoc291cmNlW3ByZWZpeCArICd4J10gKyB0YXJnZXRbcHJlZml4ICsgJ3gnXSkgLyAyLFxuICAgICAgICAgICAgeSA9IChzb3VyY2VbcHJlZml4ICsgJ3knXSArIHRhcmdldFtwcmVmaXggKyAneSddKSAvIDIsXG4gICAgICAgICAgICBkWCA9IHRhcmdldFtwcmVmaXggKyAneCddIC0gc291cmNlW3ByZWZpeCArICd4J10sXG4gICAgICAgICAgICBkWSA9IHRhcmdldFtwcmVmaXggKyAneSddIC0gc291cmNlW3ByZWZpeCArICd5J10sXG4gICAgICAgICAgICBhbmdsZSA9IE1hdGguYXRhbjIoZFksIGRYKTtcblxuICAgICAgICBmb250U2l6ZSA9IChzZXR0aW5ncygnZWRnZUxhYmVsU2l6ZScpID09PSAnZml4ZWQnKSA/XG4gICAgICAgICAgICBzZXR0aW5ncygnZGVmYXVsdEVkZ2VMYWJlbFNpemUnKSA6XG4gICAgICAgICAgICBzZXR0aW5ncygnZGVmYXVsdEVkZ2VMYWJlbFNpemUnKSAqXG4gICAgICAgICAgICBzaXplICpcbiAgICAgICAgICAgIE1hdGgucG93KHNpemUsIC0xIC8gc2V0dGluZ3MoJ2VkZ2VMYWJlbFNpemVQb3dSYXRpbycpKTtcblxuICAgICAgICBjb250ZXh0LnNhdmUoKTtcblxuICAgICAgICBpZiAoZWRnZS5hY3RpdmUpIHtcbiAgICAgICAgICAgIGNvbnRleHQuZm9udCA9IFtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncygnYWN0aXZlRm9udFN0eWxlJyksXG4gICAgICAgICAgICAgICAgZm9udFNpemUgKyAncHgnLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzKCdhY3RpdmVGb250JykgfHwgc2V0dGluZ3MoJ2ZvbnQnKVxuICAgICAgICAgICAgXS5qb2luKCcgJyk7XG5cbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250ZXh0LmZvbnQgPSBbXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MoJ2ZvbnRTdHlsZScpLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplICsgJ3B4JyxcbiAgICAgICAgICAgICAgICBzZXR0aW5ncygnZm9udCcpXG4gICAgICAgICAgICBdLmpvaW4oJyAnKTtcblxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIGNvbnRleHQudGV4dEJhc2VsaW5lID0gJ2FscGhhYmV0aWMnO1xuXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKHgsIHkpO1xuICAgICAgICBjb250ZXh0LnJvdGF0ZShhbmdsZSk7XG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQoXG4gICAgICAgICAgICBlZGdlLndlaWdodCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAoLXNpemUgLyAyKSAtIDNcbiAgICAgICAgKTtcblxuICAgICAgICBjb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9LFxuICAgIGRyYXdOb2RlV2VpZ2h0OiBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgZm9udFNpemUsXG4gICAgICAgICAgICBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXG4gICAgICAgICAgICBzaXplID0gbm9kZVtwcmVmaXggKyAnc2l6ZSddO1xuXG4gICAgICAgIGlmIChzaXplIDwgc2V0dGluZ3MoJ2xhYmVsVGhyZXNob2xkJykpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgZm9udFNpemUgPSAoc2V0dGluZ3MoJ2xhYmVsU2l6ZScpID09PSAnZml4ZWQnKSA/XG4gICAgICAgICAgICBzZXR0aW5ncygnZGVmYXVsdExhYmVsU2l6ZScpIDpcbiAgICAgICAgICAgIHNldHRpbmdzKCdsYWJlbFNpemVSYXRpbycpICogc2l6ZTtcblxuICAgICAgICBjb250ZXh0LmZvbnQgPSAoc2V0dGluZ3MoJ2ZvbnRTdHlsZScpID8gc2V0dGluZ3MoJ2ZvbnRTdHlsZScpICsgJyAnIDogJycpICtcbiAgICAgICAgICAgIGZvbnRTaXplICsgJ3B4ICcgKyBzZXR0aW5ncygnZm9udCcpO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IChzZXR0aW5ncygnbGFiZWxDb2xvcicpID09PSAnbm9kZScpID9cbiAgICAgICAgICAgIChub2RlLmNvbG9yIHx8IHNldHRpbmdzKCdkZWZhdWx0Tm9kZUNvbG9yJykpIDpcbiAgICAgICAgICAgIHNldHRpbmdzKCdkZWZhdWx0TGFiZWxDb2xvcicpO1xuXG4gICAgICAgIGNvbnRleHQudGV4dEFsaWduID0gJ2xlZnQnO1xuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KFxuICAgICAgICAgICAgbm9kZS53ZWlnaHQsXG4gICAgICAgICAgICBNYXRoLnJvdW5kKG5vZGVbcHJlZml4ICsgJ3gnXSArIHNpemUgKiAxLjUpLFxuICAgICAgICAgICAgTWF0aC5yb3VuZChub2RlW3ByZWZpeCArICd5J10gKyBmb250U2l6ZSAvIDMpXG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbnZhciBXZWlnaHRlZERpcmVjdGVkR3JhcGggPSB7XG4gICAgcmFuZG9tOiBmdW5jdGlvbihOLCByYXRpbywgbWluLCBtYXgpIHtcbiAgICAgICAgaWYgKCFOKSBOID0gNTtcbiAgICAgICAgaWYgKCFyYXRpbykgcmF0aW8gPSAuMztcbiAgICAgICAgaWYgKCFtaW4pIG1pbiA9IDE7XG4gICAgICAgIGlmICghbWF4KSBtYXggPSA1O1xuICAgICAgICB2YXIgRyA9IG5ldyBBcnJheShOKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIHtcbiAgICAgICAgICAgIEdbaV0gPSBuZXcgQXJyYXkoTik7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE47IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChpICE9IGogJiYgKE1hdGgucmFuZG9tKCkgKiAoMSAvIHJhdGlvKSB8IDApID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgR1tpXVtqXSA9IChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpIHwgMCkgKyBtaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBHO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFdlaWdodGVkRGlyZWN0ZWRHcmFwaCxcbiAgICBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXJcbn07IiwiY29uc3Qge1xuICAgIFdlaWdodGVkRGlyZWN0ZWRHcmFwaCxcbiAgICBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXJcbn0gPSByZXF1aXJlKCcuL3dlaWdodGVkX2RpcmVjdGVkX2dyYXBoJyk7XG5cbmNvbnN0IHtcbiAgICBVbmRpcmVjdGVkR3JhcGhUcmFjZXJcbn0gPSByZXF1aXJlKCcuL3VuZGlyZWN0ZWRfZ3JhcGgnKTtcblxuZnVuY3Rpb24gV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGhUcmFjZXIoKSB7XG4gICAgaWYgKFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgICAgIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbldlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHRydWUsIE9iamVjdC5jcmVhdGUoV2VpZ2h0ZWREaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZSksIHtcbiAgICBjb25zdHJ1Y3RvcjogV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGhUcmFjZXIsXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0cmFjZXIgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMucy5zZXR0aW5ncyh7XG4gICAgICAgICAgICBkZWZhdWx0RWRnZVR5cGU6ICdkZWYnLFxuICAgICAgICAgICAgZnVuY0VkZ2VzRGVmOiBmdW5jdGlvbihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSB0cmFjZXIuZ2V0Q29sb3IoZWRnZSwgc291cmNlLCB0YXJnZXQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICB0cmFjZXIuZHJhd0VkZ2UoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdFZGdlV2VpZ2h0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHNldERhdGE6IGZ1bmN0aW9uKEcpIHtcbiAgICAgICAgaWYgKFRyYWNlci5wcm90b3R5cGUuc2V0RGF0YS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB0aGlzLmdyYXBoLmNsZWFyKCk7XG4gICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICB2YXIgZWRnZXMgPSBbXTtcbiAgICAgICAgdmFyIHVuaXRBbmdsZSA9IDIgKiBNYXRoLlBJIC8gRy5sZW5ndGg7XG4gICAgICAgIHZhciBjdXJyZW50QW5nbGUgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGN1cnJlbnRBbmdsZSArPSB1bml0QW5nbGU7XG4gICAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5uKGkpLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnJyArIGksXG4gICAgICAgICAgICAgICAgeDogLjUgKyBNYXRoLnNpbihjdXJyZW50QW5nbGUpIC8gMixcbiAgICAgICAgICAgICAgICB5OiAuNSArIE1hdGguY29zKGN1cnJlbnRBbmdsZSkgLyAyLFxuICAgICAgICAgICAgICAgIHNpemU6IDEsXG4gICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgRy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPD0gaTsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKEdbaV1bal0gfHwgR1tqXVtpXSkge1xuICAgICAgICAgICAgICAgICAgICBlZGdlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLmUoaSwgaiksXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMubihpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy5uKGopLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHQ6IEdbaV1bal1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ncmFwaC5yZWFkKHtcbiAgICAgICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgICAgIGVkZ2VzOiBlZGdlc1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zLmNhbWVyYS5nb1RvKHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICByYXRpbzogMVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgZTogVW5kaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5lLFxuICAgIGRyYXdPbkhvdmVyOiBVbmRpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLmRyYXdPbkhvdmVyLFxuICAgIGRyYXdFZGdlOiBVbmRpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLmRyYXdFZGdlLFxuICAgIGRyYXdFZGdlV2VpZ2h0OiBmdW5jdGlvbihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJyc7XG4gICAgICAgIGlmIChzb3VyY2VbcHJlZml4ICsgJ3gnXSA+IHRhcmdldFtwcmVmaXggKyAneCddKSB7XG4gICAgICAgICAgICB2YXIgdGVtcCA9IHNvdXJjZTtcbiAgICAgICAgICAgIHNvdXJjZSA9IHRhcmdldDtcbiAgICAgICAgICAgIHRhcmdldCA9IHRlbXA7XG4gICAgICAgIH1cbiAgICAgICAgV2VpZ2h0ZWREaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5kcmF3RWRnZVdlaWdodC5jYWxsKHRoaXMsIGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgIH1cbn0pO1xuXG52YXIgV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGggPSB7XG4gICAgcmFuZG9tOiBmdW5jdGlvbihOLCByYXRpbywgbWluLCBtYXgpIHtcbiAgICAgICAgaWYgKCFOKSBOID0gNTtcbiAgICAgICAgaWYgKCFyYXRpbykgcmF0aW8gPSAuMztcbiAgICAgICAgaWYgKCFtaW4pIG1pbiA9IDE7XG4gICAgICAgIGlmICghbWF4KSBtYXggPSA1O1xuICAgICAgICB2YXIgRyA9IG5ldyBBcnJheShOKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIEdbaV0gPSBuZXcgQXJyYXkoTik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE47IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChpID4gaiAmJiAoTWF0aC5yYW5kb20oKSAqICgxIC8gcmF0aW8pIHwgMCkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBHW2ldW2pdID0gR1tqXVtpXSA9IChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpIHwgMCkgKyBtaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBHO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoLFxuICAgIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyXG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICh1cmwpID0+IHtcblxuICByZXR1cm4gcmVxdWVzdCh1cmwsIHtcbiAgICB0eXBlOiAnR0VUJ1xuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgnLi9yZXF1ZXN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsKSB7XG4gIHJldHVybiByZXF1ZXN0KHVybCwge1xuICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgdHlwZTogJ0dFVCdcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCwgZGF0YSkge1xuICByZXR1cm4gcmVxdWVzdCh1cmwsIHtcbiAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgIHR5cGU6ICdQT1NUJyxcbiAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgUlNWUCA9IHJlcXVpcmUoJ3JzdnAnKTtcbmNvbnN0IGFwcEluc3RhbmNlID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5cbmNvbnN0IHtcbiAgYWpheCxcbiAgZXh0ZW5kXG59ID0gJDtcblxuY29uc3QgZGVmYXVsdHMgPSB7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsLCBvcHRpb25zID0ge30pIHtcbiAgYXBwSW5zdGFuY2Uuc2V0SXNMb2FkaW5nKHRydWUpO1xuXG4gIHJldHVybiBuZXcgUlNWUC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSB7XG4gICAgICBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgIGFwcEluc3RhbmNlLnNldElzTG9hZGluZyhmYWxzZSk7XG4gICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSxcbiAgICAgIGVycm9yKHJlYXNvbikge1xuICAgICAgICBhcHBJbnN0YW5jZS5zZXRJc0xvYWRpbmcoZmFsc2UpO1xuICAgICAgICByZWplY3QocmVhc29uKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgb3B0cyA9IGV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMsIGNhbGxiYWNrcywge1xuICAgICAgdXJsXG4gICAgfSk7XG5cbiAgICBhamF4KG9wdHMpO1xuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBhcHBJbnN0YW5jZSA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuY29uc3QgVG9hc3QgPSByZXF1aXJlKCcuLi9kb20vdG9hc3QnKTtcblxuY29uc3QgY2hlY2tMb2FkaW5nID0gKCkgPT4ge1xuICBpZiAoYXBwSW5zdGFuY2UuZ2V0SXNMb2FkaW5nKCkpIHtcbiAgICBUb2FzdC5zaG93RXJyb3JUb2FzdCgnV2FpdCB1bnRpbCBpdCBjb21wbGV0ZXMgbG9hZGluZyBvZiBwcmV2aW91cyBmaWxlLicpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IGdldFBhcmFtZXRlckJ5TmFtZSA9IChuYW1lKSA9PiB7XG4gIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICBjb25zdCBjbGVhbk5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csICdcXFxcJCYnKTtcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBbPyZdJHtuYW1lfSg9KFteJiNdKil8JnwjfCQpYCk7XG5cbiAgY29uc3QgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcblxuICBpZiAoIXJlc3VsdHMgfHwgcmVzdWx0cy5sZW5ndGggIT09IDMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IFssICwgaWRdID0gcmVzdWx0cztcblxuICByZXR1cm4gaWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2hlY2tMb2FkaW5nLFxuICBnZXRQYXJhbWV0ZXJCeU5hbWVcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBsb2FkQWxnb3JpdGhtID0gcmVxdWlyZSgnLi9sb2FkX2FsZ29yaXRobScpO1xuY29uc3QgbG9hZENhdGVnb3JpZXMgPSByZXF1aXJlKCcuL2xvYWRfY2F0ZWdvcmllcycpO1xuY29uc3QgbG9hZEZpbGUgPSByZXF1aXJlKCcuL2xvYWRfZmlsZScpO1xuY29uc3QgbG9hZFNjcmF0Y2hQYXBlciA9IHJlcXVpcmUoJy4vbG9hZF9zY3JhdGNoX3BhcGVyJyk7XG5jb25zdCBzaGFyZVNjcmF0Y2hQYXBlciA9IHJlcXVpcmUoJy4vc2hhcmVfc2NyYXRjaF9wYXBlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbG9hZEFsZ29yaXRobSxcbiAgbG9hZENhdGVnb3JpZXMsXG4gIGxvYWRGaWxlLFxuICBsb2FkU2NyYXRjaFBhcGVyLFxuICBzaGFyZVNjcmF0Y2hQYXBlclxufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbmNvbnN0IGdldEpTT04gPSByZXF1aXJlKCcuL2FqYXgvZ2V0X2pzb24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSkgPT4ge1xuICBjb25zdCBkaXIgPSBVdGlscy5nZXRBbGdvcml0aG1EaXIoY2F0ZWdvcnksIGFsZ29yaXRobSk7XG4gIHJldHVybiBnZXRKU09OKGAke2Rpcn1kZXNjLmpzb25gKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBhcHBJbnN0YW5jZSA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuY29uc3QgZ2V0SlNPTiA9IHJlcXVpcmUoJy4vYWpheC9nZXRfanNvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgcmV0dXJuIGdldEpTT04oJy4vYWxnb3JpdGhtL2NhdGVnb3J5Lmpzb24nKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBSU1ZQID0gcmVxdWlyZSgncnN2cCcpO1xuXG5jb25zdCBhcHBJbnN0YW5jZSA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuY29uc3QgVXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5jb25zdCB7XG4gIGNoZWNrTG9hZGluZ1xufSA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xuXG5jb25zdCBnZXQgPSByZXF1aXJlKCcuL2FqYXgvZ2V0Jyk7XG5cbmNvbnN0IGxvYWREYXRhQW5kQ29kZSA9IChkaXIpID0+IHtcbiAgcmV0dXJuIFJTVlAuaGFzaCh7XG4gICAgZGF0YTogZ2V0KGAke2Rpcn1kYXRhLmpzYCksXG4gICAgY29kZTogZ2V0KGAke2Rpcn1jb2RlLmpzYClcbiAgfSk7XG59O1xuXG5jb25zdCBsb2FkRmlsZUFuZFVwZGF0ZUNvbnRlbnQgPSAoZGlyKSA9PiB7XG4gIGFwcEluc3RhbmNlLnNldElzTG9hZGluZyh0cnVlKTtcbiAgYXBwSW5zdGFuY2UuZ2V0RWRpdG9yKCkuY2xlYXJDb250ZW50KCk7XG5cbiAgcmV0dXJuIGxvYWREYXRhQW5kQ29kZShkaXIpLnRoZW4oKGNvbnRlbnQpID0+IHtcbiAgICBhcHBJbnN0YW5jZS51cGRhdGVDYWNoZWRGaWxlKGRpciwgY29udGVudCk7XG4gICAgYXBwSW5zdGFuY2UuZ2V0RWRpdG9yKCkuc2V0Q29udGVudChjb250ZW50KTtcbiAgfSk7XG59O1xuXG5jb25zdCBjYWNoZWRDb250ZW50RXhpc3RzID0gKGNhY2hlZEZpbGUpID0+IHtcbiAgcmV0dXJuIGNhY2hlZEZpbGUgJiZcbiAgICBjYWNoZWRGaWxlLmRhdGEgIT09IHVuZGVmaW5lZCAmJlxuICAgIGNhY2hlZEZpbGUuY29kZSAhPT0gdW5kZWZpbmVkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSwgZXhwbGFuYXRpb24pID0+IHtcbiAgcmV0dXJuIG5ldyBSU1ZQLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgaWYgKGNoZWNrTG9hZGluZygpKSB7XG4gICAgICByZWplY3QoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnI2V4cGxhbmF0aW9uJykuaHRtbChleHBsYW5hdGlvbik7XG5cbiAgICAgIGxldCBkaXIgPSBVdGlscy5nZXRGaWxlRGlyKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUpO1xuICAgICAgYXBwSW5zdGFuY2Uuc2V0TGFzdEZpbGVVc2VkKGRpcik7XG4gICAgICBjb25zdCBjYWNoZWRGaWxlID0gYXBwSW5zdGFuY2UuZ2V0Q2FjaGVkRmlsZShkaXIpO1xuXG4gICAgICBpZiAoY2FjaGVkQ29udGVudEV4aXN0cyhjYWNoZWRGaWxlKSkge1xuICAgICAgICBhcHBJbnN0YW5jZS5nZXRFZGl0b3IoKS5zZXRDb250ZW50KGNhY2hlZEZpbGUpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2FkRmlsZUFuZFVwZGF0ZUNvbnRlbnQoZGlyKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBSU1ZQID0gcmVxdWlyZSgncnN2cCcpO1xuXG5jb25zdCBVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5jb25zdCBhcHBJbnN0YW5jZSA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuXG5jb25zdCBnZXRKU09OID0gcmVxdWlyZSgnLi9hamF4L2dldF9qc29uJyk7XG5jb25zdCBsb2FkQWxnb3JpdGhtID0gcmVxdWlyZSgnLi9sb2FkX2FsZ29yaXRobScpO1xuXG5jb25zdCBleHRyYWN0R2lzdENvZGUgPSAoZmlsZXMsIG5hbWUpID0+IGZpbGVzW2Ake25hbWV9LmpzYF0uY29udGVudDtcblxubW9kdWxlLmV4cG9ydHMgPSAoZ2lzdElEKSA9PiB7XG4gIHJldHVybiBuZXcgUlNWUC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBnZXRKU09OKGBodHRwczovL2FwaS5naXRodWIuY29tL2dpc3RzLyR7Z2lzdElEfWApLnRoZW4oKHtcbiAgICAgIGZpbGVzXG4gICAgfSkgPT4ge1xuXG4gICAgICBjb25zdCBhbGdvcml0aG0gPSAnc2NyYXRjaF9wYXBlcic7XG4gICAgICBjb25zdCBjYXRlZ29yeSA9IG51bGw7XG5cbiAgICAgIGxvYWRBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IGFsZ29EYXRhID0gZXh0cmFjdEdpc3RDb2RlKGZpbGVzLCAnZGF0YScpO1xuICAgICAgICBjb25zdCBhbGdvQ29kZSA9IGV4dHJhY3RHaXN0Q29kZShmaWxlcywgJ2NvZGUnKTtcblxuICAgICAgICAvLyB1cGRhdGUgc2NyYXRjaCBwYXBlciBhbGdvIGNvZGUgd2l0aCB0aGUgbG9hZGVkIGdpc3QgY29kZVxuICAgICAgICBjb25zdCBkaXIgPSBVdGlscy5nZXRGaWxlRGlyKGNhdGVnb3J5LCBhbGdvcml0aG0sICdzY3JhdGNoX3BhcGVyJyk7XG4gICAgICAgIGFwcEluc3RhbmNlLnVwZGF0ZUNhY2hlZEZpbGUoZGlyLCB7XG4gICAgICAgICAgZGF0YTogYWxnb0RhdGEsXG4gICAgICAgICAgY29kZTogYWxnb0NvZGUsXG4gICAgICAgICAgJ0NSRURJVC5tZCc6ICdTaGFyZWQgYnkgYW4gYW5vbnltb3VzIHVzZXIgZnJvbSBodHRwOi8vcGFya2pzODE0LmdpdGh1Yi5pby9BbGdvcml0aG1WaXN1YWxpemVyJ1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICBjYXRlZ29yeSxcbiAgICAgICAgICBhbGdvcml0aG0sXG4gICAgICAgICAgZGF0YVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFJTVlAgPSByZXF1aXJlKCdyc3ZwJyk7XG5jb25zdCBhcHBJbnN0YW5jZSA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuXG5jb25zdCBwb3N0SlNPTiA9IHJlcXVpcmUoJy4vYWpheC9wb3N0X2pzb24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG4gIHJldHVybiBuZXcgUlNWUC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgIGNvbnN0IHtcbiAgICAgIGRhdGFFZGl0b3IsXG4gICAgICBjb2RlRWRpdG9yXG4gICAgfSA9IGFwcEluc3RhbmNlLmdldEVkaXRvcigpO1xuXG4gICAgY29uc3QgZ2lzdCA9IHtcbiAgICAgICdkZXNjcmlwdGlvbic6ICd0ZW1wJyxcbiAgICAgICdwdWJsaWMnOiB0cnVlLFxuICAgICAgJ2ZpbGVzJzoge1xuICAgICAgICAnZGF0YS5qcyc6IHtcbiAgICAgICAgICAnY29udGVudCc6IGRhdGFFZGl0b3IuZ2V0VmFsdWUoKVxuICAgICAgICB9LFxuICAgICAgICAnY29kZS5qcyc6IHtcbiAgICAgICAgICAnY29udGVudCc6IGNvZGVFZGl0b3IuZ2V0VmFsdWUoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBvc3RKU09OKCdodHRwczovL2FwaS5naXRodWIuY29tL2dpc3RzJywgZ2lzdCkudGhlbigoe1xuICAgICAgaWRcbiAgICB9KSA9PiB7XG5cbiAgICAgIGNvbnN0IHtcbiAgICAgICAgcHJvdG9jb2wsXG4gICAgICAgIGhvc3QsXG4gICAgICAgIHBhdGhuYW1lXG4gICAgICB9ID0gbG9jYXRpb247XG5cbiAgICAgIGNvbnN0IHVybCA9IGAke3Byb3RvY29sfS8vJHtob3N0fSR7cGF0aG5hbWV9P3NjcmF0Y2gtcGFwZXI9JHtpZH1gO1xuICAgICAgcmVzb2x2ZSh1cmwpO1xuICAgIH0pO1xuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBUcmFjZXJNYW5hZ2VyID0gcmVxdWlyZSgnLi9tYW5hZ2VyJyk7XG5jb25zdCBUcmFjZXIgPSByZXF1aXJlKCcuLi9tb2R1bGUvdHJhY2VyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGluaXQoKSB7XG4gICAgY29uc3QgdG0gPSBuZXcgVHJhY2VyTWFuYWdlcigpO1xuICAgIFRyYWNlci5wcm90b3R5cGUubWFuYWdlciA9IHRtO1xuICAgIHJldHVybiB0bTtcbiAgfVxuXG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc3RlcExpbWl0ID0gMWU2O1xuXG5jb25zdCBUcmFjZXJNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudGltZXIgPSBudWxsO1xuICB0aGlzLnBhdXNlID0gZmFsc2U7XG4gIHRoaXMuY2Fwc3VsZXMgPSBbXTtcbiAgdGhpcy5pbnRlcnZhbCA9IDUwMDtcbn07XG5cblRyYWNlck1hbmFnZXIucHJvdG90eXBlID0ge1xuXG4gIGFkZCh0cmFjZXIpIHtcblxuICAgIGNvbnN0ICRjb250YWluZXIgPSAkKCc8c2VjdGlvbiBjbGFzcz1cIm1vZHVsZV93cmFwcGVyXCI+Jyk7XG4gICAgJCgnLm1vZHVsZV9jb250YWluZXInKS5hcHBlbmQoJGNvbnRhaW5lcik7XG5cbiAgICBjb25zdCBjYXBzdWxlID0ge1xuICAgICAgbW9kdWxlOiB0cmFjZXIubW9kdWxlLFxuICAgICAgdHJhY2VyLFxuICAgICAgYWxsb2NhdGVkOiB0cnVlLFxuICAgICAgZGVmYXVsdE5hbWU6IG51bGwsXG4gICAgICAkY29udGFpbmVyLFxuICAgICAgaXNOZXc6IHRydWVcbiAgICB9O1xuXG4gICAgdGhpcy5jYXBzdWxlcy5wdXNoKGNhcHN1bGUpO1xuICAgIHJldHVybiBjYXBzdWxlO1xuICB9LFxuXG4gIGFsbG9jYXRlKG5ld1RyYWNlcikge1xuICAgIGxldCBzZWxlY3RlZENhcHN1bGUgPSBudWxsO1xuICAgIGxldCBjb3VudCA9IDA7XG5cbiAgICAkLmVhY2godGhpcy5jYXBzdWxlcywgKGksIGNhcHN1bGUpID0+IHtcbiAgICAgIGlmIChjYXBzdWxlLm1vZHVsZSA9PT0gbmV3VHJhY2VyLm1vZHVsZSkge1xuICAgICAgICBjb3VudCsrO1xuICAgICAgICBpZiAoIWNhcHN1bGUuYWxsb2NhdGVkKSB7XG4gICAgICAgICAgY2Fwc3VsZS50cmFjZXIgPSBuZXdUcmFjZXI7XG4gICAgICAgICAgY2Fwc3VsZS5hbGxvY2F0ZWQgPSB0cnVlO1xuICAgICAgICAgIGNhcHN1bGUuaXNOZXcgPSBmYWxzZTtcbiAgICAgICAgICBzZWxlY3RlZENhcHN1bGUgPSBjYXBzdWxlO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHNlbGVjdGVkQ2Fwc3VsZSA9PT0gbnVsbCkge1xuICAgICAgY291bnQrKztcbiAgICAgIHNlbGVjdGVkQ2Fwc3VsZSA9IHRoaXMuYWRkKG5ld1RyYWNlcik7XG4gICAgfVxuXG4gICAgc2VsZWN0ZWRDYXBzdWxlLmRlZmF1bHROYW1lID0gYCR7bmV3VHJhY2VyLmNvbnN0cnVjdG9yLm5hbWV9ICR7Y291bnR9YDtcbiAgICByZXR1cm4gc2VsZWN0ZWRDYXBzdWxlO1xuICB9LFxuXG4gIGRlYWxsb2NhdGVBbGwoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICAgICQuZWFjaCh0aGlzLmNhcHN1bGVzLCAoaSwgY2Fwc3VsZSkgPT4ge1xuICAgICAgY2Fwc3VsZS5hbGxvY2F0ZWQgPSBmYWxzZTtcbiAgICB9KTtcbiAgfSxcblxuICByZW1vdmVVbmFsbG9jYXRlZCgpIHtcbiAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5jYXBzdWxlcyA9ICQuZ3JlcCh0aGlzLmNhcHN1bGVzLCAoY2Fwc3VsZSkgPT4ge1xuICAgICAgbGV0IHJlbW92ZWQgPSAhY2Fwc3VsZS5hbGxvY2F0ZWQ7XG5cbiAgICAgIGlmIChjYXBzdWxlLmlzTmV3IHx8IHJlbW92ZWQpIHtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgICBjYXBzdWxlLiRjb250YWluZXIucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAhcmVtb3ZlZDtcbiAgICB9KTtcblxuICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICB0aGlzLnBsYWNlKCk7XG4gICAgfVxuICB9LFxuXG4gIHBsYWNlKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNhcHN1bGVzXG4gICAgfSA9IHRoaXM7XG5cbiAgICAkLmVhY2goY2Fwc3VsZXMsIChpLCBjYXBzdWxlKSA9PiB7XG4gICAgICBsZXQgd2lkdGggPSAxMDA7XG4gICAgICBsZXQgaGVpZ2h0ID0gKDEwMCAvIGNhcHN1bGVzLmxlbmd0aCk7XG4gICAgICBsZXQgdG9wID0gaGVpZ2h0ICogaTtcblxuICAgICAgY2Fwc3VsZS4kY29udGFpbmVyLmNzcyh7XG4gICAgICAgIHRvcDogYCR7dG9wfSVgLFxuICAgICAgICB3aWR0aDogYCR7d2lkdGh9JWAsXG4gICAgICAgIGhlaWdodDogYCR7aGVpZ2h0fSVgXG4gICAgICB9KTtcblxuICAgICAgY2Fwc3VsZS50cmFjZXIucmVzaXplKCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgcmVzaXplKCkge1xuICAgIHRoaXMuY29tbWFuZCgncmVzaXplJyk7XG4gIH0sXG5cbiAgaXNQYXVzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXVzZTtcbiAgfSxcblxuICBzZXRJbnRlcnZhbChpbnRlcnZhbCkge1xuICAgICQoJyNpbnRlcnZhbCcpLnZhbChpbnRlcnZhbCk7XG4gIH0sXG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50cmFjZXMgPSBbXTtcbiAgICB0aGlzLnRyYWNlSW5kZXggPSAtMTtcbiAgICB0aGlzLnN0ZXBDbnQgPSAwO1xuICAgIGlmICh0aGlzLnRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgfVxuICAgIHRoaXMuY29tbWFuZCgnY2xlYXInKTtcbiAgfSxcblxuICBwdXNoU3RlcChjYXBzdWxlLCBzdGVwKSB7XG4gICAgaWYgKHRoaXMuc3RlcENudCsrID4gc3RlcExpbWl0KSB0aHJvdyBcIlRyYWNlcidzIHN0YWNrIG92ZXJmbG93XCI7XG4gICAgbGV0IGxlbiA9IHRoaXMudHJhY2VzLmxlbmd0aDtcbiAgICBsZXQgbGFzdCA9IFtdO1xuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHRoaXMudHJhY2VzLnB1c2gobGFzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhc3QgPSB0aGlzLnRyYWNlc1tsZW4gLSAxXTtcbiAgICB9XG4gICAgbGFzdC5wdXNoKCQuZXh0ZW5kKHN0ZXAsIHtcbiAgICAgIGNhcHN1bGVcbiAgICB9KSk7XG4gIH0sXG5cbiAgbmV3U3RlcCgpIHtcbiAgICB0aGlzLnRyYWNlcy5wdXNoKFtdKTtcbiAgfSxcblxuICBwYXVzZVN0ZXAoKSB7XG4gICAgaWYgKHRoaXMudHJhY2VJbmRleCA8IDApIHJldHVybjtcbiAgICB0aGlzLnBhdXNlID0gdHJ1ZTtcbiAgICBpZiAodGhpcy50aW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgIH1cbiAgICAkKCcjYnRuX3BhdXNlJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICB9LFxuXG4gIHJlc3VtZVN0ZXAoKSB7XG4gICAgdGhpcy5wYXVzZSA9IGZhbHNlO1xuICAgIHRoaXMuc3RlcCh0aGlzLnRyYWNlSW5kZXggKyAxKTtcbiAgICAkKCcjYnRuX3BhdXNlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9LFxuXG4gIHN0ZXAoaSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdHJhY2VyID0gdGhpcztcblxuICAgIGlmIChpc05hTihpKSB8fCBpID49IHRoaXMudHJhY2VzLmxlbmd0aCB8fCBpIDwgMCkgcmV0dXJuO1xuXG4gICAgdGhpcy50cmFjZUluZGV4ID0gaTtcbiAgICBjb25zdCB0cmFjZSA9IHRoaXMudHJhY2VzW2ldO1xuICAgIHRyYWNlLmZvckVhY2goKHN0ZXApID0+IHtcbiAgICAgIHN0ZXAuY2Fwc3VsZS50cmFjZXIucHJvY2Vzc1N0ZXAoc3RlcCwgb3B0aW9ucyk7XG4gICAgfSk7XG5cbiAgICBpZiAoIW9wdGlvbnMudmlydHVhbCkge1xuICAgICAgdGhpcy5jb21tYW5kKCdyZWZyZXNoJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGF1c2UpIHJldHVybjtcblxuICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRyYWNlci5zdGVwKGkgKyAxLCBvcHRpb25zKTtcbiAgICB9LCB0aGlzLmludGVydmFsKTtcbiAgfSxcblxuICBwcmV2U3RlcCgpIHtcbiAgICB0aGlzLmNvbW1hbmQoJ2NsZWFyJyk7XG5cbiAgICBjb25zdCBmaW5hbEluZGV4ID0gdGhpcy50cmFjZUluZGV4IC0gMTtcbiAgICBpZiAoZmluYWxJbmRleCA8IDApIHtcbiAgICAgIHRoaXMudHJhY2VJbmRleCA9IC0xO1xuICAgICAgdGhpcy5jb21tYW5kKCdyZWZyZXNoJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaW5hbEluZGV4OyBpKyspIHtcbiAgICAgIHRoaXMuc3RlcChpLCB7XG4gICAgICAgIHZpcnR1YWw6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuc3RlcChmaW5hbEluZGV4KTtcbiAgfSxcblxuICBuZXh0U3RlcCgpIHtcbiAgICB0aGlzLnN0ZXAodGhpcy50cmFjZUluZGV4ICsgMSk7XG4gIH0sXG5cbiAgdmlzdWFsaXplKCkge1xuICAgIHRoaXMudHJhY2VJbmRleCA9IC0xO1xuICAgIHRoaXMucmVzdW1lU3RlcCgpO1xuICB9LFxuXG4gIGNvbW1hbmQoLi4uYXJncykge1xuICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICAkLmVhY2godGhpcy5jYXBzdWxlcywgKGksIGNhcHN1bGUpID0+IHtcbiAgICAgIGlmIChjYXBzdWxlLmFsbG9jYXRlZCkge1xuICAgICAgICBjYXBzdWxlLnRyYWNlci5tb2R1bGUucHJvdG90eXBlW2Z1bmN0aW9uTmFtZV0uYXBwbHkoY2Fwc3VsZS50cmFjZXIsIGFyZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIGZpbmRPd25lcihjb250YWluZXIpIHtcbiAgICBsZXQgc2VsZWN0ZWRDYXBzdWxlID0gbnVsbDtcbiAgICAkLmVhY2godGhpcy5jYXBzdWxlcywgKGksIGNhcHN1bGUpID0+IHtcbiAgICAgIGlmIChjYXBzdWxlLiRjb250YWluZXJbMF0gPT09IGNvbnRhaW5lcikge1xuICAgICAgICBzZWxlY3RlZENhcHN1bGUgPSBjYXBzdWxlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHNlbGVjdGVkQ2Fwc3VsZS50cmFjZXI7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2VyTWFuYWdlcjsiLCJjb25zdCB7XG4gIHBhcnNlXG59ID0gSlNPTjtcblxuY29uc3QgZnJvbUpTT04gPSAob2JqKSA9PiB7XG4gIHJldHVybiBwYXJzZShvYmosIChrZXksIHZhbHVlKSA9PiB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAnSW5maW5pdHknID8gSW5maW5pdHkgOiB2YWx1ZTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyb21KU09OOyIsImNvbnN0IHRvSlNPTiA9IHJlcXVpcmUoJy4vdG9fanNvbicpO1xuY29uc3QgZnJvbUpTT04gPSByZXF1aXJlKCcuL2Zyb21fanNvbicpO1xuY29uc3QgcmVmaW5lQnlUeXBlID0gcmVxdWlyZSgnLi9yZWZpbmVfYnlfdHlwZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdG9KU09OLFxuICBmcm9tSlNPTixcbiAgcmVmaW5lQnlUeXBlXG59OyIsImNvbnN0IHJlZmluZUJ5VHlwZSA9IChpdGVtKSA9PiB7XG4gIHJldHVybiB0eXBlb2YoaXRlbSkgPT09ICdudW1iZXInID8gcmVmaW5lTnVtYmVyKGl0ZW0pIDogcmVmaW5lU3RyaW5nKGl0ZW0pO1xufTtcblxuY29uc3QgcmVmaW5lU3RyaW5nID0gKHN0cikgPT4ge1xuICByZXR1cm4gc3RyID09PSAnJyA/ICcgJyA6IHN0cjtcbn07XG5cbmNvbnN0IHJlZmluZU51bWJlciA9IChudW0pID0+IHtcbiAgcmV0dXJuIG51bSA9PT0gSW5maW5pdHkgPyAn4oieJyA6IG51bTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcmVmaW5lQnlUeXBlOyIsImNvbnN0IHtcbiAgc3RyaW5naWZ5XG59ID0gSlNPTjtcblxuY29uc3QgdG9KU09OID0gKG9iaikgPT4ge1xuICByZXR1cm4gc3RyaW5naWZ5KG9iaiwgKGtleSwgdmFsdWUpID0+IHtcbiAgICByZXR1cm4gdmFsdWUgPT09IEluZmluaXR5ID8gJ0luZmluaXR5JyA6IHZhbHVlO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdG9KU09OOyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgaXNTY3JhdGNoUGFwZXIgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSkgPT4ge1xuICByZXR1cm4gY2F0ZWdvcnkgPT09IG51bGwgJiYgYWxnb3JpdGhtID09PSAnc2NyYXRjaF9wYXBlcic7XG59O1xuXG5jb25zdCBnZXRBbGdvcml0aG1EaXIgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSkgPT4ge1xuICBpZiAoaXNTY3JhdGNoUGFwZXIoY2F0ZWdvcnksIGFsZ29yaXRobSkpIHtcbiAgICByZXR1cm4gJy4vYWxnb3JpdGhtL3NjcmF0Y2hfcGFwZXIvJztcbiAgfVxuICByZXR1cm4gYC4vYWxnb3JpdGhtLyR7Y2F0ZWdvcnl9LyR7YWxnb3JpdGhtfS9gO1xufTtcblxuY29uc3QgZ2V0RmlsZURpciA9IChjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlKSA9PiB7XG4gIGlmIChpc1NjcmF0Y2hQYXBlcihjYXRlZ29yeSwgYWxnb3JpdGhtKSkge1xuICAgIHJldHVybiAnLi9hbGdvcml0aG0vc2NyYXRjaF9wYXBlci8nO1xuICB9XG5cbiAgcmV0dXJuIGAuL2FsZ29yaXRobS8ke2NhdGVnb3J5fS8ke2FsZ29yaXRobX0vJHtmaWxlfS9gO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzU2NyYXRjaFBhcGVyLFxuICBnZXRBbGdvcml0aG1EaXIsXG4gIGdldEZpbGVEaXJcbn07IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKiFcbiAqIEBvdmVydmlldyBSU1ZQIC0gYSB0aW55IGltcGxlbWVudGF0aW9uIG9mIFByb21pc2VzL0ErLlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTQgWWVodWRhIEthdHosIFRvbSBEYWxlLCBTdGVmYW4gUGVubmVyIGFuZCBjb250cmlidXRvcnNcbiAqIEBsaWNlbnNlICAgTGljZW5zZWQgdW5kZXIgTUlUIGxpY2Vuc2VcbiAqICAgICAgICAgICAgU2VlIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS90aWxkZWlvL3JzdnAuanMvbWFzdGVyL0xJQ0VOU0VcbiAqIEB2ZXJzaW9uICAgMy4yLjFcbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkdXRpbHMkJG9iamVjdE9yRnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nIHx8ICh0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkdXRpbHMkJGlzRnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHV0aWxzJCRpc01heWJlVGhlbmFibGUoeCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsO1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCR1dGlscyQkX2lzQXJyYXk7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KSB7XG4gICAgICBsaWIkcnN2cCR1dGlscyQkX2lzQXJyYXkgPSBmdW5jdGlvbiAoeCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGliJHJzdnAkdXRpbHMkJF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkdXRpbHMkJGlzQXJyYXkgPSBsaWIkcnN2cCR1dGlscyQkX2lzQXJyYXk7XG5cbiAgICB2YXIgbGliJHJzdnAkdXRpbHMkJG5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7IH07XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCR1dGlscyQkRigpIHsgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHV0aWxzJCRvX2NyZWF0ZSA9IChPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIChvKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZWNvbmQgYXJndW1lbnQgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBvICE9PSAnb2JqZWN0Jykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICAgICAgfVxuICAgICAgbGliJHJzdnAkdXRpbHMkJEYucHJvdG90eXBlID0gbztcbiAgICAgIHJldHVybiBuZXcgbGliJHJzdnAkdXRpbHMkJEYoKTtcbiAgICB9KTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRldmVudHMkJGluZGV4T2YoY2FsbGJhY2tzLCBjYWxsYmFjaykge1xuICAgICAgZm9yICh2YXIgaT0wLCBsPWNhbGxiYWNrcy5sZW5ndGg7IGk8bDsgaSsrKSB7XG4gICAgICAgIGlmIChjYWxsYmFja3NbaV0gPT09IGNhbGxiYWNrKSB7IHJldHVybiBpOyB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRldmVudHMkJGNhbGxiYWNrc0ZvcihvYmplY3QpIHtcbiAgICAgIHZhciBjYWxsYmFja3MgPSBvYmplY3QuX3Byb21pc2VDYWxsYmFja3M7XG5cbiAgICAgIGlmICghY2FsbGJhY2tzKSB7XG4gICAgICAgIGNhbGxiYWNrcyA9IG9iamVjdC5fcHJvbWlzZUNhbGxiYWNrcyA9IHt9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2FsbGJhY2tzO1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRldmVudHMkJGRlZmF1bHQgPSB7XG5cbiAgICAgIC8qKlxuICAgICAgICBgUlNWUC5FdmVudFRhcmdldC5taXhpbmAgZXh0ZW5kcyBhbiBvYmplY3Qgd2l0aCBFdmVudFRhcmdldCBtZXRob2RzLiBGb3JcbiAgICAgICAgRXhhbXBsZTpcblxuICAgICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICAgIHZhciBvYmplY3QgPSB7fTtcblxuICAgICAgICBSU1ZQLkV2ZW50VGFyZ2V0Lm1peGluKG9iamVjdCk7XG5cbiAgICAgICAgb2JqZWN0Lm9uKCdmaW5pc2hlZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgLy8gaGFuZGxlIGV2ZW50XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdmaW5pc2hlZCcsIHsgZGV0YWlsOiB2YWx1ZSB9KTtcbiAgICAgICAgYGBgXG5cbiAgICAgICAgYEV2ZW50VGFyZ2V0Lm1peGluYCBhbHNvIHdvcmtzIHdpdGggcHJvdG90eXBlczpcblxuICAgICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICAgIHZhciBQZXJzb24gPSBmdW5jdGlvbigpIHt9O1xuICAgICAgICBSU1ZQLkV2ZW50VGFyZ2V0Lm1peGluKFBlcnNvbi5wcm90b3R5cGUpO1xuXG4gICAgICAgIHZhciB5ZWh1ZGEgPSBuZXcgUGVyc29uKCk7XG4gICAgICAgIHZhciB0b20gPSBuZXcgUGVyc29uKCk7XG5cbiAgICAgICAgeWVodWRhLm9uKCdwb2tlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnWWVodWRhIHNheXMgT1cnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdG9tLm9uKCdwb2tlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnVG9tIHNheXMgT1cnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgeWVodWRhLnRyaWdnZXIoJ3Bva2UnKTtcbiAgICAgICAgdG9tLnRyaWdnZXIoJ3Bva2UnKTtcbiAgICAgICAgYGBgXG5cbiAgICAgICAgQG1ldGhvZCBtaXhpblxuICAgICAgICBAZm9yIFJTVlAuRXZlbnRUYXJnZXRcbiAgICAgICAgQHByaXZhdGVcbiAgICAgICAgQHBhcmFtIHtPYmplY3R9IG9iamVjdCBvYmplY3QgdG8gZXh0ZW5kIHdpdGggRXZlbnRUYXJnZXQgbWV0aG9kc1xuICAgICAgKi9cbiAgICAgICdtaXhpbic6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICBvYmplY3RbJ29uJ10gICAgICA9IHRoaXNbJ29uJ107XG4gICAgICAgIG9iamVjdFsnb2ZmJ10gICAgID0gdGhpc1snb2ZmJ107XG4gICAgICAgIG9iamVjdFsndHJpZ2dlciddID0gdGhpc1sndHJpZ2dlciddO1xuICAgICAgICBvYmplY3QuX3Byb21pc2VDYWxsYmFja3MgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAgUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgZXhlY3V0ZWQgd2hlbiBgZXZlbnROYW1lYCBpcyB0cmlnZ2VyZWRcblxuICAgICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICAgIG9iamVjdC5vbignZXZlbnQnLCBmdW5jdGlvbihldmVudEluZm8pe1xuICAgICAgICAgIC8vIGhhbmRsZSB0aGUgZXZlbnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ2V2ZW50Jyk7XG4gICAgICAgIGBgYFxuXG4gICAgICAgIEBtZXRob2Qgb25cbiAgICAgICAgQGZvciBSU1ZQLkV2ZW50VGFyZ2V0XG4gICAgICAgIEBwcml2YXRlXG4gICAgICAgIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gbGlzdGVuIGZvclxuICAgICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgICAgKi9cbiAgICAgICdvbic6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0NhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFsbENhbGxiYWNrcyA9IGxpYiRyc3ZwJGV2ZW50cyQkY2FsbGJhY2tzRm9yKHRoaXMpLCBjYWxsYmFja3M7XG5cbiAgICAgICAgY2FsbGJhY2tzID0gYWxsQ2FsbGJhY2tzW2V2ZW50TmFtZV07XG5cbiAgICAgICAgaWYgKCFjYWxsYmFja3MpIHtcbiAgICAgICAgICBjYWxsYmFja3MgPSBhbGxDYWxsYmFja3NbZXZlbnROYW1lXSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpYiRyc3ZwJGV2ZW50cyQkaW5kZXhPZihjYWxsYmFja3MsIGNhbGxiYWNrKSA9PT0gLTEpIHtcbiAgICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICBZb3UgY2FuIHVzZSBgb2ZmYCB0byBzdG9wIGZpcmluZyBhIHBhcnRpY3VsYXIgY2FsbGJhY2sgZm9yIGFuIGV2ZW50OlxuXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgZnVuY3Rpb24gZG9TdHVmZigpIHsgLy8gZG8gc3R1ZmYhIH1cbiAgICAgICAgb2JqZWN0Lm9uKCdzdHVmZicsIGRvU3R1ZmYpO1xuXG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdzdHVmZicpOyAvLyBkb1N0dWZmIHdpbGwgYmUgY2FsbGVkXG5cbiAgICAgICAgLy8gVW5yZWdpc3RlciBPTkxZIHRoZSBkb1N0dWZmIGNhbGxiYWNrXG4gICAgICAgIG9iamVjdC5vZmYoJ3N0dWZmJywgZG9TdHVmZik7XG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdzdHVmZicpOyAvLyBkb1N0dWZmIHdpbGwgTk9UIGJlIGNhbGxlZFxuICAgICAgICBgYGBcblxuICAgICAgICBJZiB5b3UgZG9uJ3QgcGFzcyBhIGBjYWxsYmFja2AgYXJndW1lbnQgdG8gYG9mZmAsIEFMTCBjYWxsYmFja3MgZm9yIHRoZVxuICAgICAgICBldmVudCB3aWxsIG5vdCBiZSBleGVjdXRlZCB3aGVuIHRoZSBldmVudCBmaXJlcy4gRm9yIGV4YW1wbGU6XG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICB2YXIgY2FsbGJhY2sxID0gZnVuY3Rpb24oKXt9O1xuICAgICAgICB2YXIgY2FsbGJhY2syID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgICAgIG9iamVjdC5vbignc3R1ZmYnLCBjYWxsYmFjazEpO1xuICAgICAgICBvYmplY3Qub24oJ3N0dWZmJywgY2FsbGJhY2syKTtcblxuICAgICAgICBvYmplY3QudHJpZ2dlcignc3R1ZmYnKTsgLy8gY2FsbGJhY2sxIGFuZCBjYWxsYmFjazIgd2lsbCBiZSBleGVjdXRlZC5cblxuICAgICAgICBvYmplY3Qub2ZmKCdzdHVmZicpO1xuICAgICAgICBvYmplY3QudHJpZ2dlcignc3R1ZmYnKTsgLy8gY2FsbGJhY2sxIGFuZCBjYWxsYmFjazIgd2lsbCBub3QgYmUgZXhlY3V0ZWQhXG4gICAgICAgIGBgYFxuXG4gICAgICAgIEBtZXRob2Qgb2ZmXG4gICAgICAgIEBmb3IgUlNWUC5FdmVudFRhcmdldFxuICAgICAgICBAcHJpdmF0ZVxuICAgICAgICBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIGV2ZW50IHRvIHN0b3AgbGlzdGVuaW5nIHRvXG4gICAgICAgIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIG9wdGlvbmFsIGFyZ3VtZW50LiBJZiBnaXZlbiwgb25seSB0aGUgZnVuY3Rpb25cbiAgICAgICAgZ2l2ZW4gd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIGV2ZW50J3MgY2FsbGJhY2sgcXVldWUuIElmIG5vIGBjYWxsYmFja2BcbiAgICAgICAgYXJndW1lbnQgaXMgZ2l2ZW4sIGFsbCBjYWxsYmFja3Mgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIGV2ZW50J3MgY2FsbGJhY2tcbiAgICAgICAgcXVldWUuXG4gICAgICAqL1xuICAgICAgJ29mZic6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGFsbENhbGxiYWNrcyA9IGxpYiRyc3ZwJGV2ZW50cyQkY2FsbGJhY2tzRm9yKHRoaXMpLCBjYWxsYmFja3MsIGluZGV4O1xuXG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICBhbGxDYWxsYmFja3NbZXZlbnROYW1lXSA9IFtdO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrcyA9IGFsbENhbGxiYWNrc1tldmVudE5hbWVdO1xuXG4gICAgICAgIGluZGV4ID0gbGliJHJzdnAkZXZlbnRzJCRpbmRleE9mKGNhbGxiYWNrcywgY2FsbGJhY2spO1xuXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHsgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7IH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICBVc2UgYHRyaWdnZXJgIHRvIGZpcmUgY3VzdG9tIGV2ZW50cy4gRm9yIGV4YW1wbGU6XG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICBvYmplY3Qub24oJ2ZvbycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2ZvbyBldmVudCBoYXBwZW5lZCEnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdmb28nKTtcbiAgICAgICAgLy8gJ2ZvbyBldmVudCBoYXBwZW5lZCEnIGxvZ2dlZCB0byB0aGUgY29uc29sZVxuICAgICAgICBgYGBcblxuICAgICAgICBZb3UgY2FuIGFsc28gcGFzcyBhIHZhbHVlIGFzIGEgc2Vjb25kIGFyZ3VtZW50IHRvIGB0cmlnZ2VyYCB0aGF0IHdpbGwgYmVcbiAgICAgICAgcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIGFsbCBldmVudCBsaXN0ZW5lcnMgZm9yIHRoZSBldmVudDpcblxuICAgICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICAgIG9iamVjdC5vbignZm9vJywgZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlLm5hbWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBvYmplY3QudHJpZ2dlcignZm9vJywgeyBuYW1lOiAnYmFyJyB9KTtcbiAgICAgICAgLy8gJ2JhcicgbG9nZ2VkIHRvIHRoZSBjb25zb2xlXG4gICAgICAgIGBgYFxuXG4gICAgICAgIEBtZXRob2QgdHJpZ2dlclxuICAgICAgICBAZm9yIFJTVlAuRXZlbnRUYXJnZXRcbiAgICAgICAgQHByaXZhdGVcbiAgICAgICAgQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBuYW1lIG9mIHRoZSBldmVudCB0byBiZSB0cmlnZ2VyZWRcbiAgICAgICAgQHBhcmFtIHsqfSBvcHRpb25zIG9wdGlvbmFsIHZhbHVlIHRvIGJlIHBhc3NlZCB0byBhbnkgZXZlbnQgaGFuZGxlcnMgZm9yXG4gICAgICAgIHRoZSBnaXZlbiBgZXZlbnROYW1lYFxuICAgICAgKi9cbiAgICAgICd0cmlnZ2VyJzogZnVuY3Rpb24oZXZlbnROYW1lLCBvcHRpb25zLCBsYWJlbCkge1xuICAgICAgICB2YXIgYWxsQ2FsbGJhY2tzID0gbGliJHJzdnAkZXZlbnRzJCRjYWxsYmFja3NGb3IodGhpcyksIGNhbGxiYWNrcywgY2FsbGJhY2s7XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrcyA9IGFsbENhbGxiYWNrc1tldmVudE5hbWVdKSB7XG4gICAgICAgICAgLy8gRG9uJ3QgY2FjaGUgdGhlIGNhbGxiYWNrcy5sZW5ndGggc2luY2UgaXQgbWF5IGdyb3dcbiAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8Y2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrc1tpXTtcblxuICAgICAgICAgICAgY2FsbGJhY2sob3B0aW9ucywgbGFiZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgbGliJHJzdnAkY29uZmlnJCRjb25maWcgPSB7XG4gICAgICBpbnN0cnVtZW50OiBmYWxzZVxuICAgIH07XG5cbiAgICBsaWIkcnN2cCRldmVudHMkJGRlZmF1bHRbJ21peGluJ10obGliJHJzdnAkY29uZmlnJCRjb25maWcpO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkY29uZmlnJCRjb25maWd1cmUobmFtZSwgdmFsdWUpIHtcbiAgICAgIGlmIChuYW1lID09PSAnb25lcnJvcicpIHtcbiAgICAgICAgLy8gaGFuZGxlIGZvciBsZWdhY3kgdXNlcnMgdGhhdCBleHBlY3QgdGhlIGFjdHVhbFxuICAgICAgICAvLyBlcnJvciB0byBiZSBwYXNzZWQgdG8gdGhlaXIgZnVuY3Rpb24gYWRkZWQgdmlhXG4gICAgICAgIC8vIGBSU1ZQLmNvbmZpZ3VyZSgnb25lcnJvcicsIHNvbWVGdW5jdGlvbkhlcmUpO2BcbiAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWdbJ29uJ10oJ2Vycm9yJywgdmFsdWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnW25hbWVdID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbGliJHJzdnAkY29uZmlnJCRjb25maWdbbmFtZV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJGluc3RydW1lbnQkJHF1ZXVlID0gW107XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRpbnN0cnVtZW50JCRzY2hlZHVsZUZsdXNoKCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVudHJ5O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpYiRyc3ZwJGluc3RydW1lbnQkJHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZW50cnkgPSBsaWIkcnN2cCRpbnN0cnVtZW50JCRxdWV1ZVtpXTtcblxuICAgICAgICAgIHZhciBwYXlsb2FkID0gZW50cnkucGF5bG9hZDtcblxuICAgICAgICAgIHBheWxvYWQuZ3VpZCA9IHBheWxvYWQua2V5ICsgcGF5bG9hZC5pZDtcbiAgICAgICAgICBwYXlsb2FkLmNoaWxkR3VpZCA9IHBheWxvYWQua2V5ICsgcGF5bG9hZC5jaGlsZElkO1xuICAgICAgICAgIGlmIChwYXlsb2FkLmVycm9yKSB7XG4gICAgICAgICAgICBwYXlsb2FkLnN0YWNrID0gcGF5bG9hZC5lcnJvci5zdGFjaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1sndHJpZ2dlciddKGVudHJ5Lm5hbWUsIGVudHJ5LnBheWxvYWQpO1xuICAgICAgICB9XG4gICAgICAgIGxpYiRyc3ZwJGluc3RydW1lbnQkJHF1ZXVlLmxlbmd0aCA9IDA7XG4gICAgICB9LCA1MCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkaW5zdHJ1bWVudCQkaW5zdHJ1bWVudChldmVudE5hbWUsIHByb21pc2UsIGNoaWxkKSB7XG4gICAgICBpZiAoMSA9PT0gbGliJHJzdnAkaW5zdHJ1bWVudCQkcXVldWUucHVzaCh7XG4gICAgICAgIG5hbWU6IGV2ZW50TmFtZSxcbiAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgIGtleTogcHJvbWlzZS5fZ3VpZEtleSxcbiAgICAgICAgICBpZDogIHByb21pc2UuX2lkLFxuICAgICAgICAgIGV2ZW50TmFtZTogZXZlbnROYW1lLFxuICAgICAgICAgIGRldGFpbDogcHJvbWlzZS5fcmVzdWx0LFxuICAgICAgICAgIGNoaWxkSWQ6IGNoaWxkICYmIGNoaWxkLl9pZCxcbiAgICAgICAgICBsYWJlbDogcHJvbWlzZS5fbGFiZWwsXG4gICAgICAgICAgdGltZVN0YW1wOiBsaWIkcnN2cCR1dGlscyQkbm93KCksXG4gICAgICAgICAgZXJyb3I6IGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnW1wiaW5zdHJ1bWVudC13aXRoLXN0YWNrXCJdID8gbmV3IEVycm9yKHByb21pc2UuX2xhYmVsKSA6IG51bGxcbiAgICAgICAgfX0pKSB7XG4gICAgICAgICAgbGliJHJzdnAkaW5zdHJ1bWVudCQkc2NoZWR1bGVGbHVzaCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGluc3RydW1lbnQkJGRlZmF1bHQgPSBsaWIkcnN2cCRpbnN0cnVtZW50JCRpbnN0cnVtZW50O1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHRoZW4kJHRoZW4ob25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24sIGxhYmVsKSB7XG4gICAgICB2YXIgcGFyZW50ID0gdGhpcztcbiAgICAgIHZhciBzdGF0ZSA9IHBhcmVudC5fc3RhdGU7XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQgJiYgIW9uRnVsZmlsbG1lbnQgfHwgc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURUQgJiYgIW9uUmVqZWN0aW9uKSB7XG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmluc3RydW1lbnQgJiYgbGliJHJzdnAkaW5zdHJ1bWVudCQkZGVmYXVsdCgnY2hhaW5lZCcsIHBhcmVudCwgcGFyZW50KTtcbiAgICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICAgIH1cblxuICAgICAgcGFyZW50Ll9vbkVycm9yID0gbnVsbDtcblxuICAgICAgdmFyIGNoaWxkID0gbmV3IHBhcmVudC5jb25zdHJ1Y3RvcihsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AsIGxhYmVsKTtcbiAgICAgIHZhciByZXN1bHQgPSBwYXJlbnQuX3Jlc3VsdDtcblxuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuaW5zdHJ1bWVudCAmJiBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0KCdjaGFpbmVkJywgcGFyZW50LCBjaGlsZCk7XG5cbiAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbc3RhdGUgLSAxXTtcbiAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYXN5bmMoZnVuY3Rpb24oKXtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGludm9rZUNhbGxiYWNrKHN0YXRlLCBjaGlsZCwgY2FsbGJhY2ssIHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2hpbGQ7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCR0aGVuJCRkZWZhdWx0ID0gbGliJHJzdnAkdGhlbiQkdGhlbjtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJHJlc29sdmUkJHJlc29sdmUob2JqZWN0LCBsYWJlbCkge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICAgIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0LmNvbnN0cnVjdG9yID09PSBDb25zdHJ1Y3Rvcikge1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AsIGxhYmVsKTtcbiAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCBvYmplY3QpO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQgPSBsaWIkcnN2cCRwcm9taXNlJHJlc29sdmUkJHJlc29sdmU7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkZW51bWVyYXRvciQkbWFrZVNldHRsZWRSZXN1bHQoc3RhdGUsIHBvc2l0aW9uLCB2YWx1ZSkge1xuICAgICAgaWYgKHN0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YXRlOiAnZnVsZmlsbGVkJyxcbiAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YXRlOiAncmVqZWN0ZWQnLFxuICAgICAgICAgIHJlYXNvbjogdmFsdWVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yKENvbnN0cnVjdG9yLCBpbnB1dCwgYWJvcnRPblJlamVjdCwgbGFiZWwpIHtcbiAgICAgIHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcbiAgICAgIHRoaXMucHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AsIGxhYmVsKTtcbiAgICAgIHRoaXMuX2Fib3J0T25SZWplY3QgPSBhYm9ydE9uUmVqZWN0O1xuXG4gICAgICBpZiAodGhpcy5fdmFsaWRhdGVJbnB1dChpbnB1dCkpIHtcbiAgICAgICAgdGhpcy5faW5wdXQgICAgID0gaW5wdXQ7XG4gICAgICAgIHRoaXMubGVuZ3RoICAgICA9IGlucHV0Lmxlbmd0aDtcbiAgICAgICAgdGhpcy5fcmVtYWluaW5nID0gaW5wdXQubGVuZ3RoO1xuXG4gICAgICAgIHRoaXMuX2luaXQoKTtcblxuICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5sZW5ndGggfHwgMDtcbiAgICAgICAgICB0aGlzLl9lbnVtZXJhdGUoKTtcbiAgICAgICAgICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QodGhpcy5wcm9taXNlLCB0aGlzLl92YWxpZGF0aW9uRXJyb3IoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQgPSBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yO1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3ZhbGlkYXRlSW5wdXQgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHV0aWxzJCRpc0FycmF5KGlucHV0KTtcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3ZhbGlkYXRpb25FcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignQXJyYXkgTWV0aG9kcyBtdXN0IGJlIHByb3ZpZGVkIGFuIEFycmF5Jyk7XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9yZXN1bHQgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpO1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fZW51bWVyYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGVuZ3RoICAgICA9IHRoaXMubGVuZ3RoO1xuICAgICAgdmFyIHByb21pc2UgICAgPSB0aGlzLnByb21pc2U7XG4gICAgICB2YXIgaW5wdXQgICAgICA9IHRoaXMuX2lucHV0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgcHJvbWlzZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORyAmJiBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5fZWFjaEVudHJ5KGlucHV0W2ldLCBpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3NldHRsZU1heWJlVGhlbmFibGUgPSBmdW5jdGlvbihlbnRyeSwgaSkge1xuICAgICAgdmFyIGMgPSB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yO1xuICAgICAgdmFyIHJlc29sdmUgPSBjLnJlc29sdmU7XG5cbiAgICAgIGlmIChyZXNvbHZlID09PSBsaWIkcnN2cCRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQpIHtcbiAgICAgICAgdmFyIHRoZW4gPSBsaWIkcnN2cCQkaW50ZXJuYWwkJGdldFRoZW4oZW50cnkpO1xuXG4gICAgICAgIGlmICh0aGVuID09PSBsaWIkcnN2cCR0aGVuJCRkZWZhdWx0ICYmXG4gICAgICAgICAgICBlbnRyeS5fc3RhdGUgIT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORykge1xuICAgICAgICAgIGVudHJ5Ll9vbkVycm9yID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9zZXR0bGVkQXQoZW50cnkuX3N0YXRlLCBpLCBlbnRyeS5fcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhlbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuICAgICAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IHRoaXMuX21ha2VSZXN1bHQobGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQsIGksIGVudHJ5KTtcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0KSB7XG4gICAgICAgICAgdmFyIHByb21pc2UgPSBuZXcgYyhsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3ApO1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBlbnRyeSwgdGhlbik7XG4gICAgICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KHByb21pc2UsIGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChuZXcgYyhmdW5jdGlvbihyZXNvbHZlKSB7IHJlc29sdmUoZW50cnkpOyB9KSwgaSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChyZXNvbHZlKGVudHJ5KSwgaSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9lYWNoRW50cnkgPSBmdW5jdGlvbihlbnRyeSwgaSkge1xuICAgICAgaWYgKGxpYiRyc3ZwJHV0aWxzJCRpc01heWJlVGhlbmFibGUoZW50cnkpKSB7XG4gICAgICAgIHRoaXMuX3NldHRsZU1heWJlVGhlbmFibGUoZW50cnksIGkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVtYWluaW5nLS07XG4gICAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IHRoaXMuX21ha2VSZXN1bHQobGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQsIGksIGVudHJ5KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3NldHRsZWRBdCA9IGZ1bmN0aW9uKHN0YXRlLCBpLCB2YWx1ZSkge1xuICAgICAgdmFyIHByb21pc2UgPSB0aGlzLnByb21pc2U7XG5cbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HKSB7XG4gICAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuXG4gICAgICAgIGlmICh0aGlzLl9hYm9ydE9uUmVqZWN0ICYmIHN0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IHRoaXMuX21ha2VSZXN1bHQoc3RhdGUsIGksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fbWFrZVJlc3VsdCA9IGZ1bmN0aW9uKHN0YXRlLCBpLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fd2lsbFNldHRsZUF0ID0gZnVuY3Rpb24ocHJvbWlzZSwgaSkge1xuICAgICAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuXG4gICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHN1YnNjcmliZShwcm9taXNlLCB1bmRlZmluZWQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGVudW1lcmF0b3IuX3NldHRsZWRBdChsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCwgaSwgdmFsdWUpO1xuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGVudW1lcmF0b3IuX3NldHRsZWRBdChsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVELCBpLCByZWFzb24pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJGFsbCQkYWxsKGVudHJpZXMsIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbmV3IGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQodGhpcywgZW50cmllcywgdHJ1ZSAvKiBhYm9ydCBvbiByZWplY3QgKi8sIGxhYmVsKS5wcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSRhbGwkJGRlZmF1bHQgPSBsaWIkcnN2cCRwcm9taXNlJGFsbCQkYWxsO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkcmFjZSQkcmFjZShlbnRyaWVzLCBsYWJlbCkge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICAgIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCwgbGFiZWwpO1xuXG4gICAgICBpZiAoIWxpYiRyc3ZwJHV0aWxzJCRpc0FycmF5KGVudHJpZXMpKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gcmFjZS4nKSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgbGVuZ3RoID0gZW50cmllcy5sZW5ndGg7XG5cbiAgICAgIGZ1bmN0aW9uIG9uRnVsZmlsbG1lbnQodmFsdWUpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gb25SZWplY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBwcm9taXNlLl9zdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HICYmIGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHN1YnNjcmliZShDb25zdHJ1Y3Rvci5yZXNvbHZlKGVudHJpZXNbaV0pLCB1bmRlZmluZWQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJHJhY2UkJGRlZmF1bHQgPSBsaWIkcnN2cCRwcm9taXNlJHJhY2UkJHJhY2U7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSRyZWplY3QkJHJlamVjdChyZWFzb24sIGxhYmVsKSB7XG4gICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCwgbGFiZWwpO1xuICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSRyZWplY3QkJGRlZmF1bHQgPSBsaWIkcnN2cCRwcm9taXNlJHJlamVjdCQkcmVqZWN0O1xuXG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkJGd1aWRLZXkgPSAncnN2cF8nICsgbGliJHJzdnAkdXRpbHMkJG5vdygpICsgJy0nO1xuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJCRjb3VudGVyID0gMDtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkJG5lZWRzUmVzb2x2ZXIoKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGEgcmVzb2x2ZXIgZnVuY3Rpb24gYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBwcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSQkbmVlZHNOZXcoKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmFpbGVkIHRvIGNvbnN0cnVjdCAnUHJvbWlzZSc6IFBsZWFzZSB1c2UgdGhlICduZXcnIG9wZXJhdG9yLCB0aGlzIG9iamVjdCBjb25zdHJ1Y3RvciBjYW5ub3QgYmUgY2FsbGVkIGFzIGEgZnVuY3Rpb24uXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UocmVzb2x2ZXIsIGxhYmVsKSB7XG4gICAgICB0aGlzLl9pZCA9IGxpYiRyc3ZwJHByb21pc2UkJGNvdW50ZXIrKztcbiAgICAgIHRoaXMuX2xhYmVsID0gbGFiZWw7XG4gICAgICB0aGlzLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX3Jlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX3N1YnNjcmliZXJzID0gW107XG5cbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmluc3RydW1lbnQgJiYgbGliJHJzdnAkaW5zdHJ1bWVudCQkZGVmYXVsdCgnY3JlYXRlZCcsIHRoaXMpO1xuXG4gICAgICBpZiAobGliJHJzdnAkJGludGVybmFsJCRub29wICE9PSByZXNvbHZlcikge1xuICAgICAgICB0eXBlb2YgcmVzb2x2ZXIgIT09ICdmdW5jdGlvbicgJiYgbGliJHJzdnAkcHJvbWlzZSQkbmVlZHNSZXNvbHZlcigpO1xuICAgICAgICB0aGlzIGluc3RhbmNlb2YgbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZSA/IGxpYiRyc3ZwJCRpbnRlcm5hbCQkaW5pdGlhbGl6ZVByb21pc2UodGhpcywgcmVzb2x2ZXIpIDogbGliJHJzdnAkcHJvbWlzZSQkbmVlZHNOZXcoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdCA9IGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2U7XG5cbiAgICAvLyBkZXByZWNhdGVkXG4gICAgbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZS5jYXN0ID0gbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UuYWxsID0gbGliJHJzdnAkcHJvbWlzZSRhbGwkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZS5yYWNlID0gbGliJHJzdnAkcHJvbWlzZSRyYWNlJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UucmVzb2x2ZSA9IGxpYiRyc3ZwJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlLnJlamVjdCA9IGxpYiRyc3ZwJHByb21pc2UkcmVqZWN0JCRkZWZhdWx0O1xuXG4gICAgbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZS5wcm90b3R5cGUgPSB7XG4gICAgICBjb25zdHJ1Y3RvcjogbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZSxcblxuICAgICAgX2d1aWRLZXk6IGxpYiRyc3ZwJHByb21pc2UkJGd1aWRLZXksXG5cbiAgICAgIF9vbkVycm9yOiBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIHZhciBwcm9taXNlID0gdGhpcztcbiAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYWZ0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHByb21pc2UuX29uRXJyb3IpIHtcbiAgICAgICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnWyd0cmlnZ2VyJ10oJ2Vycm9yJywgcmVhc29uLCBwcm9taXNlLl9sYWJlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAvKipcbiAgICAgIFRoZSBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLFxuICAgICAgd2hpY2ggcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGVcbiAgICAgIHJlYXNvbiB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgLy8gdXNlciBpcyBhdmFpbGFibGVcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIHVzZXIgaXMgdW5hdmFpbGFibGUsIGFuZCB5b3UgYXJlIGdpdmVuIHRoZSByZWFzb24gd2h5XG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBDaGFpbmluZ1xuICAgICAgLS0tLS0tLS1cblxuICAgICAgVGhlIHJldHVybiB2YWx1ZSBvZiBgdGhlbmAgaXMgaXRzZWxmIGEgcHJvbWlzZS4gIFRoaXMgc2Vjb25kLCAnZG93bnN0cmVhbSdcbiAgICAgIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmaXJzdCBwcm9taXNlJ3MgZnVsZmlsbG1lbnRcbiAgICAgIG9yIHJlamVjdGlvbiBoYW5kbGVyLCBvciByZWplY3RlZCBpZiB0aGUgaGFuZGxlciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHJldHVybiB1c2VyLm5hbWU7XG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIHJldHVybiAnZGVmYXVsdCBuYW1lJztcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHVzZXJOYW1lKSB7XG4gICAgICAgIC8vIElmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgdXNlck5hbWVgIHdpbGwgYmUgdGhlIHVzZXIncyBuYW1lLCBvdGhlcndpc2UgaXRcbiAgICAgICAgLy8gd2lsbCBiZSBgJ2RlZmF1bHQgbmFtZSdgXG4gICAgICB9KTtcblxuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jyk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIC8vIGlmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgcmVhc29uYCB3aWxsIGJlICdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScuXG4gICAgICAgIC8vIElmIGBmaW5kVXNlcmAgcmVqZWN0ZWQsIGByZWFzb25gIHdpbGwgYmUgJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknLlxuICAgICAgfSk7XG4gICAgICBgYGBcbiAgICAgIElmIHRoZSBkb3duc3RyZWFtIHByb21pc2UgZG9lcyBub3Qgc3BlY2lmeSBhIHJlamVjdGlvbiBoYW5kbGVyLCByZWplY3Rpb24gcmVhc29ucyB3aWxsIGJlIHByb3BhZ2F0ZWQgZnVydGhlciBkb3duc3RyZWFtLlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHRocm93IG5ldyBQZWRhZ29naWNhbEV4Y2VwdGlvbignVXBzdHJlYW0gZXJyb3InKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgLy8gVGhlIGBQZWRnYWdvY2lhbEV4Y2VwdGlvbmAgaXMgcHJvcGFnYXRlZCBhbGwgdGhlIHdheSBkb3duIHRvIGhlcmVcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEFzc2ltaWxhdGlvblxuICAgICAgLS0tLS0tLS0tLS0tXG5cbiAgICAgIFNvbWV0aW1lcyB0aGUgdmFsdWUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIHRvIGEgZG93bnN0cmVhbSBwcm9taXNlIGNhbiBvbmx5IGJlXG4gICAgICByZXRyaWV2ZWQgYXN5bmNocm9ub3VzbHkuIFRoaXMgY2FuIGJlIGFjaGlldmVkIGJ5IHJldHVybmluZyBhIHByb21pc2UgaW4gdGhlXG4gICAgICBmdWxmaWxsbWVudCBvciByZWplY3Rpb24gaGFuZGxlci4gVGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIHRoZW4gYmUgcGVuZGluZ1xuICAgICAgdW50aWwgdGhlIHJldHVybmVkIHByb21pc2UgaXMgc2V0dGxlZC4gVGhpcyBpcyBjYWxsZWQgKmFzc2ltaWxhdGlvbiouXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgICAgLy8gVGhlIHVzZXIncyBjb21tZW50cyBhcmUgbm93IGF2YWlsYWJsZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgSWYgdGhlIGFzc2ltbGlhdGVkIHByb21pc2UgcmVqZWN0cywgdGhlbiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgYWxzbyByZWplY3QuXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCBmdWxmaWxscywgd2UnbGwgaGF2ZSB0aGUgdmFsdWUgaGVyZVxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIHJlamVjdHMsIHdlJ2xsIGhhdmUgdGhlIHJlYXNvbiBoZXJlXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBTaW1wbGUgRXhhbXBsZVxuICAgICAgLS0tLS0tLS0tLS0tLS1cblxuICAgICAgU3luY2hyb25vdXMgRXhhbXBsZVxuXG4gICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICB2YXIgcmVzdWx0O1xuXG4gICAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBmaW5kUmVzdWx0KCk7XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH1cbiAgICAgIGBgYFxuXG4gICAgICBFcnJiYWNrIEV4YW1wbGVcblxuICAgICAgYGBganNcbiAgICAgIGZpbmRSZXN1bHQoZnVuY3Rpb24ocmVzdWx0LCBlcnIpe1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgUHJvbWlzZSBFeGFtcGxlO1xuXG4gICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICBmaW5kUmVzdWx0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBBZHZhbmNlZCBFeGFtcGxlXG4gICAgICAtLS0tLS0tLS0tLS0tLVxuXG4gICAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG5cbiAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgIHZhciBhdXRob3IsIGJvb2tzO1xuXG4gICAgICB0cnkge1xuICAgICAgICBhdXRob3IgPSBmaW5kQXV0aG9yKCk7XG4gICAgICAgIGJvb2tzICA9IGZpbmRCb29rc0J5QXV0aG9yKGF1dGhvcik7XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH1cbiAgICAgIGBgYFxuXG4gICAgICBFcnJiYWNrIEV4YW1wbGVcblxuICAgICAgYGBganNcblxuICAgICAgZnVuY3Rpb24gZm91bmRCb29rcyhib29rcykge1xuXG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGZhaWx1cmUocmVhc29uKSB7XG5cbiAgICAgIH1cblxuICAgICAgZmluZEF1dGhvcihmdW5jdGlvbihhdXRob3IsIGVycil7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaW5kQm9vb2tzQnlBdXRob3IoYXV0aG9yLCBmdW5jdGlvbihib29rcywgZXJyKSB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGZvdW5kQm9va3MoYm9va3MpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgICAgICAgICAgICBmYWlsdXJlKHJlYXNvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgUHJvbWlzZSBFeGFtcGxlO1xuXG4gICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICBmaW5kQXV0aG9yKCkuXG4gICAgICAgIHRoZW4oZmluZEJvb2tzQnlBdXRob3IpLlxuICAgICAgICB0aGVuKGZ1bmN0aW9uKGJvb2tzKXtcbiAgICAgICAgICAvLyBmb3VuZCBib29rc1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEBtZXRob2QgdGhlblxuICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gb25GdWxmaWxsbWVudFxuICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3Rpb25cbiAgICAgIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGxhYmVsaW5nIHRoZSBwcm9taXNlLlxuICAgICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgICAgQHJldHVybiB7UHJvbWlzZX1cbiAgICAqL1xuICAgICAgdGhlbjogbGliJHJzdnAkdGhlbiQkZGVmYXVsdCxcblxuICAgIC8qKlxuICAgICAgYGNhdGNoYCBpcyBzaW1wbHkgc3VnYXIgZm9yIGB0aGVuKHVuZGVmaW5lZCwgb25SZWplY3Rpb24pYCB3aGljaCBtYWtlcyBpdCB0aGUgc2FtZVxuICAgICAgYXMgdGhlIGNhdGNoIGJsb2NrIG9mIGEgdHJ5L2NhdGNoIHN0YXRlbWVudC5cblxuICAgICAgYGBganNcbiAgICAgIGZ1bmN0aW9uIGZpbmRBdXRob3IoKXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZG4ndCBmaW5kIHRoYXQgYXV0aG9yJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIHN5bmNocm9ub3VzXG4gICAgICB0cnkge1xuICAgICAgICBmaW5kQXV0aG9yKCk7XG4gICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgICAgfVxuXG4gICAgICAvLyBhc3luYyB3aXRoIHByb21pc2VzXG4gICAgICBmaW5kQXV0aG9yKCkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEBtZXRob2QgY2F0Y2hcbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0aW9uXG4gICAgICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBsYWJlbGluZyB0aGUgcHJvbWlzZS5cbiAgICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICAgKi9cbiAgICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0aW9uLCBsYWJlbCkge1xuICAgICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3Rpb24sIGxhYmVsKTtcbiAgICAgIH0sXG5cbiAgICAvKipcbiAgICAgIGBmaW5hbGx5YCB3aWxsIGJlIGludm9rZWQgcmVnYXJkbGVzcyBvZiB0aGUgcHJvbWlzZSdzIGZhdGUganVzdCBhcyBuYXRpdmVcbiAgICAgIHRyeS9jYXRjaC9maW5hbGx5IGJlaGF2ZXNcblxuICAgICAgU3luY2hyb25vdXMgZXhhbXBsZTpcblxuICAgICAgYGBganNcbiAgICAgIGZpbmRBdXRob3IoKSB7XG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBBdXRob3IoKTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGZpbmRBdXRob3IoKTsgLy8gc3VjY2VlZCBvciBmYWlsXG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBmaW5kT3RoZXJBdXRoZXIoKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIC8vIGFsd2F5cyBydW5zXG4gICAgICAgIC8vIGRvZXNuJ3QgYWZmZWN0IHRoZSByZXR1cm4gdmFsdWVcbiAgICAgIH1cbiAgICAgIGBgYFxuXG4gICAgICBBc3luY2hyb25vdXMgZXhhbXBsZTpcblxuICAgICAgYGBganNcbiAgICAgIGZpbmRBdXRob3IoKS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICByZXR1cm4gZmluZE90aGVyQXV0aGVyKCk7XG4gICAgICB9KS5maW5hbGx5KGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIGF1dGhvciB3YXMgZWl0aGVyIGZvdW5kLCBvciBub3RcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEBtZXRob2QgZmluYWxseVxuICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGxhYmVsaW5nIHRoZSBwcm9taXNlLlxuICAgICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgICAgQHJldHVybiB7UHJvbWlzZX1cbiAgICAqL1xuICAgICAgJ2ZpbmFsbHknOiBmdW5jdGlvbihjYWxsYmFjaywgbGFiZWwpIHtcbiAgICAgICAgdmFyIHByb21pc2UgPSB0aGlzO1xuICAgICAgICB2YXIgY29uc3RydWN0b3IgPSBwcm9taXNlLmNvbnN0cnVjdG9yO1xuXG4gICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3IucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3IucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlamVjdChyZWFzb24pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBsYWJlbCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBmdW5jdGlvbiAgbGliJHJzdnAkJGludGVybmFsJCR3aXRoT3duUHJvbWlzZSgpIHtcbiAgICAgIHJldHVybiBuZXcgVHlwZUVycm9yKCdBIHByb21pc2VzIGNhbGxiYWNrIGNhbm5vdCByZXR1cm4gdGhhdCBzYW1lIHByb21pc2UuJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRub29wKCkge31cblxuICAgIHZhciBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcgICA9IHZvaWQgMDtcbiAgICB2YXIgbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQgPSAxO1xuICAgIHZhciBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEICA9IDI7XG5cbiAgICB2YXIgbGliJHJzdnAkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUiA9IG5ldyBsaWIkcnN2cCQkaW50ZXJuYWwkJEVycm9yT2JqZWN0KCk7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJGdldFRoZW4ocHJvbWlzZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbjtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUi5lcnJvciA9IGVycm9yO1xuICAgICAgICByZXR1cm4gbGliJHJzdnAkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHRyeVRoZW4odGhlbiwgdmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybiBlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlLCB0aGVuKSB7XG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hc3luYyhmdW5jdGlvbihwcm9taXNlKSB7XG4gICAgICAgIHZhciBzZWFsZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGVycm9yID0gbGliJHJzdnAkJGludGVybmFsJCR0cnlUaGVuKHRoZW4sIHRoZW5hYmxlLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIGlmIChzZWFsZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAodGhlbmFibGUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICBpZiAoc2VhbGVkKSB7IHJldHVybjsgfVxuICAgICAgICAgIHNlYWxlZCA9IHRydWU7XG5cbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgICB9LCAnU2V0dGxlOiAnICsgKHByb21pc2UuX2xhYmVsIHx8ICcgdW5rbm93biBwcm9taXNlJykpO1xuXG4gICAgICAgIGlmICghc2VhbGVkICYmIGVycm9yKSB7XG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0sIHByb21pc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUpIHtcbiAgICAgIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgICAgIH0gZWxzZSBpZiAodGhlbmFibGUuX3N0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEKSB7XG4gICAgICAgIHRoZW5hYmxlLl9vbkVycm9yID0gbnVsbDtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHN1YnNjcmliZSh0aGVuYWJsZSwgdW5kZWZpbmVkLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIGlmICh0aGVuYWJsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSwgdW5kZWZpbmVkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuKSB7XG4gICAgICBpZiAobWF5YmVUaGVuYWJsZS5jb25zdHJ1Y3RvciA9PT0gcHJvbWlzZS5jb25zdHJ1Y3RvciAmJlxuICAgICAgICAgIHRoZW4gPT09IGxpYiRyc3ZwJHRoZW4kJGRlZmF1bHQgJiZcbiAgICAgICAgICBjb25zdHJ1Y3Rvci5yZXNvbHZlID09PSBsaWIkcnN2cCRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGVuID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbGliJHJzdnAkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUi5lcnJvcik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhlbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGxpYiRyc3ZwJHV0aWxzJCRpc0Z1bmN0aW9uKHRoZW4pKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKSB7XG4gICAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAobGliJHJzdnAkdXRpbHMkJG9iamVjdE9yRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSwgbGliJHJzdnAkJGludGVybmFsJCRnZXRUaGVuKHZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XG4gICAgICBpZiAocHJvbWlzZS5fb25FcnJvcikge1xuICAgICAgICBwcm9taXNlLl9vbkVycm9yKHByb21pc2UuX3Jlc3VsdCk7XG4gICAgICB9XG5cbiAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcHVibGlzaChwcm9taXNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpIHtcbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HKSB7IHJldHVybjsgfVxuXG4gICAgICBwcm9taXNlLl9yZXN1bHQgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3N0YXRlID0gbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQ7XG5cbiAgICAgIGlmIChwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgaWYgKGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmluc3RydW1lbnQpIHtcbiAgICAgICAgICBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0KCdmdWxmaWxsZWQnLCBwcm9taXNlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYXN5bmMobGliJHJzdnAkJGludGVybmFsJCRwdWJsaXNoLCBwcm9taXNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pIHtcbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HKSB7IHJldHVybjsgfVxuICAgICAgcHJvbWlzZS5fc3RhdGUgPSBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEO1xuICAgICAgcHJvbWlzZS5fcmVzdWx0ID0gcmVhc29uO1xuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYXN5bmMobGliJHJzdnAkJGludGVybmFsJCRwdWJsaXNoUmVqZWN0aW9uLCBwcm9taXNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICAgICAgdmFyIHN1YnNjcmliZXJzID0gcGFyZW50Ll9zdWJzY3JpYmVycztcbiAgICAgIHZhciBsZW5ndGggPSBzdWJzY3JpYmVycy5sZW5ndGg7XG5cbiAgICAgIHBhcmVudC5fb25FcnJvciA9IG51bGw7XG5cbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aF0gPSBjaGlsZDtcbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aCArIGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEXSA9IG9uRnVsZmlsbG1lbnQ7XG4gICAgICBzdWJzY3JpYmVyc1tsZW5ndGggKyBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEXSAgPSBvblJlamVjdGlvbjtcblxuICAgICAgaWYgKGxlbmd0aCA9PT0gMCAmJiBwYXJlbnQuX3N0YXRlKSB7XG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jKGxpYiRyc3ZwJCRpbnRlcm5hbCQkcHVibGlzaCwgcGFyZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHB1Ymxpc2gocHJvbWlzZSkge1xuICAgICAgdmFyIHN1YnNjcmliZXJzID0gcHJvbWlzZS5fc3Vic2NyaWJlcnM7XG4gICAgICB2YXIgc2V0dGxlZCA9IHByb21pc2UuX3N0YXRlO1xuXG4gICAgICBpZiAobGliJHJzdnAkY29uZmlnJCRjb25maWcuaW5zdHJ1bWVudCkge1xuICAgICAgICBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0KHNldHRsZWQgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEID8gJ2Z1bGZpbGxlZCcgOiAncmVqZWN0ZWQnLCBwcm9taXNlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm47IH1cblxuICAgICAgdmFyIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsID0gcHJvbWlzZS5fcmVzdWx0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XG4gICAgICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgY2hpbGQsIGNhbGxiYWNrLCBkZXRhaWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKGRldGFpbCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoID0gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJEVycm9yT2JqZWN0KCkge1xuICAgICAgdGhpcy5lcnJvciA9IG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SID0gbmV3IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRXJyb3JPYmplY3QoKTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGRldGFpbCk7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IuZXJyb3IgPSBlO1xuICAgICAgICByZXR1cm4gbGliJHJzdnAkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBwcm9taXNlLCBjYWxsYmFjaywgZGV0YWlsKSB7XG4gICAgICB2YXIgaGFzQ2FsbGJhY2sgPSBsaWIkcnN2cCR1dGlscyQkaXNGdW5jdGlvbihjYWxsYmFjayksXG4gICAgICAgICAgdmFsdWUsIGVycm9yLCBzdWNjZWVkZWQsIGZhaWxlZDtcblxuICAgICAgaWYgKGhhc0NhbGxiYWNrKSB7XG4gICAgICAgIHZhbHVlID0gbGliJHJzdnAkJGludGVybmFsJCR0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKTtcblxuICAgICAgICBpZiAodmFsdWUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SKSB7XG4gICAgICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgICBlcnJvciA9IHZhbHVlLmVycm9yO1xuICAgICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbGliJHJzdnAkJGludGVybmFsJCR3aXRoT3duUHJvbWlzZSgpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBkZXRhaWw7XG4gICAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HKSB7XG4gICAgICAgIC8vIG5vb3BcbiAgICAgIH0gZWxzZSBpZiAoaGFzQ2FsbGJhY2sgJiYgc3VjY2VlZGVkKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGZhaWxlZCkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURUQpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaW5pdGlhbGl6ZVByb21pc2UocHJvbWlzZSwgcmVzb2x2ZXIpIHtcbiAgICAgIHZhciByZXNvbHZlZCA9IGZhbHNlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzb2x2ZXIoZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UodmFsdWUpe1xuICAgICAgICAgIGlmIChyZXNvbHZlZCkgeyByZXR1cm47IH1cbiAgICAgICAgICByZXNvbHZlZCA9IHRydWU7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZShyZWFzb24pIHtcbiAgICAgICAgICBpZiAocmVzb2x2ZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgcmVzb2x2ZWQgPSB0cnVlO1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRBbGxTZXR0bGVkKENvbnN0cnVjdG9yLCBlbnRyaWVzLCBsYWJlbCkge1xuICAgICAgdGhpcy5fc3VwZXJDb25zdHJ1Y3RvcihDb25zdHJ1Y3RvciwgZW50cmllcywgZmFsc2UgLyogZG9uJ3QgYWJvcnQgb24gcmVqZWN0ICovLCBsYWJlbCk7XG4gICAgfVxuXG4gICAgbGliJHJzdnAkYWxsJHNldHRsZWQkJEFsbFNldHRsZWQucHJvdG90eXBlID0gbGliJHJzdnAkdXRpbHMkJG9fY3JlYXRlKGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQucHJvdG90eXBlKTtcbiAgICBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkQWxsU2V0dGxlZC5wcm90b3R5cGUuX3N1cGVyQ29uc3RydWN0b3IgPSBsaWIkcnN2cCRlbnVtZXJhdG9yJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRBbGxTZXR0bGVkLnByb3RvdHlwZS5fbWFrZVJlc3VsdCA9IGxpYiRyc3ZwJGVudW1lcmF0b3IkJG1ha2VTZXR0bGVkUmVzdWx0O1xuICAgIGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRBbGxTZXR0bGVkLnByb3RvdHlwZS5fdmFsaWRhdGlvbkVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdhbGxTZXR0bGVkIG11c3QgYmUgY2FsbGVkIHdpdGggYW4gYXJyYXknKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYWxsJHNldHRsZWQkJGFsbFNldHRsZWQoZW50cmllcywgbGFiZWwpIHtcbiAgICAgIHJldHVybiBuZXcgbGliJHJzdnAkYWxsJHNldHRsZWQkJEFsbFNldHRsZWQobGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdCwgZW50cmllcywgbGFiZWwpLnByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkZGVmYXVsdCA9IGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRhbGxTZXR0bGVkO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFsbCQkYWxsKGFycmF5LCBsYWJlbCkge1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQuYWxsKGFycmF5LCBsYWJlbCk7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRhbGwkJGRlZmF1bHQgPSBsaWIkcnN2cCRhbGwkJGFsbDtcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkbGVuID0gMDtcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkdG9TdHJpbmcgPSB7fS50b1N0cmluZztcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkdmVydHhOZXh0O1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICAgICAgbGliJHJzdnAkYXNhcCQkcXVldWVbbGliJHJzdnAkYXNhcCQkbGVuXSA9IGNhbGxiYWNrO1xuICAgICAgbGliJHJzdnAkYXNhcCQkcXVldWVbbGliJHJzdnAkYXNhcCQkbGVuICsgMV0gPSBhcmc7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRsZW4gKz0gMjtcbiAgICAgIGlmIChsaWIkcnN2cCRhc2FwJCRsZW4gPT09IDIpIHtcbiAgICAgICAgLy8gSWYgbGVuIGlzIDEsIHRoYXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIHNjaGVkdWxlIGFuIGFzeW5jIGZsdXNoLlxuICAgICAgICAvLyBJZiBhZGRpdGlvbmFsIGNhbGxiYWNrcyBhcmUgcXVldWVkIGJlZm9yZSB0aGUgcXVldWUgaXMgZmx1c2hlZCwgdGhleVxuICAgICAgICAvLyB3aWxsIGJlIHByb2Nlc3NlZCBieSB0aGlzIGZsdXNoIHRoYXQgd2UgYXJlIHNjaGVkdWxpbmcuXG4gICAgICAgIGxpYiRyc3ZwJGFzYXAkJHNjaGVkdWxlRmx1c2goKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkZGVmYXVsdCA9IGxpYiRyc3ZwJGFzYXAkJGFzYXA7XG5cbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkYnJvd3NlcldpbmRvdyA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgPyB3aW5kb3cgOiB1bmRlZmluZWQ7XG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJGJyb3dzZXJHbG9iYWwgPSBsaWIkcnN2cCRhc2FwJCRicm93c2VyV2luZG93IHx8IHt9O1xuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGxpYiRyc3ZwJGFzYXAkJGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBsaWIkcnN2cCRhc2FwJCRicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJGlzTm9kZSA9IHR5cGVvZiBzZWxmID09PSAndW5kZWZpbmVkJyAmJlxuICAgICAgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHt9LnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJztcblxuICAgIC8vIHRlc3QgZm9yIHdlYiB3b3JrZXIgYnV0IG5vdCBpbiBJRTEwXG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJGlzV29ya2VyID0gdHlwZW9mIFVpbnQ4Q2xhbXBlZEFycmF5ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgdHlwZW9mIGltcG9ydFNjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2YgTWVzc2FnZUNoYW5uZWwgIT09ICd1bmRlZmluZWQnO1xuXG4gICAgLy8gbm9kZVxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJHVzZU5leHRUaWNrKCkge1xuICAgICAgdmFyIG5leHRUaWNrID0gcHJvY2Vzcy5uZXh0VGljaztcbiAgICAgIC8vIG5vZGUgdmVyc2lvbiAwLjEwLnggZGlzcGxheXMgYSBkZXByZWNhdGlvbiB3YXJuaW5nIHdoZW4gbmV4dFRpY2sgaXMgdXNlZCByZWN1cnNpdmVseVxuICAgICAgLy8gc2V0SW1tZWRpYXRlIHNob3VsZCBiZSB1c2VkIGluc3RlYWQgaW5zdGVhZFxuICAgICAgdmFyIHZlcnNpb24gPSBwcm9jZXNzLnZlcnNpb25zLm5vZGUubWF0Y2goL14oPzooXFxkKylcXC4pPyg/OihcXGQrKVxcLik/KFxcKnxcXGQrKSQvKTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZlcnNpb24pICYmIHZlcnNpb25bMV0gPT09ICcwJyAmJiB2ZXJzaW9uWzJdID09PSAnMTAnKSB7XG4gICAgICAgIG5leHRUaWNrID0gc2V0SW1tZWRpYXRlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBuZXh0VGljayhsaWIkcnN2cCRhc2FwJCRmbHVzaCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIHZlcnR4XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkdXNlVmVydHhUaW1lcigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGliJHJzdnAkYXNhcCQkdmVydHhOZXh0KGxpYiRyc3ZwJGFzYXAkJGZsdXNoKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBsaWIkcnN2cCRhc2FwJCRCcm93c2VyTXV0YXRpb25PYnNlcnZlcihsaWIkcnN2cCRhc2FwJCRmbHVzaCk7XG4gICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICAgIG9ic2VydmVyLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pO1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIG5vZGUuZGF0YSA9IChpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMik7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIHdlYiB3b3JrZXJcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCR1c2VNZXNzYWdlQ2hhbm5lbCgpIHtcbiAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpYiRyc3ZwJGFzYXAkJGZsdXNoO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkdXNlU2V0VGltZW91dCgpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgc2V0VGltZW91dChsaWIkcnN2cCRhc2FwJCRmbHVzaCwgMSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRxdWV1ZSA9IG5ldyBBcnJheSgxMDAwKTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCRmbHVzaCgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGliJHJzdnAkYXNhcCQkbGVuOyBpKz0yKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGxpYiRyc3ZwJGFzYXAkJHF1ZXVlW2ldO1xuICAgICAgICB2YXIgYXJnID0gbGliJHJzdnAkYXNhcCQkcXVldWVbaSsxXTtcblxuICAgICAgICBjYWxsYmFjayhhcmcpO1xuXG4gICAgICAgIGxpYiRyc3ZwJGFzYXAkJHF1ZXVlW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICBsaWIkcnN2cCRhc2FwJCRxdWV1ZVtpKzFdID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBsaWIkcnN2cCRhc2FwJCRsZW4gPSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJGF0dGVtcHRWZXJ0ZXgoKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgciA9IHJlcXVpcmU7XG4gICAgICAgIHZhciB2ZXJ0eCA9IHIoJ3ZlcnR4Jyk7XG4gICAgICAgIGxpYiRyc3ZwJGFzYXAkJHZlcnR4TmV4dCA9IHZlcnR4LnJ1bk9uTG9vcCB8fCB2ZXJ0eC5ydW5PbkNvbnRleHQ7XG4gICAgICAgIHJldHVybiBsaWIkcnN2cCRhc2FwJCR1c2VWZXJ0eFRpbWVyKCk7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJGFzYXAkJHVzZVNldFRpbWVvdXQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaDtcbiAgICAvLyBEZWNpZGUgd2hhdCBhc3luYyBtZXRob2QgdG8gdXNlIHRvIHRyaWdnZXJpbmcgcHJvY2Vzc2luZyBvZiBxdWV1ZWQgY2FsbGJhY2tzOlxuICAgIGlmIChsaWIkcnN2cCRhc2FwJCRpc05vZGUpIHtcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkcnN2cCRhc2FwJCR1c2VOZXh0VGljaygpO1xuICAgIH0gZWxzZSBpZiAobGliJHJzdnAkYXNhcCQkQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkcnN2cCRhc2FwJCR1c2VNdXRhdGlvbk9ic2VydmVyKCk7XG4gICAgfSBlbHNlIGlmIChsaWIkcnN2cCRhc2FwJCRpc1dvcmtlcikge1xuICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRyc3ZwJGFzYXAkJHVzZU1lc3NhZ2VDaGFubmVsKCk7XG4gICAgfSBlbHNlIGlmIChsaWIkcnN2cCRhc2FwJCRicm93c2VyV2luZG93ID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkcnN2cCRhc2FwJCRhdHRlbXB0VmVydGV4KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkcnN2cCRhc2FwJCR1c2VTZXRUaW1lb3V0KCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGRlZmVyJCRkZWZlcihsYWJlbCkge1xuICAgICAgdmFyIGRlZmVycmVkID0ge307XG5cbiAgICAgIGRlZmVycmVkWydwcm9taXNlJ10gPSBuZXcgbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZGVmZXJyZWRbJ3Jlc29sdmUnXSA9IHJlc29sdmU7XG4gICAgICAgIGRlZmVycmVkWydyZWplY3QnXSA9IHJlamVjdDtcbiAgICAgIH0sIGxhYmVsKTtcblxuICAgICAgcmV0dXJuIGRlZmVycmVkO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkZGVmZXIkJGRlZmF1bHQgPSBsaWIkcnN2cCRkZWZlciQkZGVmZXI7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkZmlsdGVyJCRmaWx0ZXIocHJvbWlzZXMsIGZpbHRlckZuLCBsYWJlbCkge1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQuYWxsKHByb21pc2VzLCBsYWJlbCkudGhlbihmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgICAgaWYgKCFsaWIkcnN2cCR1dGlscyQkaXNGdW5jdGlvbihmaWx0ZXJGbikpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiWW91IG11c3QgcGFzcyBhIGZ1bmN0aW9uIGFzIGZpbHRlcidzIHNlY29uZCBhcmd1bWVudC5cIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aDtcbiAgICAgICAgdmFyIGZpbHRlcmVkID0gbmV3IEFycmF5KGxlbmd0aCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgIGZpbHRlcmVkW2ldID0gZmlsdGVyRm4odmFsdWVzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LmFsbChmaWx0ZXJlZCwgbGFiZWwpLnRoZW4oZnVuY3Rpb24oZmlsdGVyZWQpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgICAgICAgIHZhciBuZXdMZW5ndGggPSAwO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZpbHRlcmVkW2ldKSB7XG4gICAgICAgICAgICAgIHJlc3VsdHNbbmV3TGVuZ3RoXSA9IHZhbHVlc1tpXTtcbiAgICAgICAgICAgICAgbmV3TGVuZ3RoKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzdWx0cy5sZW5ndGggPSBuZXdMZW5ndGg7XG5cbiAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGZpbHRlciQkZGVmYXVsdCA9IGxpYiRyc3ZwJGZpbHRlciQkZmlsdGVyO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaChDb25zdHJ1Y3Rvciwgb2JqZWN0LCBsYWJlbCkge1xuICAgICAgdGhpcy5fc3VwZXJDb25zdHJ1Y3RvcihDb25zdHJ1Y3Rvciwgb2JqZWN0LCB0cnVlLCBsYWJlbCk7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkZGVmYXVsdCA9IGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2g7XG5cbiAgICBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoLnByb3RvdHlwZSA9IGxpYiRyc3ZwJHV0aWxzJCRvX2NyZWF0ZShsaWIkcnN2cCRlbnVtZXJhdG9yJCRkZWZhdWx0LnByb3RvdHlwZSk7XG4gICAgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaC5wcm90b3R5cGUuX3N1cGVyQ29uc3RydWN0b3IgPSBsaWIkcnN2cCRlbnVtZXJhdG9yJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2gucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9yZXN1bHQgPSB7fTtcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaC5wcm90b3R5cGUuX3ZhbGlkYXRlSW5wdXQgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgcmV0dXJuIGlucHV0ICYmIHR5cGVvZiBpbnB1dCA9PT0gJ29iamVjdCc7XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2gucHJvdG90eXBlLl92YWxpZGF0aW9uRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ1Byb21pc2UuaGFzaCBtdXN0IGJlIGNhbGxlZCB3aXRoIGFuIG9iamVjdCcpO1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoLnByb3RvdHlwZS5fZW51bWVyYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG4gICAgICB2YXIgcHJvbWlzZSAgICA9IGVudW1lcmF0b3IucHJvbWlzZTtcbiAgICAgIHZhciBpbnB1dCAgICAgID0gZW51bWVyYXRvci5faW5wdXQ7XG4gICAgICB2YXIgcmVzdWx0cyAgICA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gaW5wdXQpIHtcbiAgICAgICAgaWYgKHByb21pc2UuX3N0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGlucHV0LCBrZXkpKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBrZXksXG4gICAgICAgICAgICBlbnRyeTogaW5wdXRba2V5XVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBsZW5ndGggPSByZXN1bHRzLmxlbmd0aDtcbiAgICAgIGVudW1lcmF0b3IuX3JlbWFpbmluZyA9IGxlbmd0aDtcbiAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBwcm9taXNlLl9zdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HICYmIGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICByZXN1bHQgPSByZXN1bHRzW2ldO1xuICAgICAgICBlbnVtZXJhdG9yLl9lYWNoRW50cnkocmVzdWx0LmVudHJ5LCByZXN1bHQucG9zaXRpb24pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJEhhc2hTZXR0bGVkKENvbnN0cnVjdG9yLCBvYmplY3QsIGxhYmVsKSB7XG4gICAgICB0aGlzLl9zdXBlckNvbnN0cnVjdG9yKENvbnN0cnVjdG9yLCBvYmplY3QsIGZhbHNlLCBsYWJlbCk7XG4gICAgfVxuXG4gICAgbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRIYXNoU2V0dGxlZC5wcm90b3R5cGUgPSBsaWIkcnN2cCR1dGlscyQkb19jcmVhdGUobGliJHJzdnAkcHJvbWlzZSRoYXNoJCRkZWZhdWx0LnByb3RvdHlwZSk7XG4gICAgbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRIYXNoU2V0dGxlZC5wcm90b3R5cGUuX3N1cGVyQ29uc3RydWN0b3IgPSBsaWIkcnN2cCRlbnVtZXJhdG9yJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkSGFzaFNldHRsZWQucHJvdG90eXBlLl9tYWtlUmVzdWx0ID0gbGliJHJzdnAkZW51bWVyYXRvciQkbWFrZVNldHRsZWRSZXN1bHQ7XG5cbiAgICBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJEhhc2hTZXR0bGVkLnByb3RvdHlwZS5fdmFsaWRhdGlvbkVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdoYXNoU2V0dGxlZCBtdXN0IGJlIGNhbGxlZCB3aXRoIGFuIG9iamVjdCcpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJGhhc2hTZXR0bGVkKG9iamVjdCwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBuZXcgbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRIYXNoU2V0dGxlZChsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LCBvYmplY3QsIGxhYmVsKS5wcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRkZWZhdWx0ID0gbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRoYXNoU2V0dGxlZDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRoYXNoJCRoYXNoKG9iamVjdCwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBuZXcgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRkZWZhdWx0KGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQsIG9iamVjdCwgbGFiZWwpLnByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRoYXNoJCRkZWZhdWx0ID0gbGliJHJzdnAkaGFzaCQkaGFzaDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRtYXAkJG1hcChwcm9taXNlcywgbWFwRm4sIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5hbGwocHJvbWlzZXMsIGxhYmVsKS50aGVuKGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgICBpZiAoIWxpYiRyc3ZwJHV0aWxzJCRpc0Z1bmN0aW9uKG1hcEZuKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJZb3UgbXVzdCBwYXNzIGEgZnVuY3Rpb24gYXMgbWFwJ3Mgc2Vjb25kIGFyZ3VtZW50LlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoO1xuICAgICAgICB2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShsZW5ndGgpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICByZXN1bHRzW2ldID0gbWFwRm4odmFsdWVzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LmFsbChyZXN1bHRzLCBsYWJlbCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJG1hcCQkZGVmYXVsdCA9IGxpYiRyc3ZwJG1hcCQkbWFwO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkUmVzdWx0KCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkbm9kZSQkRVJST1IgPSBuZXcgbGliJHJzdnAkbm9kZSQkUmVzdWx0KCk7XG4gICAgdmFyIGxpYiRyc3ZwJG5vZGUkJEdFVF9USEVOX0VSUk9SID0gbmV3IGxpYiRyc3ZwJG5vZGUkJFJlc3VsdCgpO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkZ2V0VGhlbihvYmopIHtcbiAgICAgIHRyeSB7XG4gICAgICAgcmV0dXJuIG9iai50aGVuO1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsaWIkcnN2cCRub2RlJCRFUlJPUi52YWx1ZT0gZXJyb3I7XG4gICAgICAgIHJldHVybiBsaWIkcnN2cCRub2RlJCRFUlJPUjtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJHRyeUFwcGx5KGYsIHMsIGEpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGYuYXBwbHkocywgYSk7XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIGxpYiRyc3ZwJG5vZGUkJEVSUk9SLnZhbHVlID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBsaWIkcnN2cCRub2RlJCRFUlJPUjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRtYWtlT2JqZWN0KF8sIGFyZ3VtZW50TmFtZXMpIHtcbiAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgIHZhciBuYW1lO1xuICAgICAgdmFyIGk7XG4gICAgICB2YXIgbGVuZ3RoID0gXy5sZW5ndGg7XG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShsZW5ndGgpO1xuXG4gICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGxlbmd0aDsgeCsrKSB7XG4gICAgICAgIGFyZ3NbeF0gPSBfW3hdO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYXJndW1lbnROYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBuYW1lID0gYXJndW1lbnROYW1lc1tpXTtcbiAgICAgICAgb2JqW25hbWVdID0gYXJnc1tpICsgMV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkYXJyYXlSZXN1bHQoXykge1xuICAgICAgdmFyIGxlbmd0aCA9IF8ubGVuZ3RoO1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkobGVuZ3RoIC0gMSk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYXJnc1tpIC0gMV0gPSBfW2ldO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYXJncztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCR3cmFwVGhlbmFibGUodGhlbiwgcHJvbWlzZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGhlbjogZnVuY3Rpb24ob25GdWxGaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm4gdGhlbi5jYWxsKHByb21pc2UsIG9uRnVsRmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRkZW5vZGVpZnkobm9kZUZ1bmMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBmbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBsID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkobCArIDEpO1xuICAgICAgICB2YXIgYXJnO1xuICAgICAgICB2YXIgcHJvbWlzZUlucHV0ID0gZmFsc2U7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICBhcmcgPSBhcmd1bWVudHNbaV07XG5cbiAgICAgICAgICBpZiAoIXByb21pc2VJbnB1dCkge1xuICAgICAgICAgICAgLy8gVE9ETzogY2xlYW4gdGhpcyB1cFxuICAgICAgICAgICAgcHJvbWlzZUlucHV0ID0gbGliJHJzdnAkbm9kZSQkbmVlZHNQcm9taXNlSW5wdXQoYXJnKTtcbiAgICAgICAgICAgIGlmIChwcm9taXNlSW5wdXQgPT09IGxpYiRyc3ZwJG5vZGUkJEdFVF9USEVOX0VSUk9SKSB7XG4gICAgICAgICAgICAgIHZhciBwID0gbmV3IGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQobGliJHJzdnAkJGludGVybmFsJCRub29wKTtcbiAgICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocCwgbGliJHJzdnAkbm9kZSQkR0VUX1RIRU5fRVJST1IudmFsdWUpO1xuICAgICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvbWlzZUlucHV0ICYmIHByb21pc2VJbnB1dCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICBhcmcgPSBsaWIkcnN2cCRub2RlJCR3cmFwVGhlbmFibGUocHJvbWlzZUlucHV0LCBhcmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBhcmdzW2ldID0gYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHByb21pc2UgPSBuZXcgbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdChsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3ApO1xuXG4gICAgICAgIGFyZ3NbbF0gPSBmdW5jdGlvbihlcnIsIHZhbCkge1xuICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlcnIpO1xuICAgICAgICAgIGVsc2UgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWwpO1xuICAgICAgICAgIGVsc2UgaWYgKG9wdGlvbnMgPT09IHRydWUpXG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgbGliJHJzdnAkbm9kZSQkYXJyYXlSZXN1bHQoYXJndW1lbnRzKSk7XG4gICAgICAgICAgZWxzZSBpZiAobGliJHJzdnAkdXRpbHMkJGlzQXJyYXkob3B0aW9ucykpXG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgbGliJHJzdnAkbm9kZSQkbWFrZU9iamVjdChhcmd1bWVudHMsIG9wdGlvbnMpKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAocHJvbWlzZUlucHV0KSB7XG4gICAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJG5vZGUkJGhhbmRsZVByb21pc2VJbnB1dChwcm9taXNlLCBhcmdzLCBub2RlRnVuYywgc2VsZik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJG5vZGUkJGhhbmRsZVZhbHVlSW5wdXQocHJvbWlzZSwgYXJncywgbm9kZUZ1bmMsIHNlbGYpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmbi5fX3Byb3RvX18gPSBub2RlRnVuYztcblxuICAgICAgcmV0dXJuIGZuO1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRub2RlJCRkZWZhdWx0ID0gbGliJHJzdnAkbm9kZSQkZGVub2RlaWZ5O1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkaGFuZGxlVmFsdWVJbnB1dChwcm9taXNlLCBhcmdzLCBub2RlRnVuYywgc2VsZikge1xuICAgICAgdmFyIHJlc3VsdCA9IGxpYiRyc3ZwJG5vZGUkJHRyeUFwcGx5KG5vZGVGdW5jLCBzZWxmLCBhcmdzKTtcbiAgICAgIGlmIChyZXN1bHQgPT09IGxpYiRyc3ZwJG5vZGUkJEVSUk9SKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlc3VsdC52YWx1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRoYW5kbGVQcm9taXNlSW5wdXQocHJvbWlzZSwgYXJncywgbm9kZUZ1bmMsIHNlbGYpe1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQuYWxsKGFyZ3MpLnRoZW4oZnVuY3Rpb24oYXJncyl7XG4gICAgICAgIHZhciByZXN1bHQgPSBsaWIkcnN2cCRub2RlJCR0cnlBcHBseShub2RlRnVuYywgc2VsZiwgYXJncyk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IGxpYiRyc3ZwJG5vZGUkJEVSUk9SKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVzdWx0LnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJG5lZWRzUHJvbWlzZUlucHV0KGFyZykge1xuICAgICAgaWYgKGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAoYXJnLmNvbnN0cnVjdG9yID09PSBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJG5vZGUkJGdldFRoZW4oYXJnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcGxhdGZvcm0kJHBsYXRmb3JtO1xuXG4gICAgLyogZ2xvYmFsIHNlbGYgKi9cbiAgICBpZiAodHlwZW9mIHNlbGYgPT09ICdvYmplY3QnKSB7XG4gICAgICBsaWIkcnN2cCRwbGF0Zm9ybSQkcGxhdGZvcm0gPSBzZWxmO1xuXG4gICAgLyogZ2xvYmFsIGdsb2JhbCAqL1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGxpYiRyc3ZwJHBsYXRmb3JtJCRwbGF0Zm9ybSA9IGdsb2JhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBnbG9iYWw6IGBzZWxmYCBvciBgZ2xvYmFsYCBmb3VuZCcpO1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRwbGF0Zm9ybSQkZGVmYXVsdCA9IGxpYiRyc3ZwJHBsYXRmb3JtJCRwbGF0Zm9ybTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRyYWNlJCRyYWNlKGFycmF5LCBsYWJlbCkge1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQucmFjZShhcnJheSwgbGFiZWwpO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcmFjZSQkZGVmYXVsdCA9IGxpYiRyc3ZwJHJhY2UkJHJhY2U7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcmVqZWN0JCRyZWplY3QocmVhc29uLCBsYWJlbCkge1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQucmVqZWN0KHJlYXNvbiwgbGFiZWwpO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcmVqZWN0JCRkZWZhdWx0ID0gbGliJHJzdnAkcmVqZWN0JCRyZWplY3Q7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcmVzb2x2ZSQkcmVzb2x2ZSh2YWx1ZSwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LnJlc29sdmUodmFsdWUsIGxhYmVsKTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHJlc29sdmUkJGRlZmF1bHQgPSBsaWIkcnN2cCRyZXNvbHZlJCRyZXNvbHZlO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHJldGhyb3ckJHJldGhyb3cocmVhc29uKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aHJvdyByZWFzb247XG4gICAgICB9KTtcbiAgICAgIHRocm93IHJlYXNvbjtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHJldGhyb3ckJGRlZmF1bHQgPSBsaWIkcnN2cCRyZXRocm93JCRyZXRocm93O1xuXG4gICAgLy8gZGVmYXVsdHNcbiAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hc3luYyA9IGxpYiRyc3ZwJGFzYXAkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYWZ0ZXIgPSBmdW5jdGlvbihjYikge1xuICAgICAgc2V0VGltZW91dChjYiwgMCk7XG4gICAgfTtcbiAgICB2YXIgbGliJHJzdnAkJGNhc3QgPSBsaWIkcnN2cCRyZXNvbHZlJCRkZWZhdWx0O1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRhc3luYyhjYWxsYmFjaywgYXJnKSB7XG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hc3luYyhjYWxsYmFjaywgYXJnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkb24oKSB7XG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1snb24nXS5hcHBseShsaWIkcnN2cCRjb25maWckJGNvbmZpZywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkb2ZmKCkge1xuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWdbJ29mZiddLmFwcGx5KGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8vIFNldCB1cCBpbnN0cnVtZW50YXRpb24gdGhyb3VnaCBgd2luZG93Ll9fUFJPTUlTRV9JTlRSVU1FTlRBVElPTl9fYFxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93WydfX1BST01JU0VfSU5TVFJVTUVOVEFUSU9OX18nXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHZhciBsaWIkcnN2cCQkY2FsbGJhY2tzID0gd2luZG93WydfX1BST01JU0VfSU5TVFJVTUVOVEFUSU9OX18nXTtcbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlndXJlKCdpbnN0cnVtZW50JywgdHJ1ZSk7XG4gICAgICBmb3IgKHZhciBsaWIkcnN2cCQkZXZlbnROYW1lIGluIGxpYiRyc3ZwJCRjYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKGxpYiRyc3ZwJCRjYWxsYmFja3MuaGFzT3duUHJvcGVydHkobGliJHJzdnAkJGV2ZW50TmFtZSkpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkb24obGliJHJzdnAkJGV2ZW50TmFtZSwgbGliJHJzdnAkJGNhbGxiYWNrc1tsaWIkcnN2cCQkZXZlbnROYW1lXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkdW1kJCRSU1ZQID0ge1xuICAgICAgJ3JhY2UnOiBsaWIkcnN2cCRyYWNlJCRkZWZhdWx0LFxuICAgICAgJ1Byb21pc2UnOiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LFxuICAgICAgJ2FsbFNldHRsZWQnOiBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkZGVmYXVsdCxcbiAgICAgICdoYXNoJzogbGliJHJzdnAkaGFzaCQkZGVmYXVsdCxcbiAgICAgICdoYXNoU2V0dGxlZCc6IGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkZGVmYXVsdCxcbiAgICAgICdkZW5vZGVpZnknOiBsaWIkcnN2cCRub2RlJCRkZWZhdWx0LFxuICAgICAgJ29uJzogbGliJHJzdnAkJG9uLFxuICAgICAgJ29mZic6IGxpYiRyc3ZwJCRvZmYsXG4gICAgICAnbWFwJzogbGliJHJzdnAkbWFwJCRkZWZhdWx0LFxuICAgICAgJ2ZpbHRlcic6IGxpYiRyc3ZwJGZpbHRlciQkZGVmYXVsdCxcbiAgICAgICdyZXNvbHZlJzogbGliJHJzdnAkcmVzb2x2ZSQkZGVmYXVsdCxcbiAgICAgICdyZWplY3QnOiBsaWIkcnN2cCRyZWplY3QkJGRlZmF1bHQsXG4gICAgICAnYWxsJzogbGliJHJzdnAkYWxsJCRkZWZhdWx0LFxuICAgICAgJ3JldGhyb3cnOiBsaWIkcnN2cCRyZXRocm93JCRkZWZhdWx0LFxuICAgICAgJ2RlZmVyJzogbGliJHJzdnAkZGVmZXIkJGRlZmF1bHQsXG4gICAgICAnRXZlbnRUYXJnZXQnOiBsaWIkcnN2cCRldmVudHMkJGRlZmF1bHQsXG4gICAgICAnY29uZmlndXJlJzogbGliJHJzdnAkY29uZmlnJCRjb25maWd1cmUsXG4gICAgICAnYXN5bmMnOiBsaWIkcnN2cCQkYXN5bmNcbiAgICB9O1xuXG4gICAgLyogZ2xvYmFsIGRlZmluZTp0cnVlIG1vZHVsZTp0cnVlIHdpbmRvdzogdHJ1ZSAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZVsnYW1kJ10pIHtcbiAgICAgIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIGxpYiRyc3ZwJHVtZCQkUlNWUDsgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGVbJ2V4cG9ydHMnXSkge1xuICAgICAgbW9kdWxlWydleHBvcnRzJ10gPSBsaWIkcnN2cCR1bWQkJFJTVlA7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbGliJHJzdnAkcGxhdGZvcm0kJGRlZmF1bHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBsaWIkcnN2cCRwbGF0Zm9ybSQkZGVmYXVsdFsnUlNWUCddID0gbGliJHJzdnAkdW1kJCRSU1ZQO1xuICAgIH1cbn0pLmNhbGwodGhpcyk7XG5cbiJdfQ==

//# sourceMappingURL=algorithm_visualizer.js.map
