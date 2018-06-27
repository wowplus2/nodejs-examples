const models = require('../models/index');
const Band = require('../models/band');

// insert into bands...
exports.create = (req, res) => {
  models.Band.create(req.body).then(b => {
    //res.json(b);
    res.redirect('/bands');
  });
};

// select * from bands order by createdAt desc...
exports.list = (req, res) => {
  models.Band.findAll({
    order: [['createdAt', 'DESC']]
  }).then(bs => {
    //res.json(bs);
    //console.log(bs);
    res.render('band-list', {
      title: 'List bands',
      bands: bs
    });
  });
};

// select * from bands where id = :id...
exports.byId = (req, res) => {
  models.Band.find({
    where: {
      id: req.params.id
    }
  }).then(b => {
    res.json(b);
  });
};

// update bands set...
exports.update = (req, res) => {
  models.Band.find({
    where: {
      id: req.params.id
    }
  }).then(b => {
    if (b) {
      b.updateAttributes({
        name: req.body.name,
        description: req.body.description,
        album: req.body.album,
        year: req.body.year,
        UserId: req.body.uidx
      }).then(sb => {
        res.send(sb);
      });
    }
  });
};

// delete from bands where id = :id...
exports.delete = (req, res) => {
  models.Band.destroy({
    where: {
      id: req.body.id
    }
  }).then(b => {
    res.json(b);
  });
};
