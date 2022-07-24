import axios from 'axios';
export const getDataAPI = async (url) => {
	const res = await axios.get(`/api/${url}`);
	return res;
};

export const postDataAPI = async (url, data) => {
	const res = await axios.post(`/api/${url}`, data);
	return res;
};

export const patchDataAPI = async (url, data) => {
	const res = await axios.patch(`/api/${url}`, data);
	return res;
};

export const putDataAPI = async (url, data) => {
	const res = await axios.put(`/api/${url}`, data);
	return res;
};

export const deleteDataAPI = async (url, data) => {
	const res = await axios.delete(`/api/${url}`, data);
	return res;
};
