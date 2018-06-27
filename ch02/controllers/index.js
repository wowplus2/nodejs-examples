// index Controller
/*
exports.show = (req, res) => {
  // index 컨텐츠 보여주기
  res.render('index', {
    title: 'Express'
  });
};
*/
exports.show = (req, res) => {
  // band 전체 목록을 날짜순으로 정렬
  let topBands = [
    {
      name: 'Motorhead',
      desc: 'Rock and Roll Band',
      album:
        'http://s2.vagalume.com/motorhead/discografia/orgasmatron-W320.jpg',
      year: '1986'
    },
    {
      name: 'Judas Priest',
      descr: 'Heavy Metal band',
      album:
        'http://s2.vagalume.com/judas-priest/discografia/screaming-for-vengeance-W320.jpg',
      year: '1982'
    },
    {
      name: 'Ozzy Osbourne',
      descr: 'Heavy Metal Band',
      album:
        'http://s2.vagalume.com/ozzy-osbourne/discografia/diary-of-a-madman-W320.jpg',
      year: '1981'
    }
  ];

  res.render('index', {
    title: 'The best albums of the eighties',
    callToAction:
      'Please be welcome, click the button below and register your favorite album.',
    bands: topBands
  });
};
