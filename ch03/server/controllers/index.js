// Show home screen
exports.show = function(req, res) {
	// home 화면 렌더링
	res.render('index', {
		title: 'Multimedia Application',
		callToAction: 'An easy way to upload and manipulate files with Node.js'
	});
};
