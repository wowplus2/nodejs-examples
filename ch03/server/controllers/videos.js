const fs = require('fs');
const mine = require('mine');
const gravatar = require('gravatar');

const Videos = require('../models/videos');
const allow_types = ['video/mp4', 'video/webm', 'video/ogg', 'video/ogv'];

// videos 목록
exports.show = (req, res) => {
	Images.find()
		.sort('-created')
		.populate('user', 'local.email')
		.exec((err, videos) => {
			if (err) {
				return res.status(400).send({ message: err });
			}

			console.log(videos);
			res.render('videos', {
				title: 'Videos Page',
				videos: videos,
				gravatar: gravatar.url(
					imgs.email,
					{ s: '80', r: 'x', d: 'retro' },
					true
				)
			});
		});
};

// video 업로드
exports.uploadVideo = (req, res) => {
	var src;
	var dest;
	var targetPath;
	var targetName;
	console.log(req);
	var tempPath = req.file.path;
	//get the mime type of the file
	var type = mime.lookup(req.file.mimetype);
	// get file extenstion
	var ext = req.file.path.split(/[. ]+/).pop();

	// check file type
	if (allow_types.indexOf(type) == -1) {
		return res.status(415).send('해당 파일형식은 업로드가 불가능합니다.');
	}
	// new path video
	targetPath = './public/videos/' + req.file.originalname;
	//  fs의 readStream API
	src = fs.createReadStream(tempPath);
	// fs의 writeStream API
	dest = fs.createWriteStream(targetPath);
	src.pipe(dest);

	// error check
	src.on('error', err => {
		if (err) {
			return res.status(500).send({ message: err });
		}
	});
	// 파일 저장
	src.on('end', () => {
		// request body로 새 image model 생성
		let v = new Videos(req.body);
		v.videoName = req.file.originalname;
		v.user = req.user;
		v.save(err => {
			if (err) {
				return res.status(500).send('이미지 저장시 에러발생.');
			}
		});
		// temp 폴더에서 임시파일 삭제
		fs.unlink(tempPath, err => {
			if (err) {
				return res.status(500).send('임시 저장소에서 에러발생.');
			}

			res.redirect('videos');
		});
	});
};

// 인증된 사용자인지 체크하는 미들웨어
exports.hasAuthorization = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/signin');
};
