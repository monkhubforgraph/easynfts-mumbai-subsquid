import { TypeormDatabase } from '@subsquid/typeorm-store';
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { lookupArchive } from '@subsquid/archive-registry'
import assert from 'assert';
import { events as events1155, Contract as erc1155Contract } from "./abi/ERC1155Marketplace";
import { events as events721, Contract as erc721Contract } from "./abi/ERC721Marketplace";
import { events as eventsMarket } from "./abi/MarketManagement";
import { events as eventsEscrow, Contract as escrowContract } from "./abi/Escrow";

import { Member, MemberBalance, Order, Token, TokenBalance, Transaction, } from './model';
import { BigNumber } from 'ethers';

const MEMBER_ADDRESS = '0xc4A0b823fC968cccAba2EB7a2119a4800866A76d';
const ESCROW_ADDRESS = '0xD59254B4363DbE63dAdeb3392a1Da5d19e65E23a';

const processor = new EvmBatchProcessor()
  .setDataSource({
    // uncomment and set RPC_ENDPOONT to enable contract state queries. 
    // Both https and wss endpoints are supported. 
    chain: process.env.RPC_ENDPOINT,

    // Change the Archive endpoints for run the squid 
    // against the other EVM networks
    // For a full list of supported networks and config options
    // see https://docs.subsquid.io/develop-a-squid/evm-processor/configuration/

    archive: lookupArchive('polygon-mumbai'),
  })
  .setBlockRange({ from: 35498483 })
  .addLog(MEMBER_ADDRESS, { //MemberManagement
    filter: [[
      eventsMarket.AddedShopCreator.topic,
      eventsMarket.EarningsWithdrawn.topic,
      eventsMarket.MarketCommissionChanged.topic,
      eventsMarket.MarketInitiated.topic,
      eventsMarket.RemovedShopCreator.topic
    ]],
    data: {
      // define the log fields to be fetched from the archive
      evmLog: {
        topics: true,
        data: true,
      },
      transaction: {
        hash: true
      }
    } as const,
  })
  .addLog(ESCROW_ADDRESS, { //Escrow
    filter: [[
      eventsEscrow.AuctionCancelled.topic,
      eventsEscrow.BidPlaced.topic,
      eventsEscrow.TokenPurchased.topic,
      eventsEscrow.TokenSold.topic,
      eventsEscrow.TokenUnlisted.topic,
      eventsEscrow.EarningsCreditedMarket.topic,
    ]],
    data: {
      // define the log fields to be fetched from the archive
      evmLog: {
        topics: true,
        data: true,
      },
      transaction: {
        hash: true
      }
    } as const,
  })
  .addLog([], { //ERC721
    filter: [[
      events721.Transfer.topic
    ]],
    data: {
      // define the log fields to be fetched from the archive
      evmLog: {
        topics: true,
        data: true,
      },
      transaction: {
        hash: true
      }
    } as const,
  })
  .addLog([], { //ERC1155
    filter: [[
      events1155.TransferSingle.topic,
      events1155.TransferBatch.topic,
      events1155.URI.topic
    ]],
    data: {
      // define the log fields to be fetched from the archive
      evmLog: {
        topics: true,
        data: true,
      },
      transaction: {
        hash: true
      }
    } as const,
  });


