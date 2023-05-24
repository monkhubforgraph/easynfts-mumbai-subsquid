import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './MarketManagement.abi'

export const abi = new ethers.utils.Interface(ABI_JSON);

export const events = {
    AddedShopCreator: new LogEvent<([MarketManager: string, creator: string] & {MarketManager: string, creator: string})>(
        abi, '0x4edcdc783198afc11f9b2e58c25631b06664fdea64b6b06c5dfdac9158a98b0d'
    ),
    EarningsWithdrawn: new LogEvent<([_fundManager: string, _amtWithdrawn: ethers.BigNumber] & {_fundManager: string, _amtWithdrawn: ethers.BigNumber})>(
        abi, '0x48dc35af7b45e2a81fffad55f6e2fafacdb1d3d0d50d24ebdc16324f5ba757f1'
    ),
    MarketCommissionChanged: new LogEvent<([MarketManager: string, new_commission: ethers.BigNumber] & {MarketManager: string, new_commission: ethers.BigNumber})>(
        abi, '0x59f61a4107424a0e3e780cde165da3f210203151697a2199ccf6754e7f31a433'
    ),
    MarketInitiated: new LogEvent<([_fundManager: string, _isMarketplace: boolean] & {_fundManager: string, _isMarketplace: boolean})>(
        abi, '0x54896dbab46a0c6ff1a77f13eaa6075d59eab55d6f03349bad3652aee9282427'
    ),
    RemovedShopCreator: new LogEvent<([MarketManager: string, creator: string] & {MarketManager: string, creator: string})>(
        abi, '0x1fcf79abe74e1b9a8f1e952b68d164cba49d406365b899d9a647069e13425e3d'
    ),
}

export const functions = {
    addShopCreator: new Func<[_addr: string], {_addr: string}, []>(
        abi, '0x322aabae'
    ),
    balance: new Func<[], {}, ethers.BigNumber>(
        abi, '0xb69ef8a8'
    ),
    changeEarningCommission: new Func<[newCommission: ethers.BigNumber], {newCommission: ethers.BigNumber}, []>(
        abi, '0x2057089e'
    ),
    changeOwnerAddress: new Func<[_newOwner: string], {_newOwner: string}, []>(
        abi, '0x85eac05f'
    ),
    earningCommission: new Func<[], {}, ethers.BigNumber>(
        abi, '0x0dfad312'
    ),
    isMarketplace: new Func<[], {}, boolean>(
        abi, '0xf4b86c48'
    ),
    isShopCreator: new Func<[_addr: string], {_addr: string}, boolean>(
        abi, '0x14bb75a5'
    ),
    removeShopCreator: new Func<[_addr: string], {_addr: string}, []>(
        abi, '0xdc8585d9'
    ),
    withdrawEarnings: new Func<[_amount: ethers.BigNumber, _to: string], {_amount: ethers.BigNumber, _to: string}, []>(
        abi, '0x0eeffb32'
    ),
}

export class Contract extends ContractBase {

    balance(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.balance, [])
    }

    earningCommission(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.earningCommission, [])
    }

    isMarketplace(): Promise<boolean> {
        return this.eth_call(functions.isMarketplace, [])
    }

    isShopCreator(_addr: string): Promise<boolean> {
        return this.eth_call(functions.isShopCreator, [_addr])
    }
}
