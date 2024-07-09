import {
    Table,
    Column,
    DataType,
    Model,
    PrimaryKey
} from 'sequelize-typescript';

@Table({
    tableName: 'blogs',
    modelName: 'Blog',
    timestamps: true
})

class Blog extends Model{
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string

    @Column({
        type: DataType.STRING,  
    })
    declare title:string

    @Column({
        type: DataType.STRING,  
    })
    declare desc:string
}

export default Blog;