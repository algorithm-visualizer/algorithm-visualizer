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

var _require = require('../dom/loading_slider');

var showLoadingSlider = _require.showLoadingSlider;
var hideLoadingSlider = _require.hideLoadingSlider;


var Cache = require('./cache');

var state = {
  isLoading: null,
  editor: null,
  tracerManager: null,
  categories: null,
  loadedScratch: null
};

var initState = function initState(tracerManager) {
  state.isLoading = false;
  state.editor = new Editor(tracerManager);
  state.tracerManager = tracerManager;
  state.categories = {};
  state.loadedScratch = null;
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
      showLoadingSlider();
    } else {
      hideLoadingSlider();
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

  this.getLoadedScratch = function () {
    return state.loadedScratch;
  };

  this.setLoadedScratch = function (loadedScratch) {
    state.loadedScratch = loadedScratch;
  };

  var tracerManager = TracerManager.init();

  initState(tracerManager);
  DOM.setup(tracerManager);
};

App.prototype = Cache;

module.exports = App;

},{"../dom/loading_slider":7,"../dom/setup":9,"../editor":28,"../tracer_manager":61,"./cache":1}],3:[function(require,module,exports){
'use strict';

/**
 * This is the main application instance.
 * Gets populated on page load. 
 */

module.exports = {};

},{}],4:[function(require,module,exports){
'use strict';

var app = require('../app');
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
  var _app$getCategory = app.getCategory(category);

  var categoryName = _app$getCategory.name;
  var categorySubList = _app$getCategory.list;


  var $category = $('<button class="category">').append('<i class="fa fa-fw fa-caret-right">').append(categoryName).attr('data-category', category);

  $category.click(function () {
    $('.indent[data-category="' + category + '"]').toggleClass('collapse');
    $(this).find('i.fa').toggleClass('fa-caret-right fa-caret-down');
  });

  $('#list').append($category);

  each(categorySubList, function (algorithm) {
    addAlgorithmToCategoryDOM(category, categorySubList, algorithm);
  });
};

module.exports = function () {
  each(app.getCategories(), addCategoryToDOM);
};

},{"../app":3,"../server":55,"./show_algorithm":20}],5:[function(require,module,exports){
'use strict';

var Server = require('../server');

var _$ = $;
var each = _$.each;


var addFileToDOM = function addFileToDOM(category, algorithm, file, explanation) {
  var $file = $('<button>').append(file).attr('data-file', file).click(function () {
    Server.loadFile(category, algorithm, file, explanation);
    $('.files_bar > .wrapper > button').removeClass('active');
    $(this).addClass('active');
  });
  $('.files_bar > .wrapper').append($file);
  return $file;
};

module.exports = function (category, algorithm, files, requestedFile) {
  $('.files_bar > .wrapper').empty();

  each(files, function (file, explanation) {
    var $file = addFileToDOM(category, algorithm, file, explanation);
    if (requestedFile && requestedFile == file) $file.click();
  });

  if (!requestedFile) $('.files_bar > .wrapper > button').first().click();
  $('.files_bar > .wrapper').scroll();
};

},{"../server":55}],6:[function(require,module,exports){
'use strict';

var showAlgorithm = require('./show_algorithm');
var addCategories = require('./add_categories');
var showDescription = require('./show_description');
var addFiles = require('./add_files');
var showFirstAlgorithm = require('./show_first_algorithm');
var showRequestedAlgorithm = require('./show_requested_algorithm');

module.exports = {
  showAlgorithm: showAlgorithm,
  addCategories: addCategories,
  showDescription: showDescription,
  addFiles: addFiles,
  showFirstAlgorithm: showFirstAlgorithm,
  showRequestedAlgorithm: showRequestedAlgorithm
};

},{"./add_categories":4,"./add_files":5,"./show_algorithm":20,"./show_description":21,"./show_first_algorithm":22,"./show_requested_algorithm":23}],7:[function(require,module,exports){
'use strict';

var showLoadingSlider = function showLoadingSlider() {
  $('#loading-slider').removeClass('loaded');
};

var hideLoadingSlider = function hideLoadingSlider() {
  $('#loading-slider').addClass('loaded');
};

module.exports = {
  showLoadingSlider: showLoadingSlider,
  hideLoadingSlider: hideLoadingSlider
};

},{}],8:[function(require,module,exports){
'use strict';

var create = function create() {
  var $container = $('<section class="module_wrapper">');
  $('.module_container').append($container);
  return $container;
};

module.exports = {
  create: create
};

},{}],9:[function(require,module,exports){
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

},{"./setup_dividers":10,"./setup_document":11,"./setup_files_bar":12,"./setup_interval":13,"./setup_module_container":14,"./setup_powered_by":15,"./setup_scratch_paper":16,"./setup_side_menu":17,"./setup_top_menu":18,"./setup_window":19}],10:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var app = require('../../app');

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
          app.getTracerManager().resize();
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
          app.getTracerManager().resize();
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

},{"../../app":3}],11:[function(require,module,exports){
'use strict';

var app = require('../../app');

module.exports = function () {
  $(document).on('click', 'a', function (e) {
    e.preventDefault();
    if (!window.open($(this).attr('href'), '_blank')) {
      alert('Please allow popups for this site');
    }
  });

  $(document).mouseup(function (e) {
    app.getTracerManager().command('mouseup', e);
  });
};

},{"../../app":3}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var app = require('../../app');
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
    interval = maxInterval;
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
    var tracerManager = app.getTracerManager();

    var _normalize = normalize(parseFloat($(this).val()));

    var _normalize2 = _slicedToArray(_normalize, 2);

    var seconds = _normalize2[0];
    var message = _normalize2[1];


    $(this).val(seconds);
    tracerManager.interval = seconds * 1000;
    Toast.showInfoToast(message);
  });
};

},{"../../app":3,"../toast":24}],14:[function(require,module,exports){
'use strict';

var app = require('../../app');

module.exports = function () {

  var $module_container = $('.module_container');

  $module_container.on('mousedown', '.module_wrapper', function (e) {
    app.getTracerManager().findOwner(this).mousedown(e);
  });

  $module_container.on('mousemove', '.module_wrapper', function (e) {
    app.getTracerManager().findOwner(this).mousemove(e);
  });

  $module_container.on('DOMMouseScroll mousewheel', '.module_wrapper', function (e) {
    app.getTracerManager().findOwner(this).mousewheel(e);
  });
};

},{"../../app":3}],15:[function(require,module,exports){
'use strict';

module.exports = function () {
  $('#powered-by').click(function () {
    $('#powered-by-list button').toggleClass('collapse');
  });
};

},{}],16:[function(require,module,exports){
'use strict';

var app = require('../../app');
var Server = require('../../server');
var showAlgorithm = require('../show_algorithm');

module.exports = function () {
  $('#scratch-paper').click(function () {
    var category = 'scratch';
    var algorithm = app.getLoadedScratch();
    Server.loadAlgorithm(category, algorithm).then(function (data) {
      showAlgorithm(category, algorithm, data);
    });
  });
};

},{"../../app":3,"../../server":55,"../show_algorithm":20}],17:[function(require,module,exports){
'use strict';

var app = require('../../app');

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

    app.getTracerManager().resize();
  });
};

},{"../../app":3}],18:[function(require,module,exports){
'use strict';

var app = require('../../app');
var Server = require('../../server');
var Toast = require('../toast');
var TopMenu = require('../top_menu');

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

  var $btnRun = $('#btn_run');
  var $btnTrace = $('#btn_trace');
  var $btnPause = $('#btn_pause');
  var $btnPrev = $('#btn_prev');
  var $btnNext = $('#btn_next');
  var $btnDesc = $('#btn_desc');

  // initially, control buttons are disabled
  TopMenu.disableFlowControl();

  $btnRun.click(function () {
    $btnTrace.click();
    $btnPause.removeClass('active');
    $btnRun.addClass('active');
    TopMenu.enableFlowControl();
    var err = app.getEditor().execute();
    if (err) {
      console.error(err);
      Toast.showErrorToast(err);
    }
  });

  $btnPause.click(function () {
    $btnRun.toggleClass('active');
    $btnPause.toggleClass('active');
    if (app.getTracerManager().isPause()) {
      app.getTracerManager().resumeStep();
    } else {
      app.getTracerManager().pauseStep();
    }
  });

  $btnPrev.click(function () {
    $btnRun.removeClass('active');
    $btnPause.addClass('active');
    app.getTracerManager().pauseStep();
    app.getTracerManager().prevStep();
  });

  $btnNext.click(function () {
    $btnRun.removeClass('active');
    $btnPause.addClass('active');
    app.getTracerManager().pauseStep();
    app.getTracerManager().nextStep();
  });

  // description & trace

  $btnDesc.click(function () {
    $('.tab_container > .tab').removeClass('active');
    $('#tab_desc').addClass('active');
    $('.tab_bar > button').removeClass('active');
    $btnDesc.addClass('active');
  });

  $btnTrace.click(function () {
    $('.tab_container > .tab').removeClass('active');
    $('#tab_module').addClass('active');
    $('.tab_bar > button').removeClass('active');
    $btnTrace.addClass('active');
  });
};

},{"../../app":3,"../../server":55,"../toast":24,"../top_menu":25}],19:[function(require,module,exports){
'use strict';

var app = require('../../app');

module.exports = function () {
  $(window).resize(function () {
    app.getTracerManager().resize();
  });
};

},{"../../app":3}],20:[function(require,module,exports){
'use strict';

var app = require('../app');

var _require = require('../utils');

var isScratchPaper = _require.isScratchPaper;


var showDescription = require('./show_description');
var addFiles = require('./add_files');

module.exports = function (category, algorithm, data, requestedFile) {
  var $menu = void 0;
  var category_name = void 0;
  var algorithm_name = void 0;

  if (isScratchPaper(category)) {
    $menu = $('#scratch-paper');
    category_name = 'Scratch Paper';
    algorithm_name = algorithm ? 'Shared' : 'Temporary';
  } else {
    $menu = $('[data-category="' + category + '"][data-algorithm="' + algorithm + '"]');
    var categoryObj = app.getCategory(category);
    category_name = categoryObj.name;
    algorithm_name = categoryObj.list[algorithm];
  }

  $('.sidemenu button').removeClass('active');
  $menu.addClass('active');

  $('#category').html(category_name);
  $('#algorithm').html(algorithm_name);
  $('#tab_desc > .wrapper').empty();
  $('.files_bar > .wrapper').empty();
  $('#explanation').html('');

  app.setLastFileUsed(null);
  app.getEditor().clearContent();

  var files = data.files;


  delete data.files;

  showDescription(data);
  addFiles(category, algorithm, files, requestedFile);
};

},{"../app":3,"../utils":67,"./add_files":5,"./show_description":21}],21:[function(require,module,exports){
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

        var $ul = $('<ul class="applications">');
        $container.append($ul);

        value.forEach(function (li) {
          $ul.append($('<li>').html(li));
        });
      })();
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      (function () {

        var $ul = $('<ul class="complexities">');
        $container.append($ul);

        each(value, function (prop) {
          var $wrapper = $('<div class="complexity">');
          var $type = $('<span class="complexity-type">').html(prop + ': ');
          var $value = $('<span class="complexity-value">').html('' + value[prop]);

          $wrapper.append($type).append($value);

          $ul.append($('<li>').append($wrapper));
        });
      })();
    }
  });
};

},{}],22:[function(require,module,exports){
'use strict';

// click the first algorithm in the first category

module.exports = function () {
  $('#list button.category').first().click();
  $('#list button.category + .indent').first().click();
};

},{}],23:[function(require,module,exports){
'use strict';

var Server = require('../server');
var showAlgorithm = require('./show_algorithm');

module.exports = function (category, algorithm, file) {
  $('.category[data-category="' + category + '"]').click();
  Server.loadAlgorithm(category, algorithm).then(function (data) {
    showAlgorithm(category, algorithm, data, file);
  });
};

},{"../server":55,"./show_algorithm":20}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
'use strict';

var flowControlBtns = [$('#btn_pause'), $('#btn_prev'), $('#btn_next')];
var setFlowControlState = function setFlowControlState(isDisabled) {
  flowControlBtns.forEach(function ($btn) {
    return $btn.attr('disabled', isDisabled);
  });
};

var enableFlowControl = function enableFlowControl() {
  setFlowControlState(false);
};

var disableFlowControl = function disableFlowControl() {
  setFlowControlState(true);
};

var resetTopMenuButtons = function resetTopMenuButtons() {
  $('.top-menu-buttons button').removeClass('active');
  disableFlowControl();
};

var setInterval = function setInterval(val) {
  $('#interval').val(interval);
};

var activateBtnPause = function activateBtnPause() {
  $('#btn_pause').addClass('active');
};

var deactivateBtnPause = function deactivateBtnPause() {
  $('#btn_pause').removeClass('active');
};

module.exports = {
  enableFlowControl: enableFlowControl,
  disableFlowControl: disableFlowControl,
  resetTopMenuButtons: resetTopMenuButtons,
  setInterval: setInterval,
  activateBtnPause: activateBtnPause,
  deactivateBtnPause: deactivateBtnPause
};

},{}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
'use strict';

var app = require('../app');
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
    var lastFileUsed = app.getLastFileUsed();
    if (lastFileUsed) {
      app.updateCachedFile(lastFileUsed, {
        data: data
      });
    }
    Executor.executeData(tracerManager, data);
  });

  this.codeEditor.on('change', function () {
    var code = _this.codeEditor.getValue();
    var lastFileUsed = app.getLastFileUsed();
    if (lastFileUsed) {
      app.updateCachedFile(lastFileUsed, {
        code: code
      });
    }
  });
};

module.exports = Editor;

},{"../app":3,"./create":26,"./executor":27}],29:[function(require,module,exports){
'use strict';

var RSVP = require('rsvp');
var app = require('./app');
var AppConstructor = require('./app/constructor');
var DOM = require('./dom');
var Server = require('./server');

var modules = require('./module');

var _$ = $;
var extend = _$.extend;


$.ajaxSetup({
  cache: false,
  dataType: 'text'
});

var _require = require('./utils');

var isScratchPaper = _require.isScratchPaper;

var _require2 = require('./server/helpers');

var getPath = _require2.getPath;

// set global promise error handler

RSVP.on('error', function (reason) {
  console.assert(false, reason);
});

$(function () {

  // initialize the application and attach in to the instance module
  var appConstructor = new AppConstructor();
  extend(true, app, appConstructor);

  // load modules to the global scope so they can be evaled
  extend(true, window, modules);

  Server.loadCategories().then(function (data) {
    app.setCategories(data);
    DOM.addCategories();

    // determine if the app is loading a pre-existing scratch-pad
    // or the home page

    var _getPath = getPath();

    var category = _getPath.category;
    var algorithm = _getPath.algorithm;
    var file = _getPath.file;

    if (isScratchPaper(category)) {
      if (algorithm) {
        Server.loadScratchPaper(algorithm).then(function (_ref) {
          var category = _ref.category;
          var algorithm = _ref.algorithm;
          var data = _ref.data;

          DOM.showAlgorithm(category, algorithm, data);
        });
      } else {
        Server.loadAlgorithm(category).then(function (data) {
          DOM.showAlgorithm(category, null, data);
        });
      }
    } else if (category && algorithm) {
      DOM.showRequestedAlgorithm(category, algorithm, file);
    } else {
      DOM.showFirstAlgorithm();
    }
  });
});

},{"./app":3,"./app/constructor":2,"./dom":6,"./module":38,"./server":55,"./server/helpers":54,"./utils":67,"rsvp":69}],30:[function(require,module,exports){
'use strict';

var Array2D = require('./array2d');

var random = function random(N, min, max) {
  return Array2D.random(1, N, min, max)[0];
};

var randomSorted = function randomSorted(N, min, max) {
  return Array2D.randomSorted(1, N, min, max)[0];
};

module.exports = {
  random: random,
  randomSorted: randomSorted
};

},{"./array2d":31}],31:[function(require,module,exports){
"use strict";

var random = function random(N, M, min, max) {
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
};

var randomSorted = function randomSorted(N, M, min, max) {
  return random(N, M, min, max).map(function (arr) {
    return arr.sort(function (a, b) {
      return a - b;
    });
  });
};

module.exports = {
  random: random,
  randomSorted: randomSorted
};

},{}],32:[function(require,module,exports){
"use strict";

var random = function random(N, min, max) {
  if (!N) N = 7;
  if (!min) min = 1;
  if (!max) max = 10;
  var C = new Array(N);
  for (var i = 0; i < N; i++) {
    C[i] = new Array(2);
  }for (var i = 0; i < N; i++) {
    for (var j = 0; j < C[i].length; j++) {
      C[i][j] = (Math.random() * (max - min + 1) | 0) + min;
    }
  }return C;
};

module.exports = {
  random: random
};

},{}],33:[function(require,module,exports){
"use strict";

var random = function random(N, ratio) {
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
};

module.exports = {
  random: random
};

},{}],34:[function(require,module,exports){
'use strict';

var Array1D = require('./array1d');
var Array2D = require('./array2d');
var CoordinateSystem = require('./coordinate_system');
var DirectedGraph = require('./directed_graph');
var UndirectedGraph = require('./undirected_graph');
var WeightedDirectedGraph = require('./weighted_directed_graph');
var WeightedUndirectedGraph = require('./weighted_undirected_graph');

module.exports = {
  Array1D: Array1D,
  Array2D: Array2D,
  CoordinateSystem: CoordinateSystem,
  DirectedGraph: DirectedGraph,
  UndirectedGraph: UndirectedGraph,
  WeightedDirectedGraph: WeightedDirectedGraph,
  WeightedUndirectedGraph: WeightedUndirectedGraph
};

},{"./array1d":30,"./array2d":31,"./coordinate_system":32,"./directed_graph":33,"./undirected_graph":35,"./weighted_directed_graph":36,"./weighted_undirected_graph":37}],35:[function(require,module,exports){
"use strict";

var random = function random(N, ratio) {
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
};

module.exports = {
  random: random
};

},{}],36:[function(require,module,exports){
"use strict";

var random = function random(N, ratio, min, max) {
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
};

module.exports = {
  random: random
};

},{}],37:[function(require,module,exports){
"use strict";

var random = function random(N, ratio, min, max) {
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
};

module.exports = {
  random: random
};

},{}],38:[function(require,module,exports){
'use strict';

var tracers = require('./tracer');
var datas = require('./data');

var _$ = $;
var extend = _$.extend;


module.exports = extend(true, {}, tracers, datas);

},{"./data":34,"./tracer":44}],39:[function(require,module,exports){
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Array2DTracer = require('./array2d');

var Array1DTracer = function (_Array2DTracer) {
  _inherits(Array1DTracer, _Array2DTracer);

  _createClass(Array1DTracer, null, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'Array1DTracer';
    }
  }]);

  function Array1DTracer(name) {
    _classCallCheck(this, Array1DTracer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Array1DTracer).call(this, name));
  }

  _createClass(Array1DTracer, [{
    key: '_notify',
    value: function _notify(idx, v) {
      _get(Object.getPrototypeOf(Array1DTracer.prototype), '_notify', this).call(this, 0, idx, v);
      return this;
    }
  }, {
    key: '_denotify',
    value: function _denotify(idx) {
      _get(Object.getPrototypeOf(Array1DTracer.prototype), '_denotify', this).call(this, 0, idx);
      return this;
    }
  }, {
    key: '_select',
    value: function _select(s, e) {
      if (e === undefined) {
        _get(Object.getPrototypeOf(Array1DTracer.prototype), '_select', this).call(this, 0, s);
      } else {
        _get(Object.getPrototypeOf(Array1DTracer.prototype), '_selectRow', this).call(this, 0, s, e);
      }
      return this;
    }
  }, {
    key: '_deselect',
    value: function _deselect(s, e) {
      if (e === undefined) {
        _get(Object.getPrototypeOf(Array1DTracer.prototype), '_deselect', this).call(this, 0, s);
      } else {
        _get(Object.getPrototypeOf(Array1DTracer.prototype), '_deselectRow', this).call(this, 0, s, e);
      }
      return this;
    }
  }, {
    key: 'setData',
    value: function setData(D) {
      return _get(Object.getPrototypeOf(Array1DTracer.prototype), 'setData', this).call(this, [D]);
    }
  }]);

  return Array1DTracer;
}(Array2DTracer);

module.exports = Array1DTracer;

},{"./array2d":40}],40:[function(require,module,exports){
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tracer = require('./tracer');

var _require = require('../../tracer_manager/util/index');

var refineByType = _require.refineByType;

var Array2DTracer = function (_Tracer) {
  _inherits(Array2DTracer, _Tracer);

  _createClass(Array2DTracer, null, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'Array2DTracer';
    }
  }]);

  function Array2DTracer(name) {
    _classCallCheck(this, Array2DTracer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Array2DTracer).call(this, name));

    _this.colorClass = {
      selected: 'selected',
      notified: 'notified'
    };

    if (_this.isNew) initView(_this);
    return _this;
  }

  _createClass(Array2DTracer, [{
    key: '_notify',
    value: function _notify(x, y, v) {
      this.manager.pushStep(this.capsule, {
        type: 'notify',
        x: x,
        y: y,
        v: v
      });
      return this;
    }
  }, {
    key: '_denotify',
    value: function _denotify(x, y) {
      this.manager.pushStep(this.capsule, {
        type: 'denotify',
        x: x,
        y: y
      });
      return this;
    }
  }, {
    key: '_select',
    value: function _select(sx, sy, ex, ey) {
      this.pushSelectingStep('select', null, arguments);
      return this;
    }
  }, {
    key: '_selectRow',
    value: function _selectRow(x, sy, ey) {
      this.pushSelectingStep('select', 'row', arguments);
      return this;
    }
  }, {
    key: '_selectCol',
    value: function _selectCol(y, sx, ex) {
      this.pushSelectingStep('select', 'col', arguments);
      return this;
    }
  }, {
    key: '_deselect',
    value: function _deselect(sx, sy, ex, ey) {
      this.pushSelectingStep('deselect', null, arguments);
      return this;
    }
  }, {
    key: '_deselectRow',
    value: function _deselectRow(x, sy, ey) {
      this.pushSelectingStep('deselect', 'row', arguments);
      return this;
    }
  }, {
    key: '_deselectCol',
    value: function _deselectCol(y, sx, ex) {
      this.pushSelectingStep('deselect', 'col', arguments);
      return this;
    }
  }, {
    key: '_separate',
    value: function _separate(x, y) {
      this.manager.pushStep(this.capsule, {
        type: 'separate',
        x: x,
        y: y
      });
      return this;
    }
  }, {
    key: '_separateRow',
    value: function _separateRow(x) {
      this._separate(x, -1);
      return this;
    }
  }, {
    key: '_separateCol',
    value: function _separateCol(y) {
      this._separate(-1, y);
      return this;
    }
  }, {
    key: '_deseparate',
    value: function _deseparate(x, y) {
      this.manager.pushStep(this.capsule, {
        type: 'deseparate',
        x: x,
        y: y
      });
      return this;
    }
  }, {
    key: '_deseparateRow',
    value: function _deseparateRow(x) {
      this._deseparate(x, -1);
      return this;
    }
  }, {
    key: '_deseparateCol',
    value: function _deseparateCol(y) {
      this._deseparate(-1, y);
      return this;
    }
  }, {
    key: 'pushSelectingStep',
    value: function pushSelectingStep() {
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
    }
  }, {
    key: 'processStep',
    value: function processStep(step, options) {
      switch (step.type) {
        case 'notify':
          if (step.v !== undefined) {
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
          _get(Object.getPrototypeOf(Array2DTracer.prototype), 'processStep', this).call(this, step, options);
      }
    }
  }, {
    key: 'setData',
    value: function setData(D) {
      this.viewX = this.viewY = 0;
      this.paddingH = 6;
      this.paddingV = 3;
      this.fontSize = 16;

      if (_get(Object.getPrototypeOf(Array2DTracer.prototype), 'setData', this).apply(this, arguments)) {
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
    }
  }, {
    key: 'resize',
    value: function resize() {
      _get(Object.getPrototypeOf(Array2DTracer.prototype), 'resize', this).call(this);

      this.refresh();
    }
  }, {
    key: 'clear',
    value: function clear() {
      _get(Object.getPrototypeOf(Array2DTracer.prototype), 'clear', this).call(this);

      this.clearColor();
      this.deseparateAll();
    }
  }, {
    key: 'getCellCss',
    value: function getCellCss() {
      return {
        padding: this.paddingV.toFixed(1) + 'px ' + this.paddingH.toFixed(1) + 'px',
        'font-size': this.fontSize.toFixed(1) + 'px'
      };
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      _get(Object.getPrototypeOf(Array2DTracer.prototype), 'refresh', this).call(this);

      var $parent = this.$table.parent();
      var top = $parent.height() / 2 - this.$table.height() / 2 + this.viewY;
      var left = $parent.width() / 2 - this.$table.width() / 2 + this.viewX;
      this.$table.css('margin-top', top);
      this.$table.css('margin-left', left);
    }
  }, {
    key: 'mousedown',
    value: function mousedown(e) {
      _get(Object.getPrototypeOf(Array2DTracer.prototype), 'mousedown', this).call(this, e);

      this.dragX = e.pageX;
      this.dragY = e.pageY;
      this.dragging = true;
    }
  }, {
    key: 'mousemove',
    value: function mousemove(e) {
      _get(Object.getPrototypeOf(Array2DTracer.prototype), 'mousemove', this).call(this, e);

      if (this.dragging) {
        this.viewX += e.pageX - this.dragX;
        this.viewY += e.pageY - this.dragY;
        this.dragX = e.pageX;
        this.dragY = e.pageY;
        this.refresh();
      }
    }
  }, {
    key: 'mouseup',
    value: function mouseup(e) {
      _get(Object.getPrototypeOf(Array2DTracer.prototype), 'mouseup', this).call(this, e);

      this.dragging = false;
    }
  }, {
    key: 'mousewheel',
    value: function mousewheel(e) {
      _get(Object.getPrototypeOf(Array2DTracer.prototype), 'mousewheel', this).call(this, e);

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
    }
  }, {
    key: 'paintColor',
    value: function paintColor(sx, sy, ex, ey, colorClass, addClass) {
      for (var i = sx; i <= ex; i++) {
        var $row = this.$table.find('.mtbl-row').eq(i);
        for (var j = sy; j <= ey; j++) {
          var $col = $row.find('.mtbl-col').eq(j);
          if (addClass) $col.addClass(colorClass);else $col.removeClass(colorClass);
        }
      }
    }
  }, {
    key: 'clearColor',
    value: function clearColor() {
      this.$table.find('.mtbl-col').removeClass(Object.keys(this.colorClass).join(' '));
    }
  }, {
    key: 'separate',
    value: function separate(x, y) {
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
    }
  }, {
    key: 'deseparate',
    value: function deseparate(x, y) {
      this.$table.find('[data-row=' + x + ']').remove();
      this.$table.find('[data-col=' + y + ']').remove();
    }
  }, {
    key: 'deseparateAll',
    value: function deseparateAll() {
      this.$table.find('.mtbl-empty-row, .mtbl-empty-col').remove();
    }
  }]);

  return Array2DTracer;
}(Tracer);

var initView = function initView(tracer) {
  tracer.$table = tracer.capsule.$table = $('<div class="mtbl-table">');
  tracer.$container.append(tracer.$table);
};

module.exports = Array2DTracer;

},{"../../tracer_manager/util/index":64,"./tracer":46}],41:[function(require,module,exports){
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tracer = require('./tracer');

var ChartTracer = function (_Tracer) {
  _inherits(ChartTracer, _Tracer);

  _createClass(ChartTracer, null, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'ChartTracer';
    }
  }]);

  function ChartTracer(name) {
    _classCallCheck(this, ChartTracer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ChartTracer).call(this, name));

    _this.color = {
      selected: 'rgba(255, 0, 0, 1)',
      notified: 'rgba(0, 0, 255, 1)',
      default: 'rgba(136, 136, 136, 1)'
    };

    if (_this.isNew) initView(_this);
    return _this;
  }

  _createClass(ChartTracer, [{
    key: 'setData',
    value: function setData(C) {
      if (_get(Object.getPrototypeOf(ChartTracer.prototype), 'setData', this).apply(this, arguments)) return true;

      var color = [];
      for (var i = 0; i < C.length; i++) {
        color.push(this.color.default);
      }this.chart.config.data = {
        labels: C.map(String),
        datasets: [{
          backgroundColor: color,
          data: C
        }]
      };
      this.chart.update();
    }
  }, {
    key: '_notify',
    value: function _notify(s, v) {
      this.manager.pushStep(this.capsule, {
        type: 'notify',
        s: s,
        v: v
      });
      return this;
    }
  }, {
    key: '_denotify',
    value: function _denotify(s) {
      this.manager.pushStep(this.capsule, {
        type: 'denotify',
        s: s
      });
      return this;
    }
  }, {
    key: '_select',
    value: function _select(s, e) {
      this.manager.pushStep(this.capsule, {
        type: 'select',
        s: s,
        e: e
      });
      return this;
    }
  }, {
    key: '_deselect',
    value: function _deselect(s, e) {
      this.manager.pushStep(this.capsule, {
        type: 'deselect',
        s: s,
        e: e
      });
      return this;
    }
  }, {
    key: 'processStep',
    value: function processStep(step, options) {
      switch (step.type) {
        case 'notify':
          if (step.v !== undefined) {
            this.chart.config.data.datasets[0].data[step.s] = step.v;
            this.chart.config.data.labels[step.s] = step.v.toString();
          }
        case 'denotify':
        case 'deselect':
        case 'select':
          var color = step.type == 'notify' ? this.color.notified : step.type == 'select' ? this.color.selected : this.color.default;
          if (step.e !== undefined) for (var i = step.s; i <= step.e; i++) {
            this.chart.config.data.datasets[0].backgroundColor[i] = color;
          } else this.chart.config.data.datasets[0].backgroundColor[step.s] = color;
          this.chart.update();
          break;
        default:
          _get(Object.getPrototypeOf(ChartTracer.prototype), 'processStep', this).call(this, step, options);
      }
    }
  }, {
    key: 'resize',
    value: function resize() {
      _get(Object.getPrototypeOf(ChartTracer.prototype), 'resize', this).call(this);

      this.chart.resize();
    }
  }, {
    key: 'clear',
    value: function clear() {
      _get(Object.getPrototypeOf(ChartTracer.prototype), 'clear', this).call(this);

      var data = this.chart.config.data;
      if (data.datasets.length) {
        var backgroundColor = data.datasets[0].backgroundColor;
        for (var i = 0; i < backgroundColor.length; i++) {
          backgroundColor[i] = this.color.default;
        }
        this.chart.update();
      }
    }
  }]);

  return ChartTracer;
}(Tracer);

var initView = function initView(tracer) {
  tracer.$wrapper = tracer.capsule.$wrapper = $('<canvas class="mchrt-chart">');
  tracer.$container.append(tracer.$wrapper);
  tracer.chart = tracer.capsule.chart = new Chart(tracer.$wrapper, {
    type: 'bar',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      animation: false,
      legend: false,
      responsive: true,
      maintainAspectRatio: false
    }
  });
};

module.exports = ChartTracer;

},{"./tracer":46}],42:[function(require,module,exports){
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DirectedGraphTracer = require('./directed_graph');

var CoordinateSystemTracer = function (_DirectedGraphTracer) {
  _inherits(CoordinateSystemTracer, _DirectedGraphTracer);

  _createClass(CoordinateSystemTracer, null, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'CoordinateSystemTracer';
    }
  }]);

  function CoordinateSystemTracer(name) {
    _classCallCheck(this, CoordinateSystemTracer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CoordinateSystemTracer).call(this, name));

    if (_this.isNew) initView(_this);
    return _this;
  }

  _createClass(CoordinateSystemTracer, [{
    key: 'setData',
    value: function setData(C) {
      if (Tracer.prototype.setData.apply(this, arguments)) return true;

      this.graph.clear();
      var nodes = [];
      var edges = [];
      for (var i = 0; i < C.length; i++) {
        nodes.push({
          id: this.n(i),
          x: C[i][0],
          y: C[i][1],
          label: '' + i,
          size: 1,
          color: this.color.default
        });
      }this.graph.read({
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
    }
  }, {
    key: 'processStep',
    value: function processStep(step, options) {
      switch (step.type) {
        case 'visit':
        case 'leave':
          var visit = step.type == 'visit';
          var targetNode = this.graph.nodes(this.n(step.target));
          var color = visit ? this.color.visited : this.color.left;
          targetNode.color = color;
          if (step.source !== undefined) {
            var edgeId = this.e(step.source, step.target);
            if (this.graph.edges(edgeId)) {
              var edge = this.graph.edges(edgeId);
              edge.color = color;
              this.graph.dropEdge(edgeId).addEdge(edge);
            } else {
              this.graph.addEdge({
                id: this.e(step.target, step.source),
                source: this.n(step.source),
                target: this.n(step.target),
                color: color,
                size: 1
              });
            }
          }
          if (this.logTracer) {
            var source = step.source;
            if (source === undefined) source = '';
            this.logTracer.print(visit ? source + ' -> ' + step.target : source + ' <- ' + step.target);
          }
          break;
        default:
          _get(Object.getPrototypeOf(CoordinateSystemTracer.prototype), 'processStep', this).call(this, step, options);
      }
    }
  }, {
    key: 'e',
    value: function e(v1, v2) {
      if (v1 > v2) {
        var temp = v1;
        v1 = v2;
        v2 = temp;
      }
      return 'e' + v1 + '_' + v2;
    }
  }, {
    key: 'drawOnHover',
    value: function drawOnHover(node, context, settings, next) {
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
    }
  }, {
    key: 'drawEdge',
    value: function drawEdge(edge, source, target, color, context, settings) {
      var prefix = settings('prefix') || '',
          size = edge[prefix + 'size'] || 1;

      context.strokeStyle = color;
      context.lineWidth = size;
      context.beginPath();
      context.moveTo(source[prefix + 'x'], source[prefix + 'y']);
      context.lineTo(target[prefix + 'x'], target[prefix + 'y']);
      context.stroke();
    }
  }]);

  return CoordinateSystemTracer;
}(DirectedGraphTracer);

var initView = function initView(tracer) {
  tracer.s.settings({
    defaultEdgeType: 'def',
    funcEdgesDef: function funcEdgesDef(edge, source, target, context, settings) {
      var color = tracer.getColor(edge, source, target, settings);
      tracer.drawEdge(edge, source, target, color, context, settings);
    }
  });
};

module.exports = CoordinateSystemTracer;

},{"./directed_graph":43}],43:[function(require,module,exports){
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tracer = require('./tracer');

var _require = require('../../tracer_manager/util/index');

var refineByType = _require.refineByType;

var DirectedGraphTracer = function (_Tracer) {
  _inherits(DirectedGraphTracer, _Tracer);

  _createClass(DirectedGraphTracer, null, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'DirectedGraphTracer';
    }
  }]);

  function DirectedGraphTracer(name) {
    _classCallCheck(this, DirectedGraphTracer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DirectedGraphTracer).call(this, name));

    _this.color = {
      selected: '#0f0',
      visited: '#f00',
      left: '#000',
      default: '#888'
    };

    if (_this.isNew) initView(_this);
    return _this;
  }

  _createClass(DirectedGraphTracer, [{
    key: '_setTreeData',
    value: function _setTreeData(G, root) {
      this.manager.pushStep(this.capsule, {
        type: 'setTreeData',
        arguments: arguments
      });
      return this;
    }
  }, {
    key: '_visit',
    value: function _visit(target, source) {
      this.manager.pushStep(this.capsule, {
        type: 'visit',
        target: target,
        source: source
      });
      return this;
    }
  }, {
    key: '_leave',
    value: function _leave(target, source) {
      this.manager.pushStep(this.capsule, {
        type: 'leave',
        target: target,
        source: source
      });
      return this;
    }
  }, {
    key: 'processStep',
    value: function processStep(step, options) {
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
          _get(Object.getPrototypeOf(DirectedGraphTracer.prototype), 'processStep', this).call(this, step, options);
      }
    }
  }, {
    key: 'setTreeData',
    value: function setTreeData(G, root, undirected) {
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

      if (this.setData(G, undirected)) return true;

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
    }
  }, {
    key: 'setData',
    value: function setData(G, undirected) {
      if (_get(Object.getPrototypeOf(DirectedGraphTracer.prototype), 'setData', this).apply(this, arguments)) return true;

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

        if (undirected) {
          for (var j = 0; j <= i; j++) {
            var value = G[i][j] || G[j][i];
            if (value) {
              edges.push({
                id: this.e(i, j),
                source: this.n(i),
                target: this.n(j),
                color: this.color.default,
                size: 1,
                weight: refineByType(value)
              });
            }
          }
        } else {
          for (var _j = 0; _j < G[i].length; _j++) {
            if (G[i][_j]) {
              edges.push({
                id: this.e(i, _j),
                source: this.n(i),
                target: this.n(_j),
                color: this.color.default,
                size: 1,
                weight: refineByType(G[i][_j])
              });
            }
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
    }
  }, {
    key: 'resize',
    value: function resize() {
      _get(Object.getPrototypeOf(DirectedGraphTracer.prototype), 'resize', this).call(this);

      this.s.renderers[0].resize();
      this.refresh();
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      _get(Object.getPrototypeOf(DirectedGraphTracer.prototype), 'refresh', this).call(this);

      this.s.refresh();
    }
  }, {
    key: 'clear',
    value: function clear() {
      _get(Object.getPrototypeOf(DirectedGraphTracer.prototype), 'clear', this).call(this);

      this.clearGraphColor();
    }
  }, {
    key: 'clearGraphColor',
    value: function clearGraphColor() {
      var tracer = this;

      this.graph.nodes().forEach(function (node) {
        node.color = tracer.color.default;
      });
      this.graph.edges().forEach(function (edge) {
        edge.color = tracer.color.default;
      });
    }
  }, {
    key: 'n',
    value: function n(v) {
      return 'n' + v;
    }
  }, {
    key: 'e',
    value: function e(v1, v2) {
      return 'e' + v1 + '_' + v2;
    }
  }, {
    key: 'getColor',
    value: function getColor(edge, source, target, settings) {
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
    }
  }, {
    key: 'drawLabel',
    value: function drawLabel(node, context, settings) {
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
    }
  }, {
    key: 'drawArrow',
    value: function drawArrow(edge, source, target, color, context, settings) {
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
    }
  }, {
    key: 'drawOnHover',
    value: function drawOnHover(node, context, settings, next) {
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
  }]);

  return DirectedGraphTracer;
}(Tracer);

var initView = function initView(tracer) {
  tracer.s = tracer.capsule.s = new sigma({
    renderer: {
      container: tracer.$container[0],
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
  sigma.plugins.dragNodes(tracer.s, tracer.s.renderers[0]);
  tracer.graph = tracer.capsule.graph = tracer.s.graph;
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

module.exports = DirectedGraphTracer;

},{"../../tracer_manager/util/index":64,"./tracer":46}],44:[function(require,module,exports){
'use strict';

var Tracer = require('./tracer');
var LogTracer = require('./log');
var Array1DTracer = require('./array1d');
var Array2DTracer = require('./array2d');
var ChartTracer = require('./chart');
var CoordinateSystemTracer = require('./coordinate_system');
var DirectedGraphTracer = require('./directed_graph');
var UndirectedGraphTracer = require('./undirected_graph');
var WeightedDirectedGraphTracer = require('./weighted_directed_graph');
var WeightedUndirectedGraphTracer = require('./weighted_undirected_graph');

module.exports = {
  Tracer: Tracer,
  LogTracer: LogTracer,
  Array1DTracer: Array1DTracer,
  Array2DTracer: Array2DTracer,
  ChartTracer: ChartTracer,
  CoordinateSystemTracer: CoordinateSystemTracer,
  DirectedGraphTracer: DirectedGraphTracer,
  UndirectedGraphTracer: UndirectedGraphTracer,
  WeightedDirectedGraphTracer: WeightedDirectedGraphTracer,
  WeightedUndirectedGraphTracer: WeightedUndirectedGraphTracer
};

},{"./array1d":39,"./array2d":40,"./chart":41,"./coordinate_system":42,"./directed_graph":43,"./log":45,"./tracer":46,"./undirected_graph":47,"./weighted_directed_graph":48,"./weighted_undirected_graph":49}],45:[function(require,module,exports){
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tracer = require('./tracer');

var LogTracer = function (_Tracer) {
  _inherits(LogTracer, _Tracer);

  _createClass(LogTracer, null, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'LogTracer';
    }
  }]);

  function LogTracer(name) {
    _classCallCheck(this, LogTracer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LogTracer).call(this, name));

    if (_this.isNew) initView(_this);
    return _this;
  }

  _createClass(LogTracer, [{
    key: '_print',
    value: function _print(msg) {
      this.manager.pushStep(this.capsule, {
        type: 'print',
        msg: msg
      });
      return this;
    }
  }, {
    key: 'processStep',
    value: function processStep(step, options) {
      switch (step.type) {
        case 'print':
          this.print(step.msg);
          break;
      }
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      this.scrollToEnd(Math.min(50, this.interval));
    }
  }, {
    key: 'clear',
    value: function clear() {
      _get(Object.getPrototypeOf(LogTracer.prototype), 'clear', this).call(this);

      this.$wrapper.empty();
    }
  }, {
    key: 'print',
    value: function print(message) {
      this.$wrapper.append($('<span>').append(message + '<br/>'));
    }
  }, {
    key: 'scrollToEnd',
    value: function scrollToEnd(duration) {
      this.$container.animate({
        scrollTop: this.$container[0].scrollHeight
      }, duration);
    }
  }]);

  return LogTracer;
}(Tracer);

var initView = function initView(tracer) {
  tracer.$wrapper = tracer.capsule.$wrapper = $('<div class="wrapper">');
  tracer.$container.append(tracer.$wrapper);
};

module.exports = LogTracer;

},{"./tracer":46}],46:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var app = require('../../app');

var _require = require('../../tracer_manager/util/index');

var toJSON = _require.toJSON;
var fromJSON = _require.fromJSON;

var Tracer = function () {
  _createClass(Tracer, null, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'Tracer';
    }
  }]);

  function Tracer(name) {
    _classCallCheck(this, Tracer);

    this.module = this.constructor;

    this.manager = app.getTracerManager();
    this.capsule = this.manager.allocate(this);
    $.extend(this, this.capsule);

    this.setName(name);
  }

  _createClass(Tracer, [{
    key: '_setData',
    value: function _setData() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this.manager.pushStep(this.capsule, {
        type: 'setData',
        args: toJSON(args)
      });
      return this;
    }
  }, {
    key: '_clear',
    value: function _clear() {
      this.manager.pushStep(this.capsule, {
        type: 'clear'
      });
      return this;
    }
  }, {
    key: '_wait',
    value: function _wait() {
      this.manager.newStep();
      return this;
    }
  }, {
    key: 'processStep',
    value: function processStep(step, options) {
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
    }
  }, {
    key: 'setName',
    value: function setName(name) {
      var $name = void 0;
      if (this.isNew) {
        $name = $('<span class="name">');
        this.$container.append($name);
      } else {
        $name = this.$container.find('span.name');
      }
      $name.text(name || this.defaultName);
    }
  }, {
    key: 'setData',
    value: function setData() {
      var data = toJSON(arguments);
      if (!this.isNew && this.lastData === data) {
        return true;
      }
      this.lastData = this.capsule.lastData = data;
      return false;
    }
  }, {
    key: 'resize',
    value: function resize() {}
  }, {
    key: 'refresh',
    value: function refresh() {}
  }, {
    key: 'clear',
    value: function clear() {}
  }, {
    key: 'attach',
    value: function attach(tracer) {
      if (tracer.module === LogTracer) {
        this.logTracer = tracer;
      }
      return this;
    }
  }, {
    key: 'mousedown',
    value: function mousedown(e) {}
  }, {
    key: 'mousemove',
    value: function mousemove(e) {}
  }, {
    key: 'mouseup',
    value: function mouseup(e) {}
  }, {
    key: 'mousewheel',
    value: function mousewheel(e) {}
  }]);

  return Tracer;
}();

module.exports = Tracer;

},{"../../app":3,"../../tracer_manager/util/index":64}],47:[function(require,module,exports){
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DirectedGraphTracer = require('./directed_graph');

var UndirectedGraphTracer = function (_DirectedGraphTracer) {
  _inherits(UndirectedGraphTracer, _DirectedGraphTracer);

  _createClass(UndirectedGraphTracer, null, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'UndirectedGraphTracer';
    }
  }]);

  function UndirectedGraphTracer(name) {
    _classCallCheck(this, UndirectedGraphTracer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(UndirectedGraphTracer).call(this, name));

    if (_this.isNew) initView(_this);
    return _this;
  }

  _createClass(UndirectedGraphTracer, [{
    key: 'setTreeData',
    value: function setTreeData(G, root) {
      return _get(Object.getPrototypeOf(UndirectedGraphTracer.prototype), 'setTreeData', this).call(this, G, root, true);
    }
  }, {
    key: 'setData',
    value: function setData(G) {
      return _get(Object.getPrototypeOf(UndirectedGraphTracer.prototype), 'setData', this).call(this, G, true);
    }
  }, {
    key: 'e',
    value: function e(v1, v2) {
      if (v1 > v2) {
        var temp = v1;
        v1 = v2;
        v2 = temp;
      }
      return 'e' + v1 + '_' + v2;
    }
  }, {
    key: 'drawOnHover',
    value: function drawOnHover(node, context, settings, next) {
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
    }
  }, {
    key: 'drawEdge',
    value: function drawEdge(edge, source, target, color, context, settings) {
      var prefix = settings('prefix') || '',
          size = edge[prefix + 'size'] || 1;

      context.strokeStyle = color;
      context.lineWidth = size;
      context.beginPath();
      context.moveTo(source[prefix + 'x'], source[prefix + 'y']);
      context.lineTo(target[prefix + 'x'], target[prefix + 'y']);
      context.stroke();
    }
  }]);

  return UndirectedGraphTracer;
}(DirectedGraphTracer);

var initView = function initView(tracer) {
  tracer.s.settings({
    defaultEdgeType: 'def',
    funcEdgesDef: function funcEdgesDef(edge, source, target, context, settings) {
      var color = tracer.getColor(edge, source, target, settings);
      tracer.drawEdge(edge, source, target, color, context, settings);
    }
  });
};

module.exports = UndirectedGraphTracer;

},{"./directed_graph":43}],48:[function(require,module,exports){
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DirectedGraphTracer = require('./directed_graph');

var _require = require('../../tracer_manager/util/index');

var refineByType = _require.refineByType;

var WeightedDirectedGraphTracer = function (_DirectedGraphTracer) {
  _inherits(WeightedDirectedGraphTracer, _DirectedGraphTracer);

  _createClass(WeightedDirectedGraphTracer, null, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'WeightedDirectedGraphTracer';
    }
  }]);

  function WeightedDirectedGraphTracer(name) {
    _classCallCheck(this, WeightedDirectedGraphTracer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WeightedDirectedGraphTracer).call(this, name));

    if (_this.isNew) initView(_this);
    return _this;
  }

  _createClass(WeightedDirectedGraphTracer, [{
    key: '_weight',
    value: function _weight(target, weight) {
      this.manager.pushStep(this.capsule, {
        type: 'weight',
        target: target,
        weight: weight
      });
      return this;
    }
  }, {
    key: '_visit',
    value: function _visit(target, source, weight) {
      this.manager.pushStep(this.capsule, {
        type: 'visit',
        target: target,
        source: source,
        weight: weight
      });
      return this;
    }
  }, {
    key: '_leave',
    value: function _leave(target, source, weight) {
      this.manager.pushStep(this.capsule, {
        type: 'leave',
        target: target,
        source: source,
        weight: weight
      });
      return this;
    }
  }, {
    key: 'processStep',
    value: function processStep(step, options) {
      switch (step.type) {
        case 'weight':
          var targetNode = this.graph.nodes(this.n(step.target));
          if (step.weight !== undefined) targetNode.weight = refineByType(step.weight);
          break;
        case 'visit':
        case 'leave':
          var visit = step.type == 'visit';
          var targetNode = this.graph.nodes(this.n(step.target));
          var color = visit ? step.weight === undefined ? this.color.selected : this.color.visited : this.color.left;
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
          _get(Object.getPrototypeOf(WeightedDirectedGraphTracer.prototype), 'processStep', this).call(this, step, options);
      }
    }
  }, {
    key: 'clear',
    value: function clear() {
      _get(Object.getPrototypeOf(WeightedDirectedGraphTracer.prototype), 'clear', this).call(this);

      this.clearWeights();
    }
  }, {
    key: 'clearWeights',
    value: function clearWeights() {
      this.graph.nodes().forEach(function (node) {
        node.weight = 0;
      });
    }
  }, {
    key: 'drawEdgeWeight',
    value: function drawEdgeWeight(edge, source, target, color, context, settings) {
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
    }
  }, {
    key: 'drawNodeWeight',
    value: function drawNodeWeight(node, context, settings) {
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
  }]);

  return WeightedDirectedGraphTracer;
}(DirectedGraphTracer);

var initView = function initView(tracer) {
  tracer.s.settings({
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
};

module.exports = WeightedDirectedGraphTracer;

},{"../../tracer_manager/util/index":64,"./directed_graph":43}],49:[function(require,module,exports){
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WeightedDirectedGraphTracer = require('./weighted_directed_graph');
var UndirectedGraphTracer = require('./undirected_graph');

var WeightedUndirectedGraphTracer = function (_WeightedDirectedGrap) {
  _inherits(WeightedUndirectedGraphTracer, _WeightedDirectedGrap);

  _createClass(WeightedUndirectedGraphTracer, null, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'WeightedUndirectedGraphTracer';
    }
  }]);

  function WeightedUndirectedGraphTracer(name) {
    _classCallCheck(this, WeightedUndirectedGraphTracer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WeightedUndirectedGraphTracer).call(this, name));

    _this.e = UndirectedGraphTracer.prototype.e;
    _this.drawOnHover = UndirectedGraphTracer.prototype.drawOnHover;
    _this.drawEdge = UndirectedGraphTracer.prototype.drawEdge;

    if (_this.isNew) initView(_this);
    return _this;
  }

  _createClass(WeightedUndirectedGraphTracer, [{
    key: 'setTreeData',
    value: function setTreeData(G, root) {
      return _get(Object.getPrototypeOf(WeightedUndirectedGraphTracer.prototype), 'setTreeData', this).call(this, G, root, true);
    }
  }, {
    key: 'setData',
    value: function setData(G) {
      return _get(Object.getPrototypeOf(WeightedUndirectedGraphTracer.prototype), 'setData', this).call(this, G, true);
    }
  }, {
    key: 'drawEdgeWeight',
    value: function drawEdgeWeight(edge, source, target, color, context, settings) {
      var prefix = settings('prefix') || '';
      if (source[prefix + 'x'] > target[prefix + 'x']) {
        var temp = source;
        source = target;
        target = temp;
      }
      WeightedDirectedGraphTracer.prototype.drawEdgeWeight.call(this, edge, source, target, color, context, settings);
    }
  }]);

  return WeightedUndirectedGraphTracer;
}(WeightedDirectedGraphTracer);

var initView = function initView(tracer) {
  tracer.s.settings({
    defaultEdgeType: 'def',
    funcEdgesDef: function funcEdgesDef(edge, source, target, context, settings) {
      var color = tracer.getColor(edge, source, target, settings);
      tracer.drawEdge(edge, source, target, color, context, settings);
      tracer.drawEdgeWeight(edge, source, target, color, context, settings);
    }
  });
};

module.exports = WeightedUndirectedGraphTracer;

},{"./undirected_graph":47,"./weighted_directed_graph":48}],50:[function(require,module,exports){
'use strict';

var request = require('./request');

module.exports = function (url) {

  return request(url, {
    type: 'GET'
  });
};

},{"./request":53}],51:[function(require,module,exports){
'use strict';

var request = require('./request');

module.exports = function (url) {
  return request(url, {
    dataType: 'json',
    type: 'GET'
  });
};

},{"./request":53}],52:[function(require,module,exports){
'use strict';

var request = require('./request');

module.exports = function (url, data) {
  return request(url, {
    dataType: 'json',
    type: 'POST',
    data: JSON.stringify(data)
  });
};

},{"./request":53}],53:[function(require,module,exports){
'use strict';

var RSVP = require('rsvp');
var app = require('../../app');

var _$ = $;
var ajax = _$.ajax;
var extend = _$.extend;


var defaults = {};

module.exports = function (url) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  app.setIsLoading(true);

  return new RSVP.Promise(function (resolve, reject) {
    var callbacks = {
      success: function success(response) {
        app.setIsLoading(false);
        resolve(response);
      },
      error: function error(reason) {
        app.setIsLoading(false);
        reject(reason);
      }
    };

    var opts = extend({}, defaults, options, callbacks, {
      url: url
    });

    ajax(opts);
  });
};

},{"../../app":3,"rsvp":69}],54:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var app = require('../app');
var Toast = require('../dom/toast');

var checkLoading = function checkLoading() {
  if (app.getIsLoading()) {
    Toast.showErrorToast('Wait until it completes loading of previous file.');
    return true;
  }
  return false;
};

var getParameterByName = function getParameterByName(name) {
  var url = window.location.href;
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');

  var results = regex.exec(url);

  if (!results || results.length !== 3) {
    return null;
  }

  var _results = _slicedToArray(results, 3);

  var id = _results[2];


  return id;
};

var getHashValue = function getHashValue(key) {
  if (!key) return null;
  var hash = window.location.hash.substr(1);
  var params = hash ? hash.split('&') : [];
  for (var i = 0; i < params.length; i++) {
    var pair = params[i].split('=');
    if (pair[0] === key) {
      return pair[1];
    }
  }
  return null;
};

var setHashValue = function setHashValue(key, value) {
  if (!key || !value) return;
  var hash = window.location.hash.substr(1);
  var params = hash ? hash.split('&') : [];

  var found = false;
  for (var i = 0; i < params.length && !found; i++) {
    var pair = params[i].split('=');
    if (pair[0] === key) {
      pair[1] = value;
      params[i] = pair.join('=');
      found = true;
    }
  }
  if (!found) {
    params.push([key, value].join('='));
  }

  var newHash = params.join('&');
  window.location.hash = '#' + newHash;
};

var removeHashValue = function removeHashValue(key) {
  if (!key) return;
  var hash = window.location.hash.substr(1);
  var params = hash ? hash.split('&') : [];

  for (var i = 0; i < params.length; i++) {
    var pair = params[i].split('=');
    if (pair[0] === key) {
      params.splice(i, 1);
      break;
    }
  }

  var newHash = params.join('&');
  window.location.hash = '#' + newHash;
};

var setPath = function setPath(category, algorithm, file) {
  var path = category ? category + (algorithm ? '/' + algorithm + (file ? '/' + file : '') : '') : '';
  setHashValue('path', path);
};

var getPath = function getPath() {
  var hash = getHashValue('path');
  if (hash) {
    var _hash$split = hash.split('/');

    var _hash$split2 = _slicedToArray(_hash$split, 3);

    var category = _hash$split2[0];
    var algorithm = _hash$split2[1];
    var file = _hash$split2[2];

    return { category: category, algorithm: algorithm, file: file };
  } else {
    return false;
  }
};

module.exports = {
  checkLoading: checkLoading,
  getParameterByName: getParameterByName,
  getHashValue: getHashValue,
  setHashValue: setHashValue,
  removeHashValue: removeHashValue,
  setPath: setPath,
  getPath: getPath
};

},{"../app":3,"../dom/toast":24}],55:[function(require,module,exports){
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

},{"./load_algorithm":56,"./load_categories":57,"./load_file":58,"./load_scratch_paper":59,"./share_scratch_paper":60}],56:[function(require,module,exports){
'use strict';

var getJSON = require('./ajax/get_json');

var _require = require('../utils');

var getAlgorithmDir = _require.getAlgorithmDir;


module.exports = function (category, algorithm) {
  var dir = getAlgorithmDir(category, algorithm);
  return getJSON(dir + 'desc.json');
};

},{"../utils":67,"./ajax/get_json":51}],57:[function(require,module,exports){
'use strict';

var getJSON = require('./ajax/get_json');

module.exports = function () {
  return getJSON('./algorithm/category.json');
};

},{"./ajax/get_json":51}],58:[function(require,module,exports){
'use strict';

var RSVP = require('rsvp');

var app = require('../app');

var _require = require('../utils');

var getFileDir = _require.getFileDir;
var isScratchPaper = _require.isScratchPaper;

var _require2 = require('./helpers');

var checkLoading = _require2.checkLoading;
var setPath = _require2.setPath;


var get = require('./ajax/get');

var loadDataAndCode = function loadDataAndCode(dir) {
  return RSVP.hash({
    data: get(dir + 'data.js'),
    code: get(dir + 'code.js')
  });
};

var loadFileAndUpdateContent = function loadFileAndUpdateContent(dir) {
  app.getEditor().clearContent();

  return loadDataAndCode(dir).then(function (content) {
    app.updateCachedFile(dir, content);
    app.getEditor().setContent(content);
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
      if (isScratchPaper(category)) {
        setPath(category, app.getLoadedScratch());
      } else {
        setPath(category, algorithm, file);
      }
      $('#explanation').html(explanation);

      var dir = getFileDir(category, algorithm, file);
      app.setLastFileUsed(dir);
      var cachedFile = app.getCachedFile(dir);

      if (cachedContentExists(cachedFile)) {
        app.getEditor().setContent(cachedFile);
        resolve();
      } else {
        loadFileAndUpdateContent(dir).then(resolve, reject);
      }
    }
  });
};

},{"../app":3,"../utils":67,"./ajax/get":50,"./helpers":54,"rsvp":69}],59:[function(require,module,exports){
'use strict';

var RSVP = require('rsvp');
var app = require('../app');

var _require = require('../utils');

var getFileDir = _require.getFileDir;


var getJSON = require('./ajax/get_json');
var loadAlgorithm = require('./load_algorithm');

var extractGistCode = function extractGistCode(files, name) {
  return files[name + '.js'].content;
};

module.exports = function (gistID) {
  return new RSVP.Promise(function (resolve, reject) {
    app.setLoadedScratch(gistID);

    getJSON('https://api.github.com/gists/' + gistID).then(function (_ref) {
      var files = _ref.files;


      var category = 'scratch';
      var algorithm = gistID;

      loadAlgorithm(category, algorithm).then(function (data) {

        var algoData = extractGistCode(files, 'data');
        var algoCode = extractGistCode(files, 'code');

        // update scratch paper algo code with the loaded gist code
        var dir = getFileDir(category, algorithm, 'scratch_paper');
        app.updateCachedFile(dir, {
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

},{"../app":3,"../utils":67,"./ajax/get_json":51,"./load_algorithm":56,"rsvp":69}],60:[function(require,module,exports){
'use strict';

var RSVP = require('rsvp');
var app = require('../app');

var postJSON = require('./ajax/post_json');

var _require = require('./helpers');

var setPath = _require.setPath;


module.exports = function () {
  return new RSVP.Promise(function (resolve, reject) {
    var _app$getEditor = app.getEditor();

    var dataEditor = _app$getEditor.dataEditor;
    var codeEditor = _app$getEditor.codeEditor;


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

      app.setLoadedScratch(id);
      setPath('scratch', id);
      var _location = location;
      var href = _location.href;

      $('#algorithm').html('Shared');
      resolve(href);
    });
  });
};

},{"../app":3,"./ajax/post_json":52,"./helpers":54,"rsvp":69}],61:[function(require,module,exports){
'use strict';

var TracerManager = require('./manager');
var Tracer = require('../module/tracer/tracer');

module.exports = {
  init: function init() {
    var tm = new TracerManager();
    Tracer.prototype.manager = tm;
    return tm;
  }
};

},{"../module/tracer/tracer":46,"./manager":62}],62:[function(require,module,exports){
'use strict';

var ModuleContainer = require('../dom/module_container');
var TopMenu = require('../dom/top_menu');

var _$ = $;
var each = _$.each;
var extend = _$.extend;
var grep = _$.grep;


var stepLimit = 1e6;

var TracerManager = function TracerManager() {
  this.timer = null;
  this.pause = false;
  this.capsules = [];
  this.interval = 500;
};

TracerManager.prototype = {
  add: function add(tracer) {

    var $container = ModuleContainer.create();

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

    each(this.capsules, function (i, capsule) {
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

    var className = newTracer.module.getClassName();
    selectedCapsule.defaultName = className + ' ' + count;
    selectedCapsule.order = this.order++;
    return selectedCapsule;
  },
  deallocateAll: function deallocateAll() {
    this.order = 0;
    this.reset();
    each(this.capsules, function (i, capsule) {
      capsule.allocated = false;
    });
  },
  removeUnallocated: function removeUnallocated() {
    var changed = false;

    this.capsules = grep(this.capsules, function (capsule) {
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


    each(capsules, function (i, capsule) {
      var width = 100;
      var height = 100 / capsules.length;
      var top = height * capsule.order;

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
    TopMenu.setInterval(interval);
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
    last.push(extend(step, {
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
    TopMenu.activateBtnPause();
  },
  resumeStep: function resumeStep() {
    this.pause = false;
    this.step(this.traceIndex + 1);
    TopMenu.deactivateBtnPause();
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
      if (!tracer.nextStep(options)) {
        TopMenu.resetTopMenuButtons();
      }
    }, this.interval);
  },
  prevStep: function prevStep() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    this.command('clear');

    var finalIndex = this.traceIndex - 1;
    if (finalIndex < 0) {
      this.traceIndex = -1;
      this.command('refresh');
      return false;
    }

    for (var i = 0; i < finalIndex; i++) {
      this.step(i, extend(options, {
        virtual: true
      }));
    }

    this.step(finalIndex);
    return true;
  },
  nextStep: function nextStep() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var finalIndex = this.traceIndex + 1;
    if (finalIndex >= this.traces.length) {
      this.traceIndex = this.traces.length - 1;
      return false;
    }

    this.step(finalIndex, options);
    return true;
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
    each(this.capsules, function (i, capsule) {
      if (capsule.allocated) {
        capsule.tracer.module.prototype[functionName].apply(capsule.tracer, args);
      }
    });
  },
  findOwner: function findOwner(container) {
    var selectedCapsule = null;
    each(this.capsules, function (i, capsule) {
      if (capsule.$container[0] === container) {
        selectedCapsule = capsule;
        return false;
      }
    });
    return selectedCapsule.tracer;
  }
};

module.exports = TracerManager;

},{"../dom/module_container":8,"../dom/top_menu":25}],63:[function(require,module,exports){
'use strict';

var parse = JSON.parse;


var fromJSON = function fromJSON(obj) {
  return parse(obj, function (key, value) {
    return value === 'Infinity' ? Infinity : value;
  });
};

module.exports = fromJSON;

},{}],64:[function(require,module,exports){
'use strict';

var toJSON = require('./to_json');
var fromJSON = require('./from_json');
var refineByType = require('./refine_by_type');

module.exports = {
  toJSON: toJSON,
  fromJSON: fromJSON,
  refineByType: refineByType
};

},{"./from_json":63,"./refine_by_type":65,"./to_json":66}],65:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var refineByType = function refineByType(item) {
  switch (typeof item === 'undefined' ? 'undefined' : _typeof(item)) {
    case 'number':
      return refineNumber(item);
    case 'boolean':
      return refineBoolean(item);
    default:
      return refineString(item);
  }
};

var refineString = function refineString(str) {
  return str === '' ? ' ' : str;
};

var refineNumber = function refineNumber(num) {
  return num === Infinity ? '∞' : num;
};

var refineBoolean = function refineBoolean(bool) {
  return bool ? 'T' : 'F';
};

module.exports = refineByType;

},{}],66:[function(require,module,exports){
'use strict';

var stringify = JSON.stringify;


var toJSON = function toJSON(obj) {
  return stringify(obj, function (key, value) {
    return value === Infinity ? 'Infinity' : value;
  });
};

module.exports = toJSON;

},{}],67:[function(require,module,exports){
'use strict';

var isScratchPaper = function isScratchPaper(category, algorithm) {
  return category == 'scratch';
};

var getAlgorithmDir = function getAlgorithmDir(category, algorithm) {
  if (isScratchPaper(category)) return './algorithm/scratch_paper/';
  return './algorithm/' + category + '/' + algorithm + '/';
};

var getFileDir = function getFileDir(category, algorithm, file) {
  if (isScratchPaper(category)) return './algorithm/scratch_paper/';
  return './algorithm/' + category + '/' + algorithm + '/' + file + '/';
};

module.exports = {
  isScratchPaper: isScratchPaper,
  getAlgorithmDir: getAlgorithmDir,
  getFileDir: getFileDir
};

},{}],68:[function(require,module,exports){
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

},{}],69:[function(require,module,exports){
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

},{"_process":68}]},{},[29])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAvY2FjaGUuanMiLCJqcy9hcHAvY29uc3RydWN0b3IuanMiLCJqcy9hcHAvaW5kZXguanMiLCJqcy9kb20vYWRkX2NhdGVnb3JpZXMuanMiLCJqcy9kb20vYWRkX2ZpbGVzLmpzIiwianMvZG9tL2luZGV4LmpzIiwianMvZG9tL2xvYWRpbmdfc2xpZGVyLmpzIiwianMvZG9tL21vZHVsZV9jb250YWluZXIuanMiLCJqcy9kb20vc2V0dXAvaW5kZXguanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfZGl2aWRlcnMuanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfZG9jdW1lbnQuanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfZmlsZXNfYmFyLmpzIiwianMvZG9tL3NldHVwL3NldHVwX2ludGVydmFsLmpzIiwianMvZG9tL3NldHVwL3NldHVwX21vZHVsZV9jb250YWluZXIuanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfcG93ZXJlZF9ieS5qcyIsImpzL2RvbS9zZXR1cC9zZXR1cF9zY3JhdGNoX3BhcGVyLmpzIiwianMvZG9tL3NldHVwL3NldHVwX3NpZGVfbWVudS5qcyIsImpzL2RvbS9zZXR1cC9zZXR1cF90b3BfbWVudS5qcyIsImpzL2RvbS9zZXR1cC9zZXR1cF93aW5kb3cuanMiLCJqcy9kb20vc2hvd19hbGdvcml0aG0uanMiLCJqcy9kb20vc2hvd19kZXNjcmlwdGlvbi5qcyIsImpzL2RvbS9zaG93X2ZpcnN0X2FsZ29yaXRobS5qcyIsImpzL2RvbS9zaG93X3JlcXVlc3RlZF9hbGdvcml0aG0uanMiLCJqcy9kb20vdG9hc3QuanMiLCJqcy9kb20vdG9wX21lbnUuanMiLCJqcy9lZGl0b3IvY3JlYXRlLmpzIiwianMvZWRpdG9yL2V4ZWN1dG9yLmpzIiwianMvZWRpdG9yL2luZGV4LmpzIiwianMvaW5kZXguanMiLCJqcy9tb2R1bGUvZGF0YS9hcnJheTFkLmpzIiwianMvbW9kdWxlL2RhdGEvYXJyYXkyZC5qcyIsImpzL21vZHVsZS9kYXRhL2Nvb3JkaW5hdGVfc3lzdGVtLmpzIiwianMvbW9kdWxlL2RhdGEvZGlyZWN0ZWRfZ3JhcGguanMiLCJqcy9tb2R1bGUvZGF0YS9pbmRleC5qcyIsImpzL21vZHVsZS9kYXRhL3VuZGlyZWN0ZWRfZ3JhcGguanMiLCJqcy9tb2R1bGUvZGF0YS93ZWlnaHRlZF9kaXJlY3RlZF9ncmFwaC5qcyIsImpzL21vZHVsZS9kYXRhL3dlaWdodGVkX3VuZGlyZWN0ZWRfZ3JhcGguanMiLCJqcy9tb2R1bGUvaW5kZXguanMiLCJqcy9tb2R1bGUvdHJhY2VyL2FycmF5MWQuanMiLCJqcy9tb2R1bGUvdHJhY2VyL2FycmF5MmQuanMiLCJqcy9tb2R1bGUvdHJhY2VyL2NoYXJ0LmpzIiwianMvbW9kdWxlL3RyYWNlci9jb29yZGluYXRlX3N5c3RlbS5qcyIsImpzL21vZHVsZS90cmFjZXIvZGlyZWN0ZWRfZ3JhcGguanMiLCJqcy9tb2R1bGUvdHJhY2VyL2luZGV4LmpzIiwianMvbW9kdWxlL3RyYWNlci9sb2cuanMiLCJqcy9tb2R1bGUvdHJhY2VyL3RyYWNlci5qcyIsImpzL21vZHVsZS90cmFjZXIvdW5kaXJlY3RlZF9ncmFwaC5qcyIsImpzL21vZHVsZS90cmFjZXIvd2VpZ2h0ZWRfZGlyZWN0ZWRfZ3JhcGguanMiLCJqcy9tb2R1bGUvdHJhY2VyL3dlaWdodGVkX3VuZGlyZWN0ZWRfZ3JhcGguanMiLCJqcy9zZXJ2ZXIvYWpheC9nZXQuanMiLCJqcy9zZXJ2ZXIvYWpheC9nZXRfanNvbi5qcyIsImpzL3NlcnZlci9hamF4L3Bvc3RfanNvbi5qcyIsImpzL3NlcnZlci9hamF4L3JlcXVlc3QuanMiLCJqcy9zZXJ2ZXIvaGVscGVycy5qcyIsImpzL3NlcnZlci9pbmRleC5qcyIsImpzL3NlcnZlci9sb2FkX2FsZ29yaXRobS5qcyIsImpzL3NlcnZlci9sb2FkX2NhdGVnb3JpZXMuanMiLCJqcy9zZXJ2ZXIvbG9hZF9maWxlLmpzIiwianMvc2VydmVyL2xvYWRfc2NyYXRjaF9wYXBlci5qcyIsImpzL3NlcnZlci9zaGFyZV9zY3JhdGNoX3BhcGVyLmpzIiwianMvdHJhY2VyX21hbmFnZXIvaW5kZXguanMiLCJqcy90cmFjZXJfbWFuYWdlci9tYW5hZ2VyLmpzIiwianMvdHJhY2VyX21hbmFnZXIvdXRpbC9mcm9tX2pzb24uanMiLCJqcy90cmFjZXJfbWFuYWdlci91dGlsL2luZGV4LmpzIiwianMvdHJhY2VyX21hbmFnZXIvdXRpbC9yZWZpbmVfYnlfdHlwZS5qcyIsImpzL3RyYWNlcl9tYW5hZ2VyL3V0aWwvdG9fanNvbi5qcyIsImpzL3V0aWxzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9yc3ZwL2Rpc3QvcnN2cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztTQUlJLEM7SUFERixNLE1BQUEsTTs7O0FBR0YsSUFBTSxRQUFRO0FBQ1osZ0JBQWMsRUFERjtBQUVaLFNBQU87QUFGSyxDQUFkOztBQUtBLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCLENBQUMsSUFBRCxFQUFVO0FBQy9CLE1BQUksQ0FBQyxJQUFMLEVBQVc7QUFDVCxVQUFNLG1CQUFOO0FBQ0Q7QUFDRixDQUpEOzs7OztBQVVBLE9BQU8sT0FBUCxHQUFpQjtBQUVmLGVBRmUseUJBRUQsSUFGQyxFQUVLO0FBQ2xCLG1CQUFlLElBQWY7QUFDQSxXQUFPLE1BQU0sS0FBTixDQUFZLElBQVosQ0FBUDtBQUNELEdBTGM7QUFPZixrQkFQZSw0QkFPRSxJQVBGLEVBT1EsT0FQUixFQU9pQjtBQUM5QixtQkFBZSxJQUFmO0FBQ0EsUUFBSSxDQUFDLE1BQU0sS0FBTixDQUFZLElBQVosQ0FBTCxFQUF3QjtBQUN0QixZQUFNLEtBQU4sQ0FBWSxJQUFaLElBQW9CLEVBQXBCO0FBQ0Q7QUFDRCxXQUFPLE1BQU0sS0FBTixDQUFZLElBQVosQ0FBUCxFQUEwQixPQUExQjtBQUNELEdBYmM7QUFlZixpQkFmZSw2QkFlRztBQUNo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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB7XG4gIGV4dGVuZFxufSA9ICQ7XG5cbmNvbnN0IGNhY2hlID0ge1xuICBsYXN0RmlsZVVzZWQ6ICcnLFxuICBmaWxlczoge31cbn07XG5cbmNvbnN0IGFzc2VydEZpbGVOYW1lID0gKG5hbWUpID0+IHtcbiAgaWYgKCFuYW1lKSB7XG4gICAgdGhyb3cgJ01pc3NpbmcgZmlsZSBuYW1lJztcbiAgfVxufTtcblxuXG4vKipcbiAqIEdsb2JhbCBhcHBsaWNhdGlvbiBjYWNoZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBnZXRDYWNoZWRGaWxlKG5hbWUpIHtcbiAgICBhc3NlcnRGaWxlTmFtZShuYW1lKTtcbiAgICByZXR1cm4gY2FjaGUuZmlsZXNbbmFtZV07XG4gIH0sXG5cbiAgdXBkYXRlQ2FjaGVkRmlsZShuYW1lLCB1cGRhdGVzKSB7XG4gICAgYXNzZXJ0RmlsZU5hbWUobmFtZSk7XG4gICAgaWYgKCFjYWNoZS5maWxlc1tuYW1lXSkge1xuICAgICAgY2FjaGUuZmlsZXNbbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgZXh0ZW5kKGNhY2hlLmZpbGVzW25hbWVdLCB1cGRhdGVzKTtcbiAgfSxcblxuICBnZXRMYXN0RmlsZVVzZWQoKSB7XG4gICAgcmV0dXJuIGNhY2hlLmxhc3RGaWxlVXNlZDtcbiAgfSxcblxuICBzZXRMYXN0RmlsZVVzZWQoZmlsZSkge1xuICAgIGNhY2hlLmxhc3RGaWxlVXNlZCA9IGZpbGU7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBFZGl0b3IgPSByZXF1aXJlKCcuLi9lZGl0b3InKTtcbmNvbnN0IFRyYWNlck1hbmFnZXIgPSByZXF1aXJlKCcuLi90cmFjZXJfbWFuYWdlcicpO1xuY29uc3QgRE9NID0gcmVxdWlyZSgnLi4vZG9tL3NldHVwJyk7XG5cbmNvbnN0IHtcbiAgc2hvd0xvYWRpbmdTbGlkZXIsXG4gIGhpZGVMb2FkaW5nU2xpZGVyXG59ID0gcmVxdWlyZSgnLi4vZG9tL2xvYWRpbmdfc2xpZGVyJyk7XG5cbmNvbnN0IENhY2hlID0gcmVxdWlyZSgnLi9jYWNoZScpO1xuXG5jb25zdCBzdGF0ZSA9IHtcbiAgaXNMb2FkaW5nOiBudWxsLFxuICBlZGl0b3I6IG51bGwsXG4gIHRyYWNlck1hbmFnZXI6IG51bGwsXG4gIGNhdGVnb3JpZXM6IG51bGwsXG4gIGxvYWRlZFNjcmF0Y2g6IG51bGxcbn07XG5cbmNvbnN0IGluaXRTdGF0ZSA9ICh0cmFjZXJNYW5hZ2VyKSA9PiB7XG4gIHN0YXRlLmlzTG9hZGluZyA9IGZhbHNlO1xuICBzdGF0ZS5lZGl0b3IgPSBuZXcgRWRpdG9yKHRyYWNlck1hbmFnZXIpO1xuICBzdGF0ZS50cmFjZXJNYW5hZ2VyID0gdHJhY2VyTWFuYWdlcjtcbiAgc3RhdGUuY2F0ZWdvcmllcyA9IHt9O1xuICBzdGF0ZS5sb2FkZWRTY3JhdGNoID0gbnVsbDtcbn07XG5cbi8qKlxuICogR2xvYmFsIGFwcGxpY2F0aW9uIHNpbmdsZXRvbi5cbiAqL1xuY29uc3QgQXBwID0gZnVuY3Rpb24gKCkge1xuXG4gIHRoaXMuZ2V0SXNMb2FkaW5nID0gKCkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5pc0xvYWRpbmc7XG4gIH07XG5cbiAgdGhpcy5zZXRJc0xvYWRpbmcgPSAobG9hZGluZykgPT4ge1xuICAgIHN0YXRlLmlzTG9hZGluZyA9IGxvYWRpbmc7XG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHNob3dMb2FkaW5nU2xpZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhpZGVMb2FkaW5nU2xpZGVyKCk7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuZ2V0RWRpdG9yID0gKCkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5lZGl0b3I7XG4gIH07XG5cbiAgdGhpcy5nZXRDYXRlZ29yaWVzID0gKCkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5jYXRlZ29yaWVzO1xuICB9O1xuXG4gIHRoaXMuZ2V0Q2F0ZWdvcnkgPSAobmFtZSkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5jYXRlZ29yaWVzW25hbWVdO1xuICB9O1xuXG4gIHRoaXMuc2V0Q2F0ZWdvcmllcyA9IChjYXRlZ29yaWVzKSA9PiB7XG4gICAgc3RhdGUuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG4gIH07XG5cbiAgdGhpcy51cGRhdGVDYXRlZ29yeSA9IChuYW1lLCB1cGRhdGVzKSA9PiB7XG4gICAgJC5leHRlbmQoc3RhdGUuY2F0ZWdvcmllc1tuYW1lXSwgdXBkYXRlcyk7XG4gIH07XG5cbiAgdGhpcy5nZXRUcmFjZXJNYW5hZ2VyID0gKCkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS50cmFjZXJNYW5hZ2VyO1xuICB9O1xuXG4gIHRoaXMuZ2V0TG9hZGVkU2NyYXRjaCA9ICgpID0+IHtcbiAgICByZXR1cm4gc3RhdGUubG9hZGVkU2NyYXRjaDtcbiAgfTtcblxuICB0aGlzLnNldExvYWRlZFNjcmF0Y2ggPSAobG9hZGVkU2NyYXRjaCkgPT4ge1xuICAgIHN0YXRlLmxvYWRlZFNjcmF0Y2ggPSBsb2FkZWRTY3JhdGNoO1xuICB9O1xuXG4gIGNvbnN0IHRyYWNlck1hbmFnZXIgPSBUcmFjZXJNYW5hZ2VyLmluaXQoKTtcblxuICBpbml0U3RhdGUodHJhY2VyTWFuYWdlcik7XG4gIERPTS5zZXR1cCh0cmFjZXJNYW5hZ2VyKTtcblxufTtcblxuQXBwLnByb3RvdHlwZSA9IENhY2hlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBtYWluIGFwcGxpY2F0aW9uIGluc3RhbmNlLlxuICogR2V0cyBwb3B1bGF0ZWQgb24gcGFnZSBsb2FkLiBcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7fTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuY29uc3QgU2VydmVyID0gcmVxdWlyZSgnLi4vc2VydmVyJyk7XG5jb25zdCBzaG93QWxnb3JpdGhtID0gcmVxdWlyZSgnLi9zaG93X2FsZ29yaXRobScpO1xuXG5jb25zdCB7XG4gIGVhY2hcbn0gPSAkO1xuXG5jb25zdCBhZGRBbGdvcml0aG1Ub0NhdGVnb3J5RE9NID0gKGNhdGVnb3J5LCBzdWJMaXN0LCBhbGdvcml0aG0pID0+IHtcbiAgY29uc3QgJGFsZ29yaXRobSA9ICQoJzxidXR0b24gY2xhc3M9XCJpbmRlbnQgY29sbGFwc2VcIj4nKVxuICAgIC5hcHBlbmQoc3ViTGlzdFthbGdvcml0aG1dKVxuICAgIC5hdHRyKCdkYXRhLWFsZ29yaXRobScsIGFsZ29yaXRobSlcbiAgICAuYXR0cignZGF0YS1jYXRlZ29yeScsIGNhdGVnb3J5KVxuICAgIC5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBTZXJ2ZXIubG9hZEFsZ29yaXRobShjYXRlZ29yeSwgYWxnb3JpdGhtKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIHNob3dBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAkKCcjbGlzdCcpLmFwcGVuZCgkYWxnb3JpdGhtKTtcbn07XG5cbmNvbnN0IGFkZENhdGVnb3J5VG9ET00gPSAoY2F0ZWdvcnkpID0+IHtcblxuICBjb25zdCB7XG4gICAgbmFtZTogY2F0ZWdvcnlOYW1lLFxuICAgIGxpc3Q6IGNhdGVnb3J5U3ViTGlzdFxuICB9ID0gYXBwLmdldENhdGVnb3J5KGNhdGVnb3J5KTtcblxuICBjb25zdCAkY2F0ZWdvcnkgPSAkKCc8YnV0dG9uIGNsYXNzPVwiY2F0ZWdvcnlcIj4nKVxuICAgIC5hcHBlbmQoJzxpIGNsYXNzPVwiZmEgZmEtZncgZmEtY2FyZXQtcmlnaHRcIj4nKVxuICAgIC5hcHBlbmQoY2F0ZWdvcnlOYW1lKVxuICAgIC5hdHRyKCdkYXRhLWNhdGVnb3J5JywgY2F0ZWdvcnkpO1xuXG4gICRjYXRlZ29yeS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgJChgLmluZGVudFtkYXRhLWNhdGVnb3J5PVwiJHtjYXRlZ29yeX1cIl1gKS50b2dnbGVDbGFzcygnY29sbGFwc2UnKTtcbiAgICAkKHRoaXMpLmZpbmQoJ2kuZmEnKS50b2dnbGVDbGFzcygnZmEtY2FyZXQtcmlnaHQgZmEtY2FyZXQtZG93bicpO1xuICB9KTtcblxuICAkKCcjbGlzdCcpLmFwcGVuZCgkY2F0ZWdvcnkpO1xuXG4gIGVhY2goY2F0ZWdvcnlTdWJMaXN0LCAoYWxnb3JpdGhtKSA9PiB7XG4gICAgYWRkQWxnb3JpdGhtVG9DYXRlZ29yeURPTShjYXRlZ29yeSwgY2F0ZWdvcnlTdWJMaXN0LCBhbGdvcml0aG0pO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuICBlYWNoKGFwcC5nZXRDYXRlZ29yaWVzKCksIGFkZENhdGVnb3J5VG9ET00pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFNlcnZlciA9IHJlcXVpcmUoJy4uL3NlcnZlcicpO1xuXG5jb25zdCB7XG4gIGVhY2hcbn0gPSAkO1xuXG5jb25zdCBhZGRGaWxlVG9ET00gPSAoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSwgZXhwbGFuYXRpb24pID0+IHtcbiAgdmFyICRmaWxlID0gJCgnPGJ1dHRvbj4nKVxuICAgIC5hcHBlbmQoZmlsZSlcbiAgICAuYXR0cignZGF0YS1maWxlJywgZmlsZSlcbiAgICAuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgU2VydmVyLmxvYWRGaWxlKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUsIGV4cGxhbmF0aW9uKTtcbiAgICAgICQoJy5maWxlc19iYXIgPiAud3JhcHBlciA+IGJ1dHRvbicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH0pO1xuICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5hcHBlbmQoJGZpbGUpO1xuICByZXR1cm4gJGZpbGU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IChjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlcywgcmVxdWVzdGVkRmlsZSkgPT4ge1xuICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5lbXB0eSgpO1xuXG4gIGVhY2goZmlsZXMsIChmaWxlLCBleHBsYW5hdGlvbikgPT4ge1xuICAgIHZhciAkZmlsZSA9IGFkZEZpbGVUb0RPTShjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlLCBleHBsYW5hdGlvbik7XG4gICAgaWYgKHJlcXVlc3RlZEZpbGUgJiYgcmVxdWVzdGVkRmlsZSA9PSBmaWxlKSAkZmlsZS5jbGljaygpO1xuICB9KTtcblxuICBpZiAoIXJlcXVlc3RlZEZpbGUpICQoJy5maWxlc19iYXIgPiAud3JhcHBlciA+IGJ1dHRvbicpLmZpcnN0KCkuY2xpY2soKTtcbiAgJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyJykuc2Nyb2xsKCk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc2hvd0FsZ29yaXRobSA9IHJlcXVpcmUoJy4vc2hvd19hbGdvcml0aG0nKTtcbmNvbnN0IGFkZENhdGVnb3JpZXMgPSByZXF1aXJlKCcuL2FkZF9jYXRlZ29yaWVzJyk7XG5jb25zdCBzaG93RGVzY3JpcHRpb24gPSByZXF1aXJlKCcuL3Nob3dfZGVzY3JpcHRpb24nKTtcbmNvbnN0IGFkZEZpbGVzID0gcmVxdWlyZSgnLi9hZGRfZmlsZXMnKTtcbmNvbnN0IHNob3dGaXJzdEFsZ29yaXRobSA9IHJlcXVpcmUoJy4vc2hvd19maXJzdF9hbGdvcml0aG0nKTtcbmNvbnN0IHNob3dSZXF1ZXN0ZWRBbGdvcml0aG0gPSByZXF1aXJlKCcuL3Nob3dfcmVxdWVzdGVkX2FsZ29yaXRobScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2hvd0FsZ29yaXRobSxcbiAgYWRkQ2F0ZWdvcmllcyxcbiAgc2hvd0Rlc2NyaXB0aW9uLFxuICBhZGRGaWxlcyxcbiAgc2hvd0ZpcnN0QWxnb3JpdGhtLFxuICBzaG93UmVxdWVzdGVkQWxnb3JpdGhtXG59OyIsIlxuY29uc3Qgc2hvd0xvYWRpbmdTbGlkZXIgPSAoKSA9PiB7XG4gICQoJyNsb2FkaW5nLXNsaWRlcicpLnJlbW92ZUNsYXNzKCdsb2FkZWQnKTtcbn07XG5cbmNvbnN0IGhpZGVMb2FkaW5nU2xpZGVyID0gKCkgPT4ge1xuICAkKCcjbG9hZGluZy1zbGlkZXInKS5hZGRDbGFzcygnbG9hZGVkJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2hvd0xvYWRpbmdTbGlkZXIsXG4gIGhpZGVMb2FkaW5nU2xpZGVyXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBjcmVhdGUgPSAoKSA9PiB7XG4gIGNvbnN0ICRjb250YWluZXIgPSAkKCc8c2VjdGlvbiBjbGFzcz1cIm1vZHVsZV93cmFwcGVyXCI+Jyk7XG4gICQoJy5tb2R1bGVfY29udGFpbmVyJykuYXBwZW5kKCRjb250YWluZXIpO1xuICByZXR1cm4gJGNvbnRhaW5lcjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGVcbn07XG4iLCJjb25zdCBzZXR1cERpdmlkZXJzID0gcmVxdWlyZSgnLi9zZXR1cF9kaXZpZGVycycpO1xuY29uc3Qgc2V0dXBEb2N1bWVudCA9IHJlcXVpcmUoJy4vc2V0dXBfZG9jdW1lbnQnKTtcbmNvbnN0IHNldHVwRmlsZXNCYXIgPSByZXF1aXJlKCcuL3NldHVwX2ZpbGVzX2JhcicpO1xuY29uc3Qgc2V0dXBJbnRlcnZhbCA9IHJlcXVpcmUoJy4vc2V0dXBfaW50ZXJ2YWwnKTtcbmNvbnN0IHNldHVwTW9kdWxlQ29udGFpbmVyID0gcmVxdWlyZSgnLi9zZXR1cF9tb2R1bGVfY29udGFpbmVyJyk7XG5jb25zdCBzZXR1cFBvd2VyZWRCeSA9IHJlcXVpcmUoJy4vc2V0dXBfcG93ZXJlZF9ieScpO1xuY29uc3Qgc2V0dXBTY3JhdGNoUGFwZXIgPSByZXF1aXJlKCcuL3NldHVwX3NjcmF0Y2hfcGFwZXInKTtcbmNvbnN0IHNldHVwU2lkZU1lbnUgPSByZXF1aXJlKCcuL3NldHVwX3NpZGVfbWVudScpO1xuY29uc3Qgc2V0dXBUb3BNZW51ID0gcmVxdWlyZSgnLi9zZXR1cF90b3BfbWVudScpO1xuY29uc3Qgc2V0dXBXaW5kb3cgPSByZXF1aXJlKCcuL3NldHVwX3dpbmRvdycpO1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGVsZW1lbnRzIG9uY2UgdGhlIGFwcCBsb2FkcyBpbiB0aGUgRE9NLiBcbiAqL1xuY29uc3Qgc2V0dXAgPSAoKSA9PiB7XG5cbiAgJCgnLmJ0biBpbnB1dCcpLmNsaWNrKChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfSk7XG5cbiAgLy8gZGl2aWRlcnNcbiAgc2V0dXBEaXZpZGVycygpO1xuXG4gIC8vIGRvY3VtZW50XG4gIHNldHVwRG9jdW1lbnQoKTtcblxuICAvLyBmaWxlcyBiYXJcbiAgc2V0dXBGaWxlc0JhcigpO1xuXG4gIC8vIGludGVydmFsXG4gIHNldHVwSW50ZXJ2YWwoKTtcblxuICAvLyBtb2R1bGUgY29udGFpbmVyXG4gIHNldHVwTW9kdWxlQ29udGFpbmVyKCk7XG5cbiAgLy8gcG93ZXJlZCBieVxuICBzZXR1cFBvd2VyZWRCeSgpO1xuXG4gIC8vIHNjcmF0Y2ggcGFwZXJcbiAgc2V0dXBTY3JhdGNoUGFwZXIoKTtcblxuICAvLyBzaWRlIG1lbnVcbiAgc2V0dXBTaWRlTWVudSgpO1xuXG4gIC8vIHRvcCBtZW51XG4gIHNldHVwVG9wTWVudSgpO1xuXG4gIC8vIHdpbmRvd1xuICBzZXR1cFdpbmRvdygpO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0dXBcbn07IiwiY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5cbmNvbnN0IGFkZERpdmlkZXJUb0RvbSA9IChkaXZpZGVyKSA9PiB7XG4gIGNvbnN0IFt2ZXJ0aWNhbCwgJGZpcnN0LCAkc2Vjb25kXSA9IGRpdmlkZXI7XG4gIGNvbnN0ICRwYXJlbnQgPSAkZmlyc3QucGFyZW50KCk7XG4gIGNvbnN0IHRoaWNrbmVzcyA9IDU7XG5cbiAgY29uc3QgJGRpdmlkZXIgPSAkKCc8ZGl2IGNsYXNzPVwiZGl2aWRlclwiPicpO1xuXG4gIGxldCBkcmFnZ2luZyA9IGZhbHNlO1xuICBpZiAodmVydGljYWwpIHtcbiAgICAkZGl2aWRlci5hZGRDbGFzcygndmVydGljYWwnKTtcblxuICAgIGxldCBfbGVmdCA9IC10aGlja25lc3MgLyAyO1xuICAgICRkaXZpZGVyLmNzcyh7XG4gICAgICB0b3A6IDAsXG4gICAgICBib3R0b206IDAsXG4gICAgICBsZWZ0OiBfbGVmdCxcbiAgICAgIHdpZHRoOiB0aGlja25lc3NcbiAgICB9KTtcblxuICAgIGxldCB4O1xuICAgICRkaXZpZGVyLm1vdXNlZG93bigoe1xuICAgICAgcGFnZVhcbiAgICB9KSA9PiB7XG4gICAgICB4ID0gcGFnZVg7XG4gICAgICBkcmFnZ2luZyA9IHRydWU7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5tb3VzZW1vdmUoKHtcbiAgICAgIHBhZ2VYXG4gICAgfSkgPT4ge1xuICAgICAgaWYgKGRyYWdnaW5nKSB7XG4gICAgICAgIGNvbnN0IG5ld19sZWZ0ID0gJHNlY29uZC5wb3NpdGlvbigpLmxlZnQgKyBwYWdlWCAtIHg7XG4gICAgICAgIGxldCBwZXJjZW50ID0gbmV3X2xlZnQgLyAkcGFyZW50LndpZHRoKCkgKiAxMDA7XG4gICAgICAgIHBlcmNlbnQgPSBNYXRoLm1pbig5MCwgTWF0aC5tYXgoMTAsIHBlcmNlbnQpKTtcbiAgICAgICAgJGZpcnN0LmNzcygncmlnaHQnLCAoMTAwIC0gcGVyY2VudCkgKyAnJScpO1xuICAgICAgICAkc2Vjb25kLmNzcygnbGVmdCcsIHBlcmNlbnQgKyAnJScpO1xuICAgICAgICB4ID0gcGFnZVg7XG4gICAgICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkucmVzaXplKCk7XG4gICAgICAgICQoJy5maWxlc19iYXIgPiAud3JhcHBlcicpLnNjcm9sbCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbihlKSB7XG4gICAgICBkcmFnZ2luZyA9IGZhbHNlO1xuICAgIH0pO1xuXG4gIH0gZWxzZSB7XG5cbiAgICAkZGl2aWRlci5hZGRDbGFzcygnaG9yaXpvbnRhbCcpO1xuICAgIGNvbnN0IF90b3AgPSAtdGhpY2tuZXNzIC8gMjtcbiAgICAkZGl2aWRlci5jc3Moe1xuICAgICAgdG9wOiBfdG9wLFxuICAgICAgaGVpZ2h0OiB0aGlja25lc3MsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgcmlnaHQ6IDBcbiAgICB9KTtcblxuICAgIGxldCB5O1xuICAgICRkaXZpZGVyLm1vdXNlZG93bihmdW5jdGlvbih7XG4gICAgICBwYWdlWVxuICAgIH0pIHtcbiAgICAgIHkgPSBwYWdlWTtcbiAgICAgIGRyYWdnaW5nID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm1vdXNlbW92ZShmdW5jdGlvbih7XG4gICAgICBwYWdlWVxuICAgIH0pIHtcbiAgICAgIGlmIChkcmFnZ2luZykge1xuICAgICAgICBjb25zdCBuZXdfdG9wID0gJHNlY29uZC5wb3NpdGlvbigpLnRvcCArIHBhZ2VZIC0geTtcbiAgICAgICAgbGV0IHBlcmNlbnQgPSBuZXdfdG9wIC8gJHBhcmVudC5oZWlnaHQoKSAqIDEwMDtcbiAgICAgICAgcGVyY2VudCA9IE1hdGgubWluKDkwLCBNYXRoLm1heCgxMCwgcGVyY2VudCkpO1xuICAgICAgICAkZmlyc3QuY3NzKCdib3R0b20nLCAoMTAwIC0gcGVyY2VudCkgKyAnJScpO1xuICAgICAgICAkc2Vjb25kLmNzcygndG9wJywgcGVyY2VudCArICclJyk7XG4gICAgICAgIHkgPSBwYWdlWTtcbiAgICAgICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5yZXNpemUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oZSkge1xuICAgICAgZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gICRzZWNvbmQuYXBwZW5kKCRkaXZpZGVyKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuICBjb25zdCBkaXZpZGVycyA9IFtcbiAgICBbJ3YnLCAkKCcuc2lkZW1lbnUnKSwgJCgnLndvcmtzcGFjZScpXSxcbiAgICBbJ3YnLCAkKCcudmlld2VyX2NvbnRhaW5lcicpLCAkKCcuZWRpdG9yX2NvbnRhaW5lcicpXSxcbiAgICBbJ2gnLCAkKCcuZGF0YV9jb250YWluZXInKSwgJCgnLmNvZGVfY29udGFpbmVyJyldXG4gIF07XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGl2aWRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICBhZGREaXZpZGVyVG9Eb20oZGl2aWRlcnNbaV0pO1xuICB9XG59IiwiY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnYScsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICghd2luZG93Lm9wZW4oJCh0aGlzKS5hdHRyKCdocmVmJyksICdfYmxhbmsnKSkge1xuICAgICAgYWxlcnQoJ1BsZWFzZSBhbGxvdyBwb3B1cHMgZm9yIHRoaXMgc2l0ZScpO1xuICAgIH1cbiAgfSk7XG5cbiAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbiAoZSkge1xuICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkuY29tbWFuZCgnbW91c2V1cCcsIGUpO1xuICB9KTtcbn07IiwiY29uc3QgZGVmaW5pdGVseUJpZ2dlciA9ICh4LCB5KSA9PiB4ID4gKHkgKyAyKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG5cbiAgJCgnLmZpbGVzX2JhciA+IC5idG4tbGVmdCcpLmNsaWNrKCgpID0+IHtcbiAgICBjb25zdCAkd3JhcHBlciA9ICQoJy5maWxlc19iYXIgPiAud3JhcHBlcicpO1xuICAgIGNvbnN0IGNsaXBXaWR0aCA9ICR3cmFwcGVyLndpZHRoKCk7XG4gICAgY29uc3Qgc2Nyb2xsTGVmdCA9ICR3cmFwcGVyLnNjcm9sbExlZnQoKTtcblxuICAgICQoJHdyYXBwZXIuY2hpbGRyZW4oJ2J1dHRvbicpLmdldCgpLnJldmVyc2UoKSkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGxlZnQgPSAkKHRoaXMpLnBvc2l0aW9uKCkubGVmdDtcbiAgICAgIGNvbnN0IHJpZ2h0ID0gbGVmdCArICQodGhpcykub3V0ZXJXaWR0aCgpO1xuICAgICAgaWYgKDAgPiBsZWZ0KSB7XG4gICAgICAgICR3cmFwcGVyLnNjcm9sbExlZnQoc2Nyb2xsTGVmdCArIHJpZ2h0IC0gY2xpcFdpZHRoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICAkKCcuZmlsZXNfYmFyID4gLmJ0bi1yaWdodCcpLmNsaWNrKCgpID0+IHtcbiAgICBjb25zdCAkd3JhcHBlciA9ICQoJy5maWxlc19iYXIgPiAud3JhcHBlcicpO1xuICAgIGNvbnN0IGNsaXBXaWR0aCA9ICR3cmFwcGVyLndpZHRoKCk7XG4gICAgY29uc3Qgc2Nyb2xsTGVmdCA9ICR3cmFwcGVyLnNjcm9sbExlZnQoKTtcblxuICAgICR3cmFwcGVyLmNoaWxkcmVuKCdidXR0b24nKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbGVmdCA9ICQodGhpcykucG9zaXRpb24oKS5sZWZ0O1xuICAgICAgY29uc3QgcmlnaHQgPSBsZWZ0ICsgJCh0aGlzKS5vdXRlcldpZHRoKCk7XG4gICAgICBpZiAoY2xpcFdpZHRoIDwgcmlnaHQpIHtcbiAgICAgICAgJHdyYXBwZXIuc2Nyb2xsTGVmdChzY3JvbGxMZWZ0ICsgbGVmdCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyJykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuXG4gICAgY29uc3QgJHdyYXBwZXIgPSAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKTtcbiAgICBjb25zdCBjbGlwV2lkdGggPSAkd3JhcHBlci53aWR0aCgpO1xuICAgIGNvbnN0ICRsZWZ0ID0gJHdyYXBwZXIuY2hpbGRyZW4oJ2J1dHRvbjpmaXJzdC1jaGlsZCcpO1xuICAgIGNvbnN0ICRyaWdodCA9ICR3cmFwcGVyLmNoaWxkcmVuKCdidXR0b246bGFzdC1jaGlsZCcpO1xuICAgIGNvbnN0IGxlZnQgPSAkbGVmdC5wb3NpdGlvbigpLmxlZnQ7XG4gICAgY29uc3QgcmlnaHQgPSAkcmlnaHQucG9zaXRpb24oKS5sZWZ0ICsgJHJpZ2h0Lm91dGVyV2lkdGgoKTtcblxuICAgIGlmIChkZWZpbml0ZWx5QmlnZ2VyKDAsIGxlZnQpICYmIGRlZmluaXRlbHlCaWdnZXIoY2xpcFdpZHRoLCByaWdodCkpIHtcbiAgICAgIGNvbnN0IHNjcm9sbExlZnQgPSAkd3JhcHBlci5zY3JvbGxMZWZ0KCk7XG4gICAgICAkd3JhcHBlci5zY3JvbGxMZWZ0KHNjcm9sbExlZnQgKyBjbGlwV2lkdGggLSByaWdodCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGVmdGVyID0gZGVmaW5pdGVseUJpZ2dlcigwLCBsZWZ0KTtcbiAgICBjb25zdCByaWdodGVyID0gZGVmaW5pdGVseUJpZ2dlcihyaWdodCwgY2xpcFdpZHRoKTtcbiAgICAkd3JhcHBlci50b2dnbGVDbGFzcygnc2hhZG93LWxlZnQnLCBsZWZ0ZXIpO1xuICAgICR3cmFwcGVyLnRvZ2dsZUNsYXNzKCdzaGFkb3ctcmlnaHQnLCByaWdodGVyKTtcbiAgICAkKCcuZmlsZXNfYmFyID4gLmJ0bi1sZWZ0JykuYXR0cignZGlzYWJsZWQnLCAhbGVmdGVyKTtcbiAgICAkKCcuZmlsZXNfYmFyID4gLmJ0bi1yaWdodCcpLmF0dHIoJ2Rpc2FibGVkJywgIXJpZ2h0ZXIpO1xuICB9KTtcbn0iLCJjb25zdCBhcHAgPSByZXF1aXJlKCcuLi8uLi9hcHAnKTtcbmNvbnN0IFRvYXN0ID0gcmVxdWlyZSgnLi4vdG9hc3QnKTtcblxuY29uc3Qge1xuICBwYXJzZUZsb2F0XG59ID0gTnVtYmVyO1xuXG5jb25zdCBtaW5JbnRlcnZhbCA9IDAuMTtcbmNvbnN0IG1heEludGVydmFsID0gMTA7XG5jb25zdCBzdGFydEludGVydmFsID0gMC41O1xuY29uc3Qgc3RlcEludGVydmFsID0gMC4xO1xuXG5jb25zdCBub3JtYWxpemUgPSAoc2VjKSA9PiB7XG5cblxuICBsZXQgaW50ZXJ2YWw7XG4gIGxldCBtZXNzYWdlO1xuICBpZiAoc2VjIDwgbWluSW50ZXJ2YWwpIHtcbiAgICBpbnRlcnZhbCA9IG1pbkludGVydmFsO1xuICAgIG1lc3NhZ2UgPSBgSW50ZXJ2YWwgb2YgJHtzZWN9IHNlY29uZHMgaXMgdG9vIGxvdy4gU2V0dGluZyB0byBtaW4gYWxsb3dlZCBpbnRlcnZhbCBvZiAke21pbkludGVydmFsfSBzZWNvbmQocykuYDtcbiAgfSBlbHNlIGlmIChzZWMgPiBtYXhJbnRlcnZhbCkge1xuICAgIGludGVydmFsID0gbWF4SW50ZXJ2YWw7XG4gICAgbWVzc2FnZSA9IGBJbnRlcnZhbCBvZiAke3NlY30gc2Vjb25kcyBpcyB0b28gaGlnaC4gU2V0dGluZyB0byBtYXggYWxsb3dlZCBpbnRlcnZhbCBvZiAke21heEludGVydmFsfSBzZWNvbmQocykuYDtcbiAgfSBlbHNlIHtcbiAgICBpbnRlcnZhbCA9IHNlYztcbiAgICBtZXNzYWdlID0gYEludGVydmFsIGhhcyBiZWVuIHNldCB0byAke3NlY30gc2Vjb25kKHMpLmBcbiAgfVxuXG4gIHJldHVybiBbaW50ZXJ2YWwsIG1lc3NhZ2VdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG5cbiAgY29uc3QgJGludGVydmFsID0gJCgnI2ludGVydmFsJyk7XG4gICRpbnRlcnZhbC52YWwoc3RhcnRJbnRlcnZhbCk7XG4gICRpbnRlcnZhbC5hdHRyKHtcbiAgICBtYXg6IG1heEludGVydmFsLFxuICAgIG1pbjogbWluSW50ZXJ2YWwsXG4gICAgc3RlcDogc3RlcEludGVydmFsXG4gIH0pO1xuXG4gICQoJyNpbnRlcnZhbCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCB0cmFjZXJNYW5hZ2VyID0gYXBwLmdldFRyYWNlck1hbmFnZXIoKTtcbiAgICBjb25zdCBbc2Vjb25kcywgbWVzc2FnZV0gPSBub3JtYWxpemUocGFyc2VGbG9hdCgkKHRoaXMpLnZhbCgpKSk7XG5cbiAgICAkKHRoaXMpLnZhbChzZWNvbmRzKTtcbiAgICB0cmFjZXJNYW5hZ2VyLmludGVydmFsID0gc2Vjb25kcyAqIDEwMDA7XG4gICAgVG9hc3Quc2hvd0luZm9Ub2FzdChtZXNzYWdlKTtcbiAgfSk7XG59OyIsImNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcblxuICBjb25zdCAkbW9kdWxlX2NvbnRhaW5lciA9ICQoJy5tb2R1bGVfY29udGFpbmVyJyk7XG5cbiAgJG1vZHVsZV9jb250YWluZXIub24oJ21vdXNlZG93bicsICcubW9kdWxlX3dyYXBwZXInLCBmdW5jdGlvbihlKSB7XG4gICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5maW5kT3duZXIodGhpcykubW91c2Vkb3duKGUpO1xuICB9KTtcblxuICAkbW9kdWxlX2NvbnRhaW5lci5vbignbW91c2Vtb3ZlJywgJy5tb2R1bGVfd3JhcHBlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpLmZpbmRPd25lcih0aGlzKS5tb3VzZW1vdmUoZSk7XG4gIH0pO1xuXG4gICRtb2R1bGVfY29udGFpbmVyLm9uKCdET01Nb3VzZVNjcm9sbCBtb3VzZXdoZWVsJywgJy5tb2R1bGVfd3JhcHBlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpLmZpbmRPd25lcih0aGlzKS5tb3VzZXdoZWVsKGUpO1xuICB9KTtcbn0iLCJtb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgJCgnI3Bvd2VyZWQtYnknKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAkKCcjcG93ZXJlZC1ieS1saXN0IGJ1dHRvbicpLnRvZ2dsZUNsYXNzKCdjb2xsYXBzZScpO1xuICB9KTtcbn07IiwiY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5jb25zdCBTZXJ2ZXIgPSByZXF1aXJlKCcuLi8uLi9zZXJ2ZXInKTtcbmNvbnN0IHNob3dBbGdvcml0aG0gPSByZXF1aXJlKCcuLi9zaG93X2FsZ29yaXRobScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgJCgnI3NjcmF0Y2gtcGFwZXInKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICBjb25zdCBjYXRlZ29yeSA9ICdzY3JhdGNoJztcbiAgICBjb25zdCBhbGdvcml0aG0gPSBhcHAuZ2V0TG9hZGVkU2NyYXRjaCgpO1xuICAgIFNlcnZlci5sb2FkQWxnb3JpdGhtKGNhdGVnb3J5LCBhbGdvcml0aG0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIHNob3dBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YSk7XG4gICAgfSk7XG4gIH0pO1xufTsiLCJjb25zdCBhcHAgPSByZXF1aXJlKCcuLi8uLi9hcHAnKTtcblxubGV0IHNpZGVtZW51X3BlcmNlbnQ7XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuICAkKCcjbmF2aWdhdGlvbicpLmNsaWNrKCgpID0+IHtcbiAgICBjb25zdCAkc2lkZW1lbnUgPSAkKCcuc2lkZW1lbnUnKTtcbiAgICBjb25zdCAkd29ya3NwYWNlID0gJCgnLndvcmtzcGFjZScpO1xuXG4gICAgJHNpZGVtZW51LnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCcubmF2LWRyb3Bkb3duJykudG9nZ2xlQ2xhc3MoJ2ZhLWNhcmV0LWRvd24gZmEtY2FyZXQtdXAnKTtcblxuICAgIGlmICgkc2lkZW1lbnUuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG4gICAgICAkc2lkZW1lbnUuY3NzKCdyaWdodCcsICgxMDAgLSBzaWRlbWVudV9wZXJjZW50KSArICclJyk7XG4gICAgICAkd29ya3NwYWNlLmNzcygnbGVmdCcsIHNpZGVtZW51X3BlcmNlbnQgKyAnJScpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHNpZGVtZW51X3BlcmNlbnQgPSAkd29ya3NwYWNlLnBvc2l0aW9uKCkubGVmdCAvICQoJ2JvZHknKS53aWR0aCgpICogMTAwO1xuICAgICAgJHNpZGVtZW51LmNzcygncmlnaHQnLCAwKTtcbiAgICAgICR3b3Jrc3BhY2UuY3NzKCdsZWZ0JywgMCk7XG4gICAgfVxuXG4gICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5yZXNpemUoKTtcbiAgfSk7XG59IiwiY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5jb25zdCBTZXJ2ZXIgPSByZXF1aXJlKCcuLi8uLi9zZXJ2ZXInKTtcbmNvbnN0IFRvYXN0ID0gcmVxdWlyZSgnLi4vdG9hc3QnKTtcbmNvbnN0IFRvcE1lbnUgPSByZXF1aXJlKCcuLi90b3BfbWVudScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcblxuICAvLyBzaGFyZWRcbiAgJCgnI3NoYXJlZCcpLm1vdXNldXAoZnVuY3Rpb24oKSB7XG4gICAgJCh0aGlzKS5zZWxlY3QoKTtcbiAgfSk7XG5cbiAgJCgnI2J0bl9zaGFyZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuXG4gICAgY29uc3QgJGljb24gPSAkKHRoaXMpLmZpbmQoJy5mYS1zaGFyZScpO1xuICAgICRpY29uLmFkZENsYXNzKCdmYS1zcGluIGZhLXNwaW4tZmFzdGVyJyk7XG5cbiAgICBTZXJ2ZXIuc2hhcmVTY3JhdGNoUGFwZXIoKS50aGVuKCh1cmwpID0+IHtcbiAgICAgICRpY29uLnJlbW92ZUNsYXNzKCdmYS1zcGluIGZhLXNwaW4tZmFzdGVyJyk7XG4gICAgICAkKCcjc2hhcmVkJykucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlJyk7XG4gICAgICAkKCcjc2hhcmVkJykudmFsKHVybCk7XG4gICAgICBUb2FzdC5zaG93SW5mb1RvYXN0KCdTaGFyZWFibGUgbGluayBpcyBjcmVhdGVkLicpO1xuICAgIH0pO1xuICB9KTtcblxuICAvLyBjb250cm9sXG5cbiAgY29uc3QgJGJ0blJ1biAgID0gJCgnI2J0bl9ydW4nKTtcbiAgY29uc3QgJGJ0blRyYWNlID0gJCgnI2J0bl90cmFjZScpO1xuICBjb25zdCAkYnRuUGF1c2UgPSAkKCcjYnRuX3BhdXNlJyk7XG4gIGNvbnN0ICRidG5QcmV2ICA9ICQoJyNidG5fcHJldicpO1xuICBjb25zdCAkYnRuTmV4dCAgPSAkKCcjYnRuX25leHQnKTtcbiAgY29uc3QgJGJ0bkRlc2MgID0gJCgnI2J0bl9kZXNjJyk7XG5cbiAgLy8gaW5pdGlhbGx5LCBjb250cm9sIGJ1dHRvbnMgYXJlIGRpc2FibGVkXG4gIFRvcE1lbnUuZGlzYWJsZUZsb3dDb250cm9sKCk7XG5cbiAgJGJ0blJ1bi5jbGljaygoKSA9PiB7XG4gICAgJGJ0blRyYWNlLmNsaWNrKCk7XG4gICAgJGJ0blBhdXNlLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkYnRuUnVuLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICBUb3BNZW51LmVuYWJsZUZsb3dDb250cm9sKCk7XG4gICAgdmFyIGVyciA9IGFwcC5nZXRFZGl0b3IoKS5leGVjdXRlKCk7XG4gICAgaWYgKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgVG9hc3Quc2hvd0Vycm9yVG9hc3QoZXJyKTtcbiAgICB9XG4gIH0pO1xuXG4gICRidG5QYXVzZS5jbGljaygoKSA9PiB7XG4gICAgJGJ0blJ1bi50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgJGJ0blBhdXNlLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICBpZiAoYXBwLmdldFRyYWNlck1hbmFnZXIoKS5pc1BhdXNlKCkpIHtcbiAgICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkucmVzdW1lU3RlcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpLnBhdXNlU3RlcCgpO1xuICAgIH1cbiAgfSk7XG5cbiAgJGJ0blByZXYuY2xpY2soKCkgPT4ge1xuICAgICRidG5SdW4ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICRidG5QYXVzZS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5wYXVzZVN0ZXAoKTtcbiAgICBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpLnByZXZTdGVwKCk7XG4gIH0pO1xuXG4gICRidG5OZXh0LmNsaWNrKCgpID0+IHtcbiAgICAkYnRuUnVuLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkYnRuUGF1c2UuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkucGF1c2VTdGVwKCk7XG4gICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5uZXh0U3RlcCgpO1xuICB9KTtcblxuICAvLyBkZXNjcmlwdGlvbiAmIHRyYWNlXG5cbiAgJGJ0bkRlc2MuY2xpY2soKCkgPT4ge1xuICAgICQoJy50YWJfY29udGFpbmVyID4gLnRhYicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCcjdGFiX2Rlc2MnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgnLnRhYl9iYXIgPiBidXR0b24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgJGJ0bkRlc2MuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICB9KTtcblxuICAkYnRuVHJhY2UuY2xpY2soKCkgPT4ge1xuICAgICQoJy50YWJfY29udGFpbmVyID4gLnRhYicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCcjdGFiX21vZHVsZScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCcudGFiX2JhciA+IGJ1dHRvbicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkYnRuVHJhY2UuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICB9KTtcblxufTtcbiIsImNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkucmVzaXplKCk7XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuXG5jb25zdCB7XG4gIGlzU2NyYXRjaFBhcGVyXG59ID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuY29uc3Qgc2hvd0Rlc2NyaXB0aW9uID0gcmVxdWlyZSgnLi9zaG93X2Rlc2NyaXB0aW9uJyk7XG5jb25zdCBhZGRGaWxlcyA9IHJlcXVpcmUoJy4vYWRkX2ZpbGVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGNhdGVnb3J5LCBhbGdvcml0aG0sIGRhdGEsIHJlcXVlc3RlZEZpbGUpID0+IHtcbiAgbGV0ICRtZW51O1xuICBsZXQgY2F0ZWdvcnlfbmFtZTtcbiAgbGV0IGFsZ29yaXRobV9uYW1lO1xuXG4gIGlmIChpc1NjcmF0Y2hQYXBlcihjYXRlZ29yeSkpIHtcbiAgICAkbWVudSA9ICQoJyNzY3JhdGNoLXBhcGVyJyk7XG4gICAgY2F0ZWdvcnlfbmFtZSA9ICdTY3JhdGNoIFBhcGVyJztcbiAgICBhbGdvcml0aG1fbmFtZSA9IGFsZ29yaXRobSA/ICdTaGFyZWQnIDogJ1RlbXBvcmFyeSc7XG4gIH0gZWxzZSB7XG4gICAgJG1lbnUgPSAkKGBbZGF0YS1jYXRlZ29yeT1cIiR7Y2F0ZWdvcnl9XCJdW2RhdGEtYWxnb3JpdGhtPVwiJHthbGdvcml0aG19XCJdYCk7XG4gICAgY29uc3QgY2F0ZWdvcnlPYmogPSBhcHAuZ2V0Q2F0ZWdvcnkoY2F0ZWdvcnkpO1xuICAgIGNhdGVnb3J5X25hbWUgPSBjYXRlZ29yeU9iai5uYW1lO1xuICAgIGFsZ29yaXRobV9uYW1lID0gY2F0ZWdvcnlPYmoubGlzdFthbGdvcml0aG1dO1xuICB9XG5cbiAgJCgnLnNpZGVtZW51IGJ1dHRvbicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJG1lbnUuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICQoJyNjYXRlZ29yeScpLmh0bWwoY2F0ZWdvcnlfbmFtZSk7XG4gICQoJyNhbGdvcml0aG0nKS5odG1sKGFsZ29yaXRobV9uYW1lKTtcbiAgJCgnI3RhYl9kZXNjID4gLndyYXBwZXInKS5lbXB0eSgpO1xuICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5lbXB0eSgpO1xuICAkKCcjZXhwbGFuYXRpb24nKS5odG1sKCcnKTtcblxuICBhcHAuc2V0TGFzdEZpbGVVc2VkKG51bGwpO1xuICBhcHAuZ2V0RWRpdG9yKCkuY2xlYXJDb250ZW50KCk7XG5cbiAgY29uc3Qge1xuICAgIGZpbGVzXG4gIH0gPSBkYXRhO1xuXG4gIGRlbGV0ZSBkYXRhLmZpbGVzO1xuXG4gIHNob3dEZXNjcmlwdGlvbihkYXRhKTtcbiAgYWRkRmlsZXMoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZXMsIHJlcXVlc3RlZEZpbGUpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHtcbiAgaXNBcnJheVxufSA9IEFycmF5O1xuXG5jb25zdCB7XG4gIGVhY2hcbn0gPSAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChkYXRhKSA9PiB7XG4gIGNvbnN0ICRjb250YWluZXIgPSAkKCcjdGFiX2Rlc2MgPiAud3JhcHBlcicpO1xuICAkY29udGFpbmVyLmVtcHR5KCk7XG5cbiAgZWFjaChkYXRhLCAoa2V5LCB2YWx1ZSkgPT4ge1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgJGNvbnRhaW5lci5hcHBlbmQoJCgnPGgzPicpLmh0bWwoa2V5KSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICRjb250YWluZXIuYXBwZW5kKCQoJzxwPicpLmh0bWwodmFsdWUpKTtcblxuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcblxuICAgICAgY29uc3QgJHVsID0gJCgnPHVsIGNsYXNzPVwiYXBwbGljYXRpb25zXCI+Jyk7XG4gICAgICAkY29udGFpbmVyLmFwcGVuZCgkdWwpO1xuXG4gICAgICB2YWx1ZS5mb3JFYWNoKChsaSkgPT4ge1xuICAgICAgICAkdWwuYXBwZW5kKCQoJzxsaT4nKS5odG1sKGxpKSk7XG4gICAgICB9KTtcblxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuXG4gICAgICBjb25zdCAkdWwgPSAkKCc8dWwgY2xhc3M9XCJjb21wbGV4aXRpZXNcIj4nKTtcbiAgICAgICRjb250YWluZXIuYXBwZW5kKCR1bCk7XG5cbiAgICAgIGVhY2godmFsdWUsIChwcm9wKSA9PiB7XG4gICAgICAgIGNvbnN0ICR3cmFwcGVyID0gJCgnPGRpdiBjbGFzcz1cImNvbXBsZXhpdHlcIj4nKTtcbiAgICAgICAgY29uc3QgJHR5cGUgPSAkKCc8c3BhbiBjbGFzcz1cImNvbXBsZXhpdHktdHlwZVwiPicpLmh0bWwoYCR7cHJvcH06IGApO1xuICAgICAgICBjb25zdCAkdmFsdWUgPSAkKCc8c3BhbiBjbGFzcz1cImNvbXBsZXhpdHktdmFsdWVcIj4nKS5odG1sKGAke3ZhbHVlW3Byb3BdfWApO1xuXG4gICAgICAgICR3cmFwcGVyLmFwcGVuZCgkdHlwZSkuYXBwZW5kKCR2YWx1ZSk7XG5cbiAgICAgICAgJHVsLmFwcGVuZCgkKCc8bGk+JykuYXBwZW5kKCR3cmFwcGVyKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gY2xpY2sgdGhlIGZpcnN0IGFsZ29yaXRobSBpbiB0aGUgZmlyc3QgY2F0ZWdvcnlcbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuICAkKCcjbGlzdCBidXR0b24uY2F0ZWdvcnknKS5maXJzdCgpLmNsaWNrKCk7XG4gICQoJyNsaXN0IGJ1dHRvbi5jYXRlZ29yeSArIC5pbmRlbnQnKS5maXJzdCgpLmNsaWNrKCk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgU2VydmVyID0gcmVxdWlyZSgnLi4vc2VydmVyJyk7XG5jb25zdCBzaG93QWxnb3JpdGhtID0gcmVxdWlyZSgnLi9zaG93X2FsZ29yaXRobScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlKSA9PiB7XG4gICQoYC5jYXRlZ29yeVtkYXRhLWNhdGVnb3J5PVwiJHtjYXRlZ29yeX1cIl1gKS5jbGljaygpO1xuICBTZXJ2ZXIubG9hZEFsZ29yaXRobShjYXRlZ29yeSwgYWxnb3JpdGhtKS50aGVuKChkYXRhKSA9PiB7XG4gICAgc2hvd0FsZ29yaXRobShjYXRlZ29yeSwgYWxnb3JpdGhtLCBkYXRhLCBmaWxlKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBzaG93VG9hc3QgPSAoZGF0YSwgdHlwZSkgPT4ge1xuICBjb25zdCAkdG9hc3QgPSAkKGA8ZGl2IGNsYXNzPVwidG9hc3QgJHt0eXBlfVwiPmApLmFwcGVuZChkYXRhKTtcblxuICAkKCcudG9hc3RfY29udGFpbmVyJykuYXBwZW5kKCR0b2FzdCk7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICR0b2FzdC5mYWRlT3V0KCgpID0+IHtcbiAgICAgICR0b2FzdC5yZW1vdmUoKTtcbiAgICB9KTtcbiAgfSwgMzAwMCk7XG59O1xuXG5jb25zdCBzaG93RXJyb3JUb2FzdCA9IChlcnIpID0+IHtcbiAgc2hvd1RvYXN0KGVyciwgJ2Vycm9yJyk7XG59O1xuXG5jb25zdCBzaG93SW5mb1RvYXN0ID0gKGVycikgPT4ge1xuICBzaG93VG9hc3QoZXJyLCAnaW5mbycpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNob3dFcnJvclRvYXN0LFxuICBzaG93SW5mb1RvYXN0XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZmxvd0NvbnRyb2xCdG5zID0gWyAkKCcjYnRuX3BhdXNlJyksICQoJyNidG5fcHJldicpLCAkKCcjYnRuX25leHQnKSBdO1xuY29uc3Qgc2V0Rmxvd0NvbnRyb2xTdGF0ZSA9IChpc0Rpc2FibGVkKSA9PiB7XG4gIGZsb3dDb250cm9sQnRucy5mb3JFYWNoKCRidG4gPT4gJGJ0bi5hdHRyKCdkaXNhYmxlZCcsIGlzRGlzYWJsZWQpKTtcbn07XG5cbmNvbnN0IGVuYWJsZUZsb3dDb250cm9sID0gKCkgPT4ge1xuICBzZXRGbG93Q29udHJvbFN0YXRlKGZhbHNlKTtcbn07XG5cbmNvbnN0IGRpc2FibGVGbG93Q29udHJvbCA9ICgpID0+IHtcbiAgc2V0Rmxvd0NvbnRyb2xTdGF0ZSh0cnVlKTtcbn07XG5cbmNvbnN0IHJlc2V0VG9wTWVudUJ1dHRvbnMgPSAoKSA9PiB7XG4gICQoJy50b3AtbWVudS1idXR0b25zIGJ1dHRvbicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgZGlzYWJsZUZsb3dDb250cm9sKCk7XG59O1xuXG5jb25zdCBzZXRJbnRlcnZhbCA9ICh2YWwpID0+IHtcbiAgJCgnI2ludGVydmFsJykudmFsKGludGVydmFsKTtcbn07XG5cbmNvbnN0IGFjdGl2YXRlQnRuUGF1c2UgPSAoKSA9PiB7XG4gICQoJyNidG5fcGF1c2UnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG59O1xuXG5jb25zdCBkZWFjdGl2YXRlQnRuUGF1c2UgPSAoKSA9PiB7XG4gICQoJyNidG5fcGF1c2UnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZW5hYmxlRmxvd0NvbnRyb2wsXG4gIGRpc2FibGVGbG93Q29udHJvbCxcbiAgcmVzZXRUb3BNZW51QnV0dG9ucyxcbiAgc2V0SW50ZXJ2YWwsXG4gIGFjdGl2YXRlQnRuUGF1c2UsXG4gIGRlYWN0aXZhdGVCdG5QYXVzZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpZCkge1xuICBjb25zdCBlZGl0b3IgPSBhY2UuZWRpdChpZCk7XG5cbiAgZWRpdG9yLnNldE9wdGlvbnMoe1xuICAgIGVuYWJsZUJhc2ljQXV0b2NvbXBsZXRpb246IHRydWUsXG4gICAgZW5hYmxlU25pcHBldHM6IHRydWUsXG4gICAgZW5hYmxlTGl2ZUF1dG9jb21wbGV0aW9uOiB0cnVlXG4gIH0pO1xuXG4gIGVkaXRvci5zZXRUaGVtZSgnYWNlL3RoZW1lL3RvbW9ycm93X25pZ2h0X2VpZ2h0aWVzJyk7XG4gIGVkaXRvci5zZXNzaW9uLnNldE1vZGUoJ2FjZS9tb2RlL2phdmFzY3JpcHQnKTtcbiAgZWRpdG9yLiRibG9ja1Njcm9sbGluZyA9IEluZmluaXR5O1xuXG4gIHJldHVybiBlZGl0b3I7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZXhlY3V0ZSA9ICh0cmFjZXJNYW5hZ2VyLCBjb2RlKSA9PiB7XG4gIC8vIGFsbCBtb2R1bGVzIGF2YWlsYWJsZSB0byBldmFsIGFyZSBvYnRhaW5lZCBmcm9tIHdpbmRvd1xuICB0cnkge1xuICAgIHRyYWNlck1hbmFnZXIuZGVhbGxvY2F0ZUFsbCgpO1xuICAgIGV2YWwoY29kZSk7XG4gICAgdHJhY2VyTWFuYWdlci52aXN1YWxpemUoKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIGVycjtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cmFjZXJNYW5hZ2VyLnJlbW92ZVVuYWxsb2NhdGVkKCk7XG4gIH1cbn07XG5cbmNvbnN0IGV4ZWN1dGVEYXRhID0gKHRyYWNlck1hbmFnZXIsIGFsZ29EYXRhKSA9PiB7XG4gIHJldHVybiBleGVjdXRlKHRyYWNlck1hbmFnZXIsIGFsZ29EYXRhKTtcbn07XG5cbmNvbnN0IGV4ZWN1dGVEYXRhQW5kQ29kZSA9ICh0cmFjZXJNYW5hZ2VyLCBhbGdvRGF0YSwgYWxnb0NvZGUpID0+IHtcbiAgcmV0dXJuIGV4ZWN1dGUodHJhY2VyTWFuYWdlciwgYCR7YWxnb0RhdGF9OyR7YWxnb0NvZGV9YCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZXhlY3V0ZURhdGEsXG4gIGV4ZWN1dGVEYXRhQW5kQ29kZVxufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuY29uc3QgY3JlYXRlRWRpdG9yID0gcmVxdWlyZSgnLi9jcmVhdGUnKTtcbmNvbnN0IEV4ZWN1dG9yID0gcmVxdWlyZSgnLi9leGVjdXRvcicpO1xuXG5mdW5jdGlvbiBFZGl0b3IodHJhY2VyTWFuYWdlcikge1xuICBpZiAoIXRyYWNlck1hbmFnZXIpIHtcbiAgICB0aHJvdyAnQ2Fubm90IGNyZWF0ZSBFZGl0b3IuIE1pc3NpbmcgdGhlIHRyYWNlck1hbmFnZXInO1xuICB9XG5cbiAgYWNlLnJlcXVpcmUoJ2FjZS9leHQvbGFuZ3VhZ2VfdG9vbHMnKTtcblxuICB0aGlzLmRhdGFFZGl0b3IgPSBjcmVhdGVFZGl0b3IoJ2RhdGEnKTtcbiAgdGhpcy5jb2RlRWRpdG9yID0gY3JlYXRlRWRpdG9yKCdjb2RlJyk7XG5cbiAgLy8gU2V0dGluZyBkYXRhXG5cbiAgdGhpcy5zZXREYXRhID0gKGRhdGEpID0+IHtcbiAgICB0aGlzLmRhdGFFZGl0b3Iuc2V0VmFsdWUoZGF0YSwgLTEpO1xuICB9O1xuXG4gIHRoaXMuc2V0Q29kZSA9IChjb2RlKSA9PiB7XG4gICAgdGhpcy5jb2RlRWRpdG9yLnNldFZhbHVlKGNvZGUsIC0xKTtcbiAgfTtcblxuICB0aGlzLnNldENvbnRlbnQgPSAoKHtcbiAgICBkYXRhLFxuICAgIGNvZGVcbiAgfSkgPT4ge1xuICAgIHRoaXMuc2V0RGF0YShkYXRhKTtcbiAgICB0aGlzLnNldENvZGUoY29kZSk7XG4gIH0pO1xuXG4gIC8vIENsZWFyaW5nIGRhdGFcblxuICB0aGlzLmNsZWFyRGF0YSA9ICgpID0+IHtcbiAgICB0aGlzLmRhdGFFZGl0b3Iuc2V0VmFsdWUoJycpO1xuICB9O1xuXG4gIHRoaXMuY2xlYXJDb2RlID0gKCkgPT4ge1xuICAgIHRoaXMuY29kZUVkaXRvci5zZXRWYWx1ZSgnJyk7XG4gIH07XG5cbiAgdGhpcy5jbGVhckNvbnRlbnQgPSAoKSA9PiB7XG4gICAgdGhpcy5jbGVhckRhdGEoKTtcbiAgICB0aGlzLmNsZWFyQ29kZSgpO1xuICB9O1xuXG4gIHRoaXMuZXhlY3V0ZSA9ICgpID0+IHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5kYXRhRWRpdG9yLmdldFZhbHVlKCk7XG4gICAgY29uc3QgY29kZSA9IHRoaXMuY29kZUVkaXRvci5nZXRWYWx1ZSgpO1xuICAgIHJldHVybiBFeGVjdXRvci5leGVjdXRlRGF0YUFuZENvZGUodHJhY2VyTWFuYWdlciwgZGF0YSwgY29kZSk7XG4gIH07XG5cbiAgLy8gbGlzdGVuZXJzXG5cbiAgdGhpcy5kYXRhRWRpdG9yLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZGF0YUVkaXRvci5nZXRWYWx1ZSgpO1xuICAgIGNvbnN0IGxhc3RGaWxlVXNlZCA9IGFwcC5nZXRMYXN0RmlsZVVzZWQoKTtcbiAgICBpZiAobGFzdEZpbGVVc2VkKSB7XG4gICAgICBhcHAudXBkYXRlQ2FjaGVkRmlsZShsYXN0RmlsZVVzZWQsIHtcbiAgICAgICAgZGF0YVxuICAgICAgfSk7XG4gICAgfVxuICAgIEV4ZWN1dG9yLmV4ZWN1dGVEYXRhKHRyYWNlck1hbmFnZXIsIGRhdGEpO1xuICB9KTtcblxuICB0aGlzLmNvZGVFZGl0b3Iub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICBjb25zdCBjb2RlID0gdGhpcy5jb2RlRWRpdG9yLmdldFZhbHVlKCk7XG4gICAgY29uc3QgbGFzdEZpbGVVc2VkID0gYXBwLmdldExhc3RGaWxlVXNlZCgpO1xuICAgIGlmIChsYXN0RmlsZVVzZWQpIHtcbiAgICAgIGFwcC51cGRhdGVDYWNoZWRGaWxlKGxhc3RGaWxlVXNlZCwge1xuICAgICAgICBjb2RlXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0b3I7IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBSU1ZQID0gcmVxdWlyZSgncnN2cCcpO1xuY29uc3QgYXBwID0gcmVxdWlyZSgnLi9hcHAnKTtcbmNvbnN0IEFwcENvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9hcHAvY29uc3RydWN0b3InKTtcbmNvbnN0IERPTSA9IHJlcXVpcmUoJy4vZG9tJyk7XG5jb25zdCBTZXJ2ZXIgPSByZXF1aXJlKCcuL3NlcnZlcicpO1xuXG5jb25zdCBtb2R1bGVzID0gcmVxdWlyZSgnLi9tb2R1bGUnKTtcblxuY29uc3Qge1xuICBleHRlbmRcbn0gPSAkO1xuXG4kLmFqYXhTZXR1cCh7XG4gIGNhY2hlOiBmYWxzZSxcbiAgZGF0YVR5cGU6ICd0ZXh0J1xufSk7XG5cbmNvbnN0IHtcbiAgaXNTY3JhdGNoUGFwZXJcbn0gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbmNvbnN0IHtcbiAgZ2V0UGF0aFxufSA9IHJlcXVpcmUoJy4vc2VydmVyL2hlbHBlcnMnKTtcblxuLy8gc2V0IGdsb2JhbCBwcm9taXNlIGVycm9yIGhhbmRsZXJcblJTVlAub24oJ2Vycm9yJywgZnVuY3Rpb24gKHJlYXNvbikge1xuICBjb25zb2xlLmFzc2VydChmYWxzZSwgcmVhc29uKTtcbn0pO1xuXG4kKCgpID0+IHtcblxuICAvLyBpbml0aWFsaXplIHRoZSBhcHBsaWNhdGlvbiBhbmQgYXR0YWNoIGluIHRvIHRoZSBpbnN0YW5jZSBtb2R1bGVcbiAgY29uc3QgYXBwQ29uc3RydWN0b3IgPSBuZXcgQXBwQ29uc3RydWN0b3IoKTtcbiAgZXh0ZW5kKHRydWUsIGFwcCwgYXBwQ29uc3RydWN0b3IpO1xuXG4gIC8vIGxvYWQgbW9kdWxlcyB0byB0aGUgZ2xvYmFsIHNjb3BlIHNvIHRoZXkgY2FuIGJlIGV2YWxlZFxuICBleHRlbmQodHJ1ZSwgd2luZG93LCBtb2R1bGVzKTtcblxuICBTZXJ2ZXIubG9hZENhdGVnb3JpZXMoKS50aGVuKChkYXRhKSA9PiB7XG4gICAgYXBwLnNldENhdGVnb3JpZXMoZGF0YSk7XG4gICAgRE9NLmFkZENhdGVnb3JpZXMoKTtcblxuICAgIC8vIGRldGVybWluZSBpZiB0aGUgYXBwIGlzIGxvYWRpbmcgYSBwcmUtZXhpc3Rpbmcgc2NyYXRjaC1wYWRcbiAgICAvLyBvciB0aGUgaG9tZSBwYWdlXG4gICAgY29uc3Qge1xuICAgICAgY2F0ZWdvcnksXG4gICAgICBhbGdvcml0aG0sXG4gICAgICBmaWxlXG4gICAgfSA9IGdldFBhdGgoKTtcbiAgICBpZiAoaXNTY3JhdGNoUGFwZXIoY2F0ZWdvcnkpKSB7XG4gICAgICBpZiAoYWxnb3JpdGhtKSB7XG4gICAgICAgIFNlcnZlci5sb2FkU2NyYXRjaFBhcGVyKGFsZ29yaXRobSkudGhlbigoe2NhdGVnb3J5LCBhbGdvcml0aG0sIGRhdGF9KSA9PiB7XG4gICAgICAgICAgRE9NLnNob3dBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgU2VydmVyLmxvYWRBbGdvcml0aG0oY2F0ZWdvcnkpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICBET00uc2hvd0FsZ29yaXRobShjYXRlZ29yeSwgbnVsbCwgZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY2F0ZWdvcnkgJiYgYWxnb3JpdGhtKSB7XG4gICAgICBET00uc2hvd1JlcXVlc3RlZEFsZ29yaXRobShjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgRE9NLnNob3dGaXJzdEFsZ29yaXRobSgpO1xuICAgIH1cblxuICB9KTtcbn0pOyIsImNvbnN0IEFycmF5MkQgPSByZXF1aXJlKCcuL2FycmF5MmQnKTtcblxuY29uc3QgcmFuZG9tID0gKE4sIG1pbiwgbWF4KSA9PiB7XG4gIHJldHVybiBBcnJheTJELnJhbmRvbSgxLCBOLCBtaW4sIG1heClbMF07XG59O1xuXG5jb25zdCByYW5kb21Tb3J0ZWQgPSAoTiwgbWluLCBtYXgpPT4ge1xuICByZXR1cm4gQXJyYXkyRC5yYW5kb21Tb3J0ZWQoMSwgTiwgbWluLCBtYXgpWzBdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJhbmRvbSxcbiAgcmFuZG9tU29ydGVkXG59O1xuIiwiY29uc3QgcmFuZG9tID0gKE4sIE0sIG1pbiwgbWF4KSA9PiB7XG4gIGlmICghTikgTiA9IDEwO1xuICBpZiAoIU0pIE0gPSAxMDtcbiAgaWYgKG1pbiA9PT0gdW5kZWZpbmVkKSBtaW4gPSAxO1xuICBpZiAobWF4ID09PSB1bmRlZmluZWQpIG1heCA9IDk7XG4gIHZhciBEID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XG4gICAgRC5wdXNoKFtdKTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IE07IGorKykge1xuICAgICAgRFtpXS5wdXNoKChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpIHwgMCkgKyBtaW4pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gRDtcbn07XG5cbmNvbnN0IHJhbmRvbVNvcnRlZCA9IChOLCBNLCBtaW4sIG1heCkgPT4ge1xuICByZXR1cm4gcmFuZG9tKE4sIE0sIG1pbiwgbWF4KS5tYXAoZnVuY3Rpb24gKGFycikge1xuICAgIHJldHVybiBhcnIuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGEgLSBiO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5kb20sXG4gIHJhbmRvbVNvcnRlZFxufTsiLCJjb25zdCByYW5kb20gPSAoTiwgbWluLCBtYXgpID0+IHtcbiAgaWYgKCFOKSBOID0gNztcbiAgaWYgKCFtaW4pIG1pbiA9IDE7XG4gIGlmICghbWF4KSBtYXggPSAxMDtcbiAgdmFyIEMgPSBuZXcgQXJyYXkoTik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSBDW2ldID0gbmV3IEFycmF5KDIpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IE47IGkrKylcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IENbaV0ubGVuZ3RoOyBqKyspXG4gICAgICBDW2ldW2pdID0gKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgfCAwKSArIG1pbjtcbiAgcmV0dXJuIEM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmFuZG9tXG59OyIsImNvbnN0IHJhbmRvbSA9IChOLCByYXRpbykgPT4ge1xuICBpZiAoIU4pIE4gPSA1O1xuICBpZiAoIXJhdGlvKSByYXRpbyA9IC4zO1xuICB2YXIgRyA9IG5ldyBBcnJheShOKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIHtcbiAgICBHW2ldID0gbmV3IEFycmF5KE4pO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgTjsgaisrKSB7XG4gICAgICBpZiAoaSAhPSBqKSB7XG4gICAgICAgIEdbaV1bal0gPSAoTWF0aC5yYW5kb20oKSAqICgxIC8gcmF0aW8pIHwgMCkgPT0gMCA/IDEgOiAwO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gRztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5kb21cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBBcnJheTFEID0gcmVxdWlyZSgnLi9hcnJheTFkJyk7XG5jb25zdCBBcnJheTJEID0gcmVxdWlyZSgnLi9hcnJheTJkJyk7XG5jb25zdCBDb29yZGluYXRlU3lzdGVtID0gcmVxdWlyZSgnLi9jb29yZGluYXRlX3N5c3RlbScpO1xuY29uc3QgRGlyZWN0ZWRHcmFwaCA9IHJlcXVpcmUoJy4vZGlyZWN0ZWRfZ3JhcGgnKTtcbmNvbnN0IFVuZGlyZWN0ZWRHcmFwaCA9IHJlcXVpcmUoJy4vdW5kaXJlY3RlZF9ncmFwaCcpO1xuY29uc3QgV2VpZ2h0ZWREaXJlY3RlZEdyYXBoID0gcmVxdWlyZSgnLi93ZWlnaHRlZF9kaXJlY3RlZF9ncmFwaCcpO1xuY29uc3QgV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGggPSByZXF1aXJlKCcuL3dlaWdodGVkX3VuZGlyZWN0ZWRfZ3JhcGgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEFycmF5MUQsXG4gIEFycmF5MkQsXG4gIENvb3JkaW5hdGVTeXN0ZW0sXG4gIERpcmVjdGVkR3JhcGgsXG4gIFVuZGlyZWN0ZWRHcmFwaCxcbiAgV2VpZ2h0ZWREaXJlY3RlZEdyYXBoLFxuICBXZWlnaHRlZFVuZGlyZWN0ZWRHcmFwaFxufTsiLCJjb25zdCByYW5kb20gPSAoTiwgcmF0aW8pID0+IHtcbiAgaWYgKCFOKSBOID0gNTtcbiAgaWYgKCFyYXRpbykgcmF0aW8gPSAuMztcbiAgdmFyIEcgPSBuZXcgQXJyYXkoTik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSBHW2ldID0gbmV3IEFycmF5KE4pO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IE47IGkrKykge1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgTjsgaisrKSB7XG4gICAgICBpZiAoaSA+IGopIHtcbiAgICAgICAgR1tpXVtqXSA9IEdbal1baV0gPSAoTWF0aC5yYW5kb20oKSAqICgxIC8gcmF0aW8pIHwgMCkgPT0gMCA/IDEgOiAwO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gRztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5kb21cbn07IiwiY29uc3QgcmFuZG9tID0gKE4sIHJhdGlvLCBtaW4sIG1heCkgPT4ge1xuICBpZiAoIU4pIE4gPSA1O1xuICBpZiAoIXJhdGlvKSByYXRpbyA9IC4zO1xuICBpZiAoIW1pbikgbWluID0gMTtcbiAgaWYgKCFtYXgpIG1heCA9IDU7XG4gIHZhciBHID0gbmV3IEFycmF5KE4pO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IE47IGkrKykge1xuICAgIEdbaV0gPSBuZXcgQXJyYXkoTik7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBOOyBqKyspIHtcbiAgICAgIGlmIChpICE9IGogJiYgKE1hdGgucmFuZG9tKCkgKiAoMSAvIHJhdGlvKSB8IDApID09IDApIHtcbiAgICAgICAgR1tpXVtqXSA9IChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpIHwgMCkgKyBtaW47XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBHO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJhbmRvbVxufTsiLCJjb25zdCByYW5kb20gPSAoTiwgcmF0aW8sIG1pbiwgbWF4KSA9PiB7XG4gIGlmICghTikgTiA9IDU7XG4gIGlmICghcmF0aW8pIHJhdGlvID0gLjM7XG4gIGlmICghbWluKSBtaW4gPSAxO1xuICBpZiAoIW1heCkgbWF4ID0gNTtcbiAgdmFyIEcgPSBuZXcgQXJyYXkoTik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSBHW2ldID0gbmV3IEFycmF5KE4pO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IE47IGkrKykge1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgTjsgaisrKSB7XG4gICAgICBpZiAoaSA+IGogJiYgKE1hdGgucmFuZG9tKCkgKiAoMSAvIHJhdGlvKSB8IDApID09IDApIHtcbiAgICAgICAgR1tpXVtqXSA9IEdbal1baV0gPSAoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSB8IDApICsgbWluO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gRztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5kb21cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdHJhY2VycyA9IHJlcXVpcmUoJy4vdHJhY2VyJyk7XG52YXIgZGF0YXMgPSByZXF1aXJlKCcuL2RhdGEnKTtcblxuY29uc3Qge1xuICBleHRlbmRcbn0gPSAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZCh0cnVlLCB7fSwgdHJhY2VycywgZGF0YXMpOyIsImNvbnN0IEFycmF5MkRUcmFjZXIgPSByZXF1aXJlKCcuL2FycmF5MmQnKTtcblxuY2xhc3MgQXJyYXkxRFRyYWNlciBleHRlbmRzIEFycmF5MkRUcmFjZXIge1xuICBzdGF0aWMgZ2V0Q2xhc3NOYW1lKCkge1xuICAgIHJldHVybiAnQXJyYXkxRFRyYWNlcic7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gIH1cblxuICBfbm90aWZ5KGlkeCwgdikge1xuICAgIHN1cGVyLl9ub3RpZnkoMCwgaWR4LCB2KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9kZW5vdGlmeShpZHgpIHtcbiAgICBzdXBlci5fZGVub3RpZnkoMCwgaWR4KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9zZWxlY3QocywgZSkge1xuICAgIGlmIChlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHN1cGVyLl9zZWxlY3QoMCwgcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1cGVyLl9zZWxlY3RSb3coMCwgcywgZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX2Rlc2VsZWN0KHMsIGUpIHtcbiAgICBpZiAoZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdXBlci5fZGVzZWxlY3QoMCwgcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1cGVyLl9kZXNlbGVjdFJvdygwLCBzLCBlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXREYXRhKEQpIHtcbiAgICByZXR1cm4gc3VwZXIuc2V0RGF0YShbRF0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkxRFRyYWNlcjsiLCJjb25zdCBUcmFjZXIgPSByZXF1aXJlKCcuL3RyYWNlcicpO1xuXG5jb25zdCB7XG4gIHJlZmluZUJ5VHlwZVxufSA9IHJlcXVpcmUoJy4uLy4uL3RyYWNlcl9tYW5hZ2VyL3V0aWwvaW5kZXgnKTtcblxuY2xhc3MgQXJyYXkyRFRyYWNlciBleHRlbmRzIFRyYWNlciB7XG4gIHN0YXRpYyBnZXRDbGFzc05hbWUoKSB7XG4gICAgcmV0dXJuICdBcnJheTJEVHJhY2VyJztcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICBzdXBlcihuYW1lKTtcblxuICAgIHRoaXMuY29sb3JDbGFzcyA9IHtcbiAgICAgIHNlbGVjdGVkOiAnc2VsZWN0ZWQnLFxuICAgICAgbm90aWZpZWQ6ICdub3RpZmllZCdcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuaXNOZXcpIGluaXRWaWV3KHRoaXMpO1xuICB9XG5cbiAgX25vdGlmeSh4LCB5LCB2KSB7XG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgdHlwZTogJ25vdGlmeScsXG4gICAgICB4OiB4LFxuICAgICAgeTogeSxcbiAgICAgIHY6IHZcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9kZW5vdGlmeSh4LCB5KSB7XG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgdHlwZTogJ2Rlbm90aWZ5JyxcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfc2VsZWN0KHN4LCBzeSwgZXgsIGV5KSB7XG4gICAgdGhpcy5wdXNoU2VsZWN0aW5nU3RlcCgnc2VsZWN0JywgbnVsbCwgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9zZWxlY3RSb3coeCwgc3ksIGV5KSB7XG4gICAgdGhpcy5wdXNoU2VsZWN0aW5nU3RlcCgnc2VsZWN0JywgJ3JvdycsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfc2VsZWN0Q29sKHksIHN4LCBleCkge1xuICAgIHRoaXMucHVzaFNlbGVjdGluZ1N0ZXAoJ3NlbGVjdCcsICdjb2wnLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX2Rlc2VsZWN0KHN4LCBzeSwgZXgsIGV5KSB7XG4gICAgdGhpcy5wdXNoU2VsZWN0aW5nU3RlcCgnZGVzZWxlY3QnLCBudWxsLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX2Rlc2VsZWN0Um93KHgsIHN5LCBleSkge1xuICAgIHRoaXMucHVzaFNlbGVjdGluZ1N0ZXAoJ2Rlc2VsZWN0JywgJ3JvdycsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfZGVzZWxlY3RDb2woeSwgc3gsIGV4KSB7XG4gICAgdGhpcy5wdXNoU2VsZWN0aW5nU3RlcCgnZGVzZWxlY3QnLCAnY29sJywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9zZXBhcmF0ZSh4LCB5KSB7XG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgdHlwZTogJ3NlcGFyYXRlJyxcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfc2VwYXJhdGVSb3coeCkge1xuICAgIHRoaXMuX3NlcGFyYXRlKHgsIC0xKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9zZXBhcmF0ZUNvbCh5KSB7XG4gICAgdGhpcy5fc2VwYXJhdGUoLTEsIHkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX2Rlc2VwYXJhdGUoeCwgeSkge1xuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgIHR5cGU6ICdkZXNlcGFyYXRlJyxcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfZGVzZXBhcmF0ZVJvdyh4KSB7XG4gICAgdGhpcy5fZGVzZXBhcmF0ZSh4LCAtMSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfZGVzZXBhcmF0ZUNvbCh5KSB7XG4gICAgdGhpcy5fZGVzZXBhcmF0ZSgtMSwgeSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdXNoU2VsZWN0aW5nU3RlcCgpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIHR5cGUgPSBhcmdzLnNoaWZ0KCk7XG4gICAgdmFyIG1vZGUgPSBhcmdzLnNoaWZ0KCk7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3Muc2hpZnQoKSk7XG4gICAgdmFyIGNvb3JkO1xuICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgY2FzZSAncm93JzpcbiAgICAgICAgY29vcmQgPSB7XG4gICAgICAgICAgeDogYXJnc1swXSxcbiAgICAgICAgICBzeTogYXJnc1sxXSxcbiAgICAgICAgICBleTogYXJnc1syXVxuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbCc6XG4gICAgICAgIGNvb3JkID0ge1xuICAgICAgICAgIHk6IGFyZ3NbMF0sXG4gICAgICAgICAgc3g6IGFyZ3NbMV0sXG4gICAgICAgICAgZXg6IGFyZ3NbMl1cbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoYXJnc1syXSA9PT0gdW5kZWZpbmVkICYmIGFyZ3NbM10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvb3JkID0ge1xuICAgICAgICAgICAgeDogYXJnc1swXSxcbiAgICAgICAgICAgIHk6IGFyZ3NbMV1cbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvb3JkID0ge1xuICAgICAgICAgICAgc3g6IGFyZ3NbMF0sXG4gICAgICAgICAgICBzeTogYXJnc1sxXSxcbiAgICAgICAgICAgIGV4OiBhcmdzWzJdLFxuICAgICAgICAgICAgZXk6IGFyZ3NbM11cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBzdGVwID0ge1xuICAgICAgdHlwZTogdHlwZVxuICAgIH07XG4gICAgJC5leHRlbmQoc3RlcCwgY29vcmQpO1xuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHN0ZXApO1xuICB9XG5cbiAgcHJvY2Vzc1N0ZXAoc3RlcCwgb3B0aW9ucykge1xuICAgIHN3aXRjaCAoc3RlcC50eXBlKSB7XG4gICAgICBjYXNlICdub3RpZnknOlxuICAgICAgICBpZiAoc3RlcC52ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgJHJvdyA9IHRoaXMuJHRhYmxlLmZpbmQoJy5tdGJsLXJvdycpLmVxKHN0ZXAueCk7XG4gICAgICAgICAgdmFyICRjb2wgPSAkcm93LmZpbmQoJy5tdGJsLWNvbCcpLmVxKHN0ZXAueSk7XG4gICAgICAgICAgJGNvbC50ZXh0KHJlZmluZUJ5VHlwZShzdGVwLnYpKTtcbiAgICAgICAgfVxuICAgICAgY2FzZSAnZGVub3RpZnknOlxuICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgIGNhc2UgJ2Rlc2VsZWN0JzpcbiAgICAgICAgdmFyIGNvbG9yQ2xhc3MgPSBzdGVwLnR5cGUgPT0gJ3NlbGVjdCcgfHwgc3RlcC50eXBlID09ICdkZXNlbGVjdCcgPyB0aGlzLmNvbG9yQ2xhc3Muc2VsZWN0ZWQgOiB0aGlzLmNvbG9yQ2xhc3Mubm90aWZpZWQ7XG4gICAgICAgIHZhciBhZGRDbGFzcyA9IHN0ZXAudHlwZSA9PSAnc2VsZWN0JyB8fCBzdGVwLnR5cGUgPT0gJ25vdGlmeSc7XG4gICAgICAgIHZhciBzeCA9IHN0ZXAuc3g7XG4gICAgICAgIHZhciBzeSA9IHN0ZXAuc3k7XG4gICAgICAgIHZhciBleCA9IHN0ZXAuZXg7XG4gICAgICAgIHZhciBleSA9IHN0ZXAuZXk7XG4gICAgICAgIGlmIChzeCA9PT0gdW5kZWZpbmVkKSBzeCA9IHN0ZXAueDtcbiAgICAgICAgaWYgKHN5ID09PSB1bmRlZmluZWQpIHN5ID0gc3RlcC55O1xuICAgICAgICBpZiAoZXggPT09IHVuZGVmaW5lZCkgZXggPSBzdGVwLng7XG4gICAgICAgIGlmIChleSA9PT0gdW5kZWZpbmVkKSBleSA9IHN0ZXAueTtcbiAgICAgICAgdGhpcy5wYWludENvbG9yKHN4LCBzeSwgZXgsIGV5LCBjb2xvckNsYXNzLCBhZGRDbGFzcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2VwYXJhdGUnOlxuICAgICAgICB0aGlzLmRlc2VwYXJhdGUoc3RlcC54LCBzdGVwLnkpO1xuICAgICAgICB0aGlzLnNlcGFyYXRlKHN0ZXAueCwgc3RlcC55KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkZXNlcGFyYXRlJzpcbiAgICAgICAgdGhpcy5kZXNlcGFyYXRlKHN0ZXAueCwgc3RlcC55KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBzdXBlci5wcm9jZXNzU3RlcChzdGVwLCBvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICBzZXREYXRhKEQpIHtcbiAgICB0aGlzLnZpZXdYID0gdGhpcy52aWV3WSA9IDA7XG4gICAgdGhpcy5wYWRkaW5nSCA9IDY7XG4gICAgdGhpcy5wYWRkaW5nViA9IDM7XG4gICAgdGhpcy5mb250U2l6ZSA9IDE2O1xuXG4gICAgaWYgKHN1cGVyLnNldERhdGEuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgdGhpcy4kdGFibGUuZmluZCgnLm10Ymwtcm93JykuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAkKHRoaXMpLmZpbmQoJy5tdGJsLWNvbCcpLmVhY2goZnVuY3Rpb24gKGopIHtcbiAgICAgICAgICAkKHRoaXMpLnRleHQocmVmaW5lQnlUeXBlKERbaV1bal0pKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuJHRhYmxlLmVtcHR5KCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBELmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgJHJvdyA9ICQoJzxkaXYgY2xhc3M9XCJtdGJsLXJvd1wiPicpO1xuICAgICAgdGhpcy4kdGFibGUuYXBwZW5kKCRyb3cpO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBEW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHZhciAkY29sID0gJCgnPGRpdiBjbGFzcz1cIm10YmwtY29sXCI+JylcbiAgICAgICAgICAuY3NzKHRoaXMuZ2V0Q2VsbENzcygpKVxuICAgICAgICAgIC50ZXh0KHJlZmluZUJ5VHlwZShEW2ldW2pdKSk7XG4gICAgICAgICRyb3cuYXBwZW5kKCRjb2wpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnJlc2l6ZSgpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmVzaXplKCkge1xuICAgIHN1cGVyLnJlc2l6ZSgpO1xuXG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICBzdXBlci5jbGVhcigpO1xuXG4gICAgdGhpcy5jbGVhckNvbG9yKCk7XG4gICAgdGhpcy5kZXNlcGFyYXRlQWxsKCk7XG4gIH1cblxuICBnZXRDZWxsQ3NzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwYWRkaW5nOiB0aGlzLnBhZGRpbmdWLnRvRml4ZWQoMSkgKyAncHggJyArIHRoaXMucGFkZGluZ0gudG9GaXhlZCgxKSArICdweCcsXG4gICAgICAnZm9udC1zaXplJzogdGhpcy5mb250U2l6ZS50b0ZpeGVkKDEpICsgJ3B4J1xuICAgIH07XG4gIH1cblxuICByZWZyZXNoKCkge1xuICAgIHN1cGVyLnJlZnJlc2goKTtcblxuICAgIHZhciAkcGFyZW50ID0gdGhpcy4kdGFibGUucGFyZW50KCk7XG4gICAgdmFyIHRvcCA9ICRwYXJlbnQuaGVpZ2h0KCkgLyAyIC0gdGhpcy4kdGFibGUuaGVpZ2h0KCkgLyAyICsgdGhpcy52aWV3WTtcbiAgICB2YXIgbGVmdCA9ICRwYXJlbnQud2lkdGgoKSAvIDIgLSB0aGlzLiR0YWJsZS53aWR0aCgpIC8gMiArIHRoaXMudmlld1g7XG4gICAgdGhpcy4kdGFibGUuY3NzKCdtYXJnaW4tdG9wJywgdG9wKTtcbiAgICB0aGlzLiR0YWJsZS5jc3MoJ21hcmdpbi1sZWZ0JywgbGVmdCk7XG4gIH1cblxuICBtb3VzZWRvd24oZSkge1xuICAgIHN1cGVyLm1vdXNlZG93bihlKTtcblxuICAgIHRoaXMuZHJhZ1ggPSBlLnBhZ2VYO1xuICAgIHRoaXMuZHJhZ1kgPSBlLnBhZ2VZO1xuICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xuICB9XG5cbiAgbW91c2Vtb3ZlKGUpIHtcbiAgICBzdXBlci5tb3VzZW1vdmUoZSk7XG5cbiAgICBpZiAodGhpcy5kcmFnZ2luZykge1xuICAgICAgdGhpcy52aWV3WCArPSBlLnBhZ2VYIC0gdGhpcy5kcmFnWDtcbiAgICAgIHRoaXMudmlld1kgKz0gZS5wYWdlWSAtIHRoaXMuZHJhZ1k7XG4gICAgICB0aGlzLmRyYWdYID0gZS5wYWdlWDtcbiAgICAgIHRoaXMuZHJhZ1kgPSBlLnBhZ2VZO1xuICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgfVxuICB9XG5cbiAgbW91c2V1cChlKSB7XG4gICAgc3VwZXIubW91c2V1cChlKTtcblxuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIG1vdXNld2hlZWwoZSkge1xuICAgIHN1cGVyLm1vdXNld2hlZWwoZSk7XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZSA9IGUub3JpZ2luYWxFdmVudDtcbiAgICB2YXIgZGVsdGEgPSAoZS53aGVlbERlbHRhICE9PSB1bmRlZmluZWQgJiYgZS53aGVlbERlbHRhKSB8fFxuICAgICAgKGUuZGV0YWlsICE9PSB1bmRlZmluZWQgJiYgLWUuZGV0YWlsKTtcbiAgICB2YXIgd2VpZ2h0ID0gMS4wMTtcbiAgICB2YXIgcmF0aW8gPSBkZWx0YSA+IDAgPyAxIC8gd2VpZ2h0IDogd2VpZ2h0O1xuICAgIGlmICh0aGlzLmZvbnRTaXplIDwgNCAmJiByYXRpbyA8IDEpIHJldHVybjtcbiAgICBpZiAodGhpcy5mb250U2l6ZSA+IDQwICYmIHJhdGlvID4gMSkgcmV0dXJuO1xuICAgIHRoaXMucGFkZGluZ1YgKj0gcmF0aW87XG4gICAgdGhpcy5wYWRkaW5nSCAqPSByYXRpbztcbiAgICB0aGlzLmZvbnRTaXplICo9IHJhdGlvO1xuICAgIHRoaXMuJHRhYmxlLmZpbmQoJy5tdGJsLWNvbCcpLmNzcyh0aGlzLmdldENlbGxDc3MoKSk7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICBwYWludENvbG9yKHN4LCBzeSwgZXgsIGV5LCBjb2xvckNsYXNzLCBhZGRDbGFzcykge1xuICAgIGZvciAodmFyIGkgPSBzeDsgaSA8PSBleDsgaSsrKSB7XG4gICAgICB2YXIgJHJvdyA9IHRoaXMuJHRhYmxlLmZpbmQoJy5tdGJsLXJvdycpLmVxKGkpO1xuICAgICAgZm9yICh2YXIgaiA9IHN5OyBqIDw9IGV5OyBqKyspIHtcbiAgICAgICAgdmFyICRjb2wgPSAkcm93LmZpbmQoJy5tdGJsLWNvbCcpLmVxKGopO1xuICAgICAgICBpZiAoYWRkQ2xhc3MpICRjb2wuYWRkQ2xhc3MoY29sb3JDbGFzcyk7XG4gICAgICAgIGVsc2UgJGNvbC5yZW1vdmVDbGFzcyhjb2xvckNsYXNzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbGVhckNvbG9yKCkge1xuICAgIHRoaXMuJHRhYmxlLmZpbmQoJy5tdGJsLWNvbCcpLnJlbW92ZUNsYXNzKE9iamVjdC5rZXlzKHRoaXMuY29sb3JDbGFzcykuam9pbignICcpKTtcbiAgfVxuXG4gIHNlcGFyYXRlKHgsIHkpIHtcbiAgICB0aGlzLiR0YWJsZS5maW5kKCcubXRibC1yb3cnKS5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICB2YXIgJHJvdyA9ICQodGhpcyk7XG4gICAgICBpZiAoaSA9PSB4KSB7XG4gICAgICAgICRyb3cuYWZ0ZXIoJCgnPGRpdiBjbGFzcz1cIm10YmwtZW1wdHktcm93XCI+JykuYXR0cignZGF0YS1yb3cnLCBpKSlcbiAgICAgIH1cbiAgICAgICRyb3cuZmluZCgnLm10YmwtY29sJykuZWFjaChmdW5jdGlvbiAoaikge1xuICAgICAgICB2YXIgJGNvbCA9ICQodGhpcyk7XG4gICAgICAgIGlmIChqID09IHkpIHtcbiAgICAgICAgICAkY29sLmFmdGVyKCQoJzxkaXYgY2xhc3M9XCJtdGJsLWVtcHR5LWNvbFwiPicpLmF0dHIoJ2RhdGEtY29sJywgaikpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGRlc2VwYXJhdGUoeCwgeSkge1xuICAgIHRoaXMuJHRhYmxlLmZpbmQoJ1tkYXRhLXJvdz0nICsgeCArICddJykucmVtb3ZlKCk7XG4gICAgdGhpcy4kdGFibGUuZmluZCgnW2RhdGEtY29sPScgKyB5ICsgJ10nKS5yZW1vdmUoKTtcbiAgfVxuXG4gIGRlc2VwYXJhdGVBbGwoKSB7XG4gICAgdGhpcy4kdGFibGUuZmluZCgnLm10YmwtZW1wdHktcm93LCAubXRibC1lbXB0eS1jb2wnKS5yZW1vdmUoKTtcbiAgfVxufVxuXG5jb25zdCBpbml0VmlldyA9ICh0cmFjZXIpID0+IHtcbiAgdHJhY2VyLiR0YWJsZSA9IHRyYWNlci5jYXBzdWxlLiR0YWJsZSA9ICQoJzxkaXYgY2xhc3M9XCJtdGJsLXRhYmxlXCI+Jyk7XG4gIHRyYWNlci4kY29udGFpbmVyLmFwcGVuZCh0cmFjZXIuJHRhYmxlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkyRFRyYWNlcjsiLCJjb25zdCBUcmFjZXIgPSByZXF1aXJlKCcuL3RyYWNlcicpO1xuXG5jbGFzcyBDaGFydFRyYWNlciBleHRlbmRzIFRyYWNlciB7XG4gIHN0YXRpYyBnZXRDbGFzc05hbWUoKSB7XG4gICAgcmV0dXJuICdDaGFydFRyYWNlcic7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgc3VwZXIobmFtZSk7XG5cbiAgICB0aGlzLmNvbG9yID0ge1xuICAgICAgc2VsZWN0ZWQ6ICdyZ2JhKDI1NSwgMCwgMCwgMSknLFxuICAgICAgbm90aWZpZWQ6ICdyZ2JhKDAsIDAsIDI1NSwgMSknLFxuICAgICAgZGVmYXVsdDogJ3JnYmEoMTM2LCAxMzYsIDEzNiwgMSknXG4gICAgfTtcblxuICAgIGlmICh0aGlzLmlzTmV3KSBpbml0Vmlldyh0aGlzKTtcbiAgfVxuXG4gIHNldERhdGEoQykge1xuICAgIGlmIChzdXBlci5zZXREYXRhLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHJldHVybiB0cnVlO1xuXG4gICAgdmFyIGNvbG9yID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBDLmxlbmd0aDsgaSsrKSBjb2xvci5wdXNoKHRoaXMuY29sb3IuZGVmYXVsdCk7XG4gICAgdGhpcy5jaGFydC5jb25maWcuZGF0YSA9IHtcbiAgICAgIGxhYmVsczogQy5tYXAoU3RyaW5nKSxcbiAgICAgIGRhdGFzZXRzOiBbe1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yLFxuICAgICAgICBkYXRhOiBDXG4gICAgICB9XVxuICAgIH07XG4gICAgdGhpcy5jaGFydC51cGRhdGUoKTtcbiAgfVxuXG4gIF9ub3RpZnkocywgdikge1xuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgIHR5cGU6ICdub3RpZnknLFxuICAgICAgczogcyxcbiAgICAgIHY6IHZcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9kZW5vdGlmeShzKSB7XG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgdHlwZTogJ2Rlbm90aWZ5JyxcbiAgICAgIHM6IHNcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9zZWxlY3QocywgZSkge1xuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgczogcyxcbiAgICAgIGU6IGVcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9kZXNlbGVjdChzLCBlKSB7XG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgdHlwZTogJ2Rlc2VsZWN0JyxcbiAgICAgIHM6IHMsXG4gICAgICBlOiBlXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcm9jZXNzU3RlcChzdGVwLCBvcHRpb25zKSB7XG4gICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcbiAgICAgIGNhc2UgJ25vdGlmeSc6XG4gICAgICAgIGlmIChzdGVwLnYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMuY2hhcnQuY29uZmlnLmRhdGEuZGF0YXNldHNbMF0uZGF0YVtzdGVwLnNdID0gc3RlcC52O1xuICAgICAgICAgIHRoaXMuY2hhcnQuY29uZmlnLmRhdGEubGFiZWxzW3N0ZXAuc10gPSBzdGVwLnYudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgY2FzZSAnZGVub3RpZnknOlxuICAgICAgY2FzZSAnZGVzZWxlY3QnOlxuICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgbGV0IGNvbG9yID0gc3RlcC50eXBlID09ICdub3RpZnknID8gdGhpcy5jb2xvci5ub3RpZmllZCA6IHN0ZXAudHlwZSA9PSAnc2VsZWN0JyA/IHRoaXMuY29sb3Iuc2VsZWN0ZWQgOiB0aGlzLmNvbG9yLmRlZmF1bHQ7XG4gICAgICAgIGlmIChzdGVwLmUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICBmb3IgKHZhciBpID0gc3RlcC5zOyBpIDw9IHN0ZXAuZTsgaSsrKVxuICAgICAgICAgICAgdGhpcy5jaGFydC5jb25maWcuZGF0YS5kYXRhc2V0c1swXS5iYWNrZ3JvdW5kQ29sb3JbaV0gPSBjb2xvcjtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRoaXMuY2hhcnQuY29uZmlnLmRhdGEuZGF0YXNldHNbMF0uYmFja2dyb3VuZENvbG9yW3N0ZXAuc10gPSBjb2xvcjtcbiAgICAgICAgdGhpcy5jaGFydC51cGRhdGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBzdXBlci5wcm9jZXNzU3RlcChzdGVwLCBvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICByZXNpemUoKSB7XG4gICAgc3VwZXIucmVzaXplKCk7XG5cbiAgICB0aGlzLmNoYXJ0LnJlc2l6ZSgpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgc3VwZXIuY2xlYXIoKTtcblxuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmNoYXJ0LmNvbmZpZy5kYXRhO1xuICAgIGlmIChkYXRhLmRhdGFzZXRzLmxlbmd0aCkge1xuICAgICAgY29uc3QgYmFja2dyb3VuZENvbG9yID0gZGF0YS5kYXRhc2V0c1swXS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJhY2tncm91bmRDb2xvci5sZW5ndGg7IGkrKykge1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3JbaV0gPSB0aGlzLmNvbG9yLmRlZmF1bHQ7XG4gICAgICB9XG4gICAgICB0aGlzLmNoYXJ0LnVwZGF0ZSgpO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBpbml0VmlldyA9ICh0cmFjZXIpID0+IHtcbiAgdHJhY2VyLiR3cmFwcGVyID0gdHJhY2VyLmNhcHN1bGUuJHdyYXBwZXIgPSAkKCc8Y2FudmFzIGNsYXNzPVwibWNocnQtY2hhcnRcIj4nKTtcbiAgdHJhY2VyLiRjb250YWluZXIuYXBwZW5kKHRyYWNlci4kd3JhcHBlcik7XG4gIHRyYWNlci5jaGFydCA9IHRyYWNlci5jYXBzdWxlLmNoYXJ0ID0gbmV3IENoYXJ0KHRyYWNlci4kd3JhcHBlciwge1xuICAgIHR5cGU6ICdiYXInLFxuICAgIGRhdGE6IHtcbiAgICAgIGxhYmVsczogW10sXG4gICAgICBkYXRhc2V0czogW11cbiAgICB9LFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHNjYWxlczoge1xuICAgICAgICB5QXhlczogW3tcbiAgICAgICAgICB0aWNrczoge1xuICAgICAgICAgICAgYmVnaW5BdFplcm86IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAgYW5pbWF0aW9uOiBmYWxzZSxcbiAgICAgIGxlZ2VuZDogZmFsc2UsXG4gICAgICByZXNwb25zaXZlOiB0cnVlLFxuICAgICAgbWFpbnRhaW5Bc3BlY3RSYXRpbzogZmFsc2VcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGFydFRyYWNlcjsiLCJjb25zdCBEaXJlY3RlZEdyYXBoVHJhY2VyID0gcmVxdWlyZSgnLi9kaXJlY3RlZF9ncmFwaCcpO1xuXG5jbGFzcyBDb29yZGluYXRlU3lzdGVtVHJhY2VyIGV4dGVuZHMgRGlyZWN0ZWRHcmFwaFRyYWNlciB7XG4gIHN0YXRpYyBnZXRDbGFzc05hbWUoKSB7XG4gICAgcmV0dXJuICdDb29yZGluYXRlU3lzdGVtVHJhY2VyJztcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICBzdXBlcihuYW1lKTtcblxuICAgIGlmICh0aGlzLmlzTmV3KSBpbml0Vmlldyh0aGlzKTtcbiAgfVxuXG4gIHNldERhdGEoQykge1xuICAgIGlmIChUcmFjZXIucHJvdG90eXBlLnNldERhdGEuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuIHRydWU7XG5cbiAgICB0aGlzLmdyYXBoLmNsZWFyKCk7XG4gICAgdmFyIG5vZGVzID0gW107XG4gICAgdmFyIGVkZ2VzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBDLmxlbmd0aDsgaSsrKVxuICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgIGlkOiB0aGlzLm4oaSksXG4gICAgICAgIHg6IENbaV1bMF0sXG4gICAgICAgIHk6IENbaV1bMV0sXG4gICAgICAgIGxhYmVsOiAnJyArIGksXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLmRlZmF1bHRcbiAgICAgIH0pO1xuICAgIHRoaXMuZ3JhcGgucmVhZCh7XG4gICAgICBub2Rlczogbm9kZXMsXG4gICAgICBlZGdlczogZWRnZXNcbiAgICB9KTtcbiAgICB0aGlzLnMuY2FtZXJhLmdvVG8oe1xuICAgICAgeDogMCxcbiAgICAgIHk6IDAsXG4gICAgICBhbmdsZTogMCxcbiAgICAgIHJhdGlvOiAxXG4gICAgfSk7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcm9jZXNzU3RlcChzdGVwLCBvcHRpb25zKSB7XG4gICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3Zpc2l0JzpcbiAgICAgIGNhc2UgJ2xlYXZlJzpcbiAgICAgICAgdmFyIHZpc2l0ID0gc3RlcC50eXBlID09ICd2aXNpdCc7XG4gICAgICAgIHZhciB0YXJnZXROb2RlID0gdGhpcy5ncmFwaC5ub2Rlcyh0aGlzLm4oc3RlcC50YXJnZXQpKTtcbiAgICAgICAgdmFyIGNvbG9yID0gdmlzaXQgPyB0aGlzLmNvbG9yLnZpc2l0ZWQgOiB0aGlzLmNvbG9yLmxlZnQ7XG4gICAgICAgIHRhcmdldE5vZGUuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgaWYgKHN0ZXAuc291cmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZWRnZUlkID0gdGhpcy5lKHN0ZXAuc291cmNlLCBzdGVwLnRhcmdldCk7XG4gICAgICAgICAgaWYgKHRoaXMuZ3JhcGguZWRnZXMoZWRnZUlkKSkge1xuICAgICAgICAgICAgdmFyIGVkZ2UgPSB0aGlzLmdyYXBoLmVkZ2VzKGVkZ2VJZCk7XG4gICAgICAgICAgICBlZGdlLmNvbG9yID0gY29sb3I7XG4gICAgICAgICAgICB0aGlzLmdyYXBoLmRyb3BFZGdlKGVkZ2VJZCkuYWRkRWRnZShlZGdlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ncmFwaC5hZGRFZGdlKHtcbiAgICAgICAgICAgICAgaWQ6IHRoaXMuZShzdGVwLnRhcmdldCwgc3RlcC5zb3VyY2UpLFxuICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMubihzdGVwLnNvdXJjZSksXG4gICAgICAgICAgICAgIHRhcmdldDogdGhpcy5uKHN0ZXAudGFyZ2V0KSxcbiAgICAgICAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICAgICAgICBzaXplOiAxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubG9nVHJhY2VyKSB7XG4gICAgICAgICAgdmFyIHNvdXJjZSA9IHN0ZXAuc291cmNlO1xuICAgICAgICAgIGlmIChzb3VyY2UgPT09IHVuZGVmaW5lZCkgc291cmNlID0gJyc7XG4gICAgICAgICAgdGhpcy5sb2dUcmFjZXIucHJpbnQodmlzaXQgPyBzb3VyY2UgKyAnIC0+ICcgKyBzdGVwLnRhcmdldCA6IHNvdXJjZSArICcgPC0gJyArIHN0ZXAudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHN1cGVyLnByb2Nlc3NTdGVwKHN0ZXAsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIGUodjEsIHYyKSB7XG4gICAgaWYgKHYxID4gdjIpIHtcbiAgICAgIHZhciB0ZW1wID0gdjE7XG4gICAgICB2MSA9IHYyO1xuICAgICAgdjIgPSB0ZW1wO1xuICAgIH1cbiAgICByZXR1cm4gJ2UnICsgdjEgKyAnXycgKyB2MjtcbiAgfVxuXG4gIGRyYXdPbkhvdmVyKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzLCBuZXh0KSB7XG4gICAgdmFyIHRyYWNlciA9IHRoaXM7XG5cbiAgICBjb250ZXh0LnNldExpbmVEYXNoKFs1LCA1XSk7XG4gICAgdmFyIG5vZGVJZHggPSBub2RlLmlkLnN1YnN0cmluZygxKTtcbiAgICB0aGlzLmdyYXBoLmVkZ2VzKCkuZm9yRWFjaChmdW5jdGlvbiAoZWRnZSkge1xuICAgICAgdmFyIGVuZHMgPSBlZGdlLmlkLnN1YnN0cmluZygxKS5zcGxpdChcIl9cIik7XG4gICAgICBpZiAoZW5kc1swXSA9PSBub2RlSWR4KSB7XG4gICAgICAgIHZhciBjb2xvciA9ICcjMGZmJztcbiAgICAgICAgdmFyIHNvdXJjZSA9IG5vZGU7XG4gICAgICAgIHZhciB0YXJnZXQgPSB0cmFjZXIuZ3JhcGgubm9kZXMoJ24nICsgZW5kc1sxXSk7XG4gICAgICAgIHRyYWNlci5kcmF3RWRnZShlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgaWYgKG5leHQpIG5leHQoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICB9IGVsc2UgaWYgKGVuZHNbMV0gPT0gbm9kZUlkeCkge1xuICAgICAgICB2YXIgY29sb3IgPSAnIzBmZic7XG4gICAgICAgIHZhciBzb3VyY2UgPSB0cmFjZXIuZ3JhcGgubm9kZXMoJ24nICsgZW5kc1swXSk7XG4gICAgICAgIHZhciB0YXJnZXQgPSBub2RlO1xuICAgICAgICB0cmFjZXIuZHJhd0VkZ2UoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgIGlmIChuZXh0KSBuZXh0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZHJhd0VkZ2UoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXG4gICAgICBzaXplID0gZWRnZVtwcmVmaXggKyAnc2l6ZSddIHx8IDE7XG5cbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgY29udGV4dC5saW5lV2lkdGggPSBzaXplO1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgY29udGV4dC5tb3ZlVG8oXG4gICAgICBzb3VyY2VbcHJlZml4ICsgJ3gnXSxcbiAgICAgIHNvdXJjZVtwcmVmaXggKyAneSddXG4gICAgKTtcbiAgICBjb250ZXh0LmxpbmVUbyhcbiAgICAgIHRhcmdldFtwcmVmaXggKyAneCddLFxuICAgICAgdGFyZ2V0W3ByZWZpeCArICd5J11cbiAgICApO1xuICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gIH1cbn1cblxuY29uc3QgaW5pdFZpZXcgPSAodHJhY2VyKSA9PiB7XG4gIHRyYWNlci5zLnNldHRpbmdzKHtcbiAgICBkZWZhdWx0RWRnZVR5cGU6ICdkZWYnLFxuICAgIGZ1bmNFZGdlc0RlZihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgIHZhciBjb2xvciA9IHRyYWNlci5nZXRDb2xvcihlZGdlLCBzb3VyY2UsIHRhcmdldCwgc2V0dGluZ3MpO1xuICAgICAgdHJhY2VyLmRyYXdFZGdlKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvb3JkaW5hdGVTeXN0ZW1UcmFjZXI7IiwiY29uc3QgVHJhY2VyID0gcmVxdWlyZSgnLi90cmFjZXInKTtcblxuY29uc3Qge1xuICByZWZpbmVCeVR5cGVcbn0gPSByZXF1aXJlKCcuLi8uLi90cmFjZXJfbWFuYWdlci91dGlsL2luZGV4Jyk7XG5cbmNsYXNzIERpcmVjdGVkR3JhcGhUcmFjZXIgZXh0ZW5kcyBUcmFjZXIge1xuICBzdGF0aWMgZ2V0Q2xhc3NOYW1lKCkge1xuICAgIHJldHVybiAnRGlyZWN0ZWRHcmFwaFRyYWNlcic7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgc3VwZXIobmFtZSk7XG5cbiAgICB0aGlzLmNvbG9yID0ge1xuICAgICAgc2VsZWN0ZWQ6ICcjMGYwJyxcbiAgICAgIHZpc2l0ZWQ6ICcjZjAwJyxcbiAgICAgIGxlZnQ6ICcjMDAwJyxcbiAgICAgIGRlZmF1bHQ6ICcjODg4J1xuICAgIH07XG5cbiAgICBpZiAodGhpcy5pc05ldykgaW5pdFZpZXcodGhpcyk7XG4gIH1cblxuICBfc2V0VHJlZURhdGEoRywgcm9vdCkge1xuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgIHR5cGU6ICdzZXRUcmVlRGF0YScsXG4gICAgICBhcmd1bWVudHM6IGFyZ3VtZW50c1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX3Zpc2l0KHRhcmdldCwgc291cmNlKSB7XG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgdHlwZTogJ3Zpc2l0JyxcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgc291cmNlOiBzb3VyY2VcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9sZWF2ZSh0YXJnZXQsIHNvdXJjZSkge1xuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgIHR5cGU6ICdsZWF2ZScsXG4gICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgIHNvdXJjZTogc291cmNlXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcm9jZXNzU3RlcChzdGVwLCBvcHRpb25zKSB7XG4gICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3NldFRyZWVEYXRhJzpcbiAgICAgICAgdGhpcy5zZXRUcmVlRGF0YS5hcHBseSh0aGlzLCBzdGVwLmFyZ3VtZW50cyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndmlzaXQnOlxuICAgICAgY2FzZSAnbGVhdmUnOlxuICAgICAgICB2YXIgdmlzaXQgPSBzdGVwLnR5cGUgPT0gJ3Zpc2l0JztcbiAgICAgICAgdmFyIHRhcmdldE5vZGUgPSB0aGlzLmdyYXBoLm5vZGVzKHRoaXMubihzdGVwLnRhcmdldCkpO1xuICAgICAgICB2YXIgY29sb3IgPSB2aXNpdCA/IHRoaXMuY29sb3IudmlzaXRlZCA6IHRoaXMuY29sb3IubGVmdDtcbiAgICAgICAgdGFyZ2V0Tm9kZS5jb2xvciA9IGNvbG9yO1xuICAgICAgICBpZiAoc3RlcC5zb3VyY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlZGdlSWQgPSB0aGlzLmUoc3RlcC5zb3VyY2UsIHN0ZXAudGFyZ2V0KTtcbiAgICAgICAgICB2YXIgZWRnZSA9IHRoaXMuZ3JhcGguZWRnZXMoZWRnZUlkKTtcbiAgICAgICAgICBlZGdlLmNvbG9yID0gY29sb3I7XG4gICAgICAgICAgdGhpcy5ncmFwaC5kcm9wRWRnZShlZGdlSWQpLmFkZEVkZ2UoZWRnZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubG9nVHJhY2VyKSB7XG4gICAgICAgICAgdmFyIHNvdXJjZSA9IHN0ZXAuc291cmNlO1xuICAgICAgICAgIGlmIChzb3VyY2UgPT09IHVuZGVmaW5lZCkgc291cmNlID0gJyc7XG4gICAgICAgICAgdGhpcy5sb2dUcmFjZXIucHJpbnQodmlzaXQgPyBzb3VyY2UgKyAnIC0+ICcgKyBzdGVwLnRhcmdldCA6IHNvdXJjZSArICcgPC0gJyArIHN0ZXAudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHN1cGVyLnByb2Nlc3NTdGVwKHN0ZXAsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIHNldFRyZWVEYXRhKEcsIHJvb3QsIHVuZGlyZWN0ZWQpIHtcbiAgICB2YXIgdHJhY2VyID0gdGhpcztcblxuICAgIHJvb3QgPSByb290IHx8IDA7XG4gICAgdmFyIG1heERlcHRoID0gLTE7XG5cbiAgICB2YXIgY2hrID0gbmV3IEFycmF5KEcubGVuZ3RoKTtcbiAgICB2YXIgZ2V0RGVwdGggPSBmdW5jdGlvbiAobm9kZSwgZGVwdGgpIHtcbiAgICAgIGlmIChjaGtbbm9kZV0pIHRocm93IFwidGhlIGdpdmVuIGdyYXBoIGlzIG5vdCBhIHRyZWUgYmVjYXVzZSBpdCBmb3JtcyBhIGNpcmN1aXRcIjtcbiAgICAgIGNoa1tub2RlXSA9IHRydWU7XG4gICAgICBpZiAobWF4RGVwdGggPCBkZXB0aCkgbWF4RGVwdGggPSBkZXB0aDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgR1tub2RlXS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoR1tub2RlXVtpXSkgZ2V0RGVwdGgoaSwgZGVwdGggKyAxKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGdldERlcHRoKHJvb3QsIDEpO1xuXG4gICAgaWYgKHRoaXMuc2V0RGF0YShHLCB1bmRpcmVjdGVkKSkgcmV0dXJuIHRydWU7XG5cbiAgICB2YXIgcGxhY2UgPSBmdW5jdGlvbiAobm9kZSwgeCwgeSkge1xuICAgICAgdmFyIHRlbXAgPSB0cmFjZXIuZ3JhcGgubm9kZXModHJhY2VyLm4obm9kZSkpO1xuICAgICAgdGVtcC54ID0geDtcbiAgICAgIHRlbXAueSA9IHk7XG4gICAgfTtcblxuICAgIHZhciB3Z2FwID0gMSAvIChtYXhEZXB0aCAtIDEpO1xuICAgIHZhciBkZnMgPSBmdW5jdGlvbiAobm9kZSwgZGVwdGgsIHRvcCwgYm90dG9tKSB7XG4gICAgICBwbGFjZShub2RlLCB0b3AgKyBib3R0b20sIGRlcHRoICogd2dhcCk7XG4gICAgICB2YXIgY2hpbGRyZW4gPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBHW25vZGVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChHW25vZGVdW2ldKSBjaGlsZHJlbisrO1xuICAgICAgfVxuICAgICAgdmFyIHZnYXAgPSAoYm90dG9tIC0gdG9wKSAvIGNoaWxkcmVuO1xuICAgICAgdmFyIGNudCA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEdbbm9kZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKEdbbm9kZV1baV0pIGRmcyhpLCBkZXB0aCArIDEsIHRvcCArIHZnYXAgKiBjbnQsIHRvcCArIHZnYXAgKiArK2NudCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBkZnMocm9vdCwgMCwgMCwgMSk7XG5cbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIHNldERhdGEoRywgdW5kaXJlY3RlZCkge1xuICAgIGlmIChzdXBlci5zZXREYXRhLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHJldHVybiB0cnVlO1xuXG4gICAgdGhpcy5ncmFwaC5jbGVhcigpO1xuICAgIGNvbnN0IG5vZGVzID0gW107XG4gICAgY29uc3QgZWRnZXMgPSBbXTtcbiAgICBjb25zdCB1bml0QW5nbGUgPSAyICogTWF0aC5QSSAvIEcubGVuZ3RoO1xuICAgIGxldCBjdXJyZW50QW5nbGUgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgRy5sZW5ndGg7IGkrKykge1xuICAgICAgY3VycmVudEFuZ2xlICs9IHVuaXRBbmdsZTtcbiAgICAgIG5vZGVzLnB1c2goe1xuICAgICAgICBpZDogdGhpcy5uKGkpLFxuICAgICAgICBsYWJlbDogJycgKyBpLFxuICAgICAgICB4OiAuNSArIE1hdGguc2luKGN1cnJlbnRBbmdsZSkgLyAyLFxuICAgICAgICB5OiAuNSArIE1hdGguY29zKGN1cnJlbnRBbmdsZSkgLyAyLFxuICAgICAgICBzaXplOiAxLFxuICAgICAgICBjb2xvcjogdGhpcy5jb2xvci5kZWZhdWx0LFxuICAgICAgICB3ZWlnaHQ6IDBcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodW5kaXJlY3RlZCkge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8PSBpOyBqKyspIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IEdbaV1bal0gfHwgR1tqXVtpXTtcbiAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIGVkZ2VzLnB1c2goe1xuICAgICAgICAgICAgICBpZDogdGhpcy5lKGksIGopLFxuICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMubihpKSxcbiAgICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLm4oaiksXG4gICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLmRlZmF1bHQsXG4gICAgICAgICAgICAgIHNpemU6IDEsXG4gICAgICAgICAgICAgIHdlaWdodDogcmVmaW5lQnlUeXBlKHZhbHVlKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IEdbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBpZiAoR1tpXVtqXSkge1xuICAgICAgICAgICAgZWRnZXMucHVzaCh7XG4gICAgICAgICAgICAgIGlkOiB0aGlzLmUoaSwgaiksXG4gICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5uKGkpLFxuICAgICAgICAgICAgICB0YXJnZXQ6IHRoaXMubihqKSxcbiAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdCxcbiAgICAgICAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgICAgICAgd2VpZ2h0OiByZWZpbmVCeVR5cGUoR1tpXVtqXSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZ3JhcGgucmVhZCh7XG4gICAgICBub2Rlczogbm9kZXMsXG4gICAgICBlZGdlczogZWRnZXNcbiAgICB9KTtcbiAgICB0aGlzLnMuY2FtZXJhLmdvVG8oe1xuICAgICAgeDogMCxcbiAgICAgIHk6IDAsXG4gICAgICBhbmdsZTogMCxcbiAgICAgIHJhdGlvOiAxXG4gICAgfSk7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXNpemUoKSB7XG4gICAgc3VwZXIucmVzaXplKCk7XG5cbiAgICB0aGlzLnMucmVuZGVyZXJzWzBdLnJlc2l6ZSgpO1xuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICBzdXBlci5yZWZyZXNoKCk7XG5cbiAgICB0aGlzLnMucmVmcmVzaCgpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgc3VwZXIuY2xlYXIoKTtcblxuICAgIHRoaXMuY2xlYXJHcmFwaENvbG9yKCk7XG4gIH1cblxuICBjbGVhckdyYXBoQ29sb3IoKSB7XG4gICAgdmFyIHRyYWNlciA9IHRoaXM7XG5cbiAgICB0aGlzLmdyYXBoLm5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgbm9kZS5jb2xvciA9IHRyYWNlci5jb2xvci5kZWZhdWx0O1xuICAgIH0pO1xuICAgIHRoaXMuZ3JhcGguZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChlZGdlKSB7XG4gICAgICBlZGdlLmNvbG9yID0gdHJhY2VyLmNvbG9yLmRlZmF1bHQ7XG4gICAgfSk7XG4gIH1cblxuICBuKHYpIHtcbiAgICByZXR1cm4gJ24nICsgdjtcbiAgfVxuXG4gIGUodjEsIHYyKSB7XG4gICAgcmV0dXJuICdlJyArIHYxICsgJ18nICsgdjI7XG4gIH1cblxuICBnZXRDb2xvcihlZGdlLCBzb3VyY2UsIHRhcmdldCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgY29sb3IgPSBlZGdlLmNvbG9yLFxuICAgICAgZWRnZUNvbG9yID0gc2V0dGluZ3MoJ2VkZ2VDb2xvcicpLFxuICAgICAgZGVmYXVsdE5vZGVDb2xvciA9IHNldHRpbmdzKCdkZWZhdWx0Tm9kZUNvbG9yJyksXG4gICAgICBkZWZhdWx0RWRnZUNvbG9yID0gc2V0dGluZ3MoJ2RlZmF1bHRFZGdlQ29sb3InKTtcbiAgICBpZiAoIWNvbG9yKVxuICAgICAgc3dpdGNoIChlZGdlQ29sb3IpIHtcbiAgICAgICAgY2FzZSAnc291cmNlJzpcbiAgICAgICAgICBjb2xvciA9IHNvdXJjZS5jb2xvciB8fCBkZWZhdWx0Tm9kZUNvbG9yO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0YXJnZXQnOlxuICAgICAgICAgIGNvbG9yID0gdGFyZ2V0LmNvbG9yIHx8IGRlZmF1bHROb2RlQ29sb3I7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29sb3IgPSBkZWZhdWx0RWRnZUNvbG9yO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgcmV0dXJuIGNvbG9yO1xuICB9XG5cbiAgZHJhd0xhYmVsKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgdmFyIGZvbnRTaXplLFxuICAgICAgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnLFxuICAgICAgc2l6ZSA9IG5vZGVbcHJlZml4ICsgJ3NpemUnXTtcblxuICAgIGlmIChzaXplIDwgc2V0dGluZ3MoJ2xhYmVsVGhyZXNob2xkJykpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAoIW5vZGUubGFiZWwgfHwgdHlwZW9mIG5vZGUubGFiZWwgIT09ICdzdHJpbmcnKVxuICAgICAgcmV0dXJuO1xuXG4gICAgZm9udFNpemUgPSAoc2V0dGluZ3MoJ2xhYmVsU2l6ZScpID09PSAnZml4ZWQnKSA/XG4gICAgICBzZXR0aW5ncygnZGVmYXVsdExhYmVsU2l6ZScpIDpcbiAgICBzZXR0aW5ncygnbGFiZWxTaXplUmF0aW8nKSAqIHNpemU7XG5cbiAgICBjb250ZXh0LmZvbnQgPSAoc2V0dGluZ3MoJ2ZvbnRTdHlsZScpID8gc2V0dGluZ3MoJ2ZvbnRTdHlsZScpICsgJyAnIDogJycpICtcbiAgICAgIGZvbnRTaXplICsgJ3B4ICcgKyBzZXR0aW5ncygnZm9udCcpO1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gKHNldHRpbmdzKCdsYWJlbENvbG9yJykgPT09ICdub2RlJykgP1xuICAgICAgKG5vZGUuY29sb3IgfHwgc2V0dGluZ3MoJ2RlZmF1bHROb2RlQ29sb3InKSkgOlxuICAgICAgc2V0dGluZ3MoJ2RlZmF1bHRMYWJlbENvbG9yJyk7XG5cbiAgICBjb250ZXh0LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIGNvbnRleHQuZmlsbFRleHQoXG4gICAgICBub2RlLmxhYmVsLFxuICAgICAgTWF0aC5yb3VuZChub2RlW3ByZWZpeCArICd4J10pLFxuICAgICAgTWF0aC5yb3VuZChub2RlW3ByZWZpeCArICd5J10gKyBmb250U2l6ZSAvIDMpXG4gICAgKTtcbiAgfVxuXG4gIGRyYXdBcnJvdyhlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJyxcbiAgICAgIHNpemUgPSBlZGdlW3ByZWZpeCArICdzaXplJ10gfHwgMSxcbiAgICAgIHRTaXplID0gdGFyZ2V0W3ByZWZpeCArICdzaXplJ10sXG4gICAgICBzWCA9IHNvdXJjZVtwcmVmaXggKyAneCddLFxuICAgICAgc1kgPSBzb3VyY2VbcHJlZml4ICsgJ3knXSxcbiAgICAgIHRYID0gdGFyZ2V0W3ByZWZpeCArICd4J10sXG4gICAgICB0WSA9IHRhcmdldFtwcmVmaXggKyAneSddLFxuICAgICAgYW5nbGUgPSBNYXRoLmF0YW4yKHRZIC0gc1ksIHRYIC0gc1gpLFxuICAgICAgZGlzdCA9IDM7XG4gICAgc1ggKz0gTWF0aC5zaW4oYW5nbGUpICogZGlzdDtcbiAgICB0WCArPSBNYXRoLnNpbihhbmdsZSkgKiBkaXN0O1xuICAgIHNZICs9IC1NYXRoLmNvcyhhbmdsZSkgKiBkaXN0O1xuICAgIHRZICs9IC1NYXRoLmNvcyhhbmdsZSkgKiBkaXN0O1xuICAgIHZhciBhU2l6ZSA9IE1hdGgubWF4KHNpemUgKiAyLjUsIHNldHRpbmdzKCdtaW5BcnJvd1NpemUnKSksXG4gICAgICBkID0gTWF0aC5zcXJ0KE1hdGgucG93KHRYIC0gc1gsIDIpICsgTWF0aC5wb3codFkgLSBzWSwgMikpLFxuICAgICAgYVggPSBzWCArICh0WCAtIHNYKSAqIChkIC0gYVNpemUgLSB0U2l6ZSkgLyBkLFxuICAgICAgYVkgPSBzWSArICh0WSAtIHNZKSAqIChkIC0gYVNpemUgLSB0U2l6ZSkgLyBkLFxuICAgICAgdlggPSAodFggLSBzWCkgKiBhU2l6ZSAvIGQsXG4gICAgICB2WSA9ICh0WSAtIHNZKSAqIGFTaXplIC8gZDtcblxuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHNpemU7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBjb250ZXh0Lm1vdmVUbyhzWCwgc1kpO1xuICAgIGNvbnRleHQubGluZVRvKFxuICAgICAgYVgsXG4gICAgICBhWVxuICAgICk7XG4gICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBjb250ZXh0Lm1vdmVUbyhhWCArIHZYLCBhWSArIHZZKTtcbiAgICBjb250ZXh0LmxpbmVUbyhhWCArIHZZICogMC42LCBhWSAtIHZYICogMC42KTtcbiAgICBjb250ZXh0LmxpbmVUbyhhWCAtIHZZICogMC42LCBhWSArIHZYICogMC42KTtcbiAgICBjb250ZXh0LmxpbmVUbyhhWCArIHZYLCBhWSArIHZZKTtcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgIGNvbnRleHQuZmlsbCgpO1xuICB9XG5cbiAgZHJhd09uSG92ZXIobm9kZSwgY29udGV4dCwgc2V0dGluZ3MsIG5leHQpIHtcbiAgICB2YXIgdHJhY2VyID0gdGhpcztcblxuICAgIGNvbnRleHQuc2V0TGluZURhc2goWzUsIDVdKTtcbiAgICB2YXIgbm9kZUlkeCA9IG5vZGUuaWQuc3Vic3RyaW5nKDEpO1xuICAgIHRoaXMuZ3JhcGguZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChlZGdlKSB7XG4gICAgICB2YXIgZW5kcyA9IGVkZ2UuaWQuc3Vic3RyaW5nKDEpLnNwbGl0KFwiX1wiKTtcbiAgICAgIGlmIChlbmRzWzBdID09IG5vZGVJZHgpIHtcbiAgICAgICAgdmFyIGNvbG9yID0gJyMwZmYnO1xuICAgICAgICB2YXIgc291cmNlID0gbm9kZTtcbiAgICAgICAgdmFyIHRhcmdldCA9IHRyYWNlci5ncmFwaC5ub2RlcygnbicgKyBlbmRzWzFdKTtcbiAgICAgICAgdHJhY2VyLmRyYXdBcnJvdyhlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgaWYgKG5leHQpIG5leHQoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICB9IGVsc2UgaWYgKGVuZHNbMV0gPT0gbm9kZUlkeCkge1xuICAgICAgICB2YXIgY29sb3IgPSAnI2ZmMCc7XG4gICAgICAgIHZhciBzb3VyY2UgPSB0cmFjZXIuZ3JhcGgubm9kZXMoJ24nICsgZW5kc1swXSk7XG4gICAgICAgIHZhciB0YXJnZXQgPSBub2RlO1xuICAgICAgICB0cmFjZXIuZHJhd0Fycm93KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICBpZiAobmV4dCkgbmV4dChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBpbml0VmlldyA9ICh0cmFjZXIpID0+IHtcbiAgdHJhY2VyLnMgPSB0cmFjZXIuY2Fwc3VsZS5zID0gbmV3IHNpZ21hKHtcbiAgICByZW5kZXJlcjoge1xuICAgICAgY29udGFpbmVyOiB0cmFjZXIuJGNvbnRhaW5lclswXSxcbiAgICAgIHR5cGU6ICdjYW52YXMnXG4gICAgfSxcbiAgICBzZXR0aW5nczoge1xuICAgICAgbWluQXJyb3dTaXplOiA4LFxuICAgICAgZGVmYXVsdEVkZ2VUeXBlOiAnYXJyb3cnLFxuICAgICAgbWF4RWRnZVNpemU6IDIuNSxcbiAgICAgIGxhYmVsVGhyZXNob2xkOiA0LFxuICAgICAgZm9udDogJ1JvYm90bycsXG4gICAgICBkZWZhdWx0TGFiZWxDb2xvcjogJyNmZmYnLFxuICAgICAgem9vbU1pbjogMC42LFxuICAgICAgem9vbU1heDogMS4yLFxuICAgICAgc2tpcEVycm9yczogdHJ1ZSxcbiAgICAgIG1pbk5vZGVTaXplOiAuNSxcbiAgICAgIG1heE5vZGVTaXplOiAxMixcbiAgICAgIGxhYmVsU2l6ZTogJ3Byb3BvcnRpb25hbCcsXG4gICAgICBsYWJlbFNpemVSYXRpbzogMS4zLFxuICAgICAgZnVuY0xhYmVsc0RlZihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICB0cmFjZXIuZHJhd0xhYmVsKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgIH0sXG4gICAgICBmdW5jSG92ZXJzRGVmKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzLCBuZXh0KSB7XG4gICAgICAgIHRyYWNlci5kcmF3T25Ib3Zlcihub2RlLCBjb250ZXh0LCBzZXR0aW5ncywgbmV4dCk7XG4gICAgICB9LFxuICAgICAgZnVuY0VkZ2VzQXJyb3coZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBjb2xvciA9IHRyYWNlci5nZXRDb2xvcihlZGdlLCBzb3VyY2UsIHRhcmdldCwgc2V0dGluZ3MpO1xuICAgICAgICB0cmFjZXIuZHJhd0Fycm93KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHNpZ21hLnBsdWdpbnMuZHJhZ05vZGVzKHRyYWNlci5zLCB0cmFjZXIucy5yZW5kZXJlcnNbMF0pO1xuICB0cmFjZXIuZ3JhcGggPSB0cmFjZXIuY2Fwc3VsZS5ncmFwaCA9IHRyYWNlci5zLmdyYXBoO1xufTtcblxuc2lnbWEuY2FudmFzLmxhYmVscy5kZWYgPSBmdW5jdGlvbiAobm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgdmFyIGZ1bmMgPSBzZXR0aW5ncygnZnVuY0xhYmVsc0RlZicpO1xuICBpZiAoZnVuYykge1xuICAgIGZ1bmMobm9kZSwgY29udGV4dCwgc2V0dGluZ3MpO1xuICB9XG59O1xuc2lnbWEuY2FudmFzLmhvdmVycy5kZWYgPSBmdW5jdGlvbiAobm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgdmFyIGZ1bmMgPSBzZXR0aW5ncygnZnVuY0hvdmVyc0RlZicpO1xuICBpZiAoZnVuYykge1xuICAgIGZ1bmMobm9kZSwgY29udGV4dCwgc2V0dGluZ3MpO1xuICB9XG59O1xuc2lnbWEuY2FudmFzLmVkZ2VzLmRlZiA9IGZ1bmN0aW9uIChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgdmFyIGZ1bmMgPSBzZXR0aW5ncygnZnVuY0VkZ2VzRGVmJyk7XG4gIGlmIChmdW5jKSB7XG4gICAgZnVuYyhlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpO1xuICB9XG59O1xuc2lnbWEuY2FudmFzLmVkZ2VzLmFycm93ID0gZnVuY3Rpb24gKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xuICB2YXIgZnVuYyA9IHNldHRpbmdzKCdmdW5jRWRnZXNBcnJvdycpO1xuICBpZiAoZnVuYykge1xuICAgIGZ1bmMoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3RlZEdyYXBoVHJhY2VyOyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgVHJhY2VyID0gcmVxdWlyZSgnLi90cmFjZXInKTtcbmNvbnN0IExvZ1RyYWNlciA9IHJlcXVpcmUoJy4vbG9nJyk7XG5jb25zdCBBcnJheTFEVHJhY2VyID0gcmVxdWlyZSgnLi9hcnJheTFkJyk7XG5jb25zdCBBcnJheTJEVHJhY2VyID0gcmVxdWlyZSgnLi9hcnJheTJkJyk7XG5jb25zdCBDaGFydFRyYWNlciA9IHJlcXVpcmUoJy4vY2hhcnQnKTtcbmNvbnN0IENvb3JkaW5hdGVTeXN0ZW1UcmFjZXIgPSByZXF1aXJlKCcuL2Nvb3JkaW5hdGVfc3lzdGVtJyk7XG5jb25zdCBEaXJlY3RlZEdyYXBoVHJhY2VyID0gcmVxdWlyZSgnLi9kaXJlY3RlZF9ncmFwaCcpO1xuY29uc3QgVW5kaXJlY3RlZEdyYXBoVHJhY2VyID0gcmVxdWlyZSgnLi91bmRpcmVjdGVkX2dyYXBoJyk7XG5jb25zdCBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIgPSByZXF1aXJlKCcuL3dlaWdodGVkX2RpcmVjdGVkX2dyYXBoJyk7XG5jb25zdCBXZWlnaHRlZFVuZGlyZWN0ZWRHcmFwaFRyYWNlciA9IHJlcXVpcmUoJy4vd2VpZ2h0ZWRfdW5kaXJlY3RlZF9ncmFwaCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgVHJhY2VyLFxuICBMb2dUcmFjZXIsXG4gIEFycmF5MURUcmFjZXIsXG4gIEFycmF5MkRUcmFjZXIsXG4gIENoYXJ0VHJhY2VyLFxuICBDb29yZGluYXRlU3lzdGVtVHJhY2VyLFxuICBEaXJlY3RlZEdyYXBoVHJhY2VyLFxuICBVbmRpcmVjdGVkR3JhcGhUcmFjZXIsXG4gIFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlcixcbiAgV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGhUcmFjZXJcbn07IiwiY29uc3QgVHJhY2VyID0gcmVxdWlyZSgnLi90cmFjZXInKTtcblxuY2xhc3MgTG9nVHJhY2VyIGV4dGVuZHMgVHJhY2VyIHtcbiAgc3RhdGljIGdldENsYXNzTmFtZSgpIHtcbiAgICByZXR1cm4gJ0xvZ1RyYWNlcic7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgc3VwZXIobmFtZSk7XG5cbiAgICBpZiAodGhpcy5pc05ldykgaW5pdFZpZXcodGhpcyk7XG4gIH1cblxuICBfcHJpbnQobXNnKSB7XG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgdHlwZTogJ3ByaW50JyxcbiAgICAgIG1zZzogbXNnXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcm9jZXNzU3RlcChzdGVwLCBvcHRpb25zKSB7XG4gICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3ByaW50JzpcbiAgICAgICAgdGhpcy5wcmludChzdGVwLm1zZyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJlZnJlc2goKSB7XG4gICAgdGhpcy5zY3JvbGxUb0VuZChNYXRoLm1pbig1MCwgdGhpcy5pbnRlcnZhbCkpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgc3VwZXIuY2xlYXIoKTtcblxuICAgIHRoaXMuJHdyYXBwZXIuZW1wdHkoKTtcbiAgfVxuXG4gIHByaW50KG1lc3NhZ2UpIHtcbiAgICB0aGlzLiR3cmFwcGVyLmFwcGVuZCgkKCc8c3Bhbj4nKS5hcHBlbmQobWVzc2FnZSArICc8YnIvPicpKTtcbiAgfVxuXG4gIHNjcm9sbFRvRW5kKGR1cmF0aW9uKSB7XG4gICAgdGhpcy4kY29udGFpbmVyLmFuaW1hdGUoe1xuICAgICAgc2Nyb2xsVG9wOiB0aGlzLiRjb250YWluZXJbMF0uc2Nyb2xsSGVpZ2h0XG4gICAgfSwgZHVyYXRpb24pO1xuICB9XG59XG5cbmNvbnN0IGluaXRWaWV3ID0gKHRyYWNlcikgPT4ge1xuICB0cmFjZXIuJHdyYXBwZXIgPSB0cmFjZXIuY2Fwc3VsZS4kd3JhcHBlciA9ICQoJzxkaXYgY2xhc3M9XCJ3cmFwcGVyXCI+Jyk7XG4gIHRyYWNlci4kY29udGFpbmVyLmFwcGVuZCh0cmFjZXIuJHdyYXBwZXIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2dUcmFjZXI7IiwiY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5cbmNvbnN0IHtcbiAgdG9KU09OLFxuICBmcm9tSlNPTlxufSA9IHJlcXVpcmUoJy4uLy4uL3RyYWNlcl9tYW5hZ2VyL3V0aWwvaW5kZXgnKTtcblxuY2xhc3MgVHJhY2VyIHtcbiAgc3RhdGljIGdldENsYXNzTmFtZSgpIHtcbiAgICByZXR1cm4gJ1RyYWNlcic7XG4gIH1cbiAgXG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLm1vZHVsZSA9IHRoaXMuY29uc3RydWN0b3I7XG5cbiAgICB0aGlzLm1hbmFnZXIgPSBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpO1xuICAgIHRoaXMuY2Fwc3VsZSA9IHRoaXMubWFuYWdlci5hbGxvY2F0ZSh0aGlzKTtcbiAgICAkLmV4dGVuZCh0aGlzLCB0aGlzLmNhcHN1bGUpO1xuXG4gICAgdGhpcy5zZXROYW1lKG5hbWUpO1xuICB9XG5cbiAgX3NldERhdGEoLi4uYXJncykge1xuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgIHR5cGU6ICdzZXREYXRhJyxcbiAgICAgIGFyZ3M6IHRvSlNPTihhcmdzKVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX2NsZWFyKCkge1xuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgIHR5cGU6ICdjbGVhcidcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF93YWl0KCkge1xuICAgIHRoaXMubWFuYWdlci5uZXdTdGVwKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcm9jZXNzU3RlcChzdGVwLCBvcHRpb25zKSB7XG4gICAgY29uc3Qge1xuICAgICAgdHlwZSxcbiAgICAgIGFyZ3NcbiAgICB9ID0gc3RlcDtcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnc2V0RGF0YSc6XG4gICAgICAgIHRoaXMuc2V0RGF0YSguLi5mcm9tSlNPTihhcmdzKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2xlYXInOlxuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHNldE5hbWUobmFtZSkge1xuICAgIGxldCAkbmFtZTtcbiAgICBpZiAodGhpcy5pc05ldykge1xuICAgICAgJG5hbWUgPSAkKCc8c3BhbiBjbGFzcz1cIm5hbWVcIj4nKTtcbiAgICAgIHRoaXMuJGNvbnRhaW5lci5hcHBlbmQoJG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkbmFtZSA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCdzcGFuLm5hbWUnKTtcbiAgICB9XG4gICAgJG5hbWUudGV4dChuYW1lIHx8IHRoaXMuZGVmYXVsdE5hbWUpO1xuICB9XG5cbiAgc2V0RGF0YSgpIHtcbiAgICBjb25zdCBkYXRhID0gdG9KU09OKGFyZ3VtZW50cyk7XG4gICAgaWYgKCF0aGlzLmlzTmV3ICYmIHRoaXMubGFzdERhdGEgPT09IGRhdGEpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB0aGlzLmxhc3REYXRhID0gdGhpcy5jYXBzdWxlLmxhc3REYXRhID0gZGF0YTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXNpemUoKSB7XG4gIH1cblxuICByZWZyZXNoKCkge1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gIH1cblxuICBhdHRhY2godHJhY2VyKSB7XG4gICAgaWYgKHRyYWNlci5tb2R1bGUgPT09IExvZ1RyYWNlcikge1xuICAgICAgdGhpcy5sb2dUcmFjZXIgPSB0cmFjZXI7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbW91c2Vkb3duKGUpIHtcbiAgfVxuXG4gIG1vdXNlbW92ZShlKSB7XG4gIH1cblxuICBtb3VzZXVwKGUpIHtcbiAgfVxuXG4gIG1vdXNld2hlZWwoZSkge1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2VyOyIsImNvbnN0IERpcmVjdGVkR3JhcGhUcmFjZXIgPSByZXF1aXJlKCcuL2RpcmVjdGVkX2dyYXBoJyk7XG5cbmNsYXNzIFVuZGlyZWN0ZWRHcmFwaFRyYWNlciBleHRlbmRzIERpcmVjdGVkR3JhcGhUcmFjZXIge1xuICBzdGF0aWMgZ2V0Q2xhc3NOYW1lKCkge1xuICAgIHJldHVybiAnVW5kaXJlY3RlZEdyYXBoVHJhY2VyJztcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICBzdXBlcihuYW1lKTtcblxuICAgIGlmICh0aGlzLmlzTmV3KSBpbml0Vmlldyh0aGlzKTtcbiAgfVxuXG4gIHNldFRyZWVEYXRhKEcsIHJvb3QpIHtcbiAgICByZXR1cm4gc3VwZXIuc2V0VHJlZURhdGEoRywgcm9vdCwgdHJ1ZSk7XG4gIH1cblxuICBzZXREYXRhKEcpIHtcbiAgICByZXR1cm4gc3VwZXIuc2V0RGF0YShHLCB0cnVlKTtcbiAgfVxuXG4gIGUodjEsIHYyKSB7XG4gICAgaWYgKHYxID4gdjIpIHtcbiAgICAgIHZhciB0ZW1wID0gdjE7XG4gICAgICB2MSA9IHYyO1xuICAgICAgdjIgPSB0ZW1wO1xuICAgIH1cbiAgICByZXR1cm4gJ2UnICsgdjEgKyAnXycgKyB2MjtcbiAgfVxuXG4gIGRyYXdPbkhvdmVyKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzLCBuZXh0KSB7XG4gICAgdmFyIHRyYWNlciA9IHRoaXM7XG5cbiAgICBjb250ZXh0LnNldExpbmVEYXNoKFs1LCA1XSk7XG4gICAgdmFyIG5vZGVJZHggPSBub2RlLmlkLnN1YnN0cmluZygxKTtcbiAgICB0aGlzLmdyYXBoLmVkZ2VzKCkuZm9yRWFjaChmdW5jdGlvbiAoZWRnZSkge1xuICAgICAgdmFyIGVuZHMgPSBlZGdlLmlkLnN1YnN0cmluZygxKS5zcGxpdChcIl9cIik7XG4gICAgICBpZiAoZW5kc1swXSA9PSBub2RlSWR4KSB7XG4gICAgICAgIHZhciBjb2xvciA9ICcjMGZmJztcbiAgICAgICAgdmFyIHNvdXJjZSA9IG5vZGU7XG4gICAgICAgIHZhciB0YXJnZXQgPSB0cmFjZXIuZ3JhcGgubm9kZXMoJ24nICsgZW5kc1sxXSk7XG4gICAgICAgIHRyYWNlci5kcmF3RWRnZShlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgaWYgKG5leHQpIG5leHQoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICB9IGVsc2UgaWYgKGVuZHNbMV0gPT0gbm9kZUlkeCkge1xuICAgICAgICB2YXIgY29sb3IgPSAnIzBmZic7XG4gICAgICAgIHZhciBzb3VyY2UgPSB0cmFjZXIuZ3JhcGgubm9kZXMoJ24nICsgZW5kc1swXSk7XG4gICAgICAgIHZhciB0YXJnZXQgPSBub2RlO1xuICAgICAgICB0cmFjZXIuZHJhd0VkZ2UoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgIGlmIChuZXh0KSBuZXh0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZHJhd0VkZ2UoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXG4gICAgICBzaXplID0gZWRnZVtwcmVmaXggKyAnc2l6ZSddIHx8IDE7XG5cbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgY29udGV4dC5saW5lV2lkdGggPSBzaXplO1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgY29udGV4dC5tb3ZlVG8oXG4gICAgICBzb3VyY2VbcHJlZml4ICsgJ3gnXSxcbiAgICAgIHNvdXJjZVtwcmVmaXggKyAneSddXG4gICAgKTtcbiAgICBjb250ZXh0LmxpbmVUbyhcbiAgICAgIHRhcmdldFtwcmVmaXggKyAneCddLFxuICAgICAgdGFyZ2V0W3ByZWZpeCArICd5J11cbiAgICApO1xuICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gIH1cbn1cblxuY29uc3QgaW5pdFZpZXcgPSAodHJhY2VyKSA9PiB7XG4gIHRyYWNlci5zLnNldHRpbmdzKHtcbiAgICBkZWZhdWx0RWRnZVR5cGU6ICdkZWYnLFxuICAgIGZ1bmNFZGdlc0RlZihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgIHZhciBjb2xvciA9IHRyYWNlci5nZXRDb2xvcihlZGdlLCBzb3VyY2UsIHRhcmdldCwgc2V0dGluZ3MpO1xuICAgICAgdHJhY2VyLmRyYXdFZGdlKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVuZGlyZWN0ZWRHcmFwaFRyYWNlcjsiLCJjb25zdCBEaXJlY3RlZEdyYXBoVHJhY2VyID0gcmVxdWlyZSgnLi9kaXJlY3RlZF9ncmFwaCcpO1xuXG5jb25zdCB7XG4gIHJlZmluZUJ5VHlwZVxufSA9IHJlcXVpcmUoJy4uLy4uL3RyYWNlcl9tYW5hZ2VyL3V0aWwvaW5kZXgnKTtcblxuY2xhc3MgV2VpZ2h0ZWREaXJlY3RlZEdyYXBoVHJhY2VyIGV4dGVuZHMgRGlyZWN0ZWRHcmFwaFRyYWNlciB7XG4gIHN0YXRpYyBnZXRDbGFzc05hbWUoKSB7XG4gICAgcmV0dXJuICdXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXInO1xuICB9XG5cbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHN1cGVyKG5hbWUpO1xuXG4gICAgaWYgKHRoaXMuaXNOZXcpIGluaXRWaWV3KHRoaXMpO1xuICB9XG5cbiAgX3dlaWdodCh0YXJnZXQsIHdlaWdodCkge1xuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgIHR5cGU6ICd3ZWlnaHQnLFxuICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICB3ZWlnaHQ6IHdlaWdodFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX3Zpc2l0KHRhcmdldCwgc291cmNlLCB3ZWlnaHQpIHtcbiAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICB0eXBlOiAndmlzaXQnLFxuICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgIHdlaWdodDogd2VpZ2h0XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfbGVhdmUodGFyZ2V0LCBzb3VyY2UsIHdlaWdodCkge1xuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgIHR5cGU6ICdsZWF2ZScsXG4gICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgd2VpZ2h0OiB3ZWlnaHRcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHByb2Nlc3NTdGVwKHN0ZXAsIG9wdGlvbnMpIHtcbiAgICBzd2l0Y2ggKHN0ZXAudHlwZSkge1xuICAgICAgY2FzZSAnd2VpZ2h0JzpcbiAgICAgICAgdmFyIHRhcmdldE5vZGUgPSB0aGlzLmdyYXBoLm5vZGVzKHRoaXMubihzdGVwLnRhcmdldCkpO1xuICAgICAgICBpZiAoc3RlcC53ZWlnaHQgIT09IHVuZGVmaW5lZCkgdGFyZ2V0Tm9kZS53ZWlnaHQgPSByZWZpbmVCeVR5cGUoc3RlcC53ZWlnaHQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Zpc2l0JzpcbiAgICAgIGNhc2UgJ2xlYXZlJzpcbiAgICAgICAgdmFyIHZpc2l0ID0gc3RlcC50eXBlID09ICd2aXNpdCc7XG4gICAgICAgIHZhciB0YXJnZXROb2RlID0gdGhpcy5ncmFwaC5ub2Rlcyh0aGlzLm4oc3RlcC50YXJnZXQpKTtcbiAgICAgICAgdmFyIGNvbG9yID0gdmlzaXQgPyBzdGVwLndlaWdodCA9PT0gdW5kZWZpbmVkID8gdGhpcy5jb2xvci5zZWxlY3RlZCA6IHRoaXMuY29sb3IudmlzaXRlZCA6IHRoaXMuY29sb3IubGVmdDtcbiAgICAgICAgdGFyZ2V0Tm9kZS5jb2xvciA9IGNvbG9yO1xuICAgICAgICBpZiAoc3RlcC53ZWlnaHQgIT09IHVuZGVmaW5lZCkgdGFyZ2V0Tm9kZS53ZWlnaHQgPSByZWZpbmVCeVR5cGUoc3RlcC53ZWlnaHQpO1xuICAgICAgICBpZiAoc3RlcC5zb3VyY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlZGdlSWQgPSB0aGlzLmUoc3RlcC5zb3VyY2UsIHN0ZXAudGFyZ2V0KTtcbiAgICAgICAgICB2YXIgZWRnZSA9IHRoaXMuZ3JhcGguZWRnZXMoZWRnZUlkKTtcbiAgICAgICAgICBlZGdlLmNvbG9yID0gY29sb3I7XG4gICAgICAgICAgdGhpcy5ncmFwaC5kcm9wRWRnZShlZGdlSWQpLmFkZEVkZ2UoZWRnZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubG9nVHJhY2VyKSB7XG4gICAgICAgICAgdmFyIHNvdXJjZSA9IHN0ZXAuc291cmNlO1xuICAgICAgICAgIGlmIChzb3VyY2UgPT09IHVuZGVmaW5lZCkgc291cmNlID0gJyc7XG4gICAgICAgICAgdGhpcy5sb2dUcmFjZXIucHJpbnQodmlzaXQgPyBzb3VyY2UgKyAnIC0+ICcgKyBzdGVwLnRhcmdldCA6IHNvdXJjZSArICcgPC0gJyArIHN0ZXAudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHN1cGVyLnByb2Nlc3NTdGVwKHN0ZXAsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHN1cGVyLmNsZWFyKCk7XG5cbiAgICB0aGlzLmNsZWFyV2VpZ2h0cygpO1xuICB9XG5cbiAgY2xlYXJXZWlnaHRzKCkge1xuICAgIHRoaXMuZ3JhcGgubm9kZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICBub2RlLndlaWdodCA9IDA7XG4gICAgfSk7XG4gIH1cblxuICBkcmF3RWRnZVdlaWdodChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgaWYgKHNvdXJjZSA9PSB0YXJnZXQpXG4gICAgICByZXR1cm47XG5cbiAgICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnLFxuICAgICAgc2l6ZSA9IGVkZ2VbcHJlZml4ICsgJ3NpemUnXSB8fCAxO1xuXG4gICAgaWYgKHNpemUgPCBzZXR0aW5ncygnZWRnZUxhYmVsVGhyZXNob2xkJykpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAoMCA9PT0gc2V0dGluZ3MoJ2VkZ2VMYWJlbFNpemVQb3dSYXRpbycpKVxuICAgICAgdGhyb3cgJ1wiZWRnZUxhYmVsU2l6ZVBvd1JhdGlvXCIgbXVzdCBub3QgYmUgMC4nO1xuXG4gICAgdmFyIGZvbnRTaXplLFxuICAgICAgeCA9IChzb3VyY2VbcHJlZml4ICsgJ3gnXSArIHRhcmdldFtwcmVmaXggKyAneCddKSAvIDIsXG4gICAgICB5ID0gKHNvdXJjZVtwcmVmaXggKyAneSddICsgdGFyZ2V0W3ByZWZpeCArICd5J10pIC8gMixcbiAgICAgIGRYID0gdGFyZ2V0W3ByZWZpeCArICd4J10gLSBzb3VyY2VbcHJlZml4ICsgJ3gnXSxcbiAgICAgIGRZID0gdGFyZ2V0W3ByZWZpeCArICd5J10gLSBzb3VyY2VbcHJlZml4ICsgJ3knXSxcbiAgICAgIGFuZ2xlID0gTWF0aC5hdGFuMihkWSwgZFgpO1xuXG4gICAgZm9udFNpemUgPSAoc2V0dGluZ3MoJ2VkZ2VMYWJlbFNpemUnKSA9PT0gJ2ZpeGVkJykgP1xuICAgICAgc2V0dGluZ3MoJ2RlZmF1bHRFZGdlTGFiZWxTaXplJykgOlxuICAgIHNldHRpbmdzKCdkZWZhdWx0RWRnZUxhYmVsU2l6ZScpICpcbiAgICBzaXplICpcbiAgICBNYXRoLnBvdyhzaXplLCAtMSAvIHNldHRpbmdzKCdlZGdlTGFiZWxTaXplUG93UmF0aW8nKSk7XG5cbiAgICBjb250ZXh0LnNhdmUoKTtcblxuICAgIGlmIChlZGdlLmFjdGl2ZSkge1xuICAgICAgY29udGV4dC5mb250ID0gW1xuICAgICAgICBzZXR0aW5ncygnYWN0aXZlRm9udFN0eWxlJyksXG4gICAgICAgIGZvbnRTaXplICsgJ3B4JyxcbiAgICAgICAgc2V0dGluZ3MoJ2FjdGl2ZUZvbnQnKSB8fCBzZXR0aW5ncygnZm9udCcpXG4gICAgICBdLmpvaW4oJyAnKTtcblxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGV4dC5mb250ID0gW1xuICAgICAgICBzZXR0aW5ncygnZm9udFN0eWxlJyksXG4gICAgICAgIGZvbnRTaXplICsgJ3B4JyxcbiAgICAgICAgc2V0dGluZ3MoJ2ZvbnQnKVxuICAgICAgXS5qb2luKCcgJyk7XG5cbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XG4gICAgfVxuXG4gICAgY29udGV4dC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICBjb250ZXh0LnRleHRCYXNlbGluZSA9ICdhbHBoYWJldGljJztcblxuICAgIGNvbnRleHQudHJhbnNsYXRlKHgsIHkpO1xuICAgIGNvbnRleHQucm90YXRlKGFuZ2xlKTtcbiAgICBjb250ZXh0LmZpbGxUZXh0KFxuICAgICAgZWRnZS53ZWlnaHQsXG4gICAgICAwLFxuICAgICAgKC1zaXplIC8gMikgLSAzXG4gICAgKTtcblxuICAgIGNvbnRleHQucmVzdG9yZSgpO1xuICB9XG5cbiAgZHJhd05vZGVXZWlnaHQobm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgZm9udFNpemUsXG4gICAgICBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXG4gICAgICBzaXplID0gbm9kZVtwcmVmaXggKyAnc2l6ZSddO1xuXG4gICAgaWYgKHNpemUgPCBzZXR0aW5ncygnbGFiZWxUaHJlc2hvbGQnKSlcbiAgICAgIHJldHVybjtcblxuICAgIGZvbnRTaXplID0gKHNldHRpbmdzKCdsYWJlbFNpemUnKSA9PT0gJ2ZpeGVkJykgP1xuICAgICAgc2V0dGluZ3MoJ2RlZmF1bHRMYWJlbFNpemUnKSA6XG4gICAgc2V0dGluZ3MoJ2xhYmVsU2l6ZVJhdGlvJykgKiBzaXplO1xuXG4gICAgY29udGV4dC5mb250ID0gKHNldHRpbmdzKCdmb250U3R5bGUnKSA/IHNldHRpbmdzKCdmb250U3R5bGUnKSArICcgJyA6ICcnKSArXG4gICAgICBmb250U2l6ZSArICdweCAnICsgc2V0dGluZ3MoJ2ZvbnQnKTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IChzZXR0aW5ncygnbGFiZWxDb2xvcicpID09PSAnbm9kZScpID9cbiAgICAgIChub2RlLmNvbG9yIHx8IHNldHRpbmdzKCdkZWZhdWx0Tm9kZUNvbG9yJykpIDpcbiAgICAgIHNldHRpbmdzKCdkZWZhdWx0TGFiZWxDb2xvcicpO1xuXG4gICAgY29udGV4dC50ZXh0QWxpZ24gPSAnbGVmdCc7XG4gICAgY29udGV4dC5maWxsVGV4dChcbiAgICAgIG5vZGUud2VpZ2h0LFxuICAgICAgTWF0aC5yb3VuZChub2RlW3ByZWZpeCArICd4J10gKyBzaXplICogMS41KSxcbiAgICAgIE1hdGgucm91bmQobm9kZVtwcmVmaXggKyAneSddICsgZm9udFNpemUgLyAzKVxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgaW5pdFZpZXcgPSAodHJhY2VyKSA9PiB7XG4gIHRyYWNlci5zLnNldHRpbmdzKHtcbiAgICBlZGdlTGFiZWxTaXplOiAncHJvcG9ydGlvbmFsJyxcbiAgICBkZWZhdWx0RWRnZUxhYmVsU2l6ZTogMjAsXG4gICAgZWRnZUxhYmVsU2l6ZVBvd1JhdGlvOiAwLjgsXG4gICAgZnVuY0xhYmVsc0RlZihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgdHJhY2VyLmRyYXdOb2RlV2VpZ2h0KG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgIHRyYWNlci5kcmF3TGFiZWwobm9kZSwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgIH0sXG4gICAgZnVuY0hvdmVyc0RlZihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgdHJhY2VyLmRyYXdPbkhvdmVyKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzLCB0cmFjZXIuZHJhd0VkZ2VXZWlnaHQpO1xuICAgIH0sXG4gICAgZnVuY0VkZ2VzQXJyb3coZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICB2YXIgY29sb3IgPSB0cmFjZXIuZ2V0Q29sb3IoZWRnZSwgc291cmNlLCB0YXJnZXQsIHNldHRpbmdzKTtcbiAgICAgIHRyYWNlci5kcmF3QXJyb3coZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICB0cmFjZXIuZHJhd0VkZ2VXZWlnaHQoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gV2VpZ2h0ZWREaXJlY3RlZEdyYXBoVHJhY2VyOyIsImNvbnN0IFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlciA9IHJlcXVpcmUoJy4vd2VpZ2h0ZWRfZGlyZWN0ZWRfZ3JhcGgnKTtcbmNvbnN0IFVuZGlyZWN0ZWRHcmFwaFRyYWNlciA9IHJlcXVpcmUoJy4vdW5kaXJlY3RlZF9ncmFwaCcpO1xuXG5jbGFzcyBXZWlnaHRlZFVuZGlyZWN0ZWRHcmFwaFRyYWNlciBleHRlbmRzIFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlciB7XG4gIHN0YXRpYyBnZXRDbGFzc05hbWUoKSB7XG4gICAgcmV0dXJuICdXZWlnaHRlZFVuZGlyZWN0ZWRHcmFwaFRyYWNlcic7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgc3VwZXIobmFtZSk7XG5cbiAgICB0aGlzLmUgPSBVbmRpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLmU7XG4gICAgdGhpcy5kcmF3T25Ib3ZlciA9IFVuZGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUuZHJhd09uSG92ZXI7XG4gICAgdGhpcy5kcmF3RWRnZSA9IFVuZGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUuZHJhd0VkZ2U7XG5cbiAgICBpZiAodGhpcy5pc05ldykgaW5pdFZpZXcodGhpcyk7XG4gIH1cblxuICBzZXRUcmVlRGF0YShHLCByb290KSB7XG4gICAgcmV0dXJuIHN1cGVyLnNldFRyZWVEYXRhKEcsIHJvb3QsIHRydWUpO1xuICB9XG5cbiAgc2V0RGF0YShHKSB7XG4gICAgcmV0dXJuIHN1cGVyLnNldERhdGEoRywgdHJ1ZSk7XG4gIH1cblxuICBkcmF3RWRnZVdlaWdodChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJztcbiAgICBpZiAoc291cmNlW3ByZWZpeCArICd4J10gPiB0YXJnZXRbcHJlZml4ICsgJ3gnXSkge1xuICAgICAgdmFyIHRlbXAgPSBzb3VyY2U7XG4gICAgICBzb3VyY2UgPSB0YXJnZXQ7XG4gICAgICB0YXJnZXQgPSB0ZW1wO1xuICAgIH1cbiAgICBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLmRyYXdFZGdlV2VpZ2h0LmNhbGwodGhpcywgZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gIH1cbn1cblxuY29uc3QgaW5pdFZpZXcgPSAodHJhY2VyKSA9PiB7XG4gIHRyYWNlci5zLnNldHRpbmdzKHtcbiAgICBkZWZhdWx0RWRnZVR5cGU6ICdkZWYnLFxuICAgIGZ1bmNFZGdlc0RlZihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgIHZhciBjb2xvciA9IHRyYWNlci5nZXRDb2xvcihlZGdlLCBzb3VyY2UsIHRhcmdldCwgc2V0dGluZ3MpO1xuICAgICAgdHJhY2VyLmRyYXdFZGdlKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgdHJhY2VyLmRyYXdFZGdlV2VpZ2h0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyOyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICh1cmwpID0+IHtcblxuICByZXR1cm4gcmVxdWVzdCh1cmwsIHtcbiAgICB0eXBlOiAnR0VUJ1xuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgnLi9yZXF1ZXN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsKSB7XG4gIHJldHVybiByZXF1ZXN0KHVybCwge1xuICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgdHlwZTogJ0dFVCdcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCwgZGF0YSkge1xuICByZXR1cm4gcmVxdWVzdCh1cmwsIHtcbiAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgIHR5cGU6ICdQT1NUJyxcbiAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgUlNWUCA9IHJlcXVpcmUoJ3JzdnAnKTtcbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xuXG5jb25zdCB7XG4gIGFqYXgsXG4gIGV4dGVuZFxufSA9ICQ7XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCwgb3B0aW9ucyA9IHt9KSB7XG4gIGFwcC5zZXRJc0xvYWRpbmcodHJ1ZSk7XG5cbiAgcmV0dXJuIG5ldyBSU1ZQLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IHtcbiAgICAgIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgYXBwLnNldElzTG9hZGluZyhmYWxzZSk7XG4gICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSxcbiAgICAgIGVycm9yKHJlYXNvbikge1xuICAgICAgICBhcHAuc2V0SXNMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgcmVqZWN0KHJlYXNvbik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IG9wdHMgPSBleHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zLCBjYWxsYmFja3MsIHtcbiAgICAgIHVybFxuICAgIH0pO1xuXG4gICAgYWpheChvcHRzKTtcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vYXBwJyk7XG5jb25zdCBUb2FzdCA9IHJlcXVpcmUoJy4uL2RvbS90b2FzdCcpO1xuXG5jb25zdCBjaGVja0xvYWRpbmcgPSAoKSA9PiB7XG4gIGlmIChhcHAuZ2V0SXNMb2FkaW5nKCkpIHtcbiAgICBUb2FzdC5zaG93RXJyb3JUb2FzdCgnV2FpdCB1bnRpbCBpdCBjb21wbGV0ZXMgbG9hZGluZyBvZiBwcmV2aW91cyBmaWxlLicpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IGdldFBhcmFtZXRlckJ5TmFtZSA9IChuYW1lKSA9PiB7XG4gIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYFs/Jl0ke25hbWV9KD0oW14mI10qKXwmfCN8JClgKTtcblxuICBjb25zdCByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xuXG4gIGlmICghcmVzdWx0cyB8fCByZXN1bHRzLmxlbmd0aCAhPT0gMykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgWywgLCBpZF0gPSByZXN1bHRzO1xuXG4gIHJldHVybiBpZDtcbn07XG5cbmNvbnN0IGdldEhhc2hWYWx1ZSA9IChrZXkpPT4ge1xuICBpZiAoIWtleSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoMSk7XG4gIGNvbnN0IHBhcmFtcyA9IGhhc2ggPyBoYXNoLnNwbGl0KCcmJykgOiBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJhbXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwYWlyID0gcGFyYW1zW2ldLnNwbGl0KCc9Jyk7XG4gICAgaWYgKHBhaXJbMF0gPT09IGtleSkge1xuICAgICAgcmV0dXJuIHBhaXJbMV07XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuY29uc3Qgc2V0SGFzaFZhbHVlID0gKGtleSwgdmFsdWUpPT4ge1xuICBpZiAoIWtleSB8fCAhdmFsdWUpIHJldHVybjtcbiAgY29uc3QgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKTtcbiAgY29uc3QgcGFyYW1zID0gaGFzaCA/IGhhc2guc3BsaXQoJyYnKSA6IFtdO1xuXG4gIGxldCBmb3VuZCA9IGZhbHNlO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmFtcy5sZW5ndGggJiYgIWZvdW5kOyBpKyspIHtcbiAgICBjb25zdCBwYWlyID0gcGFyYW1zW2ldLnNwbGl0KCc9Jyk7XG4gICAgaWYgKHBhaXJbMF0gPT09IGtleSkge1xuICAgICAgcGFpclsxXSA9IHZhbHVlO1xuICAgICAgcGFyYW1zW2ldID0gcGFpci5qb2luKCc9Jyk7XG4gICAgICBmb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG4gIGlmICghZm91bmQpIHtcbiAgICBwYXJhbXMucHVzaChba2V5LCB2YWx1ZV0uam9pbignPScpKTtcbiAgfVxuXG4gIGNvbnN0IG5ld0hhc2ggPSBwYXJhbXMuam9pbignJicpO1xuICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IGAjJHtuZXdIYXNofWA7XG59O1xuXG5jb25zdCByZW1vdmVIYXNoVmFsdWUgPSAoa2V5KSA9PiB7XG4gIGlmICgha2V5KSByZXR1cm47XG4gIGNvbnN0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoMSk7XG4gIGNvbnN0IHBhcmFtcyA9IGhhc2ggPyBoYXNoLnNwbGl0KCcmJykgOiBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmFtcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHBhaXIgPSBwYXJhbXNbaV0uc3BsaXQoJz0nKTtcbiAgICBpZiAocGFpclswXSA9PT0ga2V5KSB7XG4gICAgICBwYXJhbXMuc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgbmV3SGFzaCA9IHBhcmFtcy5qb2luKCcmJyk7XG4gIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gYCMke25ld0hhc2h9YDtcbn07XG5cbmNvbnN0IHNldFBhdGggPSAoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSkgPT4ge1xuICBjb25zdCBwYXRoID0gY2F0ZWdvcnkgPyBjYXRlZ29yeSArIChhbGdvcml0aG0gPyBgLyR7YWxnb3JpdGhtfWAgKyAoZmlsZSA/IGAvJHtmaWxlfWAgOiAnJykgOiAnJykgOiAnJztcbiAgc2V0SGFzaFZhbHVlKCdwYXRoJywgcGF0aCk7XG59O1xuXG5jb25zdCBnZXRQYXRoID0gKCkgPT4ge1xuICBjb25zdCBoYXNoID0gZ2V0SGFzaFZhbHVlKCdwYXRoJyk7XG4gIGlmIChoYXNoKSB7XG4gICAgY29uc3QgWyBjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlIF0gPSBoYXNoLnNwbGl0KCcvJyk7XG4gICAgcmV0dXJuIHsgY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNoZWNrTG9hZGluZyxcbiAgZ2V0UGFyYW1ldGVyQnlOYW1lLFxuICBnZXRIYXNoVmFsdWUsXG4gIHNldEhhc2hWYWx1ZSxcbiAgcmVtb3ZlSGFzaFZhbHVlLFxuICBzZXRQYXRoLFxuICBnZXRQYXRoXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBsb2FkQWxnb3JpdGhtID0gcmVxdWlyZSgnLi9sb2FkX2FsZ29yaXRobScpO1xuY29uc3QgbG9hZENhdGVnb3JpZXMgPSByZXF1aXJlKCcuL2xvYWRfY2F0ZWdvcmllcycpO1xuY29uc3QgbG9hZEZpbGUgPSByZXF1aXJlKCcuL2xvYWRfZmlsZScpO1xuY29uc3QgbG9hZFNjcmF0Y2hQYXBlciA9IHJlcXVpcmUoJy4vbG9hZF9zY3JhdGNoX3BhcGVyJyk7XG5jb25zdCBzaGFyZVNjcmF0Y2hQYXBlciA9IHJlcXVpcmUoJy4vc2hhcmVfc2NyYXRjaF9wYXBlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbG9hZEFsZ29yaXRobSxcbiAgbG9hZENhdGVnb3JpZXMsXG4gIGxvYWRGaWxlLFxuICBsb2FkU2NyYXRjaFBhcGVyLFxuICBzaGFyZVNjcmF0Y2hQYXBlclxufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGdldEpTT04gPSByZXF1aXJlKCcuL2FqYXgvZ2V0X2pzb24nKTtcblxuY29uc3Qge1xuICBnZXRBbGdvcml0aG1EaXJcbn0gPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChjYXRlZ29yeSwgYWxnb3JpdGhtKSA9PiB7XG4gIGNvbnN0IGRpciA9IGdldEFsZ29yaXRobURpcihjYXRlZ29yeSwgYWxnb3JpdGhtKTtcbiAgcmV0dXJuIGdldEpTT04oYCR7ZGlyfWRlc2MuanNvbmApO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGdldEpTT04gPSByZXF1aXJlKCcuL2FqYXgvZ2V0X2pzb24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG4gIHJldHVybiBnZXRKU09OKCcuL2FsZ29yaXRobS9jYXRlZ29yeS5qc29uJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgUlNWUCA9IHJlcXVpcmUoJ3JzdnAnKTtcblxuY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vYXBwJyk7XG5cbmNvbnN0IHtcbiAgZ2V0RmlsZURpcixcbiAgaXNTY3JhdGNoUGFwZXJcbn0gPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5jb25zdCB7XG4gIGNoZWNrTG9hZGluZyxcbiAgc2V0UGF0aFxufSA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xuXG5jb25zdCBnZXQgPSByZXF1aXJlKCcuL2FqYXgvZ2V0Jyk7XG5cbmNvbnN0IGxvYWREYXRhQW5kQ29kZSA9IChkaXIpID0+IHtcbiAgcmV0dXJuIFJTVlAuaGFzaCh7XG4gICAgZGF0YTogZ2V0KGAke2Rpcn1kYXRhLmpzYCksXG4gICAgY29kZTogZ2V0KGAke2Rpcn1jb2RlLmpzYClcbiAgfSk7XG59O1xuXG5jb25zdCBsb2FkRmlsZUFuZFVwZGF0ZUNvbnRlbnQgPSAoZGlyKSA9PiB7XG4gIGFwcC5nZXRFZGl0b3IoKS5jbGVhckNvbnRlbnQoKTtcblxuICByZXR1cm4gbG9hZERhdGFBbmRDb2RlKGRpcikudGhlbigoY29udGVudCkgPT4ge1xuICAgIGFwcC51cGRhdGVDYWNoZWRGaWxlKGRpciwgY29udGVudCk7XG4gICAgYXBwLmdldEVkaXRvcigpLnNldENvbnRlbnQoY29udGVudCk7XG4gIH0pO1xufTtcblxuY29uc3QgY2FjaGVkQ29udGVudEV4aXN0cyA9IChjYWNoZWRGaWxlKSA9PiB7XG4gIHJldHVybiBjYWNoZWRGaWxlICYmXG4gICAgY2FjaGVkRmlsZS5kYXRhICE9PSB1bmRlZmluZWQgJiZcbiAgICBjYWNoZWRGaWxlLmNvZGUgIT09IHVuZGVmaW5lZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUsIGV4cGxhbmF0aW9uKSA9PiB7XG4gIHJldHVybiBuZXcgUlNWUC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBpZiAoY2hlY2tMb2FkaW5nKCkpIHtcbiAgICAgIHJlamVjdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNTY3JhdGNoUGFwZXIoY2F0ZWdvcnkpKSB7XG4gICAgICAgIHNldFBhdGgoY2F0ZWdvcnksIGFwcC5nZXRMb2FkZWRTY3JhdGNoKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0UGF0aChjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlKTtcbiAgICAgIH1cbiAgICAgICQoJyNleHBsYW5hdGlvbicpLmh0bWwoZXhwbGFuYXRpb24pO1xuXG4gICAgICBsZXQgZGlyID0gZ2V0RmlsZURpcihjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlKTtcbiAgICAgIGFwcC5zZXRMYXN0RmlsZVVzZWQoZGlyKTtcbiAgICAgIGNvbnN0IGNhY2hlZEZpbGUgPSBhcHAuZ2V0Q2FjaGVkRmlsZShkaXIpO1xuXG4gICAgICBpZiAoY2FjaGVkQ29udGVudEV4aXN0cyhjYWNoZWRGaWxlKSkge1xuICAgICAgICBhcHAuZ2V0RWRpdG9yKCkuc2V0Q29udGVudChjYWNoZWRGaWxlKTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9hZEZpbGVBbmRVcGRhdGVDb250ZW50KGRpcikudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgUlNWUCA9IHJlcXVpcmUoJ3JzdnAnKTtcbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuXG5jb25zdCB7XG4gIGdldEZpbGVEaXJcbn0gPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5jb25zdCBnZXRKU09OID0gcmVxdWlyZSgnLi9hamF4L2dldF9qc29uJyk7XG5jb25zdCBsb2FkQWxnb3JpdGhtID0gcmVxdWlyZSgnLi9sb2FkX2FsZ29yaXRobScpO1xuXG5jb25zdCBleHRyYWN0R2lzdENvZGUgPSAoZmlsZXMsIG5hbWUpID0+IGZpbGVzW2Ake25hbWV9LmpzYF0uY29udGVudDtcblxubW9kdWxlLmV4cG9ydHMgPSAoZ2lzdElEKSA9PiB7XG4gIHJldHVybiBuZXcgUlNWUC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBhcHAuc2V0TG9hZGVkU2NyYXRjaChnaXN0SUQpO1xuXG4gICAgZ2V0SlNPTihgaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9naXN0cy8ke2dpc3RJRH1gKS50aGVuKCh7XG4gICAgICBmaWxlc1xuICAgIH0pID0+IHtcblxuICAgICAgY29uc3QgY2F0ZWdvcnkgPSAnc2NyYXRjaCc7XG4gICAgICBjb25zdCBhbGdvcml0aG0gPSBnaXN0SUQ7XG5cbiAgICAgIGxvYWRBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IGFsZ29EYXRhID0gZXh0cmFjdEdpc3RDb2RlKGZpbGVzLCAnZGF0YScpO1xuICAgICAgICBjb25zdCBhbGdvQ29kZSA9IGV4dHJhY3RHaXN0Q29kZShmaWxlcywgJ2NvZGUnKTtcblxuICAgICAgICAvLyB1cGRhdGUgc2NyYXRjaCBwYXBlciBhbGdvIGNvZGUgd2l0aCB0aGUgbG9hZGVkIGdpc3QgY29kZVxuICAgICAgICBjb25zdCBkaXIgPSBnZXRGaWxlRGlyKGNhdGVnb3J5LCBhbGdvcml0aG0sICdzY3JhdGNoX3BhcGVyJyk7XG4gICAgICAgIGFwcC51cGRhdGVDYWNoZWRGaWxlKGRpciwge1xuICAgICAgICAgIGRhdGE6IGFsZ29EYXRhLFxuICAgICAgICAgIGNvZGU6IGFsZ29Db2RlLFxuICAgICAgICAgICdDUkVESVQubWQnOiAnU2hhcmVkIGJ5IGFuIGFub255bW91cyB1c2VyIGZyb20gaHR0cDovL3BhcmtqczgxNC5naXRodWIuaW8vQWxnb3JpdGhtVmlzdWFsaXplcidcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgY2F0ZWdvcnksXG4gICAgICAgICAgYWxnb3JpdGhtLFxuICAgICAgICAgIGRhdGFcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBSU1ZQID0gcmVxdWlyZSgncnN2cCcpO1xuY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vYXBwJyk7XG5cbmNvbnN0IHBvc3RKU09OID0gcmVxdWlyZSgnLi9hamF4L3Bvc3RfanNvbicpO1xuXG5jb25zdCB7XG4gIHNldFBhdGhcbn0gPSByZXF1aXJlKCcuL2hlbHBlcnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG4gIHJldHVybiBuZXcgUlNWUC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgIGNvbnN0IHtcbiAgICAgIGRhdGFFZGl0b3IsXG4gICAgICBjb2RlRWRpdG9yXG4gICAgfSA9IGFwcC5nZXRFZGl0b3IoKTtcblxuICAgIGNvbnN0IGdpc3QgPSB7XG4gICAgICAnZGVzY3JpcHRpb24nOiAndGVtcCcsXG4gICAgICAncHVibGljJzogdHJ1ZSxcbiAgICAgICdmaWxlcyc6IHtcbiAgICAgICAgJ2RhdGEuanMnOiB7XG4gICAgICAgICAgJ2NvbnRlbnQnOiBkYXRhRWRpdG9yLmdldFZhbHVlKClcbiAgICAgICAgfSxcbiAgICAgICAgJ2NvZGUuanMnOiB7XG4gICAgICAgICAgJ2NvbnRlbnQnOiBjb2RlRWRpdG9yLmdldFZhbHVlKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBwb3N0SlNPTignaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9naXN0cycsIGdpc3QpLnRoZW4oKHtcbiAgICAgIGlkXG4gICAgfSkgPT4ge1xuICAgICAgYXBwLnNldExvYWRlZFNjcmF0Y2goaWQpO1xuICAgICAgc2V0UGF0aCgnc2NyYXRjaCcsIGlkKTtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgaHJlZlxuICAgICAgfSA9IGxvY2F0aW9uO1xuICAgICAgJCgnI2FsZ29yaXRobScpLmh0bWwoJ1NoYXJlZCcpO1xuICAgICAgcmVzb2x2ZShocmVmKTtcbiAgICB9KTtcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgVHJhY2VyTWFuYWdlciA9IHJlcXVpcmUoJy4vbWFuYWdlcicpO1xuY29uc3QgVHJhY2VyID0gcmVxdWlyZSgnLi4vbW9kdWxlL3RyYWNlci90cmFjZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgaW5pdCgpIHtcbiAgICBjb25zdCB0bSA9IG5ldyBUcmFjZXJNYW5hZ2VyKCk7XG4gICAgVHJhY2VyLnByb3RvdHlwZS5tYW5hZ2VyID0gdG07XG4gICAgcmV0dXJuIHRtO1xuICB9XG5cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBNb2R1bGVDb250YWluZXIgPSByZXF1aXJlKCcuLi9kb20vbW9kdWxlX2NvbnRhaW5lcicpO1xuY29uc3QgVG9wTWVudSA9IHJlcXVpcmUoJy4uL2RvbS90b3BfbWVudScpO1xuXG5jb25zdCB7XG4gIGVhY2gsXG4gIGV4dGVuZCxcbiAgZ3JlcFxufSA9ICQ7XG5cbmNvbnN0IHN0ZXBMaW1pdCA9IDFlNjtcblxuY29uc3QgVHJhY2VyTWFuYWdlciA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy50aW1lciA9IG51bGw7XG4gIHRoaXMucGF1c2UgPSBmYWxzZTtcbiAgdGhpcy5jYXBzdWxlcyA9IFtdO1xuICB0aGlzLmludGVydmFsID0gNTAwO1xufTtcblxuVHJhY2VyTWFuYWdlci5wcm90b3R5cGUgPSB7XG5cbiAgYWRkKHRyYWNlcikge1xuXG4gICAgY29uc3QgJGNvbnRhaW5lciA9IE1vZHVsZUNvbnRhaW5lci5jcmVhdGUoKTtcblxuICAgIGNvbnN0IGNhcHN1bGUgPSB7XG4gICAgICBtb2R1bGU6IHRyYWNlci5tb2R1bGUsXG4gICAgICB0cmFjZXIsXG4gICAgICBhbGxvY2F0ZWQ6IHRydWUsXG4gICAgICBkZWZhdWx0TmFtZTogbnVsbCxcbiAgICAgICRjb250YWluZXIsXG4gICAgICBpc05ldzogdHJ1ZVxuICAgIH07XG5cbiAgICB0aGlzLmNhcHN1bGVzLnB1c2goY2Fwc3VsZSk7XG4gICAgcmV0dXJuIGNhcHN1bGU7XG4gIH0sXG5cbiAgYWxsb2NhdGUobmV3VHJhY2VyKSB7XG4gICAgbGV0IHNlbGVjdGVkQ2Fwc3VsZSA9IG51bGw7XG4gICAgbGV0IGNvdW50ID0gMDtcblxuICAgIGVhY2godGhpcy5jYXBzdWxlcywgKGksIGNhcHN1bGUpID0+IHtcbiAgICAgIGlmIChjYXBzdWxlLm1vZHVsZSA9PT0gbmV3VHJhY2VyLm1vZHVsZSkge1xuICAgICAgICBjb3VudCsrO1xuICAgICAgICBpZiAoIWNhcHN1bGUuYWxsb2NhdGVkKSB7XG4gICAgICAgICAgY2Fwc3VsZS50cmFjZXIgPSBuZXdUcmFjZXI7XG4gICAgICAgICAgY2Fwc3VsZS5hbGxvY2F0ZWQgPSB0cnVlO1xuICAgICAgICAgIGNhcHN1bGUuaXNOZXcgPSBmYWxzZTtcbiAgICAgICAgICBzZWxlY3RlZENhcHN1bGUgPSBjYXBzdWxlO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHNlbGVjdGVkQ2Fwc3VsZSA9PT0gbnVsbCkge1xuICAgICAgY291bnQrKztcbiAgICAgIHNlbGVjdGVkQ2Fwc3VsZSA9IHRoaXMuYWRkKG5ld1RyYWNlcik7XG4gICAgfVxuXG4gICAgY29uc3QgY2xhc3NOYW1lID0gbmV3VHJhY2VyLm1vZHVsZS5nZXRDbGFzc05hbWUoKTtcbiAgICBzZWxlY3RlZENhcHN1bGUuZGVmYXVsdE5hbWUgPSBgJHtjbGFzc05hbWV9ICR7Y291bnR9YDtcbiAgICBzZWxlY3RlZENhcHN1bGUub3JkZXIgPSB0aGlzLm9yZGVyKys7XG4gICAgcmV0dXJuIHNlbGVjdGVkQ2Fwc3VsZTtcbiAgfSxcblxuICBkZWFsbG9jYXRlQWxsKCkge1xuICAgIHRoaXMub3JkZXIgPSAwO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICBlYWNoKHRoaXMuY2Fwc3VsZXMsIChpLCBjYXBzdWxlKSA9PiB7XG4gICAgICBjYXBzdWxlLmFsbG9jYXRlZCA9IGZhbHNlO1xuICAgIH0pO1xuICB9LFxuXG4gIHJlbW92ZVVuYWxsb2NhdGVkKCkge1xuICAgIGxldCBjaGFuZ2VkID0gZmFsc2U7XG5cbiAgICB0aGlzLmNhcHN1bGVzID0gZ3JlcCh0aGlzLmNhcHN1bGVzLCAoY2Fwc3VsZSkgPT4ge1xuICAgICAgbGV0IHJlbW92ZWQgPSAhY2Fwc3VsZS5hbGxvY2F0ZWQ7XG5cbiAgICAgIGlmIChjYXBzdWxlLmlzTmV3IHx8IHJlbW92ZWQpIHtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgICBjYXBzdWxlLiRjb250YWluZXIucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAhcmVtb3ZlZDtcbiAgICB9KTtcblxuICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICB0aGlzLnBsYWNlKCk7XG4gICAgfVxuICB9LFxuXG4gIHBsYWNlKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNhcHN1bGVzXG4gICAgfSA9IHRoaXM7XG5cbiAgICBlYWNoKGNhcHN1bGVzLCAoaSwgY2Fwc3VsZSkgPT4ge1xuICAgICAgbGV0IHdpZHRoID0gMTAwO1xuICAgICAgbGV0IGhlaWdodCA9ICgxMDAgLyBjYXBzdWxlcy5sZW5ndGgpO1xuICAgICAgbGV0IHRvcCA9IGhlaWdodCAqIGNhcHN1bGUub3JkZXI7XG5cbiAgICAgIGNhcHN1bGUuJGNvbnRhaW5lci5jc3Moe1xuICAgICAgICB0b3A6IGAke3RvcH0lYCxcbiAgICAgICAgd2lkdGg6IGAke3dpZHRofSVgLFxuICAgICAgICBoZWlnaHQ6IGAke2hlaWdodH0lYFxuICAgICAgfSk7XG5cbiAgICAgIGNhcHN1bGUudHJhY2VyLnJlc2l6ZSgpO1xuICAgIH0pO1xuICB9LFxuXG4gIHJlc2l6ZSgpIHtcbiAgICB0aGlzLmNvbW1hbmQoJ3Jlc2l6ZScpO1xuICB9LFxuXG4gIGlzUGF1c2UoKSB7XG4gICAgcmV0dXJuIHRoaXMucGF1c2U7XG4gIH0sXG5cbiAgc2V0SW50ZXJ2YWwoaW50ZXJ2YWwpIHtcbiAgICBUb3BNZW51LnNldEludGVydmFsKGludGVydmFsKTtcbiAgfSxcblxuICByZXNldCgpIHtcbiAgICB0aGlzLnRyYWNlcyA9IFtdO1xuICAgIHRoaXMudHJhY2VJbmRleCA9IC0xO1xuICAgIHRoaXMuc3RlcENudCA9IDA7XG4gICAgaWYgKHRoaXMudGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcbiAgICB9XG4gICAgdGhpcy5jb21tYW5kKCdjbGVhcicpO1xuICB9LFxuXG4gIHB1c2hTdGVwKGNhcHN1bGUsIHN0ZXApIHtcbiAgICBpZiAodGhpcy5zdGVwQ250KysgPiBzdGVwTGltaXQpIHRocm93IFwiVHJhY2VyJ3Mgc3RhY2sgb3ZlcmZsb3dcIjtcbiAgICBsZXQgbGVuID0gdGhpcy50cmFjZXMubGVuZ3RoO1xuICAgIGxldCBsYXN0ID0gW107XG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgdGhpcy50cmFjZXMucHVzaChsYXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGFzdCA9IHRoaXMudHJhY2VzW2xlbiAtIDFdO1xuICAgIH1cbiAgICBsYXN0LnB1c2goZXh0ZW5kKHN0ZXAsIHtcbiAgICAgIGNhcHN1bGVcbiAgICB9KSk7XG4gIH0sXG5cbiAgbmV3U3RlcCgpIHtcbiAgICB0aGlzLnRyYWNlcy5wdXNoKFtdKTtcbiAgfSxcblxuICBwYXVzZVN0ZXAoKSB7XG4gICAgaWYgKHRoaXMudHJhY2VJbmRleCA8IDApIHJldHVybjtcbiAgICB0aGlzLnBhdXNlID0gdHJ1ZTtcbiAgICBpZiAodGhpcy50aW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgIH1cbiAgICBUb3BNZW51LmFjdGl2YXRlQnRuUGF1c2UoKTtcbiAgfSxcblxuICByZXN1bWVTdGVwKCkge1xuICAgIHRoaXMucGF1c2UgPSBmYWxzZTtcbiAgICB0aGlzLnN0ZXAodGhpcy50cmFjZUluZGV4ICsgMSk7XG4gICAgVG9wTWVudS5kZWFjdGl2YXRlQnRuUGF1c2UoKTtcbiAgfSxcblxuICBzdGVwKGksIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHRyYWNlciA9IHRoaXM7XG5cbiAgICBpZiAoaXNOYU4oaSkgfHwgaSA+PSB0aGlzLnRyYWNlcy5sZW5ndGggfHwgaSA8IDApIHJldHVybjtcblxuICAgIHRoaXMudHJhY2VJbmRleCA9IGk7XG4gICAgY29uc3QgdHJhY2UgPSB0aGlzLnRyYWNlc1tpXTtcbiAgICB0cmFjZS5mb3JFYWNoKChzdGVwKSA9PiB7XG4gICAgICBzdGVwLmNhcHN1bGUudHJhY2VyLnByb2Nlc3NTdGVwKHN0ZXAsIG9wdGlvbnMpO1xuICAgIH0pO1xuXG4gICAgaWYgKCFvcHRpb25zLnZpcnR1YWwpIHtcbiAgICAgIHRoaXMuY29tbWFuZCgncmVmcmVzaCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhdXNlKSByZXR1cm47XG5cbiAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXRyYWNlci5uZXh0U3RlcChvcHRpb25zKSkge1xuICAgICAgICBUb3BNZW51LnJlc2V0VG9wTWVudUJ1dHRvbnMoKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzLmludGVydmFsKTtcbiAgfSxcblxuICBwcmV2U3RlcChvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmNvbW1hbmQoJ2NsZWFyJyk7XG5cbiAgICBjb25zdCBmaW5hbEluZGV4ID0gdGhpcy50cmFjZUluZGV4IC0gMTtcbiAgICBpZiAoZmluYWxJbmRleCA8IDApIHtcbiAgICAgIHRoaXMudHJhY2VJbmRleCA9IC0xO1xuICAgICAgdGhpcy5jb21tYW5kKCdyZWZyZXNoJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaW5hbEluZGV4OyBpKyspIHtcbiAgICAgIHRoaXMuc3RlcChpLCBleHRlbmQob3B0aW9ucywge1xuICAgICAgICB2aXJ0dWFsOiB0cnVlXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGVwKGZpbmFsSW5kZXgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIG5leHRTdGVwKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGZpbmFsSW5kZXggPSB0aGlzLnRyYWNlSW5kZXggKyAxO1xuICAgIGlmIChmaW5hbEluZGV4ID49IHRoaXMudHJhY2VzLmxlbmd0aCkge1xuICAgICAgdGhpcy50cmFjZUluZGV4ID0gdGhpcy50cmFjZXMubGVuZ3RoIC0gMTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLnN0ZXAoZmluYWxJbmRleCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgdmlzdWFsaXplKCkge1xuICAgIHRoaXMudHJhY2VJbmRleCA9IC0xO1xuICAgIHRoaXMucmVzdW1lU3RlcCgpO1xuICB9LFxuXG4gIGNvbW1hbmQoLi4uYXJncykge1xuICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICBlYWNoKHRoaXMuY2Fwc3VsZXMsIChpLCBjYXBzdWxlKSA9PiB7XG4gICAgICBpZiAoY2Fwc3VsZS5hbGxvY2F0ZWQpIHtcbiAgICAgICAgY2Fwc3VsZS50cmFjZXIubW9kdWxlLnByb3RvdHlwZVtmdW5jdGlvbk5hbWVdLmFwcGx5KGNhcHN1bGUudHJhY2VyLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBmaW5kT3duZXIoY29udGFpbmVyKSB7XG4gICAgbGV0IHNlbGVjdGVkQ2Fwc3VsZSA9IG51bGw7XG4gICAgZWFjaCh0aGlzLmNhcHN1bGVzLCAoaSwgY2Fwc3VsZSkgPT4ge1xuICAgICAgaWYgKGNhcHN1bGUuJGNvbnRhaW5lclswXSA9PT0gY29udGFpbmVyKSB7XG4gICAgICAgIHNlbGVjdGVkQ2Fwc3VsZSA9IGNhcHN1bGU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc2VsZWN0ZWRDYXBzdWxlLnRyYWNlcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZXJNYW5hZ2VyO1xuIiwiY29uc3Qge1xuICBwYXJzZVxufSA9IEpTT047XG5cbmNvbnN0IGZyb21KU09OID0gKG9iaikgPT4ge1xuICByZXR1cm4gcGFyc2Uob2JqLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gJ0luZmluaXR5JyA/IEluZmluaXR5IDogdmFsdWU7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmcm9tSlNPTjsiLCJjb25zdCB0b0pTT04gPSByZXF1aXJlKCcuL3RvX2pzb24nKTtcbmNvbnN0IGZyb21KU09OID0gcmVxdWlyZSgnLi9mcm9tX2pzb24nKTtcbmNvbnN0IHJlZmluZUJ5VHlwZSA9IHJlcXVpcmUoJy4vcmVmaW5lX2J5X3R5cGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHRvSlNPTixcbiAgZnJvbUpTT04sXG4gIHJlZmluZUJ5VHlwZVxufTsiLCJjb25zdCByZWZpbmVCeVR5cGUgPSAoaXRlbSkgPT4ge1xuICBzd2l0Y2ggKHR5cGVvZihpdGVtKSkge1xuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gcmVmaW5lTnVtYmVyKGl0ZW0pO1xuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIHJlZmluZUJvb2xlYW4oaXRlbSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiByZWZpbmVTdHJpbmcoaXRlbSk7XG4gIH1cbn07XG5cbmNvbnN0IHJlZmluZVN0cmluZyA9IChzdHIpID0+IHtcbiAgcmV0dXJuIHN0ciA9PT0gJycgPyAnICcgOiBzdHI7XG59O1xuXG5jb25zdCByZWZpbmVOdW1iZXIgPSAobnVtKSA9PiB7XG4gIHJldHVybiBudW0gPT09IEluZmluaXR5ID8gJ+KInicgOiBudW07XG59O1xuXG5jb25zdCByZWZpbmVCb29sZWFuID0gKGJvb2wpID0+IHtcbiAgcmV0dXJuIGJvb2wgPyAnVCcgOiAnRic7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlZmluZUJ5VHlwZTtcbiIsImNvbnN0IHtcbiAgc3RyaW5naWZ5XG59ID0gSlNPTjtcblxuY29uc3QgdG9KU09OID0gKG9iaikgPT4ge1xuICByZXR1cm4gc3RyaW5naWZ5KG9iaiwgKGtleSwgdmFsdWUpID0+IHtcbiAgICByZXR1cm4gdmFsdWUgPT09IEluZmluaXR5ID8gJ0luZmluaXR5JyA6IHZhbHVlO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdG9KU09OOyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgaXNTY3JhdGNoUGFwZXIgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSkgPT4ge1xuICByZXR1cm4gY2F0ZWdvcnkgPT0gJ3NjcmF0Y2gnO1xufTtcblxuY29uc3QgZ2V0QWxnb3JpdGhtRGlyID0gKGNhdGVnb3J5LCBhbGdvcml0aG0pID0+IHtcbiAgaWYgKGlzU2NyYXRjaFBhcGVyKGNhdGVnb3J5KSkgcmV0dXJuICcuL2FsZ29yaXRobS9zY3JhdGNoX3BhcGVyLyc7XG4gIHJldHVybiBgLi9hbGdvcml0aG0vJHtjYXRlZ29yeX0vJHthbGdvcml0aG19L2A7XG59O1xuXG5jb25zdCBnZXRGaWxlRGlyID0gKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUpID0+IHtcbiAgaWYgKGlzU2NyYXRjaFBhcGVyKGNhdGVnb3J5KSkgcmV0dXJuICcuL2FsZ29yaXRobS9zY3JhdGNoX3BhcGVyLyc7XG4gIHJldHVybiBgLi9hbGdvcml0aG0vJHtjYXRlZ29yeX0vJHthbGdvcml0aG19LyR7ZmlsZX0vYDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc1NjcmF0Y2hQYXBlcixcbiAgZ2V0QWxnb3JpdGhtRGlyLFxuICBnZXRGaWxlRGlyXG59OyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyohXG4gKiBAb3ZlcnZpZXcgUlNWUCAtIGEgdGlueSBpbXBsZW1lbnRhdGlvbiBvZiBQcm9taXNlcy9BKy5cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE0IFllaHVkYSBLYXR6LCBUb20gRGFsZSwgU3RlZmFuIFBlbm5lciBhbmQgY29udHJpYnV0b3JzXG4gKiBAbGljZW5zZSAgIExpY2Vuc2VkIHVuZGVyIE1JVCBsaWNlbnNlXG4gKiAgICAgICAgICAgIFNlZSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vdGlsZGVpby9yc3ZwLmpzL21hc3Rlci9MSUNFTlNFXG4gKiBAdmVyc2lvbiAgIDMuMi4xXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHV0aWxzJCRvYmplY3RPckZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJyB8fCAodHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGwpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHV0aWxzJCRpc0Z1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCR1dGlscyQkaXNNYXliZVRoZW5hYmxlKHgpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkdXRpbHMkJF9pc0FycmF5O1xuICAgIGlmICghQXJyYXkuaXNBcnJheSkge1xuICAgICAgbGliJHJzdnAkdXRpbHMkJF9pc0FycmF5ID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpYiRyc3ZwJHV0aWxzJCRfaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHV0aWxzJCRpc0FycmF5ID0gbGliJHJzdnAkdXRpbHMkJF9pc0FycmF5O1xuXG4gICAgdmFyIGxpYiRyc3ZwJHV0aWxzJCRub3cgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpOyB9O1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkdXRpbHMkJEYoKSB7IH1cblxuICAgIHZhciBsaWIkcnN2cCR1dGlscyQkb19jcmVhdGUgPSAoT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiAobykge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU2Vjb25kIGFyZ3VtZW50IG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgICAgIH1cbiAgICAgIGxpYiRyc3ZwJHV0aWxzJCRGLnByb3RvdHlwZSA9IG87XG4gICAgICByZXR1cm4gbmV3IGxpYiRyc3ZwJHV0aWxzJCRGKCk7XG4gICAgfSk7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkZXZlbnRzJCRpbmRleE9mKGNhbGxiYWNrcywgY2FsbGJhY2spIHtcbiAgICAgIGZvciAodmFyIGk9MCwgbD1jYWxsYmFja3MubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgICBpZiAoY2FsbGJhY2tzW2ldID09PSBjYWxsYmFjaykgeyByZXR1cm4gaTsgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkZXZlbnRzJCRjYWxsYmFja3NGb3Iob2JqZWN0KSB7XG4gICAgICB2YXIgY2FsbGJhY2tzID0gb2JqZWN0Ll9wcm9taXNlQ2FsbGJhY2tzO1xuXG4gICAgICBpZiAoIWNhbGxiYWNrcykge1xuICAgICAgICBjYWxsYmFja3MgPSBvYmplY3QuX3Byb21pc2VDYWxsYmFja3MgPSB7fTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNhbGxiYWNrcztcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkZXZlbnRzJCRkZWZhdWx0ID0ge1xuXG4gICAgICAvKipcbiAgICAgICAgYFJTVlAuRXZlbnRUYXJnZXQubWl4aW5gIGV4dGVuZHMgYW4gb2JqZWN0IHdpdGggRXZlbnRUYXJnZXQgbWV0aG9kcy4gRm9yXG4gICAgICAgIEV4YW1wbGU6XG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICB2YXIgb2JqZWN0ID0ge307XG5cbiAgICAgICAgUlNWUC5FdmVudFRhcmdldC5taXhpbihvYmplY3QpO1xuXG4gICAgICAgIG9iamVjdC5vbignZmluaXNoZWQnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIC8vIGhhbmRsZSBldmVudFxuICAgICAgICB9KTtcblxuICAgICAgICBvYmplY3QudHJpZ2dlcignZmluaXNoZWQnLCB7IGRldGFpbDogdmFsdWUgfSk7XG4gICAgICAgIGBgYFxuXG4gICAgICAgIGBFdmVudFRhcmdldC5taXhpbmAgYWxzbyB3b3JrcyB3aXRoIHByb3RvdHlwZXM6XG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICB2YXIgUGVyc29uID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgICAgUlNWUC5FdmVudFRhcmdldC5taXhpbihQZXJzb24ucHJvdG90eXBlKTtcblxuICAgICAgICB2YXIgeWVodWRhID0gbmV3IFBlcnNvbigpO1xuICAgICAgICB2YXIgdG9tID0gbmV3IFBlcnNvbigpO1xuXG4gICAgICAgIHllaHVkYS5vbigncG9rZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1llaHVkYSBzYXlzIE9XJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRvbS5vbigncG9rZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1RvbSBzYXlzIE9XJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHllaHVkYS50cmlnZ2VyKCdwb2tlJyk7XG4gICAgICAgIHRvbS50cmlnZ2VyKCdwb2tlJyk7XG4gICAgICAgIGBgYFxuXG4gICAgICAgIEBtZXRob2QgbWl4aW5cbiAgICAgICAgQGZvciBSU1ZQLkV2ZW50VGFyZ2V0XG4gICAgICAgIEBwcml2YXRlXG4gICAgICAgIEBwYXJhbSB7T2JqZWN0fSBvYmplY3Qgb2JqZWN0IHRvIGV4dGVuZCB3aXRoIEV2ZW50VGFyZ2V0IG1ldGhvZHNcbiAgICAgICovXG4gICAgICAnbWl4aW4nOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgb2JqZWN0WydvbiddICAgICAgPSB0aGlzWydvbiddO1xuICAgICAgICBvYmplY3RbJ29mZiddICAgICA9IHRoaXNbJ29mZiddO1xuICAgICAgICBvYmplY3RbJ3RyaWdnZXInXSA9IHRoaXNbJ3RyaWdnZXInXTtcbiAgICAgICAgb2JqZWN0Ll9wcm9taXNlQ2FsbGJhY2tzID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIHdoZW4gYGV2ZW50TmFtZWAgaXMgdHJpZ2dlcmVkXG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICBvYmplY3Qub24oJ2V2ZW50JywgZnVuY3Rpb24oZXZlbnRJbmZvKXtcbiAgICAgICAgICAvLyBoYW5kbGUgdGhlIGV2ZW50XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdldmVudCcpO1xuICAgICAgICBgYGBcblxuICAgICAgICBAbWV0aG9kIG9uXG4gICAgICAgIEBmb3IgUlNWUC5FdmVudFRhcmdldFxuICAgICAgICBAcHJpdmF0ZVxuICAgICAgICBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIG5hbWUgb2YgdGhlIGV2ZW50IHRvIGxpc3RlbiBmb3JcbiAgICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICAgICovXG4gICAgICAnb24nOiBmdW5jdGlvbihldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbGxDYWxsYmFja3MgPSBsaWIkcnN2cCRldmVudHMkJGNhbGxiYWNrc0Zvcih0aGlzKSwgY2FsbGJhY2tzO1xuXG4gICAgICAgIGNhbGxiYWNrcyA9IGFsbENhbGxiYWNrc1tldmVudE5hbWVdO1xuXG4gICAgICAgIGlmICghY2FsbGJhY2tzKSB7XG4gICAgICAgICAgY2FsbGJhY2tzID0gYWxsQ2FsbGJhY2tzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaWIkcnN2cCRldmVudHMkJGluZGV4T2YoY2FsbGJhY2tzLCBjYWxsYmFjaykgPT09IC0xKSB7XG4gICAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAgWW91IGNhbiB1c2UgYG9mZmAgdG8gc3RvcCBmaXJpbmcgYSBwYXJ0aWN1bGFyIGNhbGxiYWNrIGZvciBhbiBldmVudDpcblxuICAgICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICAgIGZ1bmN0aW9uIGRvU3R1ZmYoKSB7IC8vIGRvIHN0dWZmISB9XG4gICAgICAgIG9iamVjdC5vbignc3R1ZmYnLCBkb1N0dWZmKTtcblxuICAgICAgICBvYmplY3QudHJpZ2dlcignc3R1ZmYnKTsgLy8gZG9TdHVmZiB3aWxsIGJlIGNhbGxlZFxuXG4gICAgICAgIC8vIFVucmVnaXN0ZXIgT05MWSB0aGUgZG9TdHVmZiBjYWxsYmFja1xuICAgICAgICBvYmplY3Qub2ZmKCdzdHVmZicsIGRvU3R1ZmYpO1xuICAgICAgICBvYmplY3QudHJpZ2dlcignc3R1ZmYnKTsgLy8gZG9TdHVmZiB3aWxsIE5PVCBiZSBjYWxsZWRcbiAgICAgICAgYGBgXG5cbiAgICAgICAgSWYgeW91IGRvbid0IHBhc3MgYSBgY2FsbGJhY2tgIGFyZ3VtZW50IHRvIGBvZmZgLCBBTEwgY2FsbGJhY2tzIGZvciB0aGVcbiAgICAgICAgZXZlbnQgd2lsbCBub3QgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgZXZlbnQgZmlyZXMuIEZvciBleGFtcGxlOlxuXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgdmFyIGNhbGxiYWNrMSA9IGZ1bmN0aW9uKCl7fTtcbiAgICAgICAgdmFyIGNhbGxiYWNrMiA9IGZ1bmN0aW9uKCl7fTtcblxuICAgICAgICBvYmplY3Qub24oJ3N0dWZmJywgY2FsbGJhY2sxKTtcbiAgICAgICAgb2JqZWN0Lm9uKCdzdHVmZicsIGNhbGxiYWNrMik7XG5cbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ3N0dWZmJyk7IC8vIGNhbGxiYWNrMSBhbmQgY2FsbGJhY2syIHdpbGwgYmUgZXhlY3V0ZWQuXG5cbiAgICAgICAgb2JqZWN0Lm9mZignc3R1ZmYnKTtcbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ3N0dWZmJyk7IC8vIGNhbGxiYWNrMSBhbmQgY2FsbGJhY2syIHdpbGwgbm90IGJlIGV4ZWN1dGVkIVxuICAgICAgICBgYGBcblxuICAgICAgICBAbWV0aG9kIG9mZlxuICAgICAgICBAZm9yIFJTVlAuRXZlbnRUYXJnZXRcbiAgICAgICAgQHByaXZhdGVcbiAgICAgICAgQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBldmVudCB0byBzdG9wIGxpc3RlbmluZyB0b1xuICAgICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBvcHRpb25hbCBhcmd1bWVudC4gSWYgZ2l2ZW4sIG9ubHkgdGhlIGZ1bmN0aW9uXG4gICAgICAgIGdpdmVuIHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBldmVudCdzIGNhbGxiYWNrIHF1ZXVlLiBJZiBubyBgY2FsbGJhY2tgXG4gICAgICAgIGFyZ3VtZW50IGlzIGdpdmVuLCBhbGwgY2FsbGJhY2tzIHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBldmVudCdzIGNhbGxiYWNrXG4gICAgICAgIHF1ZXVlLlxuICAgICAgKi9cbiAgICAgICdvZmYnOiBmdW5jdGlvbihldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBhbGxDYWxsYmFja3MgPSBsaWIkcnN2cCRldmVudHMkJGNhbGxiYWNrc0Zvcih0aGlzKSwgY2FsbGJhY2tzLCBpbmRleDtcblxuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgYWxsQ2FsbGJhY2tzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFja3MgPSBhbGxDYWxsYmFja3NbZXZlbnROYW1lXTtcblxuICAgICAgICBpbmRleCA9IGxpYiRyc3ZwJGV2ZW50cyQkaW5kZXhPZihjYWxsYmFja3MsIGNhbGxiYWNrKTtcblxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7IGNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpOyB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAgVXNlIGB0cmlnZ2VyYCB0byBmaXJlIGN1c3RvbSBldmVudHMuIEZvciBleGFtcGxlOlxuXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgb2JqZWN0Lm9uKCdmb28nLCBmdW5jdGlvbigpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdmb28gZXZlbnQgaGFwcGVuZWQhJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBvYmplY3QudHJpZ2dlcignZm9vJyk7XG4gICAgICAgIC8vICdmb28gZXZlbnQgaGFwcGVuZWQhJyBsb2dnZWQgdG8gdGhlIGNvbnNvbGVcbiAgICAgICAgYGBgXG5cbiAgICAgICAgWW91IGNhbiBhbHNvIHBhc3MgYSB2YWx1ZSBhcyBhIHNlY29uZCBhcmd1bWVudCB0byBgdHJpZ2dlcmAgdGhhdCB3aWxsIGJlXG4gICAgICAgIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byBhbGwgZXZlbnQgbGlzdGVuZXJzIGZvciB0aGUgZXZlbnQ6XG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICBvYmplY3Qub24oJ2ZvbycsIGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZS5uYW1lKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ2ZvbycsIHsgbmFtZTogJ2JhcicgfSk7XG4gICAgICAgIC8vICdiYXInIGxvZ2dlZCB0byB0aGUgY29uc29sZVxuICAgICAgICBgYGBcblxuICAgICAgICBAbWV0aG9kIHRyaWdnZXJcbiAgICAgICAgQGZvciBSU1ZQLkV2ZW50VGFyZ2V0XG4gICAgICAgIEBwcml2YXRlXG4gICAgICAgIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gYmUgdHJpZ2dlcmVkXG4gICAgICAgIEBwYXJhbSB7Kn0gb3B0aW9ucyBvcHRpb25hbCB2YWx1ZSB0byBiZSBwYXNzZWQgdG8gYW55IGV2ZW50IGhhbmRsZXJzIGZvclxuICAgICAgICB0aGUgZ2l2ZW4gYGV2ZW50TmFtZWBcbiAgICAgICovXG4gICAgICAndHJpZ2dlcic6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgb3B0aW9ucywgbGFiZWwpIHtcbiAgICAgICAgdmFyIGFsbENhbGxiYWNrcyA9IGxpYiRyc3ZwJGV2ZW50cyQkY2FsbGJhY2tzRm9yKHRoaXMpLCBjYWxsYmFja3MsIGNhbGxiYWNrO1xuXG4gICAgICAgIGlmIChjYWxsYmFja3MgPSBhbGxDYWxsYmFja3NbZXZlbnROYW1lXSkge1xuICAgICAgICAgIC8vIERvbid0IGNhY2hlIHRoZSBjYWxsYmFja3MubGVuZ3RoIHNpbmNlIGl0IG1heSBncm93XG4gICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFja3NbaV07XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKG9wdGlvbnMsIGxhYmVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnID0ge1xuICAgICAgaW5zdHJ1bWVudDogZmFsc2VcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZXZlbnRzJCRkZWZhdWx0WydtaXhpbiddKGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnKTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlndXJlKG5hbWUsIHZhbHVlKSB7XG4gICAgICBpZiAobmFtZSA9PT0gJ29uZXJyb3InKSB7XG4gICAgICAgIC8vIGhhbmRsZSBmb3IgbGVnYWN5IHVzZXJzIHRoYXQgZXhwZWN0IHRoZSBhY3R1YWxcbiAgICAgICAgLy8gZXJyb3IgdG8gYmUgcGFzc2VkIHRvIHRoZWlyIGZ1bmN0aW9uIGFkZGVkIHZpYVxuICAgICAgICAvLyBgUlNWUC5jb25maWd1cmUoJ29uZXJyb3InLCBzb21lRnVuY3Rpb25IZXJlKTtgXG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnWydvbiddKCdlcnJvcicsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1tuYW1lXSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnW25hbWVdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRpbnN0cnVtZW50JCRxdWV1ZSA9IFtdO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkaW5zdHJ1bWVudCQkc2NoZWR1bGVGbHVzaCgpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbnRyeTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaWIkcnN2cCRpbnN0cnVtZW50JCRxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGVudHJ5ID0gbGliJHJzdnAkaW5zdHJ1bWVudCQkcXVldWVbaV07XG5cbiAgICAgICAgICB2YXIgcGF5bG9hZCA9IGVudHJ5LnBheWxvYWQ7XG5cbiAgICAgICAgICBwYXlsb2FkLmd1aWQgPSBwYXlsb2FkLmtleSArIHBheWxvYWQuaWQ7XG4gICAgICAgICAgcGF5bG9hZC5jaGlsZEd1aWQgPSBwYXlsb2FkLmtleSArIHBheWxvYWQuY2hpbGRJZDtcbiAgICAgICAgICBpZiAocGF5bG9hZC5lcnJvcikge1xuICAgICAgICAgICAgcGF5bG9hZC5zdGFjayA9IHBheWxvYWQuZXJyb3Iuc3RhY2s7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWdbJ3RyaWdnZXInXShlbnRyeS5uYW1lLCBlbnRyeS5wYXlsb2FkKTtcbiAgICAgICAgfVxuICAgICAgICBsaWIkcnN2cCRpbnN0cnVtZW50JCRxdWV1ZS5sZW5ndGggPSAwO1xuICAgICAgfSwgNTApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGluc3RydW1lbnQkJGluc3RydW1lbnQoZXZlbnROYW1lLCBwcm9taXNlLCBjaGlsZCkge1xuICAgICAgaWYgKDEgPT09IGxpYiRyc3ZwJGluc3RydW1lbnQkJHF1ZXVlLnB1c2goe1xuICAgICAgICBuYW1lOiBldmVudE5hbWUsXG4gICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICBrZXk6IHByb21pc2UuX2d1aWRLZXksXG4gICAgICAgICAgaWQ6ICBwcm9taXNlLl9pZCxcbiAgICAgICAgICBldmVudE5hbWU6IGV2ZW50TmFtZSxcbiAgICAgICAgICBkZXRhaWw6IHByb21pc2UuX3Jlc3VsdCxcbiAgICAgICAgICBjaGlsZElkOiBjaGlsZCAmJiBjaGlsZC5faWQsXG4gICAgICAgICAgbGFiZWw6IHByb21pc2UuX2xhYmVsLFxuICAgICAgICAgIHRpbWVTdGFtcDogbGliJHJzdnAkdXRpbHMkJG5vdygpLFxuICAgICAgICAgIGVycm9yOiBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1tcImluc3RydW1lbnQtd2l0aC1zdGFja1wiXSA/IG5ldyBFcnJvcihwcm9taXNlLl9sYWJlbCkgOiBudWxsXG4gICAgICAgIH19KSkge1xuICAgICAgICAgIGxpYiRyc3ZwJGluc3RydW1lbnQkJHNjaGVkdWxlRmx1c2goKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIHZhciBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0ID0gbGliJHJzdnAkaW5zdHJ1bWVudCQkaW5zdHJ1bWVudDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCR0aGVuJCR0aGVuKG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uLCBsYWJlbCkge1xuICAgICAgdmFyIHBhcmVudCA9IHRoaXM7XG4gICAgICB2YXIgc3RhdGUgPSBwYXJlbnQuX3N0YXRlO1xuXG4gICAgICBpZiAoc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEICYmICFvbkZ1bGZpbGxtZW50IHx8IHN0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEICYmICFvblJlamVjdGlvbikge1xuICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5pbnN0cnVtZW50ICYmIGxpYiRyc3ZwJGluc3RydW1lbnQkJGRlZmF1bHQoJ2NoYWluZWQnLCBwYXJlbnQsIHBhcmVudCk7XG4gICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIHBhcmVudC5fb25FcnJvciA9IG51bGw7XG5cbiAgICAgIHZhciBjaGlsZCA9IG5ldyBwYXJlbnQuY29uc3RydWN0b3IobGliJHJzdnAkJGludGVybmFsJCRub29wLCBsYWJlbCk7XG4gICAgICB2YXIgcmVzdWx0ID0gcGFyZW50Ll9yZXN1bHQ7XG5cbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmluc3RydW1lbnQgJiYgbGliJHJzdnAkaW5zdHJ1bWVudCQkZGVmYXVsdCgnY2hhaW5lZCcsIHBhcmVudCwgY2hpbGQpO1xuXG4gICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzW3N0YXRlIC0gMV07XG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRpbnZva2VDYWxsYmFjayhzdGF0ZSwgY2hpbGQsIGNhbGxiYWNrLCByZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNoaWxkO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkdGhlbiQkZGVmYXVsdCA9IGxpYiRyc3ZwJHRoZW4kJHRoZW47XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRyZXNvbHZlKG9iamVjdCwgbGFiZWwpIHtcbiAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgICBpZiAob2JqZWN0ICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gQ29uc3RydWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH1cblxuICAgICAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3IobGliJHJzdnAkJGludGVybmFsJCRub29wLCBsYWJlbCk7XG4gICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgb2JqZWN0KTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0ID0gbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRyZXNvbHZlO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGVudW1lcmF0b3IkJG1ha2VTZXR0bGVkUmVzdWx0KHN0YXRlLCBwb3NpdGlvbiwgdmFsdWUpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0ZTogJ2Z1bGZpbGxlZCcsXG4gICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0ZTogJ3JlamVjdGVkJyxcbiAgICAgICAgICByZWFzb246IHZhbHVlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvcihDb25zdHJ1Y3RvciwgaW5wdXQsIGFib3J0T25SZWplY3QsIGxhYmVsKSB7XG4gICAgICB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yID0gQ29uc3RydWN0b3I7XG4gICAgICB0aGlzLnByb21pc2UgPSBuZXcgQ29uc3RydWN0b3IobGliJHJzdnAkJGludGVybmFsJCRub29wLCBsYWJlbCk7XG4gICAgICB0aGlzLl9hYm9ydE9uUmVqZWN0ID0gYWJvcnRPblJlamVjdDtcblxuICAgICAgaWYgKHRoaXMuX3ZhbGlkYXRlSW5wdXQoaW5wdXQpKSB7XG4gICAgICAgIHRoaXMuX2lucHV0ICAgICA9IGlucHV0O1xuICAgICAgICB0aGlzLmxlbmd0aCAgICAgPSBpbnB1dC5sZW5ndGg7XG4gICAgICAgIHRoaXMuX3JlbWFpbmluZyA9IGlucHV0Lmxlbmd0aDtcblxuICAgICAgICB0aGlzLl9pbml0KCk7XG5cbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMubGVuZ3RoIHx8IDA7XG4gICAgICAgICAgdGhpcy5fZW51bWVyYXRlKCk7XG4gICAgICAgICAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHRoaXMucHJvbWlzZSwgdGhpcy5fdmFsaWRhdGlvbkVycm9yKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRlbnVtZXJhdG9yJCRkZWZhdWx0ID0gbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvcjtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl92YWxpZGF0ZUlucHV0ID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgIHJldHVybiBsaWIkcnN2cCR1dGlscyQkaXNBcnJheShpbnB1dCk7XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl92YWxpZGF0aW9uRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0FycmF5IE1ldGhvZHMgbXVzdCBiZSBwcm92aWRlZCBhbiBBcnJheScpO1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fcmVzdWx0ID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoKTtcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX2VudW1lcmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGxlbmd0aCAgICAgPSB0aGlzLmxlbmd0aDtcbiAgICAgIHZhciBwcm9taXNlICAgID0gdGhpcy5wcm9taXNlO1xuICAgICAgdmFyIGlucHV0ICAgICAgPSB0aGlzLl9pbnB1dDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IHByb21pc2UuX3N0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuX2VhY2hFbnRyeShpbnB1dFtpXSwgaSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9zZXR0bGVNYXliZVRoZW5hYmxlID0gZnVuY3Rpb24oZW50cnksIGkpIHtcbiAgICAgIHZhciBjID0gdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvcjtcbiAgICAgIHZhciByZXNvbHZlID0gYy5yZXNvbHZlO1xuXG4gICAgICBpZiAocmVzb2x2ZSA9PT0gbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0KSB7XG4gICAgICAgIHZhciB0aGVuID0gbGliJHJzdnAkJGludGVybmFsJCRnZXRUaGVuKGVudHJ5KTtcblxuICAgICAgICBpZiAodGhlbiA9PT0gbGliJHJzdnAkdGhlbiQkZGVmYXVsdCAmJlxuICAgICAgICAgICAgZW50cnkuX3N0YXRlICE9PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcpIHtcbiAgICAgICAgICBlbnRyeS5fb25FcnJvciA9IG51bGw7XG4gICAgICAgICAgdGhpcy5fc2V0dGxlZEF0KGVudHJ5Ll9zdGF0ZSwgaSwgZW50cnkuX3Jlc3VsdCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoZW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aGlzLl9yZW1haW5pbmctLTtcbiAgICAgICAgICB0aGlzLl9yZXN1bHRbaV0gPSB0aGlzLl9tYWtlUmVzdWx0KGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVELCBpLCBlbnRyeSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdCkge1xuICAgICAgICAgIHZhciBwcm9taXNlID0gbmV3IGMobGliJHJzdnAkJGludGVybmFsJCRub29wKTtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgZW50cnksIHRoZW4pO1xuICAgICAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChwcm9taXNlLCBpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl93aWxsU2V0dGxlQXQobmV3IGMoZnVuY3Rpb24ocmVzb2x2ZSkgeyByZXNvbHZlKGVudHJ5KTsgfSksIGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl93aWxsU2V0dGxlQXQocmVzb2x2ZShlbnRyeSksIGkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fZWFjaEVudHJ5ID0gZnVuY3Rpb24oZW50cnksIGkpIHtcbiAgICAgIGlmIChsaWIkcnN2cCR1dGlscyQkaXNNYXliZVRoZW5hYmxlKGVudHJ5KSkge1xuICAgICAgICB0aGlzLl9zZXR0bGVNYXliZVRoZW5hYmxlKGVudHJ5LCBpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuICAgICAgICB0aGlzLl9yZXN1bHRbaV0gPSB0aGlzLl9tYWtlUmVzdWx0KGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVELCBpLCBlbnRyeSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9zZXR0bGVkQXQgPSBmdW5jdGlvbihzdGF0ZSwgaSwgdmFsdWUpIHtcbiAgICAgIHZhciBwcm9taXNlID0gdGhpcy5wcm9taXNlO1xuXG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORykge1xuICAgICAgICB0aGlzLl9yZW1haW5pbmctLTtcblxuICAgICAgICBpZiAodGhpcy5fYWJvcnRPblJlamVjdCAmJiBzdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRSRUpFQ1RFRCkge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9yZXN1bHRbaV0gPSB0aGlzLl9tYWtlUmVzdWx0KHN0YXRlLCBpLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX21ha2VSZXN1bHQgPSBmdW5jdGlvbihzdGF0ZSwgaSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3dpbGxTZXR0bGVBdCA9IGZ1bmN0aW9uKHByb21pc2UsIGkpIHtcbiAgICAgIHZhciBlbnVtZXJhdG9yID0gdGhpcztcblxuICAgICAgbGliJHJzdnAkJGludGVybmFsJCRzdWJzY3JpYmUocHJvbWlzZSwgdW5kZWZpbmVkLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBlbnVtZXJhdG9yLl9zZXR0bGVkQXQobGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQsIGksIHZhbHVlKTtcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICBlbnVtZXJhdG9yLl9zZXR0bGVkQXQobGliJHJzdnAkJGludGVybmFsJCRSRUpFQ1RFRCwgaSwgcmVhc29uKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSRhbGwkJGFsbChlbnRyaWVzLCBsYWJlbCkge1xuICAgICAgcmV0dXJuIG5ldyBsaWIkcnN2cCRlbnVtZXJhdG9yJCRkZWZhdWx0KHRoaXMsIGVudHJpZXMsIHRydWUgLyogYWJvcnQgb24gcmVqZWN0ICovLCBsYWJlbCkucHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkYWxsJCRkZWZhdWx0ID0gbGliJHJzdnAkcHJvbWlzZSRhbGwkJGFsbDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJHJhY2UkJHJhY2UoZW50cmllcywgbGFiZWwpIHtcbiAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AsIGxhYmVsKTtcblxuICAgICAgaWYgKCFsaWIkcnN2cCR1dGlscyQkaXNBcnJheShlbnRyaWVzKSkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGFuIGFycmF5IHRvIHJhY2UuJykpO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGxlbmd0aCA9IGVudHJpZXMubGVuZ3RoO1xuXG4gICAgICBmdW5jdGlvbiBvbkZ1bGZpbGxtZW50KHZhbHVlKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG9uUmVqZWN0aW9uKHJlYXNvbikge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgcHJvbWlzZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORyAmJiBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRzdWJzY3JpYmUoQ29uc3RydWN0b3IucmVzb2x2ZShlbnRyaWVzW2ldKSwgdW5kZWZpbmVkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSRyYWNlJCRkZWZhdWx0ID0gbGliJHJzdnAkcHJvbWlzZSRyYWNlJCRyYWNlO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkcmVqZWN0JCRyZWplY3QocmVhc29uLCBsYWJlbCkge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AsIGxhYmVsKTtcbiAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkcmVqZWN0JCRkZWZhdWx0ID0gbGliJHJzdnAkcHJvbWlzZSRyZWplY3QkJHJlamVjdDtcblxuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJCRndWlkS2V5ID0gJ3JzdnBfJyArIGxpYiRyc3ZwJHV0aWxzJCRub3coKSArICctJztcbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSQkY291bnRlciA9IDA7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJCRuZWVkc1Jlc29sdmVyKCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhIHJlc29sdmVyIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkJG5lZWRzTmV3KCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1Byb21pc2UnOiBQbGVhc2UgdXNlIHRoZSAnbmV3JyBvcGVyYXRvciwgdGhpcyBvYmplY3QgY29uc3RydWN0b3IgY2Fubm90IGJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLlwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlKHJlc29sdmVyLCBsYWJlbCkge1xuICAgICAgdGhpcy5faWQgPSBsaWIkcnN2cCRwcm9taXNlJCRjb3VudGVyKys7XG4gICAgICB0aGlzLl9sYWJlbCA9IGxhYmVsO1xuICAgICAgdGhpcy5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9yZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9zdWJzY3JpYmVycyA9IFtdO1xuXG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5pbnN0cnVtZW50ICYmIGxpYiRyc3ZwJGluc3RydW1lbnQkJGRlZmF1bHQoJ2NyZWF0ZWQnLCB0aGlzKTtcblxuICAgICAgaWYgKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCAhPT0gcmVzb2x2ZXIpIHtcbiAgICAgICAgdHlwZW9mIHJlc29sdmVyICE9PSAnZnVuY3Rpb24nICYmIGxpYiRyc3ZwJHByb21pc2UkJG5lZWRzUmVzb2x2ZXIoKTtcbiAgICAgICAgdGhpcyBpbnN0YW5jZW9mIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UgPyBsaWIkcnN2cCQkaW50ZXJuYWwkJGluaXRpYWxpemVQcm9taXNlKHRoaXMsIHJlc29sdmVyKSA6IGxpYiRyc3ZwJHByb21pc2UkJG5lZWRzTmV3KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQgPSBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlO1xuXG4gICAgLy8gZGVwcmVjYXRlZFxuICAgIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UuY2FzdCA9IGxpYiRyc3ZwJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlLmFsbCA9IGxpYiRyc3ZwJHByb21pc2UkYWxsJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UucmFjZSA9IGxpYiRyc3ZwJHByb21pc2UkcmFjZSQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlLnJlc29sdmUgPSBsaWIkcnN2cCRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZS5yZWplY3QgPSBsaWIkcnN2cCRwcm9taXNlJHJlamVjdCQkZGVmYXVsdDtcblxuICAgIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UucHJvdG90eXBlID0ge1xuICAgICAgY29uc3RydWN0b3I6IGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UsXG5cbiAgICAgIF9ndWlkS2V5OiBsaWIkcnN2cCRwcm9taXNlJCRndWlkS2V5LFxuXG4gICAgICBfb25FcnJvcjogZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFmdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChwcm9taXNlLl9vbkVycm9yKSB7XG4gICAgICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1sndHJpZ2dlciddKCdlcnJvcicsIHJlYXNvbiwgcHJvbWlzZS5fbGFiZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgLyoqXG4gICAgICBUaGUgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCxcbiAgICAgIHdoaWNoIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlXG4gICAgICByZWFzb24gd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAgIC8vIHVzZXIgaXMgYXZhaWxhYmxlXG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAvLyB1c2VyIGlzIHVuYXZhaWxhYmxlLCBhbmQgeW91IGFyZSBnaXZlbiB0aGUgcmVhc29uIHdoeVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQ2hhaW5pbmdcbiAgICAgIC0tLS0tLS0tXG5cbiAgICAgIFRoZSByZXR1cm4gdmFsdWUgb2YgYHRoZW5gIGlzIGl0c2VsZiBhIHByb21pc2UuICBUaGlzIHNlY29uZCwgJ2Rvd25zdHJlYW0nXG4gICAgICBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZmlyc3QgcHJvbWlzZSdzIGZ1bGZpbGxtZW50XG4gICAgICBvciByZWplY3Rpb24gaGFuZGxlciwgb3IgcmVqZWN0ZWQgaWYgdGhlIGhhbmRsZXIgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICByZXR1cm4gdXNlci5uYW1lO1xuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICByZXR1cm4gJ2RlZmF1bHQgbmFtZSc7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh1c2VyTmFtZSkge1xuICAgICAgICAvLyBJZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHVzZXJOYW1lYCB3aWxsIGJlIHRoZSB1c2VyJ3MgbmFtZSwgb3RoZXJ3aXNlIGl0XG4gICAgICAgIC8vIHdpbGwgYmUgYCdkZWZhdWx0IG5hbWUnYFxuICAgICAgfSk7XG5cbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jyk7XG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAvLyBpZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHJlYXNvbmAgd2lsbCBiZSAnRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknLlxuICAgICAgICAvLyBJZiBgZmluZFVzZXJgIHJlamVjdGVkLCBgcmVhc29uYCB3aWxsIGJlICdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jy5cbiAgICAgIH0pO1xuICAgICAgYGBgXG4gICAgICBJZiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIGRvZXMgbm90IHNwZWNpZnkgYSByZWplY3Rpb24gaGFuZGxlciwgcmVqZWN0aW9uIHJlYXNvbnMgd2lsbCBiZSBwcm9wYWdhdGVkIGZ1cnRoZXIgZG93bnN0cmVhbS5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICB0aHJvdyBuZXcgUGVkYWdvZ2ljYWxFeGNlcHRpb24oJ1Vwc3RyZWFtIGVycm9yJyk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIC8vIFRoZSBgUGVkZ2Fnb2NpYWxFeGNlcHRpb25gIGlzIHByb3BhZ2F0ZWQgYWxsIHRoZSB3YXkgZG93biB0byBoZXJlXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBBc3NpbWlsYXRpb25cbiAgICAgIC0tLS0tLS0tLS0tLVxuXG4gICAgICBTb21ldGltZXMgdGhlIHZhbHVlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSB0byBhIGRvd25zdHJlYW0gcHJvbWlzZSBjYW4gb25seSBiZVxuICAgICAgcmV0cmlldmVkIGFzeW5jaHJvbm91c2x5LiBUaGlzIGNhbiBiZSBhY2hpZXZlZCBieSByZXR1cm5pbmcgYSBwcm9taXNlIGluIHRoZVxuICAgICAgZnVsZmlsbG1lbnQgb3IgcmVqZWN0aW9uIGhhbmRsZXIuIFRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCB0aGVuIGJlIHBlbmRpbmdcbiAgICAgIHVudGlsIHRoZSByZXR1cm5lZCBwcm9taXNlIGlzIHNldHRsZWQuIFRoaXMgaXMgY2FsbGVkICphc3NpbWlsYXRpb24qLlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAgIC8vIFRoZSB1c2VyJ3MgY29tbWVudHMgYXJlIG5vdyBhdmFpbGFibGVcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIElmIHRoZSBhc3NpbWxpYXRlZCBwcm9taXNlIHJlamVjdHMsIHRoZW4gdGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIGFsc28gcmVqZWN0LlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgZnVsZmlsbHMsIHdlJ2xsIGhhdmUgdGhlIHZhbHVlIGhlcmVcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCByZWplY3RzLCB3ZSdsbCBoYXZlIHRoZSByZWFzb24gaGVyZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgU2ltcGxlIEV4YW1wbGVcbiAgICAgIC0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgdmFyIHJlc3VsdDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gZmluZFJlc3VsdCgpO1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9XG4gICAgICBgYGBcblxuICAgICAgRXJyYmFjayBFeGFtcGxlXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kUmVzdWx0KGZ1bmN0aW9uKHJlc3VsdCwgZXJyKXtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIC8vIGZhaWx1cmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBzdWNjZXNzXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFByb21pc2UgRXhhbXBsZTtcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgZmluZFJlc3VsdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQWR2YW5jZWQgRXhhbXBsZVxuICAgICAgLS0tLS0tLS0tLS0tLS1cblxuICAgICAgU3luY2hyb25vdXMgRXhhbXBsZVxuXG4gICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICB2YXIgYXV0aG9yLCBib29rcztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgYXV0aG9yID0gZmluZEF1dGhvcigpO1xuICAgICAgICBib29rcyAgPSBmaW5kQm9va3NCeUF1dGhvcihhdXRob3IpO1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9XG4gICAgICBgYGBcblxuICAgICAgRXJyYmFjayBFeGFtcGxlXG5cbiAgICAgIGBgYGpzXG5cbiAgICAgIGZ1bmN0aW9uIGZvdW5kQm9va3MoYm9va3MpIHtcblxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBmYWlsdXJlKHJlYXNvbikge1xuXG4gICAgICB9XG5cbiAgICAgIGZpbmRBdXRob3IoZnVuY3Rpb24oYXV0aG9yLCBlcnIpe1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgIC8vIGZhaWx1cmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmluZEJvb29rc0J5QXV0aG9yKGF1dGhvciwgZnVuY3Rpb24oYm9va3MsIGVycikge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBmb3VuZEJvb2tzKGJvb2tzKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAgICAgICAgICAgZmFpbHVyZShyZWFzb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBzdWNjZXNzXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFByb21pc2UgRXhhbXBsZTtcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgZmluZEF1dGhvcigpLlxuICAgICAgICB0aGVuKGZpbmRCb29rc0J5QXV0aG9yKS5cbiAgICAgICAgdGhlbihmdW5jdGlvbihib29rcyl7XG4gICAgICAgICAgLy8gZm91bmQgYm9va3NcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBAbWV0aG9kIHRoZW5cbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uRnVsZmlsbG1lbnRcbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0aW9uXG4gICAgICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBsYWJlbGluZyB0aGUgcHJvbWlzZS5cbiAgICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICAgKi9cbiAgICAgIHRoZW46IGxpYiRyc3ZwJHRoZW4kJGRlZmF1bHQsXG5cbiAgICAvKipcbiAgICAgIGBjYXRjaGAgaXMgc2ltcGx5IHN1Z2FyIGZvciBgdGhlbih1bmRlZmluZWQsIG9uUmVqZWN0aW9uKWAgd2hpY2ggbWFrZXMgaXQgdGhlIHNhbWVcbiAgICAgIGFzIHRoZSBjYXRjaCBibG9jayBvZiBhIHRyeS9jYXRjaCBzdGF0ZW1lbnQuXG5cbiAgICAgIGBgYGpzXG4gICAgICBmdW5jdGlvbiBmaW5kQXV0aG9yKCl7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGRuJ3QgZmluZCB0aGF0IGF1dGhvcicpO1xuICAgICAgfVxuXG4gICAgICAvLyBzeW5jaHJvbm91c1xuICAgICAgdHJ5IHtcbiAgICAgICAgZmluZEF1dGhvcigpO1xuICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAgIH1cblxuICAgICAgLy8gYXN5bmMgd2l0aCBwcm9taXNlc1xuICAgICAgZmluZEF1dGhvcigpLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBAbWV0aG9kIGNhdGNoXG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGlvblxuICAgICAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgbGFiZWxpbmcgdGhlIHByb21pc2UuXG4gICAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAgICovXG4gICAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGlvbiwgbGFiZWwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0aW9uLCBsYWJlbCk7XG4gICAgICB9LFxuXG4gICAgLyoqXG4gICAgICBgZmluYWxseWAgd2lsbCBiZSBpbnZva2VkIHJlZ2FyZGxlc3Mgb2YgdGhlIHByb21pc2UncyBmYXRlIGp1c3QgYXMgbmF0aXZlXG4gICAgICB0cnkvY2F0Y2gvZmluYWxseSBiZWhhdmVzXG5cbiAgICAgIFN5bmNocm9ub3VzIGV4YW1wbGU6XG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kQXV0aG9yKCkge1xuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQXV0aG9yKCk7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBmaW5kQXV0aG9yKCk7IC8vIHN1Y2NlZWQgb3IgZmFpbFxuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICByZXR1cm4gZmluZE90aGVyQXV0aGVyKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICAvLyBhbHdheXMgcnVuc1xuICAgICAgICAvLyBkb2Vzbid0IGFmZmVjdCB0aGUgcmV0dXJuIHZhbHVlXG4gICAgICB9XG4gICAgICBgYGBcblxuICAgICAgQXN5bmNocm9ub3VzIGV4YW1wbGU6XG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kQXV0aG9yKCkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgcmV0dXJuIGZpbmRPdGhlckF1dGhlcigpO1xuICAgICAgfSkuZmluYWxseShmdW5jdGlvbigpe1xuICAgICAgICAvLyBhdXRob3Igd2FzIGVpdGhlciBmb3VuZCwgb3Igbm90XG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBAbWV0aG9kIGZpbmFsbHlcbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBsYWJlbGluZyB0aGUgcHJvbWlzZS5cbiAgICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICAgKi9cbiAgICAgICdmaW5hbGx5JzogZnVuY3Rpb24oY2FsbGJhY2ssIGxhYmVsKSB7XG4gICAgICAgIHZhciBwcm9taXNlID0gdGhpcztcbiAgICAgICAgdmFyIGNvbnN0cnVjdG9yID0gcHJvbWlzZS5jb25zdHJ1Y3RvcjtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZWplY3QocmVhc29uKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgbGFiZWwpO1xuICAgICAgfVxuICAgIH07XG4gICAgZnVuY3Rpb24gIGxpYiRyc3ZwJCRpbnRlcm5hbCQkd2l0aE93blByb21pc2UoKSB7XG4gICAgICByZXR1cm4gbmV3IFR5cGVFcnJvcignQSBwcm9taXNlcyBjYWxsYmFjayBjYW5ub3QgcmV0dXJuIHRoYXQgc2FtZSBwcm9taXNlLicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCgpIHt9XG5cbiAgICB2YXIgbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HICAgPSB2b2lkIDA7XG4gICAgdmFyIGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEID0gMTtcbiAgICB2YXIgbGliJHJzdnAkJGludGVybmFsJCRSRUpFQ1RFRCAgPSAyO1xuXG4gICAgdmFyIGxpYiRyc3ZwJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1IgPSBuZXcgbGliJHJzdnAkJGludGVybmFsJCRFcnJvck9iamVjdCgpO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRnZXRUaGVuKHByb21pc2UpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlLnRoZW47XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1IuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCR0cnlUaGVuKHRoZW4sIHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm4gZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSwgdGhlbikge1xuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYXN5bmMoZnVuY3Rpb24ocHJvbWlzZSkge1xuICAgICAgICB2YXIgc2VhbGVkID0gZmFsc2U7XG4gICAgICAgIHZhciBlcnJvciA9IGxpYiRyc3ZwJCRpbnRlcm5hbCQkdHJ5VGhlbih0aGVuLCB0aGVuYWJsZSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBpZiAoc2VhbGVkKSB7IHJldHVybjsgfVxuICAgICAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKHRoZW5hYmxlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlLCB1bmRlZmluZWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgICAgaWYgKHNlYWxlZCkgeyByZXR1cm47IH1cbiAgICAgICAgICBzZWFsZWQgPSB0cnVlO1xuXG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICAgICAgfSwgJ1NldHRsZTogJyArIChwcm9taXNlLl9sYWJlbCB8fCAnIHVua25vd24gcHJvbWlzZScpKTtcblxuICAgICAgICBpZiAoIXNlYWxlZCAmJiBlcnJvcikge1xuICAgICAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9LCBwcm9taXNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlKSB7XG4gICAgICBpZiAodGhlbmFibGUuX3N0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gICAgICB9IGVsc2UgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRSRUpFQ1RFRCkge1xuICAgICAgICB0aGVuYWJsZS5fb25FcnJvciA9IG51bGw7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRzdWJzY3JpYmUodGhlbmFibGUsIHVuZGVmaW5lZCwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBpZiAodGhlbmFibGUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbikge1xuICAgICAgaWYgKG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IgPT09IHByb21pc2UuY29uc3RydWN0b3IgJiZcbiAgICAgICAgICB0aGVuID09PSBsaWIkcnN2cCR0aGVuJCRkZWZhdWx0ICYmXG4gICAgICAgICAgY29uc3RydWN0b3IucmVzb2x2ZSA9PT0gbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0KSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhlbiA9PT0gbGliJHJzdnAkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUikge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGxpYiRyc3ZwJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1IuZXJyb3IpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoZW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICAgICAgfSBlbHNlIGlmIChsaWIkcnN2cCR1dGlscyQkaXNGdW5jdGlvbih0aGVuKSkge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSkge1xuICAgICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGxpYiRyc3ZwJHV0aWxzJCRvYmplY3RPckZ1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgdmFsdWUsIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZ2V0VGhlbih2YWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHB1Ymxpc2hSZWplY3Rpb24ocHJvbWlzZSkge1xuICAgICAgaWYgKHByb21pc2UuX29uRXJyb3IpIHtcbiAgICAgICAgcHJvbWlzZS5fb25FcnJvcihwcm9taXNlLl9yZXN1bHQpO1xuICAgICAgfVxuXG4gICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHB1Ymxpc2gocHJvbWlzZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKSB7XG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORykgeyByZXR1cm47IH1cblxuICAgICAgcHJvbWlzZS5fcmVzdWx0ID0gdmFsdWU7XG4gICAgICBwcm9taXNlLl9zdGF0ZSA9IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEO1xuXG4gICAgICBpZiAocHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGlmIChsaWIkcnN2cCRjb25maWckJGNvbmZpZy5pbnN0cnVtZW50KSB7XG4gICAgICAgICAgbGliJHJzdnAkaW5zdHJ1bWVudCQkZGVmYXVsdCgnZnVsZmlsbGVkJywgcHJvbWlzZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jKGxpYiRyc3ZwJCRpbnRlcm5hbCQkcHVibGlzaCwgcHJvbWlzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKSB7XG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORykgeyByZXR1cm47IH1cbiAgICAgIHByb21pc2UuX3N0YXRlID0gbGliJHJzdnAkJGludGVybmFsJCRSRUpFQ1RFRDtcbiAgICAgIHByb21pc2UuX3Jlc3VsdCA9IHJlYXNvbjtcbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jKGxpYiRyc3ZwJCRpbnRlcm5hbCQkcHVibGlzaFJlamVjdGlvbiwgcHJvbWlzZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgICAgIHZhciBzdWJzY3JpYmVycyA9IHBhcmVudC5fc3Vic2NyaWJlcnM7XG4gICAgICB2YXIgbGVuZ3RoID0gc3Vic2NyaWJlcnMubGVuZ3RoO1xuXG4gICAgICBwYXJlbnQuX29uRXJyb3IgPSBudWxsO1xuXG4gICAgICBzdWJzY3JpYmVyc1tsZW5ndGhdID0gY2hpbGQ7XG4gICAgICBzdWJzY3JpYmVyc1tsZW5ndGggKyBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRF0gPSBvbkZ1bGZpbGxtZW50O1xuICAgICAgc3Vic2NyaWJlcnNbbGVuZ3RoICsgbGliJHJzdnAkJGludGVybmFsJCRSRUpFQ1RFRF0gID0gb25SZWplY3Rpb247XG5cbiAgICAgIGlmIChsZW5ndGggPT09IDAgJiYgcGFyZW50Ll9zdGF0ZSkge1xuICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hc3luYyhsaWIkcnN2cCQkaW50ZXJuYWwkJHB1Ymxpc2gsIHBhcmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRwdWJsaXNoKHByb21pc2UpIHtcbiAgICAgIHZhciBzdWJzY3JpYmVycyA9IHByb21pc2UuX3N1YnNjcmliZXJzO1xuICAgICAgdmFyIHNldHRsZWQgPSBwcm9taXNlLl9zdGF0ZTtcblxuICAgICAgaWYgKGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmluc3RydW1lbnQpIHtcbiAgICAgICAgbGliJHJzdnAkaW5zdHJ1bWVudCQkZGVmYXVsdChzZXR0bGVkID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCA/ICdmdWxmaWxsZWQnIDogJ3JlamVjdGVkJywgcHJvbWlzZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdWJzY3JpYmVycy5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XG5cbiAgICAgIHZhciBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCA9IHByb21pc2UuX3Jlc3VsdDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMykge1xuICAgICAgICBjaGlsZCA9IHN1YnNjcmliZXJzW2ldO1xuICAgICAgICBjYWxsYmFjayA9IHN1YnNjcmliZXJzW2kgKyBzZXR0bGVkXTtcblxuICAgICAgICBpZiAoY2hpbGQpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGludm9rZUNhbGxiYWNrKHNldHRsZWQsIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhkZXRhaWwpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCA9IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRFcnJvck9iamVjdCgpIHtcbiAgICAgIHRoaXMuZXJyb3IgPSBudWxsO1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCQkaW50ZXJuYWwkJFRSWV9DQVRDSF9FUlJPUiA9IG5ldyBsaWIkcnN2cCQkaW50ZXJuYWwkJEVycm9yT2JqZWN0KCk7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhkZXRhaWwpO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SLmVycm9yID0gZTtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgcHJvbWlzZSwgY2FsbGJhY2ssIGRldGFpbCkge1xuICAgICAgdmFyIGhhc0NhbGxiYWNrID0gbGliJHJzdnAkdXRpbHMkJGlzRnVuY3Rpb24oY2FsbGJhY2spLFxuICAgICAgICAgIHZhbHVlLCBlcnJvciwgc3VjY2VlZGVkLCBmYWlsZWQ7XG5cbiAgICAgIGlmIChoYXNDYWxsYmFjaykge1xuICAgICAgICB2YWx1ZSA9IGxpYiRyc3ZwJCRpbnRlcm5hbCQkdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCk7XG5cbiAgICAgICAgaWYgKHZhbHVlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFRSWV9DQVRDSF9FUlJPUikge1xuICAgICAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICAgICAgZXJyb3IgPSB2YWx1ZS5lcnJvcjtcbiAgICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGxpYiRyc3ZwJCRpbnRlcm5hbCQkd2l0aE93blByb21pc2UoKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gZGV0YWlsO1xuICAgICAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORykge1xuICAgICAgICAvLyBub29wXG4gICAgICB9IGVsc2UgaWYgKGhhc0NhbGxiYWNrICYmIHN1Y2NlZWRlZCkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChmYWlsZWQpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJGluaXRpYWxpemVQcm9taXNlKHByb21pc2UsIHJlc29sdmVyKSB7XG4gICAgICB2YXIgcmVzb2x2ZWQgPSBmYWxzZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc29sdmVyKGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHZhbHVlKXtcbiAgICAgICAgICBpZiAocmVzb2x2ZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgcmVzb2x2ZWQgPSB0cnVlO1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIHJlamVjdFByb21pc2UocmVhc29uKSB7XG4gICAgICAgICAgaWYgKHJlc29sdmVkKSB7IHJldHVybjsgfVxuICAgICAgICAgIHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkQWxsU2V0dGxlZChDb25zdHJ1Y3RvciwgZW50cmllcywgbGFiZWwpIHtcbiAgICAgIHRoaXMuX3N1cGVyQ29uc3RydWN0b3IoQ29uc3RydWN0b3IsIGVudHJpZXMsIGZhbHNlIC8qIGRvbid0IGFib3J0IG9uIHJlamVjdCAqLywgbGFiZWwpO1xuICAgIH1cblxuICAgIGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRBbGxTZXR0bGVkLnByb3RvdHlwZSA9IGxpYiRyc3ZwJHV0aWxzJCRvX2NyZWF0ZShsaWIkcnN2cCRlbnVtZXJhdG9yJCRkZWZhdWx0LnByb3RvdHlwZSk7XG4gICAgbGliJHJzdnAkYWxsJHNldHRsZWQkJEFsbFNldHRsZWQucHJvdG90eXBlLl9zdXBlckNvbnN0cnVjdG9yID0gbGliJHJzdnAkZW51bWVyYXRvciQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkQWxsU2V0dGxlZC5wcm90b3R5cGUuX21ha2VSZXN1bHQgPSBsaWIkcnN2cCRlbnVtZXJhdG9yJCRtYWtlU2V0dGxlZFJlc3VsdDtcbiAgICBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkQWxsU2V0dGxlZC5wcm90b3R5cGUuX3ZhbGlkYXRpb25FcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignYWxsU2V0dGxlZCBtdXN0IGJlIGNhbGxlZCB3aXRoIGFuIGFycmF5Jyk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRhbGxTZXR0bGVkKGVudHJpZXMsIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbmV3IGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRBbGxTZXR0bGVkKGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQsIGVudHJpZXMsIGxhYmVsKS5wcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkYWxsJHNldHRsZWQkJGRlZmF1bHQgPSBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkYWxsU2V0dGxlZDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhbGwkJGFsbChhcnJheSwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LmFsbChhcnJheSwgbGFiZWwpO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkYWxsJCRkZWZhdWx0ID0gbGliJHJzdnAkYWxsJCRhbGw7XG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJGxlbiA9IDA7XG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJHZlcnR4TmV4dDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCRhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJHF1ZXVlW2xpYiRyc3ZwJGFzYXAkJGxlbl0gPSBjYWxsYmFjaztcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJHF1ZXVlW2xpYiRyc3ZwJGFzYXAkJGxlbiArIDFdID0gYXJnO1xuICAgICAgbGliJHJzdnAkYXNhcCQkbGVuICs9IDI7XG4gICAgICBpZiAobGliJHJzdnAkYXNhcCQkbGVuID09PSAyKSB7XG4gICAgICAgIC8vIElmIGxlbiBpcyAxLCB0aGF0IG1lYW5zIHRoYXQgd2UgbmVlZCB0byBzY2hlZHVsZSBhbiBhc3luYyBmbHVzaC5cbiAgICAgICAgLy8gSWYgYWRkaXRpb25hbCBjYWxsYmFja3MgYXJlIHF1ZXVlZCBiZWZvcmUgdGhlIHF1ZXVlIGlzIGZsdXNoZWQsIHRoZXlcbiAgICAgICAgLy8gd2lsbCBiZSBwcm9jZXNzZWQgYnkgdGhpcyBmbHVzaCB0aGF0IHdlIGFyZSBzY2hlZHVsaW5nLlxuICAgICAgICBsaWIkcnN2cCRhc2FwJCRzY2hlZHVsZUZsdXNoKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJGRlZmF1bHQgPSBsaWIkcnN2cCRhc2FwJCRhc2FwO1xuXG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJGJyb3dzZXJXaW5kb3cgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpID8gd2luZG93IDogdW5kZWZpbmVkO1xuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRicm93c2VyR2xvYmFsID0gbGliJHJzdnAkYXNhcCQkYnJvd3NlcldpbmRvdyB8fCB7fTtcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBsaWIkcnN2cCRhc2FwJCRicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgbGliJHJzdnAkYXNhcCQkYnJvd3Nlckdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRpc05vZGUgPSB0eXBlb2Ygc2VsZiA9PT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB7fS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXSc7XG5cbiAgICAvLyB0ZXN0IGZvciB3ZWIgd29ya2VyIGJ1dCBub3QgaW4gSUUxMFxuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRpc1dvcmtlciA9IHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIHR5cGVvZiBpbXBvcnRTY3JpcHRzICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgdHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSAndW5kZWZpbmVkJztcblxuICAgIC8vIG5vZGVcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCR1c2VOZXh0VGljaygpIHtcbiAgICAgIHZhciBuZXh0VGljayA9IHByb2Nlc3MubmV4dFRpY2s7XG4gICAgICAvLyBub2RlIHZlcnNpb24gMC4xMC54IGRpc3BsYXlzIGEgZGVwcmVjYXRpb24gd2FybmluZyB3aGVuIG5leHRUaWNrIGlzIHVzZWQgcmVjdXJzaXZlbHlcbiAgICAgIC8vIHNldEltbWVkaWF0ZSBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkIGluc3RlYWRcbiAgICAgIHZhciB2ZXJzaW9uID0gcHJvY2Vzcy52ZXJzaW9ucy5ub2RlLm1hdGNoKC9eKD86KFxcZCspXFwuKT8oPzooXFxkKylcXC4pPyhcXCp8XFxkKykkLyk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2ZXJzaW9uKSAmJiB2ZXJzaW9uWzFdID09PSAnMCcgJiYgdmVyc2lvblsyXSA9PT0gJzEwJykge1xuICAgICAgICBuZXh0VGljayA9IHNldEltbWVkaWF0ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgbmV4dFRpY2sobGliJHJzdnAkYXNhcCQkZmx1c2gpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyB2ZXJ0eFxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJHVzZVZlcnR4VGltZXIoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGxpYiRyc3ZwJGFzYXAkJHZlcnR4TmV4dChsaWIkcnN2cCRhc2FwJCRmbHVzaCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgbGliJHJzdnAkYXNhcCQkQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIobGliJHJzdnAkYXNhcCQkZmx1c2gpO1xuICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTtcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBub2RlLmRhdGEgPSAoaXRlcmF0aW9ucyA9ICsraXRlcmF0aW9ucyAlIDIpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyB3ZWIgd29ya2VyXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkdXNlTWVzc2FnZUNoYW5uZWwoKSB7XG4gICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaWIkcnN2cCRhc2FwJCRmbHVzaDtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJHVzZVNldFRpbWVvdXQoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNldFRpbWVvdXQobGliJHJzdnAkYXNhcCQkZmx1c2gsIDEpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkcXVldWUgPSBuZXcgQXJyYXkoMTAwMCk7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkZmx1c2goKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpYiRyc3ZwJGFzYXAkJGxlbjsgaSs9Mikge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBsaWIkcnN2cCRhc2FwJCRxdWV1ZVtpXTtcbiAgICAgICAgdmFyIGFyZyA9IGxpYiRyc3ZwJGFzYXAkJHF1ZXVlW2krMV07XG5cbiAgICAgICAgY2FsbGJhY2soYXJnKTtcblxuICAgICAgICBsaWIkcnN2cCRhc2FwJCRxdWV1ZVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGliJHJzdnAkYXNhcCQkcXVldWVbaSsxXSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgbGliJHJzdnAkYXNhcCQkbGVuID0gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCRhdHRlbXB0VmVydGV4KCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHIgPSByZXF1aXJlO1xuICAgICAgICB2YXIgdmVydHggPSByKCd2ZXJ0eCcpO1xuICAgICAgICBsaWIkcnN2cCRhc2FwJCR2ZXJ0eE5leHQgPSB2ZXJ0eC5ydW5Pbkxvb3AgfHwgdmVydHgucnVuT25Db250ZXh0O1xuICAgICAgICByZXR1cm4gbGliJHJzdnAkYXNhcCQkdXNlVmVydHhUaW1lcigpO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybiBsaWIkcnN2cCRhc2FwJCR1c2VTZXRUaW1lb3V0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJHNjaGVkdWxlRmx1c2g7XG4gICAgLy8gRGVjaWRlIHdoYXQgYXN5bmMgbWV0aG9kIHRvIHVzZSB0byB0cmlnZ2VyaW5nIHByb2Nlc3Npbmcgb2YgcXVldWVkIGNhbGxiYWNrczpcbiAgICBpZiAobGliJHJzdnAkYXNhcCQkaXNOb2RlKSB7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJHJzdnAkYXNhcCQkdXNlTmV4dFRpY2soKTtcbiAgICB9IGVsc2UgaWYgKGxpYiRyc3ZwJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJHJzdnAkYXNhcCQkdXNlTXV0YXRpb25PYnNlcnZlcigpO1xuICAgIH0gZWxzZSBpZiAobGliJHJzdnAkYXNhcCQkaXNXb3JrZXIpIHtcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkcnN2cCRhc2FwJCR1c2VNZXNzYWdlQ2hhbm5lbCgpO1xuICAgIH0gZWxzZSBpZiAobGliJHJzdnAkYXNhcCQkYnJvd3NlcldpbmRvdyA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJHJzdnAkYXNhcCQkYXR0ZW1wdFZlcnRleCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJHJzdnAkYXNhcCQkdXNlU2V0VGltZW91dCgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRkZWZlciQkZGVmZXIobGFiZWwpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9IHt9O1xuXG4gICAgICBkZWZlcnJlZFsncHJvbWlzZSddID0gbmV3IGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGRlZmVycmVkWydyZXNvbHZlJ10gPSByZXNvbHZlO1xuICAgICAgICBkZWZlcnJlZFsncmVqZWN0J10gPSByZWplY3Q7XG4gICAgICB9LCBsYWJlbCk7XG5cbiAgICAgIHJldHVybiBkZWZlcnJlZDtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGRlZmVyJCRkZWZhdWx0ID0gbGliJHJzdnAkZGVmZXIkJGRlZmVyO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGZpbHRlciQkZmlsdGVyKHByb21pc2VzLCBmaWx0ZXJGbiwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LmFsbChwcm9taXNlcywgbGFiZWwpLnRoZW4oZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICAgIGlmICghbGliJHJzdnAkdXRpbHMkJGlzRnVuY3Rpb24oZmlsdGVyRm4pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIllvdSBtdXN0IHBhc3MgYSBmdW5jdGlvbiBhcyBmaWx0ZXIncyBzZWNvbmQgYXJndW1lbnQuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGg7XG4gICAgICAgIHZhciBmaWx0ZXJlZCA9IG5ldyBBcnJheShsZW5ndGgpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBmaWx0ZXJlZFtpXSA9IGZpbHRlckZuKHZhbHVlc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5hbGwoZmlsdGVyZWQsIGxhYmVsKS50aGVuKGZ1bmN0aW9uKGZpbHRlcmVkKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdHMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICAgICAgICB2YXIgbmV3TGVuZ3RoID0gMDtcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXJlZFtpXSkge1xuICAgICAgICAgICAgICByZXN1bHRzW25ld0xlbmd0aF0gPSB2YWx1ZXNbaV07XG4gICAgICAgICAgICAgIG5ld0xlbmd0aCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc3VsdHMubGVuZ3RoID0gbmV3TGVuZ3RoO1xuXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRmaWx0ZXIkJGRlZmF1bHQgPSBsaWIkcnN2cCRmaWx0ZXIkJGZpbHRlcjtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2goQ29uc3RydWN0b3IsIG9iamVjdCwgbGFiZWwpIHtcbiAgICAgIHRoaXMuX3N1cGVyQ29uc3RydWN0b3IoQ29uc3RydWN0b3IsIG9iamVjdCwgdHJ1ZSwgbGFiZWwpO1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJGRlZmF1bHQgPSBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoO1xuXG4gICAgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaC5wcm90b3R5cGUgPSBsaWIkcnN2cCR1dGlscyQkb19jcmVhdGUobGliJHJzdnAkZW51bWVyYXRvciQkZGVmYXVsdC5wcm90b3R5cGUpO1xuICAgIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2gucHJvdG90eXBlLl9zdXBlckNvbnN0cnVjdG9yID0gbGliJHJzdnAkZW51bWVyYXRvciQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fcmVzdWx0ID0ge307XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2gucHJvdG90eXBlLl92YWxpZGF0ZUlucHV0ID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgIHJldHVybiBpbnB1dCAmJiB0eXBlb2YgaW5wdXQgPT09ICdvYmplY3QnO1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoLnByb3RvdHlwZS5fdmFsaWRhdGlvbkVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdQcm9taXNlLmhhc2ggbXVzdCBiZSBjYWxsZWQgd2l0aCBhbiBvYmplY3QnKTtcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaC5wcm90b3R5cGUuX2VudW1lcmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuICAgICAgdmFyIHByb21pc2UgICAgPSBlbnVtZXJhdG9yLnByb21pc2U7XG4gICAgICB2YXIgaW5wdXQgICAgICA9IGVudW1lcmF0b3IuX2lucHV0O1xuICAgICAgdmFyIHJlc3VsdHMgICAgPSBbXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIGlucHV0KSB7XG4gICAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChpbnB1dCwga2V5KSkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICBwb3NpdGlvbjoga2V5LFxuICAgICAgICAgICAgZW50cnk6IGlucHV0W2tleV1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgbGVuZ3RoID0gcmVzdWx0cy5sZW5ndGg7XG4gICAgICBlbnVtZXJhdG9yLl9yZW1haW5pbmcgPSBsZW5ndGg7XG4gICAgICB2YXIgcmVzdWx0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgcHJvbWlzZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORyAmJiBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0c1tpXTtcbiAgICAgICAgZW51bWVyYXRvci5fZWFjaEVudHJ5KHJlc3VsdC5lbnRyeSwgcmVzdWx0LnBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRIYXNoU2V0dGxlZChDb25zdHJ1Y3Rvciwgb2JqZWN0LCBsYWJlbCkge1xuICAgICAgdGhpcy5fc3VwZXJDb25zdHJ1Y3RvcihDb25zdHJ1Y3Rvciwgb2JqZWN0LCBmYWxzZSwgbGFiZWwpO1xuICAgIH1cblxuICAgIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkSGFzaFNldHRsZWQucHJvdG90eXBlID0gbGliJHJzdnAkdXRpbHMkJG9fY3JlYXRlKGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkZGVmYXVsdC5wcm90b3R5cGUpO1xuICAgIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkSGFzaFNldHRsZWQucHJvdG90eXBlLl9zdXBlckNvbnN0cnVjdG9yID0gbGliJHJzdnAkZW51bWVyYXRvciQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJEhhc2hTZXR0bGVkLnByb3RvdHlwZS5fbWFrZVJlc3VsdCA9IGxpYiRyc3ZwJGVudW1lcmF0b3IkJG1ha2VTZXR0bGVkUmVzdWx0O1xuXG4gICAgbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRIYXNoU2V0dGxlZC5wcm90b3R5cGUuX3ZhbGlkYXRpb25FcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignaGFzaFNldHRsZWQgbXVzdCBiZSBjYWxsZWQgd2l0aCBhbiBvYmplY3QnKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRoYXNoU2V0dGxlZChvYmplY3QsIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbmV3IGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkSGFzaFNldHRsZWQobGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdCwgb2JqZWN0LCBsYWJlbCkucHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkZGVmYXVsdCA9IGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkaGFzaFNldHRsZWQ7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkaGFzaCQkaGFzaChvYmplY3QsIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbmV3IGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkZGVmYXVsdChsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LCBvYmplY3QsIGxhYmVsKS5wcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkaGFzaCQkZGVmYXVsdCA9IGxpYiRyc3ZwJGhhc2gkJGhhc2g7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbWFwJCRtYXAocHJvbWlzZXMsIG1hcEZuLCBsYWJlbCkge1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQuYWxsKHByb21pc2VzLCBsYWJlbCkudGhlbihmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgICAgaWYgKCFsaWIkcnN2cCR1dGlscyQkaXNGdW5jdGlvbihtYXBGbikpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiWW91IG11c3QgcGFzcyBhIGZ1bmN0aW9uIGFzIG1hcCdzIHNlY29uZCBhcmd1bWVudC5cIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aDtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgcmVzdWx0c1tpXSA9IG1hcEZuKHZhbHVlc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5hbGwocmVzdWx0cywgbGFiZWwpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRtYXAkJGRlZmF1bHQgPSBsaWIkcnN2cCRtYXAkJG1hcDtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJFJlc3VsdCgpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJG5vZGUkJEVSUk9SID0gbmV3IGxpYiRyc3ZwJG5vZGUkJFJlc3VsdCgpO1xuICAgIHZhciBsaWIkcnN2cCRub2RlJCRHRVRfVEhFTl9FUlJPUiA9IG5ldyBsaWIkcnN2cCRub2RlJCRSZXN1bHQoKTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJGdldFRoZW4ob2JqKSB7XG4gICAgICB0cnkge1xuICAgICAgIHJldHVybiBvYmoudGhlbjtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgbGliJHJzdnAkbm9kZSQkRVJST1IudmFsdWU9IGVycm9yO1xuICAgICAgICByZXR1cm4gbGliJHJzdnAkbm9kZSQkRVJST1I7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCR0cnlBcHBseShmLCBzLCBhKSB7XG4gICAgICB0cnkge1xuICAgICAgICBmLmFwcGx5KHMsIGEpO1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsaWIkcnN2cCRub2RlJCRFUlJPUi52YWx1ZSA9IGVycm9yO1xuICAgICAgICByZXR1cm4gbGliJHJzdnAkbm9kZSQkRVJST1I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkbWFrZU9iamVjdChfLCBhcmd1bWVudE5hbWVzKSB7XG4gICAgICB2YXIgb2JqID0ge307XG4gICAgICB2YXIgbmFtZTtcbiAgICAgIHZhciBpO1xuICAgICAgdmFyIGxlbmd0aCA9IF8ubGVuZ3RoO1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkobGVuZ3RoKTtcblxuICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBsZW5ndGg7IHgrKykge1xuICAgICAgICBhcmdzW3hdID0gX1t4XTtcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gMDsgaSA8IGFyZ3VtZW50TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbmFtZSA9IGFyZ3VtZW50TmFtZXNbaV07XG4gICAgICAgIG9ialtuYW1lXSA9IGFyZ3NbaSArIDFdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJGFycmF5UmVzdWx0KF8pIHtcbiAgICAgIHZhciBsZW5ndGggPSBfLmxlbmd0aDtcbiAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGxlbmd0aCAtIDEpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFyZ3NbaSAtIDFdID0gX1tpXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFyZ3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkd3JhcFRoZW5hYmxlKHRoZW4sIHByb21pc2UpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uKG9uRnVsRmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIHRoZW4uY2FsbChwcm9taXNlLCBvbkZ1bEZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkZGVub2RlaWZ5KG5vZGVGdW5jLCBvcHRpb25zKSB7XG4gICAgICB2YXIgZm4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgbCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGwgKyAxKTtcbiAgICAgICAgdmFyIGFyZztcbiAgICAgICAgdmFyIHByb21pc2VJbnB1dCA9IGZhbHNlO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgYXJnID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICAgICAgaWYgKCFwcm9taXNlSW5wdXQpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IGNsZWFuIHRoaXMgdXBcbiAgICAgICAgICAgIHByb21pc2VJbnB1dCA9IGxpYiRyc3ZwJG5vZGUkJG5lZWRzUHJvbWlzZUlucHV0KGFyZyk7XG4gICAgICAgICAgICBpZiAocHJvbWlzZUlucHV0ID09PSBsaWIkcnN2cCRub2RlJCRHRVRfVEhFTl9FUlJPUikge1xuICAgICAgICAgICAgICB2YXIgcCA9IG5ldyBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0KGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCk7XG4gICAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHAsIGxpYiRyc3ZwJG5vZGUkJEdFVF9USEVOX0VSUk9SLnZhbHVlKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb21pc2VJbnB1dCAmJiBwcm9taXNlSW5wdXQgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgYXJnID0gbGliJHJzdnAkbm9kZSQkd3JhcFRoZW5hYmxlKHByb21pc2VJbnB1dCwgYXJnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwcm9taXNlID0gbmV3IGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQobGliJHJzdnAkJGludGVybmFsJCRub29wKTtcblxuICAgICAgICBhcmdzW2xdID0gZnVuY3Rpb24oZXJyLCB2YWwpIHtcbiAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgZXJyKTtcbiAgICAgICAgICBlbHNlIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsKTtcbiAgICAgICAgICBlbHNlIGlmIChvcHRpb25zID09PSB0cnVlKVxuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIGxpYiRyc3ZwJG5vZGUkJGFycmF5UmVzdWx0KGFyZ3VtZW50cykpO1xuICAgICAgICAgIGVsc2UgaWYgKGxpYiRyc3ZwJHV0aWxzJCRpc0FycmF5KG9wdGlvbnMpKVxuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIGxpYiRyc3ZwJG5vZGUkJG1ha2VPYmplY3QoYXJndW1lbnRzLCBvcHRpb25zKSk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHByb21pc2VJbnB1dCkge1xuICAgICAgICAgIHJldHVybiBsaWIkcnN2cCRub2RlJCRoYW5kbGVQcm9taXNlSW5wdXQocHJvbWlzZSwgYXJncywgbm9kZUZ1bmMsIHNlbGYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBsaWIkcnN2cCRub2RlJCRoYW5kbGVWYWx1ZUlucHV0KHByb21pc2UsIGFyZ3MsIG5vZGVGdW5jLCBzZWxmKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZm4uX19wcm90b19fID0gbm9kZUZ1bmM7XG5cbiAgICAgIHJldHVybiBmbjtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkbm9kZSQkZGVmYXVsdCA9IGxpYiRyc3ZwJG5vZGUkJGRlbm9kZWlmeTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJGhhbmRsZVZhbHVlSW5wdXQocHJvbWlzZSwgYXJncywgbm9kZUZ1bmMsIHNlbGYpIHtcbiAgICAgIHZhciByZXN1bHQgPSBsaWIkcnN2cCRub2RlJCR0cnlBcHBseShub2RlRnVuYywgc2VsZiwgYXJncyk7XG4gICAgICBpZiAocmVzdWx0ID09PSBsaWIkcnN2cCRub2RlJCRFUlJPUikge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZXN1bHQudmFsdWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkaGFuZGxlUHJvbWlzZUlucHV0KHByb21pc2UsIGFyZ3MsIG5vZGVGdW5jLCBzZWxmKXtcbiAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LmFsbChhcmdzKS50aGVuKGZ1bmN0aW9uKGFyZ3Mpe1xuICAgICAgICB2YXIgcmVzdWx0ID0gbGliJHJzdnAkbm9kZSQkdHJ5QXBwbHkobm9kZUZ1bmMsIHNlbGYsIGFyZ3MpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBsaWIkcnN2cCRub2RlJCRFUlJPUikge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlc3VsdC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRuZWVkc1Byb21pc2VJbnB1dChhcmcpIHtcbiAgICAgIGlmIChhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgaWYgKGFyZy5jb25zdHJ1Y3RvciA9PT0gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBsaWIkcnN2cCRub2RlJCRnZXRUaGVuKGFyZyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHBsYXRmb3JtJCRwbGF0Zm9ybTtcblxuICAgIC8qIGdsb2JhbCBzZWxmICovXG4gICAgaWYgKHR5cGVvZiBzZWxmID09PSAnb2JqZWN0Jykge1xuICAgICAgbGliJHJzdnAkcGxhdGZvcm0kJHBsYXRmb3JtID0gc2VsZjtcblxuICAgIC8qIGdsb2JhbCBnbG9iYWwgKi9cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgPT09ICdvYmplY3QnKSB7XG4gICAgICBsaWIkcnN2cCRwbGF0Zm9ybSQkcGxhdGZvcm0gPSBnbG9iYWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gZ2xvYmFsOiBgc2VsZmAgb3IgYGdsb2JhbGAgZm91bmQnKTtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkcGxhdGZvcm0kJGRlZmF1bHQgPSBsaWIkcnN2cCRwbGF0Zm9ybSQkcGxhdGZvcm07XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcmFjZSQkcmFjZShhcnJheSwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LnJhY2UoYXJyYXksIGxhYmVsKTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHJhY2UkJGRlZmF1bHQgPSBsaWIkcnN2cCRyYWNlJCRyYWNlO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHJlamVjdCQkcmVqZWN0KHJlYXNvbiwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LnJlamVjdChyZWFzb24sIGxhYmVsKTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHJlamVjdCQkZGVmYXVsdCA9IGxpYiRyc3ZwJHJlamVjdCQkcmVqZWN0O1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHJlc29sdmUkJHJlc29sdmUodmFsdWUsIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5yZXNvbHZlKHZhbHVlLCBsYWJlbCk7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRyZXNvbHZlJCRkZWZhdWx0ID0gbGliJHJzdnAkcmVzb2x2ZSQkcmVzb2x2ZTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRyZXRocm93JCRyZXRocm93KHJlYXNvbikge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdGhyb3cgcmVhc29uO1xuICAgICAgfSk7XG4gICAgICB0aHJvdyByZWFzb247XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRyZXRocm93JCRkZWZhdWx0ID0gbGliJHJzdnAkcmV0aHJvdyQkcmV0aHJvdztcblxuICAgIC8vIGRlZmF1bHRzXG4gICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYXN5bmMgPSBsaWIkcnN2cCRhc2FwJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFmdGVyID0gZnVuY3Rpb24oY2IpIHtcbiAgICAgIHNldFRpbWVvdXQoY2IsIDApO1xuICAgIH07XG4gICAgdmFyIGxpYiRyc3ZwJCRjYXN0ID0gbGliJHJzdnAkcmVzb2x2ZSQkZGVmYXVsdDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkYXN5bmMoY2FsbGJhY2ssIGFyZykge1xuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYXN5bmMoY2FsbGJhY2ssIGFyZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJG9uKCkge1xuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWdbJ29uJ10uYXBwbHkobGliJHJzdnAkY29uZmlnJCRjb25maWcsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJG9mZigpIHtcbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnWydvZmYnXS5hcHBseShsaWIkcnN2cCRjb25maWckJGNvbmZpZywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdXAgaW5zdHJ1bWVudGF0aW9uIHRocm91Z2ggYHdpbmRvdy5fX1BST01JU0VfSU5UUlVNRU5UQVRJT05fX2BcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvd1snX19QUk9NSVNFX0lOU1RSVU1FTlRBVElPTl9fJ10gPT09ICdvYmplY3QnKSB7XG4gICAgICB2YXIgbGliJHJzdnAkJGNhbGxiYWNrcyA9IHdpbmRvd1snX19QUk9NSVNFX0lOU1RSVU1FTlRBVElPTl9fJ107XG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ3VyZSgnaW5zdHJ1bWVudCcsIHRydWUpO1xuICAgICAgZm9yICh2YXIgbGliJHJzdnAkJGV2ZW50TmFtZSBpbiBsaWIkcnN2cCQkY2FsbGJhY2tzKSB7XG4gICAgICAgIGlmIChsaWIkcnN2cCQkY2FsbGJhY2tzLmhhc093blByb3BlcnR5KGxpYiRyc3ZwJCRldmVudE5hbWUpKSB7XG4gICAgICAgICAgbGliJHJzdnAkJG9uKGxpYiRyc3ZwJCRldmVudE5hbWUsIGxpYiRyc3ZwJCRjYWxsYmFja3NbbGliJHJzdnAkJGV2ZW50TmFtZV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHVtZCQkUlNWUCA9IHtcbiAgICAgICdyYWNlJzogbGliJHJzdnAkcmFjZSQkZGVmYXVsdCxcbiAgICAgICdQcm9taXNlJzogbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdCxcbiAgICAgICdhbGxTZXR0bGVkJzogbGliJHJzdnAkYWxsJHNldHRsZWQkJGRlZmF1bHQsXG4gICAgICAnaGFzaCc6IGxpYiRyc3ZwJGhhc2gkJGRlZmF1bHQsXG4gICAgICAnaGFzaFNldHRsZWQnOiBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJGRlZmF1bHQsXG4gICAgICAnZGVub2RlaWZ5JzogbGliJHJzdnAkbm9kZSQkZGVmYXVsdCxcbiAgICAgICdvbic6IGxpYiRyc3ZwJCRvbixcbiAgICAgICdvZmYnOiBsaWIkcnN2cCQkb2ZmLFxuICAgICAgJ21hcCc6IGxpYiRyc3ZwJG1hcCQkZGVmYXVsdCxcbiAgICAgICdmaWx0ZXInOiBsaWIkcnN2cCRmaWx0ZXIkJGRlZmF1bHQsXG4gICAgICAncmVzb2x2ZSc6IGxpYiRyc3ZwJHJlc29sdmUkJGRlZmF1bHQsXG4gICAgICAncmVqZWN0JzogbGliJHJzdnAkcmVqZWN0JCRkZWZhdWx0LFxuICAgICAgJ2FsbCc6IGxpYiRyc3ZwJGFsbCQkZGVmYXVsdCxcbiAgICAgICdyZXRocm93JzogbGliJHJzdnAkcmV0aHJvdyQkZGVmYXVsdCxcbiAgICAgICdkZWZlcic6IGxpYiRyc3ZwJGRlZmVyJCRkZWZhdWx0LFxuICAgICAgJ0V2ZW50VGFyZ2V0JzogbGliJHJzdnAkZXZlbnRzJCRkZWZhdWx0LFxuICAgICAgJ2NvbmZpZ3VyZSc6IGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlndXJlLFxuICAgICAgJ2FzeW5jJzogbGliJHJzdnAkJGFzeW5jXG4gICAgfTtcblxuICAgIC8qIGdsb2JhbCBkZWZpbmU6dHJ1ZSBtb2R1bGU6dHJ1ZSB3aW5kb3c6IHRydWUgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmVbJ2FtZCddKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBsaWIkcnN2cCR1bWQkJFJTVlA7IH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlWydleHBvcnRzJ10pIHtcbiAgICAgIG1vZHVsZVsnZXhwb3J0cyddID0gbGliJHJzdnAkdW1kJCRSU1ZQO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGxpYiRyc3ZwJHBsYXRmb3JtJCRkZWZhdWx0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgbGliJHJzdnAkcGxhdGZvcm0kJGRlZmF1bHRbJ1JTVlAnXSA9IGxpYiRyc3ZwJHVtZCQkUlNWUDtcbiAgICB9XG59KS5jYWxsKHRoaXMpO1xuXG4iXX0=

//# sourceMappingURL=algorithm_visualizer.js.map
