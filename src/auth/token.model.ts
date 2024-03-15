import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Company } from "src/companies/company.model";
import { User } from "src/users/user.model";

interface ModelCreationAttrs {
    token: string
    expiresIn: Date
    entityId: number
}

@Table({tableName: 'tokens'})
export class Token extends Model<Token, ModelCreationAttrs> {

    @Column({type: DataType.INTEGER, autoIncrement: true, unique: true, primaryKey: true})
    id: number

    @Column({type: DataType.STRING, allowNull: false, unique: true})
    token: string

    @Column({type: DataType.DATE, allowNull: false, unique: false})
    expiresIn: Date
 
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number

    @BelongsTo(() => User)
    user: User

    @ForeignKey(() => Company)
    @Column({type: DataType.INTEGER})
    companyId: number

    @BelongsTo(() => Company)
    company: Company
}