import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Token } from "src/auth/token.model";
import { Subscription } from "src/subscriptions/subscription.model";

interface CompanyCreationAttrs {
    name: string
    email: string
    password: string
}

@Table({tableName: 'companies'})
export class Company extends Model<Company, CompanyCreationAttrs>{
    @Column({type: DataType.INTEGER, autoIncrement: true, unique: true, primaryKey: true})
    id: number

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string
    
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string
    
    @Column({type: DataType.STRING, unique: false, allowNull: false})
    password: string

    @Column({type: DataType.STRING, unique: false, allowNull: true})
    country: string

    @Column({type: DataType.STRING, unique: false, allowNull: true})
    industry: string

    @BelongsTo(() => Subscription)
    subscription: Subscription
    
    @ForeignKey(() => Subscription)
    @Column({type: DataType.INTEGER})
    subscriptionId: number
    
    @HasMany(() => Token)
    tokens: Token[]

    @Column({type: DataType.ARRAY(DataType.STRING), unique: false, allowNull: true})
    customers: []                           // array of customers nickname or maybe their ids
    
    @Column({type: DataType.INTEGER, unique: false, allowNull: true, defaultValue: 0})
    fileCount: number

    @Column({type: DataType.INTEGER, unique: false, allowNull: true, defaultValue: 0})
    maxFileCount: number

    @Column({type: DataType.INTEGER, unique: false, allowNull: true, defaultValue: 0})
    billing: number

    @Column({type: DataType.DATE, unique: false, allowNull: true})
    dateStart: Date

    @Column({type: DataType.DATE, unique: false, allowNull: true})
    dateEnd: Date
}   