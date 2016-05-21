$.ajaxSetup({cache: false, dataType: "text"});

$(document).on('click', 'a', function (e) {
    e.preventDefault();

    var win = window.open($(this).attr('href'), '_blank');
    if (!win) {
        alert('Please allow popups for this site');
    }
});

var $module_container = $('.module_container');
var _tracer = new Tracer();
var initEditor = function (id) {
    var editor = ace.edit(id);
    editor.setTheme("ace/theme/tomorrow_night_eighties");
    editor.session.setMode("ace/mode/javascript");
    editor.$blockScrolling = Infinity;
    return editor;
};
var dataEditor = initEditor('data');
var codeEditor = initEditor('code');
dataEditor.on('change', function () {
    try {
        eval(dataEditor.getValue());
        lastModule = tracer && tracer.module;
        _tracer = tracer;
    } catch (err) {
    }
    _tracer.reset();
});

var loadFile = function (category, algorithm, file, explanation) {
    lastData = null;
    $('#explanation').html(explanation);
    dataEditor.setValue('');
    codeEditor.setValue('');

    var dir = './algorithm/' + category + '/' + algorithm + '/' + file + '/';
    $.get(dir + 'data.js', function (data) {
        dataEditor.setValue(data, -1);

        $.get(dir + 'code.js', function (data) {
            codeEditor.setValue(data, -1);
        });
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert("AJAX call failed: " + textStatus + ", " + errorThrown);
    });
};
var loadAlgorithm = function (category, algorithm) {
    $('#list > button').removeClass('active');
    $('[data-category="' + category + '"][data-algorithm="' + algorithm + '"]').addClass('active');
    $('#btn_desc').click();

    $('#category').text(list[category].name);
    $('#algorithm, #desc_title').text(list[category].list[algorithm]);
    $('#tab_desc > .wrapper').empty();
    $('.files_bar').empty();
    $('#explanation').html('');
    dataEditor.setValue('');
    codeEditor.setValue('');

    var dir = './algorithm/' + category + '/' + algorithm + '/';
    $.getJSON(dir + 'desc.json', function (data) {
        var files = data.files;
        delete data.files;

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

        $('.files_bar').empty();
        var init = false;
        for (var file in files) {
            (function (file, explanation) {
                var $file = $('<button>').append(file).click(function () {
                    loadFile(category, algorithm, file, explanation);
                    $('.files_bar > button').removeClass('active');
                    $(this).addClass('active');
                });
                $('.files_bar').append($file);
                if (!init) {
                    init = true;
                    $file.click();
                }
            })(file, files[file]);
        }
    });
};
var list = {};
$.getJSON('./algorithm/category.json', function (data) {
    list = data;
    var init = false;
    for (var category in list) {
        (function (category) {
            var $category = $('<button class="category">').append(list[category].name);
            $('#list').append($category);
            var subList = list[category].list;
            for (var algorithm in subList) {
                (function (category, subList, algorithm) {
                    var $algorithm = $('<button class="indent">')
                        .append(subList[algorithm])
                        .attr('data-algorithm', algorithm)
                        .attr('data-category', category)
                        .click(function () {
                            loadAlgorithm(category, algorithm);
                        });
                    $('#list').append($algorithm);
                    if (!init) {
                        init = true;
                        $algorithm.click();
                    }
                })(category, subList, algorithm);
            }
        })(category);
    }
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
    _tracer.resize();
});

$('#btn_run').click(function () {
    try {
        eval(dataEditor.getValue());
        lastModule = tracer && tracer.module;
        _tracer = tracer;
        _tracer.reset();
        eval(codeEditor.getValue());
        _tracer.visualize();
    } catch (err) {
        console.error(err);
        var $toast = $('<div class="toast error">').append(err);
        $('.toast_container').append($toast);
        setTimeout(function () {
            $toast.fadeOut(function () {
                $toast.remove();
            });
        }, 3000);
    }
});
$('#btn_pause').click(function () {
    if (_tracer.isPause()) {
        _tracer.resumeStep();
    } else {
        _tracer.pauseStep();
    }
});
$('#btn_prev').click(function () {
    _tracer.pauseStep();
    _tracer.prevStep();
});
$('#btn_next').click(function () {
    _tracer.pauseStep();
    _tracer.nextStep();
});

$('#btn_desc').click(function () {
    $('.tab_container > .tab').removeClass('active');
    $('#tab_desc').addClass('active');
    $('.tab_bar > button').removeClass('active');
    $(this).addClass('active');
});
$('#btn_trace').click(function () {
    $('.tab_container > .tab').removeClass('active');
    $('#tab_trace').addClass('active');
    $('.tab_bar > button').removeClass('active');
    $(this).addClass('active');
});

$(window).resize(_tracer.resize);

var dividers = [
    ['v', $('.sidemenu'), $('.workspace')],
    ['v', $('.viewer_container'), $('.editor_container')],
    ['h', $('.module_container'), $('.tab_container')],
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
        if (vertical) {
            $divider.addClass('vertical');
            var _left = -thickness / 2;
            $divider.css({
                top: 0,
                bottom: 0,
                left: _left,
                width: thickness
            });
            var x, dragging = false;
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
                    _tracer.resize();
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
            var y, dragging = false;
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
                    _tracer.resize();
                }
            });
            $(document).mouseup(function (e) {
                dragging = false;
            });
        }

        $second.append($divider);
    })(divider);
}

$module_container.mousedown(function (e) {
    _tracer.mousedown(e);
});
$module_container.mousemove(function (e) {
    _tracer.mousemove(e);
});
$(document).mouseup(function (e) {
    _tracer.mouseup(e);
});
$module_container.bind('DOMMouseScroll mousewheel', function (e) {
    _tracer.mousewheel(e);
});