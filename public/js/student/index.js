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
import { renderReflect } from './reflect';
import { getDataAPI } from '../util/fetchAPI';

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
	const reflect = document.querySelector('#reflect');
	if (!login) {
		document
			.querySelector('.logout-btn')
			.addEventListener('click', async () => {
				const res = await getDataAPI('student/logout');
				console.log(res.status);
				if (res.status === 200) {
					location.reload();
				}
			});
	}
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

	if (reflect) {
		renderReflect();
	}
});
