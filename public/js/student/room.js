import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';
import { pagination } from '../util/pagination';

const renderRoom = async () => {
	const tableList = $('#table')[0];
	const BuildPage = async () => {
		// const sort = document.querySelector('.filter').value;
		// let search = document.querySelector('.search').value;
		// if (!search) {
		// 	search = '';
		// }
		const { data } = await getDataAPI(`room/student`);
		const listRooms = data.data;
		const listRender = listRooms;
		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML =
				`<thead>
                <tr>
                <td class="col">MÃ SỐ SINH VIÊN	</td>
                <td class="col">TÊN SINH VIÊN</td>
                <td class="col">LỚP</td>
                <td class="col">KHOÁ</td>
                <td class="col">NGÀY SINH</td>
            </tr>
				</thead>
		<tbody >` +
				listRender
					.slice(min, max)
					.map((student) => {
						return `
				<tr class="item-list" data-id=${student._id} data-bs-toggle="modal" data-bs-target="#infoModal">
				
                    <td class="building">${student.studentID}</td>
                    <td class="studentNumber">${student.name}</td>
                    <td class="maxStudent">${student.class}</td>
                    <td class="presentStudent">${student.academic}</td>
                    <td>${student.dateOfBirth}</td>
          
               
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

	BuildPage();
};

export { renderRoom };
