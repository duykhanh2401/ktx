import { getDataAPI } from '../util/fetchAPI';
import { pagination } from '../util/pagination';

const convertStrToDate = (string) => {
	const [day, month, year] = string.split('/');
	const date = new Date(+year, +month - 1, +day);
	return date.toISOString().split('T')[0];
};

const renderContract = async () => {
	const tableList = $('#table')[0];
	const BuildPage = async () => {
		// const sort = document.querySelector('.filter').value;
		// let search = document.querySelector('.search').value;
		// if (!search) {
		// 	search = '';
		// }
		const { data } = await getDataAPI(`contract/student`);
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
                    <td>${
											contract.status == 'active'
												? 'Hợp Đồng'
												: contract.status == 'inactive'
												? 'Hết Hạn'
												: 'Gia Hạn'
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
