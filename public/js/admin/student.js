import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';
import { pagination } from '../util/pagination';
const createStudent = async (data) => {
	try {
		const res = await postDataAPI('student', data);
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		toast('danger', error.response.data.message);
	}
};

const deleteStudent = async (id) => {
	try {
		const res = await deleteDataAPI(`student/${id}`);
		if (res.status === 204) {
			return true;
		}
	} catch (error) {
		toast('danger', error.response.data.message);
	}
};

const updateStudent = async (id, data) => {
	try {
		const res = await patchDataAPI(`student/${id}`, data);
		if (res.status === 200) {
			return true;
		}
	} catch (error) {
		console.log(error);
	}
};

const renderStudent = async () => {
	const tableList = $('#table')[0];
	const BuildPage = async () => {
		// const sort = document.querySelector('.filter').value;
		// let search = document.querySelector('.search').value;
		// if (!search) {
		// 	search = '';
		// }
		const { data } = await getDataAPI(`student`);
		const listAuthor = data.data;
		const listRender = listAuthor;
		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML =
				`<thead>
                <tr>
                <td class="col">MÃ SỐ SINH VIÊN</td>
                <td class="col">HỌ TÊN</td>
                <td class="col">PHÒNG</td>
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
				
                    <td class="building" ">${student.studentID}</td>
                    <td class="StudentNumber">${student.name}</td>
                    <td class="maxStudent" data-id="${student.room || ''}">${
							student?.room?.name || 'Chưa có phòng'
						}</td>
                    <td class="presentStudent">${student.class}</td>
                    <td>${student.academic}</td>
                    <td>${student.status || ''}</td>
                        
                    <td class="dropleft"><i class="bx bx-dots-vertical-rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="${
											student._id
										}"></i>
					<div class="dropdown-menu" aria-labelledby="${student._id}">
						<div class="dropdown-item" data-toggle='modal' data-target='#infoModal' >Xem</div>
						<div class="dropdown-item" data-toggle='modal' data-target='#updateModal' >Sửa</d>
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
				BuildPage();
				toast('success', 'Thêm mới thành công');
			}
		};
	});

	$('#updateModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');
		const itemBuildingName = item.find('.building').attr('data-id');
		const itemStudentNumber = item.find('.StudentNumber')[0].innerText;
		const itemMaxStudent = item.find('.maxStudent')[0].innerText;
		const itemPresentStudent = item.find('.presentStudent')[0].innerText;

		// Set giá trị khi hiện modal update
		$('#buildingNameUpdate')[0].value = itemBuildingName;
		$('#StudentNumberUpdate')[0].value = itemStudentNumber;
		$('#maxStudentUpdate')[0].value = itemMaxStudent;
		$('#presentStudentUpdate')[0].value = itemPresentStudent;

		const btnUpdate = $('.btn-update')[0];

		btnUpdate.setAttribute('update-id', itemId);
		btnUpdate.onclick = async (e) => {
			const updateId = btnUpdate.getAttribute('update-id');
			const buildingName = $('#buildingNameUpdate')[0].value;
			const StudentNumber = $('#StudentNumberUpdate')[0].value;
			const maxStudent = $('#maxStudentUpdate')[0].value;
			const presentStudent = $('#presentStudentUpdate')[0].value;

			const isSuccess = await updateStudent(updateId, {
				building: buildingName,
				StudentNumber,
				maxStudent,
				presentStudent,
			});

			if (isSuccess) {
				$('#updateModal').modal('hide');
				BuildPage();
				toast('success', 'Cập nhật thành công');
			}
		};
	});

	$('#infoModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const itemBuildingName = item.find('.building').attr('data-id');
		const itemStudentNumber = item.find('.StudentNumber')[0].innerText;
		const itemMaxStudent = item.find('.maxStudent')[0].innerText;
		const itemPresentStudent = item.find('.presentStudent')[0].innerText;

		// Set giá trị khi hiện modal update
		$('#buildingNameInfo')[0].value = itemBuildingName;
		$('#StudentNumberInfo')[0].value = itemStudentNumber;
		$('#maxStudentInfo')[0].value = itemMaxStudent;
		$('#presentStudentInfo')[0].value = itemPresentStudent;
	});

	BuildPage();
};

export { renderStudent };
