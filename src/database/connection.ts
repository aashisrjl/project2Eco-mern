import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
    database: process.env.DB_NAME || '',
    dialect: 'mysql',
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || '',
    port: Number(process.env.DB_PORT) || 3306,
    models: [__dirname + '/models'],
});

sequelize.authenticate()
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log("Database Error: " + err);
    });

sequelize.sync({ force: false })
    .then(() => {
        console.log("Database synced");
    });

export default sequelize;
