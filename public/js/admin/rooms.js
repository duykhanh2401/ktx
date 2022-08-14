import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';
import { convert } from '../util/convertString';
import { pagination } from '../util/pagination';
const createRoom = async (data) => {
	try {
		const res = await postDataAPI('room', data);
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		Toastify({
			text: error.response.data.message || 'Thêm mới không thành công',
			duration: 3000,
			style: {
				// background: '#5cb85c', //success
				background: '#d9534f', // danger
			},
		}).showToast();
	}
};

const updateRoom = async (id, data) => {
	try {
		const res = await patchDataAPI(`room/${id}`, data);
		if (res.status === 200) {
			return true;
		}
	} catch (error) {
		Toastify({
			text: 'Cập nhật không thành công',
			duration: 3000,
			style: {
				// background: '#5cb85c', //success
				background: '#d9534f', // danger
			},
		}).showToast();
	}
};

const renderRooms = async () => {
	const tableList = $('#table')[0];
	const { data } = await getDataAPI(`room`);
	const BuildPage = async (data) => {
		let search = document.querySelector('.search').value;
		if (!search) {
			search = '';
		}
		const listRooms = data.data;
		const listRender = listRooms.filter((item) =>
			convert(item.roomNumber).includes(convert(search)),
		);
		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML =
				`<thead>
                <tr>
                <td class="col">TÊN TÒA NHÀ</td>
                <td class="col">SỐ PHÒNG</td>
                <td class="col">SINH VIÊN TỐI ĐA</td>
                <td class="col">SINH VIÊN HIỆN CÓ</td>
                <td class="col">TRẠNG THÁI</td>
                <td class="col"></td>
            </tr>
				</thead>
		<tbody >` +
				listRender
					.slice(min, max)
					.map((room) => {
						return `
				<tr class="item-list" data-id=${
					room._id
				} data-bs-toggle="modal" data-bs-target="#infoModal">
				
                    <td class="building" data-id="${room.building._id}">${
							room.building.name
						}</td>
                    <td class="roomNumber">${room.roomNumber}</td>
                    <td class="maxStudent">${room.maxStudent}</td>
                    <td class="presentStudent">${room.presentStudent}</td>
                    <td>${
											room.presentStudent == 0
												? 'Trống'
												: room.maxStudent > room.presentStudent
												? 'Còn chỗ'
												: 'Đã đầy'
										}</td>
          
                    <td class="dropleft"><i class="bx bx-dots-vertical-rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="${
											room._id
										}"></i>
					<div class="dropdown-menu" aria-labelledby="${room._id}">
						<div class="dropdown-item" data-toggle='modal' data-target='#infoModal' >Xem</div>
						<a class="dropdown-item" href="/admin/room/${room._id}" >Chi tiết</a>
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
		const addRoom = $('.btn-add-new')[0];

		addRoom.onclick = async (e) => {
			const buildingName = document.querySelector('#buildingName').value;
			const roomNumber = document.querySelector('#roomNumber').value;
			const maxStudent = document.querySelector('#maxStudent').value;

			const isSuccess = await createRoom({
				building: buildingName,
				roomNumber,
				maxStudent,
			});
			if (isSuccess) {
				document.querySelector('#buildingName').value = '';
				document.querySelector('#roomNumber').value = '';
				document.querySelector('#maxStudent').value = '';
				$('#addNewModal').modal('hide');
				const { data } = await getDataAPI(`room`);

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
		const itemBuildingName = item.find('.building').attr('data-id');
		const itemRoomNumber = item.find('.roomNumber')[0].innerText;
		const itemMaxStudent = item.find('.maxStudent')[0].innerText;
		console.log(itemBuildingName);
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
				const { data } = await getDataAPI(`room`);

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
		const itemBuildingName = item.find('.building').attr('data-id');
		const itemRoomNumber = item.find('.roomNumber')[0].innerText;
		const itemMaxStudent = item.find('.maxStudent')[0].innerText;
		const itemPresentStudent = item.find('.presentStudent')[0].innerText;

		// Set giá trị khi hiện modal update
		$('#buildingNameInfo')[0].value = itemBuildingName;
		$('#roomNumberInfo')[0].value = itemRoomNumber;
		$('#maxStudentInfo')[0].value = itemMaxStudent;
		$('#presentStudentInfo')[0].value = itemPresentStudent;
	});
	document.querySelector('.search').addEventListener('change', function () {
		BuildPage(data);
	});
	BuildPage(data);
};

export { renderRooms };
