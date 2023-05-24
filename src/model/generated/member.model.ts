import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Member {
    constructor(props?: Partial<Member>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("bool", {nullable: false})
    isMarketplace!: boolean

    @Column_("text", {array: true, nullable: false})
    shopCreators!: (string)[]
}