processor.run(new TypeormDatabase(), async (ctx) => {
  let member: Member | undefined;
  let order: Order | undefined;
  const memberBalances: Map<string, MemberBalance> = new Map();
  const orders: Map<string, Order> = new Map();
  const transactions: Map<string, Transaction> = new Map();
  const tokenbalances: Map<string, TokenBalance> = new Map();
  const tokens: Map<string, Token> = new Map();
  let escrowInstance;
  let tokenInstance;
  let tokenBalanceInstance;
  let memberBalanceInstance;
  let erc1155Instance;
  let erc721Instance
  for (let c of ctx.blocks) {
    escrowInstance = new escrowContract(
      ctx,
      c.header,
      ESCROW_ADDRESS
    );
    for (let i of c.items) {
      if (i.kind === 'evmLog') {
        //marketManagement
        if (i.evmLog.topics[0] === eventsMarket.MarketInitiated.topic) {

          const { _fundManager, _isMarketplace } = eventsMarket.MarketInitiated.decode(i.evmLog);
          //console.log(i.address.toLocaleLowerCase(),i.transaction.hash);
          let a: string[] = [_fundManager.toLocaleLowerCase()];
          member = new Member({ id: _fundManager, isMarketplace: _isMarketplace, shopCreators: a });
          await ctx.store.save(member);


        }
        else if (i.evmLog.topics[0] === eventsMarket.AddedShopCreator.topic) {
          // try {
          //console.log(i.address.toLocaleLowerCase(),i.transaction.hash);
          const { MarketManager, creator } = eventsMarket.AddedShopCreator.decode(i.evmLog);
          // if (!(MarketManager && creator))
          //   throw new Error();
          member = await ctx.store.get(Member, MarketManager.toLocaleLowerCase());
          if (member) {
            member.shopCreators.push(creator.toLocaleLowerCase());
            await ctx.store.save(member);
          }
          // }
          // catch (e) {
          //   continue;
          // }

        }
        else if (i.evmLog.topics[0] === eventsMarket.RemovedShopCreator.topic) {
          // try {
          //console.log(i.address.toLocaleLowerCase(),i.transaction.hash);
          const { MarketManager, creator } = eventsMarket.RemovedShopCreator.decode(i.evmLog);
          // if (!(MarketManager && creator))
          //   throw new Error();
          member = await ctx.store.get(Member, MarketManager.toLocaleLowerCase());
          if (member) {
            member.shopCreators.splice(member.shopCreators.indexOf(creator.toLocaleLowerCase()), 1);
            await ctx.store.save(member);
          }
          // }
          // catch {
          //   continue;
          // }
        }
        else if (i.evmLog.topics[0] === eventsMarket.EarningsWithdrawn.topic) {
          // try {
          //console.log(i.address.toLocaleLowerCase(),i.transaction.hash);
          const { _fundManager, _amtWithdrawn } = eventsMarket.EarningsWithdrawn.decode(i.evmLog);
          if (!(_fundManager && _amtWithdrawn))
            throw new Error();
          member = await ctx.store.get(Member, _fundManager.toLocaleLowerCase());
          if (member) {
            memberBalances.set(c.header.timestamp.toString() + "_debit", new MemberBalance({
              id: c.header.timestamp.toString() + "_debit",
              balanceChange: _amtWithdrawn.toBigInt(),
              isCredit: false,
              source: "Withdrawal",
              timestamp: BigInt(c.header.timestamp)
            }))
          }
          // }
          // catch (err) {
          //   continue;
          // }

        }
        //escrow
        else if (i.evmLog.topics[0] === eventsEscrow.EarningsCreditedMarket.topic) {
          try {
            const { _fundManager, _amtCredited } = eventsEscrow.EarningsCreditedMarket.decode(i.evmLog);
            if (!(_fundManager && _amtCredited))
              throw new Error();
          }
          catch (err) {
            continue;
          }
          //console.log(i.address.toLocaleLowerCase(),i.transaction.hash);
          const { _fundManager, _amtCredited } = eventsEscrow.EarningsCreditedMarket.decode(i.evmLog);
          member = await ctx.store.get(Member, _fundManager.toLocaleLowerCase());
          if (member) {
            memberBalances.set(c.header.timestamp.toString() + "_credit", new MemberBalance({
              id: c.header.timestamp.toString() + "_credit",
              balanceChange: _amtCredited.toBigInt(),
              isCredit: true,
              source: "Earnings",
              timestamp: BigInt(c.header.timestamp)
            }))
          }
        }
        else if (i.evmLog.topics[0] === eventsEscrow.AuctionCancelled.topic) {
          try {
            const { _seller, _tokenID, orderId } = eventsEscrow.AuctionCancelled.decode(i.evmLog);
            if (!(_seller && _tokenID && orderId))
              throw new Error();
          }
          catch (err) {
            continue;
          }
          //console.log(i.address.toLocaleLowerCase(),i.transaction.hash);
          let { _seller, _tokenID, orderId } = eventsEscrow.AuctionCancelled.decode(i.evmLog);
          _seller = _seller.toLocaleLowerCase();
          orderId = orderId.toLocaleLowerCase();
          order = await ctx.store.get(Order, orderId);
          tokenInstance = tokens.get(((await escrowInstance.orders(orderId)).contractAddr.toLocaleLowerCase()) + "_" + _tokenID.toString());
          assert(tokenInstance);
          tokenBalanceInstance = tokenbalances.get(tokenInstance.id + _seller);
          assert(tokenBalanceInstance);
          if (order) {
            order.stage = "Closed";
            order.orderSuccess = false;
            orders.set(orderId, order);

            transactions.set(i.transaction.hash, new Transaction({
              id: i.transaction.hash,
              order,
              type: "AuctionCancelled",
              from: ESCROW_ADDRESS,
              to: _seller,
              token: tokenInstance,
              time: BigInt(c.header.timestamp),
              tokenamount: BigInt(1)
            }))
          }
          else {
            orders.set(orderId, new Order({
              id: orderId,
              stage: "Closed",
              type: "Auction",
              price: BigInt(0),
              token: tokenInstance,
              remtokens: 0,
              createdBy: _seller,
              orderSuccess: false
            }))
            transactions.set(i.transaction.hash, new Transaction({
              id: i.transaction.hash,
              order,
              type: "AuctionCancelled",
              from: ESCROW_ADDRESS,
              to: _seller,
              token: tokenInstance,
              time: BigInt(c.header.timestamp),
              tokenamount: BigInt(1)
            }))
          }
          if (tokenBalanceInstance.onauction)
            tokenBalanceInstance.onauction -= 1;
          tokenbalances.set(tokenBalanceInstance.id, tokenBalanceInstance);
        }
        else if (i.evmLog.topics[0] === eventsEscrow.TokenUnlisted.topic) {
          try {
            const { _seller, _contract, _orderid, _tokenIdUnlisted } = eventsEscrow.TokenUnlisted.decode(i.evmLog);
            if (!(_seller && _contract && _orderid && _tokenIdUnlisted))
              throw new Error();
          }
          catch (err) {
            continue;
          }
          //console.log(i.address.toLocaleLowerCase(),i.transaction.hash);
          let { _seller, _contract, _orderid, _tokenIdUnlisted } = eventsEscrow.TokenUnlisted.decode(i.evmLog);
          _seller = _seller.toLocaleLowerCase();
          _contract = _contract.toLocaleLowerCase();
          _orderid = _orderid.toLocaleLowerCase();
          order = await ctx.store.get(Order, _orderid);
          tokenInstance = tokens.get(_contract + "_" + _tokenIdUnlisted.toString());
          assert(tokenInstance);
          tokenBalanceInstance = tokenbalances.get(tokenInstance.id + _seller);
          assert(tokenBalanceInstance);
          if (order) {
            order.stage = "Closed";
            order.remtokens = 0;
            order.orderSuccess = false;
            orders.set(_orderid, order);

            transactions.set(i.transaction.hash, new Transaction({
              id: i.transaction.hash.toLocaleLowerCase(),
              order,
              type: "TokenUnlisted",
              from: ESCROW_ADDRESS,
              to: _seller,
              token: tokenInstance,
              time: BigInt(c.header.timestamp),
              tokenamount: BigInt(0)
            }))
          }
          else {
            orders.set(_orderid, new Order({
              id: _orderid,
              stage: "Closed",
              type: "Sale",
              price: ((await escrowInstance.orders(_orderid)).minBid).toBigInt(),
              token: tokenInstance,
              remtokens: 0,
              createdBy: _seller,
              orderSuccess: false
            }))
            transactions.set(i.transaction.hash, new Transaction({
              id: i.transaction.hash,
              order,
              type: "AuctionCancelled",
              from: ESCROW_ADDRESS,
              to: _seller,
              token: tokenInstance,
              time: BigInt(c.header.timestamp),
              tokenamount: BigInt(1)
            }))
          }

          // if (tokenBalanceInstance.onsale)
          tokenBalanceInstance.onsale -= (await escrowInstance.orders(_orderid)).amountListed.toNumber();
          tokenbalances.set(tokenBalanceInstance.id, tokenBalanceInstance);
        }
        else if (i.evmLog.topics[0] === eventsEscrow.BidPlaced.topic) {
          try {
            const { _seller, _bidder, orderId, _tokenId, price, expTime } = eventsEscrow.BidPlaced.decode(i.evmLog);
            if (!(_seller && _bidder && orderId && _tokenId && price && expTime))
              throw new Error();
          }
          catch (err) {
            continue;
          }
          //console.log(i.address.toLocaleLowerCase(),i.transaction.hash);
          let { _seller, _bidder, orderId, _tokenId, price, expTime } = eventsEscrow.BidPlaced.decode(i.evmLog);
          _seller = _seller.toLocaleLowerCase();
          _bidder = _bidder.toLocaleLowerCase();
          orderId = orderId.toLocaleLowerCase();
          order = await ctx.store.get(Order, orderId);
          tokenInstance = tokens.get(((await escrowInstance.orders(orderId)).contractAddr.toLocaleLowerCase()) + "_" + _tokenId.toString());
          assert(tokenInstance);
          tokenBalanceInstance = tokenbalances.get(tokenInstance.id + _seller);
          assert(tokenBalanceInstance);
          if (order) {
            order.exptime = expTime.toBigInt();
            order.price = price.toBigInt();
            order.orderSuccess = false;
            orders.set(orderId, order);
          }
          else {
            orders.set(orderId, new Order({
              id: orderId,
              stage: "Listed",
              type: "Auction",
              token: tokenInstance,
              remtokens: 1,
              createdBy: _seller,
              orderSuccess: false,
              exptime: expTime.toBigInt(),
              price: price.toBigInt(),
              minprice: (await escrowInstance.orders(orderId)).minBid.toBigInt()
            }))

            // if (tokenBalanceInstance.onsale != null)
            tokenBalanceInstance.onsale += 1;
            tokenbalances.set(tokenBalanceInstance.id, tokenBalanceInstance);
          }
          if (tokenInstance.txncount)
            tokenInstance.txncount++;
          tokens.set(tokenInstance.id, tokenInstance);
          transactions.set(i.transaction.hash, new Transaction({
            id: i.transaction.hash,
            order,
            type: "BidPlaced",
            from: _bidder,
            to: ESCROW_ADDRESS,
            token: tokenInstance,
            time: BigInt(c.header.timestamp)
          }))
        }
        else if (i.evmLog.topics[0] === eventsEscrow.TokenSold.topic) {
          try {
            const { _seller, _buyer, orderId, _tokenIdPurchased } = eventsEscrow.TokenSold.decode(i.evmLog);
            if (!(_seller && _buyer && orderId && _tokenIdPurchased))
              throw new Error();
          }
          catch (err) {
            continue;
          }
          //console.log(i.address.toLocaleLowerCase(),i.transaction.hash);
          let { _seller, _buyer, orderId, _tokenIdPurchased } = eventsEscrow.TokenSold.decode(i.evmLog);
          _seller = _seller.toLocaleLowerCase();
          _buyer = _buyer.toLocaleLowerCase();
          orderId = orderId.toLocaleLowerCase();
          order = await ctx.store.get(Order, orderId);
          assert(order);
          tokenInstance = tokens.get(((await escrowInstance.orders(orderId)).contractAddr.toLocaleLowerCase()) + "_" + _tokenIdPurchased.toString());
          assert(tokenInstance);
          tokenBalanceInstance = tokenbalances.get(tokenInstance.id + _seller);
          assert(tokenBalanceInstance);

          order.stage = "Closed";
          order.remtokens = 0;
          order.orderSuccess = true;
          orders.set(orderId, order);

          if (tokenInstance.txncount)
            tokenInstance.txncount++;
          tokens.set(tokenInstance.id, tokenInstance);

          tokenBalanceInstance.onauction--;
          tokenbalances.set(tokenBalanceInstance.id, tokenBalanceInstance);

          memberBalanceInstance = memberBalances.get(c.header.timestamp.toString() + "_credit");
          if (memberBalanceInstance) {
            memberBalanceInstance.order = order;
            memberBalanceInstance.source = "Auction";
          }
          else {
            memberBalanceInstance = new MemberBalance({
              id: c.header.timestamp.toString() + "_credit",
              isCredit: true,
              source: "Auction",
              order,
              timestamp: BigInt(c.header.timestamp)
            })
          }
          memberBalances.set(memberBalanceInstance.id, memberBalanceInstance);

          transactions.set(i.transaction.hash, new Transaction({
            id: i.transaction.hash,
            order,
            type: "TokenSold",
            from: _seller,
            to: _buyer,
            token: tokenInstance,
            time: BigInt(c.header.timestamp),
            ethamount: (await escrowInstance.orders(orderId)).highestBid.toBigInt()
          }));
        }
        else if (i.evmLog.topics[0] === eventsEscrow.TokenPurchased.topic) {
          try {
            const { _seller, _buyer, _contract, _orderID, _tokenIdPurchased, _amountBought, _cost, _totalListed } = eventsEscrow.TokenPurchased.decode(i.evmLog);
            if (!(_seller && _buyer && _contract && _orderID && _tokenIdPurchased && _amountBought && _cost && _totalListed))
              throw new Error();
          }
          catch (err) {
            continue;
          }
          //console.log(i.address.toLocaleLowerCase(),i.transaction.hash);
          let { _seller, _buyer, _contract, _orderID, _tokenIdPurchased, _amountBought, _cost, _totalListed } = eventsEscrow.TokenPurchased.decode(i.evmLog);
          _seller = _seller.toLocaleLowerCase();
          _buyer = _buyer.toLocaleLowerCase();
          _contract = _contract.toLocaleLowerCase();
          _orderID = _orderID.toLocaleLowerCase();
          order = await ctx.store.get(Order, _orderID);
          tokenInstance = tokens.get(_contract + "_" + _tokenIdPurchased.toString());
          assert(tokenInstance);
          tokenBalanceInstance = tokenbalances.get(tokenInstance.id + _seller);
          assert(tokenBalanceInstance);
          if (!order) {
            orders.set(_orderID, new Order({
              id: _orderID,
              stage: "Listed",
              type: "Sale",
              token: tokenInstance,
              remtokens: _totalListed.toNumber(),
              createdBy: _seller,
              orderSuccess: false,
              price: (await escrowInstance.orders(_orderID)).minBid.toBigInt()
            }))
            order = await ctx.store.get(Order, _orderID);
          }

          assert(order);
          order.remtokens -= _amountBought.toNumber();
          if (order.remtokens != 0)
            order.stage = "PartiallySold";
          else { order.stage = "Closed"; order.orderSuccess = true; }
          orders.set(order.id, order);

          // if (tokenBalanceInstance.onsale)
          tokenBalanceInstance.onsale -= _amountBought.toNumber();
          tokenbalances.set(tokenBalanceInstance.id, tokenBalanceInstance);
          if (tokenInstance.txncount)
            tokenInstance.txncount++;
          tokens.set(tokenInstance.id, tokenInstance);

          transactions.set(i.transaction.hash, new Transaction({
            id: i.transaction.hash,
            order,
            type: "TokenPurchased",
            from: _seller,
            to: _buyer,
            token: tokenInstance,
            time: BigInt(c.header.timestamp),
            ethamount: _cost.toBigInt(),
            tokenamount: _amountBought.toBigInt()
          }))

          memberBalanceInstance = memberBalances.get(c.header.timestamp.toString() + "_credit");
          if (memberBalanceInstance) {
            memberBalanceInstance.order = order;
            memberBalanceInstance.isCredit = true;
            memberBalanceInstance.source = "Auction";
          }
          else {
            memberBalanceInstance = new MemberBalance({
              id: c.header.timestamp.toString() + "_credit",
              isCredit: true,
              source: "Sale",
              order,
              timestamp: BigInt(c.header.timestamp)
            })
          }
          memberBalances.set(memberBalanceInstance.id, memberBalanceInstance);
        }
        //erc1155
        else if (i.evmLog.topics[0] === events1155.URI.topic) {
          try {
            //console.log(i.address.toLocaleLowerCase(),i.transaction.hash);
            let { id, value } = events1155.URI.decode(i.evmLog);

            tokenInstance = tokens.get(i.address.toLocaleLowerCase() + "_" + id.toString());
            assert(tokenInstance);
            tokenInstance.uri = value;
            tokens.set(tokenInstance.id, tokenInstance);
          }
          catch (err) {
            //console.log(err);
          }
        }
        else if (i.evmLog.topics[0] === events1155.TransferBatch.topic) {
          erc1155Instance = new erc1155Contract(
            ctx,
            c.header,
            i.address.toLocaleLowerCase()
          );
          try {
            let eip165 = await erc1155Instance.supportsInterface("0xd9b67a26");
            if (!eip165)
              throw new Error("ERC1155 Contract does not support ERC165 interface");
            // const { from, to, tokenId } = events721.Transfer.decode(i.evmLog); //this line is causing the issue, somehow
            // if (!(from && to && tokenId)) {
            //   throw new Error("Incorrect event. Ignoring");
            // }
          } catch (err) {
            console.log(err);
            continue;
          }
          try {
            const { operator, from, to, ids } = events1155.TransferBatch.decode(i.evmLog);
            const idValues: BigNumber[] = events1155.TransferBatch.decode(i.evmLog)[4];
            if (!(operator && from && to && ids && idValues) || idValues.length != ids.length) {
              throw new Error("Incorrect event. Ignoring");
            }
          } catch (err) {
            continue;
          } finally {
            //console.log(i.address.toLocaleLowerCase(),i.transaction.hash);
            let { operator, from, to, ids } = events1155.TransferBatch.decode(i.evmLog);
            // if(from == "0x0000000000000000000000000000000000000000") console.log("minting");
            // if(to == "0x0000000000000000000000000000000000000000") console.log("burning");
            const idValues: BigNumber[] = events1155.TransferBatch.decode(i.evmLog)[4];
            from = from.toLocaleLowerCase();
            to = to.toLocaleLowerCase();
            let index = 0;
            for (let id of ids) {
              tokenInstance = tokens.get(i.address.toLocaleLowerCase() + "_" + id.toString());
              if (!tokenInstance) {
                tokens.set(i.address.toLocaleLowerCase() + "_" + id.toString(), new Token({
                  id: i.address.toLocaleLowerCase() + "_" + id.toString(),
                  creator: to,
                  contractAddress: i.address.toLocaleLowerCase(),
                  mintedTime: BigInt(c.header.timestamp),
                  txncount: 0,
                  amountminted: idValues[index].toBigInt(),
                  type: "ERC1155"
                }));
                tokenInstance = tokens.get(i.address.toLocaleLowerCase() + "_" + id.toString());
                assert(tokenInstance);
                // try {
                //   tokenInstance.uri = await erc1155Instance.uri(id);
                //   tokens.set(tokenInstance.id, tokenInstance);
                //   //throw new Error("Cannot fetch uri");
                // } 
                // catch (err) {
                //   // console.log(err);
                // }
                //finally{
                  tokenbalances.set(tokenInstance.id + to, new TokenBalance({
                    id: tokenInstance.id + to,
                    owner: to,
                    token: tokenInstance,
                    amount: idValues[index].toBigInt(),
                    onauction: 0,
                    onsale: 0
                  }))
  
                  transactions.set(i.transaction.hash, new Transaction({
                    id: i.transaction.hash,
                    to,
                    type: "NFTMinting",
                    token: tokenInstance,
                    time: BigInt(c.header.timestamp),
                    tokenamount: idValues[index].toBigInt()
                  }))
                //}

                
              }
              else {
                let baluser1 = tokenbalances.get(tokenInstance.id + from);
                assert(baluser1);
                let baluser2 = tokenbalances.get(tokenInstance.id + to);
                if (!baluser2) {
                  tokenbalances.set(tokenInstance.id + to, new TokenBalance({
                    id: tokenInstance.id + to,
                    owner: to,
                    token: tokenInstance,
                    amount: idValues[index].toBigInt(),
                    onauction: 0,
                    onsale: 0
                  }))
                }
                else {
                  baluser2.amount = baluser2.amount + (idValues[index].toBigInt());
                  tokenbalances.set(tokenInstance.id + to, baluser2);
                }
                baluser1.amount = baluser1.amount - (idValues[index].toBigInt());
                tokenbalances.set(tokenInstance.id + from, baluser1);
              }
              index++;
            }
          }

        }
        else if (i.evmLog.topics[0] === events1155.TransferSingle.topic) {
          erc1155Instance = new erc1155Contract(
            ctx,
            c.header,
            i.address.toLocaleLowerCase()
          );
          try {
            let eip165 = await erc1155Instance.supportsInterface("0xd9b67a26");
            if (!eip165)
              throw new Error("ERC1155 Contract does not support ERC165 interface");
            // const { from, to, tokenId } = events721.Transfer.decode(i.evmLog); //this line is causing the issue, somehow
            // if (!(from && to && tokenId)) {
            //   throw new Error("Incorrect event. Ignoring");
            // }
          } catch (err) {
            console.log(err);
            continue;
          }
          try {
            const { operator, from, to, id, value } = events1155.TransferSingle.decode(i.evmLog);
            if (!(operator && from && to && id && value))
              throw new Error("Incorrect event. Ignoring");
          } catch (err) {
            continue;
          }
          finally {
            //console.log(i.address.toLocaleLowerCase(),i.transaction.hash);
            let { operator, from, to, id, value } = events1155.TransferSingle.decode(i.evmLog);
            from = from.toLocaleLowerCase();
            to = to.toLocaleLowerCase();
            // if(from == "0x0000000000000000000000000000000000000000") console.log("minting");
            // if(to == "0x0000000000000000000000000000000000000000") console.log("burning");
            // tokenInstance = tokens.get(i.address.toLocaleLowerCase() + "_" + id.toString());
            if (!tokenInstance) {
              tokens.set(i.address.toLocaleLowerCase() + "_" + id.toString(), new Token({
                id: i.address.toLocaleLowerCase() + "_" + id.toString(),
                creator: to,
                contractAddress: i.address.toLocaleLowerCase(),
                mintedTime: BigInt(c.header.timestamp),
                txncount: 0,
                amountminted: value.toBigInt(),
                type: "ERC1155"
              }));

              tokenInstance = tokens.get(i.address.toLocaleLowerCase() + "_" + id.toString());
              assert(tokenInstance);
              // try {
              //   tokenInstance.uri = await erc1155Instance.uri(id);
              //   tokens.set(tokenInstance.id, tokenInstance);
              //   //throw new Error("Cannot fetch uri");
              // } //catch (err) {
                // console.log(err);
              //}
              //finally{
                tokenbalances.set(tokenInstance.id + to, new TokenBalance({
                  id: tokenInstance.id + to,
                  owner: to,
                  token: tokenInstance,
                  amount: value.toBigInt(),
                  onauction: 0,
                  onsale: 0
                }))
  
                transactions.set(i.transaction.hash, new Transaction({
                  id: i.transaction.hash,
                  to,
                  type: "NFTMinting",
                  token: tokenInstance,
                  time: BigInt(c.header.timestamp),
                  tokenamount: value.toBigInt()
                }))
              //}

              
            }
            else {
              let baluser1 = tokenbalances.get(tokenInstance.id + from);
              if (!baluser1) {
                tokenbalances.set(tokenInstance.id + from, new TokenBalance({
                  id: tokenInstance.id + from,
                  owner: from,
                  token: tokenInstance,
                  amount: value.toBigInt(),
                  onauction: 0,
                  onsale: 0
                }))
              }
              baluser1 = tokenbalances.get(tokenInstance.id + from);
              assert(baluser1);
              let baluser2 = tokenbalances.get(tokenInstance.id + to);
              if (!baluser2) {
                tokenbalances.set(tokenInstance.id + to, new TokenBalance({
                  id: tokenInstance.id + to,
                  owner: to,
                  token: tokenInstance,
                  amount: value.toBigInt(),
                  onauction: 0,
                  onsale: 0
                }))
              }
              else {
                baluser2.amount = baluser2.amount + (value.toBigInt());
                tokenbalances.set(tokenInstance.id + to, baluser2);
              }
              baluser1.amount = baluser1.amount - (value.toBigInt());
              tokenbalances.set(tokenInstance.id + from, baluser1);
            }
          }


        }
        //erc721
        else if (i.evmLog.topics[0] === events721.Transfer.topic) {
          erc721Instance = new erc721Contract(
            ctx,
            c.header,
            i.address.toLocaleLowerCase()
          );
          // if (i.address.toLocaleLowerCase() == "0x33fc58f12a56280503b04ac7911d1eceebce179c") {
          //   // console.log("Transactions 101 in order",i.transaction.hash);
          //   continue;
          // }
          try {
            let eip165 = await erc721Instance.supportsInterface("0x80ac58cd");
            if (!eip165)
              throw new Error("ERC721 Contract does not support ERC165 interface");
            // const { from, to, tokenId } = events721.Transfer.decode(i.evmLog); //this line is causing the issue, somehow
            // if (!(from && to && tokenId)) {
            //   throw new Error("Incorrect event. Ignoring");
            // }
          } 
          catch (err) {
            //console.log(err);
            continue;
          }

          try {
            const eventParams = await events721.Transfer.decode(i.evmLog)
            const to = eventParams[1].toLocaleLowerCase();
            const from = eventParams[0].toLocaleLowerCase();
            const tokenId = eventParams[2];
            if (!(to && from && tokenId)) {
              throw new Error("Incorrect event. Ignoring");
            }
          } catch (err) {
            continue;
          }
          //console.log(i.address.toLocaleLowerCase(),i.transaction.hash);
          const eventParams = await events721.Transfer.decode(i.evmLog)
          const to = eventParams[1];
          const from = eventParams[0];
          const tokenId = eventParams[2];
          // if(from == "0x0000000000000000000000000000000000000000") console.log("minting");
          // if(to == "0x0000000000000000000000000000000000000000") console.log("burning");
          tokenInstance = tokens.get(i.address.toLocaleLowerCase() + "_" + tokenId.toString());
          if (!tokenInstance) {
            tokens.set(i.address.toLocaleLowerCase() + "_" + tokenId.toString(), new Token({
              id: i.address.toLocaleLowerCase() + "_" + tokenId.toString(),
              creator: to,
              contractAddress: i.address.toLocaleLowerCase(),
              mintedTime: BigInt(c.header.timestamp),
              txncount: 0,
              amountminted: BigInt(1),
              type: "ERC721"
            }));

            tokenInstance = tokens.get(i.address.toLocaleLowerCase() + "_" + tokenId.toString());
            assert(tokenInstance && tokenInstance.id);
            // if (i.address.toLocaleLowerCase() + "_" + tokenId.toString() == "0x33fc58f12a56280503b04ac7911d1eceebce179c_567") console.log("found event", i.transaction.hash);
            // try {
            //   tokenInstance.uri = await erc721Instance.tokenURI(tokenId);
            //   tokens.set(tokenInstance.id, tokenInstance);
            //   //throw new Error("Cannot fetch uri");
            // } 
            // catch (err) {
            //   // console.log(err);
            // } 
            //finally {
              tokenbalances.set(tokenInstance.id + to, new TokenBalance({
                id: tokenInstance.id + to,
                owner: to,
                token: tokenInstance,
                amount: BigInt(1),
                onauction: 0,
                onsale: 0
              }))

              transactions.set(i.transaction.hash, new Transaction({
                id: i.transaction.hash,
                to,
                type: "NFTMinting",
                token: tokenInstance,
                time: BigInt(c.header.timestamp),
                tokenamount: BigInt(1)
              }))
            //}
          }
          else {
            let baluser1 = tokenbalances.get(tokenInstance.id + from);
            // if (!baluser1) {
            //   console.log("this fker", baluser1, tokenInstance.id + from, i.transaction.hash, tokenInstance);
            // }
            // assert(baluser1);
            if (!baluser1) {
              tokenbalances.set(tokenInstance.id + from, new TokenBalance({
                id: tokenInstance.id + from,
                owner: from,
                token: tokenInstance,
                amount: BigInt(1),
                onauction: 0,
                onsale: 0
              }))
            }
            baluser1 = tokenbalances.get(tokenInstance.id + from);
            assert(baluser1);
            if (baluser1.amount != BigInt(1)) {
              console.log("this instance", baluser1, BigInt(1));
            }
            assert(baluser1.amount == BigInt(1));
            let baluser2 = tokenbalances.get(tokenInstance.id + to);
            if (!baluser2) {
              tokenbalances.set(tokenInstance.id + to, new TokenBalance({
                id: tokenInstance.id + to,
                owner: to,
                token: tokenInstance,
                amount: BigInt(1),
                onauction: 0,
                onsale: 0
              }))
            }
            else {
              baluser2.amount = ++baluser2.amount;
              tokenbalances.set(tokenInstance.id + to, baluser2);
            }
            baluser1.amount = --baluser1.amount;
            tokenbalances.set(tokenInstance.id + from, baluser1);
          }
        }
      }
    }
  }
  ///save 'em maps
  await ctx.store.save([...tokens.values()])
  await ctx.store.save([...tokenbalances.values()])
  await ctx.store.save([...orders.values()])
  await ctx.store.save([...transactions.values()])
  await ctx.store.save([...memberBalances.values()])
  // apply vectorized transformations and aggregations
  // upsert batches of entities with batch-optimized ctx.store.save
  console.log("a batch processed");
});