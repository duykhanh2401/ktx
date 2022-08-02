import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';
import { pagination } from '../util/pagination';
const createContract = async (data) => {
	try {
		const res = await postDataAPI('contract', data);
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

const extendContract = async (data) => {
	try {
		const res = await postDataAPI('contract/extend', data);
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

const convertStrToDate = (string) => {
	const [day, month, year] = string.split('/');
	const date = new Date(+year, +month - 1, +day);
	return date.toISOString().split('T')[0];
};

const deleteContract = async (id) => {
	try {
		const res = await deleteDataAPI(`room/${id}`);
		if (res.status === 204) {
			return true;
		}
	} catch (error) {
		new Toast({
			message: error.response.data.message,
			type: 'danger',
		});
	}
};

const updateContract = async (id, data) => {
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

const renderContract = async () => {
	const tableList = $('#table')[0];
	const BuildPage = async () => {
		// const sort = document.querySelector('.filter').value;
		// let search = document.querySelector('.search').value;
		// if (!search) {
		// 	search = '';
		// }
		const { data } = await getDataAPI(`contract`);
		const listAuthor = data.data;
		const listRender = listAuthor;
		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML =
				`<thead>
                <tr>
                <td class="col">MÃ SINH VIÊN</td>
                <td class="col">TÊN SINH VIÊN</td>
                <td class="col">MÃ HỢP ĐỒNG</td>
                <td class="col">NGÀY BẮT ĐẦU</td>
                <td class="col">NGÀY HẾT HẠN</td>
                <td class="col">TRẠNG THÁI</td>
            </tr>
				</thead>
		<tbody >` +
				listRender
					.slice(min, max)
					.map((contract) => {
						return `
				<tr class="item-list" data-id=${
					contract._id
				} data-bs-toggle="modal" data-bs-target="#infoModal">
				<td class="student" data-id="${contract.student.id}">${
							contract.student.studentID
						}</td>
                    <td class="studentName" data-id="${contract.student.id}">${
							contract.student.name
						}</td>
                    <td class="contract">${contract._id}</td>
                    <td class="startDate">${new Date(
											contract.startDate,
										).toLocaleDateString()}</td>
                    <td class="dueDate">${new Date(
											contract.dueDate,
										).toLocaleDateString()}</td>
                    <td>${contract.info}</td>
          
             
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
		const addContract = $('.btn-add-new')[0];

		addContract.onclick = async (e) => {
			const student = document.querySelector('#studentSelect').value;
			const startDate = document.querySelector('#startDate').value;
			const dueDate = document.querySelector('#dueDate').value;

			const isSuccess = await createContract({
				student,
				startDate,
				dueDate,
			});
			if (isSuccess) {
				document.querySelector('#studentSelect').value = '';
				document.querySelector('#startDate').value = '';
				document.querySelector('#dueDate').value = '';
				$('#addNewModal').modal('hide');
				BuildPage();
				new Toast({
					message: 'Tạo hợp đồng thành công',
					type: 'success',
				});
			}
		};
	});

	$('#extendModal').on('show.bs.modal', function (e) {
		const extendContractBtn = $('.btn-extend')[0];

		extendContractBtn.onclick = async (e) => {
			const student = document.querySelector('#studentSelectExtend').value;
			const dueDate = document.querySelector('#dueDateExtend').value;

			const isSuccess = await extendContract({
				student,
				dueDate,
			});
			if (isSuccess) {
				document.querySelector('#studentSelectExtend').value = '';
				document.querySelector('#dueDateExtend').value = '';
				$('#extendModal').modal('hide');
				BuildPage();
				new Toast({
					message: 'Gia hạn hợp đồng thành công',
					type: 'success',
				});
			}
		};
	});

	$('#infoModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const itemStudentName = item.find('.student').attr('data-id');
		const itemStartDate = item.find('.startDate')[0].innerText;
		const itemDueDate = item.find('.dueDate')[0].innerText;

		// Set giá trị khi hiện modal update
		console.log(convertStrToDate(itemStartDate));
		$('#studentSelectInfo')[0].value = itemStudentName;
		$('#startDateInfo')[0].value = convertStrToDate(itemStartDate);
		$('#dueDateInfo')[0].value = convertStrToDate(itemDueDate);
	});

	BuildPage();
};

export { renderContract };
