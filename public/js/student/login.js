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

		const studentID = document.querySelector('#studentID').value;
		const password = document.querySelector('#password').value;
		console.log(studentID, password);
		if (!studentID) {
			new Toast({
				message: 'Vui lòng nhập mã sinh viên',
				type: 'danger',
			});
		}

		if (!password) {
			new Toast({
				message: 'Vui lòng nhập mật khẩu',
				type: 'danger',
			});
		}

		try {
			const isSuccess = await postDataAPI('student/login', {
				studentID,
				password,
			});

			if (isSuccess) {
				new Toast({
					message: 'Đăng nhập thành công',
					type: 'success',
				});
				window.location.reload();
			}
		} catch (error) {
			console.log(error);
			new Toast({
				message: 'Đăng nhập thất bại',
				type: 'danger',
			});
		}
	});
};

export { renderLogin };
