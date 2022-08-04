const body = document.querySelector('body'),
	sidebar = body.querySelector('nav'),
	toggle = body.querySelector('.toggle');

toggle?.addEventListener('click', () => {
	sidebar.classList.toggle('close');
});
// import $ from 'jquery';

// searchBtn.addEventListener('click', () => {
// 	sidebar.classList.remove('close');
// });

import { renderLogin } from './login';

$(document).ready(function () {
	const path = window.location.pathname;
	document.querySelectorAll('.sidebar li a').forEach((el) => {
		console.log(el.pathname, path, el);
		if (el.pathname == path) {
			el.classList.add('active');
		}
	});

	const login = document.querySelector('#login');

	if (login) {
		renderLogin();
	}
});
