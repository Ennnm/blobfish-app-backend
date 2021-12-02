module.exports = {
  development: {
    username: 'justin',
    password: null,
    database: 'blobfish_development',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },

  },
};
