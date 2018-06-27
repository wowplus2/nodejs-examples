const gravatar = require('gravatar');
const Comments = require('../models/comments');

// comments 목록
exports.list = (req, res) => {
	// comments 데이터 전체를 날짜별로 정렬
	Comments.find()
		.sort('-created')
		.populate('user', 'local.email')
		.exec((err, cmts) => {
			if (err) {
				return res.send(400, { message: err });
			}
			// sorting 결과 랜더링
			res.render('comments', {
				title: 'Comments Page',
				comments: cmts,
				gravatar: gravatar.url(
					comments.email,
					{ s: '80', r: 'x', d: 'retro' },
					true
				)
			});
		});
};

// comment 생성
exports.create = (req, res) => {
	// request body를 가진 comment 모델 생성
	let rs = new Comments(req.body);
	// id 기준의 현재 사용자 설정
	rs.user = req.user;
	// 수신 데이터 저장
	rs.save(err => {
		if (err) {
			return res.send(400, { message: err });
		}

		res.redirect('/comments');
	});
};

// 인증된 사용자인지 체크하는 미들웨어
exports.hasAuthorization = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/signin');
};
