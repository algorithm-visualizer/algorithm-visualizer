'use strict';

const app = require('../../app');
const resizeWorkspace = require('../resize_workspace');

const addDividerToDom = (divider) => {
  const [vertical, $first, $second] = divider;
  const $parent = $first.parent();
  const thickness = 5;

  const $divider = $('<div class="divider">');

  let dragging = false;
  if (vertical === 'v') {
    $divider.addClass('vertical');
    const _left = -thickness / 2;
    $divider.css({
      top: 0,
      bottom: 0,
      left: _left,
      width: thickness
    });

    let x;
    $divider.mousedown(({
      pageX
    }) => {
      x = pageX;
      dragging = true;
    });

    $(document).mousemove(({
      pageX
    }) => {
      if (dragging) {
        const new_left = $second.position().left + pageX - x;
        let percent = new_left / $parent.width() * 100;
        percent = Math.min(90, Math.max(10, percent));
        $first.css('right', (100 - percent) + '%');
        $second.css('left', percent + '%');
        x = pageX;
        resizeWorkspace();
      }
    });

    $(document).mouseup(function(e) {
      dragging = false;
    });

  } else {
    $divider.addClass('horizontal');
    const _top = -thickness / 2;
    $divider.css({
      top: _top,
      height: thickness,
      left: 0,
      right: 0
    });

    let y;
    $divider.mousedown(function({
      pageY
    }) {
      y = pageY;
      dragging = true;
    });

    $(document).mousemove(function({
      pageY
    }) {
      if (dragging) {
        const new_top = $second.position().top + pageY - y;
        let percent = new_top / $parent.height() * 100;
        percent = Math.min(90, Math.max(10, percent));
        $first.css('bottom', (100 - percent) + '%');
        $second.css('top', percent + '%');
        y = pageY;
        resizeWorkspace();
      }
    });

    $(document).mouseup(function(e) {
      dragging = false;
    });
  }

  $second.append($divider);
};

module.exports = () => {
  const dividers = [
    ['v', $('.sidemenu'), $('.workspace')],
    ['v', $('.viewer_container'), $('.editor_container')],
    ['h', $('.data_container'), $('.code_container')]
  ];
  for (let i = 0; i < dividers.length; i++) {
    addDividerToDom(dividers[i]);
  }
};