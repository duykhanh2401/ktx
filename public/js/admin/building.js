import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';
import { pagination } from '../util/pagination';

const formatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});
const createBuilding = async (data) => {
	try {
		const res = await postDataAPI('building', data);
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

const updateBuilding = async (id, data) => {
	try {
		const res = await patchDataAPI(`building/${id}`, data);
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

const renderBuilding = async () => {
	const tableList = $('#table')[0];
	const BuildPage = async () => {
		// const sort = document.querySelector('.filter').value;
		// let search = document.querySelector('.search').value;
		// if (!search) {
		// 	search = '';
		// }
		const { data } = await getDataAPI(`building?sort=name`);
		const listBuilding = data.data;
		const listRender = listBuilding;
		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML =
				`<thead>
                <tr>
                <td class="col">TÊN TÒA NHÀ</td>
                <td class="col">SỐ LƯỢNG PHÒNG</td>
                <td class="col">ĐƠN GIÁ/THÁNG/SV</td>
                <td class="col">TRẠNG THÁI</td>
                <td class="col"></td>
            </tr>
				</thead>
		<tbody >` +
				listRender
					.slice(min, max)
					.map((building) => {
						return `
				<tr class="item-list" data-id=${
					building._id
				} data-bs-toggle="modal" data-bs-target="#infoModal">
				
                    <td class="name">${building.name}</td>
                    <td class="numberOfRooms">${building.numberOfRooms}</td>
                    <td class="unitPrice">${formatter.format(
											building.unitPrice,
										)}</td>
                    <td>${
											building.status == 'active'
												? 'Đang hoạt động'
												: 'Tạm ngưng'
										}</td>
          
                    <td class="dropleft"><i class="bx bx-dots-vertical-rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="${
											building._id
										}"></i>
					<div class="dropdown-menu" aria-labelledby="${building._id}">
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
		const addBuilding = $('.btn-add-new')[0];

		addBuilding.onclick = async (e) => {
			const nameBuilding = document.querySelector('#nameBuilding').value;
			const numberOfRooms = document.querySelector('#numberOfRooms').value;
			const unitPrice = document.querySelector('#unitPrice').value;
			if (!nameBuilding) {
				return toast('danger', 'Vui lòng nhập tên toà nhà');
			}
			const isSuccess = await createBuilding({
				name: nameBuilding,
				numberOfRooms,
				unitPrice,
			});
			if (isSuccess) {
				document.querySelector('#nameBuilding').value = '';
				document.querySelector('#numberOfRooms').value = '';
				document.querySelector('#unitPrice').value = '';
				$('#addNewModal').modal('hide');
				BuildPage();
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
		const itemName = item.find('.name')[0].innerText;
		const itemNumberOfRooms = item.find('.numberOfRooms')[0].innerText;
		const itemUnitPrice = item.find('.unitPrice')[0].innerText;

		// Set giá trị khi hiện modal update
		$('#nameBuildingUpdate')[0].value = itemName;
		$('#numberOfRoomsUpdate')[0].value = itemNumberOfRooms;
		$('#unitPriceUpdate')[0].value = Number(
			itemUnitPrice.replace(/[^0-9]+/g, ''),
		);

		const btnUpdate = $('.btn-update')[0];

		btnUpdate.setAttribute('update-id', itemId);
		btnUpdate.onclick = async (e) => {
			const updateId = btnUpdate.getAttribute('update-id');
			const name = $('#nameBuildingUpdate')[0].value;
			const numberOfRooms = $('#numberOfRoomsUpdate')[0].value;
			const unitPrice = $('#unitPriceUpdate')[0].value;

			const isSuccess = await updateBuilding(updateId, {
				name,
				numberOfRooms,
				unitPrice,
			});

			if (isSuccess) {
				$('#updateModal').modal('hide');
				BuildPage();
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

	$('#infoModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const itemName = item.find('.name')[0].innerText;
		const itemNumberOfRooms = item.find('.numberOfRooms')[0].innerText;
		const itemUnitPrice = item.find('.unitPrice')[0].innerText;

		// Set giá trị khi hiện modal update
		$('#nameBuildingInfo')[0].value = itemName;
		$('#numberOfRoomsInfo')[0].value = itemNumberOfRooms;
		$('#unitPriceInfo')[0].value = itemUnitPrice;
	});

	BuildPage();
};

export { renderBuilding };
