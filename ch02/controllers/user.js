const models = require('../models/index');
const User = require('../models/user');

// insert into users...
exports.create = (req, res) => {
  // request body를 가진 User 객체 모델을 만든다.
  models.User.create({
    name: req.body.name,
    email: req.body.email
  }).then(usr => {
    res.json(usr);
  });
};

// select * from users...
exports.list = (req, res) => {
  // select * from users
  models.User.findAll({}).then(usr => {
    res.json(usr);
  });
};
