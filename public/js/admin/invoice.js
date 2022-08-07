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
const createInvoice = async (data) => {
	try {
		const res = await postDataAPI('invoice', data);
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		toast('danger', error.response.data.message);
	}
};

const deleteBuilding = async (id) => {
	try {
		const res = await deleteDataAPI(`building/${id}`);
		if (res.status === 204) {
			return true;
		}
	} catch (error) {
		toast('danger', error.response.data.message);
	}
};

const updateBuilding = async (id, data) => {
	try {
		const res = await patchDataAPI(`building/${id}`, data);
		if (res.status === 200) {
			return true;
		}
	} catch (error) {
		console.log(error);
	}
};

const renderInvoice = async () => {
	const tableList = $('#table')[0];
	const BuildPage = async () => {
		// const sort = document.querySelector('.filter').value;
		// let search = document.querySelector('.search').value;
		// if (!search) {
		// 	search = '';
		// }
		const { data } = await getDataAPI(`invoice`);
		const listInvoice = data.data;
		const listRender = listInvoice;
		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML =
				`<thead>
                <tr>
                <td class="col">TÊN TÒA NHÀ</td>
                <td class="col">SỐ PHÒNG</td>
                <td class="col">KỲ THANH TOÁN</td>
                <td class="col">TỔNG TIỀN ĐIỆN</td>
                <td class="col">TỔNG TIỀN NƯỚC</td>
                <td class="col">TRẠNG THÁI</td>
                <td class="col"></td>
            </tr>
				</thead>
		<tbody >` +
				listRender
					.slice(min, max)
					.map((invoice) => {
						return `
				<tr class="item-list" data-id=${
					invoice._id
				} data-bs-toggle="modal" data-bs-target="#infoModal">
				
                    <td class="building">${invoice.room.building.name}</td>
                    <td class="room" data-id="${invoice.room.id}">${
							invoice.room.roomNumber
						}</td>
                    <td class="payment-cycle">Tháng ${invoice.month} - Năm ${
							invoice.year
						}</td>
                    <td>${formatter.format(invoice.electricity.total)}</td>
										<td>${formatter.format(invoice.water.total)}</td>
					<td class="d-none electricity-startNumber">${
						invoice.electricity.startNumber
					}</td>
					<td class="status">${invoice.status}</td>
					<td class="d-none electricity-endNumber">${invoice.electricity.endNumber}</td>
					<td class="d-none electricity-total">${invoice.electricity.total}</td>
					<td class="d-none water-startNumber">${invoice.water.startNumber}</td>
					<td class="d-none water-endNumber">${invoice.water.endNumber}</td>
					<td class="d-none water-total">${invoice.water.total}</td>
					<td class="d-none year">${invoice.year}</td>
					<td class="d-none month">${invoice.month}</td>
                    <td class="dropleft"><i class="bx bx-dots-vertical-rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="${
											invoice._id
										}"></i>
					<div class="dropdown-menu" aria-labelledby="${invoice._id}">
						<div class="dropdown-item" data-toggle='modal' data-target='#infoModal' >Xem</div>
						<div class="dropdown-item" data-toggle='modal' data-target='#updateModal' >Cập nhật</d>
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
			const room = document.querySelector('#roomID').value;
			const month = document.querySelector('#month').value;
			const year = document.querySelector('#year').value;
			const electricity = document.querySelector('#electricity').value;
			const water = document.querySelector('#water').value;

			const isSuccess = await createInvoice({
				room,
				month,
				year,
				electricity,
				water,
			});
			if (isSuccess) {
				document.querySelector('#roomID').value = '';
				document.querySelector('#month').value = '';
				document.querySelector('#year').value = '';
				document.querySelector('#electricity').value = '';
				document.querySelector('#water').value = '';
				$('#addNewModal').modal('hide');
				BuildPage();
				toast('success', 'Thêm mới thành công');
			}
		};
	});

	$('#updateModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		console.log(item);
		const itemId = item.attr('data-id');
		const itemName = item.find('.name')[0].innerText;
		const itemNumberOfRooms = item.find('.numberOfRooms')[0].innerText;
		const itemUnitPrice = item.find('.unitPrice')[0].innerText;

		// Set giá trị khi hiện modal update
		$('#nameBuildingUpdate')[0].value = itemName;
		$('#numberOfRoomsUpdate')[0].value = itemNumberOfRooms;
		$('#unitPriceUpdate')[0].value = itemUnitPrice;

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
				toast('success', 'Cập nhật thành công');
			}
		};
	});

	$('#infoModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		console.log(item);
		const itemRoomID = item.find('.room').attr('data-id');
		const itemMonth = item.find('.month')[0].innerText;
		const itemYear = item.find('.year')[0].innerText;
		const electricityStart = item.find('.electricity-startNumber')[0].innerText;
		const electricityEnd = item.find('.electricity-endNumber')[0].innerText;
		const electricityTotal = item.find('.electricity-total')[0].innerText;
		const waterStart = item.find('.water-startNumber')[0].innerText;
		const waterEnd = item.find('.water-endNumber')[0].innerText;
		const waterTotal = item.find('.water-total')[0].innerText;

		// Set giá trị khi hiện modal update
		$('#roomIDInfo')[0].value = itemRoomID;
		$('#monthInfo')[0].value = itemMonth;
		$('#yearInfo')[0].value = itemYear;
		$('#electricity-startInfo')[0].value = electricityStart;
		$('#electricity-endInfo')[0].value = electricityEnd;
		$('#electricity-totalInfo')[0].value = formatter.format(electricityTotal);
		$('#water-startInfo')[0].value = waterStart;
		$('#water-endInfo')[0].value = waterEnd;
		$('#water-totalInfo')[0].value = formatter.format(waterTotal);
	});

	BuildPage();
};

export { renderInvoice };
