import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';
import { pagination } from '../util/pagination';

const createAdmin = async (data) => {
	try {
		const res = await postDataAPI('auth/admin', data);
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		Toastify({
			text: 'Tạo mới không thành công',
			duration: 3000,
			style: {
				// background: '#5cb85c', //success
				background: '#d9534f', // danger
			},
		}).showToast();
	}
};

const updateAdmin = async (id, data) => {
	try {
		const res = await patchDataAPI(`auth/admin/${id}`, data);
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

const renderAdmin = async () => {
	const tableList = $('#table')[0];
	const BuildPage = async () => {
		// const sort = document.querySelector('.filter').value;
		// let search = document.querySelector('.search').value;
		// if (!search) {
		// 	search = '';
		// }
		const { data } = await getDataAPI(`auth/admin`);
		const listAuthor = data.data;
		const listRender = listAuthor;
		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML =
				`<thead>
                <tr>
                <td class="col">TÊN QUẢN LÝ</td>
                <td class="col">CHỨC VỤ</td>
                <td class="col">SỐ ĐIỆN THOẠI</td>
                <td class="col">EMAIL</td>
                <td class="col"></td>
            </tr>
				</thead>
		<tbody >` +
				listRender
					.slice(min, max)
					.map((admin) => {
						return `
				<tr class="item-list" data-id=${admin._id} data-bs-toggle="modal" data-bs-target="#infoModal">
				
                    <td class="name">${admin.name}</td>
                    <td class="position">${admin.position}</td>
                    <td class="phone">${admin.phone}</td>
                    <td class="email">${admin.email}</td>
          
                    <td class="dropleft"><i class="bx bx-dots-vertical-rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="${admin._id}"></i>
					<div class="dropdown-menu" aria-labelledby="${admin._id}">
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
			const name = document.querySelector('#name').value;
			const position = document.querySelector('#position').value;
			const phone = document.querySelector('#phone').value;
			const email = document.querySelector('#email').value;
			const password = document.querySelector('#password').value;

			const isSuccess = await createAdmin({
				name,
				password,
				email,
				position,
				phone,
			});
			if (isSuccess) {
				document.querySelector('#name').value = '';
				document.querySelector('#position').value = '';
				document.querySelector('#phone').value = '';
				document.querySelector('#email').value = '';
				document.querySelector('#password').value = '';
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
		const itemPosition = item.find('.position')[0].innerText;
		const itemPhone = item.find('.phone')[0].innerText;
		const itemEmail = item.find('.email')[0].innerText;

		// Set giá trị khi hiện modal update
		$('#nameUpdate')[0].value = itemName;
		$('#positionUpdate')[0].value = itemPosition;
		$('#phoneUpdate')[0].value = itemPhone;
		$('#emailUpdate')[0].value = itemEmail;
		const btnUpdate = $('.btn-update')[0];

		btnUpdate.setAttribute('update-id', itemId);
		btnUpdate.onclick = async (e) => {
			const updateId = btnUpdate.getAttribute('update-id');
			const name = $('#nameUpdate')[0].value;
			const position = $('#positionUpdate')[0].value;
			const phone = $('#phoneUpdate')[0].value;
			const email = $('#emailUpdate')[0].value;
			const password = $('#passwordUpdate')[0].value;

			const isSuccess = await updateAdmin(updateId, {
				name,
				position,
				phone,
				email,
				password,
			});

			if (isSuccess) {
				$('#updateModal').modal('hide');
				$('#nameUpdate')[0].value = '';
				$('#positionUpdate')[0].value = '';
				$('#phoneUpdate')[0].value = '';
				$('#emailUpdate')[0].value = '';
				$('#passwordUpdate')[0].value = '';
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
		const itemPosition = item.find('.position')[0].innerText;
		const itemPhone = item.find('.phone')[0].innerText;
		const itemEmail = item.find('.email')[0].innerText;

		// Set giá trị khi hiện modal update
		$('#nameInfo')[0].value = itemName;
		$('#positionInfo')[0].value = itemPosition;
		$('#phoneInfo')[0].value = itemPhone;
		$('#emailInfo')[0].value = itemEmail;
	});

	BuildPage();
};

export { renderAdmin };
