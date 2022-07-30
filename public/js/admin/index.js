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

import { renderBuilding } from './building';
import { renderRooms } from './rooms';
import { renderRoom } from './room';
import { renderStudent } from './student';
import { renderLogin } from './login';
import { renderContract } from './contract';
$(document).ready(function () {
	const path = window.location.pathname;
	document.querySelectorAll('.sidebar li a').forEach((el) => {
		console.log(el.pathname, path, el);
		if (el.pathname == path) {
			el.classList.add('active');
		}
	});

	const building = document.querySelector('#building');
	const room = document.querySelector('#room-child');
	const rooms = document.querySelector('#room');
	const student = document.querySelector('#student');
	const login = document.querySelector('#login');
	const contract = document.querySelector('#contract');

	if (building) {
		renderBuilding();
	}

	if (rooms) {
		renderRooms();
	}
	if (room) {
		renderRoom();
	}

	if (student) {
		renderStudent();
	}

	if (login) {
		renderLogin();
	}

	if (contract) {
		renderContract();
	}
});
