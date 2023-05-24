export const ABI_JSON = [
    {
        "type": "constructor",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_fm"
            },
            {
                "type": "uint256",
                "name": "_minimumBid"
            },
            {
                "type": "uint256",
                "name": "minBidIncrementPercent"
            },
            {
                "type": "uint256",
                "name": "minBidIncrement"
            },
            {
                "type": "uint256",
                "name": "_minSalePrice"
            },
            {
                "type": "address",
                "name": "_owner"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AuctionCancelled",
        "inputs": [
            {
                "type": "address",
                "name": "_seller",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "_tokenID",
                "indexed": true
            },
            {
                "type": "string",
                "name": "orderId",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "BidPlaced",
        "inputs": [
            {
                "type": "address",
                "name": "_seller",
                "indexed": true
            },
            {
                "type": "address",
                "name": "_bidder",
                "indexed": true
            },
            {
                "type": "string",
                "name": "orderId",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "_tokenId",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "price",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "expTime",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "EarningsCreditedMarket",
        "inputs": [
            {
                "type": "address",
                "name": "_fundManager",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "_amtCredited",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TokenPurchased",
        "inputs": [
            {
                "type": "address",
                "name": "_seller",
                "indexed": true
            },
            {
                "type": "address",
                "name": "_buyer",
                "indexed": true
            },
            {
                "type": "address",
                "name": "_contract",
                "indexed": true
            },
            {
                "type": "string",
                "name": "_orderID",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "_tokenIdPurchased",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "_amountBought",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "_cost",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "_totalListed",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TokenSold",
        "inputs": [
            {
                "type": "address",
                "name": "_seller",
                "indexed": true
            },
            {
                "type": "address",
                "name": "_buyer",
                "indexed": true
            },
            {
                "type": "string",
                "name": "orderId",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "_tokenIdPurchased",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TokenUnlisted",
        "inputs": [
            {
                "type": "address",
                "name": "_seller",
                "indexed": true
            },
            {
                "type": "address",
                "name": "_contract",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "_tokenIdUnlisted",
                "indexed": false
            },
            {
                "type": "string",
                "name": "_orderid",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "changeBidIncAmt",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_amt"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "changeBidIncPercent",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_per"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "changeMinAuctionPrice",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_new"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "changeOwnerAddress",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_newOwner"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "confirmSale",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "string",
                "name": "orderID"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "fulfillSale",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "string",
                "name": "orderID"
            },
            {
                "type": "uint256",
                "name": "buyAmount"
            },
            {
                "type": "address",
                "name": "contractAddr"
            },
            {
                "type": "uint256",
                "name": "tokenId"
            },
            {
                "type": "uint8",
                "name": "tktype"
            },
            {
                "type": "address",
                "name": "seller"
            },
            {
                "type": "uint256",
                "name": "listedPrice"
            },
            {
                "type": "uint256",
                "name": "listedAmount"
            },
            {
                "type": "bytes",
                "name": "signature"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getEthSignedMessageHash",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "_messageHash"
            }
        ],
        "outputs": [
            {
                "type": "bytes32"
            }
        ]
    },
    {
        "type": "function",
        "name": "getMessageHash",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [
            {
                "type": "string",
                "name": "orderID"
            },
            {
                "type": "uint256",
                "name": "listedAmount"
            },
            {
                "type": "address",
                "name": "contractAddr"
            },
            {
                "type": "uint256",
                "name": "tokenId"
            },
            {
                "type": "uint256",
                "name": "price"
            },
            {
                "type": "uint8",
                "name": "ordertype"
            }
        ],
        "outputs": [
            {
                "type": "bytes32"
            }
        ]
    },
    {
        "type": "function",
        "name": "minPrice",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "minSalePrice",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "onERC1155BatchReceived",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address"
            },
            {
                "type": "address"
            },
            {
                "type": "uint256[]"
            },
            {
                "type": "uint256[]"
            },
            {
                "type": "bytes"
            }
        ],
        "outputs": [
            {
                "type": "bytes4"
            }
        ]
    },
    {
        "type": "function",
        "name": "onERC1155Received",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address"
            },
            {
                "type": "address"
            },
            {
                "type": "uint256"
            },
            {
                "type": "uint256"
            },
            {
                "type": "bytes"
            }
        ],
        "outputs": [
            {
                "type": "bytes4"
            }
        ]
    },
    {
        "type": "function",
        "name": "onERC721Received",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address"
            },
            {
                "type": "address"
            },
            {
                "type": "uint256"
            },
            {
                "type": "bytes"
            }
        ],
        "outputs": [
            {
                "type": "bytes4"
            }
        ]
    },
    {
        "type": "function",
        "name": "orders",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "string"
            }
        ],
        "outputs": [
            {
                "type": "uint8",
                "name": "stage"
            },
            {
                "type": "address",
                "name": "seller"
            },
            {
                "type": "uint256",
                "name": "tokenID"
            },
            {
                "type": "address",
                "name": "contractAddr"
            },
            {
                "type": "uint8",
                "name": "ordertype"
            },
            {
                "type": "uint256",
                "name": "highestBid"
            },
            {
                "type": "address",
                "name": "highestBidder"
            },
            {
                "type": "uint256",
                "name": "minBid"
            },
            {
                "type": "uint256",
                "name": "amountListed"
            },
            {
                "type": "uint256",
                "name": "timeLimit"
            }
        ]
    },
    {
        "type": "function",
        "name": "placeBid",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "string",
                "name": "orderID"
            },
            {
                "type": "address",
                "name": "contractAddr"
            },
            {
                "type": "uint256",
                "name": "tokenId"
            },
            {
                "type": "uint8",
                "name": "tktype"
            },
            {
                "type": "address",
                "name": "seller"
            },
            {
                "type": "uint256",
                "name": "minBid"
            },
            {
                "type": "uint256",
                "name": "timeLimit"
            },
            {
                "type": "bytes",
                "name": "signature"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "recoverSigner",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "_ethSignedMessageHash"
            },
            {
                "type": "bytes",
                "name": "_signature"
            }
        ],
        "outputs": [
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "splitSignature",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "sig"
            }
        ],
        "outputs": [
            {
                "type": "bytes32",
                "name": "r"
            },
            {
                "type": "bytes32",
                "name": "s"
            },
            {
                "type": "uint8",
                "name": "v"
            }
        ]
    },
    {
        "type": "function",
        "name": "supportsInterface",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes4",
                "name": "interfaceId"
            }
        ],
        "outputs": [
            {
                "type": "bool"
            }
        ]
    },
    {
        "type": "function",
        "name": "tokenType",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "string"
            }
        ],
        "outputs": [
            {
                "type": "uint8"
            }
        ]
    },
    {
        "type": "function",
        "name": "unlistAuction",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "string",
                "name": "orderID"
            },
            {
                "type": "address",
                "name": "contractAddr"
            },
            {
                "type": "uint256",
                "name": "tokenId"
            },
            {
                "type": "uint8",
                "name": "tktype"
            },
            {
                "type": "address",
                "name": "seller"
            },
            {
                "type": "uint256",
                "name": "minBid"
            },
            {
                "type": "uint256",
                "name": "timeLimit"
            },
            {
                "type": "bytes",
                "name": "signature"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "unlistSale",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "string",
                "name": "orderID"
            },
            {
                "type": "uint256",
                "name": "buyAmount"
            },
            {
                "type": "address",
                "name": "contractAddr"
            },
            {
                "type": "uint256",
                "name": "tokenId"
            },
            {
                "type": "uint8",
                "name": "tktype"
            },
            {
                "type": "address",
                "name": "seller"
            },
            {
                "type": "uint256",
                "name": "listedPrice"
            },
            {
                "type": "uint256",
                "name": "listedAmount"
            },
            {
                "type": "bytes",
                "name": "signature"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "verify",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_signer"
            },
            {
                "type": "string",
                "name": "orderID"
            },
            {
                "type": "uint256",
                "name": "listedAmount"
            },
            {
                "type": "address",
                "name": "contractAddr"
            },
            {
                "type": "uint256",
                "name": "tokenId"
            },
            {
                "type": "uint256",
                "name": "price"
            },
            {
                "type": "uint8",
                "name": "ordertype"
            },
            {
                "type": "bytes",
                "name": "signature"
            }
        ],
        "outputs": [
            {
                "type": "bool"
            }
        ]
    }
]
