const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const usrSchema = mongoose.Schema({
	// User 모델의 스키마 정의
	local: {
		name: String,
		email: String,
		password: String
	}
});

// Encrypt Password
usrSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// 패스워드 검증
usrSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', usrSchema);
