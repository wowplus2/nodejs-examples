const gravatar = require('gravatar');
const passport = require('passport');

// GET 로그인 화면
exports.signin = (req, res) => {
	// 사용자 전체 목록을 날짜별로 정렬
	res.render('signin', {
		title: 'Login Page',
		message: req.flash('loginMessage')
	});
};

// GET 회원가입 화면
exports.signup = (req, res) => {
	// 사용자 전체 목록을 날짜별로 정렬
	res.render('signup', { title: 'Signup Page', message: 'signupMessage' });
};

// GET 개인 프로필 페이지
exports.profile = (req, res) => {
	// 사용자 전체 목록을 날짜별로 정렬
	res.render('profile', {
		title: 'Profile Page',
		user: req.user,
		avatar: gravatar.url(
			req.user.email,
			{ s: '100', r: 'x', d: 'retro' },
			true
		)
	});
};

// logout method
exports.logout = () => {
	req.logout();
	res.redirect('/');
};

// 사용자 로그인 여부 체크
exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/signin');
};
