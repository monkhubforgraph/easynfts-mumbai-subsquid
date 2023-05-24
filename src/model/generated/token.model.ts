import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {TokenBalance} from "./tokenBalance.model"

@Entity_()
export class Token {
    constructor(props?: Partial<Token>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: true})
    creator!: string | undefined | null

    @OneToMany_(() => TokenBalance, e => e.token)
    balances!: TokenBalance[]

    @Column_("text", {nullable: true})
    uri!: string | undefined | null

    @Column_("text", {nullable: true})
    contractAddress!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    amountminted!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    mintedTime!: bigint | undefined | null

    @Column_("int4", {nullable: true})
    txncount!: number | undefined | null

    @Column_("text", {nullable: true})
    type!: string | undefined | null
}
