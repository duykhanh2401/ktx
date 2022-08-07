import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';
import { pagination } from '../util/pagination';
const addStudent = async (data) => {
	try {
		const res = await postDataAPI('room/addStudent', data);
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		new Toast({
			type: 'danger',
			message: error.response.data.message || 'Tạo mới thất bại',
		});
	}
};

const removeStudent = async (data) => {
	try {
		const res = await postDataAPI(`room/removeStudent`, data);
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		new Toast({
			message: error.response.data.message,
			type: 'danger',
		});
	}
};

const updateRoom = async (id, data) => {
	try {
		const res = await patchDataAPI(`room/${id}`, data);
		if (res.status === 200) {
			return true;
		}
	} catch (error) {
		new Toast({
			message: error.response.data.message,
			type: 'danger',
		});
	}
};

const renderRoom = async () => {
	const tableList = $('#table')[0];
	const BuildPage = async () => {
		const id = document.querySelector('#room-child').getAttribute('data-id');

		// const sort = document.querySelector('.filter').value;
		// let search = document.querySelector('.search').value;
		// if (!search) {
		// 	search = '';
		// }
		const { data } = await getDataAPI(`room/${id}`);
		const listStudent = data.data;
		$('.value-presentStudent')[0].innerHTML = listStudent.length;
		$(
			'.table-header-title',
		)[0].innerHTML = `Thông tin sinh viên (${listStudent.length} sinh viên)`;
		const listRender = listStudent;
		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML =
				`<thead>
                <tr>
                <td class="col">MÃ SỐ SINH VIÊN</td>
                <td class="col">TÊN SINH VIÊN</td>
                <td class="col">LỚP</td>
                <td class="col">KHOÁ</td>
                <td class="col">NGÀY SINH</td>
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
				
                    <td class="building" data-id="${student.studentID}">${
							student.studentID
						}</td>
                    <td class="studentNumber">${student.name}</td>
                    <td class="maxStudent">${student.class}</td>
                    <td class="presentStudent">${student.academic}</td>
                    <td>${new Date(
											student.dateOfBirth,
										).toLocaleDateString()}</td>
          
                    <td class="dropleft"><i class="bx bx-dots-vertical-rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="${
											student._id
										}"></i>
					<div class="dropdown-menu" aria-labelledby="${student._id}">
						<div class="dropdown-item" data-toggle='modal' data-target='#removeModal' >Xoá khỏi phòng</div>
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

	$('#addNewModal').on('shown.bs.modal', async function (e) {
		const id = document.querySelector('#room-child').getAttribute('data-id');

		const { data } = await getDataAPI(`student/no-room`);
		const studentSelectElement = document.querySelector('#studentSelect');
		console.log(studentSelectElement, data);
		studentSelectElement.innerHTML =
			`<option value="">------Chọn Sinh Viên---------</option>` +
			data.data.map((el) => {
				return `<option value="${el.id}">${el.name} - ${el.studentID}</option>`;
			});
		const addRoom = $('.btn-add-new')[0];

		addRoom.onclick = async (e) => {
			const studentSelect = document.querySelector('#studentSelect').value;

			const isSuccess = await addStudent({
				room: id,
				student: studentSelect,
			});
			if (isSuccess) {
				document.querySelector('#studentSelect').value = '';
				$('#addNewModal').modal('hide');
				BuildPage();
				new Toast({
					message: 'Thêm mới thành công',
					type: 'success',
				});
			}
		};
	});

	$('#updateModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');
		const itemBuildingName = item.find('.building').attr('data-id');
		const itemRoomNumber = item.find('.roomNumber')[0].innerText;
		const itemMaxStudent = item.find('.maxStudent')[0].innerText;

		// Set giá trị khi hiện modal update
		$('#buildingNameUpdate')[0].value = itemBuildingName;
		$('#roomNumberUpdate')[0].value = itemRoomNumber;
		$('#maxStudentUpdate')[0].value = itemMaxStudent;

		const btnUpdate = $('.btn-update')[0];

		btnUpdate.setAttribute('update-id', itemId);
		btnUpdate.onclick = async (e) => {
			const updateId = btnUpdate.getAttribute('update-id');
			const buildingName = $('#buildingNameUpdate')[0].value;
			const roomNumber = $('#roomNumberUpdate')[0].value;
			const maxStudent = $('#maxStudentUpdate')[0].value;

			const isSuccess = await updateRoom(updateId, {
				building: buildingName,
				roomNumber,
				maxStudent,
			});

			if (isSuccess) {
				$('#updateModal').modal('hide');
				BuildPage();
				new Toast({
					message: 'Cập nhật thành công',
					type: 'success',
				});
			}
		};
	});

	$('#removeModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const studentId = item.attr('data-id');
		const room = document.querySelector('#room-child').getAttribute('data-id');
		const btnRemove = $('.btn-remove')[0];

		btnRemove.setAttribute('update-id', studentId);

		btnRemove.onclick = async () => {
			const removeId = btnRemove.getAttribute('update-id');

			const isSuccess = await removeStudent({ room, student: removeId });
			if (isSuccess) {
				$('#removeModal').modal('hide');
				BuildPage();
				new Toast({
					message: 'Cập nhật thành công',
					type: 'success',
				});
			}
		};
	});

	BuildPage();
};

export { renderRoom };
