import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Token} from "./token.model"
import {Transaction} from "./transaction.model"

@Entity_()
export class Order {
    constructor(props?: Partial<Order>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    createdBy!: string

    @Column_("text", {nullable: false})
    stage!: string

    @Column_("text", {nullable: false})
    type!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    minprice!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    price!: bigint

    @Index_()
    @ManyToOne_(() => Token, {nullable: true})
    token!: Token

    @Column_("int4", {nullable: false})
    remtokens!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    exptime!: bigint | undefined | null

    @Column_("bool", {nullable: false})
    orderSuccess!: boolean

    @OneToMany_(() => Transaction, e => e.order)
    activity!: Transaction[]
}
