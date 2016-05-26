$.ajaxSetup({cache: false, dataType: "text"});

$(document).on('click', 'a', function (e) {
    e.preventDefault();

    if (!window.open($(this).attr('href'), '_blank')) {
        alert('Please allow popups for this site');
    }
});
$('.btn input').click(function (e) {
    e.stopPropagation();
});

var tm = new TracerManager();

$('#interval').on('change', function () {
    tm.interval = Number.parseFloat($(this).val() * 1000);
    showInfoToast('Tracing interval has been set to ' + tm.interval / 1000 + ' second(s).');
});

var $module_container = $('.module_container');
ace.require("ace/ext/language_tools");
var initEditor = function (id) {
    var editor = ace.edit(id);
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    editor.setTheme("ace/theme/tomorrow_night_eighties");
    editor.session.setMode("ace/mode/javascript");
    editor.$blockScrolling = Infinity;
    return editor;
};
var dataEditor = initEditor('data');
var codeEditor = initEditor('code');
var lastFile = null;
dataEditor.on('change', function () {
    var data = dataEditor.getValue();
    if (lastFile) cachedFile[lastFile].data = data;
    try {
        tm.deallocateAll();
        eval(data);
    } catch (err) {
    } finally {
        tm.visualize();
        tm.removeUnallocated();
    }
});
codeEditor.on('change', function () {
    var code = codeEditor.getValue();
    if (lastFile) cachedFile[lastFile].code = code;
});

