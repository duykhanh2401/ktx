import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';
import { convert } from '../util/convertString';
import { pagination } from '../util/pagination';
const createContract = async (data) => {
	try {
		const res = await postDataAPI('contract', data);
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

const extendContract = async (data) => {
	try {
		const res = await postDataAPI('contract/extend', data);
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		Toastify({
			text: 'Gia hạn không thành công',
			duration: 3000,
			style: {
				// background: '#5cb85c', //success
				background: '#d9534f', // danger
			},
		}).showToast();
	}
};

const cancelContract = async (id) => {
	try {
		const res = await patchDataAPI(`contract/${id}`);
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		Toastify({
			text: 'Huỷ hợp đồng không thành công',
			duration: 3000,
			style: {
				// background: '#5cb85c', //success
				background: '#d9534f', // danger
			},
		}).showToast();
	}
};

const renderContract = async () => {
	const tableList = $('#table')[0];
	const { data } = await getDataAPI(`contract?sort=studentID`);

	const BuildPage = async (data) => {
		const dataSelect = await getDataAPI('contract/data');
		const { studentNoContract, studentContract } = dataSelect.data;
		const studentSelect = document.querySelector('#studentSelect');
		studentSelect.innerHTML =
			`<option value="">------Chọn Sinh Viên---------</option>` +
			studentNoContract.map((el) => {
				return `<option value="${el._id}">${el.name} - ${el.studentID}</option>`;
			});

		const studentSelectExtend = document.querySelector('#studentSelectExtend');

		studentSelectExtend.innerHTML =
			`<option value="">------Chọn Sinh Viên---------</option>` +
			studentContract.map((el) => {
				return `<option value="${el._id}">${el.name} - ${el.studentID}</option>`;
			});

		const studentSelectCancel = document.querySelector('#studentSelectCancel');

		studentSelectCancel.innerHTML =
			`<option value="">------Chọn Sinh Viên---------</option>` +
			studentContract.map((el) => {
				return `<option value="${el._id}">${el.name} - ${el.studentID}</option>`;
			});
		let search = document.querySelector('.search').value;
		if (!search) {
			search = '';
		}
		const listContract = data.data;
		const listRender = listContract.filter((item) =>
			item.student.studentID.includes(search),
		);
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
                    <td>${
											contract.status == 'active'
												? 'Hợp Đồng'
												: contract.status == 'inactive'
												? 'Hết Hạn'
												: contract.status == 'discipline'
												? 'Kỷ luật'
												: contract.status == 'cancel'
												? 'Đã huỷ'
												: 'Gia hạn'
										}</td>
          
             
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
				const { data } = await getDataAPI(`contract?sort=studentID`);
				BuildPage(data);
				Toastify({
					text: 'Tạo hợp đồng thành công',
					duration: 3000,
					style: {
						background: '#5cb85c', //success
						// background: '#d9534f', // danger
					},
				}).showToast();
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
				const { data } = await getDataAPI(`contract?sort=studentID`);

				BuildPage(data);
				Toastify({
					text: 'Gia hạn hợp đồng thành công',
					duration: 3000,
					style: {
						background: '#5cb85c', //success
						// background: '#d9534f', // danger
					},
				}).showToast();
			}
		};
	});

	$('#cancelModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');

		const btnCancel = $('.btn-cancel')[0];

		btnCancel.onclick = async (e) => {
			const cancelID = document.querySelector('#studentSelectCancel').value;
			const isSuccess = await cancelContract(cancelID);

			if (isSuccess) {
				$('#cancelModal').modal('hide');
				const { data } = await getDataAPI(`contract?sort=studentID`);

				BuildPage(data);
				Toastify({
					text: 'Huỷ hợp đồng thành công',
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

export { renderContract };
