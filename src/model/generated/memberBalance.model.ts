import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Order} from "./order.model"

@Entity_()
export class MemberBalance {
    constructor(props?: Partial<MemberBalance>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    balanceChange!: bigint | undefined | null

    @Column_("bool", {nullable: true})
    isCredit!: boolean | undefined | null

    @Column_("text", {nullable: true})
    source!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Order, {nullable: true})
    order!: Order | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    timestamp!: bigint | undefined | null
}
