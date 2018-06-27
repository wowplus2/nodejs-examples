const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imagesSchema = mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: '제목을 입력하세요.'
	},
	imageName: {
		type: String
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Images', imagesSchema);
