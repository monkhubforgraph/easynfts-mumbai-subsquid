import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './Escrow.abi'

export const abi = new ethers.utils.Interface(ABI_JSON);

export const events = {
    AuctionCancelled: new LogEvent<([_seller: string, _tokenID: ethers.BigNumber, orderId: string] & {_seller: string, _tokenID: ethers.BigNumber, orderId: string})>(
        abi, '0xa141abdcf6de79d08d7edb87133b448a3a2c5b3cb575e3bbf6023bf0b15ae545'
    ),
    BidPlaced: new LogEvent<([_seller: string, _bidder: string, orderId: string, _tokenId: ethers.BigNumber, price: ethers.BigNumber, expTime: ethers.BigNumber] & {_seller: string, _bidder: string, orderId: string, _tokenId: ethers.BigNumber, price: ethers.BigNumber, expTime: ethers.BigNumber})>(
        abi, '0xd7570b1186465f8b5845771414166a01137123ced72306566fcf2a77cf3ddc67'
    ),
    EarningsCreditedMarket: new LogEvent<([_fundManager: string, _amtCredited: ethers.BigNumber] & {_fundManager: string, _amtCredited: ethers.BigNumber})>(
        abi, '0xeff80f33893a8a24a1285b257e39c25e0c0aa1e493bdbc37a8dc16addb98459d'
    ),
    TokenPurchased: new LogEvent<([_seller: string, _buyer: string, _contract: string, _orderID: string, _tokenIdPurchased: ethers.BigNumber, _amountBought: ethers.BigNumber, _cost: ethers.BigNumber, _totalListed: ethers.BigNumber] & {_seller: string, _buyer: string, _contract: string, _orderID: string, _tokenIdPurchased: ethers.BigNumber, _amountBought: ethers.BigNumber, _cost: ethers.BigNumber, _totalListed: ethers.BigNumber})>(
        abi, '0x90da98b51497af571c5a5abb78ea212c0776da064c236a234943db21b40591e5'
    ),
    TokenSold: new LogEvent<([_seller: string, _buyer: string, orderId: string, _tokenIdPurchased: ethers.BigNumber] & {_seller: string, _buyer: string, orderId: string, _tokenIdPurchased: ethers.BigNumber})>(
        abi, '0xd859b133af845603cde780acb95200a4c897f3e6b3ef7ca6e6e9812b303da861'
    ),
    TokenUnlisted: new LogEvent<([_seller: string, _contract: string, _tokenIdUnlisted: ethers.BigNumber, _orderid: string] & {_seller: string, _contract: string, _tokenIdUnlisted: ethers.BigNumber, _orderid: string})>(
        abi, '0xb5ce95a888dde765bb6fdffd3ddae69bc8efaa294653a5f5568642e6feb5c705'
    ),
}

