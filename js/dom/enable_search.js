'use strict';

module.exports = () => {
	let $buttons = $('[data-category]');

	$('#search-bar').keyup (function () {
		let query = $(this).val ();
		let re = new RegExp (query, 'i');

		query ? $('#footer').hide () : $('#footer').show ();
		$.each ($('#list .category'), function (i, c) {
			let $c = $(c);
			!$c.hasClass ('open') && $c.click ();
		});

		$buttons.show ().filter (function () {
			let cName = $(this).attr ('data-category');

			if ($(this).hasClass ('category')) {
				return !re.test ($(`[data-category="${cName}"]`).text ());
			}
			else {
				return !(
					re.test ($(`.category[data-category="${cName}"]`).text()) || re.test ($(this).text ())
				);
			}
		}).hide ();

		$('.algorithms').show ().filter (function () {
			return !$(this).children (':visible').length;
		}).hide ();
	});
};
