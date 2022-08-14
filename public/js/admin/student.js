import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';
import { pagination } from '../util/pagination';
import { convert } from '../util/convertString';

const createStudent = async (data) => {
	try {
		const res = await postDataAPI('student', data);
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		Toastify({
			text: 'Thêm mới không thành công',
			duration: 3000,
			style: {
				// background: '#5cb85c', //success
				background: '#d9534f', // danger
			},
		}).showToast();
	}
};

const updateStudent = async (id, data) => {
	try {
		const res = await patchDataAPI(`student/${id}`, data);
		if (res.status === 200) {
			return true;
		}
	} catch (error) {
		Toastify({
			text: 'TCập nhật không thành công',
			duration: 3000,
			style: {
				// background: '#5cb85c', //success
				background: '#d9534f', // danger
			},
		}).showToast();
	}
};

const disciplineStudent = async (data) => {
	try {
		const res = await postDataAPI(`student/discipline`, data);
		if (res.status === 200) {
			return true;
		}
	} catch (error) {
		Toastify({
			text: 'Kỷ luật không thành công',
			duration: 3000,
			style: {
				// background: '#5cb85c', //success
				background: '#d9534f', // danger
			},
		}).showToast();
	}
};

const renderStudent = async () => {
	const tableList = $('#table')[0];
	const { data } = await getDataAPI(`student`);
	const BuildPage = async (data) => {
		// const sort = document.querySelector('.filter').value;
		let search = document.querySelector('.search').value;
		if (!search) {
			search = '';
		}

		const listStudent = data.data;
		const listRender = listStudent.filter((item) =>
			convert(item.name).includes(convert(search)),
		);
		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML =
				`<thead>
                <tr>
                <td class="col">MÃ SỐ SINH VIÊN</td>
                <td class="col">HỌ TÊN</td>
                <td class="col">LỚP</td>
                <td class="col">KHOÁ</td>
                <td class="col">TRẠNG THÁI</td>
                <td class="col"></td>
            </tr>
				</thead>
		<tbody >` +
				listRender
					.slice(min, max)
					.map((student) => {
						return `
				<tr class="item-list" data-id=${
					student._id
				} data-bs-toggle="modal" data-bs-target="#infoModal">
				
                    <td class="studentID" ">${student.studentID}</td>
                    <td class="name">${student.name}</td>
                    <td class="class">${student.class}</td>
                    <td class="academic">${student.academic}</td>
                    <td class="status">${student.status}</td>
                    <td class="d-none gender">${student.gender}</td>   
                    <td class="d-none dateOfBirth">${
											student.dateOfBirth
										}</td>   
                    <td class="d-none address">${student.address}</td>   
                    <td class="d-none father">${student.father}</td>   
                    <td class="d-none mother">${student.mother}</td>   
                    <td class="d-none phone">${student.phone}</td>   
                    <td class="dropleft"><i class="bx bx-dots-vertical-rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="${
											student._id
										}"></i>
					<div class="dropdown-menu" aria-labelledby="${student._id}">
						<div class="dropdown-item" data-toggle='modal' data-target='#infoModal' >Xem</div>
						
						${
							!student.discipline
								? `
								<div class="dropdown-item" data-toggle='modal' data-target='#updateModal' >Sửa</div>
								<div class="dropdown-item" data-toggle='modal' data-target='#disciplineModal' >Kỉ luật</div>`
								: ''
						}
				  </div>
					</td>
			
			</tr>
				`;
					})
					.join('') +
				`</tbody>`;

			buildPagination(listRender.length);
		};

		pagination(buildList);
	};

	$('#addNewModal').on('shown.bs.modal', function (e) {
		const addStudent = $('.btn-add-new')[0];

		addStudent.onclick = async (e) => {
			const studentID = document.querySelector('#studentID').value;
			const name = document.querySelector('#name').value;
			const classStudent = document.querySelector('#class').value;
			const academic = document.querySelector('#academic').value;
			const address = document.querySelector('#address').value;
			const dateOfBirth = document.querySelector('#dateOfBirth').value;
			const father = document.querySelector('#father').value;
			const mother = document.querySelector('#mother').value;
			const phone = document.querySelector('#phone').value;
			const gender = document.querySelector(
				'input[name="gender"]:checked',
			).value;

			const isSuccess = await createStudent({
				studentID,
				name,
				class: classStudent,
				academic,
				address,
				dateOfBirth,
				gender,
				father,
				mother,
				phone,
				password: studentID,
			});
			if (isSuccess) {
				document.querySelector('#studentID').value = '';
				document.querySelector('#name').value = '';
				document.querySelector('#class').value = '';
				document.querySelector('#academic').value = '';
				document.querySelector('#address').value = '';
				document.querySelector('#dateOfBirth').value = '';
				document.querySelector('#father').value = '';
				document.querySelector('#mother').value = '';
				$('#addNewModal').modal('hide');
				const { data } = await getDataAPI(`student`);

				BuildPage(data);
				Toastify({
					text: 'Thêm mới thành công',
					duration: 3000,
					style: {
						background: '#5cb85c', //success
						// background: '#d9534f', // danger
					},
				}).showToast();
			}
		};
	});

	$('#updateModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');
		const studentID = item.find('.studentID')[0].innerText;
		const name = item.find('.name')[0].innerText;
		const classStudent = item.find('.class')[0].innerText;
		const academic = item.find('.academic')[0].innerText;
		const address = item.find('.address')[0].innerText;
		const dateOfBirth = item.find('.dateOfBirth')[0].innerText;
		const father = item.find('.father')[0].innerText;
		const mother = item.find('.mother')[0].innerText;
		const phone = item.find('.phone')[0].innerText;
		const gender = item.find('.gender')[0].innerText;

		// Set giá trị khi hiện modal update
		if (gender == 'male') {
			$('#maleGenderUpdate')[0].checked = true;
		} else if (gender == 'female') {
			$('#femaleGenderUpdate')[0].checked = true;
		}
		$('#studentIDUpdate')[0].value = studentID;
		$('#nameUpdate')[0].value = name;
		$('#classUpdate')[0].value = classStudent;
		$('#academicUpdate')[0].value = academic;
		$('#addressUpdate')[0].value = address;
		$('#dateOfBirthUpdate')[0].value = dateOfBirth;
		$('#fatherUpdate')[0].value = father;
		$('#motherUpdate')[0].value = mother;
		$('#phoneUpdate')[0].value = phone;

		const btnUpdate = $('.btn-update')[0];

		btnUpdate.setAttribute('update-id', itemId);
		btnUpdate.onclick = async (e) => {
			const updateId = btnUpdate.getAttribute('update-id');
			const studentID = $('#studentIDUpdate')[0].value;
			const name = $('#nameUpdate')[0].value;
			const classStudent = $('#classUpdate')[0].value;
			const academic = $('#academicUpdate')[0].value;
			const address = $('#addressUpdate')[0].value;
			const dateOfBirth = $('#dateOfBirthUpdate')[0].value;
			const father = $('#fatherUpdate')[0].value;
			const mother = $('#motherUpdate')[0].value;
			const password = $('#passwordUpdate')[0].value;
			const phone = $('#phoneUpdate')[0].value;
			const gender = document.querySelector(
				'input[name="genderUpdate"]:checked',
			).value;

			const isSuccess = await updateStudent(updateId, {
				studentID,
				name,
				classStudent,
				academic,
				address,
				dateOfBirth,
				father,
				phone,
				mother,
				password,
				gender,
			});

			if (isSuccess) {
				$('#updateModal').modal('hide');
				const { data } = await getDataAPI(`student`);

				BuildPage(data);
				Toastify({
					text: 'Cập nhật thành công',
					duration: 3000,
					style: {
						background: '#5cb85c', //success
						// background: '#d9534f', // danger
					},
				}).showToast();
			}
		};
	});

	$('#infoModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const studentID = item.find('.studentID')[0].innerText;
		const name = item.find('.name')[0].innerText;
		const classStudent = item.find('.class')[0].innerText;
		const academic = item.find('.academic')[0].innerText;
		const address = item.find('.address')[0].innerText;
		const dateOfBirth = item.find('.dateOfBirth')[0].innerText;
		const father = item.find('.father')[0].innerText;
		const mother = item.find('.mother')[0].innerText;
		const gender = item.find('.gender')[0].innerText;
		const phone = item.find('.phone')[0].innerText;

		// Set giá trị khi hiện modal update
		if (gender == 'male') {
			$('#maleGenderInfo')[0].checked = true;
		} else if (gender == 'female') {
			$('#femaleGenderInfo')[0].checked = true;
		}
		$('#studentIDInfo')[0].value = studentID;
		$('#nameInfo')[0].value = name;
		$('#classInfo')[0].value = classStudent;
		$('#academicInfo')[0].value = academic;
		$('#addressInfo')[0].value = address;
		$('#dateOfBirthInfo')[0].value = dateOfBirth;
		$('#fatherInfo')[0].value = father;
		$('#motherInfo')[0].value = mother;
		$('#phoneInfo')[0].value = phone;
	});

	$('#disciplineModal').on('show.bs.modal', function (e) {
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');
		const studentID = item.find('.studentID')[0].innerText;
		const name = item.find('.name')[0].innerText;

		$('#studentIDDiscipline')[0].value = studentID;
		$('#nameDiscipline')[0].value = name;
		const btnUpdate = $('.btn-discipline')[0];
		btnUpdate.setAttribute('discipline-id', itemId);
		btnUpdate.onclick = async (e) => {
			const updateId = btnUpdate.getAttribute('discipline-id');
			const note = $('#reasonDiscipline')[0].value;

			const isSuccess = await disciplineStudent({ student: updateId, note });
			if (isSuccess) {
				$('#disciplineModal').modal('hide');
				const { data } = await getDataAPI(`student`);

				BuildPage(data);
				Toastify({
					text: 'Sinh viên đã bị kỷ luật',
					duration: 3000,
					style: {
						background: '#5cb85c', //success
						// background: '#d9534f', // danger
					},
				}).showToast();
			}
		};
	});
	document.querySelector('.search').addEventListener('change', function () {
		BuildPage(data);
	});

	BuildPage(data);
};

export { renderStudent };
