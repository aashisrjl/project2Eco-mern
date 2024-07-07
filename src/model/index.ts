import {Sequelize,DataTypes} from 'sequelize';
import dbConfig from '../config/dbConfig';

const sequelize = new Sequelize(dbConfig.db,dbConfig.user,dbConfig.password,{
    host: dbConfig.host,
    dialect:dbConfig.dialect,
    port: 3306,
    pool:{
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
        max: dbConfig.pool.max,
        min: dbConfig.pool.min
    }
})
sequelize
.authenticate()
.then(()=>{
    console.log("DATABASE Connected !")
})
.catch((err)=>{
    console.log("Error connecting to database : "+err)
})

const db:any ={}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.sequelize.sync({force:true})
.then(()=>{
    console.log("Yes Migrated !")
})
export default db;