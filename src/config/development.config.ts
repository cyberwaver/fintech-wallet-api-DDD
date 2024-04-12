export default () => ({
  port: process.env.PORT,
  mikro_orm: {
    access: {
      db: process.env.MIKRO_ORM_ACCESS_DB,
      user: process.env.MIKRO_ORM_ACCESS_DB_USER,
      password: process.env.MIKRO_ORM_ACCESS_DB_PASSWORD,
    },
  },
});
