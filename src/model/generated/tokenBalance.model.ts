import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Token} from "./token.model"

@Entity_()
export class TokenBalance {
    constructor(props?: Partial<TokenBalance>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amount!: bigint

    @Index_()
    @ManyToOne_(() => Token, {nullable: true})
    token!: Token

    @Column_("text", {nullable: false})
    owner!: string

    @Column_("int4", {nullable: false})
    onsale!: number

    @Column_("int4", {nullable: false})
    onauction!: number
}
