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
import { renderContract } from './contract';
import { renderRoom } from './room';
import { renderInvoice } from './invoice';

$(document).ready(function () {
	const path = window.location.pathname;
	document.querySelectorAll('.sidebar li a').forEach((el) => {
		console.log(el.pathname, path, el);
		if (el.pathname == path) {
			el.classList.add('active');
		}
	});

	const login = document.querySelector('#login');
	const contract = document.querySelector('#contract');
	const room = document.querySelector('#room');
	const invoice = document.querySelector('#invoice');

	if (login) {
		renderLogin();
	}

	if (contract) {
		renderContract();
	}

	if (room) {
		renderRoom();
	}

	if (invoice) {
		renderInvoice();
	}
});
