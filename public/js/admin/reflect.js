import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';
import { pagination } from '../util/pagination';
import { convert } from '../util/convertString';

const updateReflect = async (id, data) => {
	try {
		const res = await patchDataAPI(`reflect/${id}`, data);
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

const renderReflect = async () => {
	const tableList = $('#table')[0];
	const { data } = await getDataAPI(`reflect`);
	const BuildPage = async (data) => {
		const listReflect = data.data;
		let search = document.querySelector('.search').value;
		if (!search) {
			search = '';
		}
		const listRender = listReflect.filter((item) =>
			convert(item.student.studentID).includes(convert(search)),
		);
		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML =
				`<thead>
                <tr>
                <td class="col">TIÊU ĐỀ PHẢN ÁNH</td>
                <td class="col">TÊN SINH VÊN</td>
                <td class="col">MÃ SINH VIÊN</td>
                <td class="col">NGÀY TẠO</td>
                <td class="col">TRẠNG THÁI</td>
                <td class="col"></td>
            </tr>
				</thead>
		<tbody >` +
				listRender
					.slice(min, max)
					.map((reflect) => {
						return `
				<tr class="item-list" data-id=${
					reflect._id
				} data-bs-toggle="modal" data-bs-target="#infoModal">
				
                    <td class="title">${reflect.title}</td>
                    <td class="student">${reflect.student.name}</td>
                    <td class="studentID">${reflect.student.studentID}</td>
					<td class="d-none content">${reflect.content}</td>
                    <td class="date">${new Date(
											reflect.createdAt,
										).toLocaleDateString()}</td>
										<td class="status">${reflect.status}</td>
						<td class="dropleft"><i class="bx bx-dots-vertical-rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="${
							reflect._id
						}"></i>
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
		const student = item.find('.student')[0].innerText;
		const studentID = item.find('.studentID')[0].innerText;
		const content = item.find('.content')[0].innerText;
		const status = item.find('.status')[0].innerText;
		const title = item.find('.title')[0].innerText;

		// Set giá trị khi hiện modal update
		$('#titleInfo')[0].value = title;
		$('#studentInfo')[0].value = student;
		$('#studentIDInfo')[0].value = studentID;
		$('#contentInfo')[0].value = content;
		$('#statusInfo')[0].value = status;
	});

	$('#updateModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');

		const btnUpdate = $('.btn-update')[0];

		btnUpdate.setAttribute('update-id', itemId);
		btnUpdate.onclick = async (e) => {
			const updateId = btnUpdate.getAttribute('update-id');
			const status = $('#statusUpdate')[0].value;

			const isSuccess = await updateReflect(updateId, {
				status,
			});

			if (isSuccess) {
				$('#updateModal').modal('hide');
				const { data } = await getDataAPI(`reflect`);
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

	BuildPage(data);
	document.querySelector('.search').addEventListener('change', function () {
		BuildPage(data);
	});
};

export { renderReflect };
