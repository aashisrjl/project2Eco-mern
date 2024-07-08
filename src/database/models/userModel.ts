import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt

} from 'sequelize-typescript';
import { defaultValueSchemable } from 'sequelize/types/utils';

@Table({
    tableName: "users",
    modelName: "User",
    timestamps: true
})

class User extends Model{
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id:string;

    @Column({
        type: DataType.STRING,

    })
    declare username:string;

    @Column({
        type: DataType.STRING,

    })
    declare email:string;

    @Column({
        type: DataType.STRING,

    })
    declare password:string;
}

export default User;