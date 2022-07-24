export const toast = (status, message) => {
	// data
	var clear;
	var msgDuration = 3000;
	var $msg = $('.msg');
	function timer() {
		clearTimeout(clear);
		clear = setTimeout(function () {
			hide();
		}, msgDuration);
	}

	function hide() {
		$msg.removeClass('msg-success msg-danger msg-warning msg-info active');
	}
	// 2 seconds
	hide();

	// cache DOM

	// render message

	switch (status) {
		case 'success':
			$msg.addClass('msg-success active').text(message);
			break;
		case 'danger':
			$msg.addClass('msg-danger active').text(message);
			break;
		case 'warning':
			$msg.addClass('msg-warning active').text(message);
			break;
		case 'info':
			$msg.addClass('msg-info active').text(message);
			break;
	}

	// bind events

	$msg.on('transitionend', timer);
};
