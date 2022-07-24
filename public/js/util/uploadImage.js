import { toast } from './toastify';
export const uploadImage = async (file) => {
	try {
		const formData = new FormData();

		formData.append('file', file);
		formData.append('upload_preset', 'BookShop');

		const { data } = await axios.post(
			'https://api.cloudinary.com/v1_1/duykhanh2401/image/upload',
			formData,
		);
		toast('success', 'Đăng ảnh thành công');

		return data.secure_url;
	} catch (error) {
		toast('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau');
	}
};
