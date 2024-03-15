import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({tableName: "files"})
export class File extends Model<File> {
    @Column({type: DataType.INTEGER, autoIncrement: true, unique: true, primaryKey: true})
    id: number
    
}