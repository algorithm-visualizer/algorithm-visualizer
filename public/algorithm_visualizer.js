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
  loadedScratch: null,
  wikiList: null
};

var initState = function initState(tracerManager) {
  state.isLoading = false;
  state.editor = new Editor(tracerManager);
  state.tracerManager = tracerManager;
  state.categories = {};
  state.loadedScratch = null;
  state.wikiList = [];
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

  this.getWikiList = function () {
    return state.wikiList;
  };

  this.setWikiList = function (wikiList) {
    state.wikiList = wikiList;
  };

  this.hasWiki = function (wiki) {
    return ~state.wikiList.indexOf(wiki);
  };

  var tracerManager = TracerManager.init();

  initState(tracerManager);
  DOM.setup(tracerManager);
};

App.prototype = Cache;

module.exports = App;

},{"../dom/loading_slider":7,"../dom/setup":9,"../editor":28,"../tracer_manager":63,"./cache":1}],3:[function(require,module,exports){
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


var getAlgorithmDOM = function getAlgorithmDOM(category, subList, algorithm) {
  return $('<button class="indent">').append(subList[algorithm]).attr('data-algorithm', algorithm).attr('data-category', category).click(function () {
    Server.loadAlgorithm(category, algorithm).then(function (data) {
      showAlgorithm(category, algorithm, data);
      console.log("하하하");
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
    var $self = $(this);
    $self.toggleClass('open');
    $self.next().toggleClass('collapse');
    $self.find('i.fa').toggleClass('fa-caret-right fa-caret-down');
  });

  var $algorithms = $('<div class="algorithms collapse">');
  $('#list').append($category).append($algorithms);

  each(categorySubList, function (algorithm) {
    var $algorithm = getAlgorithmDOM(category, categorySubList, algorithm);
    $algorithms.append($algorithm);
  });
};

module.exports = function () {
  each(app.getCategories(), addCategoryToDOM);
};

},{"../app":3,"../server":55,"./show_algorithm":19}],5:[function(require,module,exports){
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
var showWiki = require('./show_wiki');

module.exports = {
  showAlgorithm: showAlgorithm,
  addCategories: addCategories,
  showDescription: showDescription,
  addFiles: addFiles,
  showFirstAlgorithm: showFirstAlgorithm,
  showRequestedAlgorithm: showRequestedAlgorithm,
  showWiki: showWiki
};

},{"./add_categories":4,"./add_files":5,"./show_algorithm":19,"./show_description":20,"./show_first_algorithm":21,"./show_requested_algorithm":22,"./show_wiki":23}],7:[function(require,module,exports){
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
var setupTabContainer = require('./setup_tab_container');
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

  // tab container
  setupTabContainer();

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

},{"./setup_dividers":10,"./setup_document":11,"./setup_files_bar":12,"./setup_interval":13,"./setup_module_container":14,"./setup_side_menu":15,"./setup_tab_container":16,"./setup_top_menu":17,"./setup_window":18}],10:[function(require,module,exports){
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
    var href = $(this).attr('href');
    if (/^(https?:\/\/).+/.test(href)) {
      e.preventDefault();
      if (!window.open(href, '_blank')) {
        alert('Please allow popups for this site');
      }
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

var app = require('../../app');
var Server = require('../../server');
var showAlgorithm = require('../show_algorithm');

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

  $('#documentation').click(function () {
    $('#btn_doc').click();
  });

  $('#powered-by').click(function () {
    $('#powered-by-list button').toggleClass('collapse');
  });

  $('#scratch-paper').click(function () {
    var category = 'scratch';
    var algorithm = app.getLoadedScratch();
    Server.loadAlgorithm(category, algorithm).then(function (data) {
      showAlgorithm(category, algorithm, data);
    });
  });
};

},{"../../app":3,"../../server":55,"../show_algorithm":19}],16:[function(require,module,exports){
'use strict';

module.exports = function () {
  $('.tab_bar > button').click(function () {
    $('.tab_bar > button').removeClass('active');
    $('.tab_container > .tab').removeClass('active');
    $(this).addClass('active');
    $($(this).attr('data-target')).addClass('active');
  });
};

},{}],17:[function(require,module,exports){
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
      TopMenu.resetTopMenuButtons();
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
};

},{"../../app":3,"../../server":55,"../toast":24,"../top_menu":25}],18:[function(require,module,exports){
'use strict';

var app = require('../../app');

module.exports = function () {
  $(window).resize(function () {
    app.getTracerManager().resize();
  });
};

},{"../../app":3}],19:[function(require,module,exports){
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
  $('#tab_desc > .tab_inner > .wrapper').empty();
  $('.files_bar > .wrapper').empty();
  $('#explanation').html('');

  app.setLastFileUsed(null);
  app.getEditor().clearContent();

  var files = data.files;


  delete data.files;

  showDescription(data);
  addFiles(category, algorithm, files, requestedFile);
};

},{"../app":3,"../utils":69,"./add_files":5,"./show_description":20}],20:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var isArray = Array.isArray;
var _$ = $;
var each = _$.each;