var cachedFile = {};
var loading = false;
var isScratchPaper = function (category, algorithm) {
    return category == null && algorithm == 'scratch_paper';
};
var getAlgorithmDir = function (category, algorithm) {
    if (isScratchPaper(category, algorithm)) return './algorithm/scratch_paper/';
    return './algorithm/' + category + '/' + algorithm + '/';
};
var getFileDir = function (category, algorithm, file) {
    if (isScratchPaper(category, algorithm)) return './algorithm/scratch_paper/';
    return './algorithm/' + category + '/' + algorithm + '/' + file + '/';
};
var loadFile = function (category, algorithm, file, explanation) {
    if (checkLoading()) return;
    $('#explanation').html(explanation);

    var dir = lastFile = getFileDir(category, algorithm, file);

    if (cachedFile[dir] && cachedFile[dir].data !== undefined && cachedFile[dir].code !== undefined) {
        dataEditor.setValue(cachedFile[dir].data, -1);
        codeEditor.setValue(cachedFile[dir].code, -1);
    } else {
        loading = true;
        cachedFile[dir] = {};
        dataEditor.setValue('');
        codeEditor.setValue('');
        var onFail = function (jqXHR, textStatus, errorThrown) {
            loading = false;
            alert("AJAX call failed: " + textStatus + ", " + errorThrown);
        };
        $.get(dir + 'data.js', function (data) {
            cachedFile[dir].data = data;
            dataEditor.setValue(data, -1);

            $.get(dir + 'code.js', function (code) {
                cachedFile[dir].code = code;
                codeEditor.setValue(code, -1);
                loading = false;
            }).fail(onFail);
        }).fail(onFail);
    }
};
var checkLoading = function () {
    if (loading) {
        showErrorToast('Wait until it completes loading of previous file.');
        return true;
    }
    return false;
};
var showDescription = function (data) {
    var $container = $('#tab_desc > .wrapper');
    $container.empty();
    for (var key in data) {
        if (key) $container.append($('<h3>').html(key));
        var value = data[key];
        if (typeof value === "string") {
            $container.append($('<p>').html(value));
        } else if (Array.isArray(value)) {
            var $ul = $('<ul>');
            $container.append($ul);
            value.forEach(function (li) {
                $ul.append($('<li>').html(li));
            });
        } else if (typeof value === "object") {
            var $ul = $('<ul>');
            $container.append($ul);
            for (var prop in value) {
                $ul.append($('<li>').append($('<strong>').html(prop)).append(' ' + value[prop]));
            }
        }
    }
};
var showAlgorithm = function (category, algorithm) {
    var $menu;
    var category_name;
    var algorithm_name;
    if (isScratchPaper(category, algorithm)) {
        $menu = $('#scratch-paper');
        category_name = '';
        algorithm_name = 'Scratch Paper';
    } else {
        $menu = $('[data-category="' + category + '"][data-algorithm="' + algorithm + '"]');
        category_name = list[category].name;
        algorithm_name = list[category].list[algorithm];
    }
    $('.sidemenu button').removeClass('active');
    $menu.addClass('active');
    $('#btn_desc').click();

    $('#category').html(category_name);
    $('#algorithm').html(algorithm_name);
    $('#tab_desc > .wrapper').empty();
    $('.files_bar > .wrapper').empty();
    $('#explanation').html('');
    lastFile = null;
    dataEditor.setValue('');
    codeEditor.setValue('');
};
var showFiles = function (category, algorithm, files) {
    $('.files_bar > .wrapper').empty();
    var init = false;
    for (var file in files) {
        (function (file, explanation) {
            var $file = $('<button>').append(file).click(function () {
                loadFile(category, algorithm, file, explanation);
                $('.files_bar > .wrapper > button').removeClass('active');
                $(this).addClass('active');
            });
            $('.files_bar > .wrapper').append($file);
            if (!init) {
                init = true;
                $file.click();
            }
        })(file, files[file]);
    }
    $('.files_bar > .wrapper').scroll();
};
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
        console.log(left);
        console.log(right);
        if (clipWidth < right) {
            $wrapper.scrollLeft(scrollLeft + left);
            return false;
        }
    });
});
$('.files_bar > .wrapper').scroll(function () {
    var definitelyBigger = function (x, y) {
        return x > y + 2;
    };
    var $wrapper = $('.files_bar > .wrapper');
    var clipWidth = $wrapper.width();
    var $left = $wrapper.children('button:first-child');
    var $right = $wrapper.children('button:last-child');
    var left = $left.position().left;
    var right = $right.position().left + $right.outerWidth();
    if (definitelyBigger(clipWidth, right)) {
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
var loadAlgorithm = function (category, algorithm) {
    if (checkLoading()) return;
    showAlgorithm(category, algorithm);

    var dir = getAlgorithmDir(category, algorithm);

    $.getJSON(dir + 'desc.json', function (data) {
        var files = data.files;
        delete data.files;

        showDescription(data);
        showFiles(category, algorithm, files);
    });
};
var list = {};
var anyOpened = false;
$.getJSON('./algorithm/category.json', function (data) {
    list = data;
    for (var category in list) {
        (function (category) {
            var $category = $('<button class="category">')
                .append('<i class="fa fa-fw fa-caret-down">')
                .append(list[category].name);
            $category.click(function () {
                $('[data-category="' + category + '"]').toggleClass('collapse');
                $(this).find('i.fa').toggleClass('fa-caret-down fa-caret-up');
            });
            $('#list').append($category);
            var subList = list[category].list;
            for (var algorithm in subList) {
                (function (category, subList, algorithm) {
                    var $algorithm = $('<button class="indent collapse">')
                        .append(subList[algorithm])
                        .attr('data-algorithm', algorithm)
                        .attr('data-category', category)
                        .click(function () {
                            loadAlgorithm(category, algorithm);
                        });
                    $('#list').append($algorithm);
                    if (!anyOpened) {
                        anyOpened = true;
                        $algorithm.click();
                    }
                })(category, subList, algorithm);
            }
        })(category);
    }
});
$('#powered-by').click(function () {
    $('#powered-by-list button').toggleClass('collapse');
});
$('#scratch-paper').click(function () {
    loadAlgorithm(null, 'scratch_paper');
});

var sidemenu_percent;
$('#navigation').click(function () {
    var $sidemenu = $('.sidemenu');
    var $workspace = $('.workspace');
    $sidemenu.toggleClass('active');
    $('.nav-dropdown').toggleClass('fa-caret-down fa-caret-up');
    if ($sidemenu.hasClass('active')) {
        $sidemenu.css('right', (100 - sidemenu_percent) + '%');
        $workspace.css('left', sidemenu_percent + '%');
    } else {
        sidemenu_percent = $workspace.position().left / $('body').width() * 100;
        $sidemenu.css('right', 0);
        $workspace.css('left', 0);
    }
    tm.resize();
});

var showErrorToast = function (err) {
    var $toast = $('<div class="toast error">').append(err);
    $('.toast_container').append($toast);
    setTimeout(function () {
        $toast.fadeOut(function () {
            $toast.remove();
        });
    }, 3000);
};

var showInfoToast = function (info) {
    var $toast = $('<div class="toast info">').append(info);
    $('.toast_container').append($toast);
    setTimeout(function () {
        $toast.fadeOut(function () {
            $toast.remove();
        });
    }, 3000);
};

$('#shared').mouseup(function () {
    $(this).select();
});
$('#btn_share').click(function () {
    var $icon = $(this).find('.fa-share');
    $icon.addClass('fa-spin fa-spin-faster');
    shareScratchPaper(function (url) {
        $icon.removeClass('fa-spin fa-spin-faster');
        $('#shared').removeClass('collapse');
        $('#shared').val(url);
        showInfoToast('Shareable link is created.');
    });
});
$('#btn_run').click(function () {
    $('#btn_trace').click();
    try {
        tm.deallocateAll();
        eval(dataEditor.getValue());
        eval(codeEditor.getValue());
        tm.visualize();
    } catch (err) {
        console.error(err);
        showErrorToast(err);
    } finally {
        tm.removeUnallocated();
    }
});
$('#btn_pause').click(function () {
    if (tm.isPause()) {
        tm.resumeStep();
    } else {
        tm.pauseStep();
    }
});
$('#btn_prev').click(function () {
    tm.pauseStep();
    tm.prevStep();
});
$('#btn_next').click(function () {
    tm.pauseStep();
    tm.nextStep();
});

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

$(window).resize(function () {
    tm.resize();
});

var dividers = [
    ['v', $('.sidemenu'), $('.workspace')],
    ['v', $('.viewer_container'), $('.editor_container')],
    ['h', $('.data_container'), $('.code_container')]
];
for (var i = 0; i < dividers.length; i++) {
    var divider = dividers[i];
    (function (divider) {
        var vertical = divider[0] == 'v';
        var $first = divider[1];
        var $second = divider[2];
        var $parent = $first.parent();
        var thickness = 5;

        var $divider = $('<div class="divider">');
        var dragging = false;
        if (vertical) {
            $divider.addClass('vertical');
            var _left = -thickness / 2;
            $divider.css({
                top: 0,
                bottom: 0,
                left: _left,
                width: thickness
            });
            var x;
            $divider.mousedown(function (e) {
                x = e.pageX;
                dragging = true;
            });
            $(document).mousemove(function (e) {
                if (dragging) {
                    var new_left = $second.position().left + e.pageX - x;
                    var percent = new_left / $parent.width() * 100;
                    percent = Math.min(90, Math.max(10, percent));
                    $first.css('right', (100 - percent) + '%');
                    $second.css('left', percent + '%');
                    x = e.pageX;
                    tm.resize();
                    $('.files_bar > .wrapper').scroll();
                }
            });
            $(document).mouseup(function (e) {
                dragging = false;
            });
        } else {
            $divider.addClass('horizontal');
            var _top = -thickness / 2;
            $divider.css({
                top: _top,
                height: thickness,
                left: 0,
                right: 0
            });
            var y;
            $divider.mousedown(function (e) {
                y = e.pageY;
                dragging = true;
            });
            $(document).mousemove(function (e) {
                if (dragging) {
                    var new_top = $second.position().top + e.pageY - y;
                    var percent = new_top / $parent.height() * 100;
                    percent = Math.min(90, Math.max(10, percent));
                    $first.css('bottom', (100 - percent) + '%');
                    $second.css('top', percent + '%');
                    y = e.pageY;
                    tm.resize();
                }
            });
            $(document).mouseup(function (e) {
                dragging = false;
            });
        }

        $second.append($divider);
    })(divider);
}

$module_container.on('mousedown', '.module_wrapper', function (e) {
    tm.findOwner(this).mousedown(e);
});
$module_container.on('mousemove', '.module_wrapper', function (e) {
    tm.findOwner(this).mousemove(e);
});
$(document).mouseup(function (e) {
    tm.command('mouseup', e);
});
$module_container.on('DOMMouseScroll mousewheel', '.module_wrapper', function (e) {
    tm.findOwner(this).mousewheel(e);
});

// Share scratch paper

var getParameterByName = function (name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

var shareScratchPaper = function (callback) {
    var gist = {
        'description': 'temp',
        'public': true,
        'files': {
            'code.js': {'content': codeEditor.getValue()},
            'data.js': {'content': dataEditor.getValue()}
        }
    };
    $.post('https://api.github.com/gists', JSON.stringify(gist), function (res) {
        var data = JSON.parse(res);
        if (callback) callback(location.protocol + '//' + location.host + location.pathname + '?scratch-paper=' + data.id);
    });
};

var loadScratchPaper = function (gistID) {
    anyOpened = true;
    $.get('https://api.github.com/gists/' + gistID, function (res) {
        var data = JSON.parse(res);
        var category = null;
        var algorithm = 'scratch_paper';
        var dir = getFileDir(category, algorithm, 'scratch_paper');
        cachedFile[dir] = {
            data: data.files['data.js'].content,
            code: data.files['code.js'].content,
            'CREDIT.md': 'Shared by an anonymous user from http://parkjs814.github.io/AlgorithmVisualizer'
        };
        loadAlgorithm(category, algorithm);
    });
};

var gistID = getParameterByName('scratch-paper');
if (gistID) {
    loadScratchPaper(gistID);
}

var toJSON = function (obj) {
    return JSON.stringify(obj, function (key, value) {
        return value === Infinity ? "Infinity" : value;
    });
};

var fromJSON = function (obj) {
    return JSON.parse(obj, function (key, value) {
        return value === "Infinity" ? Infinity : value;
    });
};

var refineNumber = function (number) {
    return number === Infinity ? '∞' : number;
};