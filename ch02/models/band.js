module.exports = (sequelize, DataTypes) => {
  var Band = sequelize.define(
    'Band',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      album: DataTypes.STRING,
      year: DataTypes.STRING,
      UserId: DataTypes.INTEGER
    },
    {}
  );

  Band.associate = function(models) {
    // associations can be defined here
    Band.belongsTo(models.User);
  };

  return Band;
};
