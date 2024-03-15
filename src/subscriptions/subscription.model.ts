import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Company } from "src/companies/company.model";

interface SubscriptionCreationAttrs {
    type: string
    fileCount: number
    customersCount: number
    price: number
    allowMoreCustomers: boolean
}

@Table({tableName: "subscriptions"})
export class Subscription extends Model<Subscription, SubscriptionCreationAttrs> { 
    @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true})
    id: number

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    type: string

    @Column({type: DataType.INTEGER, unique: false, allowNull: false})
    fileCount: number

    @Column({type: DataType.STRING, unique: false, allowNull: false})
    customersCount: number

    @Column({type: DataType.INTEGER, unique: false, allowNull: false})
    price: number

    @Column({type: DataType.BOOLEAN, unique: false, allowNull: false})
    allowMoreCustomers: Boolean

    @Column({type: DataType.INTEGER, unique: false, allowNull: true})
    pricePerCustomer: number

    @HasMany(() => Company)
    companies: Company[]
}