import Highcharts from 'highcharts';
import { getDataAPI, postDataAPI } from './../util/fetchAPI';

const renderDashboard = async () => {
	const renderInvoice = async (month, year) => {
		const { data } = await postDataAPI('invoice/data-dashboard', {
			month,
			year,
		});
		let ax = [],
			yx = [],
			dataWater = [],
			dataElectric = [];
		console.log(data);
		data.data.forEach((item) => {
			ax.push(item.building);
			dataWater.push(item.water);
			dataElectric.push(item.electricity);
		});
		Highcharts.chart('invoiceDashboard', {
			title: {
				text: `Thông tin tiền điện nước tháng ${month} năm ${year}`,
			},
			chart: {
				type: 'column',
			},
			xAxis: {
				categories: ax,
			},
			yAxis: {
				title: {
					text: 'Giá tiền',
				},
			},

			series: [
				{ name: 'Tiền điện', data: dataElectric },
				{ name: 'Tiền nước', data: dataWater },
			],
		});

		document.querySelector('#date').addEventListener('change', (el) => {
			const [year, month] = el.target.value.split('-');
			console.log(year, month);
			renderInvoice(+month, +year);
		});
	};

	const renderContract = async () => {
		const { data } = await postDataAPI('contract/data-dashboard');
		const dataRender = [];

		for (let [key, value] of Object.entries(data.data)) {
			dataRender.push({
				name:
					key == 'active'
						? 'Hợp Đồng'
						: key == 'inactive'
						? 'Hết Hạn'
						: key == 'discipline'
						? 'Kỷ luật'
						: key == 'cancel'
						? 'Đã huỷ'
						: 'Gia hạn',
				y: (value * 100) / data.total,
				sliced: true,
				selected: true,
			});
		}
		Highcharts.chart('contractDashboard', {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
			},
			title: {
				text: 'Thông kê hợp đồng sinh viên',
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
			},
			accessibility: {
				point: {
					valueSuffix: '%',
				},
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
					},
				},
			},
			series: [
				{
					name: 'Tổng',
					colorByPoint: true,
					data: dataRender,
				},
			],
		});
	};

	const day = new Date();
	document.querySelector('#date').value = day;
	renderInvoice(day.getMonth(), day.getFullYear());
	renderContract();
};

export { renderDashboard };
