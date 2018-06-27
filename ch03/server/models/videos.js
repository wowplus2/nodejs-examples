const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videosSchema = mongoose.Schema({
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
	videoName: {
		type: String
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Videos', videosSchema);
