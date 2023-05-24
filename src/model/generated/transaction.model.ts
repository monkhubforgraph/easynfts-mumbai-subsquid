import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Order} from "./order.model"
import {Token} from "./token.model"

@Entity_()
export class Transaction {
    constructor(props?: Partial<Transaction>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Order, {nullable: true})
    order!: Order | undefined | null

    @Column_("text", {nullable: true})
    type!: string | undefined | null

    @Column_("text", {nullable: true})
    from!: string | undefined | null

    @Column_("text", {nullable: true})
    to!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Token, {nullable: true})
    token!: Token | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    ethamount!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    tokenamount!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    time!: bigint | undefined | null
}
