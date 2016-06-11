'use strict';

module.exports = () => {
	let $buttons = $('[data-category]');

	$('#search-bar').keyup (function () {
		let re = new RegExp ($(this).val (), 'i');

		if ($(this).val ()) $('#footer').hide ();
		else $('#footer').show ();

		$.each ($('#list .category'), function (i, c) {
			let $c = $(c);
			!$c.hasClass ('open') && $c.click ();
		});

		$buttons.show ().filter (function () {
			let cName = $(this).attr ('data-category');

			if ($(this).hasClass ('category')) {
				//return !re.test ($('[data-category="${cName}"]').text ());
				return !re.test ($('[data-category="' + cName + '"]').text ());
			}
			else {
				return !(
					//re.test ($('.category[data-category="${cName}"]').text()) || re.test ($(this).text ())
					re.test ($('.category[data-category="' + cName + '"]').text()) || re.test ($(this).text ())
				);
			}
		}).hide ();
	});
};