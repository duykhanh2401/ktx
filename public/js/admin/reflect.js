import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';
import { pagination } from '../util/pagination';

const renderReflect = async () => {
	const tableList = $('#table')[0];
	const BuildPage = async () => {
		const { data } = await getDataAPI(`reflect`);
		const listInvoice = data.data;
		const listRender = listInvoice;
		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML =
				`<thead>
                <tr>
                <td class="col">TÊN PHẢN ÁNH</td>
                <td class="col">TRẠNG THÁI</td>
                <td class="col">NGÀY TẠO</td>
                <td class="col"></td>
            </tr>
				</thead>
		<tbody >` +
				listRender
					.slice(min, max)
					.map((reflect) => {
						return `
				<tr class="item-list" data-id=${reflect._id} data-bs-toggle="modal" data-bs-target="#infoModal">
				
                    <td class="title">${reflect.title}</td>
                    <td class="status"">${reflect.status}</td>
                    <td class="status"">${reflect.createdAt}</td>
					<td class="dropleft"><i class="bx bx-dots-vertical-rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="${reflect._id}"></i>
					<div class="dropdown-menu" aria-labelledby="${reflect._id}">
						<div class="dropdown-item" data-toggle='modal' data-target='#infoModal' >Chi tiết</div>
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

	$('#addNewModal').on('shown.bs.modal', function (e) {
		const addReflect = $('.btn-add-new')[0];

		addReflect.onclick = async (e) => {
			const title = document.querySelector('#title').value;
			const content = document.querySelector('#content').value;

			const isSuccess = await createReflect({
				title,
				content,
			});

			if (isSuccess) {
				document.querySelector('#title').value = '';
				document.querySelector('#content').value = '';

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

	BuildPage();
};

export { renderReflect };
