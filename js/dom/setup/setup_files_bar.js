const definitelyBigger = (x, y) => x > (y + 2);

module.exports = () => {

  $('.files_bar > .btn-left').click(() => {
    const $wrapper = $('.files_bar > .wrapper');
    const clipWidth = $wrapper.width();
    const scrollLeft = $wrapper.scrollLeft();

    $($wrapper.children('button').get().reverse()).each(function() {
      const left = $(this).position().left;
      const right = left + $(this).outerWidth();
      if (0 > left) {
        $wrapper.scrollLeft(scrollLeft + right - clipWidth);
        return false;
      }
    });
  });

  $('.files_bar > .btn-right').click(() => {
    const $wrapper = $('.files_bar > .wrapper');
    const clipWidth = $wrapper.width();
    const scrollLeft = $wrapper.scrollLeft();

    $wrapper.children('button').each(function() {
      const left = $(this).position().left;
      const right = left + $(this).outerWidth();
      if (clipWidth < right) {
        $wrapper.scrollLeft(scrollLeft + left);
        return false;
      }
    });
  });

  $('.files_bar > .wrapper').scroll(function() {

    const $wrapper = $('.files_bar > .wrapper');
    const clipWidth = $wrapper.width();
    const $left = $wrapper.children('button:first-child');
    const $right = $wrapper.children('button:last-child');
    const left = $left.position().left;
    const right = $right.position().left + $right.outerWidth();

    if (definitelyBigger(0, left) && definitelyBigger(clipWidth, right)) {
      const scrollLeft = $wrapper.scrollLeft();
      $wrapper.scrollLeft(scrollLeft + clipWidth - right);
      return;
    }

    const lefter = definitelyBigger(0, left);
    const righter = definitelyBigger(right, clipWidth);
    $wrapper.toggleClass('shadow-left', lefter);
    $wrapper.toggleClass('shadow-right', righter);
    $('.files_bar > .btn-left').attr('disabled', !lefter);
    $('.files_bar > .btn-right').attr('disabled', !righter);
  });
}