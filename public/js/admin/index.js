const body = document.querySelector('body'),
	sidebar = body.querySelector('nav'),
	toggle = body.querySelector('.toggle'),
	searchBtn = body.querySelector('.search-box'),
	modeSwitch = body.querySelector('.toggle-switch'),
	modeText = body.querySelector('.mode-text');

toggle.addEventListener('click', () => {
	sidebar.classList.toggle('close');
});
// import $ from 'jquery';

// searchBtn.addEventListener('click', () => {
// 	sidebar.classList.remove('close');
// });

import { renderBuilding } from './building';
import { renderRoom } from './room';
import { renderStudent } from './student';
$(document).ready(function () {
	const building = document.querySelector('#building');
	const room = document.querySelector('#room');
	const student = document.querySelector('#student');

	if (building) {
		renderBuilding();
	}

	if (room) {
		renderRoom();
	}

	if (student) {
		renderStudent();
	}
});
