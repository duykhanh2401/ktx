export const pagination = (buildList) => {
	let currentPage = 1;
	let namesPerPage = 10;

	const calcPages = (number) => {
		return Math.ceil(number / namesPerPage);
	};

	let pages = calcPages(currentPage);
	const handleClick = (id) => {
		if (id === 'prev') {
			currentPage--;
		} else if (id === 'next') {
			currentPage++;
		} else {
			currentPage = id;
		}
		buildList(
			buildPagination,
			(currentPage - 1) * namesPerPage,
			currentPage * namesPerPage,
		);
	};

	const buildPagination = (number) => {
		let prevButton, nextButton;

		pages = calcPages(number);
		if (currentPage === 1) {
			prevButton = false;
		} else {
			prevButton = true;
		}

		if (currentPage === pages) {
			nextButton = false;
		} else {
			nextButton = true;
		}

		if (pages === 0) {
			nextButton = false;
			prevButton = false;
		}
		let arrayNumber = [];
		for (var i = 1; i <= pages; i++) {
			arrayNumber.push(i);
		}
		const renderIndex = arrayNumber
			.map((item) => {
				return `
			<li class="page-item number ${
				item === currentPage ? 'active' : ''
			}"> <a class="page-link" href="#">${item}</a></li>
			`;
			})
			.join('');

		$('.pagination')[0].innerHTML = `
		<div aria-label="Page navigation example">
		<ul class="pagination justify-content-center">
		${
			prevButton
				? '<li class="page-item prev"><a class="page-link" href="#"><i class="bi bi-chevron-left"></i></a></li>'
				: ''
		}
			${renderIndex}
		${
			nextButton
				? '<li class="page-item next"><a class="page-link" href="#"><i class="bi bi-chevron-right"></i></a></li>'
				: ''
		}
		  
		</ul>
	  </div>
		`;

		$('.prev').click(() => handleClick('prev'));
		$('.next').click(() => handleClick('next'));
		$('.page-item.number').each(function (index) {
			$(this).click(() => handleClick(index + 1));
		});
	};

	buildList(
		buildPagination,
		(currentPage - 1) * namesPerPage,
		currentPage * namesPerPage,
	);
};