module.exports = function (data) {
  var $container = $('#tab_desc > .tab_inner > .wrapper');
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

},{}],21:[function(require,module,exports){
'use strict';

// click the first algorithm in the first category

module.exports = function () {
  $('#list .category').first().click();
  $('#list .category + .algorithms > .indent').first().click();
};

},{}],22:[function(require,module,exports){
'use strict';

var Server = require('../server');
var showAlgorithm = require('./show_algorithm');

module.exports = function (category, algorithm, file) {
  $('.category[data-category="' + category + '"]').click();
  Server.loadAlgorithm(category, algorithm).then(function (data) {
    showAlgorithm(category, algorithm, data, file);
  });
};

},{"../server":55,"./show_algorithm":19}],23:[function(require,module,exports){
'use strict';

var app = require('../app');
var Server = require('../server');
var converter = new showdown.Converter({ tables: true });

module.exports = function (wiki) {
  Server.loadWiki(wiki).then(function (data) {
    $('#tab_doc > .tab_inner > .wrapper').html(converter.makeHtml('#' + wiki + '\n' + data));
    $('#tab_doc').scrollTop(0);
    $('#tab_doc > .tab_inner > .wrapper a').click(function (e) {
      var href = $(this).attr('href');
      if (app.hasWiki(href)) {
        e.preventDefault();
        module.exports(href);
      }
    });
  });
};

},{"../app":3,"../server":55}],24:[function(require,module,exports){
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

var app = require('../app');

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
  app.getEditor().unhighlightLine();
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

},{"../app":3}],26:[function(require,module,exports){
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

var execute = function execute(tracerManager, code, dataLines) {
  // all modules available to eval are obtained from window
  try {
    (function () {
      tracerManager.deallocateAll();
      var lines = code.split('\n');
      var newLines = [];
      lines.forEach(function (line, i) {
        newLines.push(line.replace(/(.+\. *_wait *)(\( *\))/g, '$1(' + (i - dataLines) + ')'));
      });
      eval(newLines.join('\n'));
      tracerManager.visualize();
    })();
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
  var dataLines = algoData.split('\n').length;
  return execute(tracerManager, algoData + '\n' + algoCode, dataLines);
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
var TopMenu = require('../dom/top_menu');

function Editor(tracerManager) {
  var _this = this;

  if (!tracerManager) {
    throw 'Cannot create Editor. Missing the tracerManager';
  }

  ace.require('ace/ext/language_tools');
  var Range = ace.require("ace/range").Range;

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

  this.highlightLine = function (lineNumber) {
    var session = _this.codeEditor.getSession();
    if (_this.marker) session.removeMarker(_this.marker);
    _this.marker = session.addMarker(new Range(lineNumber, 0, lineNumber, Infinity), "executing", "line", true);
  };

  this.unhighlightLine = function () {
    var session = _this.codeEditor.getSession();
    if (_this.marker) session.removeMarker(_this.marker);
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
    TopMenu.resetTopMenuButtons();
  });

  this.codeEditor.on('change', function () {
    var code = _this.codeEditor.getValue();
    var lastFileUsed = app.getLastFileUsed();
    if (lastFileUsed) {
      app.updateCachedFile(lastFileUsed, {
        code: code
      });
    }
    tracerManager.reset();
    TopMenu.resetTopMenuButtons();
  });
}

module.exports = Editor;

},{"../app":3,"../dom/top_menu":25,"./create":26,"./executor":27}],29:[function(require,module,exports){
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

  Server.loadWikiList().then(function (data) {
    app.setWikiList(data.wikis);

    DOM.showWiki('Tracer');
  });
});

},{"./app":3,"./app/constructor":2,"./dom":6,"./module":38,"./server":55,"./server/helpers":54,"./utils":69,"rsvp":71}],30:[function(require,module,exports){
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
'use strict';

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
'use strict';

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
'use strict';

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
'use strict';

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
'use strict';

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
'use strict';

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
    key: 'processStep',
    value: function processStep(step, options) {
      _get(Object.getPrototypeOf(Array1DTracer.prototype), 'processStep', this).call(this, step, options);
      if (this.chartTracer) {
        var newStep = $.extend(true, {}, step);
        newStep.capsule = this.chartTracer.capsule;
        newStep.s = newStep.sy;
        newStep.e = newStep.ey;
        if (newStep.s === undefined) newStep.s = newStep.y;
        delete newStep.x;
        delete newStep.y;
        delete newStep.sx;
        delete newStep.sy;
        delete newStep.ex;
        delete newStep.ey;
        this.chartTracer.processStep(newStep, options);
      }
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

},{"../../tracer_manager/util/index":66,"./tracer":46}],41:[function(require,module,exports){
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
      selected: 'rgb(0, 0, 255)',
      notified: 'rgb(255, 0, 0)',
      default: 'rgb(136, 136, 136)'
    };

    if (_this.isNew) initView(_this);
    return _this;
  }

  _createClass(ChartTracer, [{
    key: 'setData',
    value: function setData(C) {
      if (_get(Object.getPrototypeOf(ChartTracer.prototype), 'setData', this).apply(this, arguments)) {
        this.chart.config.data.datasets[0].data = C;
        this.chart.update();
        return true;
      }

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
        case 'select':
        case 'deselect':
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
      this.refresh();
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

},{"../../tracer_manager/util/index":66,"./tracer":46}],44:[function(require,module,exports){
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
    value: function _wait(line) {
      this.manager.newStep(line);
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
      switch (tracer.module) {
        case LogTracer:
          this.logTracer = tracer;
          break;
        case ChartTracer:
          this.chartTracer = tracer;
          break;
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

},{"../../app":3,"../../tracer_manager/util/index":66}],47:[function(require,module,exports){
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

},{"../../tracer_manager/util/index":66,"./directed_graph":43}],49:[function(require,module,exports){
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

},{"../../app":3,"rsvp":71}],54:[function(require,module,exports){
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
var loadWikiList = require('./load_wiki_list');
var loadWiki = require('./load_wiki');

module.exports = {
  loadAlgorithm: loadAlgorithm,
  loadCategories: loadCategories,
  loadFile: loadFile,
  loadScratchPaper: loadScratchPaper,
  shareScratchPaper: shareScratchPaper,
  loadWikiList: loadWikiList,
  loadWiki: loadWiki
};

},{"./load_algorithm":56,"./load_categories":57,"./load_file":58,"./load_scratch_paper":59,"./load_wiki":60,"./load_wiki_list":61,"./share_scratch_paper":62}],56:[function(require,module,exports){
'use strict';

var getJSON = require('./ajax/get_json');

var _require = require('../utils');

var getAlgorithmDir = _require.getAlgorithmDir;


module.exports = function (category, algorithm) {
  var dir = getAlgorithmDir(category, algorithm);
  return getJSON(dir + 'desc.json');
};

},{"../utils":69,"./ajax/get_json":51}],57:[function(require,module,exports){
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

},{"../app":3,"../utils":69,"./ajax/get":50,"./helpers":54,"rsvp":71}],59:[function(require,module,exports){
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

},{"../app":3,"../utils":69,"./ajax/get_json":51,"./load_algorithm":56,"rsvp":71}],60:[function(require,module,exports){
'use strict';

var get = require('./ajax/get');

module.exports = function (wiki) {
  return get('./AlgorithmVisualizer.wiki/' + wiki + '.md');
};

},{"./ajax/get":50}],61:[function(require,module,exports){
'use strict';

var getJSON = require('./ajax/get_json');

module.exports = function () {
  return getJSON('./wiki.json');
};

},{"./ajax/get_json":51}],62:[function(require,module,exports){
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

},{"../app":3,"./ajax/post_json":52,"./helpers":54,"rsvp":71}],63:[function(require,module,exports){
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

},{"../module/tracer/tracer":46,"./manager":64}],64:[function(require,module,exports){
'use strict';

var app = require('../app');
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
    if (len == 0) len += this.newStep();
    var last = this.traces[len - 1];
    last.push(extend(step, {
      capsule: capsule
    }));
  },
  newStep: function newStep() {
    var line = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];

    var len = this.traces.length;
    if (len > 0 && ~line) {
      this.traces[len - 1].push(line);
    }
    return this.traces.push([]);
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
      if (typeof step === 'number') {
        app.getEditor().highlightLine(step);
        return;
      }
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

},{"../app":3,"../dom/module_container":8,"../dom/top_menu":25}],65:[function(require,module,exports){
'use strict';

var parse = JSON.parse;


var fromJSON = function fromJSON(obj) {
  return parse(obj, function (key, value) {
    return value === 'Infinity' ? Infinity : value;
  });
};

module.exports = fromJSON;

},{}],66:[function(require,module,exports){
'use strict';

var toJSON = require('./to_json');
var fromJSON = require('./from_json');
var refineByType = require('./refine_by_type');

module.exports = {
  toJSON: toJSON,
  fromJSON: fromJSON,
  refineByType: refineByType
};

},{"./from_json":65,"./refine_by_type":67,"./to_json":68}],67:[function(require,module,exports){
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

},{}],68:[function(require,module,exports){
'use strict';

var stringify = JSON.stringify;


var toJSON = function toJSON(obj) {
  return stringify(obj, function (key, value) {
    return value === Infinity ? 'Infinity' : value;
  });
};

module.exports = toJSON;

},{}],69:[function(require,module,exports){
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

},{}],70:[function(require,module,exports){
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

},{}],71:[function(require,module,exports){
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

},{"_process":70}]},{},[29])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcYXBwXFxjYWNoZS5qcyIsImpzXFxhcHBcXGNvbnN0cnVjdG9yLmpzIiwianNcXGFwcFxcaW5kZXguanMiLCJqc1xcZG9tXFxhZGRfY2F0ZWdvcmllcy5qcyIsImpzXFxkb21cXGFkZF9maWxlcy5qcyIsImpzXFxkb21cXGluZGV4LmpzIiwianNcXGRvbVxcbG9hZGluZ19zbGlkZXIuanMiLCJqc1xcZG9tXFxtb2R1bGVfY29udGFpbmVyLmpzIiwianNcXGRvbVxcc2V0dXBcXGluZGV4LmpzIiwianNcXGRvbVxcc2V0dXBcXHNldHVwX2RpdmlkZXJzLmpzIiwianNcXGRvbVxcc2V0dXBcXHNldHVwX2RvY3VtZW50LmpzIiwianNcXGRvbVxcc2V0dXBcXHNldHVwX2ZpbGVzX2Jhci5qcyIsImpzXFxkb21cXHNldHVwXFxzZXR1cF9pbnRlcnZhbC5qcyIsImpzXFxkb21cXHNldHVwXFxzZXR1cF9tb2R1bGVfY29udGFpbmVyLmpzIiwianNcXGRvbVxcc2V0dXBcXHNldHVwX3NpZGVfbWVudS5qcyIsImpzXFxkb21cXHNldHVwXFxzZXR1cF90YWJfY29udGFpbmVyLmpzIiwianNcXGRvbVxcc2V0dXBcXHNldHVwX3RvcF9tZW51LmpzIiwianNcXGRvbVxcc2V0dXBcXHNldHVwX3dpbmRvdy5qcyIsImpzXFxkb21cXHNob3dfYWxnb3JpdGhtLmpzIiwianNcXGRvbVxcc2hvd19kZXNjcmlwdGlvbi5qcyIsImpzXFxkb21cXHNob3dfZmlyc3RfYWxnb3JpdGhtLmpzIiwianNcXGRvbVxcc2hvd19yZXF1ZXN0ZWRfYWxnb3JpdGhtLmpzIiwianNcXGRvbVxcc2hvd193aWtpLmpzIiwianNcXGRvbVxcdG9hc3QuanMiLCJqc1xcZG9tXFx0b3BfbWVudS5qcyIsImpzXFxlZGl0b3JcXGNyZWF0ZS5qcyIsImpzXFxlZGl0b3JcXGV4ZWN1dG9yLmpzIiwianNcXGVkaXRvclxcaW5kZXguanMiLCJqc1xcaW5kZXguanMiLCJqc1xcbW9kdWxlXFxkYXRhXFxhcnJheTFkLmpzIiwianNcXG1vZHVsZVxcZGF0YVxcYXJyYXkyZC5qcyIsImpzXFxtb2R1bGVcXGRhdGFcXGNvb3JkaW5hdGVfc3lzdGVtLmpzIiwianNcXG1vZHVsZVxcZGF0YVxcZGlyZWN0ZWRfZ3JhcGguanMiLCJqc1xcbW9kdWxlXFxkYXRhXFxpbmRleC5qcyIsImpzXFxtb2R1bGVcXGRhdGFcXHVuZGlyZWN0ZWRfZ3JhcGguanMiLCJqc1xcbW9kdWxlXFxkYXRhXFx3ZWlnaHRlZF9kaXJlY3RlZF9ncmFwaC5qcyIsImpzXFxtb2R1bGVcXGRhdGFcXHdlaWdodGVkX3VuZGlyZWN0ZWRfZ3JhcGguanMiLCJqc1xcbW9kdWxlXFxpbmRleC5qcyIsImpzXFxtb2R1bGVcXHRyYWNlclxcYXJyYXkxZC5qcyIsImpzXFxtb2R1bGVcXHRyYWNlclxcYXJyYXkyZC5qcyIsImpzXFxtb2R1bGVcXHRyYWNlclxcY2hhcnQuanMiLCJqc1xcbW9kdWxlXFx0cmFjZXJcXGNvb3JkaW5hdGVfc3lzdGVtLmpzIiwianNcXG1vZHVsZVxcdHJhY2VyXFxkaXJlY3RlZF9ncmFwaC5qcyIsImpzXFxtb2R1bGVcXHRyYWNlclxcaW5kZXguanMiLCJqc1xcbW9kdWxlXFx0cmFjZXJcXGxvZy5qcyIsImpzXFxtb2R1bGVcXHRyYWNlclxcdHJhY2VyLmpzIiwianNcXG1vZHVsZVxcdHJhY2VyXFx1bmRpcmVjdGVkX2dyYXBoLmpzIiwianNcXG1vZHVsZVxcdHJhY2VyXFx3ZWlnaHRlZF9kaXJlY3RlZF9ncmFwaC5qcyIsImpzXFxtb2R1bGVcXHRyYWNlclxcd2VpZ2h0ZWRfdW5kaXJlY3RlZF9ncmFwaC5qcyIsImpzXFxzZXJ2ZXJcXGFqYXhcXGdldC5qcyIsImpzXFxzZXJ2ZXJcXGFqYXhcXGdldF9qc29uLmpzIiwianNcXHNlcnZlclxcYWpheFxccG9zdF9qc29uLmpzIiwianNcXHNlcnZlclxcYWpheFxccmVxdWVzdC5qcyIsImpzXFxzZXJ2ZXJcXGhlbHBlcnMuanMiLCJqc1xcc2VydmVyXFxpbmRleC5qcyIsImpzXFxzZXJ2ZXJcXGxvYWRfYWxnb3JpdGhtLmpzIiwianNcXHNlcnZlclxcbG9hZF9jYXRlZ29yaWVzLmpzIiwianNcXHNlcnZlclxcbG9hZF9maWxlLmpzIiwianNcXHNlcnZlclxcbG9hZF9zY3JhdGNoX3BhcGVyLmpzIiwianNcXHNlcnZlclxcbG9hZF93aWtpLmpzIiwianNcXHNlcnZlclxcbG9hZF93aWtpX2xpc3QuanMiLCJqc1xcc2VydmVyXFxzaGFyZV9zY3JhdGNoX3BhcGVyLmpzIiwianNcXHRyYWNlcl9tYW5hZ2VyXFxpbmRleC5qcyIsImpzXFx0cmFjZXJfbWFuYWdlclxcbWFuYWdlci5qcyIsImpzXFx0cmFjZXJfbWFuYWdlclxcdXRpbFxcZnJvbV9qc29uLmpzIiwianNcXHRyYWNlcl9tYW5hZ2VyXFx1dGlsXFxpbmRleC5qcyIsImpzXFx0cmFjZXJfbWFuYWdlclxcdXRpbFxccmVmaW5lX2J5X3R5cGUuanMiLCJqc1xcdHJhY2VyX21hbmFnZXJcXHV0aWxcXHRvX2pzb24uanMiLCJqc1xcdXRpbHNcXGluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9yc3ZwL2Rpc3QvcnN2cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztTQUlJLEM7SUFERixNLE1BQUEsTTs7O0FBR0YsSUFBTSxRQUFRO0FBQ1osZ0JBQWMsRUFERjtBQUVaLFNBQU87QUFGSyxDQUFkOztBQUtBLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCLENBQUMsSUFBRCxFQUFVO0FBQy9CLE1BQUksQ0FBQyxJQUFMLEVBQVc7QUFDVCxVQUFNLG1CQUFOO0FBQ0Q7QUFDRixDQUpEOzs7OztBQVVBLE9BQU8sT0FBUCxHQUFpQjtBQUVmLGVBRmUseUJBRUQsSUFGQyxFQUVLO0FBQ2xCLG1CQUFlLElBQWY7QUFD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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IHtcclxuICBleHRlbmRcclxufSA9ICQ7XHJcblxyXG5jb25zdCBjYWNoZSA9IHtcclxuICBsYXN0RmlsZVVzZWQ6ICcnLFxyXG4gIGZpbGVzOiB7fVxyXG59O1xyXG5cclxuY29uc3QgYXNzZXJ0RmlsZU5hbWUgPSAobmFtZSkgPT4ge1xyXG4gIGlmICghbmFtZSkge1xyXG4gICAgdGhyb3cgJ01pc3NpbmcgZmlsZSBuYW1lJztcclxuICB9XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIEdsb2JhbCBhcHBsaWNhdGlvbiBjYWNoZVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gIGdldENhY2hlZEZpbGUobmFtZSkge1xyXG4gICAgYXNzZXJ0RmlsZU5hbWUobmFtZSk7XHJcbiAgICByZXR1cm4gY2FjaGUuZmlsZXNbbmFtZV07XHJcbiAgfSxcclxuXHJcbiAgdXBkYXRlQ2FjaGVkRmlsZShuYW1lLCB1cGRhdGVzKSB7XHJcbiAgICBhc3NlcnRGaWxlTmFtZShuYW1lKTtcclxuICAgIGlmICghY2FjaGUuZmlsZXNbbmFtZV0pIHtcclxuICAgICAgY2FjaGUuZmlsZXNbbmFtZV0gPSB7fTtcclxuICAgIH1cclxuICAgIGV4dGVuZChjYWNoZS5maWxlc1tuYW1lXSwgdXBkYXRlcyk7XHJcbiAgfSxcclxuXHJcbiAgZ2V0TGFzdEZpbGVVc2VkKCkge1xyXG4gICAgcmV0dXJuIGNhY2hlLmxhc3RGaWxlVXNlZDtcclxuICB9LFxyXG5cclxuICBzZXRMYXN0RmlsZVVzZWQoZmlsZSkge1xyXG4gICAgY2FjaGUubGFzdEZpbGVVc2VkID0gZmlsZTtcclxuICB9XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgRWRpdG9yID0gcmVxdWlyZSgnLi4vZWRpdG9yJyk7XHJcbmNvbnN0IFRyYWNlck1hbmFnZXIgPSByZXF1aXJlKCcuLi90cmFjZXJfbWFuYWdlcicpO1xyXG5jb25zdCBET00gPSByZXF1aXJlKCcuLi9kb20vc2V0dXAnKTtcclxuXHJcbmNvbnN0IHtcclxuICBzaG93TG9hZGluZ1NsaWRlcixcclxuICBoaWRlTG9hZGluZ1NsaWRlclxyXG59ID0gcmVxdWlyZSgnLi4vZG9tL2xvYWRpbmdfc2xpZGVyJyk7XHJcblxyXG5jb25zdCBDYWNoZSA9IHJlcXVpcmUoJy4vY2FjaGUnKTtcclxuXHJcbmNvbnN0IHN0YXRlID0ge1xyXG4gIGlzTG9hZGluZzogbnVsbCxcclxuICBlZGl0b3I6IG51bGwsXHJcbiAgdHJhY2VyTWFuYWdlcjogbnVsbCxcclxuICBjYXRlZ29yaWVzOiBudWxsLFxyXG4gIGxvYWRlZFNjcmF0Y2g6IG51bGwsXHJcbiAgd2lraUxpc3Q6IG51bGxcclxufTtcclxuXHJcbmNvbnN0IGluaXRTdGF0ZSA9ICh0cmFjZXJNYW5hZ2VyKSA9PiB7XHJcbiAgc3RhdGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgc3RhdGUuZWRpdG9yID0gbmV3IEVkaXRvcih0cmFjZXJNYW5hZ2VyKTtcclxuICBzdGF0ZS50cmFjZXJNYW5hZ2VyID0gdHJhY2VyTWFuYWdlcjtcclxuICBzdGF0ZS5jYXRlZ29yaWVzID0ge307XHJcbiAgc3RhdGUubG9hZGVkU2NyYXRjaCA9IG51bGw7XHJcbiAgc3RhdGUud2lraUxpc3QgPSBbXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHbG9iYWwgYXBwbGljYXRpb24gc2luZ2xldG9uLlxyXG4gKi9cclxuY29uc3QgQXBwID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICB0aGlzLmdldElzTG9hZGluZyA9ICgpID0+IHtcclxuICAgIHJldHVybiBzdGF0ZS5pc0xvYWRpbmc7XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5zZXRJc0xvYWRpbmcgPSAobG9hZGluZykgPT4ge1xyXG4gICAgc3RhdGUuaXNMb2FkaW5nID0gbG9hZGluZztcclxuICAgIGlmIChsb2FkaW5nKSB7XHJcbiAgICAgIHNob3dMb2FkaW5nU2xpZGVyKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBoaWRlTG9hZGluZ1NsaWRlcigpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHRoaXMuZ2V0RWRpdG9yID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHN0YXRlLmVkaXRvcjtcclxuICB9O1xyXG5cclxuICB0aGlzLmdldENhdGVnb3JpZXMgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4gc3RhdGUuY2F0ZWdvcmllcztcclxuICB9O1xyXG5cclxuICB0aGlzLmdldENhdGVnb3J5ID0gKG5hbWUpID0+IHtcclxuICAgIHJldHVybiBzdGF0ZS5jYXRlZ29yaWVzW25hbWVdO1xyXG4gIH07XHJcblxyXG4gIHRoaXMuc2V0Q2F0ZWdvcmllcyA9IChjYXRlZ29yaWVzKSA9PiB7XHJcbiAgICBzdGF0ZS5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcclxuICB9O1xyXG5cclxuICB0aGlzLnVwZGF0ZUNhdGVnb3J5ID0gKG5hbWUsIHVwZGF0ZXMpID0+IHtcclxuICAgICQuZXh0ZW5kKHN0YXRlLmNhdGVnb3JpZXNbbmFtZV0sIHVwZGF0ZXMpO1xyXG4gIH07XHJcblxyXG4gIHRoaXMuZ2V0VHJhY2VyTWFuYWdlciA9ICgpID0+IHtcclxuICAgIHJldHVybiBzdGF0ZS50cmFjZXJNYW5hZ2VyO1xyXG4gIH07XHJcblxyXG4gIHRoaXMuZ2V0TG9hZGVkU2NyYXRjaCA9ICgpID0+IHtcclxuICAgIHJldHVybiBzdGF0ZS5sb2FkZWRTY3JhdGNoO1xyXG4gIH07XHJcblxyXG4gIHRoaXMuc2V0TG9hZGVkU2NyYXRjaCA9IChsb2FkZWRTY3JhdGNoKSA9PiB7XHJcbiAgICBzdGF0ZS5sb2FkZWRTY3JhdGNoID0gbG9hZGVkU2NyYXRjaDtcclxuICB9O1xyXG5cclxuICB0aGlzLmdldFdpa2lMaXN0ID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHN0YXRlLndpa2lMaXN0O1xyXG4gIH07XHJcblxyXG4gIHRoaXMuc2V0V2lraUxpc3QgPSAod2lraUxpc3QpID0+IHtcclxuICAgIHN0YXRlLndpa2lMaXN0ID0gd2lraUxpc3Q7XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5oYXNXaWtpID0gKHdpa2kpID0+IHtcclxuICAgIHJldHVybiB+c3RhdGUud2lraUxpc3QuaW5kZXhPZih3aWtpKTtcclxuICB9O1xyXG5cclxuICBjb25zdCB0cmFjZXJNYW5hZ2VyID0gVHJhY2VyTWFuYWdlci5pbml0KCk7XHJcblxyXG4gIGluaXRTdGF0ZSh0cmFjZXJNYW5hZ2VyKTtcclxuICBET00uc2V0dXAodHJhY2VyTWFuYWdlcik7XHJcblxyXG59O1xyXG5cclxuQXBwLnByb3RvdHlwZSA9IENhY2hlO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcHA7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBUaGlzIGlzIHRoZSBtYWluIGFwcGxpY2F0aW9uIGluc3RhbmNlLlxyXG4gKiBHZXRzIHBvcHVsYXRlZCBvbiBwYWdlIGxvYWQuIFxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7fTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBhcHAgPSByZXF1aXJlKCcuLi9hcHAnKTtcclxuY29uc3QgU2VydmVyID0gcmVxdWlyZSgnLi4vc2VydmVyJyk7XHJcbmNvbnN0IHNob3dBbGdvcml0aG0gPSByZXF1aXJlKCcuL3Nob3dfYWxnb3JpdGhtJyk7XHJcblxyXG5jb25zdCB7XHJcbiAgZWFjaFxyXG59ID0gJDtcclxuXHJcbmNvbnN0IGdldEFsZ29yaXRobURPTSA9IChjYXRlZ29yeSwgc3ViTGlzdCwgYWxnb3JpdGhtKSA9PiB7XHJcbiAgcmV0dXJuICQoJzxidXR0b24gY2xhc3M9XCJpbmRlbnRcIj4nKVxyXG4gICAgLmFwcGVuZChzdWJMaXN0W2FsZ29yaXRobV0pXHJcbiAgICAuYXR0cignZGF0YS1hbGdvcml0aG0nLCBhbGdvcml0aG0pXHJcbiAgICAuYXR0cignZGF0YS1jYXRlZ29yeScsIGNhdGVnb3J5KVxyXG4gICAgLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgU2VydmVyLmxvYWRBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSkudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgIHNob3dBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCLtlZjtlZjtlZhcIilcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgJCgnI2xpc3QnKS5hcHBlbmQoJGFsZ29yaXRobSk7XHJcbn07XHJcblxyXG5jb25zdCBhZGRDYXRlZ29yeVRvRE9NID0gKGNhdGVnb3J5KSA9PiB7XHJcblxyXG4gIGNvbnN0IHtcclxuICAgIG5hbWU6IGNhdGVnb3J5TmFtZSxcclxuICAgIGxpc3Q6IGNhdGVnb3J5U3ViTGlzdFxyXG4gIH0gPSBhcHAuZ2V0Q2F0ZWdvcnkoY2F0ZWdvcnkpO1xyXG5cclxuICBjb25zdCAkY2F0ZWdvcnkgPSAkKCc8YnV0dG9uIGNsYXNzPVwiY2F0ZWdvcnlcIj4nKVxyXG4gICAgLmFwcGVuZCgnPGkgY2xhc3M9XCJmYSBmYS1mdyBmYS1jYXJldC1yaWdodFwiPicpXHJcbiAgICAuYXBwZW5kKGNhdGVnb3J5TmFtZSlcclxuICAgIC5hdHRyKCdkYXRhLWNhdGVnb3J5JywgY2F0ZWdvcnkpO1xyXG5cclxuICAkY2F0ZWdvcnkuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgJHNlbGYgPSAkKHRoaXMpO1xyXG4gICAgJHNlbGYudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuICAgICRzZWxmLm5leHQoKS50b2dnbGVDbGFzcygnY29sbGFwc2UnKTtcclxuICAgICRzZWxmLmZpbmQoJ2kuZmEnKS50b2dnbGVDbGFzcygnZmEtY2FyZXQtcmlnaHQgZmEtY2FyZXQtZG93bicpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCAkYWxnb3JpdGhtcyA9ICQoJzxkaXYgY2xhc3M9XCJhbGdvcml0aG1zIGNvbGxhcHNlXCI+Jyk7XHJcbiAgJCgnI2xpc3QnKS5hcHBlbmQoJGNhdGVnb3J5KS5hcHBlbmQoJGFsZ29yaXRobXMpO1xyXG5cclxuICBlYWNoKGNhdGVnb3J5U3ViTGlzdCwgKGFsZ29yaXRobSkgPT4ge1xyXG4gICAgY29uc3QgJGFsZ29yaXRobSA9IGdldEFsZ29yaXRobURPTShjYXRlZ29yeSwgY2F0ZWdvcnlTdWJMaXN0LCBhbGdvcml0aG0pO1xyXG4gICAgJGFsZ29yaXRobXMuYXBwZW5kKCRhbGdvcml0aG0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XHJcbiAgZWFjaChhcHAuZ2V0Q2F0ZWdvcmllcygpLCBhZGRDYXRlZ29yeVRvRE9NKTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgU2VydmVyID0gcmVxdWlyZSgnLi4vc2VydmVyJyk7XHJcblxyXG5jb25zdCB7XHJcbiAgZWFjaFxyXG59ID0gJDtcclxuXHJcbmNvbnN0IGFkZEZpbGVUb0RPTSA9IChjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlLCBleHBsYW5hdGlvbikgPT4ge1xyXG4gIHZhciAkZmlsZSA9ICQoJzxidXR0b24+JylcclxuICAgIC5hcHBlbmQoZmlsZSlcclxuICAgIC5hdHRyKCdkYXRhLWZpbGUnLCBmaWxlKVxyXG4gICAgLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgU2VydmVyLmxvYWRGaWxlKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUsIGV4cGxhbmF0aW9uKTtcclxuICAgICAgJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyID4gYnV0dG9uJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgIH0pO1xyXG4gICQoJy5maWxlc19iYXIgPiAud3JhcHBlcicpLmFwcGVuZCgkZmlsZSk7XHJcbiAgcmV0dXJuICRmaWxlO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZXMsIHJlcXVlc3RlZEZpbGUpID0+IHtcclxuICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5lbXB0eSgpO1xyXG5cclxuICBlYWNoKGZpbGVzLCAoZmlsZSwgZXhwbGFuYXRpb24pID0+IHtcclxuICAgIHZhciAkZmlsZSA9IGFkZEZpbGVUb0RPTShjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlLCBleHBsYW5hdGlvbik7XHJcbiAgICBpZiAocmVxdWVzdGVkRmlsZSAmJiByZXF1ZXN0ZWRGaWxlID09IGZpbGUpICRmaWxlLmNsaWNrKCk7XHJcbiAgfSk7XHJcblxyXG4gIGlmICghcmVxdWVzdGVkRmlsZSkgJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyID4gYnV0dG9uJykuZmlyc3QoKS5jbGljaygpO1xyXG4gICQoJy5maWxlc19iYXIgPiAud3JhcHBlcicpLnNjcm9sbCgpO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IHNob3dBbGdvcml0aG0gPSByZXF1aXJlKCcuL3Nob3dfYWxnb3JpdGhtJyk7XHJcbmNvbnN0IGFkZENhdGVnb3JpZXMgPSByZXF1aXJlKCcuL2FkZF9jYXRlZ29yaWVzJyk7XHJcbmNvbnN0IHNob3dEZXNjcmlwdGlvbiA9IHJlcXVpcmUoJy4vc2hvd19kZXNjcmlwdGlvbicpO1xyXG5jb25zdCBhZGRGaWxlcyA9IHJlcXVpcmUoJy4vYWRkX2ZpbGVzJyk7XHJcbmNvbnN0IHNob3dGaXJzdEFsZ29yaXRobSA9IHJlcXVpcmUoJy4vc2hvd19maXJzdF9hbGdvcml0aG0nKTtcclxuY29uc3Qgc2hvd1JlcXVlc3RlZEFsZ29yaXRobSA9IHJlcXVpcmUoJy4vc2hvd19yZXF1ZXN0ZWRfYWxnb3JpdGhtJyk7XHJcbmNvbnN0IHNob3dXaWtpID0gcmVxdWlyZSgnLi9zaG93X3dpa2knKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHNob3dBbGdvcml0aG0sXHJcbiAgYWRkQ2F0ZWdvcmllcyxcclxuICBzaG93RGVzY3JpcHRpb24sXHJcbiAgYWRkRmlsZXMsXHJcbiAgc2hvd0ZpcnN0QWxnb3JpdGhtLFxyXG4gIHNob3dSZXF1ZXN0ZWRBbGdvcml0aG0sXHJcbiAgc2hvd1dpa2lcclxufTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBzaG93TG9hZGluZ1NsaWRlciA9ICgpID0+IHtcclxuICAkKCcjbG9hZGluZy1zbGlkZXInKS5yZW1vdmVDbGFzcygnbG9hZGVkJyk7XHJcbn07XHJcblxyXG5jb25zdCBoaWRlTG9hZGluZ1NsaWRlciA9ICgpID0+IHtcclxuICAkKCcjbG9hZGluZy1zbGlkZXInKS5hZGRDbGFzcygnbG9hZGVkJyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBzaG93TG9hZGluZ1NsaWRlcixcclxuICBoaWRlTG9hZGluZ1NsaWRlclxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBjcmVhdGUgPSAoKSA9PiB7XHJcbiAgY29uc3QgJGNvbnRhaW5lciA9ICQoJzxzZWN0aW9uIGNsYXNzPVwibW9kdWxlX3dyYXBwZXJcIj4nKTtcclxuICAkKCcubW9kdWxlX2NvbnRhaW5lcicpLmFwcGVuZCgkY29udGFpbmVyKTtcclxuICByZXR1cm4gJGNvbnRhaW5lcjtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGNyZWF0ZVxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBzZXR1cERpdmlkZXJzID0gcmVxdWlyZSgnLi9zZXR1cF9kaXZpZGVycycpO1xyXG5jb25zdCBzZXR1cERvY3VtZW50ID0gcmVxdWlyZSgnLi9zZXR1cF9kb2N1bWVudCcpO1xyXG5jb25zdCBzZXR1cEZpbGVzQmFyID0gcmVxdWlyZSgnLi9zZXR1cF9maWxlc19iYXInKTtcclxuY29uc3Qgc2V0dXBJbnRlcnZhbCA9IHJlcXVpcmUoJy4vc2V0dXBfaW50ZXJ2YWwnKTtcclxuY29uc3Qgc2V0dXBNb2R1bGVDb250YWluZXIgPSByZXF1aXJlKCcuL3NldHVwX21vZHVsZV9jb250YWluZXInKTtcclxuY29uc3Qgc2V0dXBUYWJDb250YWluZXIgPSByZXF1aXJlKCcuL3NldHVwX3RhYl9jb250YWluZXInKTtcclxuY29uc3Qgc2V0dXBTaWRlTWVudSA9IHJlcXVpcmUoJy4vc2V0dXBfc2lkZV9tZW51Jyk7XHJcbmNvbnN0IHNldHVwVG9wTWVudSA9IHJlcXVpcmUoJy4vc2V0dXBfdG9wX21lbnUnKTtcclxuY29uc3Qgc2V0dXBXaW5kb3cgPSByZXF1aXJlKCcuL3NldHVwX3dpbmRvdycpO1xyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemVzIGVsZW1lbnRzIG9uY2UgdGhlIGFwcCBsb2FkcyBpbiB0aGUgRE9NLlxyXG4gKi9cclxuY29uc3Qgc2V0dXAgPSAoKSA9PiB7XHJcblxyXG4gICQoJy5idG4gaW5wdXQnKS5jbGljaygoZSkgPT4ge1xyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICB9KTtcclxuXHJcbiAgLy8gZGl2aWRlcnNcclxuICBzZXR1cERpdmlkZXJzKCk7XHJcblxyXG4gIC8vIGRvY3VtZW50XHJcbiAgc2V0dXBEb2N1bWVudCgpO1xyXG5cclxuICAvLyBmaWxlcyBiYXJcclxuICBzZXR1cEZpbGVzQmFyKCk7XHJcblxyXG4gIC8vIGludGVydmFsXHJcbiAgc2V0dXBJbnRlcnZhbCgpO1xyXG5cclxuICAvLyBtb2R1bGUgY29udGFpbmVyXHJcbiAgc2V0dXBNb2R1bGVDb250YWluZXIoKTtcclxuXHJcbiAgLy8gdGFiIGNvbnRhaW5lclxyXG4gIHNldHVwVGFiQ29udGFpbmVyKCk7XHJcblxyXG4gIC8vIHNpZGUgbWVudVxyXG4gIHNldHVwU2lkZU1lbnUoKTtcclxuXHJcbiAgLy8gdG9wIG1lbnVcclxuICBzZXR1cFRvcE1lbnUoKTtcclxuXHJcbiAgLy8gd2luZG93XHJcbiAgc2V0dXBXaW5kb3coKTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBzZXR1cFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBhcHAgPSByZXF1aXJlKCcuLi8uLi9hcHAnKTtcclxuXHJcbmNvbnN0IGFkZERpdmlkZXJUb0RvbSA9IChkaXZpZGVyKSA9PiB7XHJcbiAgY29uc3QgW3ZlcnRpY2FsLCAkZmlyc3QsICRzZWNvbmRdID0gZGl2aWRlcjtcclxuICBjb25zdCAkcGFyZW50ID0gJGZpcnN0LnBhcmVudCgpO1xyXG4gIGNvbnN0IHRoaWNrbmVzcyA9IDU7XHJcblxyXG4gIGNvbnN0ICRkaXZpZGVyID0gJCgnPGRpdiBjbGFzcz1cImRpdmlkZXJcIj4nKTtcclxuXHJcbiAgbGV0IGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgaWYgKHZlcnRpY2FsKSB7XHJcbiAgICAkZGl2aWRlci5hZGRDbGFzcygndmVydGljYWwnKTtcclxuXHJcbiAgICBsZXQgX2xlZnQgPSAtdGhpY2tuZXNzIC8gMjtcclxuICAgICRkaXZpZGVyLmNzcyh7XHJcbiAgICAgIHRvcDogMCxcclxuICAgICAgYm90dG9tOiAwLFxyXG4gICAgICBsZWZ0OiBfbGVmdCxcclxuICAgICAgd2lkdGg6IHRoaWNrbmVzc1xyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IHg7XHJcbiAgICAkZGl2aWRlci5tb3VzZWRvd24oKHtcclxuICAgICAgcGFnZVhcclxuICAgIH0pID0+IHtcclxuICAgICAgeCA9IHBhZ2VYO1xyXG4gICAgICBkcmFnZ2luZyA9IHRydWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5tb3VzZW1vdmUoKHtcclxuICAgICAgcGFnZVhcclxuICAgIH0pID0+IHtcclxuICAgICAgaWYgKGRyYWdnaW5nKSB7XHJcbiAgICAgICAgY29uc3QgbmV3X2xlZnQgPSAkc2Vjb25kLnBvc2l0aW9uKCkubGVmdCArIHBhZ2VYIC0geDtcclxuICAgICAgICBsZXQgcGVyY2VudCA9IG5ld19sZWZ0IC8gJHBhcmVudC53aWR0aCgpICogMTAwO1xyXG4gICAgICAgIHBlcmNlbnQgPSBNYXRoLm1pbig5MCwgTWF0aC5tYXgoMTAsIHBlcmNlbnQpKTtcclxuICAgICAgICAkZmlyc3QuY3NzKCdyaWdodCcsICgxMDAgLSBwZXJjZW50KSArICclJyk7XHJcbiAgICAgICAgJHNlY29uZC5jc3MoJ2xlZnQnLCBwZXJjZW50ICsgJyUnKTtcclxuICAgICAgICB4ID0gcGFnZVg7XHJcbiAgICAgICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5yZXNpemUoKTtcclxuICAgICAgICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5zY3JvbGwoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbihlKSB7XHJcbiAgICAgIGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICB9KTtcclxuXHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICAkZGl2aWRlci5hZGRDbGFzcygnaG9yaXpvbnRhbCcpO1xyXG4gICAgY29uc3QgX3RvcCA9IC10aGlja25lc3MgLyAyO1xyXG4gICAgJGRpdmlkZXIuY3NzKHtcclxuICAgICAgdG9wOiBfdG9wLFxyXG4gICAgICBoZWlnaHQ6IHRoaWNrbmVzcyxcclxuICAgICAgbGVmdDogMCxcclxuICAgICAgcmlnaHQ6IDBcclxuICAgIH0pO1xyXG5cclxuICAgIGxldCB5O1xyXG4gICAgJGRpdmlkZXIubW91c2Vkb3duKGZ1bmN0aW9uKHtcclxuICAgICAgcGFnZVlcclxuICAgIH0pIHtcclxuICAgICAgeSA9IHBhZ2VZO1xyXG4gICAgICBkcmFnZ2luZyA9IHRydWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5tb3VzZW1vdmUoZnVuY3Rpb24oe1xyXG4gICAgICBwYWdlWVxyXG4gICAgfSkge1xyXG4gICAgICBpZiAoZHJhZ2dpbmcpIHtcclxuICAgICAgICBjb25zdCBuZXdfdG9wID0gJHNlY29uZC5wb3NpdGlvbigpLnRvcCArIHBhZ2VZIC0geTtcclxuICAgICAgICBsZXQgcGVyY2VudCA9IG5ld190b3AgLyAkcGFyZW50LmhlaWdodCgpICogMTAwO1xyXG4gICAgICAgIHBlcmNlbnQgPSBNYXRoLm1pbig5MCwgTWF0aC5tYXgoMTAsIHBlcmNlbnQpKTtcclxuICAgICAgICAkZmlyc3QuY3NzKCdib3R0b20nLCAoMTAwIC0gcGVyY2VudCkgKyAnJScpO1xyXG4gICAgICAgICRzZWNvbmQuY3NzKCd0b3AnLCBwZXJjZW50ICsgJyUnKTtcclxuICAgICAgICB5ID0gcGFnZVk7XHJcbiAgICAgICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5yZXNpemUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbihlKSB7XHJcbiAgICAgIGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICRzZWNvbmQuYXBwZW5kKCRkaXZpZGVyKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xyXG4gIGNvbnN0IGRpdmlkZXJzID0gW1xyXG4gICAgWyd2JywgJCgnLnNpZGVtZW51JyksICQoJy53b3Jrc3BhY2UnKV0sXHJcbiAgICBbJ3YnLCAkKCcudmlld2VyX2NvbnRhaW5lcicpLCAkKCcuZWRpdG9yX2NvbnRhaW5lcicpXSxcclxuICAgIFsnaCcsICQoJy5kYXRhX2NvbnRhaW5lcicpLCAkKCcuY29kZV9jb250YWluZXInKV1cclxuICBdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGl2aWRlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgIGFkZERpdmlkZXJUb0RvbShkaXZpZGVyc1tpXSk7XHJcbiAgfVxyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XHJcbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJ2EnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgY29uc3QgaHJlZiA9ICQodGhpcykuYXR0cignaHJlZicpO1xyXG4gICAgaWYgKC9eKGh0dHBzPzpcXC9cXC8pLisvLnRlc3QoaHJlZikpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZiAoIXdpbmRvdy5vcGVuKGhyZWYsICdfYmxhbmsnKSkge1xyXG4gICAgICAgIGFsZXJ0KCdQbGVhc2UgYWxsb3cgcG9wdXBzIGZvciB0aGlzIHNpdGUnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkKGRvY3VtZW50KS5tb3VzZXVwKGZ1bmN0aW9uIChlKSB7XHJcbiAgICBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpLmNvbW1hbmQoJ21vdXNldXAnLCBlKTtcclxuICB9KTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgZGVmaW5pdGVseUJpZ2dlciA9ICh4LCB5KSA9PiB4ID4gKHkgKyAyKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xyXG5cclxuICAkKCcuZmlsZXNfYmFyID4gLmJ0bi1sZWZ0JykuY2xpY2soKCkgPT4ge1xyXG4gICAgY29uc3QgJHdyYXBwZXIgPSAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKTtcclxuICAgIGNvbnN0IGNsaXBXaWR0aCA9ICR3cmFwcGVyLndpZHRoKCk7XHJcbiAgICBjb25zdCBzY3JvbGxMZWZ0ID0gJHdyYXBwZXIuc2Nyb2xsTGVmdCgpO1xyXG5cclxuICAgICQoJHdyYXBwZXIuY2hpbGRyZW4oJ2J1dHRvbicpLmdldCgpLnJldmVyc2UoKSkuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgY29uc3QgbGVmdCA9ICQodGhpcykucG9zaXRpb24oKS5sZWZ0O1xyXG4gICAgICBjb25zdCByaWdodCA9IGxlZnQgKyAkKHRoaXMpLm91dGVyV2lkdGgoKTtcclxuICAgICAgaWYgKDAgPiBsZWZ0KSB7XHJcbiAgICAgICAgJHdyYXBwZXIuc2Nyb2xsTGVmdChzY3JvbGxMZWZ0ICsgcmlnaHQgLSBjbGlwV2lkdGgpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gICQoJy5maWxlc19iYXIgPiAuYnRuLXJpZ2h0JykuY2xpY2soKCkgPT4ge1xyXG4gICAgY29uc3QgJHdyYXBwZXIgPSAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKTtcclxuICAgIGNvbnN0IGNsaXBXaWR0aCA9ICR3cmFwcGVyLndpZHRoKCk7XHJcbiAgICBjb25zdCBzY3JvbGxMZWZ0ID0gJHdyYXBwZXIuc2Nyb2xsTGVmdCgpO1xyXG5cclxuICAgICR3cmFwcGVyLmNoaWxkcmVuKCdidXR0b24nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICBjb25zdCBsZWZ0ID0gJCh0aGlzKS5wb3NpdGlvbigpLmxlZnQ7XHJcbiAgICAgIGNvbnN0IHJpZ2h0ID0gbGVmdCArICQodGhpcykub3V0ZXJXaWR0aCgpO1xyXG4gICAgICBpZiAoY2xpcFdpZHRoIDwgcmlnaHQpIHtcclxuICAgICAgICAkd3JhcHBlci5zY3JvbGxMZWZ0KHNjcm9sbExlZnQgKyBsZWZ0KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgY29uc3QgJHdyYXBwZXIgPSAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKTtcclxuICAgIGNvbnN0IGNsaXBXaWR0aCA9ICR3cmFwcGVyLndpZHRoKCk7XHJcbiAgICBjb25zdCAkbGVmdCA9ICR3cmFwcGVyLmNoaWxkcmVuKCdidXR0b246Zmlyc3QtY2hpbGQnKTtcclxuICAgIGNvbnN0ICRyaWdodCA9ICR3cmFwcGVyLmNoaWxkcmVuKCdidXR0b246bGFzdC1jaGlsZCcpO1xyXG4gICAgY29uc3QgbGVmdCA9ICRsZWZ0LnBvc2l0aW9uKCkubGVmdDtcclxuICAgIGNvbnN0IHJpZ2h0ID0gJHJpZ2h0LnBvc2l0aW9uKCkubGVmdCArICRyaWdodC5vdXRlcldpZHRoKCk7XHJcblxyXG4gICAgaWYgKGRlZmluaXRlbHlCaWdnZXIoMCwgbGVmdCkgJiYgZGVmaW5pdGVseUJpZ2dlcihjbGlwV2lkdGgsIHJpZ2h0KSkge1xyXG4gICAgICBjb25zdCBzY3JvbGxMZWZ0ID0gJHdyYXBwZXIuc2Nyb2xsTGVmdCgpO1xyXG4gICAgICAkd3JhcHBlci5zY3JvbGxMZWZ0KHNjcm9sbExlZnQgKyBjbGlwV2lkdGggLSByaWdodCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsZWZ0ZXIgPSBkZWZpbml0ZWx5QmlnZ2VyKDAsIGxlZnQpO1xyXG4gICAgY29uc3QgcmlnaHRlciA9IGRlZmluaXRlbHlCaWdnZXIocmlnaHQsIGNsaXBXaWR0aCk7XHJcbiAgICAkd3JhcHBlci50b2dnbGVDbGFzcygnc2hhZG93LWxlZnQnLCBsZWZ0ZXIpO1xyXG4gICAgJHdyYXBwZXIudG9nZ2xlQ2xhc3MoJ3NoYWRvdy1yaWdodCcsIHJpZ2h0ZXIpO1xyXG4gICAgJCgnLmZpbGVzX2JhciA+IC5idG4tbGVmdCcpLmF0dHIoJ2Rpc2FibGVkJywgIWxlZnRlcik7XHJcbiAgICAkKCcuZmlsZXNfYmFyID4gLmJ0bi1yaWdodCcpLmF0dHIoJ2Rpc2FibGVkJywgIXJpZ2h0ZXIpO1xyXG4gIH0pO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xyXG5jb25zdCBUb2FzdCA9IHJlcXVpcmUoJy4uL3RvYXN0Jyk7XHJcblxyXG5jb25zdCB7XHJcbiAgcGFyc2VGbG9hdFxyXG59ID0gTnVtYmVyO1xyXG5cclxuY29uc3QgbWluSW50ZXJ2YWwgPSAwLjE7XHJcbmNvbnN0IG1heEludGVydmFsID0gMTA7XHJcbmNvbnN0IHN0YXJ0SW50ZXJ2YWwgPSAwLjU7XHJcbmNvbnN0IHN0ZXBJbnRlcnZhbCA9IDAuMTtcclxuXHJcbmNvbnN0IG5vcm1hbGl6ZSA9IChzZWMpID0+IHtcclxuXHJcblxyXG4gIGxldCBpbnRlcnZhbDtcclxuICBsZXQgbWVzc2FnZTtcclxuICBpZiAoc2VjIDwgbWluSW50ZXJ2YWwpIHtcclxuICAgIGludGVydmFsID0gbWluSW50ZXJ2YWw7XHJcbiAgICBtZXNzYWdlID0gYEludGVydmFsIG9mICR7c2VjfSBzZWNvbmRzIGlzIHRvbyBsb3cuIFNldHRpbmcgdG8gbWluIGFsbG93ZWQgaW50ZXJ2YWwgb2YgJHttaW5JbnRlcnZhbH0gc2Vjb25kKHMpLmA7XHJcbiAgfSBlbHNlIGlmIChzZWMgPiBtYXhJbnRlcnZhbCkge1xyXG4gICAgaW50ZXJ2YWwgPSBtYXhJbnRlcnZhbDtcclxuICAgIG1lc3NhZ2UgPSBgSW50ZXJ2YWwgb2YgJHtzZWN9IHNlY29uZHMgaXMgdG9vIGhpZ2guIFNldHRpbmcgdG8gbWF4IGFsbG93ZWQgaW50ZXJ2YWwgb2YgJHttYXhJbnRlcnZhbH0gc2Vjb25kKHMpLmA7XHJcbiAgfSBlbHNlIHtcclxuICAgIGludGVydmFsID0gc2VjO1xyXG4gICAgbWVzc2FnZSA9IGBJbnRlcnZhbCBoYXMgYmVlbiBzZXQgdG8gJHtzZWN9IHNlY29uZChzKS5gXHJcbiAgfVxyXG5cclxuICByZXR1cm4gW2ludGVydmFsLCBtZXNzYWdlXTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xyXG5cclxuICBjb25zdCAkaW50ZXJ2YWwgPSAkKCcjaW50ZXJ2YWwnKTtcclxuICAkaW50ZXJ2YWwudmFsKHN0YXJ0SW50ZXJ2YWwpO1xyXG4gICRpbnRlcnZhbC5hdHRyKHtcclxuICAgIG1heDogbWF4SW50ZXJ2YWwsXHJcbiAgICBtaW46IG1pbkludGVydmFsLFxyXG4gICAgc3RlcDogc3RlcEludGVydmFsXHJcbiAgfSk7XHJcblxyXG4gICQoJyNpbnRlcnZhbCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IHRyYWNlck1hbmFnZXIgPSBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpO1xyXG4gICAgY29uc3QgW3NlY29uZHMsIG1lc3NhZ2VdID0gbm9ybWFsaXplKHBhcnNlRmxvYXQoJCh0aGlzKS52YWwoKSkpO1xyXG5cclxuICAgICQodGhpcykudmFsKHNlY29uZHMpO1xyXG4gICAgdHJhY2VyTWFuYWdlci5pbnRlcnZhbCA9IHNlY29uZHMgKiAxMDAwO1xyXG4gICAgVG9hc3Quc2hvd0luZm9Ub2FzdChtZXNzYWdlKTtcclxuICB9KTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcclxuXHJcbiAgY29uc3QgJG1vZHVsZV9jb250YWluZXIgPSAkKCcubW9kdWxlX2NvbnRhaW5lcicpO1xyXG5cclxuICAkbW9kdWxlX2NvbnRhaW5lci5vbignbW91c2Vkb3duJywgJy5tb2R1bGVfd3JhcHBlcicsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkuZmluZE93bmVyKHRoaXMpLm1vdXNlZG93bihlKTtcclxuICB9KTtcclxuXHJcbiAgJG1vZHVsZV9jb250YWluZXIub24oJ21vdXNlbW92ZScsICcubW9kdWxlX3dyYXBwZXInLCBmdW5jdGlvbihlKSB7XHJcbiAgICBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpLmZpbmRPd25lcih0aGlzKS5tb3VzZW1vdmUoZSk7XHJcbiAgfSk7XHJcblxyXG4gICRtb2R1bGVfY29udGFpbmVyLm9uKCdET01Nb3VzZVNjcm9sbCBtb3VzZXdoZWVsJywgJy5tb2R1bGVfd3JhcHBlcicsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkuZmluZE93bmVyKHRoaXMpLm1vdXNld2hlZWwoZSk7XHJcbiAgfSk7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XHJcbmNvbnN0IFNlcnZlciA9IHJlcXVpcmUoJy4uLy4uL3NlcnZlcicpO1xyXG5jb25zdCBzaG93QWxnb3JpdGhtID0gcmVxdWlyZSgnLi4vc2hvd19hbGdvcml0aG0nKTtcclxuXHJcbmxldCBzaWRlbWVudV9wZXJjZW50O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XHJcbiAgJCgnI25hdmlnYXRpb24nKS5jbGljaygoKSA9PiB7XHJcbiAgICBjb25zdCAkc2lkZW1lbnUgPSAkKCcuc2lkZW1lbnUnKTtcclxuICAgIGNvbnN0ICR3b3Jrc3BhY2UgPSAkKCcud29ya3NwYWNlJyk7XHJcblxyXG4gICAgJHNpZGVtZW51LnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoJy5uYXYtZHJvcGRvd24nKS50b2dnbGVDbGFzcygnZmEtY2FyZXQtZG93biBmYS1jYXJldC11cCcpO1xyXG5cclxuICAgIGlmICgkc2lkZW1lbnUuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICRzaWRlbWVudS5jc3MoJ3JpZ2h0JywgKDEwMCAtIHNpZGVtZW51X3BlcmNlbnQpICsgJyUnKTtcclxuICAgICAgJHdvcmtzcGFjZS5jc3MoJ2xlZnQnLCBzaWRlbWVudV9wZXJjZW50ICsgJyUnKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzaWRlbWVudV9wZXJjZW50ID0gJHdvcmtzcGFjZS5wb3NpdGlvbigpLmxlZnQgLyAkKCdib2R5Jykud2lkdGgoKSAqIDEwMDtcclxuICAgICAgJHNpZGVtZW51LmNzcygncmlnaHQnLCAwKTtcclxuICAgICAgJHdvcmtzcGFjZS5jc3MoJ2xlZnQnLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpLnJlc2l6ZSgpO1xyXG4gIH0pO1xyXG5cclxuICAkKCcjZG9jdW1lbnRhdGlvbicpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICQoJyNidG5fZG9jJykuY2xpY2soKTtcclxuICB9KTtcclxuXHJcbiAgJCgnI3Bvd2VyZWQtYnknKS5jbGljaygoKSA9PiB7XHJcbiAgICAkKCcjcG93ZXJlZC1ieS1saXN0IGJ1dHRvbicpLnRvZ2dsZUNsYXNzKCdjb2xsYXBzZScpO1xyXG4gIH0pO1xyXG5cclxuICAkKCcjc2NyYXRjaC1wYXBlcicpLmNsaWNrKCgpID0+IHtcclxuICAgIGNvbnN0IGNhdGVnb3J5ID0gJ3NjcmF0Y2gnO1xyXG4gICAgY29uc3QgYWxnb3JpdGhtID0gYXBwLmdldExvYWRlZFNjcmF0Y2goKTtcclxuICAgIFNlcnZlci5sb2FkQWxnb3JpdGhtKGNhdGVnb3J5LCBhbGdvcml0aG0pLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgc2hvd0FsZ29yaXRobShjYXRlZ29yeSwgYWxnb3JpdGhtLCBkYXRhKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xyXG4gICQoJy50YWJfYmFyID4gYnV0dG9uJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgJCgnLnRhYl9iYXIgPiBidXR0b24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKCcudGFiX2NvbnRhaW5lciA+IC50YWInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoJCh0aGlzKS5hdHRyKCdkYXRhLXRhcmdldCcpKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgfSk7XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XHJcbmNvbnN0IFNlcnZlciA9IHJlcXVpcmUoJy4uLy4uL3NlcnZlcicpO1xyXG5jb25zdCBUb2FzdCA9IHJlcXVpcmUoJy4uL3RvYXN0Jyk7XHJcbmNvbnN0IFRvcE1lbnUgPSByZXF1aXJlKCcuLi90b3BfbWVudScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XHJcblxyXG4gIC8vIHNoYXJlZFxyXG4gICQoJyNzaGFyZWQnKS5tb3VzZXVwKGZ1bmN0aW9uICgpIHtcclxuICAgICQodGhpcykuc2VsZWN0KCk7XHJcbiAgfSk7XHJcblxyXG4gICQoJyNidG5fc2hhcmUnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgY29uc3QgJGljb24gPSAkKHRoaXMpLmZpbmQoJy5mYS1zaGFyZScpO1xyXG4gICAgJGljb24uYWRkQ2xhc3MoJ2ZhLXNwaW4gZmEtc3Bpbi1mYXN0ZXInKTtcclxuXHJcbiAgICBTZXJ2ZXIuc2hhcmVTY3JhdGNoUGFwZXIoKS50aGVuKCh1cmwpID0+IHtcclxuICAgICAgJGljb24ucmVtb3ZlQ2xhc3MoJ2ZhLXNwaW4gZmEtc3Bpbi1mYXN0ZXInKTtcclxuICAgICAgJCgnI3NoYXJlZCcpLnJlbW92ZUNsYXNzKCdjb2xsYXBzZScpO1xyXG4gICAgICAkKCcjc2hhcmVkJykudmFsKHVybCk7XHJcbiAgICAgIFRvYXN0LnNob3dJbmZvVG9hc3QoJ1NoYXJlYWJsZSBsaW5rIGlzIGNyZWF0ZWQuJyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgLy8gY29udHJvbFxyXG5cclxuICBjb25zdCAkYnRuUnVuID0gJCgnI2J0bl9ydW4nKTtcclxuICBjb25zdCAkYnRuVHJhY2UgPSAkKCcjYnRuX3RyYWNlJyk7XHJcbiAgY29uc3QgJGJ0blBhdXNlID0gJCgnI2J0bl9wYXVzZScpO1xyXG4gIGNvbnN0ICRidG5QcmV2ID0gJCgnI2J0bl9wcmV2Jyk7XHJcbiAgY29uc3QgJGJ0bk5leHQgPSAkKCcjYnRuX25leHQnKTtcclxuXHJcbiAgLy8gaW5pdGlhbGx5LCBjb250cm9sIGJ1dHRvbnMgYXJlIGRpc2FibGVkXHJcbiAgVG9wTWVudS5kaXNhYmxlRmxvd0NvbnRyb2woKTtcclxuXHJcbiAgJGJ0blJ1bi5jbGljaygoKSA9PiB7XHJcbiAgICAkYnRuVHJhY2UuY2xpY2soKTtcclxuICAgICRidG5QYXVzZS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkYnRuUnVuLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgIFRvcE1lbnUuZW5hYmxlRmxvd0NvbnRyb2woKTtcclxuICAgIHZhciBlcnIgPSBhcHAuZ2V0RWRpdG9yKCkuZXhlY3V0ZSgpO1xyXG4gICAgaWYgKGVycikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgIFRvYXN0LnNob3dFcnJvclRvYXN0KGVycik7XHJcbiAgICAgIFRvcE1lbnUucmVzZXRUb3BNZW51QnV0dG9ucygpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkYnRuUGF1c2UuY2xpY2soKCkgPT4ge1xyXG4gICAgJGJ0blJ1bi50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkYnRuUGF1c2UudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgaWYgKGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkuaXNQYXVzZSgpKSB7XHJcbiAgICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkucmVzdW1lU3RlcCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5wYXVzZVN0ZXAoKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJGJ0blByZXYuY2xpY2soKCkgPT4ge1xyXG4gICAgJGJ0blJ1bi5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkYnRuUGF1c2UuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5wYXVzZVN0ZXAoKTtcclxuICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkucHJldlN0ZXAoKTtcclxuICB9KTtcclxuXHJcbiAgJGJ0bk5leHQuY2xpY2soKCkgPT4ge1xyXG4gICAgJGJ0blJ1bi5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkYnRuUGF1c2UuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5wYXVzZVN0ZXAoKTtcclxuICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkubmV4dFN0ZXAoKTtcclxuICB9KTtcclxuXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG4gICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5yZXNpemUoKTtcclxuICB9KTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vYXBwJyk7XHJcblxyXG5jb25zdCB7XHJcbiAgaXNTY3JhdGNoUGFwZXJcclxufSA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XHJcblxyXG5jb25zdCBzaG93RGVzY3JpcHRpb24gPSByZXF1aXJlKCcuL3Nob3dfZGVzY3JpcHRpb24nKTtcclxuY29uc3QgYWRkRmlsZXMgPSByZXF1aXJlKCcuL2FkZF9maWxlcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YSwgcmVxdWVzdGVkRmlsZSkgPT4ge1xyXG4gIGxldCAkbWVudTtcclxuICBsZXQgY2F0ZWdvcnlfbmFtZTtcclxuICBsZXQgYWxnb3JpdGhtX25hbWU7XHJcblxyXG4gIGlmIChpc1NjcmF0Y2hQYXBlcihjYXRlZ29yeSkpIHtcclxuICAgICRtZW51ID0gJCgnI3NjcmF0Y2gtcGFwZXInKTtcclxuICAgIGNhdGVnb3J5X25hbWUgPSAnU2NyYXRjaCBQYXBlcic7XHJcbiAgICBhbGdvcml0aG1fbmFtZSA9IGFsZ29yaXRobSA/ICdTaGFyZWQnIDogJ1RlbXBvcmFyeSc7XHJcbiAgfSBlbHNlIHtcclxuICAgICRtZW51ID0gJChgW2RhdGEtY2F0ZWdvcnk9XCIke2NhdGVnb3J5fVwiXVtkYXRhLWFsZ29yaXRobT1cIiR7YWxnb3JpdGhtfVwiXWApO1xyXG4gICAgY29uc3QgY2F0ZWdvcnlPYmogPSBhcHAuZ2V0Q2F0ZWdvcnkoY2F0ZWdvcnkpO1xyXG4gICAgY2F0ZWdvcnlfbmFtZSA9IGNhdGVnb3J5T2JqLm5hbWU7XHJcbiAgICBhbGdvcml0aG1fbmFtZSA9IGNhdGVnb3J5T2JqLmxpc3RbYWxnb3JpdGhtXTtcclxuICB9XHJcblxyXG4gICQoJy5zaWRlbWVudSBidXR0b24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgJG1lbnUuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAkKCcjY2F0ZWdvcnknKS5odG1sKGNhdGVnb3J5X25hbWUpO1xyXG4gICQoJyNhbGdvcml0aG0nKS5odG1sKGFsZ29yaXRobV9uYW1lKTtcclxuICAkKCcjdGFiX2Rlc2MgPiAudGFiX2lubmVyID4gLndyYXBwZXInKS5lbXB0eSgpO1xyXG4gICQoJy5maWxlc19iYXIgPiAud3JhcHBlcicpLmVtcHR5KCk7XHJcbiAgJCgnI2V4cGxhbmF0aW9uJykuaHRtbCgnJyk7XHJcblxyXG4gIGFwcC5zZXRMYXN0RmlsZVVzZWQobnVsbCk7XHJcbiAgYXBwLmdldEVkaXRvcigpLmNsZWFyQ29udGVudCgpO1xyXG5cclxuICBjb25zdCB7XHJcbiAgICBmaWxlc1xyXG4gIH0gPSBkYXRhO1xyXG5cclxuICBkZWxldGUgZGF0YS5maWxlcztcclxuXHJcbiAgc2hvd0Rlc2NyaXB0aW9uKGRhdGEpO1xyXG4gIGFkZEZpbGVzKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGVzLCByZXF1ZXN0ZWRGaWxlKTtcclxufTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCB7XHJcbiAgaXNBcnJheVxyXG59ID0gQXJyYXk7XHJcblxyXG5jb25zdCB7XHJcbiAgZWFjaFxyXG59ID0gJDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKGRhdGEpID0+IHtcclxuICBjb25zdCAkY29udGFpbmVyID0gJCgnI3RhYl9kZXNjID4gLnRhYl9pbm5lciA+IC53cmFwcGVyJyk7XHJcbiAgJGNvbnRhaW5lci5lbXB0eSgpO1xyXG5cclxuICBlYWNoKGRhdGEsIChrZXksIHZhbHVlKSA9PiB7XHJcblxyXG4gICAgaWYgKGtleSkge1xyXG4gICAgICAkY29udGFpbmVyLmFwcGVuZCgkKCc8aDM+JykuaHRtbChrZXkpKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAkY29udGFpbmVyLmFwcGVuZCgkKCc8cD4nKS5odG1sKHZhbHVlKSk7XHJcblxyXG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xyXG5cclxuICAgICAgY29uc3QgJHVsID0gJCgnPHVsIGNsYXNzPVwiYXBwbGljYXRpb25zXCI+Jyk7XHJcbiAgICAgICRjb250YWluZXIuYXBwZW5kKCR1bCk7XHJcblxyXG4gICAgICB2YWx1ZS5mb3JFYWNoKChsaSkgPT4ge1xyXG4gICAgICAgICR1bC5hcHBlbmQoJCgnPGxpPicpLmh0bWwobGkpKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XHJcblxyXG4gICAgICBjb25zdCAkdWwgPSAkKCc8dWwgY2xhc3M9XCJjb21wbGV4aXRpZXNcIj4nKTtcclxuICAgICAgJGNvbnRhaW5lci5hcHBlbmQoJHVsKTtcclxuXHJcbiAgICAgIGVhY2godmFsdWUsIChwcm9wKSA9PiB7XHJcbiAgICAgICAgY29uc3QgJHdyYXBwZXIgPSAkKCc8ZGl2IGNsYXNzPVwiY29tcGxleGl0eVwiPicpO1xyXG4gICAgICAgIGNvbnN0ICR0eXBlID0gJCgnPHNwYW4gY2xhc3M9XCJjb21wbGV4aXR5LXR5cGVcIj4nKS5odG1sKGAke3Byb3B9OiBgKTtcclxuICAgICAgICBjb25zdCAkdmFsdWUgPSAkKCc8c3BhbiBjbGFzcz1cImNvbXBsZXhpdHktdmFsdWVcIj4nKS5odG1sKGAke3ZhbHVlW3Byb3BdfWApO1xyXG5cclxuICAgICAgICAkd3JhcHBlci5hcHBlbmQoJHR5cGUpLmFwcGVuZCgkdmFsdWUpO1xyXG5cclxuICAgICAgICAkdWwuYXBwZW5kKCQoJzxsaT4nKS5hcHBlbmQoJHdyYXBwZXIpKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIGNsaWNrIHRoZSBmaXJzdCBhbGdvcml0aG0gaW4gdGhlIGZpcnN0IGNhdGVnb3J5XHJcbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xyXG4gICQoJyNsaXN0IC5jYXRlZ29yeScpLmZpcnN0KCkuY2xpY2soKTtcclxuICAkKCcjbGlzdCAuY2F0ZWdvcnkgKyAuYWxnb3JpdGhtcyA+IC5pbmRlbnQnKS5maXJzdCgpLmNsaWNrKCk7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IFNlcnZlciA9IHJlcXVpcmUoJy4uL3NlcnZlcicpO1xyXG5jb25zdCBzaG93QWxnb3JpdGhtID0gcmVxdWlyZSgnLi9zaG93X2FsZ29yaXRobScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSkgPT4ge1xyXG4gICQoYC5jYXRlZ29yeVtkYXRhLWNhdGVnb3J5PVwiJHtjYXRlZ29yeX1cIl1gKS5jbGljaygpO1xyXG4gIFNlcnZlci5sb2FkQWxnb3JpdGhtKGNhdGVnb3J5LCBhbGdvcml0aG0pLnRoZW4oKGRhdGEpID0+IHtcclxuICAgIHNob3dBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YSwgZmlsZSk7XHJcbiAgfSk7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xyXG5jb25zdCBTZXJ2ZXIgPSByZXF1aXJlKCcuLi9zZXJ2ZXInKTtcclxuY29uc3QgY29udmVydGVyID0gbmV3IHNob3dkb3duLkNvbnZlcnRlcih7dGFibGVzOiB0cnVlfSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9ICh3aWtpKSA9PiB7XHJcbiAgU2VydmVyLmxvYWRXaWtpKHdpa2kpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICQoJyN0YWJfZG9jID4gLnRhYl9pbm5lciA+IC53cmFwcGVyJykuaHRtbChjb252ZXJ0ZXIubWFrZUh0bWwoYCMke3dpa2l9XFxuJHtkYXRhfWApKTtcclxuICAgICQoJyN0YWJfZG9jJykuc2Nyb2xsVG9wKDApO1xyXG4gICAgJCgnI3RhYl9kb2MgPiAudGFiX2lubmVyID4gLndyYXBwZXIgYScpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGNvbnN0IGhyZWYgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgaWYgKGFwcC5oYXNXaWtpKGhyZWYpKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzKGhyZWYpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxufTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBzaG93VG9hc3QgPSAoZGF0YSwgdHlwZSkgPT4ge1xyXG4gIGNvbnN0ICR0b2FzdCA9ICQoYDxkaXYgY2xhc3M9XCJ0b2FzdCAke3R5cGV9XCI+YCkuYXBwZW5kKGRhdGEpO1xyXG5cclxuICAkKCcudG9hc3RfY29udGFpbmVyJykuYXBwZW5kKCR0b2FzdCk7XHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAkdG9hc3QuZmFkZU91dCgoKSA9PiB7XHJcbiAgICAgICR0b2FzdC5yZW1vdmUoKTtcclxuICAgIH0pO1xyXG4gIH0sIDMwMDApO1xyXG59O1xyXG5cclxuY29uc3Qgc2hvd0Vycm9yVG9hc3QgPSAoZXJyKSA9PiB7XHJcbiAgc2hvd1RvYXN0KGVyciwgJ2Vycm9yJyk7XHJcbn07XHJcblxyXG5jb25zdCBzaG93SW5mb1RvYXN0ID0gKGVycikgPT4ge1xyXG4gIHNob3dUb2FzdChlcnIsICdpbmZvJyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBzaG93RXJyb3JUb2FzdCxcclxuICBzaG93SW5mb1RvYXN0XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vYXBwJyk7XHJcblxyXG5jb25zdCBmbG93Q29udHJvbEJ0bnMgPSBbICQoJyNidG5fcGF1c2UnKSwgJCgnI2J0bl9wcmV2JyksICQoJyNidG5fbmV4dCcpIF07XHJcbmNvbnN0IHNldEZsb3dDb250cm9sU3RhdGUgPSAoaXNEaXNhYmxlZCkgPT4ge1xyXG4gIGZsb3dDb250cm9sQnRucy5mb3JFYWNoKCRidG4gPT4gJGJ0bi5hdHRyKCdkaXNhYmxlZCcsIGlzRGlzYWJsZWQpKTtcclxufTtcclxuXHJcbmNvbnN0IGVuYWJsZUZsb3dDb250cm9sID0gKCkgPT4ge1xyXG4gIHNldEZsb3dDb250cm9sU3RhdGUoZmFsc2UpO1xyXG59O1xyXG5cclxuY29uc3QgZGlzYWJsZUZsb3dDb250cm9sID0gKCkgPT4ge1xyXG4gIHNldEZsb3dDb250cm9sU3RhdGUodHJ1ZSk7XHJcbn07XHJcblxyXG5jb25zdCByZXNldFRvcE1lbnVCdXR0b25zID0gKCkgPT4ge1xyXG4gICQoJy50b3AtbWVudS1idXR0b25zIGJ1dHRvbicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICBkaXNhYmxlRmxvd0NvbnRyb2woKTtcclxuICBhcHAuZ2V0RWRpdG9yKCkudW5oaWdobGlnaHRMaW5lKCk7XHJcbn07XHJcblxyXG5jb25zdCBzZXRJbnRlcnZhbCA9ICh2YWwpID0+IHtcclxuICAkKCcjaW50ZXJ2YWwnKS52YWwoaW50ZXJ2YWwpO1xyXG59O1xyXG5cclxuY29uc3QgYWN0aXZhdGVCdG5QYXVzZSA9ICgpID0+IHtcclxuICAkKCcjYnRuX3BhdXNlJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG59O1xyXG5cclxuY29uc3QgZGVhY3RpdmF0ZUJ0blBhdXNlID0gKCkgPT4ge1xyXG4gICQoJyNidG5fcGF1c2UnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBlbmFibGVGbG93Q29udHJvbCxcclxuICBkaXNhYmxlRmxvd0NvbnRyb2wsXHJcbiAgcmVzZXRUb3BNZW51QnV0dG9ucyxcclxuICBzZXRJbnRlcnZhbCxcclxuICBhY3RpdmF0ZUJ0blBhdXNlLFxyXG4gIGRlYWN0aXZhdGVCdG5QYXVzZVxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlkKSB7XHJcbiAgY29uc3QgZWRpdG9yID0gYWNlLmVkaXQoaWQpO1xyXG5cclxuICBlZGl0b3Iuc2V0T3B0aW9ucyh7XHJcbiAgICBlbmFibGVCYXNpY0F1dG9jb21wbGV0aW9uOiB0cnVlLFxyXG4gICAgZW5hYmxlU25pcHBldHM6IHRydWUsXHJcbiAgICBlbmFibGVMaXZlQXV0b2NvbXBsZXRpb246IHRydWVcclxuICB9KTtcclxuXHJcbiAgZWRpdG9yLnNldFRoZW1lKCdhY2UvdGhlbWUvdG9tb3Jyb3dfbmlnaHRfZWlnaHRpZXMnKTtcclxuICBlZGl0b3Iuc2Vzc2lvbi5zZXRNb2RlKCdhY2UvbW9kZS9qYXZhc2NyaXB0Jyk7XHJcbiAgZWRpdG9yLiRibG9ja1Njcm9sbGluZyA9IEluZmluaXR5O1xyXG5cclxuICByZXR1cm4gZWRpdG9yO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGV4ZWN1dGUgPSAodHJhY2VyTWFuYWdlciwgY29kZSwgZGF0YUxpbmVzKSA9PiB7XHJcbiAgLy8gYWxsIG1vZHVsZXMgYXZhaWxhYmxlIHRvIGV2YWwgYXJlIG9idGFpbmVkIGZyb20gd2luZG93XHJcbiAgdHJ5IHtcclxuICAgIHRyYWNlck1hbmFnZXIuZGVhbGxvY2F0ZUFsbCgpO1xyXG4gICAgY29uc3QgbGluZXMgPSBjb2RlLnNwbGl0KCdcXG4nKTtcclxuICAgIGNvbnN0IG5ld0xpbmVzID0gW107XHJcbiAgICBsaW5lcy5mb3JFYWNoKChsaW5lLCBpKSA9PiB7XHJcbiAgICAgIG5ld0xpbmVzLnB1c2gobGluZS5yZXBsYWNlKC8oLitcXC4gKl93YWl0ICopKFxcKCAqXFwpKS9nLCBgJDEoJHtpIC0gZGF0YUxpbmVzfSlgKSk7XHJcbiAgICB9KTtcclxuICAgIGV2YWwobmV3TGluZXMuam9pbignXFxuJykpO1xyXG4gICAgdHJhY2VyTWFuYWdlci52aXN1YWxpemUoKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBlcnI7XHJcbiAgfSBmaW5hbGx5IHtcclxuICAgIHRyYWNlck1hbmFnZXIucmVtb3ZlVW5hbGxvY2F0ZWQoKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBleGVjdXRlRGF0YSA9ICh0cmFjZXJNYW5hZ2VyLCBhbGdvRGF0YSkgPT4ge1xyXG4gIHJldHVybiBleGVjdXRlKHRyYWNlck1hbmFnZXIsIGFsZ29EYXRhKTtcclxufTtcclxuXHJcbmNvbnN0IGV4ZWN1dGVEYXRhQW5kQ29kZSA9ICh0cmFjZXJNYW5hZ2VyLCBhbGdvRGF0YSwgYWxnb0NvZGUpID0+IHtcclxuICBjb25zdCBkYXRhTGluZXMgPSBhbGdvRGF0YS5zcGxpdCgnXFxuJykubGVuZ3RoO1xyXG4gIHJldHVybiBleGVjdXRlKHRyYWNlck1hbmFnZXIsIGAke2FsZ29EYXRhfVxcbiR7YWxnb0NvZGV9YCwgZGF0YUxpbmVzKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGV4ZWN1dGVEYXRhLFxyXG4gIGV4ZWN1dGVEYXRhQW5kQ29kZVxyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xyXG5jb25zdCBjcmVhdGVFZGl0b3IgPSByZXF1aXJlKCcuL2NyZWF0ZScpO1xyXG5jb25zdCBFeGVjdXRvciA9IHJlcXVpcmUoJy4vZXhlY3V0b3InKTtcclxuY29uc3QgVG9wTWVudSA9IHJlcXVpcmUoJy4uL2RvbS90b3BfbWVudScpO1xyXG5cclxuZnVuY3Rpb24gRWRpdG9yKHRyYWNlck1hbmFnZXIpIHtcclxuICBpZiAoIXRyYWNlck1hbmFnZXIpIHtcclxuICAgIHRocm93ICdDYW5ub3QgY3JlYXRlIEVkaXRvci4gTWlzc2luZyB0aGUgdHJhY2VyTWFuYWdlcic7XHJcbiAgfVxyXG5cclxuICBhY2UucmVxdWlyZSgnYWNlL2V4dC9sYW5ndWFnZV90b29scycpO1xyXG4gIGNvbnN0IFJhbmdlID0gYWNlLnJlcXVpcmUoXCJhY2UvcmFuZ2VcIikuUmFuZ2U7XHJcblxyXG4gIHRoaXMuZGF0YUVkaXRvciA9IGNyZWF0ZUVkaXRvcignZGF0YScpO1xyXG4gIHRoaXMuY29kZUVkaXRvciA9IGNyZWF0ZUVkaXRvcignY29kZScpO1xyXG5cclxuICAvLyBTZXR0aW5nIGRhdGFcclxuXHJcbiAgdGhpcy5zZXREYXRhID0gKGRhdGEpID0+IHtcclxuICAgIHRoaXMuZGF0YUVkaXRvci5zZXRWYWx1ZShkYXRhLCAtMSk7XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5zZXRDb2RlID0gKGNvZGUpID0+IHtcclxuICAgIHRoaXMuY29kZUVkaXRvci5zZXRWYWx1ZShjb2RlLCAtMSk7XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5zZXRDb250ZW50ID0gKCh7XHJcbiAgICBkYXRhLFxyXG4gICAgY29kZVxyXG4gIH0pID0+IHtcclxuICAgIHRoaXMuc2V0RGF0YShkYXRhKTtcclxuICAgIHRoaXMuc2V0Q29kZShjb2RlKTtcclxuICB9KTtcclxuXHJcbiAgLy8gQ2xlYXJpbmcgZGF0YVxyXG5cclxuICB0aGlzLmNsZWFyRGF0YSA9ICgpID0+IHtcclxuICAgIHRoaXMuZGF0YUVkaXRvci5zZXRWYWx1ZSgnJyk7XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5jbGVhckNvZGUgPSAoKSA9PiB7XHJcbiAgICB0aGlzLmNvZGVFZGl0b3Iuc2V0VmFsdWUoJycpO1xyXG4gIH07XHJcblxyXG4gIHRoaXMuY2xlYXJDb250ZW50ID0gKCkgPT4ge1xyXG4gICAgdGhpcy5jbGVhckRhdGEoKTtcclxuICAgIHRoaXMuY2xlYXJDb2RlKCk7XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5leGVjdXRlID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZGF0YUVkaXRvci5nZXRWYWx1ZSgpO1xyXG4gICAgY29uc3QgY29kZSA9IHRoaXMuY29kZUVkaXRvci5nZXRWYWx1ZSgpO1xyXG4gICAgcmV0dXJuIEV4ZWN1dG9yLmV4ZWN1dGVEYXRhQW5kQ29kZSh0cmFjZXJNYW5hZ2VyLCBkYXRhLCBjb2RlKTtcclxuICB9O1xyXG5cclxuICB0aGlzLmhpZ2hsaWdodExpbmUgPSAobGluZU51bWJlcikgPT4ge1xyXG4gICAgY29uc3Qgc2Vzc2lvbiA9IHRoaXMuY29kZUVkaXRvci5nZXRTZXNzaW9uKCk7XHJcbiAgICBpZiAodGhpcy5tYXJrZXIpIHNlc3Npb24ucmVtb3ZlTWFya2VyKHRoaXMubWFya2VyKTtcclxuICAgIHRoaXMubWFya2VyID0gc2Vzc2lvbi5hZGRNYXJrZXIobmV3IFJhbmdlKGxpbmVOdW1iZXIsIDAsIGxpbmVOdW1iZXIsIEluZmluaXR5KSwgXCJleGVjdXRpbmdcIiwgXCJsaW5lXCIsIHRydWUpO1xyXG4gIH07XHJcblxyXG4gIHRoaXMudW5oaWdobGlnaHRMaW5lID0gKCkgPT4ge1xyXG4gICAgY29uc3Qgc2Vzc2lvbiA9IHRoaXMuY29kZUVkaXRvci5nZXRTZXNzaW9uKCk7XHJcbiAgICBpZiAodGhpcy5tYXJrZXIpIHNlc3Npb24ucmVtb3ZlTWFya2VyKHRoaXMubWFya2VyKTtcclxuICB9O1xyXG5cclxuICAvLyBsaXN0ZW5lcnNcclxuXHJcbiAgdGhpcy5kYXRhRWRpdG9yLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBkYXRhID0gdGhpcy5kYXRhRWRpdG9yLmdldFZhbHVlKCk7XHJcbiAgICBjb25zdCBsYXN0RmlsZVVzZWQgPSBhcHAuZ2V0TGFzdEZpbGVVc2VkKCk7XHJcbiAgICBpZiAobGFzdEZpbGVVc2VkKSB7XHJcbiAgICAgIGFwcC51cGRhdGVDYWNoZWRGaWxlKGxhc3RGaWxlVXNlZCwge1xyXG4gICAgICAgIGRhdGFcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBFeGVjdXRvci5leGVjdXRlRGF0YSh0cmFjZXJNYW5hZ2VyLCBkYXRhKTtcclxuICAgIFRvcE1lbnUucmVzZXRUb3BNZW51QnV0dG9ucygpO1xyXG4gIH0pO1xyXG5cclxuICB0aGlzLmNvZGVFZGl0b3Iub24oJ2NoYW5nZScsICgpID0+IHtcclxuICAgIGNvbnN0IGNvZGUgPSB0aGlzLmNvZGVFZGl0b3IuZ2V0VmFsdWUoKTtcclxuICAgIGNvbnN0IGxhc3RGaWxlVXNlZCA9IGFwcC5nZXRMYXN0RmlsZVVzZWQoKTtcclxuICAgIGlmIChsYXN0RmlsZVVzZWQpIHtcclxuICAgICAgYXBwLnVwZGF0ZUNhY2hlZEZpbGUobGFzdEZpbGVVc2VkLCB7XHJcbiAgICAgICAgY29kZVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHRyYWNlck1hbmFnZXIucmVzZXQoKTtcclxuICAgIFRvcE1lbnUucmVzZXRUb3BNZW51QnV0dG9ucygpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVkaXRvcjsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBSU1ZQID0gcmVxdWlyZSgncnN2cCcpO1xyXG5jb25zdCBhcHAgPSByZXF1aXJlKCcuL2FwcCcpO1xyXG5jb25zdCBBcHBDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vYXBwL2NvbnN0cnVjdG9yJyk7XHJcbmNvbnN0IERPTSA9IHJlcXVpcmUoJy4vZG9tJyk7XHJcbmNvbnN0IFNlcnZlciA9IHJlcXVpcmUoJy4vc2VydmVyJyk7XHJcblxyXG5jb25zdCBtb2R1bGVzID0gcmVxdWlyZSgnLi9tb2R1bGUnKTtcclxuXHJcbmNvbnN0IHtcclxuICBleHRlbmRcclxufSA9ICQ7XHJcblxyXG4kLmFqYXhTZXR1cCh7XHJcbiAgY2FjaGU6IGZhbHNlLFxyXG4gIGRhdGFUeXBlOiAndGV4dCdcclxufSk7XHJcblxyXG5jb25zdCB7XHJcbiAgaXNTY3JhdGNoUGFwZXJcclxufSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxuXHJcbmNvbnN0IHtcclxuICBnZXRQYXRoXHJcbn0gPSByZXF1aXJlKCcuL3NlcnZlci9oZWxwZXJzJyk7XHJcblxyXG4vLyBzZXQgZ2xvYmFsIHByb21pc2UgZXJyb3IgaGFuZGxlclxyXG5SU1ZQLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChyZWFzb24pIHtcclxuICBjb25zb2xlLmFzc2VydChmYWxzZSwgcmVhc29uKTtcclxufSk7XHJcblxyXG4kKCgpID0+IHtcclxuXHJcbiAgLy8gaW5pdGlhbGl6ZSB0aGUgYXBwbGljYXRpb24gYW5kIGF0dGFjaCBpbiB0byB0aGUgaW5zdGFuY2UgbW9kdWxlXHJcbiAgY29uc3QgYXBwQ29uc3RydWN0b3IgPSBuZXcgQXBwQ29uc3RydWN0b3IoKTtcclxuICBleHRlbmQodHJ1ZSwgYXBwLCBhcHBDb25zdHJ1Y3Rvcik7XHJcblxyXG4gIC8vIGxvYWQgbW9kdWxlcyB0byB0aGUgZ2xvYmFsIHNjb3BlIHNvIHRoZXkgY2FuIGJlIGV2YWxlZFxyXG4gIGV4dGVuZCh0cnVlLCB3aW5kb3csIG1vZHVsZXMpO1xyXG5cclxuICBTZXJ2ZXIubG9hZENhdGVnb3JpZXMoKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICBhcHAuc2V0Q2F0ZWdvcmllcyhkYXRhKTtcclxuICAgIERPTS5hZGRDYXRlZ29yaWVzKCk7XHJcblxyXG4gICAgLy8gZGV0ZXJtaW5lIGlmIHRoZSBhcHAgaXMgbG9hZGluZyBhIHByZS1leGlzdGluZyBzY3JhdGNoLXBhZFxyXG4gICAgLy8gb3IgdGhlIGhvbWUgcGFnZVxyXG4gICAgY29uc3Qge1xyXG4gICAgICBjYXRlZ29yeSxcclxuICAgICAgYWxnb3JpdGhtLFxyXG4gICAgICBmaWxlXHJcbiAgICB9ID0gZ2V0UGF0aCgpO1xyXG4gICAgaWYgKGlzU2NyYXRjaFBhcGVyKGNhdGVnb3J5KSkge1xyXG4gICAgICBpZiAoYWxnb3JpdGhtKSB7XHJcbiAgICAgICAgU2VydmVyLmxvYWRTY3JhdGNoUGFwZXIoYWxnb3JpdGhtKS50aGVuKCh7Y2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YX0pID0+IHtcclxuICAgICAgICAgIERPTS5zaG93QWxnb3JpdGhtKGNhdGVnb3J5LCBhbGdvcml0aG0sIGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIFNlcnZlci5sb2FkQWxnb3JpdGhtKGNhdGVnb3J5KS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICBET00uc2hvd0FsZ29yaXRobShjYXRlZ29yeSwgbnVsbCwgZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoY2F0ZWdvcnkgJiYgYWxnb3JpdGhtKSB7XHJcbiAgICAgIERPTS5zaG93UmVxdWVzdGVkQWxnb3JpdGhtKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgRE9NLnNob3dGaXJzdEFsZ29yaXRobSgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBTZXJ2ZXIubG9hZFdpa2lMaXN0KCkudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgYXBwLnNldFdpa2lMaXN0KGRhdGEud2lraXMpO1xyXG5cclxuICAgIERPTS5zaG93V2lraSgnVHJhY2VyJyk7XHJcbiAgfSlcclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgQXJyYXkyRCA9IHJlcXVpcmUoJy4vYXJyYXkyZCcpO1xyXG5cclxuY29uc3QgcmFuZG9tID0gKE4sIG1pbiwgbWF4KSA9PiB7XHJcbiAgcmV0dXJuIEFycmF5MkQucmFuZG9tKDEsIE4sIG1pbiwgbWF4KVswXTtcclxufTtcclxuXHJcbmNvbnN0IHJhbmRvbVNvcnRlZCA9IChOLCBtaW4sIG1heCk9PiB7XHJcbiAgcmV0dXJuIEFycmF5MkQucmFuZG9tU29ydGVkKDEsIE4sIG1pbiwgbWF4KVswXTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHJhbmRvbSxcclxuICByYW5kb21Tb3J0ZWRcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgcmFuZG9tID0gKE4sIE0sIG1pbiwgbWF4KSA9PiB7XHJcbiAgaWYgKCFOKSBOID0gMTA7XHJcbiAgaWYgKCFNKSBNID0gMTA7XHJcbiAgaWYgKG1pbiA9PT0gdW5kZWZpbmVkKSBtaW4gPSAxO1xyXG4gIGlmIChtYXggPT09IHVuZGVmaW5lZCkgbWF4ID0gOTtcclxuICB2YXIgRCA9IFtdO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XHJcbiAgICBELnB1c2goW10pO1xyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBNOyBqKyspIHtcclxuICAgICAgRFtpXS5wdXNoKChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpIHwgMCkgKyBtaW4pO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gRDtcclxufTtcclxuXHJcbmNvbnN0IHJhbmRvbVNvcnRlZCA9IChOLCBNLCBtaW4sIG1heCkgPT4ge1xyXG4gIHJldHVybiByYW5kb20oTiwgTSwgbWluLCBtYXgpLm1hcChmdW5jdGlvbiAoYXJyKSB7XHJcbiAgICByZXR1cm4gYXJyLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgcmV0dXJuIGEgLSBiO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICByYW5kb20sXHJcbiAgcmFuZG9tU29ydGVkXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IHJhbmRvbSA9IChOLCBtaW4sIG1heCkgPT4ge1xyXG4gIGlmICghTikgTiA9IDc7XHJcbiAgaWYgKCFtaW4pIG1pbiA9IDE7XHJcbiAgaWYgKCFtYXgpIG1heCA9IDEwO1xyXG4gIHZhciBDID0gbmV3IEFycmF5KE4pO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSBDW2ldID0gbmV3IEFycmF5KDIpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKVxyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBDW2ldLmxlbmd0aDsgaisrKVxyXG4gICAgICBDW2ldW2pdID0gKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgfCAwKSArIG1pbjtcclxuICByZXR1cm4gQztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHJhbmRvbVxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCByYW5kb20gPSAoTiwgcmF0aW8pID0+IHtcclxuICBpZiAoIU4pIE4gPSA1O1xyXG4gIGlmICghcmF0aW8pIHJhdGlvID0gLjM7XHJcbiAgdmFyIEcgPSBuZXcgQXJyYXkoTik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIHtcclxuICAgIEdbaV0gPSBuZXcgQXJyYXkoTik7XHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IE47IGorKykge1xyXG4gICAgICBpZiAoaSAhPSBqKSB7XHJcbiAgICAgICAgR1tpXVtqXSA9IChNYXRoLnJhbmRvbSgpICogKDEgLyByYXRpbykgfCAwKSA9PSAwID8gMSA6IDA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIEc7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICByYW5kb21cclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgQXJyYXkxRCA9IHJlcXVpcmUoJy4vYXJyYXkxZCcpO1xyXG5jb25zdCBBcnJheTJEID0gcmVxdWlyZSgnLi9hcnJheTJkJyk7XHJcbmNvbnN0IENvb3JkaW5hdGVTeXN0ZW0gPSByZXF1aXJlKCcuL2Nvb3JkaW5hdGVfc3lzdGVtJyk7XHJcbmNvbnN0IERpcmVjdGVkR3JhcGggPSByZXF1aXJlKCcuL2RpcmVjdGVkX2dyYXBoJyk7XHJcbmNvbnN0IFVuZGlyZWN0ZWRHcmFwaCA9IHJlcXVpcmUoJy4vdW5kaXJlY3RlZF9ncmFwaCcpO1xyXG5jb25zdCBXZWlnaHRlZERpcmVjdGVkR3JhcGggPSByZXF1aXJlKCcuL3dlaWdodGVkX2RpcmVjdGVkX2dyYXBoJyk7XHJcbmNvbnN0IFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoID0gcmVxdWlyZSgnLi93ZWlnaHRlZF91bmRpcmVjdGVkX2dyYXBoJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBBcnJheTFELFxyXG4gIEFycmF5MkQsXHJcbiAgQ29vcmRpbmF0ZVN5c3RlbSxcclxuICBEaXJlY3RlZEdyYXBoLFxyXG4gIFVuZGlyZWN0ZWRHcmFwaCxcclxuICBXZWlnaHRlZERpcmVjdGVkR3JhcGgsXHJcbiAgV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGhcclxufTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCByYW5kb20gPSAoTiwgcmF0aW8pID0+IHtcclxuICBpZiAoIU4pIE4gPSA1O1xyXG4gIGlmICghcmF0aW8pIHJhdGlvID0gLjM7XHJcbiAgdmFyIEcgPSBuZXcgQXJyYXkoTik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIEdbaV0gPSBuZXcgQXJyYXkoTik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIHtcclxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgTjsgaisrKSB7XHJcbiAgICAgIGlmIChpID4gaikge1xyXG4gICAgICAgIEdbaV1bal0gPSBHW2pdW2ldID0gKE1hdGgucmFuZG9tKCkgKiAoMSAvIHJhdGlvKSB8IDApID09IDAgPyAxIDogMDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gRztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHJhbmRvbVxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCByYW5kb20gPSAoTiwgcmF0aW8sIG1pbiwgbWF4KSA9PiB7XHJcbiAgaWYgKCFOKSBOID0gNTtcclxuICBpZiAoIXJhdGlvKSByYXRpbyA9IC4zO1xyXG4gIGlmICghbWluKSBtaW4gPSAxO1xyXG4gIGlmICghbWF4KSBtYXggPSA1O1xyXG4gIHZhciBHID0gbmV3IEFycmF5KE4pO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XHJcbiAgICBHW2ldID0gbmV3IEFycmF5KE4pO1xyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBOOyBqKyspIHtcclxuICAgICAgaWYgKGkgIT0gaiAmJiAoTWF0aC5yYW5kb20oKSAqICgxIC8gcmF0aW8pIHwgMCkgPT0gMCkge1xyXG4gICAgICAgIEdbaV1bal0gPSAoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSB8IDApICsgbWluO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBHO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgcmFuZG9tXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IHJhbmRvbSA9IChOLCByYXRpbywgbWluLCBtYXgpID0+IHtcclxuICBpZiAoIU4pIE4gPSA1O1xyXG4gIGlmICghcmF0aW8pIHJhdGlvID0gLjM7XHJcbiAgaWYgKCFtaW4pIG1pbiA9IDE7XHJcbiAgaWYgKCFtYXgpIG1heCA9IDU7XHJcbiAgdmFyIEcgPSBuZXcgQXJyYXkoTik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIEdbaV0gPSBuZXcgQXJyYXkoTik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIHtcclxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgTjsgaisrKSB7XHJcbiAgICAgIGlmIChpID4gaiAmJiAoTWF0aC5yYW5kb20oKSAqICgxIC8gcmF0aW8pIHwgMCkgPT0gMCkge1xyXG4gICAgICAgIEdbaV1bal0gPSBHW2pdW2ldID0gKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgfCAwKSArIG1pbjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gRztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHJhbmRvbVxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdHJhY2VycyA9IHJlcXVpcmUoJy4vdHJhY2VyJyk7XHJcbnZhciBkYXRhcyA9IHJlcXVpcmUoJy4vZGF0YScpO1xyXG5cclxuY29uc3Qge1xyXG4gIGV4dGVuZFxyXG59ID0gJDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kKHRydWUsIHt9LCB0cmFjZXJzLCBkYXRhcyk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgQXJyYXkyRFRyYWNlciA9IHJlcXVpcmUoJy4vYXJyYXkyZCcpO1xyXG5cclxuY2xhc3MgQXJyYXkxRFRyYWNlciBleHRlbmRzIEFycmF5MkRUcmFjZXIge1xyXG4gIHN0YXRpYyBnZXRDbGFzc05hbWUoKSB7XHJcbiAgICByZXR1cm4gJ0FycmF5MURUcmFjZXInO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgc3VwZXIobmFtZSk7XHJcbiAgfVxyXG5cclxuICBfbm90aWZ5KGlkeCwgdikge1xyXG4gICAgc3VwZXIuX25vdGlmeSgwLCBpZHgsIHYpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBfZGVub3RpZnkoaWR4KSB7XHJcbiAgICBzdXBlci5fZGVub3RpZnkoMCwgaWR4KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgX3NlbGVjdChzLCBlKSB7XHJcbiAgICBpZiAoZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHN1cGVyLl9zZWxlY3QoMCwgcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdXBlci5fc2VsZWN0Um93KDAsIHMsIGUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBfZGVzZWxlY3QocywgZSkge1xyXG4gICAgaWYgKGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBzdXBlci5fZGVzZWxlY3QoMCwgcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdXBlci5fZGVzZWxlY3RSb3coMCwgcywgZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHByb2Nlc3NTdGVwKHN0ZXAsIG9wdGlvbnMpIHtcclxuICAgIHN1cGVyLnByb2Nlc3NTdGVwKHN0ZXAsIG9wdGlvbnMpO1xyXG4gICAgaWYgKHRoaXMuY2hhcnRUcmFjZXIpIHtcclxuICAgICAgY29uc3QgbmV3U3RlcCA9ICQuZXh0ZW5kKHRydWUsIHt9LCBzdGVwKTtcclxuICAgICAgbmV3U3RlcC5jYXBzdWxlID0gdGhpcy5jaGFydFRyYWNlci5jYXBzdWxlO1xyXG4gICAgICBuZXdTdGVwLnMgPSBuZXdTdGVwLnN5O1xyXG4gICAgICBuZXdTdGVwLmUgPSBuZXdTdGVwLmV5O1xyXG4gICAgICBpZiAobmV3U3RlcC5zID09PSB1bmRlZmluZWQpIG5ld1N0ZXAucyA9IG5ld1N0ZXAueTtcclxuICAgICAgZGVsZXRlIG5ld1N0ZXAueDtcclxuICAgICAgZGVsZXRlIG5ld1N0ZXAueTtcclxuICAgICAgZGVsZXRlIG5ld1N0ZXAuc3g7XHJcbiAgICAgIGRlbGV0ZSBuZXdTdGVwLnN5O1xyXG4gICAgICBkZWxldGUgbmV3U3RlcC5leDtcclxuICAgICAgZGVsZXRlIG5ld1N0ZXAuZXk7XHJcbiAgICAgIHRoaXMuY2hhcnRUcmFjZXIucHJvY2Vzc1N0ZXAobmV3U3RlcCwgb3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXREYXRhKEQpIHtcclxuICAgIHJldHVybiBzdXBlci5zZXREYXRhKFtEXSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5MURUcmFjZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IFRyYWNlciA9IHJlcXVpcmUoJy4vdHJhY2VyJyk7XHJcblxyXG5jb25zdCB7XHJcbiAgcmVmaW5lQnlUeXBlXHJcbn0gPSByZXF1aXJlKCcuLi8uLi90cmFjZXJfbWFuYWdlci91dGlsL2luZGV4Jyk7XHJcblxyXG5jbGFzcyBBcnJheTJEVHJhY2VyIGV4dGVuZHMgVHJhY2VyIHtcclxuICBzdGF0aWMgZ2V0Q2xhc3NOYW1lKCkge1xyXG4gICAgcmV0dXJuICdBcnJheTJEVHJhY2VyJztcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgIHN1cGVyKG5hbWUpO1xyXG5cclxuICAgIHRoaXMuY29sb3JDbGFzcyA9IHtcclxuICAgICAgc2VsZWN0ZWQ6ICdzZWxlY3RlZCcsXHJcbiAgICAgIG5vdGlmaWVkOiAnbm90aWZpZWQnXHJcbiAgICB9O1xyXG5cclxuICAgIGlmICh0aGlzLmlzTmV3KSBpbml0Vmlldyh0aGlzKTtcclxuICB9XHJcblxyXG4gIF9ub3RpZnkoeCwgeSwgdikge1xyXG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xyXG4gICAgICB0eXBlOiAnbm90aWZ5JyxcclxuICAgICAgeDogeCxcclxuICAgICAgeTogeSxcclxuICAgICAgdjogdlxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIF9kZW5vdGlmeSh4LCB5KSB7XHJcbiAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XHJcbiAgICAgIHR5cGU6ICdkZW5vdGlmeScsXHJcbiAgICAgIHg6IHgsXHJcbiAgICAgIHk6IHlcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBfc2VsZWN0KHN4LCBzeSwgZXgsIGV5KSB7XHJcbiAgICB0aGlzLnB1c2hTZWxlY3RpbmdTdGVwKCdzZWxlY3QnLCBudWxsLCBhcmd1bWVudHMpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBfc2VsZWN0Um93KHgsIHN5LCBleSkge1xyXG4gICAgdGhpcy5wdXNoU2VsZWN0aW5nU3RlcCgnc2VsZWN0JywgJ3JvdycsIGFyZ3VtZW50cyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIF9zZWxlY3RDb2woeSwgc3gsIGV4KSB7XHJcbiAgICB0aGlzLnB1c2hTZWxlY3RpbmdTdGVwKCdzZWxlY3QnLCAnY29sJywgYXJndW1lbnRzKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgX2Rlc2VsZWN0KHN4LCBzeSwgZXgsIGV5KSB7XHJcbiAgICB0aGlzLnB1c2hTZWxlY3RpbmdTdGVwKCdkZXNlbGVjdCcsIG51bGwsIGFyZ3VtZW50cyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIF9kZXNlbGVjdFJvdyh4LCBzeSwgZXkpIHtcclxuICAgIHRoaXMucHVzaFNlbGVjdGluZ1N0ZXAoJ2Rlc2VsZWN0JywgJ3JvdycsIGFyZ3VtZW50cyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIF9kZXNlbGVjdENvbCh5LCBzeCwgZXgpIHtcclxuICAgIHRoaXMucHVzaFNlbGVjdGluZ1N0ZXAoJ2Rlc2VsZWN0JywgJ2NvbCcsIGFyZ3VtZW50cyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIF9zZXBhcmF0ZSh4LCB5KSB7XHJcbiAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XHJcbiAgICAgIHR5cGU6ICdzZXBhcmF0ZScsXHJcbiAgICAgIHg6IHgsXHJcbiAgICAgIHk6IHlcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBfc2VwYXJhdGVSb3coeCkge1xyXG4gICAgdGhpcy5fc2VwYXJhdGUoeCwgLTEpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBfc2VwYXJhdGVDb2woeSkge1xyXG4gICAgdGhpcy5fc2VwYXJhdGUoLTEsIHkpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBfZGVzZXBhcmF0ZSh4LCB5KSB7XHJcbiAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XHJcbiAgICAgIHR5cGU6ICdkZXNlcGFyYXRlJyxcclxuICAgICAgeDogeCxcclxuICAgICAgeTogeVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIF9kZXNlcGFyYXRlUm93KHgpIHtcclxuICAgIHRoaXMuX2Rlc2VwYXJhdGUoeCwgLTEpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBfZGVzZXBhcmF0ZUNvbCh5KSB7XHJcbiAgICB0aGlzLl9kZXNlcGFyYXRlKC0xLCB5KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgcHVzaFNlbGVjdGluZ1N0ZXAoKSB7XHJcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcbiAgICB2YXIgdHlwZSA9IGFyZ3Muc2hpZnQoKTtcclxuICAgIHZhciBtb2RlID0gYXJncy5zaGlmdCgpO1xyXG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3Muc2hpZnQoKSk7XHJcbiAgICB2YXIgY29vcmQ7XHJcbiAgICBzd2l0Y2ggKG1vZGUpIHtcclxuICAgICAgY2FzZSAncm93JzpcclxuICAgICAgICBjb29yZCA9IHtcclxuICAgICAgICAgIHg6IGFyZ3NbMF0sXHJcbiAgICAgICAgICBzeTogYXJnc1sxXSxcclxuICAgICAgICAgIGV5OiBhcmdzWzJdXHJcbiAgICAgICAgfTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnY29sJzpcclxuICAgICAgICBjb29yZCA9IHtcclxuICAgICAgICAgIHk6IGFyZ3NbMF0sXHJcbiAgICAgICAgICBzeDogYXJnc1sxXSxcclxuICAgICAgICAgIGV4OiBhcmdzWzJdXHJcbiAgICAgICAgfTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBpZiAoYXJnc1syXSA9PT0gdW5kZWZpbmVkICYmIGFyZ3NbM10gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgY29vcmQgPSB7XHJcbiAgICAgICAgICAgIHg6IGFyZ3NbMF0sXHJcbiAgICAgICAgICAgIHk6IGFyZ3NbMV1cclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvb3JkID0ge1xyXG4gICAgICAgICAgICBzeDogYXJnc1swXSxcclxuICAgICAgICAgICAgc3k6IGFyZ3NbMV0sXHJcbiAgICAgICAgICAgIGV4OiBhcmdzWzJdLFxyXG4gICAgICAgICAgICBleTogYXJnc1szXVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB2YXIgc3RlcCA9IHtcclxuICAgICAgdHlwZTogdHlwZVxyXG4gICAgfTtcclxuICAgICQuZXh0ZW5kKHN0ZXAsIGNvb3JkKTtcclxuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHN0ZXApO1xyXG4gIH1cclxuXHJcbiAgcHJvY2Vzc1N0ZXAoc3RlcCwgb3B0aW9ucykge1xyXG4gICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcclxuICAgICAgY2FzZSAnbm90aWZ5JzpcclxuICAgICAgICBpZiAoc3RlcC52ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHZhciAkcm93ID0gdGhpcy4kdGFibGUuZmluZCgnLm10Ymwtcm93JykuZXEoc3RlcC54KTtcclxuICAgICAgICAgIHZhciAkY29sID0gJHJvdy5maW5kKCcubXRibC1jb2wnKS5lcShzdGVwLnkpO1xyXG4gICAgICAgICAgJGNvbC50ZXh0KHJlZmluZUJ5VHlwZShzdGVwLnYpKTtcclxuICAgICAgICB9XHJcbiAgICAgIGNhc2UgJ2Rlbm90aWZ5JzpcclxuICAgICAgY2FzZSAnc2VsZWN0JzpcclxuICAgICAgY2FzZSAnZGVzZWxlY3QnOlxyXG4gICAgICAgIHZhciBjb2xvckNsYXNzID0gc3RlcC50eXBlID09ICdzZWxlY3QnIHx8IHN0ZXAudHlwZSA9PSAnZGVzZWxlY3QnID8gdGhpcy5jb2xvckNsYXNzLnNlbGVjdGVkIDogdGhpcy5jb2xvckNsYXNzLm5vdGlmaWVkO1xyXG4gICAgICAgIHZhciBhZGRDbGFzcyA9IHN0ZXAudHlwZSA9PSAnc2VsZWN0JyB8fCBzdGVwLnR5cGUgPT0gJ25vdGlmeSc7XHJcbiAgICAgICAgdmFyIHN4ID0gc3RlcC5zeDtcclxuICAgICAgICB2YXIgc3kgPSBzdGVwLnN5O1xyXG4gICAgICAgIHZhciBleCA9IHN0ZXAuZXg7XHJcbiAgICAgICAgdmFyIGV5ID0gc3RlcC5leTtcclxuICAgICAgICBpZiAoc3ggPT09IHVuZGVmaW5lZCkgc3ggPSBzdGVwLng7XHJcbiAgICAgICAgaWYgKHN5ID09PSB1bmRlZmluZWQpIHN5ID0gc3RlcC55O1xyXG4gICAgICAgIGlmIChleCA9PT0gdW5kZWZpbmVkKSBleCA9IHN0ZXAueDtcclxuICAgICAgICBpZiAoZXkgPT09IHVuZGVmaW5lZCkgZXkgPSBzdGVwLnk7XHJcbiAgICAgICAgdGhpcy5wYWludENvbG9yKHN4LCBzeSwgZXgsIGV5LCBjb2xvckNsYXNzLCBhZGRDbGFzcyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ3NlcGFyYXRlJzpcclxuICAgICAgICB0aGlzLmRlc2VwYXJhdGUoc3RlcC54LCBzdGVwLnkpO1xyXG4gICAgICAgIHRoaXMuc2VwYXJhdGUoc3RlcC54LCBzdGVwLnkpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdkZXNlcGFyYXRlJzpcclxuICAgICAgICB0aGlzLmRlc2VwYXJhdGUoc3RlcC54LCBzdGVwLnkpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHN1cGVyLnByb2Nlc3NTdGVwKHN0ZXAsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0RGF0YShEKSB7XHJcbiAgICB0aGlzLnZpZXdYID0gdGhpcy52aWV3WSA9IDA7XHJcbiAgICB0aGlzLnBhZGRpbmdIID0gNjtcclxuICAgIHRoaXMucGFkZGluZ1YgPSAzO1xyXG4gICAgdGhpcy5mb250U2l6ZSA9IDE2O1xyXG5cclxuICAgIGlmIChzdXBlci5zZXREYXRhLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcclxuICAgICAgdGhpcy4kdGFibGUuZmluZCgnLm10Ymwtcm93JykuZWFjaChmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgICQodGhpcykuZmluZCgnLm10YmwtY29sJykuZWFjaChmdW5jdGlvbiAoaikge1xyXG4gICAgICAgICAgJCh0aGlzKS50ZXh0KHJlZmluZUJ5VHlwZShEW2ldW2pdKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiR0YWJsZS5lbXB0eSgpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBELmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciAkcm93ID0gJCgnPGRpdiBjbGFzcz1cIm10Ymwtcm93XCI+Jyk7XHJcbiAgICAgIHRoaXMuJHRhYmxlLmFwcGVuZCgkcm93KTtcclxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBEW2ldLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgdmFyICRjb2wgPSAkKCc8ZGl2IGNsYXNzPVwibXRibC1jb2xcIj4nKVxyXG4gICAgICAgICAgLmNzcyh0aGlzLmdldENlbGxDc3MoKSlcclxuICAgICAgICAgIC50ZXh0KHJlZmluZUJ5VHlwZShEW2ldW2pdKSk7XHJcbiAgICAgICAgJHJvdy5hcHBlbmQoJGNvbCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMucmVzaXplKCk7XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcmVzaXplKCkge1xyXG4gICAgc3VwZXIucmVzaXplKCk7XHJcblxyXG4gICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgfVxyXG5cclxuICBjbGVhcigpIHtcclxuICAgIHN1cGVyLmNsZWFyKCk7XHJcblxyXG4gICAgdGhpcy5jbGVhckNvbG9yKCk7XHJcbiAgICB0aGlzLmRlc2VwYXJhdGVBbGwoKTtcclxuICB9XHJcblxyXG4gIGdldENlbGxDc3MoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwYWRkaW5nOiB0aGlzLnBhZGRpbmdWLnRvRml4ZWQoMSkgKyAncHggJyArIHRoaXMucGFkZGluZ0gudG9GaXhlZCgxKSArICdweCcsXHJcbiAgICAgICdmb250LXNpemUnOiB0aGlzLmZvbnRTaXplLnRvRml4ZWQoMSkgKyAncHgnXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcmVmcmVzaCgpIHtcclxuICAgIHN1cGVyLnJlZnJlc2goKTtcclxuXHJcbiAgICB2YXIgJHBhcmVudCA9IHRoaXMuJHRhYmxlLnBhcmVudCgpO1xyXG4gICAgdmFyIHRvcCA9ICRwYXJlbnQuaGVpZ2h0KCkgLyAyIC0gdGhpcy4kdGFibGUuaGVpZ2h0KCkgLyAyICsgdGhpcy52aWV3WTtcclxuICAgIHZhciBsZWZ0ID0gJHBhcmVudC53aWR0aCgpIC8gMiAtIHRoaXMuJHRhYmxlLndpZHRoKCkgLyAyICsgdGhpcy52aWV3WDtcclxuICAgIHRoaXMuJHRhYmxlLmNzcygnbWFyZ2luLXRvcCcsIHRvcCk7XHJcbiAgICB0aGlzLiR0YWJsZS5jc3MoJ21hcmdpbi1sZWZ0JywgbGVmdCk7XHJcbiAgfVxyXG5cclxuICBtb3VzZWRvd24oZSkge1xyXG4gICAgc3VwZXIubW91c2Vkb3duKGUpO1xyXG5cclxuICAgIHRoaXMuZHJhZ1ggPSBlLnBhZ2VYO1xyXG4gICAgdGhpcy5kcmFnWSA9IGUucGFnZVk7XHJcbiAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIG1vdXNlbW92ZShlKSB7XHJcbiAgICBzdXBlci5tb3VzZW1vdmUoZSk7XHJcblxyXG4gICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcclxuICAgICAgdGhpcy52aWV3WCArPSBlLnBhZ2VYIC0gdGhpcy5kcmFnWDtcclxuICAgICAgdGhpcy52aWV3WSArPSBlLnBhZ2VZIC0gdGhpcy5kcmFnWTtcclxuICAgICAgdGhpcy5kcmFnWCA9IGUucGFnZVg7XHJcbiAgICAgIHRoaXMuZHJhZ1kgPSBlLnBhZ2VZO1xyXG4gICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG1vdXNldXAoZSkge1xyXG4gICAgc3VwZXIubW91c2V1cChlKTtcclxuXHJcbiAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBtb3VzZXdoZWVsKGUpIHtcclxuICAgIHN1cGVyLm1vdXNld2hlZWwoZSk7XHJcblxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZSA9IGUub3JpZ2luYWxFdmVudDtcclxuICAgIHZhciBkZWx0YSA9IChlLndoZWVsRGVsdGEgIT09IHVuZGVmaW5lZCAmJiBlLndoZWVsRGVsdGEpIHx8XHJcbiAgICAgIChlLmRldGFpbCAhPT0gdW5kZWZpbmVkICYmIC1lLmRldGFpbCk7XHJcbiAgICB2YXIgd2VpZ2h0ID0gMS4wMTtcclxuICAgIHZhciByYXRpbyA9IGRlbHRhID4gMCA/IDEgLyB3ZWlnaHQgOiB3ZWlnaHQ7XHJcbiAgICBpZiAodGhpcy5mb250U2l6ZSA8IDQgJiYgcmF0aW8gPCAxKSByZXR1cm47XHJcbiAgICBpZiAodGhpcy5mb250U2l6ZSA+IDQwICYmIHJhdGlvID4gMSkgcmV0dXJuO1xyXG4gICAgdGhpcy5wYWRkaW5nViAqPSByYXRpbztcclxuICAgIHRoaXMucGFkZGluZ0ggKj0gcmF0aW87XHJcbiAgICB0aGlzLmZvbnRTaXplICo9IHJhdGlvO1xyXG4gICAgdGhpcy4kdGFibGUuZmluZCgnLm10YmwtY29sJykuY3NzKHRoaXMuZ2V0Q2VsbENzcygpKTtcclxuICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gIH1cclxuXHJcbiAgcGFpbnRDb2xvcihzeCwgc3ksIGV4LCBleSwgY29sb3JDbGFzcywgYWRkQ2xhc3MpIHtcclxuICAgIGZvciAodmFyIGkgPSBzeDsgaSA8PSBleDsgaSsrKSB7XHJcbiAgICAgIHZhciAkcm93ID0gdGhpcy4kdGFibGUuZmluZCgnLm10Ymwtcm93JykuZXEoaSk7XHJcbiAgICAgIGZvciAodmFyIGogPSBzeTsgaiA8PSBleTsgaisrKSB7XHJcbiAgICAgICAgdmFyICRjb2wgPSAkcm93LmZpbmQoJy5tdGJsLWNvbCcpLmVxKGopO1xyXG4gICAgICAgIGlmIChhZGRDbGFzcykgJGNvbC5hZGRDbGFzcyhjb2xvckNsYXNzKTtcclxuICAgICAgICBlbHNlICRjb2wucmVtb3ZlQ2xhc3MoY29sb3JDbGFzcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNsZWFyQ29sb3IoKSB7XHJcbiAgICB0aGlzLiR0YWJsZS5maW5kKCcubXRibC1jb2wnKS5yZW1vdmVDbGFzcyhPYmplY3Qua2V5cyh0aGlzLmNvbG9yQ2xhc3MpLmpvaW4oJyAnKSk7XHJcbiAgfVxyXG5cclxuICBzZXBhcmF0ZSh4LCB5KSB7XHJcbiAgICB0aGlzLiR0YWJsZS5maW5kKCcubXRibC1yb3cnKS5lYWNoKGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgIHZhciAkcm93ID0gJCh0aGlzKTtcclxuICAgICAgaWYgKGkgPT0geCkge1xyXG4gICAgICAgICRyb3cuYWZ0ZXIoJCgnPGRpdiBjbGFzcz1cIm10YmwtZW1wdHktcm93XCI+JykuYXR0cignZGF0YS1yb3cnLCBpKSlcclxuICAgICAgfVxyXG4gICAgICAkcm93LmZpbmQoJy5tdGJsLWNvbCcpLmVhY2goZnVuY3Rpb24gKGopIHtcclxuICAgICAgICB2YXIgJGNvbCA9ICQodGhpcyk7XHJcbiAgICAgICAgaWYgKGogPT0geSkge1xyXG4gICAgICAgICAgJGNvbC5hZnRlcigkKCc8ZGl2IGNsYXNzPVwibXRibC1lbXB0eS1jb2xcIj4nKS5hdHRyKCdkYXRhLWNvbCcsIGopKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBkZXNlcGFyYXRlKHgsIHkpIHtcclxuICAgIHRoaXMuJHRhYmxlLmZpbmQoJ1tkYXRhLXJvdz0nICsgeCArICddJykucmVtb3ZlKCk7XHJcbiAgICB0aGlzLiR0YWJsZS5maW5kKCdbZGF0YS1jb2w9JyArIHkgKyAnXScpLnJlbW92ZSgpO1xyXG4gIH1cclxuXHJcbiAgZGVzZXBhcmF0ZUFsbCgpIHtcclxuICAgIHRoaXMuJHRhYmxlLmZpbmQoJy5tdGJsLWVtcHR5LXJvdywgLm10YmwtZW1wdHktY29sJykucmVtb3ZlKCk7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBpbml0VmlldyA9ICh0cmFjZXIpID0+IHtcclxuICB0cmFjZXIuJHRhYmxlID0gdHJhY2VyLmNhcHN1bGUuJHRhYmxlID0gJCgnPGRpdiBjbGFzcz1cIm10YmwtdGFibGVcIj4nKTtcclxuICB0cmFjZXIuJGNvbnRhaW5lci5hcHBlbmQodHJhY2VyLiR0YWJsZSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5MkRUcmFjZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IFRyYWNlciA9IHJlcXVpcmUoJy4vdHJhY2VyJyk7XHJcblxyXG5jbGFzcyBDaGFydFRyYWNlciBleHRlbmRzIFRyYWNlciB7XHJcbiAgc3RhdGljIGdldENsYXNzTmFtZSgpIHtcclxuICAgIHJldHVybiAnQ2hhcnRUcmFjZXInO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgc3VwZXIobmFtZSk7XHJcblxyXG4gICAgdGhpcy5jb2xvciA9IHtcclxuICAgICAgc2VsZWN0ZWQ6ICdyZ2IoMCwgMCwgMjU1KScsXHJcbiAgICAgIG5vdGlmaWVkOiAncmdiKDI1NSwgMCwgMCknLFxyXG4gICAgICBkZWZhdWx0OiAncmdiKDEzNiwgMTM2LCAxMzYpJ1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAodGhpcy5pc05ldykgaW5pdFZpZXcodGhpcyk7XHJcbiAgfVxyXG5cclxuICBzZXREYXRhKEMpIHtcclxuICAgIGlmIChzdXBlci5zZXREYXRhLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcclxuICAgICAgdGhpcy5jaGFydC5jb25maWcuZGF0YS5kYXRhc2V0c1swXS5kYXRhID0gQztcclxuICAgICAgdGhpcy5jaGFydC51cGRhdGUoKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNvbG9yID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IEMubGVuZ3RoOyBpKyspIGNvbG9yLnB1c2godGhpcy5jb2xvci5kZWZhdWx0KTtcclxuICAgIHRoaXMuY2hhcnQuY29uZmlnLmRhdGEgPSB7XHJcbiAgICAgIGxhYmVsczogQy5tYXAoU3RyaW5nKSxcclxuICAgICAgZGF0YXNldHM6IFt7XHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjb2xvcixcclxuICAgICAgICBkYXRhOiBDXHJcbiAgICAgIH1dXHJcbiAgICB9O1xyXG4gICAgdGhpcy5jaGFydC51cGRhdGUoKTtcclxuICB9XHJcblxyXG4gIF9ub3RpZnkocywgdikge1xyXG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xyXG4gICAgICB0eXBlOiAnbm90aWZ5JyxcclxuICAgICAgczogcyxcclxuICAgICAgdjogdlxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIF9kZW5vdGlmeShzKSB7XHJcbiAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XHJcbiAgICAgIHR5cGU6ICdkZW5vdGlmeScsXHJcbiAgICAgIHM6IHNcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBfc2VsZWN0KHMsIGUpIHtcclxuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcclxuICAgICAgdHlwZTogJ3NlbGVjdCcsXHJcbiAgICAgIHM6IHMsXHJcbiAgICAgIGU6IGVcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBfZGVzZWxlY3QocywgZSkge1xyXG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xyXG4gICAgICB0eXBlOiAnZGVzZWxlY3QnLFxyXG4gICAgICBzOiBzLFxyXG4gICAgICBlOiBlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgcHJvY2Vzc1N0ZXAoc3RlcCwgb3B0aW9ucykge1xyXG4gICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcclxuICAgICAgY2FzZSAnbm90aWZ5JzpcclxuICAgICAgICBpZiAoc3RlcC52ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHRoaXMuY2hhcnQuY29uZmlnLmRhdGEuZGF0YXNldHNbMF0uZGF0YVtzdGVwLnNdID0gc3RlcC52O1xyXG4gICAgICAgICAgdGhpcy5jaGFydC5jb25maWcuZGF0YS5sYWJlbHNbc3RlcC5zXSA9IHN0ZXAudi50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgY2FzZSAnZGVub3RpZnknOlxyXG4gICAgICBjYXNlICdzZWxlY3QnOlxyXG4gICAgICBjYXNlICdkZXNlbGVjdCc6XHJcbiAgICAgICAgbGV0IGNvbG9yID0gc3RlcC50eXBlID09ICdub3RpZnknID8gdGhpcy5jb2xvci5ub3RpZmllZCA6IHN0ZXAudHlwZSA9PSAnc2VsZWN0JyA/IHRoaXMuY29sb3Iuc2VsZWN0ZWQgOiB0aGlzLmNvbG9yLmRlZmF1bHQ7XHJcbiAgICAgICAgaWYgKHN0ZXAuZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IHN0ZXAuczsgaSA8PSBzdGVwLmU7IGkrKylcclxuICAgICAgICAgICAgdGhpcy5jaGFydC5jb25maWcuZGF0YS5kYXRhc2V0c1swXS5iYWNrZ3JvdW5kQ29sb3JbaV0gPSBjb2xvcjtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICB0aGlzLmNoYXJ0LmNvbmZpZy5kYXRhLmRhdGFzZXRzWzBdLmJhY2tncm91bmRDb2xvcltzdGVwLnNdID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy5jaGFydC51cGRhdGUoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBzdXBlci5wcm9jZXNzU3RlcChzdGVwLCBvcHRpb25zKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlc2l6ZSgpIHtcclxuICAgIHN1cGVyLnJlc2l6ZSgpO1xyXG5cclxuICAgIHRoaXMuY2hhcnQucmVzaXplKCk7XHJcbiAgfVxyXG5cclxuICBjbGVhcigpIHtcclxuICAgIHN1cGVyLmNsZWFyKCk7XHJcblxyXG4gICAgY29uc3QgZGF0YSA9IHRoaXMuY2hhcnQuY29uZmlnLmRhdGE7XHJcbiAgICBpZiAoZGF0YS5kYXRhc2V0cy5sZW5ndGgpIHtcclxuICAgICAgY29uc3QgYmFja2dyb3VuZENvbG9yID0gZGF0YS5kYXRhc2V0c1swXS5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmFja2dyb3VuZENvbG9yLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yW2ldID0gdGhpcy5jb2xvci5kZWZhdWx0O1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY2hhcnQudXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBpbml0VmlldyA9ICh0cmFjZXIpID0+IHtcclxuICB0cmFjZXIuJHdyYXBwZXIgPSB0cmFjZXIuY2Fwc3VsZS4kd3JhcHBlciA9ICQoJzxjYW52YXMgY2xhc3M9XCJtY2hydC1jaGFydFwiPicpO1xyXG4gIHRyYWNlci4kY29udGFpbmVyLmFwcGVuZCh0cmFjZXIuJHdyYXBwZXIpO1xyXG4gIHRyYWNlci5jaGFydCA9IHRyYWNlci5jYXBzdWxlLmNoYXJ0ID0gbmV3IENoYXJ0KHRyYWNlci4kd3JhcHBlciwge1xyXG4gICAgdHlwZTogJ2JhcicsXHJcbiAgICBkYXRhOiB7XHJcbiAgICAgIGxhYmVsczogW10sXHJcbiAgICAgIGRhdGFzZXRzOiBbXVxyXG4gICAgfSxcclxuICAgIG9wdGlvbnM6IHtcclxuICAgICAgc2NhbGVzOiB7XHJcbiAgICAgICAgeUF4ZXM6IFt7XHJcbiAgICAgICAgICB0aWNrczoge1xyXG4gICAgICAgICAgICBiZWdpbkF0WmVybzogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1dXHJcbiAgICAgIH0sXHJcbiAgICAgIGFuaW1hdGlvbjogZmFsc2UsXHJcbiAgICAgIGxlZ2VuZDogZmFsc2UsXHJcbiAgICAgIHJlc3BvbnNpdmU6IHRydWUsXHJcbiAgICAgIG1haW50YWluQXNwZWN0UmF0aW86IGZhbHNlXHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENoYXJ0VHJhY2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBEaXJlY3RlZEdyYXBoVHJhY2VyID0gcmVxdWlyZSgnLi9kaXJlY3RlZF9ncmFwaCcpO1xyXG5cclxuY2xhc3MgQ29vcmRpbmF0ZVN5c3RlbVRyYWNlciBleHRlbmRzIERpcmVjdGVkR3JhcGhUcmFjZXIge1xyXG4gIHN0YXRpYyBnZXRDbGFzc05hbWUoKSB7XHJcbiAgICByZXR1cm4gJ0Nvb3JkaW5hdGVTeXN0ZW1UcmFjZXInO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgc3VwZXIobmFtZSk7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNOZXcpIGluaXRWaWV3KHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgc2V0RGF0YShDKSB7XHJcbiAgICBpZiAoVHJhY2VyLnByb3RvdHlwZS5zZXREYXRhLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHJldHVybiB0cnVlO1xyXG5cclxuICAgIHRoaXMuZ3JhcGguY2xlYXIoKTtcclxuICAgIHZhciBub2RlcyA9IFtdO1xyXG4gICAgdmFyIGVkZ2VzID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IEMubGVuZ3RoOyBpKyspXHJcbiAgICAgIG5vZGVzLnB1c2goe1xyXG4gICAgICAgIGlkOiB0aGlzLm4oaSksXHJcbiAgICAgICAgeDogQ1tpXVswXSxcclxuICAgICAgICB5OiBDW2ldWzFdLFxyXG4gICAgICAgIGxhYmVsOiAnJyArIGksXHJcbiAgICAgICAgc2l6ZTogMSxcclxuICAgICAgICBjb2xvcjogdGhpcy5jb2xvci5kZWZhdWx0XHJcbiAgICAgIH0pO1xyXG4gICAgdGhpcy5ncmFwaC5yZWFkKHtcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICBlZGdlczogZWRnZXNcclxuICAgIH0pO1xyXG4gICAgdGhpcy5zLmNhbWVyYS5nb1RvKHtcclxuICAgICAgeDogMCxcclxuICAgICAgeTogMCxcclxuICAgICAgYW5nbGU6IDAsXHJcbiAgICAgIHJhdGlvOiAxXHJcbiAgICB9KTtcclxuICAgIHRoaXMucmVmcmVzaCgpO1xyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHByb2Nlc3NTdGVwKHN0ZXAsIG9wdGlvbnMpIHtcclxuICAgIHN3aXRjaCAoc3RlcC50eXBlKSB7XHJcbiAgICAgIGNhc2UgJ3Zpc2l0JzpcclxuICAgICAgY2FzZSAnbGVhdmUnOlxyXG4gICAgICAgIHZhciB2aXNpdCA9IHN0ZXAudHlwZSA9PSAndmlzaXQnO1xyXG4gICAgICAgIHZhciB0YXJnZXROb2RlID0gdGhpcy5ncmFwaC5ub2Rlcyh0aGlzLm4oc3RlcC50YXJnZXQpKTtcclxuICAgICAgICB2YXIgY29sb3IgPSB2aXNpdCA/IHRoaXMuY29sb3IudmlzaXRlZCA6IHRoaXMuY29sb3IubGVmdDtcclxuICAgICAgICB0YXJnZXROb2RlLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgaWYgKHN0ZXAuc291cmNlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHZhciBlZGdlSWQgPSB0aGlzLmUoc3RlcC5zb3VyY2UsIHN0ZXAudGFyZ2V0KTtcclxuICAgICAgICAgIGlmICh0aGlzLmdyYXBoLmVkZ2VzKGVkZ2VJZCkpIHtcclxuICAgICAgICAgICAgdmFyIGVkZ2UgPSB0aGlzLmdyYXBoLmVkZ2VzKGVkZ2VJZCk7XHJcbiAgICAgICAgICAgIGVkZ2UuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaC5kcm9wRWRnZShlZGdlSWQpLmFkZEVkZ2UoZWRnZSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoLmFkZEVkZ2Uoe1xyXG4gICAgICAgICAgICAgIGlkOiB0aGlzLmUoc3RlcC50YXJnZXQsIHN0ZXAuc291cmNlKSxcclxuICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMubihzdGVwLnNvdXJjZSksXHJcbiAgICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLm4oc3RlcC50YXJnZXQpLFxyXG4gICAgICAgICAgICAgIGNvbG9yOiBjb2xvcixcclxuICAgICAgICAgICAgICBzaXplOiAxXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5sb2dUcmFjZXIpIHtcclxuICAgICAgICAgIHZhciBzb3VyY2UgPSBzdGVwLnNvdXJjZTtcclxuICAgICAgICAgIGlmIChzb3VyY2UgPT09IHVuZGVmaW5lZCkgc291cmNlID0gJyc7XHJcbiAgICAgICAgICB0aGlzLmxvZ1RyYWNlci5wcmludCh2aXNpdCA/IHNvdXJjZSArICcgLT4gJyArIHN0ZXAudGFyZ2V0IDogc291cmNlICsgJyA8LSAnICsgc3RlcC50YXJnZXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBzdXBlci5wcm9jZXNzU3RlcChzdGVwLCBvcHRpb25zKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGUodjEsIHYyKSB7XHJcbiAgICBpZiAodjEgPiB2Mikge1xyXG4gICAgICB2YXIgdGVtcCA9IHYxO1xyXG4gICAgICB2MSA9IHYyO1xyXG4gICAgICB2MiA9IHRlbXA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJ2UnICsgdjEgKyAnXycgKyB2MjtcclxuICB9XHJcblxyXG4gIGRyYXdPbkhvdmVyKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzLCBuZXh0KSB7XHJcbiAgICB2YXIgdHJhY2VyID0gdGhpcztcclxuXHJcbiAgICBjb250ZXh0LnNldExpbmVEYXNoKFs1LCA1XSk7XHJcbiAgICB2YXIgbm9kZUlkeCA9IG5vZGUuaWQuc3Vic3RyaW5nKDEpO1xyXG4gICAgdGhpcy5ncmFwaC5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24gKGVkZ2UpIHtcclxuICAgICAgdmFyIGVuZHMgPSBlZGdlLmlkLnN1YnN0cmluZygxKS5zcGxpdChcIl9cIik7XHJcbiAgICAgIGlmIChlbmRzWzBdID09IG5vZGVJZHgpIHtcclxuICAgICAgICB2YXIgY29sb3IgPSAnIzBmZic7XHJcbiAgICAgICAgdmFyIHNvdXJjZSA9IG5vZGU7XHJcbiAgICAgICAgdmFyIHRhcmdldCA9IHRyYWNlci5ncmFwaC5ub2RlcygnbicgKyBlbmRzWzFdKTtcclxuICAgICAgICB0cmFjZXIuZHJhd0VkZ2UoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XHJcbiAgICAgICAgaWYgKG5leHQpIG5leHQoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZW5kc1sxXSA9PSBub2RlSWR4KSB7XHJcbiAgICAgICAgdmFyIGNvbG9yID0gJyMwZmYnO1xyXG4gICAgICAgIHZhciBzb3VyY2UgPSB0cmFjZXIuZ3JhcGgubm9kZXMoJ24nICsgZW5kc1swXSk7XHJcbiAgICAgICAgdmFyIHRhcmdldCA9IG5vZGU7XHJcbiAgICAgICAgdHJhY2VyLmRyYXdFZGdlKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xyXG4gICAgICAgIGlmIChuZXh0KSBuZXh0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRyYXdFZGdlKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpIHtcclxuICAgIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXHJcbiAgICAgIHNpemUgPSBlZGdlW3ByZWZpeCArICdzaXplJ10gfHwgMTtcclxuXHJcbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcbiAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHNpemU7XHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgY29udGV4dC5tb3ZlVG8oXHJcbiAgICAgIHNvdXJjZVtwcmVmaXggKyAneCddLFxyXG4gICAgICBzb3VyY2VbcHJlZml4ICsgJ3knXVxyXG4gICAgKTtcclxuICAgIGNvbnRleHQubGluZVRvKFxyXG4gICAgICB0YXJnZXRbcHJlZml4ICsgJ3gnXSxcclxuICAgICAgdGFyZ2V0W3ByZWZpeCArICd5J11cclxuICAgICk7XHJcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgaW5pdFZpZXcgPSAodHJhY2VyKSA9PiB7XHJcbiAgdHJhY2VyLnMuc2V0dGluZ3Moe1xyXG4gICAgZGVmYXVsdEVkZ2VUeXBlOiAnZGVmJyxcclxuICAgIGZ1bmNFZGdlc0RlZihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpIHtcclxuICAgICAgdmFyIGNvbG9yID0gdHJhY2VyLmdldENvbG9yKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBzZXR0aW5ncyk7XHJcbiAgICAgIHRyYWNlci5kcmF3RWRnZShlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29vcmRpbmF0ZVN5c3RlbVRyYWNlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgVHJhY2VyID0gcmVxdWlyZSgnLi90cmFjZXInKTtcclxuXHJcbmNvbnN0IHtcclxuICByZWZpbmVCeVR5cGVcclxufSA9IHJlcXVpcmUoJy4uLy4uL3RyYWNlcl9tYW5hZ2VyL3V0aWwvaW5kZXgnKTtcclxuXHJcbmNsYXNzIERpcmVjdGVkR3JhcGhUcmFjZXIgZXh0ZW5kcyBUcmFjZXIge1xyXG4gIHN0YXRpYyBnZXRDbGFzc05hbWUoKSB7XHJcbiAgICByZXR1cm4gJ0RpcmVjdGVkR3JhcGhUcmFjZXInO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgc3VwZXIobmFtZSk7XHJcblxyXG4gICAgdGhpcy5jb2xvciA9IHtcclxuICAgICAgc2VsZWN0ZWQ6ICcjMGYwJyxcclxuICAgICAgdmlzaXRlZDogJyNmMDAnLFxyXG4gICAgICBsZWZ0OiAnIzAwMCcsXHJcbiAgICAgIGRlZmF1bHQ6ICcjODg4J1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAodGhpcy5pc05ldykgaW5pdFZpZXcodGhpcyk7XHJcbiAgfVxyXG5cclxuICBfc2V0VHJlZURhdGEoRywgcm9vdCkge1xyXG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xyXG4gICAgICB0eXBlOiAnc2V0VHJlZURhdGEnLFxyXG4gICAgICBhcmd1bWVudHM6IGFyZ3VtZW50c1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIF92aXNpdCh0YXJnZXQsIHNvdXJjZSkge1xyXG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xyXG4gICAgICB0eXBlOiAndmlzaXQnLFxyXG4gICAgICB0YXJnZXQ6IHRhcmdldCxcclxuICAgICAgc291cmNlOiBzb3VyY2VcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBfbGVhdmUodGFyZ2V0LCBzb3VyY2UpIHtcclxuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcclxuICAgICAgdHlwZTogJ2xlYXZlJyxcclxuICAgICAgdGFyZ2V0OiB0YXJnZXQsXHJcbiAgICAgIHNvdXJjZTogc291cmNlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgcHJvY2Vzc1N0ZXAoc3RlcCwgb3B0aW9ucykge1xyXG4gICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcclxuICAgICAgY2FzZSAnc2V0VHJlZURhdGEnOlxyXG4gICAgICAgIHRoaXMuc2V0VHJlZURhdGEuYXBwbHkodGhpcywgc3RlcC5hcmd1bWVudHMpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICd2aXNpdCc6XHJcbiAgICAgIGNhc2UgJ2xlYXZlJzpcclxuICAgICAgICB2YXIgdmlzaXQgPSBzdGVwLnR5cGUgPT0gJ3Zpc2l0JztcclxuICAgICAgICB2YXIgdGFyZ2V0Tm9kZSA9IHRoaXMuZ3JhcGgubm9kZXModGhpcy5uKHN0ZXAudGFyZ2V0KSk7XHJcbiAgICAgICAgdmFyIGNvbG9yID0gdmlzaXQgPyB0aGlzLmNvbG9yLnZpc2l0ZWQgOiB0aGlzLmNvbG9yLmxlZnQ7XHJcbiAgICAgICAgdGFyZ2V0Tm9kZS5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIGlmIChzdGVwLnNvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICB2YXIgZWRnZUlkID0gdGhpcy5lKHN0ZXAuc291cmNlLCBzdGVwLnRhcmdldCk7XHJcbiAgICAgICAgICB2YXIgZWRnZSA9IHRoaXMuZ3JhcGguZWRnZXMoZWRnZUlkKTtcclxuICAgICAgICAgIGVkZ2UuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgIHRoaXMuZ3JhcGguZHJvcEVkZ2UoZWRnZUlkKS5hZGRFZGdlKGVkZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5sb2dUcmFjZXIpIHtcclxuICAgICAgICAgIHZhciBzb3VyY2UgPSBzdGVwLnNvdXJjZTtcclxuICAgICAgICAgIGlmIChzb3VyY2UgPT09IHVuZGVmaW5lZCkgc291cmNlID0gJyc7XHJcbiAgICAgICAgICB0aGlzLmxvZ1RyYWNlci5wcmludCh2aXNpdCA/IHNvdXJjZSArICcgLT4gJyArIHN0ZXAudGFyZ2V0IDogc291cmNlICsgJyA8LSAnICsgc3RlcC50YXJnZXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBzdXBlci5wcm9jZXNzU3RlcChzdGVwLCBvcHRpb25zKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldFRyZWVEYXRhKEcsIHJvb3QsIHVuZGlyZWN0ZWQpIHtcclxuICAgIHZhciB0cmFjZXIgPSB0aGlzO1xyXG5cclxuICAgIHJvb3QgPSByb290IHx8IDA7XHJcbiAgICB2YXIgbWF4RGVwdGggPSAtMTtcclxuXHJcbiAgICB2YXIgY2hrID0gbmV3IEFycmF5KEcubGVuZ3RoKTtcclxuICAgIHZhciBnZXREZXB0aCA9IGZ1bmN0aW9uIChub2RlLCBkZXB0aCkge1xyXG4gICAgICBpZiAoY2hrW25vZGVdKSB0aHJvdyBcInRoZSBnaXZlbiBncmFwaCBpcyBub3QgYSB0cmVlIGJlY2F1c2UgaXQgZm9ybXMgYSBjaXJjdWl0XCI7XHJcbiAgICAgIGNoa1tub2RlXSA9IHRydWU7XHJcbiAgICAgIGlmIChtYXhEZXB0aCA8IGRlcHRoKSBtYXhEZXB0aCA9IGRlcHRoO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEdbbm9kZV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoR1tub2RlXVtpXSkgZ2V0RGVwdGgoaSwgZGVwdGggKyAxKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIGdldERlcHRoKHJvb3QsIDEpO1xyXG5cclxuICAgIGlmICh0aGlzLnNldERhdGEoRywgdW5kaXJlY3RlZCkpIHJldHVybiB0cnVlO1xyXG5cclxuICAgIHZhciBwbGFjZSA9IGZ1bmN0aW9uIChub2RlLCB4LCB5KSB7XHJcbiAgICAgIHZhciB0ZW1wID0gdHJhY2VyLmdyYXBoLm5vZGVzKHRyYWNlci5uKG5vZGUpKTtcclxuICAgICAgdGVtcC54ID0geDtcclxuICAgICAgdGVtcC55ID0geTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIHdnYXAgPSAxIC8gKG1heERlcHRoIC0gMSk7XHJcbiAgICB2YXIgZGZzID0gZnVuY3Rpb24gKG5vZGUsIGRlcHRoLCB0b3AsIGJvdHRvbSkge1xyXG4gICAgICBwbGFjZShub2RlLCB0b3AgKyBib3R0b20sIGRlcHRoICogd2dhcCk7XHJcbiAgICAgIHZhciBjaGlsZHJlbiA9IDA7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgR1tub2RlXS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChHW25vZGVdW2ldKSBjaGlsZHJlbisrO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciB2Z2FwID0gKGJvdHRvbSAtIHRvcCkgLyBjaGlsZHJlbjtcclxuICAgICAgdmFyIGNudCA9IDA7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgR1tub2RlXS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChHW25vZGVdW2ldKSBkZnMoaSwgZGVwdGggKyAxLCB0b3AgKyB2Z2FwICogY250LCB0b3AgKyB2Z2FwICogKytjbnQpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgZGZzKHJvb3QsIDAsIDAsIDEpO1xyXG5cclxuICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gIH1cclxuXHJcbiAgc2V0RGF0YShHLCB1bmRpcmVjdGVkKSB7XHJcbiAgICBpZiAoc3VwZXIuc2V0RGF0YS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICB0aGlzLmdyYXBoLmNsZWFyKCk7XHJcbiAgICBjb25zdCBub2RlcyA9IFtdO1xyXG4gICAgY29uc3QgZWRnZXMgPSBbXTtcclxuICAgIGNvbnN0IHVuaXRBbmdsZSA9IDIgKiBNYXRoLlBJIC8gRy5sZW5ndGg7XHJcbiAgICBsZXQgY3VycmVudEFuZ2xlID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgRy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjdXJyZW50QW5nbGUgKz0gdW5pdEFuZ2xlO1xyXG4gICAgICBub2Rlcy5wdXNoKHtcclxuICAgICAgICBpZDogdGhpcy5uKGkpLFxyXG4gICAgICAgIGxhYmVsOiAnJyArIGksXHJcbiAgICAgICAgeDogLjUgKyBNYXRoLnNpbihjdXJyZW50QW5nbGUpIC8gMixcclxuICAgICAgICB5OiAuNSArIE1hdGguY29zKGN1cnJlbnRBbmdsZSkgLyAyLFxyXG4gICAgICAgIHNpemU6IDEsXHJcbiAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdCxcclxuICAgICAgICB3ZWlnaHQ6IDBcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAodW5kaXJlY3RlZCkge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDw9IGk7IGorKykge1xyXG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBHW2ldW2pdIHx8IEdbal1baV07XHJcbiAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgZWRnZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgaWQ6IHRoaXMuZShpLCBqKSxcclxuICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMubihpKSxcclxuICAgICAgICAgICAgICB0YXJnZXQ6IHRoaXMubihqKSxcclxuICAgICAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvci5kZWZhdWx0LFxyXG4gICAgICAgICAgICAgIHNpemU6IDEsXHJcbiAgICAgICAgICAgICAgd2VpZ2h0OiByZWZpbmVCeVR5cGUodmFsdWUpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IEdbaV0ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgIGlmIChHW2ldW2pdKSB7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2goe1xyXG4gICAgICAgICAgICAgIGlkOiB0aGlzLmUoaSwgaiksXHJcbiAgICAgICAgICAgICAgc291cmNlOiB0aGlzLm4oaSksXHJcbiAgICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLm4oaiksXHJcbiAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdCxcclxuICAgICAgICAgICAgICBzaXplOiAxLFxyXG4gICAgICAgICAgICAgIHdlaWdodDogcmVmaW5lQnlUeXBlKEdbaV1bal0pXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ3JhcGgucmVhZCh7XHJcbiAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgZWRnZXM6IGVkZ2VzXHJcbiAgICB9KTtcclxuICAgIHRoaXMucy5jYW1lcmEuZ29Ubyh7XHJcbiAgICAgIHg6IDAsXHJcbiAgICAgIHk6IDAsXHJcbiAgICAgIGFuZ2xlOiAwLFxyXG4gICAgICByYXRpbzogMVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnJlZnJlc2goKTtcclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICByZXNpemUoKSB7XHJcbiAgICBzdXBlci5yZXNpemUoKTtcclxuXHJcbiAgICB0aGlzLnMucmVuZGVyZXJzWzBdLnJlc2l6ZSgpO1xyXG4gICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgfVxyXG5cclxuICByZWZyZXNoKCkge1xyXG4gICAgc3VwZXIucmVmcmVzaCgpO1xyXG5cclxuICAgIHRoaXMucy5yZWZyZXNoKCk7XHJcbiAgfVxyXG5cclxuICBjbGVhcigpIHtcclxuICAgIHN1cGVyLmNsZWFyKCk7XHJcblxyXG4gICAgdGhpcy5jbGVhckdyYXBoQ29sb3IoKTtcclxuICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJHcmFwaENvbG9yKCkge1xyXG4gICAgdmFyIHRyYWNlciA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy5ncmFwaC5ub2RlcygpLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgICAgbm9kZS5jb2xvciA9IHRyYWNlci5jb2xvci5kZWZhdWx0O1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmdyYXBoLmVkZ2VzKCkuZm9yRWFjaChmdW5jdGlvbiAoZWRnZSkge1xyXG4gICAgICBlZGdlLmNvbG9yID0gdHJhY2VyLmNvbG9yLmRlZmF1bHQ7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG4odikge1xyXG4gICAgcmV0dXJuICduJyArIHY7XHJcbiAgfVxyXG5cclxuICBlKHYxLCB2Mikge1xyXG4gICAgcmV0dXJuICdlJyArIHYxICsgJ18nICsgdjI7XHJcbiAgfVxyXG5cclxuICBnZXRDb2xvcihlZGdlLCBzb3VyY2UsIHRhcmdldCwgc2V0dGluZ3MpIHtcclxuICAgIHZhciBjb2xvciA9IGVkZ2UuY29sb3IsXHJcbiAgICAgIGVkZ2VDb2xvciA9IHNldHRpbmdzKCdlZGdlQ29sb3InKSxcclxuICAgICAgZGVmYXVsdE5vZGVDb2xvciA9IHNldHRpbmdzKCdkZWZhdWx0Tm9kZUNvbG9yJyksXHJcbiAgICAgIGRlZmF1bHRFZGdlQ29sb3IgPSBzZXR0aW5ncygnZGVmYXVsdEVkZ2VDb2xvcicpO1xyXG4gICAgaWYgKCFjb2xvcilcclxuICAgICAgc3dpdGNoIChlZGdlQ29sb3IpIHtcclxuICAgICAgICBjYXNlICdzb3VyY2UnOlxyXG4gICAgICAgICAgY29sb3IgPSBzb3VyY2UuY29sb3IgfHwgZGVmYXVsdE5vZGVDb2xvcjtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3RhcmdldCc6XHJcbiAgICAgICAgICBjb2xvciA9IHRhcmdldC5jb2xvciB8fCBkZWZhdWx0Tm9kZUNvbG9yO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGNvbG9yID0gZGVmYXVsdEVkZ2VDb2xvcjtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvbG9yO1xyXG4gIH1cclxuXHJcbiAgZHJhd0xhYmVsKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XHJcbiAgICB2YXIgZm9udFNpemUsXHJcbiAgICAgIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJyxcclxuICAgICAgc2l6ZSA9IG5vZGVbcHJlZml4ICsgJ3NpemUnXTtcclxuXHJcbiAgICBpZiAoc2l6ZSA8IHNldHRpbmdzKCdsYWJlbFRocmVzaG9sZCcpKVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgaWYgKCFub2RlLmxhYmVsIHx8IHR5cGVvZiBub2RlLmxhYmVsICE9PSAnc3RyaW5nJylcclxuICAgICAgcmV0dXJuO1xyXG5cclxuICAgIGZvbnRTaXplID0gKHNldHRpbmdzKCdsYWJlbFNpemUnKSA9PT0gJ2ZpeGVkJykgP1xyXG4gICAgICBzZXR0aW5ncygnZGVmYXVsdExhYmVsU2l6ZScpIDpcclxuICAgIHNldHRpbmdzKCdsYWJlbFNpemVSYXRpbycpICogc2l6ZTtcclxuXHJcbiAgICBjb250ZXh0LmZvbnQgPSAoc2V0dGluZ3MoJ2ZvbnRTdHlsZScpID8gc2V0dGluZ3MoJ2ZvbnRTdHlsZScpICsgJyAnIDogJycpICtcclxuICAgICAgZm9udFNpemUgKyAncHggJyArIHNldHRpbmdzKCdmb250Jyk7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IChzZXR0aW5ncygnbGFiZWxDb2xvcicpID09PSAnbm9kZScpID9cclxuICAgICAgKG5vZGUuY29sb3IgfHwgc2V0dGluZ3MoJ2RlZmF1bHROb2RlQ29sb3InKSkgOlxyXG4gICAgICBzZXR0aW5ncygnZGVmYXVsdExhYmVsQ29sb3InKTtcclxuXHJcbiAgICBjb250ZXh0LnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG4gICAgY29udGV4dC5maWxsVGV4dChcclxuICAgICAgbm9kZS5sYWJlbCxcclxuICAgICAgTWF0aC5yb3VuZChub2RlW3ByZWZpeCArICd4J10pLFxyXG4gICAgICBNYXRoLnJvdW5kKG5vZGVbcHJlZml4ICsgJ3knXSArIGZvbnRTaXplIC8gMylcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBkcmF3QXJyb3coZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncykge1xyXG4gICAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJyxcclxuICAgICAgc2l6ZSA9IGVkZ2VbcHJlZml4ICsgJ3NpemUnXSB8fCAxLFxyXG4gICAgICB0U2l6ZSA9IHRhcmdldFtwcmVmaXggKyAnc2l6ZSddLFxyXG4gICAgICBzWCA9IHNvdXJjZVtwcmVmaXggKyAneCddLFxyXG4gICAgICBzWSA9IHNvdXJjZVtwcmVmaXggKyAneSddLFxyXG4gICAgICB0WCA9IHRhcmdldFtwcmVmaXggKyAneCddLFxyXG4gICAgICB0WSA9IHRhcmdldFtwcmVmaXggKyAneSddLFxyXG4gICAgICBhbmdsZSA9IE1hdGguYXRhbjIodFkgLSBzWSwgdFggLSBzWCksXHJcbiAgICAgIGRpc3QgPSAzO1xyXG4gICAgc1ggKz0gTWF0aC5zaW4oYW5nbGUpICogZGlzdDtcclxuICAgIHRYICs9IE1hdGguc2luKGFuZ2xlKSAqIGRpc3Q7XHJcbiAgICBzWSArPSAtTWF0aC5jb3MoYW5nbGUpICogZGlzdDtcclxuICAgIHRZICs9IC1NYXRoLmNvcyhhbmdsZSkgKiBkaXN0O1xyXG4gICAgdmFyIGFTaXplID0gTWF0aC5tYXgoc2l6ZSAqIDIuNSwgc2V0dGluZ3MoJ21pbkFycm93U2l6ZScpKSxcclxuICAgICAgZCA9IE1hdGguc3FydChNYXRoLnBvdyh0WCAtIHNYLCAyKSArIE1hdGgucG93KHRZIC0gc1ksIDIpKSxcclxuICAgICAgYVggPSBzWCArICh0WCAtIHNYKSAqIChkIC0gYVNpemUgLSB0U2l6ZSkgLyBkLFxyXG4gICAgICBhWSA9IHNZICsgKHRZIC0gc1kpICogKGQgLSBhU2l6ZSAtIHRTaXplKSAvIGQsXHJcbiAgICAgIHZYID0gKHRYIC0gc1gpICogYVNpemUgLyBkLFxyXG4gICAgICB2WSA9ICh0WSAtIHNZKSAqIGFTaXplIC8gZDtcclxuXHJcbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcbiAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHNpemU7XHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgY29udGV4dC5tb3ZlVG8oc1gsIHNZKTtcclxuICAgIGNvbnRleHQubGluZVRvKFxyXG4gICAgICBhWCxcclxuICAgICAgYVlcclxuICAgICk7XHJcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgY29udGV4dC5tb3ZlVG8oYVggKyB2WCwgYVkgKyB2WSk7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhhWCArIHZZICogMC42LCBhWSAtIHZYICogMC42KTtcclxuICAgIGNvbnRleHQubGluZVRvKGFYIC0gdlkgKiAwLjYsIGFZICsgdlggKiAwLjYpO1xyXG4gICAgY29udGV4dC5saW5lVG8oYVggKyB2WCwgYVkgKyB2WSk7XHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgY29udGV4dC5maWxsKCk7XHJcbiAgfVxyXG5cclxuICBkcmF3T25Ib3Zlcihub2RlLCBjb250ZXh0LCBzZXR0aW5ncywgbmV4dCkge1xyXG4gICAgdmFyIHRyYWNlciA9IHRoaXM7XHJcblxyXG4gICAgY29udGV4dC5zZXRMaW5lRGFzaChbNSwgNV0pO1xyXG4gICAgdmFyIG5vZGVJZHggPSBub2RlLmlkLnN1YnN0cmluZygxKTtcclxuICAgIHRoaXMuZ3JhcGguZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChlZGdlKSB7XHJcbiAgICAgIHZhciBlbmRzID0gZWRnZS5pZC5zdWJzdHJpbmcoMSkuc3BsaXQoXCJfXCIpO1xyXG4gICAgICBpZiAoZW5kc1swXSA9PSBub2RlSWR4KSB7XHJcbiAgICAgICAgdmFyIGNvbG9yID0gJyMwZmYnO1xyXG4gICAgICAgIHZhciBzb3VyY2UgPSBub2RlO1xyXG4gICAgICAgIHZhciB0YXJnZXQgPSB0cmFjZXIuZ3JhcGgubm9kZXMoJ24nICsgZW5kc1sxXSk7XHJcbiAgICAgICAgdHJhY2VyLmRyYXdBcnJvdyhlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcclxuICAgICAgICBpZiAobmV4dCkgbmV4dChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcclxuICAgICAgfSBlbHNlIGlmIChlbmRzWzFdID09IG5vZGVJZHgpIHtcclxuICAgICAgICB2YXIgY29sb3IgPSAnI2ZmMCc7XHJcbiAgICAgICAgdmFyIHNvdXJjZSA9IHRyYWNlci5ncmFwaC5ub2RlcygnbicgKyBlbmRzWzBdKTtcclxuICAgICAgICB2YXIgdGFyZ2V0ID0gbm9kZTtcclxuICAgICAgICB0cmFjZXIuZHJhd0Fycm93KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xyXG4gICAgICAgIGlmIChuZXh0KSBuZXh0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGluaXRWaWV3ID0gKHRyYWNlcikgPT4ge1xyXG4gIHRyYWNlci5zID0gdHJhY2VyLmNhcHN1bGUucyA9IG5ldyBzaWdtYSh7XHJcbiAgICByZW5kZXJlcjoge1xyXG4gICAgICBjb250YWluZXI6IHRyYWNlci4kY29udGFpbmVyWzBdLFxyXG4gICAgICB0eXBlOiAnY2FudmFzJ1xyXG4gICAgfSxcclxuICAgIHNldHRpbmdzOiB7XHJcbiAgICAgIG1pbkFycm93U2l6ZTogOCxcclxuICAgICAgZGVmYXVsdEVkZ2VUeXBlOiAnYXJyb3cnLFxyXG4gICAgICBtYXhFZGdlU2l6ZTogMi41LFxyXG4gICAgICBsYWJlbFRocmVzaG9sZDogNCxcclxuICAgICAgZm9udDogJ1JvYm90bycsXHJcbiAgICAgIGRlZmF1bHRMYWJlbENvbG9yOiAnI2ZmZicsXHJcbiAgICAgIHpvb21NaW46IDAuNixcclxuICAgICAgem9vbU1heDogMS4yLFxyXG4gICAgICBza2lwRXJyb3JzOiB0cnVlLFxyXG4gICAgICBtaW5Ob2RlU2l6ZTogLjUsXHJcbiAgICAgIG1heE5vZGVTaXplOiAxMixcclxuICAgICAgbGFiZWxTaXplOiAncHJvcG9ydGlvbmFsJyxcclxuICAgICAgbGFiZWxTaXplUmF0aW86IDEuMyxcclxuICAgICAgZnVuY0xhYmVsc0RlZihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xyXG4gICAgICAgIHRyYWNlci5kcmF3TGFiZWwobm9kZSwgY29udGV4dCwgc2V0dGluZ3MpO1xyXG4gICAgICB9LFxyXG4gICAgICBmdW5jSG92ZXJzRGVmKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzLCBuZXh0KSB7XHJcbiAgICAgICAgdHJhY2VyLmRyYXdPbkhvdmVyKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzLCBuZXh0KTtcclxuICAgICAgfSxcclxuICAgICAgZnVuY0VkZ2VzQXJyb3coZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbnRleHQsIHNldHRpbmdzKSB7XHJcbiAgICAgICAgdmFyIGNvbG9yID0gdHJhY2VyLmdldENvbG9yKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBzZXR0aW5ncyk7XHJcbiAgICAgICAgdHJhY2VyLmRyYXdBcnJvdyhlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHNpZ21hLnBsdWdpbnMuZHJhZ05vZGVzKHRyYWNlci5zLCB0cmFjZXIucy5yZW5kZXJlcnNbMF0pO1xyXG4gIHRyYWNlci5ncmFwaCA9IHRyYWNlci5jYXBzdWxlLmdyYXBoID0gdHJhY2VyLnMuZ3JhcGg7XHJcbn07XHJcblxyXG5zaWdtYS5jYW52YXMubGFiZWxzLmRlZiA9IGZ1bmN0aW9uIChub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xyXG4gIHZhciBmdW5jID0gc2V0dGluZ3MoJ2Z1bmNMYWJlbHNEZWYnKTtcclxuICBpZiAoZnVuYykge1xyXG4gICAgZnVuYyhub2RlLCBjb250ZXh0LCBzZXR0aW5ncyk7XHJcbiAgfVxyXG59O1xyXG5zaWdtYS5jYW52YXMuaG92ZXJzLmRlZiA9IGZ1bmN0aW9uIChub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xyXG4gIHZhciBmdW5jID0gc2V0dGluZ3MoJ2Z1bmNIb3ZlcnNEZWYnKTtcclxuICBpZiAoZnVuYykge1xyXG4gICAgZnVuYyhub2RlLCBjb250ZXh0LCBzZXR0aW5ncyk7XHJcbiAgfVxyXG59O1xyXG5zaWdtYS5jYW52YXMuZWRnZXMuZGVmID0gZnVuY3Rpb24gKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xyXG4gIHZhciBmdW5jID0gc2V0dGluZ3MoJ2Z1bmNFZGdlc0RlZicpO1xyXG4gIGlmIChmdW5jKSB7XHJcbiAgICBmdW5jKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncyk7XHJcbiAgfVxyXG59O1xyXG5zaWdtYS5jYW52YXMuZWRnZXMuYXJyb3cgPSBmdW5jdGlvbiAoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbnRleHQsIHNldHRpbmdzKSB7XHJcbiAgdmFyIGZ1bmMgPSBzZXR0aW5ncygnZnVuY0VkZ2VzQXJyb3cnKTtcclxuICBpZiAoZnVuYykge1xyXG4gICAgZnVuYyhlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0ZWRHcmFwaFRyYWNlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgVHJhY2VyID0gcmVxdWlyZSgnLi90cmFjZXInKTtcclxuY29uc3QgTG9nVHJhY2VyID0gcmVxdWlyZSgnLi9sb2cnKTtcclxuY29uc3QgQXJyYXkxRFRyYWNlciA9IHJlcXVpcmUoJy4vYXJyYXkxZCcpO1xyXG5jb25zdCBBcnJheTJEVHJhY2VyID0gcmVxdWlyZSgnLi9hcnJheTJkJyk7XHJcbmNvbnN0IENoYXJ0VHJhY2VyID0gcmVxdWlyZSgnLi9jaGFydCcpO1xyXG5jb25zdCBDb29yZGluYXRlU3lzdGVtVHJhY2VyID0gcmVxdWlyZSgnLi9jb29yZGluYXRlX3N5c3RlbScpO1xyXG5jb25zdCBEaXJlY3RlZEdyYXBoVHJhY2VyID0gcmVxdWlyZSgnLi9kaXJlY3RlZF9ncmFwaCcpO1xyXG5jb25zdCBVbmRpcmVjdGVkR3JhcGhUcmFjZXIgPSByZXF1aXJlKCcuL3VuZGlyZWN0ZWRfZ3JhcGgnKTtcclxuY29uc3QgV2VpZ2h0ZWREaXJlY3RlZEdyYXBoVHJhY2VyID0gcmVxdWlyZSgnLi93ZWlnaHRlZF9kaXJlY3RlZF9ncmFwaCcpO1xyXG5jb25zdCBXZWlnaHRlZFVuZGlyZWN0ZWRHcmFwaFRyYWNlciA9IHJlcXVpcmUoJy4vd2VpZ2h0ZWRfdW5kaXJlY3RlZF9ncmFwaCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgVHJhY2VyLFxyXG4gIExvZ1RyYWNlcixcclxuICBBcnJheTFEVHJhY2VyLFxyXG4gIEFycmF5MkRUcmFjZXIsXHJcbiAgQ2hhcnRUcmFjZXIsXHJcbiAgQ29vcmRpbmF0ZVN5c3RlbVRyYWNlcixcclxuICBEaXJlY3RlZEdyYXBoVHJhY2VyLFxyXG4gIFVuZGlyZWN0ZWRHcmFwaFRyYWNlcixcclxuICBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIsXHJcbiAgV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGhUcmFjZXJcclxufTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBUcmFjZXIgPSByZXF1aXJlKCcuL3RyYWNlcicpO1xyXG5cclxuY2xhc3MgTG9nVHJhY2VyIGV4dGVuZHMgVHJhY2VyIHtcclxuICBzdGF0aWMgZ2V0Q2xhc3NOYW1lKCkge1xyXG4gICAgcmV0dXJuICdMb2dUcmFjZXInO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgc3VwZXIobmFtZSk7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNOZXcpIGluaXRWaWV3KHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgX3ByaW50KG1zZykge1xyXG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xyXG4gICAgICB0eXBlOiAncHJpbnQnLFxyXG4gICAgICBtc2c6IG1zZ1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHByb2Nlc3NTdGVwKHN0ZXAsIG9wdGlvbnMpIHtcclxuICAgIHN3aXRjaCAoc3RlcC50eXBlKSB7XHJcbiAgICAgIGNhc2UgJ3ByaW50JzpcclxuICAgICAgICB0aGlzLnByaW50KHN0ZXAubXNnKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlZnJlc2goKSB7XHJcbiAgICB0aGlzLnNjcm9sbFRvRW5kKE1hdGgubWluKDUwLCB0aGlzLmludGVydmFsKSk7XHJcbiAgfVxyXG5cclxuICBjbGVhcigpIHtcclxuICAgIHN1cGVyLmNsZWFyKCk7XHJcblxyXG4gICAgdGhpcy4kd3JhcHBlci5lbXB0eSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpbnQobWVzc2FnZSkge1xyXG4gICAgdGhpcy4kd3JhcHBlci5hcHBlbmQoJCgnPHNwYW4+JykuYXBwZW5kKG1lc3NhZ2UgKyAnPGJyLz4nKSk7XHJcbiAgfVxyXG5cclxuICBzY3JvbGxUb0VuZChkdXJhdGlvbikge1xyXG4gICAgdGhpcy4kY29udGFpbmVyLmFuaW1hdGUoe1xyXG4gICAgICBzY3JvbGxUb3A6IHRoaXMuJGNvbnRhaW5lclswXS5zY3JvbGxIZWlnaHRcclxuICAgIH0sIGR1cmF0aW9uKTtcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGluaXRWaWV3ID0gKHRyYWNlcikgPT4ge1xyXG4gIHRyYWNlci4kd3JhcHBlciA9IHRyYWNlci5jYXBzdWxlLiR3cmFwcGVyID0gJCgnPGRpdiBjbGFzcz1cIndyYXBwZXJcIj4nKTtcclxuICB0cmFjZXIuJGNvbnRhaW5lci5hcHBlbmQodHJhY2VyLiR3cmFwcGVyKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTG9nVHJhY2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBhcHAgPSByZXF1aXJlKCcuLi8uLi9hcHAnKTtcclxuXHJcbmNvbnN0IHtcclxuICB0b0pTT04sXHJcbiAgZnJvbUpTT05cclxufSA9IHJlcXVpcmUoJy4uLy4uL3RyYWNlcl9tYW5hZ2VyL3V0aWwvaW5kZXgnKTtcclxuXHJcbmNsYXNzIFRyYWNlciB7XHJcbiAgc3RhdGljIGdldENsYXNzTmFtZSgpIHtcclxuICAgIHJldHVybiAnVHJhY2VyJztcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgIHRoaXMubW9kdWxlID0gdGhpcy5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICB0aGlzLm1hbmFnZXIgPSBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpO1xyXG4gICAgdGhpcy5jYXBzdWxlID0gdGhpcy5tYW5hZ2VyLmFsbG9jYXRlKHRoaXMpO1xyXG4gICAgJC5leHRlbmQodGhpcywgdGhpcy5jYXBzdWxlKTtcclxuXHJcbiAgICB0aGlzLnNldE5hbWUobmFtZSk7XHJcbiAgfVxyXG5cclxuICBfc2V0RGF0YSguLi5hcmdzKSB7XHJcbiAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XHJcbiAgICAgIHR5cGU6ICdzZXREYXRhJyxcclxuICAgICAgYXJnczogdG9KU09OKGFyZ3MpXHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgX2NsZWFyKCkge1xyXG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xyXG4gICAgICB0eXBlOiAnY2xlYXInXHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgX3dhaXQobGluZSkge1xyXG4gICAgdGhpcy5tYW5hZ2VyLm5ld1N0ZXAobGluZSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHByb2Nlc3NTdGVwKHN0ZXAsIG9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgdHlwZSxcclxuICAgICAgYXJnc1xyXG4gICAgfSA9IHN0ZXA7XHJcblxyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgIGNhc2UgJ3NldERhdGEnOlxyXG4gICAgICAgIHRoaXMuc2V0RGF0YSguLi5mcm9tSlNPTihhcmdzKSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2NsZWFyJzpcclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXROYW1lKG5hbWUpIHtcclxuICAgIGxldCAkbmFtZTtcclxuICAgIGlmICh0aGlzLmlzTmV3KSB7XHJcbiAgICAgICRuYW1lID0gJCgnPHNwYW4gY2xhc3M9XCJuYW1lXCI+Jyk7XHJcbiAgICAgIHRoaXMuJGNvbnRhaW5lci5hcHBlbmQoJG5hbWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJG5hbWUgPSB0aGlzLiRjb250YWluZXIuZmluZCgnc3Bhbi5uYW1lJyk7XHJcbiAgICB9XHJcbiAgICAkbmFtZS50ZXh0KG5hbWUgfHwgdGhpcy5kZWZhdWx0TmFtZSk7XHJcbiAgfVxyXG5cclxuICBzZXREYXRhKCkge1xyXG4gICAgY29uc3QgZGF0YSA9IHRvSlNPTihhcmd1bWVudHMpO1xyXG4gICAgaWYgKCF0aGlzLmlzTmV3ICYmIHRoaXMubGFzdERhdGEgPT09IGRhdGEpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICB0aGlzLmxhc3REYXRhID0gdGhpcy5jYXBzdWxlLmxhc3REYXRhID0gZGF0YTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJlc2l6ZSgpIHtcclxuICB9XHJcblxyXG4gIHJlZnJlc2goKSB7XHJcbiAgfVxyXG5cclxuICBjbGVhcigpIHtcclxuICB9XHJcblxyXG4gIGF0dGFjaCh0cmFjZXIpIHtcclxuICAgIHN3aXRjaCAodHJhY2VyLm1vZHVsZSkge1xyXG4gICAgICBjYXNlIExvZ1RyYWNlcjpcclxuICAgICAgICB0aGlzLmxvZ1RyYWNlciA9IHRyYWNlcjtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBDaGFydFRyYWNlcjpcclxuICAgICAgICB0aGlzLmNoYXJ0VHJhY2VyID0gdHJhY2VyO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBtb3VzZWRvd24oZSkge1xyXG4gIH1cclxuXHJcbiAgbW91c2Vtb3ZlKGUpIHtcclxuICB9XHJcblxyXG4gIG1vdXNldXAoZSkge1xyXG4gIH1cclxuXHJcbiAgbW91c2V3aGVlbChlKSB7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgRGlyZWN0ZWRHcmFwaFRyYWNlciA9IHJlcXVpcmUoJy4vZGlyZWN0ZWRfZ3JhcGgnKTtcclxuXHJcbmNsYXNzIFVuZGlyZWN0ZWRHcmFwaFRyYWNlciBleHRlbmRzIERpcmVjdGVkR3JhcGhUcmFjZXIge1xyXG4gIHN0YXRpYyBnZXRDbGFzc05hbWUoKSB7XHJcbiAgICByZXR1cm4gJ1VuZGlyZWN0ZWRHcmFwaFRyYWNlcic7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICBzdXBlcihuYW1lKTtcclxuXHJcbiAgICBpZiAodGhpcy5pc05ldykgaW5pdFZpZXcodGhpcyk7XHJcbiAgfVxyXG5cclxuICBzZXRUcmVlRGF0YShHLCByb290KSB7XHJcbiAgICByZXR1cm4gc3VwZXIuc2V0VHJlZURhdGEoRywgcm9vdCwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBzZXREYXRhKEcpIHtcclxuICAgIHJldHVybiBzdXBlci5zZXREYXRhKEcsIHRydWUpO1xyXG4gIH1cclxuXHJcbiAgZSh2MSwgdjIpIHtcclxuICAgIGlmICh2MSA+IHYyKSB7XHJcbiAgICAgIHZhciB0ZW1wID0gdjE7XHJcbiAgICAgIHYxID0gdjI7XHJcbiAgICAgIHYyID0gdGVtcDtcclxuICAgIH1cclxuICAgIHJldHVybiAnZScgKyB2MSArICdfJyArIHYyO1xyXG4gIH1cclxuXHJcbiAgZHJhd09uSG92ZXIobm9kZSwgY29udGV4dCwgc2V0dGluZ3MsIG5leHQpIHtcclxuICAgIHZhciB0cmFjZXIgPSB0aGlzO1xyXG5cclxuICAgIGNvbnRleHQuc2V0TGluZURhc2goWzUsIDVdKTtcclxuICAgIHZhciBub2RlSWR4ID0gbm9kZS5pZC5zdWJzdHJpbmcoMSk7XHJcbiAgICB0aGlzLmdyYXBoLmVkZ2VzKCkuZm9yRWFjaChmdW5jdGlvbiAoZWRnZSkge1xyXG4gICAgICB2YXIgZW5kcyA9IGVkZ2UuaWQuc3Vic3RyaW5nKDEpLnNwbGl0KFwiX1wiKTtcclxuICAgICAgaWYgKGVuZHNbMF0gPT0gbm9kZUlkeCkge1xyXG4gICAgICAgIHZhciBjb2xvciA9ICcjMGZmJztcclxuICAgICAgICB2YXIgc291cmNlID0gbm9kZTtcclxuICAgICAgICB2YXIgdGFyZ2V0ID0gdHJhY2VyLmdyYXBoLm5vZGVzKCduJyArIGVuZHNbMV0pO1xyXG4gICAgICAgIHRyYWNlci5kcmF3RWRnZShlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcclxuICAgICAgICBpZiAobmV4dCkgbmV4dChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcclxuICAgICAgfSBlbHNlIGlmIChlbmRzWzFdID09IG5vZGVJZHgpIHtcclxuICAgICAgICB2YXIgY29sb3IgPSAnIzBmZic7XHJcbiAgICAgICAgdmFyIHNvdXJjZSA9IHRyYWNlci5ncmFwaC5ub2RlcygnbicgKyBlbmRzWzBdKTtcclxuICAgICAgICB2YXIgdGFyZ2V0ID0gbm9kZTtcclxuICAgICAgICB0cmFjZXIuZHJhd0VkZ2UoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XHJcbiAgICAgICAgaWYgKG5leHQpIG5leHQoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZHJhd0VkZ2UoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncykge1xyXG4gICAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJyxcclxuICAgICAgc2l6ZSA9IGVkZ2VbcHJlZml4ICsgJ3NpemUnXSB8fCAxO1xyXG5cclxuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBjb2xvcjtcclxuICAgIGNvbnRleHQubGluZVdpZHRoID0gc2l6ZTtcclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICBjb250ZXh0Lm1vdmVUbyhcclxuICAgICAgc291cmNlW3ByZWZpeCArICd4J10sXHJcbiAgICAgIHNvdXJjZVtwcmVmaXggKyAneSddXHJcbiAgICApO1xyXG4gICAgY29udGV4dC5saW5lVG8oXHJcbiAgICAgIHRhcmdldFtwcmVmaXggKyAneCddLFxyXG4gICAgICB0YXJnZXRbcHJlZml4ICsgJ3knXVxyXG4gICAgKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBpbml0VmlldyA9ICh0cmFjZXIpID0+IHtcclxuICB0cmFjZXIucy5zZXR0aW5ncyh7XHJcbiAgICBkZWZhdWx0RWRnZVR5cGU6ICdkZWYnLFxyXG4gICAgZnVuY0VkZ2VzRGVmKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xyXG4gICAgICB2YXIgY29sb3IgPSB0cmFjZXIuZ2V0Q29sb3IoZWRnZSwgc291cmNlLCB0YXJnZXQsIHNldHRpbmdzKTtcclxuICAgICAgdHJhY2VyLmRyYXdFZGdlKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVbmRpcmVjdGVkR3JhcGhUcmFjZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IERpcmVjdGVkR3JhcGhUcmFjZXIgPSByZXF1aXJlKCcuL2RpcmVjdGVkX2dyYXBoJyk7XHJcblxyXG5jb25zdCB7XHJcbiAgcmVmaW5lQnlUeXBlXHJcbn0gPSByZXF1aXJlKCcuLi8uLi90cmFjZXJfbWFuYWdlci91dGlsL2luZGV4Jyk7XHJcblxyXG5jbGFzcyBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIgZXh0ZW5kcyBEaXJlY3RlZEdyYXBoVHJhY2VyIHtcclxuICBzdGF0aWMgZ2V0Q2xhc3NOYW1lKCkge1xyXG4gICAgcmV0dXJuICdXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXInO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgc3VwZXIobmFtZSk7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNOZXcpIGluaXRWaWV3KHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgX3dlaWdodCh0YXJnZXQsIHdlaWdodCkge1xyXG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xyXG4gICAgICB0eXBlOiAnd2VpZ2h0JyxcclxuICAgICAgdGFyZ2V0OiB0YXJnZXQsXHJcbiAgICAgIHdlaWdodDogd2VpZ2h0XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgX3Zpc2l0KHRhcmdldCwgc291cmNlLCB3ZWlnaHQpIHtcclxuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcclxuICAgICAgdHlwZTogJ3Zpc2l0JyxcclxuICAgICAgdGFyZ2V0OiB0YXJnZXQsXHJcbiAgICAgIHNvdXJjZTogc291cmNlLFxyXG4gICAgICB3ZWlnaHQ6IHdlaWdodFxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIF9sZWF2ZSh0YXJnZXQsIHNvdXJjZSwgd2VpZ2h0KSB7XHJcbiAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XHJcbiAgICAgIHR5cGU6ICdsZWF2ZScsXHJcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxyXG4gICAgICBzb3VyY2U6IHNvdXJjZSxcclxuICAgICAgd2VpZ2h0OiB3ZWlnaHRcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBwcm9jZXNzU3RlcChzdGVwLCBvcHRpb25zKSB7XHJcbiAgICBzd2l0Y2ggKHN0ZXAudHlwZSkge1xyXG4gICAgICBjYXNlICd3ZWlnaHQnOlxyXG4gICAgICAgIHZhciB0YXJnZXROb2RlID0gdGhpcy5ncmFwaC5ub2Rlcyh0aGlzLm4oc3RlcC50YXJnZXQpKTtcclxuICAgICAgICBpZiAoc3RlcC53ZWlnaHQgIT09IHVuZGVmaW5lZCkgdGFyZ2V0Tm9kZS53ZWlnaHQgPSByZWZpbmVCeVR5cGUoc3RlcC53ZWlnaHQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICd2aXNpdCc6XHJcbiAgICAgIGNhc2UgJ2xlYXZlJzpcclxuICAgICAgICB2YXIgdmlzaXQgPSBzdGVwLnR5cGUgPT0gJ3Zpc2l0JztcclxuICAgICAgICB2YXIgdGFyZ2V0Tm9kZSA9IHRoaXMuZ3JhcGgubm9kZXModGhpcy5uKHN0ZXAudGFyZ2V0KSk7XHJcbiAgICAgICAgdmFyIGNvbG9yID0gdmlzaXQgPyBzdGVwLndlaWdodCA9PT0gdW5kZWZpbmVkID8gdGhpcy5jb2xvci5zZWxlY3RlZCA6IHRoaXMuY29sb3IudmlzaXRlZCA6IHRoaXMuY29sb3IubGVmdDtcclxuICAgICAgICB0YXJnZXROb2RlLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgaWYgKHN0ZXAud2VpZ2h0ICE9PSB1bmRlZmluZWQpIHRhcmdldE5vZGUud2VpZ2h0ID0gcmVmaW5lQnlUeXBlKHN0ZXAud2VpZ2h0KTtcclxuICAgICAgICBpZiAoc3RlcC5zb3VyY2UgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgdmFyIGVkZ2VJZCA9IHRoaXMuZShzdGVwLnNvdXJjZSwgc3RlcC50YXJnZXQpO1xyXG4gICAgICAgICAgdmFyIGVkZ2UgPSB0aGlzLmdyYXBoLmVkZ2VzKGVkZ2VJZCk7XHJcbiAgICAgICAgICBlZGdlLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICB0aGlzLmdyYXBoLmRyb3BFZGdlKGVkZ2VJZCkuYWRkRWRnZShlZGdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubG9nVHJhY2VyKSB7XHJcbiAgICAgICAgICB2YXIgc291cmNlID0gc3RlcC5zb3VyY2U7XHJcbiAgICAgICAgICBpZiAoc291cmNlID09PSB1bmRlZmluZWQpIHNvdXJjZSA9ICcnO1xyXG4gICAgICAgICAgdGhpcy5sb2dUcmFjZXIucHJpbnQodmlzaXQgPyBzb3VyY2UgKyAnIC0+ICcgKyBzdGVwLnRhcmdldCA6IHNvdXJjZSArICcgPC0gJyArIHN0ZXAudGFyZ2V0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgc3VwZXIucHJvY2Vzc1N0ZXAoc3RlcCwgb3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjbGVhcigpIHtcclxuICAgIHN1cGVyLmNsZWFyKCk7XHJcblxyXG4gICAgdGhpcy5jbGVhcldlaWdodHMoKTtcclxuICB9XHJcblxyXG4gIGNsZWFyV2VpZ2h0cygpIHtcclxuICAgIHRoaXMuZ3JhcGgubm9kZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAgIG5vZGUud2VpZ2h0ID0gMDtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZHJhd0VkZ2VXZWlnaHQoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncykge1xyXG4gICAgaWYgKHNvdXJjZSA9PSB0YXJnZXQpXHJcbiAgICAgIHJldHVybjtcclxuXHJcbiAgICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnLFxyXG4gICAgICBzaXplID0gZWRnZVtwcmVmaXggKyAnc2l6ZSddIHx8IDE7XHJcblxyXG4gICAgaWYgKHNpemUgPCBzZXR0aW5ncygnZWRnZUxhYmVsVGhyZXNob2xkJykpXHJcbiAgICAgIHJldHVybjtcclxuXHJcbiAgICBpZiAoMCA9PT0gc2V0dGluZ3MoJ2VkZ2VMYWJlbFNpemVQb3dSYXRpbycpKVxyXG4gICAgICB0aHJvdyAnXCJlZGdlTGFiZWxTaXplUG93UmF0aW9cIiBtdXN0IG5vdCBiZSAwLic7XHJcblxyXG4gICAgdmFyIGZvbnRTaXplLFxyXG4gICAgICB4ID0gKHNvdXJjZVtwcmVmaXggKyAneCddICsgdGFyZ2V0W3ByZWZpeCArICd4J10pIC8gMixcclxuICAgICAgeSA9IChzb3VyY2VbcHJlZml4ICsgJ3knXSArIHRhcmdldFtwcmVmaXggKyAneSddKSAvIDIsXHJcbiAgICAgIGRYID0gdGFyZ2V0W3ByZWZpeCArICd4J10gLSBzb3VyY2VbcHJlZml4ICsgJ3gnXSxcclxuICAgICAgZFkgPSB0YXJnZXRbcHJlZml4ICsgJ3knXSAtIHNvdXJjZVtwcmVmaXggKyAneSddLFxyXG4gICAgICBhbmdsZSA9IE1hdGguYXRhbjIoZFksIGRYKTtcclxuXHJcbiAgICBmb250U2l6ZSA9IChzZXR0aW5ncygnZWRnZUxhYmVsU2l6ZScpID09PSAnZml4ZWQnKSA/XHJcbiAgICAgIHNldHRpbmdzKCdkZWZhdWx0RWRnZUxhYmVsU2l6ZScpIDpcclxuICAgIHNldHRpbmdzKCdkZWZhdWx0RWRnZUxhYmVsU2l6ZScpICpcclxuICAgIHNpemUgKlxyXG4gICAgTWF0aC5wb3coc2l6ZSwgLTEgLyBzZXR0aW5ncygnZWRnZUxhYmVsU2l6ZVBvd1JhdGlvJykpO1xyXG5cclxuICAgIGNvbnRleHQuc2F2ZSgpO1xyXG5cclxuICAgIGlmIChlZGdlLmFjdGl2ZSkge1xyXG4gICAgICBjb250ZXh0LmZvbnQgPSBbXHJcbiAgICAgICAgc2V0dGluZ3MoJ2FjdGl2ZUZvbnRTdHlsZScpLFxyXG4gICAgICAgIGZvbnRTaXplICsgJ3B4JyxcclxuICAgICAgICBzZXR0aW5ncygnYWN0aXZlRm9udCcpIHx8IHNldHRpbmdzKCdmb250JylcclxuICAgICAgXS5qb2luKCcgJyk7XHJcblxyXG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29udGV4dC5mb250ID0gW1xyXG4gICAgICAgIHNldHRpbmdzKCdmb250U3R5bGUnKSxcclxuICAgICAgICBmb250U2l6ZSArICdweCcsXHJcbiAgICAgICAgc2V0dGluZ3MoJ2ZvbnQnKVxyXG4gICAgICBdLmpvaW4oJyAnKTtcclxuXHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICAgIGNvbnRleHQudGV4dEJhc2VsaW5lID0gJ2FscGhhYmV0aWMnO1xyXG5cclxuICAgIGNvbnRleHQudHJhbnNsYXRlKHgsIHkpO1xyXG4gICAgY29udGV4dC5yb3RhdGUoYW5nbGUpO1xyXG4gICAgY29udGV4dC5maWxsVGV4dChcclxuICAgICAgZWRnZS53ZWlnaHQsXHJcbiAgICAgIDAsXHJcbiAgICAgICgtc2l6ZSAvIDIpIC0gM1xyXG4gICAgKTtcclxuXHJcbiAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxuICB9XHJcblxyXG4gIGRyYXdOb2RlV2VpZ2h0KG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XHJcbiAgICB2YXIgZm9udFNpemUsXHJcbiAgICAgIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJyxcclxuICAgICAgc2l6ZSA9IG5vZGVbcHJlZml4ICsgJ3NpemUnXTtcclxuXHJcbiAgICBpZiAoc2l6ZSA8IHNldHRpbmdzKCdsYWJlbFRocmVzaG9sZCcpKVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgZm9udFNpemUgPSAoc2V0dGluZ3MoJ2xhYmVsU2l6ZScpID09PSAnZml4ZWQnKSA/XHJcbiAgICAgIHNldHRpbmdzKCdkZWZhdWx0TGFiZWxTaXplJykgOlxyXG4gICAgc2V0dGluZ3MoJ2xhYmVsU2l6ZVJhdGlvJykgKiBzaXplO1xyXG5cclxuICAgIGNvbnRleHQuZm9udCA9IChzZXR0aW5ncygnZm9udFN0eWxlJykgPyBzZXR0aW5ncygnZm9udFN0eWxlJykgKyAnICcgOiAnJykgK1xyXG4gICAgICBmb250U2l6ZSArICdweCAnICsgc2V0dGluZ3MoJ2ZvbnQnKTtcclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gKHNldHRpbmdzKCdsYWJlbENvbG9yJykgPT09ICdub2RlJykgP1xyXG4gICAgICAobm9kZS5jb2xvciB8fCBzZXR0aW5ncygnZGVmYXVsdE5vZGVDb2xvcicpKSA6XHJcbiAgICAgIHNldHRpbmdzKCdkZWZhdWx0TGFiZWxDb2xvcicpO1xyXG5cclxuICAgIGNvbnRleHQudGV4dEFsaWduID0gJ2xlZnQnO1xyXG4gICAgY29udGV4dC5maWxsVGV4dChcclxuICAgICAgbm9kZS53ZWlnaHQsXHJcbiAgICAgIE1hdGgucm91bmQobm9kZVtwcmVmaXggKyAneCddICsgc2l6ZSAqIDEuNSksXHJcbiAgICAgIE1hdGgucm91bmQobm9kZVtwcmVmaXggKyAneSddICsgZm9udFNpemUgLyAzKVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGluaXRWaWV3ID0gKHRyYWNlcikgPT4ge1xyXG4gIHRyYWNlci5zLnNldHRpbmdzKHtcclxuICAgIGVkZ2VMYWJlbFNpemU6ICdwcm9wb3J0aW9uYWwnLFxyXG4gICAgZGVmYXVsdEVkZ2VMYWJlbFNpemU6IDIwLFxyXG4gICAgZWRnZUxhYmVsU2l6ZVBvd1JhdGlvOiAwLjgsXHJcbiAgICBmdW5jTGFiZWxzRGVmKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XHJcbiAgICAgIHRyYWNlci5kcmF3Tm9kZVdlaWdodChub2RlLCBjb250ZXh0LCBzZXR0aW5ncyk7XHJcbiAgICAgIHRyYWNlci5kcmF3TGFiZWwobm9kZSwgY29udGV4dCwgc2V0dGluZ3MpO1xyXG4gICAgfSxcclxuICAgIGZ1bmNIb3ZlcnNEZWYobm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcclxuICAgICAgdHJhY2VyLmRyYXdPbkhvdmVyKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzLCB0cmFjZXIuZHJhd0VkZ2VXZWlnaHQpO1xyXG4gICAgfSxcclxuICAgIGZ1bmNFZGdlc0Fycm93KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xyXG4gICAgICB2YXIgY29sb3IgPSB0cmFjZXIuZ2V0Q29sb3IoZWRnZSwgc291cmNlLCB0YXJnZXQsIHNldHRpbmdzKTtcclxuICAgICAgdHJhY2VyLmRyYXdBcnJvdyhlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcclxuICAgICAgdHJhY2VyLmRyYXdFZGdlV2VpZ2h0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlciA9IHJlcXVpcmUoJy4vd2VpZ2h0ZWRfZGlyZWN0ZWRfZ3JhcGgnKTtcclxuY29uc3QgVW5kaXJlY3RlZEdyYXBoVHJhY2VyID0gcmVxdWlyZSgnLi91bmRpcmVjdGVkX2dyYXBoJyk7XHJcblxyXG5jbGFzcyBXZWlnaHRlZFVuZGlyZWN0ZWRHcmFwaFRyYWNlciBleHRlbmRzIFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlciB7XHJcbiAgc3RhdGljIGdldENsYXNzTmFtZSgpIHtcclxuICAgIHJldHVybiAnV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGhUcmFjZXInO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgc3VwZXIobmFtZSk7XHJcblxyXG4gICAgdGhpcy5lID0gVW5kaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5lO1xyXG4gICAgdGhpcy5kcmF3T25Ib3ZlciA9IFVuZGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUuZHJhd09uSG92ZXI7XHJcbiAgICB0aGlzLmRyYXdFZGdlID0gVW5kaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5kcmF3RWRnZTtcclxuXHJcbiAgICBpZiAodGhpcy5pc05ldykgaW5pdFZpZXcodGhpcyk7XHJcbiAgfVxyXG5cclxuICBzZXRUcmVlRGF0YShHLCByb290KSB7XHJcbiAgICByZXR1cm4gc3VwZXIuc2V0VHJlZURhdGEoRywgcm9vdCwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBzZXREYXRhKEcpIHtcclxuICAgIHJldHVybiBzdXBlci5zZXREYXRhKEcsIHRydWUpO1xyXG4gIH1cclxuXHJcbiAgZHJhd0VkZ2VXZWlnaHQoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncykge1xyXG4gICAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJztcclxuICAgIGlmIChzb3VyY2VbcHJlZml4ICsgJ3gnXSA+IHRhcmdldFtwcmVmaXggKyAneCddKSB7XHJcbiAgICAgIHZhciB0ZW1wID0gc291cmNlO1xyXG4gICAgICBzb3VyY2UgPSB0YXJnZXQ7XHJcbiAgICAgIHRhcmdldCA9IHRlbXA7XHJcbiAgICB9XHJcbiAgICBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLmRyYXdFZGdlV2VpZ2h0LmNhbGwodGhpcywgZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBpbml0VmlldyA9ICh0cmFjZXIpID0+IHtcclxuICB0cmFjZXIucy5zZXR0aW5ncyh7XHJcbiAgICBkZWZhdWx0RWRnZVR5cGU6ICdkZWYnLFxyXG4gICAgZnVuY0VkZ2VzRGVmKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xyXG4gICAgICB2YXIgY29sb3IgPSB0cmFjZXIuZ2V0Q29sb3IoZWRnZSwgc291cmNlLCB0YXJnZXQsIHNldHRpbmdzKTtcclxuICAgICAgdHJhY2VyLmRyYXdFZGdlKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xyXG4gICAgICB0cmFjZXIuZHJhd0VkZ2VXZWlnaHQoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgnLi9yZXF1ZXN0Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9ICh1cmwpID0+IHtcclxuICByZXR1cm4gcmVxdWVzdCh1cmwsIHtcclxuICAgIHR5cGU6ICdHRVQnXHJcbiAgfSk7XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cmwpIHtcclxuICByZXR1cm4gcmVxdWVzdCh1cmwsIHtcclxuICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICB0eXBlOiAnR0VUJ1xyXG4gIH0pO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCcuL3JlcXVlc3QnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsLCBkYXRhKSB7XHJcbiAgcmV0dXJuIHJlcXVlc3QodXJsLCB7XHJcbiAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXHJcbiAgfSk7XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgUlNWUCA9IHJlcXVpcmUoJ3JzdnAnKTtcclxuY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XHJcblxyXG5jb25zdCB7XHJcbiAgYWpheCxcclxuICBleHRlbmRcclxufSA9ICQ7XHJcblxyXG5jb25zdCBkZWZhdWx0cyA9IHtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgYXBwLnNldElzTG9hZGluZyh0cnVlKTtcclxuXHJcbiAgcmV0dXJuIG5ldyBSU1ZQLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgY29uc3QgY2FsbGJhY2tzID0ge1xyXG4gICAgICBzdWNjZXNzKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgYXBwLnNldElzTG9hZGluZyhmYWxzZSk7XHJcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yKHJlYXNvbikge1xyXG4gICAgICAgIGFwcC5zZXRJc0xvYWRpbmcoZmFsc2UpO1xyXG4gICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG9wdHMgPSBleHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zLCBjYWxsYmFja3MsIHtcclxuICAgICAgdXJsXHJcbiAgICB9KTtcclxuXHJcbiAgICBhamF4KG9wdHMpO1xyXG4gIH0pO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xyXG5jb25zdCBUb2FzdCA9IHJlcXVpcmUoJy4uL2RvbS90b2FzdCcpO1xyXG5cclxuY29uc3QgY2hlY2tMb2FkaW5nID0gKCkgPT4ge1xyXG4gIGlmIChhcHAuZ2V0SXNMb2FkaW5nKCkpIHtcclxuICAgIFRvYXN0LnNob3dFcnJvclRvYXN0KCdXYWl0IHVudGlsIGl0IGNvbXBsZXRlcyBsb2FkaW5nIG9mIHByZXZpb3VzIGZpbGUuJyk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0UGFyYW1ldGVyQnlOYW1lID0gKG5hbWUpID0+IHtcclxuICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYFs/Jl0ke25hbWV9KD0oW14mI10qKXwmfCN8JClgKTtcclxuXHJcbiAgY29uc3QgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcclxuXHJcbiAgaWYgKCFyZXN1bHRzIHx8IHJlc3VsdHMubGVuZ3RoICE9PSAzKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIGNvbnN0IFssICwgaWRdID0gcmVzdWx0cztcclxuXHJcbiAgcmV0dXJuIGlkO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0SGFzaFZhbHVlID0gKGtleSk9PiB7XHJcbiAgaWYgKCFrZXkpIHJldHVybiBudWxsO1xyXG4gIGNvbnN0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoMSk7XHJcbiAgY29uc3QgcGFyYW1zID0gaGFzaCA/IGhhc2guc3BsaXQoJyYnKSA6IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyYW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBwYWlyID0gcGFyYW1zW2ldLnNwbGl0KCc9Jyk7XHJcbiAgICBpZiAocGFpclswXSA9PT0ga2V5KSB7XHJcbiAgICAgIHJldHVybiBwYWlyWzFdO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbmNvbnN0IHNldEhhc2hWYWx1ZSA9IChrZXksIHZhbHVlKT0+IHtcclxuICBpZiAoIWtleSB8fCAhdmFsdWUpIHJldHVybjtcclxuICBjb25zdCBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpO1xyXG4gIGNvbnN0IHBhcmFtcyA9IGhhc2ggPyBoYXNoLnNwbGl0KCcmJykgOiBbXTtcclxuXHJcbiAgbGV0IGZvdW5kID0gZmFsc2U7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJhbXMubGVuZ3RoICYmICFmb3VuZDsgaSsrKSB7XHJcbiAgICBjb25zdCBwYWlyID0gcGFyYW1zW2ldLnNwbGl0KCc9Jyk7XHJcbiAgICBpZiAocGFpclswXSA9PT0ga2V5KSB7XHJcbiAgICAgIHBhaXJbMV0gPSB2YWx1ZTtcclxuICAgICAgcGFyYW1zW2ldID0gcGFpci5qb2luKCc9Jyk7XHJcbiAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKCFmb3VuZCkge1xyXG4gICAgcGFyYW1zLnB1c2goW2tleSwgdmFsdWVdLmpvaW4oJz0nKSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBuZXdIYXNoID0gcGFyYW1zLmpvaW4oJyYnKTtcclxuICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IGAjJHtuZXdIYXNofWA7XHJcbn07XHJcblxyXG5jb25zdCByZW1vdmVIYXNoVmFsdWUgPSAoa2V5KSA9PiB7XHJcbiAgaWYgKCFrZXkpIHJldHVybjtcclxuICBjb25zdCBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpO1xyXG4gIGNvbnN0IHBhcmFtcyA9IGhhc2ggPyBoYXNoLnNwbGl0KCcmJykgOiBbXTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJhbXMubGVuZ3RoOyBpKyspIHtcclxuICAgIGNvbnN0IHBhaXIgPSBwYXJhbXNbaV0uc3BsaXQoJz0nKTtcclxuICAgIGlmIChwYWlyWzBdID09PSBrZXkpIHtcclxuICAgICAgcGFyYW1zLnNwbGljZShpLCAxKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCBuZXdIYXNoID0gcGFyYW1zLmpvaW4oJyYnKTtcclxuICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IGAjJHtuZXdIYXNofWA7XHJcbn07XHJcblxyXG5jb25zdCBzZXRQYXRoID0gKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUpID0+IHtcclxuICBjb25zdCBwYXRoID0gY2F0ZWdvcnkgPyBjYXRlZ29yeSArIChhbGdvcml0aG0gPyBgLyR7YWxnb3JpdGhtfWAgKyAoZmlsZSA/IGAvJHtmaWxlfWAgOiAnJykgOiAnJykgOiAnJztcclxuICBzZXRIYXNoVmFsdWUoJ3BhdGgnLCBwYXRoKTtcclxufTtcclxuXHJcbmNvbnN0IGdldFBhdGggPSAoKSA9PiB7XHJcbiAgY29uc3QgaGFzaCA9IGdldEhhc2hWYWx1ZSgncGF0aCcpO1xyXG4gIGlmIChoYXNoKSB7XHJcbiAgICBjb25zdCBbIGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUgXSA9IGhhc2guc3BsaXQoJy8nKTtcclxuICAgIHJldHVybiB7IGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGNoZWNrTG9hZGluZyxcclxuICBnZXRQYXJhbWV0ZXJCeU5hbWUsXHJcbiAgZ2V0SGFzaFZhbHVlLFxyXG4gIHNldEhhc2hWYWx1ZSxcclxuICByZW1vdmVIYXNoVmFsdWUsXHJcbiAgc2V0UGF0aCxcclxuICBnZXRQYXRoXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGxvYWRBbGdvcml0aG0gPSByZXF1aXJlKCcuL2xvYWRfYWxnb3JpdGhtJyk7XHJcbmNvbnN0IGxvYWRDYXRlZ29yaWVzID0gcmVxdWlyZSgnLi9sb2FkX2NhdGVnb3JpZXMnKTtcclxuY29uc3QgbG9hZEZpbGUgPSByZXF1aXJlKCcuL2xvYWRfZmlsZScpO1xyXG5jb25zdCBsb2FkU2NyYXRjaFBhcGVyID0gcmVxdWlyZSgnLi9sb2FkX3NjcmF0Y2hfcGFwZXInKTtcclxuY29uc3Qgc2hhcmVTY3JhdGNoUGFwZXIgPSByZXF1aXJlKCcuL3NoYXJlX3NjcmF0Y2hfcGFwZXInKTtcclxuY29uc3QgbG9hZFdpa2lMaXN0ID0gcmVxdWlyZSgnLi9sb2FkX3dpa2lfbGlzdCcpO1xyXG5jb25zdCBsb2FkV2lraSA9IHJlcXVpcmUoJy4vbG9hZF93aWtpJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBsb2FkQWxnb3JpdGhtLFxyXG4gIGxvYWRDYXRlZ29yaWVzLFxyXG4gIGxvYWRGaWxlLFxyXG4gIGxvYWRTY3JhdGNoUGFwZXIsXHJcbiAgc2hhcmVTY3JhdGNoUGFwZXIsXHJcbiAgbG9hZFdpa2lMaXN0LFxyXG4gIGxvYWRXaWtpXHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgZ2V0SlNPTiA9IHJlcXVpcmUoJy4vYWpheC9nZXRfanNvbicpO1xyXG5cclxuY29uc3Qge1xyXG4gIGdldEFsZ29yaXRobURpclxyXG59ID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKGNhdGVnb3J5LCBhbGdvcml0aG0pID0+IHtcclxuICBjb25zdCBkaXIgPSBnZXRBbGdvcml0aG1EaXIoY2F0ZWdvcnksIGFsZ29yaXRobSk7XHJcbiAgcmV0dXJuIGdldEpTT04oYCR7ZGlyfWRlc2MuanNvbmApO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGdldEpTT04gPSByZXF1aXJlKCcuL2FqYXgvZ2V0X2pzb24nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xyXG4gIHJldHVybiBnZXRKU09OKCcuL2FsZ29yaXRobS9jYXRlZ29yeS5qc29uJyk7XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgUlNWUCA9IHJlcXVpcmUoJ3JzdnAnKTtcclxuXHJcbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xyXG5cclxuY29uc3Qge1xyXG4gIGdldEZpbGVEaXIsXHJcbiAgaXNTY3JhdGNoUGFwZXJcclxufSA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XHJcblxyXG5jb25zdCB7XHJcbiAgY2hlY2tMb2FkaW5nLFxyXG4gIHNldFBhdGhcclxufSA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xyXG5cclxuY29uc3QgZ2V0ID0gcmVxdWlyZSgnLi9hamF4L2dldCcpO1xyXG5cclxuY29uc3QgbG9hZERhdGFBbmRDb2RlID0gKGRpcikgPT4ge1xyXG4gIHJldHVybiBSU1ZQLmhhc2goe1xyXG4gICAgZGF0YTogZ2V0KGAke2Rpcn1kYXRhLmpzYCksXHJcbiAgICBjb2RlOiBnZXQoYCR7ZGlyfWNvZGUuanNgKVxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgbG9hZEZpbGVBbmRVcGRhdGVDb250ZW50ID0gKGRpcikgPT4ge1xyXG4gIGFwcC5nZXRFZGl0b3IoKS5jbGVhckNvbnRlbnQoKTtcclxuXHJcbiAgcmV0dXJuIGxvYWREYXRhQW5kQ29kZShkaXIpLnRoZW4oKGNvbnRlbnQpID0+IHtcclxuICAgIGFwcC51cGRhdGVDYWNoZWRGaWxlKGRpciwgY29udGVudCk7XHJcbiAgICBhcHAuZ2V0RWRpdG9yKCkuc2V0Q29udGVudChjb250ZW50KTtcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IGNhY2hlZENvbnRlbnRFeGlzdHMgPSAoY2FjaGVkRmlsZSkgPT4ge1xyXG4gIHJldHVybiBjYWNoZWRGaWxlICYmXHJcbiAgICBjYWNoZWRGaWxlLmRhdGEgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgY2FjaGVkRmlsZS5jb2RlICE9PSB1bmRlZmluZWQ7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IChjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlLCBleHBsYW5hdGlvbikgPT4ge1xyXG4gIHJldHVybiBuZXcgUlNWUC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGlmIChjaGVja0xvYWRpbmcoKSkge1xyXG4gICAgICByZWplY3QoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChpc1NjcmF0Y2hQYXBlcihjYXRlZ29yeSkpIHtcclxuICAgICAgICBzZXRQYXRoKGNhdGVnb3J5LCBhcHAuZ2V0TG9hZGVkU2NyYXRjaCgpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZXRQYXRoKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUpO1xyXG4gICAgICB9XHJcbiAgICAgICQoJyNleHBsYW5hdGlvbicpLmh0bWwoZXhwbGFuYXRpb24pO1xyXG5cclxuICAgICAgbGV0IGRpciA9IGdldEZpbGVEaXIoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSk7XHJcbiAgICAgIGFwcC5zZXRMYXN0RmlsZVVzZWQoZGlyKTtcclxuICAgICAgY29uc3QgY2FjaGVkRmlsZSA9IGFwcC5nZXRDYWNoZWRGaWxlKGRpcik7XHJcblxyXG4gICAgICBpZiAoY2FjaGVkQ29udGVudEV4aXN0cyhjYWNoZWRGaWxlKSkge1xyXG4gICAgICAgIGFwcC5nZXRFZGl0b3IoKS5zZXRDb250ZW50KGNhY2hlZEZpbGUpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsb2FkRmlsZUFuZFVwZGF0ZUNvbnRlbnQoZGlyKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxufTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBSU1ZQID0gcmVxdWlyZSgncnN2cCcpO1xyXG5jb25zdCBhcHAgPSByZXF1aXJlKCcuLi9hcHAnKTtcclxuXHJcbmNvbnN0IHtcclxuICBnZXRGaWxlRGlyXHJcbn0gPSByZXF1aXJlKCcuLi91dGlscycpO1xyXG5cclxuY29uc3QgZ2V0SlNPTiA9IHJlcXVpcmUoJy4vYWpheC9nZXRfanNvbicpO1xyXG5jb25zdCBsb2FkQWxnb3JpdGhtID0gcmVxdWlyZSgnLi9sb2FkX2FsZ29yaXRobScpO1xyXG5cclxuY29uc3QgZXh0cmFjdEdpc3RDb2RlID0gKGZpbGVzLCBuYW1lKSA9PiBmaWxlc1tgJHtuYW1lfS5qc2BdLmNvbnRlbnQ7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IChnaXN0SUQpID0+IHtcclxuICByZXR1cm4gbmV3IFJTVlAuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBhcHAuc2V0TG9hZGVkU2NyYXRjaChnaXN0SUQpO1xyXG5cclxuICAgIGdldEpTT04oYGh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vZ2lzdHMvJHtnaXN0SUR9YCkudGhlbigoe1xyXG4gICAgICBmaWxlc1xyXG4gICAgfSkgPT4ge1xyXG5cclxuICAgICAgY29uc3QgY2F0ZWdvcnkgPSAnc2NyYXRjaCc7XHJcbiAgICAgIGNvbnN0IGFsZ29yaXRobSA9IGdpc3RJRDtcclxuXHJcbiAgICAgIGxvYWRBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSkudGhlbigoZGF0YSkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBhbGdvRGF0YSA9IGV4dHJhY3RHaXN0Q29kZShmaWxlcywgJ2RhdGEnKTtcclxuICAgICAgICBjb25zdCBhbGdvQ29kZSA9IGV4dHJhY3RHaXN0Q29kZShmaWxlcywgJ2NvZGUnKTtcclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIHNjcmF0Y2ggcGFwZXIgYWxnbyBjb2RlIHdpdGggdGhlIGxvYWRlZCBnaXN0IGNvZGVcclxuICAgICAgICBjb25zdCBkaXIgPSBnZXRGaWxlRGlyKGNhdGVnb3J5LCBhbGdvcml0aG0sICdzY3JhdGNoX3BhcGVyJyk7XHJcbiAgICAgICAgYXBwLnVwZGF0ZUNhY2hlZEZpbGUoZGlyLCB7XHJcbiAgICAgICAgICBkYXRhOiBhbGdvRGF0YSxcclxuICAgICAgICAgIGNvZGU6IGFsZ29Db2RlLFxyXG4gICAgICAgICAgJ0NSRURJVC5tZCc6ICdTaGFyZWQgYnkgYW4gYW5vbnltb3VzIHVzZXIgZnJvbSBodHRwOi8vcGFya2pzODE0LmdpdGh1Yi5pby9BbGdvcml0aG1WaXN1YWxpemVyJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXNvbHZlKHtcclxuICAgICAgICAgIGNhdGVnb3J5LFxyXG4gICAgICAgICAgYWxnb3JpdGhtLFxyXG4gICAgICAgICAgZGF0YVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxufTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBnZXQgPSByZXF1aXJlKCcuL2FqYXgvZ2V0Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9ICh3aWtpKSA9PiB7XHJcbiAgcmV0dXJuIGdldChgLi9BbGdvcml0aG1WaXN1YWxpemVyLndpa2kvJHt3aWtpfS5tZGApO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGdldEpTT04gPSByZXF1aXJlKCcuL2FqYXgvZ2V0X2pzb24nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xyXG4gIHJldHVybiBnZXRKU09OKCcuL3dpa2kuanNvbicpO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IFJTVlAgPSByZXF1aXJlKCdyc3ZwJyk7XHJcbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xyXG5cclxuY29uc3QgcG9zdEpTT04gPSByZXF1aXJlKCcuL2FqYXgvcG9zdF9qc29uJyk7XHJcblxyXG5jb25zdCB7XHJcbiAgc2V0UGF0aFxyXG59ID0gcmVxdWlyZSgnLi9oZWxwZXJzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcclxuICByZXR1cm4gbmV3IFJTVlAuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgY29uc3Qge1xyXG4gICAgICBkYXRhRWRpdG9yLFxyXG4gICAgICBjb2RlRWRpdG9yXHJcbiAgICB9ID0gYXBwLmdldEVkaXRvcigpO1xyXG5cclxuICAgIGNvbnN0IGdpc3QgPSB7XHJcbiAgICAgICdkZXNjcmlwdGlvbic6ICd0ZW1wJyxcclxuICAgICAgJ3B1YmxpYyc6IHRydWUsXHJcbiAgICAgICdmaWxlcyc6IHtcclxuICAgICAgICAnZGF0YS5qcyc6IHtcclxuICAgICAgICAgICdjb250ZW50JzogZGF0YUVkaXRvci5nZXRWYWx1ZSgpXHJcbiAgICAgICAgfSxcclxuICAgICAgICAnY29kZS5qcyc6IHtcclxuICAgICAgICAgICdjb250ZW50JzogY29kZUVkaXRvci5nZXRWYWx1ZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHBvc3RKU09OKCdodHRwczovL2FwaS5naXRodWIuY29tL2dpc3RzJywgZ2lzdCkudGhlbigoe1xyXG4gICAgICBpZFxyXG4gICAgfSkgPT4ge1xyXG4gICAgICBhcHAuc2V0TG9hZGVkU2NyYXRjaChpZCk7XHJcbiAgICAgIHNldFBhdGgoJ3NjcmF0Y2gnLCBpZCk7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBocmVmXHJcbiAgICAgIH0gPSBsb2NhdGlvbjtcclxuICAgICAgJCgnI2FsZ29yaXRobScpLmh0bWwoJ1NoYXJlZCcpO1xyXG4gICAgICByZXNvbHZlKGhyZWYpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgVHJhY2VyTWFuYWdlciA9IHJlcXVpcmUoJy4vbWFuYWdlcicpO1xyXG5jb25zdCBUcmFjZXIgPSByZXF1aXJlKCcuLi9tb2R1bGUvdHJhY2VyL3RyYWNlcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBjb25zdCB0bSA9IG5ldyBUcmFjZXJNYW5hZ2VyKCk7XHJcbiAgICBUcmFjZXIucHJvdG90eXBlLm1hbmFnZXIgPSB0bTtcclxuICAgIHJldHVybiB0bTtcclxuICB9XHJcblxyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xyXG5jb25zdCBNb2R1bGVDb250YWluZXIgPSByZXF1aXJlKCcuLi9kb20vbW9kdWxlX2NvbnRhaW5lcicpO1xyXG5jb25zdCBUb3BNZW51ID0gcmVxdWlyZSgnLi4vZG9tL3RvcF9tZW51Jyk7XHJcblxyXG5jb25zdCB7XHJcbiAgZWFjaCxcclxuICBleHRlbmQsXHJcbiAgZ3JlcFxyXG59ID0gJDtcclxuXHJcbmNvbnN0IHN0ZXBMaW1pdCA9IDFlNjtcclxuXHJcbmNvbnN0IFRyYWNlck1hbmFnZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy50aW1lciA9IG51bGw7XHJcbiAgdGhpcy5wYXVzZSA9IGZhbHNlO1xyXG4gIHRoaXMuY2Fwc3VsZXMgPSBbXTtcclxuICB0aGlzLmludGVydmFsID0gNTAwO1xyXG59O1xyXG5cclxuVHJhY2VyTWFuYWdlci5wcm90b3R5cGUgPSB7XHJcblxyXG4gIGFkZCh0cmFjZXIpIHtcclxuXHJcbiAgICBjb25zdCAkY29udGFpbmVyID0gTW9kdWxlQ29udGFpbmVyLmNyZWF0ZSgpO1xyXG5cclxuICAgIGNvbnN0IGNhcHN1bGUgPSB7XHJcbiAgICAgIG1vZHVsZTogdHJhY2VyLm1vZHVsZSxcclxuICAgICAgdHJhY2VyLFxyXG4gICAgICBhbGxvY2F0ZWQ6IHRydWUsXHJcbiAgICAgIGRlZmF1bHROYW1lOiBudWxsLFxyXG4gICAgICAkY29udGFpbmVyLFxyXG4gICAgICBpc05ldzogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmNhcHN1bGVzLnB1c2goY2Fwc3VsZSk7XHJcbiAgICByZXR1cm4gY2Fwc3VsZTtcclxuICB9LFxyXG5cclxuICBhbGxvY2F0ZShuZXdUcmFjZXIpIHtcclxuICAgIGxldCBzZWxlY3RlZENhcHN1bGUgPSBudWxsO1xyXG4gICAgbGV0IGNvdW50ID0gMDtcclxuXHJcbiAgICBlYWNoKHRoaXMuY2Fwc3VsZXMsIChpLCBjYXBzdWxlKSA9PiB7XHJcbiAgICAgIGlmIChjYXBzdWxlLm1vZHVsZSA9PT0gbmV3VHJhY2VyLm1vZHVsZSkge1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgaWYgKCFjYXBzdWxlLmFsbG9jYXRlZCkge1xyXG4gICAgICAgICAgY2Fwc3VsZS50cmFjZXIgPSBuZXdUcmFjZXI7XHJcbiAgICAgICAgICBjYXBzdWxlLmFsbG9jYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICBjYXBzdWxlLmlzTmV3ID0gZmFsc2U7XHJcbiAgICAgICAgICBzZWxlY3RlZENhcHN1bGUgPSBjYXBzdWxlO1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHNlbGVjdGVkQ2Fwc3VsZSA9PT0gbnVsbCkge1xyXG4gICAgICBjb3VudCsrO1xyXG4gICAgICBzZWxlY3RlZENhcHN1bGUgPSB0aGlzLmFkZChuZXdUcmFjZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNsYXNzTmFtZSA9IG5ld1RyYWNlci5tb2R1bGUuZ2V0Q2xhc3NOYW1lKCk7XHJcbiAgICBzZWxlY3RlZENhcHN1bGUuZGVmYXVsdE5hbWUgPSBgJHtjbGFzc05hbWV9ICR7Y291bnR9YDtcclxuICAgIHNlbGVjdGVkQ2Fwc3VsZS5vcmRlciA9IHRoaXMub3JkZXIrKztcclxuICAgIHJldHVybiBzZWxlY3RlZENhcHN1bGU7XHJcbiAgfSxcclxuXHJcbiAgZGVhbGxvY2F0ZUFsbCgpIHtcclxuICAgIHRoaXMub3JkZXIgPSAwO1xyXG4gICAgdGhpcy5yZXNldCgpO1xyXG4gICAgZWFjaCh0aGlzLmNhcHN1bGVzLCAoaSwgY2Fwc3VsZSkgPT4ge1xyXG4gICAgICBjYXBzdWxlLmFsbG9jYXRlZCA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgcmVtb3ZlVW5hbGxvY2F0ZWQoKSB7XHJcbiAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuY2Fwc3VsZXMgPSBncmVwKHRoaXMuY2Fwc3VsZXMsIChjYXBzdWxlKSA9PiB7XHJcbiAgICAgIGxldCByZW1vdmVkID0gIWNhcHN1bGUuYWxsb2NhdGVkO1xyXG5cclxuICAgICAgaWYgKGNhcHN1bGUuaXNOZXcgfHwgcmVtb3ZlZCkge1xyXG4gICAgICAgIGNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChyZW1vdmVkKSB7XHJcbiAgICAgICAgY2Fwc3VsZS4kY29udGFpbmVyLnJlbW92ZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gIXJlbW92ZWQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoY2hhbmdlZCkge1xyXG4gICAgICB0aGlzLnBsYWNlKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcGxhY2UoKSB7XHJcbiAgICBjb25zdCB7XHJcbiAgICAgIGNhcHN1bGVzXHJcbiAgICB9ID0gdGhpcztcclxuXHJcbiAgICBlYWNoKGNhcHN1bGVzLCAoaSwgY2Fwc3VsZSkgPT4ge1xyXG4gICAgICBsZXQgd2lkdGggPSAxMDA7XHJcbiAgICAgIGxldCBoZWlnaHQgPSAoMTAwIC8gY2Fwc3VsZXMubGVuZ3RoKTtcclxuICAgICAgbGV0IHRvcCA9IGhlaWdodCAqIGNhcHN1bGUub3JkZXI7XHJcblxyXG4gICAgICBjYXBzdWxlLiRjb250YWluZXIuY3NzKHtcclxuICAgICAgICB0b3A6IGAke3RvcH0lYCxcclxuICAgICAgICB3aWR0aDogYCR7d2lkdGh9JWAsXHJcbiAgICAgICAgaGVpZ2h0OiBgJHtoZWlnaHR9JWBcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjYXBzdWxlLnRyYWNlci5yZXNpemUoKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIHJlc2l6ZSgpIHtcclxuICAgIHRoaXMuY29tbWFuZCgncmVzaXplJyk7XHJcbiAgfSxcclxuXHJcbiAgaXNQYXVzZSgpIHtcclxuICAgIHJldHVybiB0aGlzLnBhdXNlO1xyXG4gIH0sXHJcblxyXG4gIHNldEludGVydmFsKGludGVydmFsKSB7XHJcbiAgICBUb3BNZW51LnNldEludGVydmFsKGludGVydmFsKTtcclxuICB9LFxyXG5cclxuICByZXNldCgpIHtcclxuICAgIHRoaXMudHJhY2VzID0gW107XHJcbiAgICB0aGlzLnRyYWNlSW5kZXggPSAtMTtcclxuICAgIHRoaXMuc3RlcENudCA9IDA7XHJcbiAgICBpZiAodGhpcy50aW1lcikge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XHJcbiAgICB9XHJcbiAgICB0aGlzLmNvbW1hbmQoJ2NsZWFyJyk7XHJcbiAgfSxcclxuXHJcbiAgcHVzaFN0ZXAoY2Fwc3VsZSwgc3RlcCkge1xyXG4gICAgaWYgKHRoaXMuc3RlcENudCsrID4gc3RlcExpbWl0KSB0aHJvdyBcIlRyYWNlcidzIHN0YWNrIG92ZXJmbG93XCI7XHJcbiAgICBsZXQgbGVuID0gdGhpcy50cmFjZXMubGVuZ3RoO1xyXG4gICAgaWYgKGxlbiA9PSAwKSBsZW4gKz0gdGhpcy5uZXdTdGVwKCk7XHJcbiAgICBjb25zdCBsYXN0ID0gdGhpcy50cmFjZXNbbGVuIC0gMV07XHJcbiAgICBsYXN0LnB1c2goZXh0ZW5kKHN0ZXAsIHtcclxuICAgICAgY2Fwc3VsZVxyXG4gICAgfSkpO1xyXG4gIH0sXHJcblxyXG4gIG5ld1N0ZXAobGluZSA9IC0xKSB7XHJcbiAgICBsZXQgbGVuID0gdGhpcy50cmFjZXMubGVuZ3RoO1xyXG4gICAgaWYgKGxlbiA+IDAgJiYgfmxpbmUpIHtcclxuICAgICAgdGhpcy50cmFjZXNbbGVuIC0gMV0ucHVzaChsaW5lKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnRyYWNlcy5wdXNoKFtdKTtcclxuICB9LFxyXG5cclxuICBwYXVzZVN0ZXAoKSB7XHJcbiAgICBpZiAodGhpcy50cmFjZUluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgdGhpcy5wYXVzZSA9IHRydWU7XHJcbiAgICBpZiAodGhpcy50aW1lcikge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XHJcbiAgICB9XHJcbiAgICBUb3BNZW51LmFjdGl2YXRlQnRuUGF1c2UoKTtcclxuICB9LFxyXG5cclxuICByZXN1bWVTdGVwKCkge1xyXG4gICAgdGhpcy5wYXVzZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5zdGVwKHRoaXMudHJhY2VJbmRleCArIDEpO1xyXG4gICAgVG9wTWVudS5kZWFjdGl2YXRlQnRuUGF1c2UoKTtcclxuICB9LFxyXG5cclxuICBzdGVwKGksIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3QgdHJhY2VyID0gdGhpcztcclxuXHJcbiAgICBpZiAoaXNOYU4oaSkgfHwgaSA+PSB0aGlzLnRyYWNlcy5sZW5ndGggfHwgaSA8IDApIHJldHVybjtcclxuXHJcbiAgICB0aGlzLnRyYWNlSW5kZXggPSBpO1xyXG4gICAgY29uc3QgdHJhY2UgPSB0aGlzLnRyYWNlc1tpXTtcclxuICAgIHRyYWNlLmZvckVhY2goKHN0ZXApID0+IHtcclxuICAgICAgaWYgKHR5cGVvZiBzdGVwID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIGFwcC5nZXRFZGl0b3IoKS5oaWdobGlnaHRMaW5lKHN0ZXApO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBzdGVwLmNhcHN1bGUudHJhY2VyLnByb2Nlc3NTdGVwKHN0ZXAsIG9wdGlvbnMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCFvcHRpb25zLnZpcnR1YWwpIHtcclxuICAgICAgdGhpcy5jb21tYW5kKCdyZWZyZXNoJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucGF1c2UpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGlmICghdHJhY2VyLm5leHRTdGVwKG9wdGlvbnMpKSB7XHJcbiAgICAgICAgVG9wTWVudS5yZXNldFRvcE1lbnVCdXR0b25zKCk7XHJcbiAgICAgIH1cclxuICAgIH0sIHRoaXMuaW50ZXJ2YWwpO1xyXG4gIH0sXHJcblxyXG4gIHByZXZTdGVwKG9wdGlvbnMgPSB7fSkge1xyXG4gICAgdGhpcy5jb21tYW5kKCdjbGVhcicpO1xyXG5cclxuICAgIGNvbnN0IGZpbmFsSW5kZXggPSB0aGlzLnRyYWNlSW5kZXggLSAxO1xyXG4gICAgaWYgKGZpbmFsSW5kZXggPCAwKSB7XHJcbiAgICAgIHRoaXMudHJhY2VJbmRleCA9IC0xO1xyXG4gICAgICB0aGlzLmNvbW1hbmQoJ3JlZnJlc2gnKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmluYWxJbmRleDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuc3RlcChpLCBleHRlbmQob3B0aW9ucywge1xyXG4gICAgICAgIHZpcnR1YWw6IHRydWVcclxuICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RlcChmaW5hbEluZGV4KTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0sXHJcblxyXG4gIG5leHRTdGVwKG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3QgZmluYWxJbmRleCA9IHRoaXMudHJhY2VJbmRleCArIDE7XHJcbiAgICBpZiAoZmluYWxJbmRleCA+PSB0aGlzLnRyYWNlcy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy50cmFjZUluZGV4ID0gdGhpcy50cmFjZXMubGVuZ3RoIC0gMTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RlcChmaW5hbEluZGV4LCBvcHRpb25zKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0sXHJcblxyXG4gIHZpc3VhbGl6ZSgpIHtcclxuICAgIHRoaXMudHJhY2VJbmRleCA9IC0xO1xyXG4gICAgdGhpcy5yZXN1bWVTdGVwKCk7XHJcbiAgfSxcclxuXHJcbiAgY29tbWFuZCguLi5hcmdzKSB7XHJcbiAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSBhcmdzLnNoaWZ0KCk7XHJcbiAgICBlYWNoKHRoaXMuY2Fwc3VsZXMsIChpLCBjYXBzdWxlKSA9PiB7XHJcbiAgICAgIGlmIChjYXBzdWxlLmFsbG9jYXRlZCkge1xyXG4gICAgICAgIGNhcHN1bGUudHJhY2VyLm1vZHVsZS5wcm90b3R5cGVbZnVuY3Rpb25OYW1lXS5hcHBseShjYXBzdWxlLnRyYWNlciwgYXJncyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIGZpbmRPd25lcihjb250YWluZXIpIHtcclxuICAgIGxldCBzZWxlY3RlZENhcHN1bGUgPSBudWxsO1xyXG4gICAgZWFjaCh0aGlzLmNhcHN1bGVzLCAoaSwgY2Fwc3VsZSkgPT4ge1xyXG4gICAgICBpZiAoY2Fwc3VsZS4kY29udGFpbmVyWzBdID09PSBjb250YWluZXIpIHtcclxuICAgICAgICBzZWxlY3RlZENhcHN1bGUgPSBjYXBzdWxlO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gc2VsZWN0ZWRDYXBzdWxlLnRyYWNlcjtcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlck1hbmFnZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IHtcclxuICBwYXJzZVxyXG59ID0gSlNPTjtcclxuXHJcbmNvbnN0IGZyb21KU09OID0gKG9iaikgPT4ge1xyXG4gIHJldHVybiBwYXJzZShvYmosIChrZXksIHZhbHVlKSA9PiB7XHJcbiAgICByZXR1cm4gdmFsdWUgPT09ICdJbmZpbml0eScgPyBJbmZpbml0eSA6IHZhbHVlO1xyXG4gIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmcm9tSlNPTjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgdG9KU09OID0gcmVxdWlyZSgnLi90b19qc29uJyk7XHJcbmNvbnN0IGZyb21KU09OID0gcmVxdWlyZSgnLi9mcm9tX2pzb24nKTtcclxuY29uc3QgcmVmaW5lQnlUeXBlID0gcmVxdWlyZSgnLi9yZWZpbmVfYnlfdHlwZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgdG9KU09OLFxyXG4gIGZyb21KU09OLFxyXG4gIHJlZmluZUJ5VHlwZVxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCByZWZpbmVCeVR5cGUgPSAoaXRlbSkgPT4ge1xyXG4gIHN3aXRjaCAodHlwZW9mKGl0ZW0pKSB7XHJcbiAgICBjYXNlICdudW1iZXInOlxyXG4gICAgICByZXR1cm4gcmVmaW5lTnVtYmVyKGl0ZW0pO1xyXG4gICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICAgIHJldHVybiByZWZpbmVCb29sZWFuKGl0ZW0pO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHJlZmluZVN0cmluZyhpdGVtKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCByZWZpbmVTdHJpbmcgPSAoc3RyKSA9PiB7XHJcbiAgcmV0dXJuIHN0ciA9PT0gJycgPyAnICcgOiBzdHI7XHJcbn07XHJcblxyXG5jb25zdCByZWZpbmVOdW1iZXIgPSAobnVtKSA9PiB7XHJcbiAgcmV0dXJuIG51bSA9PT0gSW5maW5pdHkgPyAn4oieJyA6IG51bTtcclxufTtcclxuXHJcbmNvbnN0IHJlZmluZUJvb2xlYW4gPSAoYm9vbCkgPT4ge1xyXG4gIHJldHVybiBib29sID8gJ1QnIDogJ0YnO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByZWZpbmVCeVR5cGU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IHtcclxuICBzdHJpbmdpZnlcclxufSA9IEpTT047XHJcblxyXG5jb25zdCB0b0pTT04gPSAob2JqKSA9PiB7XHJcbiAgcmV0dXJuIHN0cmluZ2lmeShvYmosIChrZXksIHZhbHVlKSA9PiB7XHJcbiAgICByZXR1cm4gdmFsdWUgPT09IEluZmluaXR5ID8gJ0luZmluaXR5JyA6IHZhbHVlO1xyXG4gIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB0b0pTT047XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGlzU2NyYXRjaFBhcGVyID0gKGNhdGVnb3J5LCBhbGdvcml0aG0pID0+IHtcclxuICByZXR1cm4gY2F0ZWdvcnkgPT0gJ3NjcmF0Y2gnO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0QWxnb3JpdGhtRGlyID0gKGNhdGVnb3J5LCBhbGdvcml0aG0pID0+IHtcclxuICBpZiAoaXNTY3JhdGNoUGFwZXIoY2F0ZWdvcnkpKSByZXR1cm4gJy4vYWxnb3JpdGhtL3NjcmF0Y2hfcGFwZXIvJztcclxuICByZXR1cm4gYC4vYWxnb3JpdGhtLyR7Y2F0ZWdvcnl9LyR7YWxnb3JpdGhtfS9gO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0RmlsZURpciA9IChjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlKSA9PiB7XHJcbiAgaWYgKGlzU2NyYXRjaFBhcGVyKGNhdGVnb3J5KSkgcmV0dXJuICcuL2FsZ29yaXRobS9zY3JhdGNoX3BhcGVyLyc7XHJcbiAgcmV0dXJuIGAuL2FsZ29yaXRobS8ke2NhdGVnb3J5fS8ke2FsZ29yaXRobX0vJHtmaWxlfS9gO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgaXNTY3JhdGNoUGFwZXIsXHJcbiAgZ2V0QWxnb3JpdGhtRGlyLFxyXG4gIGdldEZpbGVEaXJcclxufTsiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8qIVxuICogQG92ZXJ2aWV3IFJTVlAgLSBhIHRpbnkgaW1wbGVtZW50YXRpb24gb2YgUHJvbWlzZXMvQSsuXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNCBZZWh1ZGEgS2F0eiwgVG9tIERhbGUsIFN0ZWZhbiBQZW5uZXIgYW5kIGNvbnRyaWJ1dG9yc1xuICogQGxpY2Vuc2UgICBMaWNlbnNlZCB1bmRlciBNSVQgbGljZW5zZVxuICogICAgICAgICAgICBTZWUgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3RpbGRlaW8vcnN2cC5qcy9tYXN0ZXIvTElDRU5TRVxuICogQHZlcnNpb24gICAzLjIuMVxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCR1dGlscyQkb2JqZWN0T3JGdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbicgfHwgKHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCR1dGlscyQkaXNGdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkdXRpbHMkJGlzTWF5YmVUaGVuYWJsZSh4KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHV0aWxzJCRfaXNBcnJheTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkpIHtcbiAgICAgIGxpYiRyc3ZwJHV0aWxzJCRfaXNBcnJheSA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBsaWIkcnN2cCR1dGlscyQkX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCR1dGlscyQkaXNBcnJheSA9IGxpYiRyc3ZwJHV0aWxzJCRfaXNBcnJheTtcblxuICAgIHZhciBsaWIkcnN2cCR1dGlscyQkbm93ID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24oKSB7IHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTsgfTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHV0aWxzJCRGKCkgeyB9XG5cbiAgICB2YXIgbGliJHJzdnAkdXRpbHMkJG9fY3JlYXRlID0gKE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gKG8pIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlY29uZCBhcmd1bWVudCBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIG8gIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gICAgICB9XG4gICAgICBsaWIkcnN2cCR1dGlscyQkRi5wcm90b3R5cGUgPSBvO1xuICAgICAgcmV0dXJuIG5ldyBsaWIkcnN2cCR1dGlscyQkRigpO1xuICAgIH0pO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGV2ZW50cyQkaW5kZXhPZihjYWxsYmFja3MsIGNhbGxiYWNrKSB7XG4gICAgICBmb3IgKHZhciBpPTAsIGw9Y2FsbGJhY2tzLmxlbmd0aDsgaTxsOyBpKyspIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrc1tpXSA9PT0gY2FsbGJhY2spIHsgcmV0dXJuIGk7IH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGV2ZW50cyQkY2FsbGJhY2tzRm9yKG9iamVjdCkge1xuICAgICAgdmFyIGNhbGxiYWNrcyA9IG9iamVjdC5fcHJvbWlzZUNhbGxiYWNrcztcblxuICAgICAgaWYgKCFjYWxsYmFja3MpIHtcbiAgICAgICAgY2FsbGJhY2tzID0gb2JqZWN0Ll9wcm9taXNlQ2FsbGJhY2tzID0ge307XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjYWxsYmFja3M7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJGV2ZW50cyQkZGVmYXVsdCA9IHtcblxuICAgICAgLyoqXG4gICAgICAgIGBSU1ZQLkV2ZW50VGFyZ2V0Lm1peGluYCBleHRlbmRzIGFuIG9iamVjdCB3aXRoIEV2ZW50VGFyZ2V0IG1ldGhvZHMuIEZvclxuICAgICAgICBFeGFtcGxlOlxuXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgdmFyIG9iamVjdCA9IHt9O1xuXG4gICAgICAgIFJTVlAuRXZlbnRUYXJnZXQubWl4aW4ob2JqZWN0KTtcblxuICAgICAgICBvYmplY3Qub24oJ2ZpbmlzaGVkJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAvLyBoYW5kbGUgZXZlbnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ2ZpbmlzaGVkJywgeyBkZXRhaWw6IHZhbHVlIH0pO1xuICAgICAgICBgYGBcblxuICAgICAgICBgRXZlbnRUYXJnZXQubWl4aW5gIGFsc28gd29ya3Mgd2l0aCBwcm90b3R5cGVzOlxuXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgdmFyIFBlcnNvbiA9IGZ1bmN0aW9uKCkge307XG4gICAgICAgIFJTVlAuRXZlbnRUYXJnZXQubWl4aW4oUGVyc29uLnByb3RvdHlwZSk7XG5cbiAgICAgICAgdmFyIHllaHVkYSA9IG5ldyBQZXJzb24oKTtcbiAgICAgICAgdmFyIHRvbSA9IG5ldyBQZXJzb24oKTtcblxuICAgICAgICB5ZWh1ZGEub24oJ3Bva2UnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdZZWh1ZGEgc2F5cyBPVycpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0b20ub24oJ3Bva2UnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdUb20gc2F5cyBPVycpO1xuICAgICAgICB9KTtcblxuICAgICAgICB5ZWh1ZGEudHJpZ2dlcigncG9rZScpO1xuICAgICAgICB0b20udHJpZ2dlcigncG9rZScpO1xuICAgICAgICBgYGBcblxuICAgICAgICBAbWV0aG9kIG1peGluXG4gICAgICAgIEBmb3IgUlNWUC5FdmVudFRhcmdldFxuICAgICAgICBAcHJpdmF0ZVxuICAgICAgICBAcGFyYW0ge09iamVjdH0gb2JqZWN0IG9iamVjdCB0byBleHRlbmQgd2l0aCBFdmVudFRhcmdldCBtZXRob2RzXG4gICAgICAqL1xuICAgICAgJ21peGluJzogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgIG9iamVjdFsnb24nXSAgICAgID0gdGhpc1snb24nXTtcbiAgICAgICAgb2JqZWN0WydvZmYnXSAgICAgPSB0aGlzWydvZmYnXTtcbiAgICAgICAgb2JqZWN0Wyd0cmlnZ2VyJ10gPSB0aGlzWyd0cmlnZ2VyJ107XG4gICAgICAgIG9iamVjdC5fcHJvbWlzZUNhbGxiYWNrcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSBleGVjdXRlZCB3aGVuIGBldmVudE5hbWVgIGlzIHRyaWdnZXJlZFxuXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgb2JqZWN0Lm9uKCdldmVudCcsIGZ1bmN0aW9uKGV2ZW50SW5mbyl7XG4gICAgICAgICAgLy8gaGFuZGxlIHRoZSBldmVudFxuICAgICAgICB9KTtcblxuICAgICAgICBvYmplY3QudHJpZ2dlcignZXZlbnQnKTtcbiAgICAgICAgYGBgXG5cbiAgICAgICAgQG1ldGhvZCBvblxuICAgICAgICBAZm9yIFJTVlAuRXZlbnRUYXJnZXRcbiAgICAgICAgQHByaXZhdGVcbiAgICAgICAgQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBuYW1lIG9mIHRoZSBldmVudCB0byBsaXN0ZW4gZm9yXG4gICAgICAgIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAgICAqL1xuICAgICAgJ29uJzogZnVuY3Rpb24oZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWxsQ2FsbGJhY2tzID0gbGliJHJzdnAkZXZlbnRzJCRjYWxsYmFja3NGb3IodGhpcyksIGNhbGxiYWNrcztcblxuICAgICAgICBjYWxsYmFja3MgPSBhbGxDYWxsYmFja3NbZXZlbnROYW1lXTtcblxuICAgICAgICBpZiAoIWNhbGxiYWNrcykge1xuICAgICAgICAgIGNhbGxiYWNrcyA9IGFsbENhbGxiYWNrc1tldmVudE5hbWVdID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGliJHJzdnAkZXZlbnRzJCRpbmRleE9mKGNhbGxiYWNrcywgY2FsbGJhY2spID09PSAtMSkge1xuICAgICAgICAgIGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgIFlvdSBjYW4gdXNlIGBvZmZgIHRvIHN0b3AgZmlyaW5nIGEgcGFydGljdWxhciBjYWxsYmFjayBmb3IgYW4gZXZlbnQ6XG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICBmdW5jdGlvbiBkb1N0dWZmKCkgeyAvLyBkbyBzdHVmZiEgfVxuICAgICAgICBvYmplY3Qub24oJ3N0dWZmJywgZG9TdHVmZik7XG5cbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ3N0dWZmJyk7IC8vIGRvU3R1ZmYgd2lsbCBiZSBjYWxsZWRcblxuICAgICAgICAvLyBVbnJlZ2lzdGVyIE9OTFkgdGhlIGRvU3R1ZmYgY2FsbGJhY2tcbiAgICAgICAgb2JqZWN0Lm9mZignc3R1ZmYnLCBkb1N0dWZmKTtcbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ3N0dWZmJyk7IC8vIGRvU3R1ZmYgd2lsbCBOT1QgYmUgY2FsbGVkXG4gICAgICAgIGBgYFxuXG4gICAgICAgIElmIHlvdSBkb24ndCBwYXNzIGEgYGNhbGxiYWNrYCBhcmd1bWVudCB0byBgb2ZmYCwgQUxMIGNhbGxiYWNrcyBmb3IgdGhlXG4gICAgICAgIGV2ZW50IHdpbGwgbm90IGJlIGV4ZWN1dGVkIHdoZW4gdGhlIGV2ZW50IGZpcmVzLiBGb3IgZXhhbXBsZTpcblxuICAgICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICAgIHZhciBjYWxsYmFjazEgPSBmdW5jdGlvbigpe307XG4gICAgICAgIHZhciBjYWxsYmFjazIgPSBmdW5jdGlvbigpe307XG5cbiAgICAgICAgb2JqZWN0Lm9uKCdzdHVmZicsIGNhbGxiYWNrMSk7XG4gICAgICAgIG9iamVjdC5vbignc3R1ZmYnLCBjYWxsYmFjazIpO1xuXG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdzdHVmZicpOyAvLyBjYWxsYmFjazEgYW5kIGNhbGxiYWNrMiB3aWxsIGJlIGV4ZWN1dGVkLlxuXG4gICAgICAgIG9iamVjdC5vZmYoJ3N0dWZmJyk7XG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdzdHVmZicpOyAvLyBjYWxsYmFjazEgYW5kIGNhbGxiYWNrMiB3aWxsIG5vdCBiZSBleGVjdXRlZCFcbiAgICAgICAgYGBgXG5cbiAgICAgICAgQG1ldGhvZCBvZmZcbiAgICAgICAgQGZvciBSU1ZQLkV2ZW50VGFyZ2V0XG4gICAgICAgIEBwcml2YXRlXG4gICAgICAgIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgZXZlbnQgdG8gc3RvcCBsaXN0ZW5pbmcgdG9cbiAgICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgb3B0aW9uYWwgYXJndW1lbnQuIElmIGdpdmVuLCBvbmx5IHRoZSBmdW5jdGlvblxuICAgICAgICBnaXZlbiB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgZXZlbnQncyBjYWxsYmFjayBxdWV1ZS4gSWYgbm8gYGNhbGxiYWNrYFxuICAgICAgICBhcmd1bWVudCBpcyBnaXZlbiwgYWxsIGNhbGxiYWNrcyB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgZXZlbnQncyBjYWxsYmFja1xuICAgICAgICBxdWV1ZS5cbiAgICAgICovXG4gICAgICAnb2ZmJzogZnVuY3Rpb24oZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgYWxsQ2FsbGJhY2tzID0gbGliJHJzdnAkZXZlbnRzJCRjYWxsYmFja3NGb3IodGhpcyksIGNhbGxiYWNrcywgaW5kZXg7XG5cbiAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgIGFsbENhbGxiYWNrc1tldmVudE5hbWVdID0gW107XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2tzID0gYWxsQ2FsbGJhY2tzW2V2ZW50TmFtZV07XG5cbiAgICAgICAgaW5kZXggPSBsaWIkcnN2cCRldmVudHMkJGluZGV4T2YoY2FsbGJhY2tzLCBjYWxsYmFjayk7XG5cbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkgeyBjYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTsgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgIFVzZSBgdHJpZ2dlcmAgdG8gZmlyZSBjdXN0b20gZXZlbnRzLiBGb3IgZXhhbXBsZTpcblxuICAgICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICAgIG9iamVjdC5vbignZm9vJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZm9vIGV2ZW50IGhhcHBlbmVkIScpO1xuICAgICAgICB9KTtcbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ2ZvbycpO1xuICAgICAgICAvLyAnZm9vIGV2ZW50IGhhcHBlbmVkIScgbG9nZ2VkIHRvIHRoZSBjb25zb2xlXG4gICAgICAgIGBgYFxuXG4gICAgICAgIFlvdSBjYW4gYWxzbyBwYXNzIGEgdmFsdWUgYXMgYSBzZWNvbmQgYXJndW1lbnQgdG8gYHRyaWdnZXJgIHRoYXQgd2lsbCBiZVxuICAgICAgICBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gYWxsIGV2ZW50IGxpc3RlbmVycyBmb3IgdGhlIGV2ZW50OlxuXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgb2JqZWN0Lm9uKCdmb28nLCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgY29uc29sZS5sb2codmFsdWUubmFtZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdmb28nLCB7IG5hbWU6ICdiYXInIH0pO1xuICAgICAgICAvLyAnYmFyJyBsb2dnZWQgdG8gdGhlIGNvbnNvbGVcbiAgICAgICAgYGBgXG5cbiAgICAgICAgQG1ldGhvZCB0cmlnZ2VyXG4gICAgICAgIEBmb3IgUlNWUC5FdmVudFRhcmdldFxuICAgICAgICBAcHJpdmF0ZVxuICAgICAgICBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIG5hbWUgb2YgdGhlIGV2ZW50IHRvIGJlIHRyaWdnZXJlZFxuICAgICAgICBAcGFyYW0geyp9IG9wdGlvbnMgb3B0aW9uYWwgdmFsdWUgdG8gYmUgcGFzc2VkIHRvIGFueSBldmVudCBoYW5kbGVycyBmb3JcbiAgICAgICAgdGhlIGdpdmVuIGBldmVudE5hbWVgXG4gICAgICAqL1xuICAgICAgJ3RyaWdnZXInOiBmdW5jdGlvbihldmVudE5hbWUsIG9wdGlvbnMsIGxhYmVsKSB7XG4gICAgICAgIHZhciBhbGxDYWxsYmFja3MgPSBsaWIkcnN2cCRldmVudHMkJGNhbGxiYWNrc0Zvcih0aGlzKSwgY2FsbGJhY2tzLCBjYWxsYmFjaztcblxuICAgICAgICBpZiAoY2FsbGJhY2tzID0gYWxsQ2FsbGJhY2tzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAvLyBEb24ndCBjYWNoZSB0aGUgY2FsbGJhY2tzLmxlbmd0aCBzaW5jZSBpdCBtYXkgZ3Jvd1xuICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2tzW2ldO1xuXG4gICAgICAgICAgICBjYWxsYmFjayhvcHRpb25zLCBsYWJlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBsaWIkcnN2cCRjb25maWckJGNvbmZpZyA9IHtcbiAgICAgIGluc3RydW1lbnQ6IGZhbHNlXG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGV2ZW50cyQkZGVmYXVsdFsnbWl4aW4nXShsaWIkcnN2cCRjb25maWckJGNvbmZpZyk7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRjb25maWckJGNvbmZpZ3VyZShuYW1lLCB2YWx1ZSkge1xuICAgICAgaWYgKG5hbWUgPT09ICdvbmVycm9yJykge1xuICAgICAgICAvLyBoYW5kbGUgZm9yIGxlZ2FjeSB1c2VycyB0aGF0IGV4cGVjdCB0aGUgYWN0dWFsXG4gICAgICAgIC8vIGVycm9yIHRvIGJlIHBhc3NlZCB0byB0aGVpciBmdW5jdGlvbiBhZGRlZCB2aWFcbiAgICAgICAgLy8gYFJTVlAuY29uZmlndXJlKCdvbmVycm9yJywgc29tZUZ1bmN0aW9uSGVyZSk7YFxuICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1snb24nXSgnZXJyb3InLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWdbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1tuYW1lXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkaW5zdHJ1bWVudCQkcXVldWUgPSBbXTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGluc3RydW1lbnQkJHNjaGVkdWxlRmx1c2goKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZW50cnk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGliJHJzdnAkaW5zdHJ1bWVudCQkcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBlbnRyeSA9IGxpYiRyc3ZwJGluc3RydW1lbnQkJHF1ZXVlW2ldO1xuXG4gICAgICAgICAgdmFyIHBheWxvYWQgPSBlbnRyeS5wYXlsb2FkO1xuXG4gICAgICAgICAgcGF5bG9hZC5ndWlkID0gcGF5bG9hZC5rZXkgKyBwYXlsb2FkLmlkO1xuICAgICAgICAgIHBheWxvYWQuY2hpbGRHdWlkID0gcGF5bG9hZC5rZXkgKyBwYXlsb2FkLmNoaWxkSWQ7XG4gICAgICAgICAgaWYgKHBheWxvYWQuZXJyb3IpIHtcbiAgICAgICAgICAgIHBheWxvYWQuc3RhY2sgPSBwYXlsb2FkLmVycm9yLnN0YWNrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnWyd0cmlnZ2VyJ10oZW50cnkubmFtZSwgZW50cnkucGF5bG9hZCk7XG4gICAgICAgIH1cbiAgICAgICAgbGliJHJzdnAkaW5zdHJ1bWVudCQkcXVldWUubGVuZ3RoID0gMDtcbiAgICAgIH0sIDUwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRpbnN0cnVtZW50JCRpbnN0cnVtZW50KGV2ZW50TmFtZSwgcHJvbWlzZSwgY2hpbGQpIHtcbiAgICAgIGlmICgxID09PSBsaWIkcnN2cCRpbnN0cnVtZW50JCRxdWV1ZS5wdXNoKHtcbiAgICAgICAgbmFtZTogZXZlbnROYW1lLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAga2V5OiBwcm9taXNlLl9ndWlkS2V5LFxuICAgICAgICAgIGlkOiAgcHJvbWlzZS5faWQsXG4gICAgICAgICAgZXZlbnROYW1lOiBldmVudE5hbWUsXG4gICAgICAgICAgZGV0YWlsOiBwcm9taXNlLl9yZXN1bHQsXG4gICAgICAgICAgY2hpbGRJZDogY2hpbGQgJiYgY2hpbGQuX2lkLFxuICAgICAgICAgIGxhYmVsOiBwcm9taXNlLl9sYWJlbCxcbiAgICAgICAgICB0aW1lU3RhbXA6IGxpYiRyc3ZwJHV0aWxzJCRub3coKSxcbiAgICAgICAgICBlcnJvcjogbGliJHJzdnAkY29uZmlnJCRjb25maWdbXCJpbnN0cnVtZW50LXdpdGgtc3RhY2tcIl0gPyBuZXcgRXJyb3IocHJvbWlzZS5fbGFiZWwpIDogbnVsbFxuICAgICAgICB9fSkpIHtcbiAgICAgICAgICBsaWIkcnN2cCRpbnN0cnVtZW50JCRzY2hlZHVsZUZsdXNoKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB2YXIgbGliJHJzdnAkaW5zdHJ1bWVudCQkZGVmYXVsdCA9IGxpYiRyc3ZwJGluc3RydW1lbnQkJGluc3RydW1lbnQ7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkdGhlbiQkdGhlbihvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbiwgbGFiZWwpIHtcbiAgICAgIHZhciBwYXJlbnQgPSB0aGlzO1xuICAgICAgdmFyIHN0YXRlID0gcGFyZW50Ll9zdGF0ZTtcblxuICAgICAgaWYgKHN0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCAmJiAhb25GdWxmaWxsbWVudCB8fCBzdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRSRUpFQ1RFRCAmJiAhb25SZWplY3Rpb24pIHtcbiAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuaW5zdHJ1bWVudCAmJiBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0KCdjaGFpbmVkJywgcGFyZW50LCBwYXJlbnQpO1xuICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgfVxuXG4gICAgICBwYXJlbnQuX29uRXJyb3IgPSBudWxsO1xuXG4gICAgICB2YXIgY2hpbGQgPSBuZXcgcGFyZW50LmNvbnN0cnVjdG9yKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCwgbGFiZWwpO1xuICAgICAgdmFyIHJlc3VsdCA9IHBhcmVudC5fcmVzdWx0O1xuXG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5pbnN0cnVtZW50ICYmIGxpYiRyc3ZwJGluc3RydW1lbnQkJGRlZmF1bHQoJ2NoYWluZWQnLCBwYXJlbnQsIGNoaWxkKTtcblxuICAgICAgaWYgKHN0YXRlKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50c1tzdGF0ZSAtIDFdO1xuICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hc3luYyhmdW5jdGlvbigpe1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaW52b2tlQ2FsbGJhY2soc3RhdGUsIGNoaWxkLCBjYWxsYmFjaywgcmVzdWx0KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHRoZW4kJGRlZmF1bHQgPSBsaWIkcnN2cCR0aGVuJCR0aGVuO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkcmVzb2x2ZSQkcmVzb2x2ZShvYmplY3QsIGxhYmVsKSB7XG4gICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICAgICAgaWYgKG9iamVjdCAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QuY29uc3RydWN0b3IgPT09IENvbnN0cnVjdG9yKSB7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICB9XG5cbiAgICAgIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCwgbGFiZWwpO1xuICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIG9iamVjdCk7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdCA9IGxpYiRyc3ZwJHByb21pc2UkcmVzb2x2ZSQkcmVzb2x2ZTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRlbnVtZXJhdG9yJCRtYWtlU2V0dGxlZFJlc3VsdChzdGF0ZSwgcG9zaXRpb24sIHZhbHVlKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdGU6ICdmdWxmaWxsZWQnLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdGU6ICdyZWplY3RlZCcsXG4gICAgICAgICAgcmVhc29uOiB2YWx1ZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IoQ29uc3RydWN0b3IsIGlucHV0LCBhYm9ydE9uUmVqZWN0LCBsYWJlbCkge1xuICAgICAgdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvciA9IENvbnN0cnVjdG9yO1xuICAgICAgdGhpcy5wcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCwgbGFiZWwpO1xuICAgICAgdGhpcy5fYWJvcnRPblJlamVjdCA9IGFib3J0T25SZWplY3Q7XG5cbiAgICAgIGlmICh0aGlzLl92YWxpZGF0ZUlucHV0KGlucHV0KSkge1xuICAgICAgICB0aGlzLl9pbnB1dCAgICAgPSBpbnB1dDtcbiAgICAgICAgdGhpcy5sZW5ndGggICAgID0gaW5wdXQubGVuZ3RoO1xuICAgICAgICB0aGlzLl9yZW1haW5pbmcgPSBpbnB1dC5sZW5ndGg7XG5cbiAgICAgICAgdGhpcy5faW5pdCgpO1xuXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLmxlbmd0aCB8fCAwO1xuICAgICAgICAgIHRoaXMuX2VudW1lcmF0ZSgpO1xuICAgICAgICAgIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdCh0aGlzLnByb21pc2UsIHRoaXMuX3ZhbGlkYXRpb25FcnJvcigpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkZW51bWVyYXRvciQkZGVmYXVsdCA9IGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3I7XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fdmFsaWRhdGVJbnB1dCA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkdXRpbHMkJGlzQXJyYXkoaW5wdXQpO1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fdmFsaWRhdGlvbkVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdBcnJheSBNZXRob2RzIG11c3QgYmUgcHJvdmlkZWQgYW4gQXJyYXknKTtcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX3Jlc3VsdCA9IG5ldyBBcnJheSh0aGlzLmxlbmd0aCk7XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9lbnVtZXJhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsZW5ndGggICAgID0gdGhpcy5sZW5ndGg7XG4gICAgICB2YXIgcHJvbWlzZSAgICA9IHRoaXMucHJvbWlzZTtcbiAgICAgIHZhciBpbnB1dCAgICAgID0gdGhpcy5faW5wdXQ7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBwcm9taXNlLl9zdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HICYmIGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLl9lYWNoRW50cnkoaW5wdXRbaV0sIGkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fc2V0dGxlTWF5YmVUaGVuYWJsZSA9IGZ1bmN0aW9uKGVudHJ5LCBpKSB7XG4gICAgICB2YXIgYyA9IHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3I7XG4gICAgICB2YXIgcmVzb2x2ZSA9IGMucmVzb2x2ZTtcblxuICAgICAgaWYgKHJlc29sdmUgPT09IGxpYiRyc3ZwJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdCkge1xuICAgICAgICB2YXIgdGhlbiA9IGxpYiRyc3ZwJCRpbnRlcm5hbCQkZ2V0VGhlbihlbnRyeSk7XG5cbiAgICAgICAgaWYgKHRoZW4gPT09IGxpYiRyc3ZwJHRoZW4kJGRlZmF1bHQgJiZcbiAgICAgICAgICAgIGVudHJ5Ll9zdGF0ZSAhPT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HKSB7XG4gICAgICAgICAgZW50cnkuX29uRXJyb3IgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX3NldHRsZWRBdChlbnRyeS5fc3RhdGUsIGksIGVudHJ5Ll9yZXN1bHQpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGVuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhpcy5fcmVtYWluaW5nLS07XG4gICAgICAgICAgdGhpcy5fcmVzdWx0W2ldID0gdGhpcy5fbWFrZVJlc3VsdChsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCwgaSwgZW50cnkpO1xuICAgICAgICB9IGVsc2UgaWYgKGMgPT09IGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQpIHtcbiAgICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBjKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCk7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIGVudHJ5LCB0aGVuKTtcbiAgICAgICAgICB0aGlzLl93aWxsU2V0dGxlQXQocHJvbWlzZSwgaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KG5ldyBjKGZ1bmN0aW9uKHJlc29sdmUpIHsgcmVzb2x2ZShlbnRyeSk7IH0pLCBpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KHJlc29sdmUoZW50cnkpLCBpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX2VhY2hFbnRyeSA9IGZ1bmN0aW9uKGVudHJ5LCBpKSB7XG4gICAgICBpZiAobGliJHJzdnAkdXRpbHMkJGlzTWF5YmVUaGVuYWJsZShlbnRyeSkpIHtcbiAgICAgICAgdGhpcy5fc2V0dGxlTWF5YmVUaGVuYWJsZShlbnRyeSwgaSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZW1haW5pbmctLTtcbiAgICAgICAgdGhpcy5fcmVzdWx0W2ldID0gdGhpcy5fbWFrZVJlc3VsdChsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCwgaSwgZW50cnkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fc2V0dGxlZEF0ID0gZnVuY3Rpb24oc3RhdGUsIGksIHZhbHVlKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IHRoaXMucHJvbWlzZTtcblxuICAgICAgaWYgKHByb21pc2UuX3N0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcpIHtcbiAgICAgICAgdGhpcy5fcmVtYWluaW5nLS07XG5cbiAgICAgICAgaWYgKHRoaXMuX2Fib3J0T25SZWplY3QgJiYgc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURUQpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fcmVzdWx0W2ldID0gdGhpcy5fbWFrZVJlc3VsdChzdGF0ZSwgaSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9tYWtlUmVzdWx0ID0gZnVuY3Rpb24oc3RhdGUsIGksIHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl93aWxsU2V0dGxlQXQgPSBmdW5jdGlvbihwcm9taXNlLCBpKSB7XG4gICAgICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG5cbiAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHByb21pc2UsIHVuZGVmaW5lZCwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgZW51bWVyYXRvci5fc2V0dGxlZEF0KGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVELCBpLCB2YWx1ZSk7XG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgZW51bWVyYXRvci5fc2V0dGxlZEF0KGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURUQsIGksIHJlYXNvbik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkYWxsJCRhbGwoZW50cmllcywgbGFiZWwpIHtcbiAgICAgIHJldHVybiBuZXcgbGliJHJzdnAkZW51bWVyYXRvciQkZGVmYXVsdCh0aGlzLCBlbnRyaWVzLCB0cnVlIC8qIGFib3J0IG9uIHJlamVjdCAqLywgbGFiZWwpLnByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJGFsbCQkZGVmYXVsdCA9IGxpYiRyc3ZwJHByb21pc2UkYWxsJCRhbGw7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSRyYWNlJCRyYWNlKGVudHJpZXMsIGxhYmVsKSB7XG4gICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICAgICAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3IobGliJHJzdnAkJGludGVybmFsJCRub29wLCBsYWJlbCk7XG5cbiAgICAgIGlmICghbGliJHJzdnAkdXRpbHMkJGlzQXJyYXkoZW50cmllcykpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhbiBhcnJheSB0byByYWNlLicpKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBsZW5ndGggPSBlbnRyaWVzLmxlbmd0aDtcblxuICAgICAgZnVuY3Rpb24gb25GdWxmaWxsbWVudCh2YWx1ZSkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBvblJlamVjdGlvbihyZWFzb24pIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IHByb21pc2UuX3N0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkc3Vic2NyaWJlKENvbnN0cnVjdG9yLnJlc29sdmUoZW50cmllc1tpXSksIHVuZGVmaW5lZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkcmFjZSQkZGVmYXVsdCA9IGxpYiRyc3ZwJHByb21pc2UkcmFjZSQkcmFjZTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJHJlamVjdCQkcmVqZWN0KHJlYXNvbiwgbGFiZWwpIHtcbiAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuICAgICAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3IobGliJHJzdnAkJGludGVybmFsJCRub29wLCBsYWJlbCk7XG4gICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJHJlamVjdCQkZGVmYXVsdCA9IGxpYiRyc3ZwJHByb21pc2UkcmVqZWN0JCRyZWplY3Q7XG5cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSQkZ3VpZEtleSA9ICdyc3ZwXycgKyBsaWIkcnN2cCR1dGlscyQkbm93KCkgKyAnLSc7XG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkJGNvdW50ZXIgPSAwO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSQkbmVlZHNSZXNvbHZlcigpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYSByZXNvbHZlciBmdW5jdGlvbiBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIHByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJCRuZWVkc05ldygpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gY29uc3RydWN0ICdQcm9taXNlJzogUGxlYXNlIHVzZSB0aGUgJ25ldycgb3BlcmF0b3IsIHRoaXMgb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi5cIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZShyZXNvbHZlciwgbGFiZWwpIHtcbiAgICAgIHRoaXMuX2lkID0gbGliJHJzdnAkcHJvbWlzZSQkY291bnRlcisrO1xuICAgICAgdGhpcy5fbGFiZWwgPSBsYWJlbDtcbiAgICAgIHRoaXMuX3N0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcblxuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuaW5zdHJ1bWVudCAmJiBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0KCdjcmVhdGVkJywgdGhpcyk7XG5cbiAgICAgIGlmIChsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AgIT09IHJlc29sdmVyKSB7XG4gICAgICAgIHR5cGVvZiByZXNvbHZlciAhPT0gJ2Z1bmN0aW9uJyAmJiBsaWIkcnN2cCRwcm9taXNlJCRuZWVkc1Jlc29sdmVyKCk7XG4gICAgICAgIHRoaXMgaW5zdGFuY2VvZiBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlID8gbGliJHJzdnAkJGludGVybmFsJCRpbml0aWFsaXplUHJvbWlzZSh0aGlzLCByZXNvbHZlcikgOiBsaWIkcnN2cCRwcm9taXNlJCRuZWVkc05ldygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0ID0gbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZTtcblxuICAgIC8vIGRlcHJlY2F0ZWRcbiAgICBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlLmNhc3QgPSBsaWIkcnN2cCRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZS5hbGwgPSBsaWIkcnN2cCRwcm9taXNlJGFsbCQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlLnJhY2UgPSBsaWIkcnN2cCRwcm9taXNlJHJhY2UkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZS5yZXNvbHZlID0gbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UucmVqZWN0ID0gbGliJHJzdnAkcHJvbWlzZSRyZWplY3QkJGRlZmF1bHQ7XG5cbiAgICBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlLnByb3RvdHlwZSA9IHtcbiAgICAgIGNvbnN0cnVjdG9yOiBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlLFxuXG4gICAgICBfZ3VpZEtleTogbGliJHJzdnAkcHJvbWlzZSQkZ3VpZEtleSxcblxuICAgICAgX29uRXJyb3I6IGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgdmFyIHByb21pc2UgPSB0aGlzO1xuICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hZnRlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAocHJvbWlzZS5fb25FcnJvcikge1xuICAgICAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWdbJ3RyaWdnZXInXSgnZXJyb3InLCByZWFzb24sIHByb21pc2UuX2xhYmVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgIC8qKlxuICAgICAgVGhlIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsXG4gICAgICB3aGljaCByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZVxuICAgICAgcmVhc29uIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAvLyB1c2VyIGlzIGF2YWlsYWJsZVxuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgLy8gdXNlciBpcyB1bmF2YWlsYWJsZSwgYW5kIHlvdSBhcmUgZ2l2ZW4gdGhlIHJlYXNvbiB3aHlcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIENoYWluaW5nXG4gICAgICAtLS0tLS0tLVxuXG4gICAgICBUaGUgcmV0dXJuIHZhbHVlIG9mIGB0aGVuYCBpcyBpdHNlbGYgYSBwcm9taXNlLiAgVGhpcyBzZWNvbmQsICdkb3duc3RyZWFtJ1xuICAgICAgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZpcnN0IHByb21pc2UncyBmdWxmaWxsbWVudFxuICAgICAgb3IgcmVqZWN0aW9uIGhhbmRsZXIsIG9yIHJlamVjdGVkIGlmIHRoZSBoYW5kbGVyIHRocm93cyBhbiBleGNlcHRpb24uXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHVzZXIubmFtZTtcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgcmV0dXJuICdkZWZhdWx0IG5hbWUnO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAodXNlck5hbWUpIHtcbiAgICAgICAgLy8gSWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGB1c2VyTmFtZWAgd2lsbCBiZSB0aGUgdXNlcidzIG5hbWUsIG90aGVyd2lzZSBpdFxuICAgICAgICAvLyB3aWxsIGJlIGAnZGVmYXVsdCBuYW1lJ2BcbiAgICAgIH0pO1xuXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScpO1xuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgLy8gaWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGByZWFzb25gIHdpbGwgYmUgJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jy5cbiAgICAgICAgLy8gSWYgYGZpbmRVc2VyYCByZWplY3RlZCwgYHJlYXNvbmAgd2lsbCBiZSAnYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScuXG4gICAgICB9KTtcbiAgICAgIGBgYFxuICAgICAgSWYgdGhlIGRvd25zdHJlYW0gcHJvbWlzZSBkb2VzIG5vdCBzcGVjaWZ5IGEgcmVqZWN0aW9uIGhhbmRsZXIsIHJlamVjdGlvbiByZWFzb25zIHdpbGwgYmUgcHJvcGFnYXRlZCBmdXJ0aGVyIGRvd25zdHJlYW0uXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IFBlZGFnb2dpY2FsRXhjZXB0aW9uKCdVcHN0cmVhbSBlcnJvcicpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAvLyBUaGUgYFBlZGdhZ29jaWFsRXhjZXB0aW9uYCBpcyBwcm9wYWdhdGVkIGFsbCB0aGUgd2F5IGRvd24gdG8gaGVyZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQXNzaW1pbGF0aW9uXG4gICAgICAtLS0tLS0tLS0tLS1cblxuICAgICAgU29tZXRpbWVzIHRoZSB2YWx1ZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgdG8gYSBkb3duc3RyZWFtIHByb21pc2UgY2FuIG9ubHkgYmVcbiAgICAgIHJldHJpZXZlZCBhc3luY2hyb25vdXNseS4gVGhpcyBjYW4gYmUgYWNoaWV2ZWQgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiB0aGVcbiAgICAgIGZ1bGZpbGxtZW50IG9yIHJlamVjdGlvbiBoYW5kbGVyLiBUaGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgdGhlbiBiZSBwZW5kaW5nXG4gICAgICB1bnRpbCB0aGUgcmV0dXJuZWQgcHJvbWlzZSBpcyBzZXR0bGVkLiBUaGlzIGlzIGNhbGxlZCAqYXNzaW1pbGF0aW9uKi5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgICAvLyBUaGUgdXNlcidzIGNvbW1lbnRzIGFyZSBub3cgYXZhaWxhYmxlXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBJZiB0aGUgYXNzaW1saWF0ZWQgcHJvbWlzZSByZWplY3RzLCB0aGVuIHRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCBhbHNvIHJlamVjdC5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIGZ1bGZpbGxzLCB3ZSdsbCBoYXZlIHRoZSB2YWx1ZSBoZXJlXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgcmVqZWN0cywgd2UnbGwgaGF2ZSB0aGUgcmVhc29uIGhlcmVcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFNpbXBsZSBFeGFtcGxlXG4gICAgICAtLS0tLS0tLS0tLS0tLVxuXG4gICAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG5cbiAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IGZpbmRSZXN1bHQoKTtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfVxuICAgICAgYGBgXG5cbiAgICAgIEVycmJhY2sgRXhhbXBsZVxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFJlc3VsdChmdW5jdGlvbihyZXN1bHQsIGVycil7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAvLyBmYWlsdXJlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBQcm9taXNlIEV4YW1wbGU7XG5cbiAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgIGZpbmRSZXN1bHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEFkdmFuY2VkIEV4YW1wbGVcbiAgICAgIC0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgdmFyIGF1dGhvciwgYm9va3M7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGF1dGhvciA9IGZpbmRBdXRob3IoKTtcbiAgICAgICAgYm9va3MgID0gZmluZEJvb2tzQnlBdXRob3IoYXV0aG9yKTtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfVxuICAgICAgYGBgXG5cbiAgICAgIEVycmJhY2sgRXhhbXBsZVxuXG4gICAgICBgYGBqc1xuXG4gICAgICBmdW5jdGlvbiBmb3VuZEJvb2tzKGJvb2tzKSB7XG5cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZmFpbHVyZShyZWFzb24pIHtcblxuICAgICAgfVxuXG4gICAgICBmaW5kQXV0aG9yKGZ1bmN0aW9uKGF1dGhvciwgZXJyKXtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICAvLyBmYWlsdXJlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZpbmRCb29va3NCeUF1dGhvcihhdXRob3IsIGZ1bmN0aW9uKGJvb2tzLCBlcnIpIHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgZm91bmRCb29rcyhib29rcyk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgICAgICAgICAgIGZhaWx1cmUocmVhc29uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBQcm9taXNlIEV4YW1wbGU7XG5cbiAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgIGZpbmRBdXRob3IoKS5cbiAgICAgICAgdGhlbihmaW5kQm9va3NCeUF1dGhvcikuXG4gICAgICAgIHRoZW4oZnVuY3Rpb24oYm9va3Mpe1xuICAgICAgICAgIC8vIGZvdW5kIGJvb2tzXG4gICAgICB9KS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQG1ldGhvZCB0aGVuXG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvbkZ1bGZpbGxtZW50XG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGlvblxuICAgICAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgbGFiZWxpbmcgdGhlIHByb21pc2UuXG4gICAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAgICovXG4gICAgICB0aGVuOiBsaWIkcnN2cCR0aGVuJCRkZWZhdWx0LFxuXG4gICAgLyoqXG4gICAgICBgY2F0Y2hgIGlzIHNpbXBseSBzdWdhciBmb3IgYHRoZW4odW5kZWZpbmVkLCBvblJlamVjdGlvbilgIHdoaWNoIG1ha2VzIGl0IHRoZSBzYW1lXG4gICAgICBhcyB0aGUgY2F0Y2ggYmxvY2sgb2YgYSB0cnkvY2F0Y2ggc3RhdGVtZW50LlxuXG4gICAgICBgYGBqc1xuICAgICAgZnVuY3Rpb24gZmluZEF1dGhvcigpe1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkbid0IGZpbmQgdGhhdCBhdXRob3InKTtcbiAgICAgIH1cblxuICAgICAgLy8gc3luY2hyb25vdXNcbiAgICAgIHRyeSB7XG4gICAgICAgIGZpbmRBdXRob3IoKTtcbiAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICB9XG5cbiAgICAgIC8vIGFzeW5jIHdpdGggcHJvbWlzZXNcbiAgICAgIGZpbmRBdXRob3IoKS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQG1ldGhvZCBjYXRjaFxuICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3Rpb25cbiAgICAgIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGxhYmVsaW5nIHRoZSBwcm9taXNlLlxuICAgICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgICAgQHJldHVybiB7UHJvbWlzZX1cbiAgICAqL1xuICAgICAgJ2NhdGNoJzogZnVuY3Rpb24ob25SZWplY3Rpb24sIGxhYmVsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGlvbiwgbGFiZWwpO1xuICAgICAgfSxcblxuICAgIC8qKlxuICAgICAgYGZpbmFsbHlgIHdpbGwgYmUgaW52b2tlZCByZWdhcmRsZXNzIG9mIHRoZSBwcm9taXNlJ3MgZmF0ZSBqdXN0IGFzIG5hdGl2ZVxuICAgICAgdHJ5L2NhdGNoL2ZpbmFsbHkgYmVoYXZlc1xuXG4gICAgICBTeW5jaHJvbm91cyBleGFtcGxlOlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZEF1dGhvcigpIHtcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEF1dGhvcigpO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gZmluZEF1dGhvcigpOyAvLyBzdWNjZWVkIG9yIGZhaWxcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGZpbmRPdGhlckF1dGhlcigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgLy8gYWx3YXlzIHJ1bnNcbiAgICAgICAgLy8gZG9lc24ndCBhZmZlY3QgdGhlIHJldHVybiB2YWx1ZVxuICAgICAgfVxuICAgICAgYGBgXG5cbiAgICAgIEFzeW5jaHJvbm91cyBleGFtcGxlOlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZEF1dGhvcigpLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIHJldHVybiBmaW5kT3RoZXJBdXRoZXIoKTtcbiAgICAgIH0pLmZpbmFsbHkoZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gYXV0aG9yIHdhcyBlaXRoZXIgZm91bmQsIG9yIG5vdFxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQG1ldGhvZCBmaW5hbGx5XG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgbGFiZWxpbmcgdGhlIHByb21pc2UuXG4gICAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAgICovXG4gICAgICAnZmluYWxseSc6IGZ1bmN0aW9uKGNhbGxiYWNrLCBsYWJlbCkge1xuICAgICAgICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gICAgICAgIHZhciBjb25zdHJ1Y3RvciA9IHByb21pc2UuY29uc3RydWN0b3I7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3IucmVqZWN0KHJlYXNvbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIGxhYmVsKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGZ1bmN0aW9uICBsaWIkcnN2cCQkaW50ZXJuYWwkJHdpdGhPd25Qcm9taXNlKCkge1xuICAgICAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZXMgY2FsbGJhY2sgY2Fubm90IHJldHVybiB0aGF0IHNhbWUgcHJvbWlzZS4nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AoKSB7fVxuXG4gICAgdmFyIGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORyAgID0gdm9pZCAwO1xuICAgIHZhciBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCA9IDE7XG4gICAgdmFyIGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURUQgID0gMjtcblxuICAgIHZhciBsaWIkcnN2cCQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SID0gbmV3IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRXJyb3JPYmplY3QoKTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZ2V0VGhlbihwcm9taXNlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuO1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SLmVycm9yID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBsaWIkcnN2cCQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkdHJ5VGhlbih0aGVuLCB2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcik7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUsIHRoZW4pIHtcbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jKGZ1bmN0aW9uKHByb21pc2UpIHtcbiAgICAgICAgdmFyIHNlYWxlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgZXJyb3IgPSBsaWIkcnN2cCQkaW50ZXJuYWwkJHRyeVRoZW4odGhlbiwgdGhlbmFibGUsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKHNlYWxlZCkgeyByZXR1cm47IH1cbiAgICAgICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgICAgIGlmICh0aGVuYWJsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSwgdW5kZWZpbmVkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAgIGlmIChzZWFsZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICAgIH0sICdTZXR0bGU6ICcgKyAocHJvbWlzZS5fbGFiZWwgfHwgJyB1bmtub3duIHByb21pc2UnKSk7XG5cbiAgICAgICAgaWYgKCFzZWFsZWQgJiYgZXJyb3IpIHtcbiAgICAgICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSwgcHJvbWlzZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSkge1xuICAgICAgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICAgICAgfSBlbHNlIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURUQpIHtcbiAgICAgICAgdGhlbmFibGUuX29uRXJyb3IgPSBudWxsO1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHRoZW5hYmxlLCB1bmRlZmluZWQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKHRoZW5hYmxlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlLCB1bmRlZmluZWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4pIHtcbiAgICAgIGlmIChtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yID09PSBwcm9taXNlLmNvbnN0cnVjdG9yICYmXG4gICAgICAgICAgdGhlbiA9PT0gbGliJHJzdnAkdGhlbiQkZGVmYXVsdCAmJlxuICAgICAgICAgIGNvbnN0cnVjdG9yLnJlc29sdmUgPT09IGxpYiRyc3ZwJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdCkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoZW4gPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1IpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBsaWIkcnN2cCQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SLmVycm9yKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGVuID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobGliJHJzdnAkdXRpbHMkJGlzRnVuY3Rpb24odGhlbikpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpIHtcbiAgICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChsaWIkcnN2cCR1dGlscyQkb2JqZWN0T3JGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlLCBsaWIkcnN2cCQkaW50ZXJuYWwkJGdldFRoZW4odmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRwdWJsaXNoUmVqZWN0aW9uKHByb21pc2UpIHtcbiAgICAgIGlmIChwcm9taXNlLl9vbkVycm9yKSB7XG4gICAgICAgIHByb21pc2UuX29uRXJyb3IocHJvbWlzZS5fcmVzdWx0KTtcbiAgICAgIH1cblxuICAgICAgbGliJHJzdnAkJGludGVybmFsJCRwdWJsaXNoKHByb21pc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSkge1xuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHByb21pc2UuX3Jlc3VsdCA9IHZhbHVlO1xuICAgICAgcHJvbWlzZS5fc3RhdGUgPSBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRDtcblxuICAgICAgaWYgKHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpZiAobGliJHJzdnAkY29uZmlnJCRjb25maWcuaW5zdHJ1bWVudCkge1xuICAgICAgICAgIGxpYiRyc3ZwJGluc3RydW1lbnQkJGRlZmF1bHQoJ2Z1bGZpbGxlZCcsIHByb21pc2UpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hc3luYyhsaWIkcnN2cCQkaW50ZXJuYWwkJHB1Ymxpc2gsIHByb21pc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbikge1xuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcpIHsgcmV0dXJuOyB9XG4gICAgICBwcm9taXNlLl9zdGF0ZSA9IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURUQ7XG4gICAgICBwcm9taXNlLl9yZXN1bHQgPSByZWFzb247XG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hc3luYyhsaWIkcnN2cCQkaW50ZXJuYWwkJHB1Ymxpc2hSZWplY3Rpb24sIHByb21pc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gICAgICB2YXIgc3Vic2NyaWJlcnMgPSBwYXJlbnQuX3N1YnNjcmliZXJzO1xuICAgICAgdmFyIGxlbmd0aCA9IHN1YnNjcmliZXJzLmxlbmd0aDtcblxuICAgICAgcGFyZW50Ll9vbkVycm9yID0gbnVsbDtcblxuICAgICAgc3Vic2NyaWJlcnNbbGVuZ3RoXSA9IGNoaWxkO1xuICAgICAgc3Vic2NyaWJlcnNbbGVuZ3RoICsgbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRURdID0gb25GdWxmaWxsbWVudDtcbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aCArIGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURURdICA9IG9uUmVqZWN0aW9uO1xuXG4gICAgICBpZiAobGVuZ3RoID09PSAwICYmIHBhcmVudC5fc3RhdGUpIHtcbiAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYXN5bmMobGliJHJzdnAkJGludGVybmFsJCRwdWJsaXNoLCBwYXJlbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcHVibGlzaChwcm9taXNlKSB7XG4gICAgICB2YXIgc3Vic2NyaWJlcnMgPSBwcm9taXNlLl9zdWJzY3JpYmVycztcbiAgICAgIHZhciBzZXR0bGVkID0gcHJvbWlzZS5fc3RhdGU7XG5cbiAgICAgIGlmIChsaWIkcnN2cCRjb25maWckJGNvbmZpZy5pbnN0cnVtZW50KSB7XG4gICAgICAgIGxpYiRyc3ZwJGluc3RydW1lbnQkJGRlZmF1bHQoc2V0dGxlZCA9PT0gbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQgPyAnZnVsZmlsbGVkJyA6ICdyZWplY3RlZCcsIHByb21pc2UpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSB7IHJldHVybjsgfVxuXG4gICAgICB2YXIgY2hpbGQsIGNhbGxiYWNrLCBkZXRhaWwgPSBwcm9taXNlLl9yZXN1bHQ7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICAgICAgY2hpbGQgPSBzdWJzY3JpYmVyc1tpXTtcbiAgICAgICAgY2FsbGJhY2sgPSBzdWJzY3JpYmVyc1tpICsgc2V0dGxlZF07XG5cbiAgICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2soZGV0YWlsKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkRXJyb3JPYmplY3QoKSB7XG4gICAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IgPSBuZXcgbGliJHJzdnAkJGludGVybmFsJCRFcnJvck9iamVjdCgpO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCR0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZGV0YWlsKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJFRSWV9DQVRDSF9FUlJPUi5lcnJvciA9IGU7XG4gICAgICAgIHJldHVybiBsaWIkcnN2cCQkaW50ZXJuYWwkJFRSWV9DQVRDSF9FUlJPUjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJGludm9rZUNhbGxiYWNrKHNldHRsZWQsIHByb21pc2UsIGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgICAgIHZhciBoYXNDYWxsYmFjayA9IGxpYiRyc3ZwJHV0aWxzJCRpc0Z1bmN0aW9uKGNhbGxiYWNrKSxcbiAgICAgICAgICB2YWx1ZSwgZXJyb3IsIHN1Y2NlZWRlZCwgZmFpbGVkO1xuXG4gICAgICBpZiAoaGFzQ2FsbGJhY2spIHtcbiAgICAgICAgdmFsdWUgPSBsaWIkcnN2cCQkaW50ZXJuYWwkJHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpO1xuXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IpIHtcbiAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgICAgIGVycm9yID0gdmFsdWUuZXJyb3I7XG4gICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBsaWIkcnN2cCQkaW50ZXJuYWwkJHdpdGhPd25Qcm9taXNlKCkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGRldGFpbDtcbiAgICAgICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcpIHtcbiAgICAgICAgLy8gbm9vcFxuICAgICAgfSBlbHNlIGlmIChoYXNDYWxsYmFjayAmJiBzdWNjZWVkZWQpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoZmFpbGVkKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gbGliJHJzdnAkJGludGVybmFsJCRSRUpFQ1RFRCkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRpbml0aWFsaXplUHJvbWlzZShwcm9taXNlLCByZXNvbHZlcikge1xuICAgICAgdmFyIHJlc29sdmVkID0gZmFsc2U7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlcihmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSl7XG4gICAgICAgICAgaWYgKHJlc29sdmVkKSB7IHJldHVybjsgfVxuICAgICAgICAgIHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICB9LCBmdW5jdGlvbiByZWplY3RQcm9taXNlKHJlYXNvbikge1xuICAgICAgICAgIGlmIChyZXNvbHZlZCkgeyByZXR1cm47IH1cbiAgICAgICAgICByZXNvbHZlZCA9IHRydWU7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYWxsJHNldHRsZWQkJEFsbFNldHRsZWQoQ29uc3RydWN0b3IsIGVudHJpZXMsIGxhYmVsKSB7XG4gICAgICB0aGlzLl9zdXBlckNvbnN0cnVjdG9yKENvbnN0cnVjdG9yLCBlbnRyaWVzLCBmYWxzZSAvKiBkb24ndCBhYm9ydCBvbiByZWplY3QgKi8sIGxhYmVsKTtcbiAgICB9XG5cbiAgICBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkQWxsU2V0dGxlZC5wcm90b3R5cGUgPSBsaWIkcnN2cCR1dGlscyQkb19jcmVhdGUobGliJHJzdnAkZW51bWVyYXRvciQkZGVmYXVsdC5wcm90b3R5cGUpO1xuICAgIGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRBbGxTZXR0bGVkLnByb3RvdHlwZS5fc3VwZXJDb25zdHJ1Y3RvciA9IGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkYWxsJHNldHRsZWQkJEFsbFNldHRsZWQucHJvdG90eXBlLl9tYWtlUmVzdWx0ID0gbGliJHJzdnAkZW51bWVyYXRvciQkbWFrZVNldHRsZWRSZXN1bHQ7XG4gICAgbGliJHJzdnAkYWxsJHNldHRsZWQkJEFsbFNldHRsZWQucHJvdG90eXBlLl92YWxpZGF0aW9uRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ2FsbFNldHRsZWQgbXVzdCBiZSBjYWxsZWQgd2l0aCBhbiBhcnJheScpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkYWxsU2V0dGxlZChlbnRyaWVzLCBsYWJlbCkge1xuICAgICAgcmV0dXJuIG5ldyBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkQWxsU2V0dGxlZChsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LCBlbnRyaWVzLCBsYWJlbCkucHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRkZWZhdWx0ID0gbGliJHJzdnAkYWxsJHNldHRsZWQkJGFsbFNldHRsZWQ7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYWxsJCRhbGwoYXJyYXksIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5hbGwoYXJyYXksIGxhYmVsKTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGFsbCQkZGVmYXVsdCA9IGxpYiRyc3ZwJGFsbCQkYWxsO1xuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRsZW4gPSAwO1xuICAgIHZhciBsaWIkcnN2cCRhc2FwJCR0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuICAgIHZhciBsaWIkcnN2cCRhc2FwJCR2ZXJ0eE5leHQ7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkYXNhcChjYWxsYmFjaywgYXJnKSB7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRxdWV1ZVtsaWIkcnN2cCRhc2FwJCRsZW5dID0gY2FsbGJhY2s7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRxdWV1ZVtsaWIkcnN2cCRhc2FwJCRsZW4gKyAxXSA9IGFyZztcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJGxlbiArPSAyO1xuICAgICAgaWYgKGxpYiRyc3ZwJGFzYXAkJGxlbiA9PT0gMikge1xuICAgICAgICAvLyBJZiBsZW4gaXMgMSwgdGhhdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gc2NoZWR1bGUgYW4gYXN5bmMgZmx1c2guXG4gICAgICAgIC8vIElmIGFkZGl0aW9uYWwgY2FsbGJhY2tzIGFyZSBxdWV1ZWQgYmVmb3JlIHRoZSBxdWV1ZSBpcyBmbHVzaGVkLCB0aGV5XG4gICAgICAgIC8vIHdpbGwgYmUgcHJvY2Vzc2VkIGJ5IHRoaXMgZmx1c2ggdGhhdCB3ZSBhcmUgc2NoZWR1bGluZy5cbiAgICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRkZWZhdWx0ID0gbGliJHJzdnAkYXNhcCQkYXNhcDtcblxuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRicm93c2VyV2luZG93ID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSA/IHdpbmRvdyA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkYnJvd3Nlckdsb2JhbCA9IGxpYiRyc3ZwJGFzYXAkJGJyb3dzZXJXaW5kb3cgfHwge307XG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gbGliJHJzdnAkYXNhcCQkYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGxpYiRyc3ZwJGFzYXAkJGJyb3dzZXJHbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkaXNOb2RlID0gdHlwZW9mIHNlbGYgPT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYge30udG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nO1xuXG4gICAgLy8gdGVzdCBmb3Igd2ViIHdvcmtlciBidXQgbm90IGluIElFMTBcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkaXNXb3JrZXIgPSB0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2YgaW1wb3J0U2NyaXB0cyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAhPT0gJ3VuZGVmaW5lZCc7XG5cbiAgICAvLyBub2RlXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkdXNlTmV4dFRpY2soKSB7XG4gICAgICB2YXIgbmV4dFRpY2sgPSBwcm9jZXNzLm5leHRUaWNrO1xuICAgICAgLy8gbm9kZSB2ZXJzaW9uIDAuMTAueCBkaXNwbGF5cyBhIGRlcHJlY2F0aW9uIHdhcm5pbmcgd2hlbiBuZXh0VGljayBpcyB1c2VkIHJlY3Vyc2l2ZWx5XG4gICAgICAvLyBzZXRJbW1lZGlhdGUgc2hvdWxkIGJlIHVzZWQgaW5zdGVhZCBpbnN0ZWFkXG4gICAgICB2YXIgdmVyc2lvbiA9IHByb2Nlc3MudmVyc2lvbnMubm9kZS5tYXRjaCgvXig/OihcXGQrKVxcLik/KD86KFxcZCspXFwuKT8oXFwqfFxcZCspJC8pO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmVyc2lvbikgJiYgdmVyc2lvblsxXSA9PT0gJzAnICYmIHZlcnNpb25bMl0gPT09ICcxMCcpIHtcbiAgICAgICAgbmV4dFRpY2sgPSBzZXRJbW1lZGlhdGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIG5leHRUaWNrKGxpYiRyc3ZwJGFzYXAkJGZsdXNoKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gdmVydHhcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCR1c2VWZXJ0eFRpbWVyKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBsaWIkcnN2cCRhc2FwJCR2ZXJ0eE5leHQobGliJHJzdnAkYXNhcCQkZmx1c2gpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCR1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgdmFyIG9ic2VydmVyID0gbmV3IGxpYiRyc3ZwJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGxpYiRyc3ZwJGFzYXAkJGZsdXNoKTtcbiAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgbm9kZS5kYXRhID0gKGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gd2ViIHdvcmtlclxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJHVzZU1lc3NhZ2VDaGFubmVsKCkge1xuICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGliJHJzdnAkYXNhcCQkZmx1c2g7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCR1c2VTZXRUaW1lb3V0KCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGxpYiRyc3ZwJGFzYXAkJGZsdXNoLCAxKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJHF1ZXVlID0gbmV3IEFycmF5KDEwMDApO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJGZsdXNoKCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaWIkcnN2cCRhc2FwJCRsZW47IGkrPTIpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gbGliJHJzdnAkYXNhcCQkcXVldWVbaV07XG4gICAgICAgIHZhciBhcmcgPSBsaWIkcnN2cCRhc2FwJCRxdWV1ZVtpKzFdO1xuXG4gICAgICAgIGNhbGxiYWNrKGFyZyk7XG5cbiAgICAgICAgbGliJHJzdnAkYXNhcCQkcXVldWVbaV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIGxpYiRyc3ZwJGFzYXAkJHF1ZXVlW2krMV0gPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGxpYiRyc3ZwJGFzYXAkJGxlbiA9IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkYXR0ZW1wdFZlcnRleCgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciByID0gcmVxdWlyZTtcbiAgICAgICAgdmFyIHZlcnR4ID0gcigndmVydHgnKTtcbiAgICAgICAgbGliJHJzdnAkYXNhcCQkdmVydHhOZXh0ID0gdmVydHgucnVuT25Mb29wIHx8IHZlcnR4LnJ1bk9uQ29udGV4dDtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJGFzYXAkJHVzZVZlcnR4VGltZXIoKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm4gbGliJHJzdnAkYXNhcCQkdXNlU2V0VGltZW91dCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRzY2hlZHVsZUZsdXNoO1xuICAgIC8vIERlY2lkZSB3aGF0IGFzeW5jIG1ldGhvZCB0byB1c2UgdG8gdHJpZ2dlcmluZyBwcm9jZXNzaW5nIG9mIHF1ZXVlZCBjYWxsYmFja3M6XG4gICAgaWYgKGxpYiRyc3ZwJGFzYXAkJGlzTm9kZSkge1xuICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRyc3ZwJGFzYXAkJHVzZU5leHRUaWNrKCk7XG4gICAgfSBlbHNlIGlmIChsaWIkcnN2cCRhc2FwJCRCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRyc3ZwJGFzYXAkJHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbiAgICB9IGVsc2UgaWYgKGxpYiRyc3ZwJGFzYXAkJGlzV29ya2VyKSB7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJHJzdnAkYXNhcCQkdXNlTWVzc2FnZUNoYW5uZWwoKTtcbiAgICB9IGVsc2UgaWYgKGxpYiRyc3ZwJGFzYXAkJGJyb3dzZXJXaW5kb3cgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRyc3ZwJGFzYXAkJGF0dGVtcHRWZXJ0ZXgoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRyc3ZwJGFzYXAkJHVzZVNldFRpbWVvdXQoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkZGVmZXIkJGRlZmVyKGxhYmVsKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSB7fTtcblxuICAgICAgZGVmZXJyZWRbJ3Byb21pc2UnXSA9IG5ldyBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0KGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkZWZlcnJlZFsncmVzb2x2ZSddID0gcmVzb2x2ZTtcbiAgICAgICAgZGVmZXJyZWRbJ3JlamVjdCddID0gcmVqZWN0O1xuICAgICAgfSwgbGFiZWwpO1xuXG4gICAgICByZXR1cm4gZGVmZXJyZWQ7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRkZWZlciQkZGVmYXVsdCA9IGxpYiRyc3ZwJGRlZmVyJCRkZWZlcjtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRmaWx0ZXIkJGZpbHRlcihwcm9taXNlcywgZmlsdGVyRm4sIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5hbGwocHJvbWlzZXMsIGxhYmVsKS50aGVuKGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgICBpZiAoIWxpYiRyc3ZwJHV0aWxzJCRpc0Z1bmN0aW9uKGZpbHRlckZuKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJZb3UgbXVzdCBwYXNzIGEgZnVuY3Rpb24gYXMgZmlsdGVyJ3Mgc2Vjb25kIGFyZ3VtZW50LlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoO1xuICAgICAgICB2YXIgZmlsdGVyZWQgPSBuZXcgQXJyYXkobGVuZ3RoKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZmlsdGVyZWRbaV0gPSBmaWx0ZXJGbih2YWx1ZXNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQuYWxsKGZpbHRlcmVkLCBsYWJlbCkudGhlbihmdW5jdGlvbihmaWx0ZXJlZCkge1xuICAgICAgICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgICAgICAgdmFyIG5ld0xlbmd0aCA9IDA7XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyZWRbaV0pIHtcbiAgICAgICAgICAgICAgcmVzdWx0c1tuZXdMZW5ndGhdID0gdmFsdWVzW2ldO1xuICAgICAgICAgICAgICBuZXdMZW5ndGgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXN1bHRzLmxlbmd0aCA9IG5ld0xlbmd0aDtcblxuICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkZmlsdGVyJCRkZWZhdWx0ID0gbGliJHJzdnAkZmlsdGVyJCRmaWx0ZXI7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoKENvbnN0cnVjdG9yLCBvYmplY3QsIGxhYmVsKSB7XG4gICAgICB0aGlzLl9zdXBlckNvbnN0cnVjdG9yKENvbnN0cnVjdG9yLCBvYmplY3QsIHRydWUsIGxhYmVsKTtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRkZWZhdWx0ID0gbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaDtcblxuICAgIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2gucHJvdG90eXBlID0gbGliJHJzdnAkdXRpbHMkJG9fY3JlYXRlKGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQucHJvdG90eXBlKTtcbiAgICBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoLnByb3RvdHlwZS5fc3VwZXJDb25zdHJ1Y3RvciA9IGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX3Jlc3VsdCA9IHt9O1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoLnByb3RvdHlwZS5fdmFsaWRhdGVJbnB1dCA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICByZXR1cm4gaW5wdXQgJiYgdHlwZW9mIGlucHV0ID09PSAnb2JqZWN0JztcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaC5wcm90b3R5cGUuX3ZhbGlkYXRpb25FcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignUHJvbWlzZS5oYXNoIG11c3QgYmUgY2FsbGVkIHdpdGggYW4gb2JqZWN0Jyk7XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2gucHJvdG90eXBlLl9lbnVtZXJhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbnVtZXJhdG9yID0gdGhpcztcbiAgICAgIHZhciBwcm9taXNlICAgID0gZW51bWVyYXRvci5wcm9taXNlO1xuICAgICAgdmFyIGlucHV0ICAgICAgPSBlbnVtZXJhdG9yLl9pbnB1dDtcbiAgICAgIHZhciByZXN1bHRzICAgID0gW107XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBpbnB1dCkge1xuICAgICAgICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORyAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaW5wdXQsIGtleSkpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgcG9zaXRpb246IGtleSxcbiAgICAgICAgICAgIGVudHJ5OiBpbnB1dFtrZXldXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGxlbmd0aCA9IHJlc3VsdHMubGVuZ3RoO1xuICAgICAgZW51bWVyYXRvci5fcmVtYWluaW5nID0gbGVuZ3RoO1xuICAgICAgdmFyIHJlc3VsdDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IHByb21pc2UuX3N0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdHNbaV07XG4gICAgICAgIGVudW1lcmF0b3IuX2VhY2hFbnRyeShyZXN1bHQuZW50cnksIHJlc3VsdC5wb3NpdGlvbik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkSGFzaFNldHRsZWQoQ29uc3RydWN0b3IsIG9iamVjdCwgbGFiZWwpIHtcbiAgICAgIHRoaXMuX3N1cGVyQ29uc3RydWN0b3IoQ29uc3RydWN0b3IsIG9iamVjdCwgZmFsc2UsIGxhYmVsKTtcbiAgICB9XG5cbiAgICBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJEhhc2hTZXR0bGVkLnByb3RvdHlwZSA9IGxpYiRyc3ZwJHV0aWxzJCRvX2NyZWF0ZShsaWIkcnN2cCRwcm9taXNlJGhhc2gkJGRlZmF1bHQucHJvdG90eXBlKTtcbiAgICBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJEhhc2hTZXR0bGVkLnByb3RvdHlwZS5fc3VwZXJDb25zdHJ1Y3RvciA9IGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRIYXNoU2V0dGxlZC5wcm90b3R5cGUuX21ha2VSZXN1bHQgPSBsaWIkcnN2cCRlbnVtZXJhdG9yJCRtYWtlU2V0dGxlZFJlc3VsdDtcblxuICAgIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkSGFzaFNldHRsZWQucHJvdG90eXBlLl92YWxpZGF0aW9uRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ2hhc2hTZXR0bGVkIG11c3QgYmUgY2FsbGVkIHdpdGggYW4gb2JqZWN0Jyk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkaGFzaFNldHRsZWQob2JqZWN0LCBsYWJlbCkge1xuICAgICAgcmV0dXJuIG5ldyBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJEhhc2hTZXR0bGVkKGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQsIG9iamVjdCwgbGFiZWwpLnByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJGRlZmF1bHQgPSBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJGhhc2hTZXR0bGVkO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGhhc2gkJGhhc2gob2JqZWN0LCBsYWJlbCkge1xuICAgICAgcmV0dXJuIG5ldyBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJGRlZmF1bHQobGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdCwgb2JqZWN0LCBsYWJlbCkucHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGhhc2gkJGRlZmF1bHQgPSBsaWIkcnN2cCRoYXNoJCRoYXNoO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG1hcCQkbWFwKHByb21pc2VzLCBtYXBGbiwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LmFsbChwcm9taXNlcywgbGFiZWwpLnRoZW4oZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICAgIGlmICghbGliJHJzdnAkdXRpbHMkJGlzRnVuY3Rpb24obWFwRm4pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIllvdSBtdXN0IHBhc3MgYSBmdW5jdGlvbiBhcyBtYXAncyBzZWNvbmQgYXJndW1lbnQuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGg7XG4gICAgICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KGxlbmd0aCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgIHJlc3VsdHNbaV0gPSBtYXBGbih2YWx1ZXNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQuYWxsKHJlc3VsdHMsIGxhYmVsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkbWFwJCRkZWZhdWx0ID0gbGliJHJzdnAkbWFwJCRtYXA7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRSZXN1bHQoKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRub2RlJCRFUlJPUiA9IG5ldyBsaWIkcnN2cCRub2RlJCRSZXN1bHQoKTtcbiAgICB2YXIgbGliJHJzdnAkbm9kZSQkR0VUX1RIRU5fRVJST1IgPSBuZXcgbGliJHJzdnAkbm9kZSQkUmVzdWx0KCk7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRnZXRUaGVuKG9iaikge1xuICAgICAgdHJ5IHtcbiAgICAgICByZXR1cm4gb2JqLnRoZW47XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIGxpYiRyc3ZwJG5vZGUkJEVSUk9SLnZhbHVlPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJG5vZGUkJEVSUk9SO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkdHJ5QXBwbHkoZiwgcywgYSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZi5hcHBseShzLCBhKTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgbGliJHJzdnAkbm9kZSQkRVJST1IudmFsdWUgPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJG5vZGUkJEVSUk9SO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJG1ha2VPYmplY3QoXywgYXJndW1lbnROYW1lcykge1xuICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgdmFyIG5hbWU7XG4gICAgICB2YXIgaTtcbiAgICAgIHZhciBsZW5ndGggPSBfLmxlbmd0aDtcbiAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGxlbmd0aCk7XG5cbiAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbGVuZ3RoOyB4KyspIHtcbiAgICAgICAgYXJnc1t4XSA9IF9beF07XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhcmd1bWVudE5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG5hbWUgPSBhcmd1bWVudE5hbWVzW2ldO1xuICAgICAgICBvYmpbbmFtZV0gPSBhcmdzW2kgKyAxXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRhcnJheVJlc3VsdChfKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gXy5sZW5ndGg7XG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShsZW5ndGggLSAxKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBhcmdzW2kgLSAxXSA9IF9baV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhcmdzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJHdyYXBUaGVuYWJsZSh0aGVuLCBwcm9taXNlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aGVuOiBmdW5jdGlvbihvbkZ1bEZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICAgICAgICAgIHJldHVybiB0aGVuLmNhbGwocHJvbWlzZSwgb25GdWxGaWxsbWVudCwgb25SZWplY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJGRlbm9kZWlmeShub2RlRnVuYywgb3B0aW9ucykge1xuICAgICAgdmFyIGZuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGwgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShsICsgMSk7XG4gICAgICAgIHZhciBhcmc7XG4gICAgICAgIHZhciBwcm9taXNlSW5wdXQgPSBmYWxzZTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgIGFyZyA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgICAgIGlmICghcHJvbWlzZUlucHV0KSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBjbGVhbiB0aGlzIHVwXG4gICAgICAgICAgICBwcm9taXNlSW5wdXQgPSBsaWIkcnN2cCRub2RlJCRuZWVkc1Byb21pc2VJbnB1dChhcmcpO1xuICAgICAgICAgICAgaWYgKHByb21pc2VJbnB1dCA9PT0gbGliJHJzdnAkbm9kZSQkR0VUX1RIRU5fRVJST1IpIHtcbiAgICAgICAgICAgICAgdmFyIHAgPSBuZXcgbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdChsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3ApO1xuICAgICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwLCBsaWIkcnN2cCRub2RlJCRHRVRfVEhFTl9FUlJPUi52YWx1ZSk7XG4gICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9taXNlSW5wdXQgJiYgcHJvbWlzZUlucHV0ICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgIGFyZyA9IGxpYiRyc3ZwJG5vZGUkJHdyYXBUaGVuYWJsZShwcm9taXNlSW5wdXQsIGFyZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGFyZ3NbaV0gPSBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0KGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCk7XG5cbiAgICAgICAgYXJnc1tsXSA9IGZ1bmN0aW9uKGVyciwgdmFsKSB7XG4gICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGVycik7XG4gICAgICAgICAgZWxzZSBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbCk7XG4gICAgICAgICAgZWxzZSBpZiAob3B0aW9ucyA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCBsaWIkcnN2cCRub2RlJCRhcnJheVJlc3VsdChhcmd1bWVudHMpKTtcbiAgICAgICAgICBlbHNlIGlmIChsaWIkcnN2cCR1dGlscyQkaXNBcnJheShvcHRpb25zKSlcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCBsaWIkcnN2cCRub2RlJCRtYWtlT2JqZWN0KGFyZ3VtZW50cywgb3B0aW9ucykpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWwpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChwcm9taXNlSW5wdXQpIHtcbiAgICAgICAgICByZXR1cm4gbGliJHJzdnAkbm9kZSQkaGFuZGxlUHJvbWlzZUlucHV0KHByb21pc2UsIGFyZ3MsIG5vZGVGdW5jLCBzZWxmKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbGliJHJzdnAkbm9kZSQkaGFuZGxlVmFsdWVJbnB1dChwcm9taXNlLCBhcmdzLCBub2RlRnVuYywgc2VsZik7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGZuLl9fcHJvdG9fXyA9IG5vZGVGdW5jO1xuXG4gICAgICByZXR1cm4gZm47XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJG5vZGUkJGRlZmF1bHQgPSBsaWIkcnN2cCRub2RlJCRkZW5vZGVpZnk7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRoYW5kbGVWYWx1ZUlucHV0KHByb21pc2UsIGFyZ3MsIG5vZGVGdW5jLCBzZWxmKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gbGliJHJzdnAkbm9kZSQkdHJ5QXBwbHkobm9kZUZ1bmMsIHNlbGYsIGFyZ3MpO1xuICAgICAgaWYgKHJlc3VsdCA9PT0gbGliJHJzdnAkbm9kZSQkRVJST1IpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVzdWx0LnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJGhhbmRsZVByb21pc2VJbnB1dChwcm9taXNlLCBhcmdzLCBub2RlRnVuYywgc2VsZil7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5hbGwoYXJncykudGhlbihmdW5jdGlvbihhcmdzKXtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGxpYiRyc3ZwJG5vZGUkJHRyeUFwcGx5KG5vZGVGdW5jLCBzZWxmLCBhcmdzKTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gbGliJHJzdnAkbm9kZSQkRVJST1IpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZXN1bHQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkbmVlZHNQcm9taXNlSW5wdXQoYXJnKSB7XG4gICAgICBpZiAoYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGlmIChhcmcuY29uc3RydWN0b3IgPT09IGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbGliJHJzdnAkbm9kZSQkZ2V0VGhlbihhcmcpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRwbGF0Zm9ybSQkcGxhdGZvcm07XG5cbiAgICAvKiBnbG9iYWwgc2VsZiAqL1xuICAgIGlmICh0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGxpYiRyc3ZwJHBsYXRmb3JtJCRwbGF0Zm9ybSA9IHNlbGY7XG5cbiAgICAvKiBnbG9iYWwgZ2xvYmFsICovXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgbGliJHJzdnAkcGxhdGZvcm0kJHBsYXRmb3JtID0gZ2xvYmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGdsb2JhbDogYHNlbGZgIG9yIGBnbG9iYWxgIGZvdW5kJyk7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHBsYXRmb3JtJCRkZWZhdWx0ID0gbGliJHJzdnAkcGxhdGZvcm0kJHBsYXRmb3JtO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHJhY2UkJHJhY2UoYXJyYXksIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5yYWNlKGFycmF5LCBsYWJlbCk7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRyYWNlJCRkZWZhdWx0ID0gbGliJHJzdnAkcmFjZSQkcmFjZTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRyZWplY3QkJHJlamVjdChyZWFzb24sIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5yZWplY3QocmVhc29uLCBsYWJlbCk7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRyZWplY3QkJGRlZmF1bHQgPSBsaWIkcnN2cCRyZWplY3QkJHJlamVjdDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRyZXNvbHZlJCRyZXNvbHZlKHZhbHVlLCBsYWJlbCkge1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQucmVzb2x2ZSh2YWx1ZSwgbGFiZWwpO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcmVzb2x2ZSQkZGVmYXVsdCA9IGxpYiRyc3ZwJHJlc29sdmUkJHJlc29sdmU7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcmV0aHJvdyQkcmV0aHJvdyhyZWFzb24pIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRocm93IHJlYXNvbjtcbiAgICAgIH0pO1xuICAgICAgdGhyb3cgcmVhc29uO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcmV0aHJvdyQkZGVmYXVsdCA9IGxpYiRyc3ZwJHJldGhyb3ckJHJldGhyb3c7XG5cbiAgICAvLyBkZWZhdWx0c1xuICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jID0gbGliJHJzdnAkYXNhcCQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hZnRlciA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgICBzZXRUaW1lb3V0KGNiLCAwKTtcbiAgICB9O1xuICAgIHZhciBsaWIkcnN2cCQkY2FzdCA9IGxpYiRyc3ZwJHJlc29sdmUkJGRlZmF1bHQ7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGFzeW5jKGNhbGxiYWNrLCBhcmcpIHtcbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jKGNhbGxiYWNrLCBhcmcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRvbigpIHtcbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnWydvbiddLmFwcGx5KGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRvZmYoKSB7XG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1snb2ZmJ10uYXBwbHkobGliJHJzdnAkY29uZmlnJCRjb25maWcsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHVwIGluc3RydW1lbnRhdGlvbiB0aHJvdWdoIGB3aW5kb3cuX19QUk9NSVNFX0lOVFJVTUVOVEFUSU9OX19gXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3dbJ19fUFJPTUlTRV9JTlNUUlVNRU5UQVRJT05fXyddID09PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGxpYiRyc3ZwJCRjYWxsYmFja3MgPSB3aW5kb3dbJ19fUFJPTUlTRV9JTlNUUlVNRU5UQVRJT05fXyddO1xuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWd1cmUoJ2luc3RydW1lbnQnLCB0cnVlKTtcbiAgICAgIGZvciAodmFyIGxpYiRyc3ZwJCRldmVudE5hbWUgaW4gbGliJHJzdnAkJGNhbGxiYWNrcykge1xuICAgICAgICBpZiAobGliJHJzdnAkJGNhbGxiYWNrcy5oYXNPd25Qcm9wZXJ0eShsaWIkcnN2cCQkZXZlbnROYW1lKSkge1xuICAgICAgICAgIGxpYiRyc3ZwJCRvbihsaWIkcnN2cCQkZXZlbnROYW1lLCBsaWIkcnN2cCQkY2FsbGJhY2tzW2xpYiRyc3ZwJCRldmVudE5hbWVdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCR1bWQkJFJTVlAgPSB7XG4gICAgICAncmFjZSc6IGxpYiRyc3ZwJHJhY2UkJGRlZmF1bHQsXG4gICAgICAnUHJvbWlzZSc6IGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQsXG4gICAgICAnYWxsU2V0dGxlZCc6IGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRkZWZhdWx0LFxuICAgICAgJ2hhc2gnOiBsaWIkcnN2cCRoYXNoJCRkZWZhdWx0LFxuICAgICAgJ2hhc2hTZXR0bGVkJzogbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRkZWZhdWx0LFxuICAgICAgJ2Rlbm9kZWlmeSc6IGxpYiRyc3ZwJG5vZGUkJGRlZmF1bHQsXG4gICAgICAnb24nOiBsaWIkcnN2cCQkb24sXG4gICAgICAnb2ZmJzogbGliJHJzdnAkJG9mZixcbiAgICAgICdtYXAnOiBsaWIkcnN2cCRtYXAkJGRlZmF1bHQsXG4gICAgICAnZmlsdGVyJzogbGliJHJzdnAkZmlsdGVyJCRkZWZhdWx0LFxuICAgICAgJ3Jlc29sdmUnOiBsaWIkcnN2cCRyZXNvbHZlJCRkZWZhdWx0LFxuICAgICAgJ3JlamVjdCc6IGxpYiRyc3ZwJHJlamVjdCQkZGVmYXVsdCxcbiAgICAgICdhbGwnOiBsaWIkcnN2cCRhbGwkJGRlZmF1bHQsXG4gICAgICAncmV0aHJvdyc6IGxpYiRyc3ZwJHJldGhyb3ckJGRlZmF1bHQsXG4gICAgICAnZGVmZXInOiBsaWIkcnN2cCRkZWZlciQkZGVmYXVsdCxcbiAgICAgICdFdmVudFRhcmdldCc6IGxpYiRyc3ZwJGV2ZW50cyQkZGVmYXVsdCxcbiAgICAgICdjb25maWd1cmUnOiBsaWIkcnN2cCRjb25maWckJGNvbmZpZ3VyZSxcbiAgICAgICdhc3luYyc6IGxpYiRyc3ZwJCRhc3luY1xuICAgIH07XG5cbiAgICAvKiBnbG9iYWwgZGVmaW5lOnRydWUgbW9kdWxlOnRydWUgd2luZG93OiB0cnVlICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lWydhbWQnXSkge1xuICAgICAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gbGliJHJzdnAkdW1kJCRSU1ZQOyB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZVsnZXhwb3J0cyddKSB7XG4gICAgICBtb2R1bGVbJ2V4cG9ydHMnXSA9IGxpYiRyc3ZwJHVtZCQkUlNWUDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBsaWIkcnN2cCRwbGF0Zm9ybSQkZGVmYXVsdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGxpYiRyc3ZwJHBsYXRmb3JtJCRkZWZhdWx0WydSU1ZQJ10gPSBsaWIkcnN2cCR1bWQkJFJTVlA7XG4gICAgfVxufSkuY2FsbCh0aGlzKTtcblxuIl19

//# sourceMappingURL=algorithm_visualizer.js.map