export const functions = {
    changeBidIncAmt: new Func<[_amt: ethers.BigNumber], {_amt: ethers.BigNumber}, []>(
        abi, '0x126f0ad8'
    ),
    changeBidIncPercent: new Func<[_per: ethers.BigNumber], {_per: ethers.BigNumber}, []>(
        abi, '0x307bdf00'
    ),
    changeMinAuctionPrice: new Func<[_new: ethers.BigNumber], {_new: ethers.BigNumber}, []>(
        abi, '0xda547414'
    ),
    changeOwnerAddress: new Func<[_newOwner: string], {_newOwner: string}, []>(
        abi, '0x85eac05f'
    ),
    confirmSale: new Func<[orderID: string], {orderID: string}, []>(
        abi, '0x45f7fa21'
    ),
    fulfillSale: new Func<[orderID: string, buyAmount: ethers.BigNumber, contractAddr: string, tokenId: ethers.BigNumber, tktype: number, seller: string, listedPrice: ethers.BigNumber, listedAmount: ethers.BigNumber, signature: string], {orderID: string, buyAmount: ethers.BigNumber, contractAddr: string, tokenId: ethers.BigNumber, tktype: number, seller: string, listedPrice: ethers.BigNumber, listedAmount: ethers.BigNumber, signature: string}, []>(
        abi, '0xc16bed4d'
    ),
    getEthSignedMessageHash: new Func<[_messageHash: string], {_messageHash: string}, string>(
        abi, '0xfa540801'
    ),
    getMessageHash: new Func<[orderID: string, listedAmount: ethers.BigNumber, contractAddr: string, tokenId: ethers.BigNumber, price: ethers.BigNumber, ordertype: number], {orderID: string, listedAmount: ethers.BigNumber, contractAddr: string, tokenId: ethers.BigNumber, price: ethers.BigNumber, ordertype: number}, string>(
        abi, '0x901addda'
    ),
    minPrice: new Func<[], {}, ethers.BigNumber>(
        abi, '0xe45be8eb'
    ),
    minSalePrice: new Func<[], {}, ethers.BigNumber>(
        abi, '0x5ca11c34'
    ),
    onERC1155BatchReceived: new Func<[_: string, _: string, _: Array<ethers.BigNumber>, _: Array<ethers.BigNumber>, _: string], {}, string>(
        abi, '0xbc197c81'
    ),
    onERC1155Received: new Func<[_: string, _: string, _: ethers.BigNumber, _: ethers.BigNumber, _: string], {}, string>(
        abi, '0xf23a6e61'
    ),
    onERC721Received: new Func<[_: string, _: string, _: ethers.BigNumber, _: string], {}, string>(
        abi, '0x150b7a02'
    ),
    orders: new Func<[_: string], {}, ([stage: number, seller: string, tokenID: ethers.BigNumber, contractAddr: string, ordertype: number, highestBid: ethers.BigNumber, highestBidder: string, minBid: ethers.BigNumber, amountListed: ethers.BigNumber, timeLimit: ethers.BigNumber] & {stage: number, seller: string, tokenID: ethers.BigNumber, contractAddr: string, ordertype: number, highestBid: ethers.BigNumber, highestBidder: string, minBid: ethers.BigNumber, amountListed: ethers.BigNumber, timeLimit: ethers.BigNumber})>(
        abi, '0x1a948947'
    ),
    placeBid: new Func<[orderID: string, contractAddr: string, tokenId: ethers.BigNumber, tktype: number, seller: string, minBid: ethers.BigNumber, timeLimit: ethers.BigNumber, signature: string], {orderID: string, contractAddr: string, tokenId: ethers.BigNumber, tktype: number, seller: string, minBid: ethers.BigNumber, timeLimit: ethers.BigNumber, signature: string}, []>(
        abi, '0xe4669e40'
    ),
    recoverSigner: new Func<[_ethSignedMessageHash: string, _signature: string], {_ethSignedMessageHash: string, _signature: string}, string>(
        abi, '0x97aba7f9'
    ),
    splitSignature: new Func<[sig: string], {sig: string}, ([r: string, s: string, v: number] & {r: string, s: string, v: number})>(
        abi, '0xa7bb5803'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    tokenType: new Func<[_: string], {}, number>(
        abi, '0x1f761386'
    ),
    unlistAuction: new Func<[orderID: string, contractAddr: string, tokenId: ethers.BigNumber, tktype: number, seller: string, minBid: ethers.BigNumber, timeLimit: ethers.BigNumber, signature: string], {orderID: string, contractAddr: string, tokenId: ethers.BigNumber, tktype: number, seller: string, minBid: ethers.BigNumber, timeLimit: ethers.BigNumber, signature: string}, []>(
        abi, '0x7430f742'
    ),
    unlistSale: new Func<[orderID: string, buyAmount: ethers.BigNumber, contractAddr: string, tokenId: ethers.BigNumber, tktype: number, seller: string, listedPrice: ethers.BigNumber, listedAmount: ethers.BigNumber, signature: string], {orderID: string, buyAmount: ethers.BigNumber, contractAddr: string, tokenId: ethers.BigNumber, tktype: number, seller: string, listedPrice: ethers.BigNumber, listedAmount: ethers.BigNumber, signature: string}, []>(
        abi, '0x14b9dd13'
    ),
    verify: new Func<[_signer: string, orderID: string, listedAmount: ethers.BigNumber, contractAddr: string, tokenId: ethers.BigNumber, price: ethers.BigNumber, ordertype: number, signature: string], {_signer: string, orderID: string, listedAmount: ethers.BigNumber, contractAddr: string, tokenId: ethers.BigNumber, price: ethers.BigNumber, ordertype: number, signature: string}, boolean>(
        abi, '0x6b6710b4'
    ),
}

export class Contract extends ContractBase {

    getEthSignedMessageHash(_messageHash: string): Promise<string> {
        return this.eth_call(functions.getEthSignedMessageHash, [_messageHash])
    }

    getMessageHash(orderID: string, listedAmount: ethers.BigNumber, contractAddr: string, tokenId: ethers.BigNumber, price: ethers.BigNumber, ordertype: number): Promise<string> {
        return this.eth_call(functions.getMessageHash, [orderID, listedAmount, contractAddr, tokenId, price, ordertype])
    }

    minPrice(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.minPrice, [])
    }

    minSalePrice(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.minSalePrice, [])
    }

    orders(arg0: string): Promise<([stage: number, seller: string, tokenID: ethers.BigNumber, contractAddr: string, ordertype: number, highestBid: ethers.BigNumber, highestBidder: string, minBid: ethers.BigNumber, amountListed: ethers.BigNumber, timeLimit: ethers.BigNumber] & {stage: number, seller: string, tokenID: ethers.BigNumber, contractAddr: string, ordertype: number, highestBid: ethers.BigNumber, highestBidder: string, minBid: ethers.BigNumber, amountListed: ethers.BigNumber, timeLimit: ethers.BigNumber})> {
        return this.eth_call(functions.orders, [arg0])
    }

    recoverSigner(_ethSignedMessageHash: string, _signature: string): Promise<string> {
        return this.eth_call(functions.recoverSigner, [_ethSignedMessageHash, _signature])
    }

    splitSignature(sig: string): Promise<([r: string, s: string, v: number] & {r: string, s: string, v: number})> {
        return this.eth_call(functions.splitSignature, [sig])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    tokenType(arg0: string): Promise<number> {
        return this.eth_call(functions.tokenType, [arg0])
    }

    verify(_signer: string, orderID: string, listedAmount: ethers.BigNumber, contractAddr: string, tokenId: ethers.BigNumber, price: ethers.BigNumber, ordertype: number, signature: string): Promise<boolean> {
        return this.eth_call(functions.verify, [_signer, orderID, listedAmount, contractAddr, tokenId, price, ordertype, signature])
    }
}
