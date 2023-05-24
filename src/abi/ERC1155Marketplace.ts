import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './ERC1155Marketplace.abi'

export const abi = new ethers.utils.Interface(ABI_JSON);

export const events = {
    ApprovalForAll: new LogEvent<([account: string, operator: string, approved: boolean] & {account: string, operator: string, approved: boolean})>(
        abi, '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
    ),
    OwnershipTransferred: new LogEvent<([previousOwner: string, newOwner: string] & {previousOwner: string, newOwner: string})>(
        abi, '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0'
    ),
    TransferBatch: new LogEvent<([operator: string, from: string, to: string, ids: Array<ethers.BigNumber>, values: Array<ethers.BigNumber>] & {operator: string, from: string, to: string, ids: Array<ethers.BigNumber>})>(
        abi, '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb'
    ),
    TransferSingle: new LogEvent<([operator: string, from: string, to: string, id: ethers.BigNumber, value: ethers.BigNumber] & {operator: string, from: string, to: string, id: ethers.BigNumber, value: ethers.BigNumber})>(
        abi, '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62'
    ),
    URI: new LogEvent<([value: string, id: ethers.BigNumber] & {value: string, id: ethers.BigNumber})>(
        abi, '0x6bb7ff708619ba0610cba295a58592e0451dee2622938c8755667688daf3529b'
    ),
}

export const functions = {
    balanceOf: new Func<[account: string, id: ethers.BigNumber], {account: string, id: ethers.BigNumber}, ethers.BigNumber>(
        abi, '0x00fdd58e'
    ),
    balanceOfBatch: new Func<[accounts: Array<string>, ids: Array<ethers.BigNumber>], {accounts: Array<string>, ids: Array<ethers.BigNumber>}, Array<ethers.BigNumber>>(
        abi, '0x4e1273f4'
    ),
    burn: new Func<[account: string, id: ethers.BigNumber, value: ethers.BigNumber], {account: string, id: ethers.BigNumber, value: ethers.BigNumber}, []>(
        abi, '0xf5298aca'
    ),
    burnBatch: new Func<[account: string, ids: Array<ethers.BigNumber>, values: Array<ethers.BigNumber>], {account: string, ids: Array<ethers.BigNumber>}, []>(
        abi, '0x6b20c454'
    ),
    isApprovedForAll: new Func<[account: string, operator: string], {account: string, operator: string}, boolean>(
        abi, '0xe985e9c5'
    ),
    lastID: new Func<[], {}, ethers.BigNumber>(
        abi, '0xe31a9d92'
    ),
    nftMint: new Func<[_tokenURI: string, _amt: ethers.BigNumber, _royaltyNumerator: ethers.BigNumber], {_tokenURI: string, _amt: ethers.BigNumber, _royaltyNumerator: ethers.BigNumber}, []>(
        abi, '0x4a2d0010'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    renounceOwnership: new Func<[], {}, []>(
        abi, '0x715018a6'
    ),
    royaltyInfo: new Func<[_tokenId: ethers.BigNumber, _salePrice: ethers.BigNumber], {_tokenId: ethers.BigNumber, _salePrice: ethers.BigNumber}, [_: string, _: ethers.BigNumber]>(
        abi, '0x2a55205a'
    ),
    safeBatchTransferFrom: new Func<[from: string, to: string, ids: Array<ethers.BigNumber>, amounts: Array<ethers.BigNumber>, data: string], {from: string, to: string, ids: Array<ethers.BigNumber>, amounts: Array<ethers.BigNumber>, data: string}, []>(
        abi, '0x2eb2c2d6'
    ),
    safeTransferFrom: new Func<[from: string, to: string, id: ethers.BigNumber, amount: ethers.BigNumber, data: string], {from: string, to: string, id: ethers.BigNumber, amount: ethers.BigNumber, data: string}, []>(
        abi, '0xf242432a'
    ),
    setApprovalForAll: new Func<[operator: string, approved: boolean], {operator: string, approved: boolean}, []>(
        abi, '0xa22cb465'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    transferOwnership: new Func<[newOwner: string], {newOwner: string}, []>(
        abi, '0xf2fde38b'
    ),
    uri: new Func<[tkid: ethers.BigNumber], {tkid: ethers.BigNumber}, string>(
        abi, '0x0e89341c'
    ),
}

export class Contract extends ContractBase {

    balanceOf(account: string, id: ethers.BigNumber): Promise<ethers.BigNumber> {
        return this.eth_call(functions.balanceOf, [account, id])
    }

    balanceOfBatch(accounts: Array<string>, ids: Array<ethers.BigNumber>): Promise<Array<ethers.BigNumber>> {
        return this.eth_call(functions.balanceOfBatch, [accounts, ids])
    }

    isApprovedForAll(account: string, operator: string): Promise<boolean> {
        return this.eth_call(functions.isApprovedForAll, [account, operator])
    }

    lastID(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.lastID, [])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    royaltyInfo(_tokenId: ethers.BigNumber, _salePrice: ethers.BigNumber): Promise<[_: string, _: ethers.BigNumber]> {
        return this.eth_call(functions.royaltyInfo, [_tokenId, _salePrice])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    uri(tkid: ethers.BigNumber): Promise<string> {
        return this.eth_call(functions.uri, [tkid])
    }
}
