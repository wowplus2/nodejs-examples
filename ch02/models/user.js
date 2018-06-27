module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING
    },
    {}
  );

  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Band);
  };

  return User;
};
