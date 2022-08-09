import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';

const renderLogin = async () => {
	const form = document.querySelector('form');
	console.log(form);
	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const email = document.querySelector('#email').value;
		const password = document.querySelector('#password').value;
		console.log(email, password);
		if (!email) {
			Toastify({
				text: 'Vui lòng nhập email',
				duration: 3000,
				style: {
					// background: '#5cb85c', //success
					background: '#d9534f', // danger
				},
			}).showToast();
		}

		if (!password) {
			Toastify({
				text: 'Vui lòng nhập mật khẩu',
				duration: 3000,
				style: {
					// background: '#5cb85c', //success
					background: '#d9534f', // danger
				},
			}).showToast();
		}

		try {
			const isSuccess = await postDataAPI('auth/admin/login', {
				email,
				password,
			});

			if (isSuccess) {
				Toastify({
					text: 'Đăng nhập thành công',
					duration: 3000,
					style: {
						background: '#5cb85c', //success
						// background: '#d9534f', // danger
					},
				}).showToast();
				window.location.reload();
			}
		} catch (error) {
			console.log(error);
			Toastify({
				text: 'Đăng nhập thất bại',
				duration: 3000,
				style: {
					// background: '#5cb85c', //success
					background: '#d9534f', // danger
				},
			}).showToast();
		}
	});
};

export { renderLogin };
