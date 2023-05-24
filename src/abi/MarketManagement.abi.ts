export const ABI_JSON = [
    {
        "type": "constructor",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_owner"
            },
            {
                "type": "uint256",
                "name": "_earningCommission"
            },
            {
                "type": "bool",
                "name": "_isMarketplace"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AddedShopCreator",
        "inputs": [
            {
                "type": "address",
                "name": "MarketManager",
                "indexed": true
            },
            {
                "type": "address",
                "name": "creator",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "EarningsWithdrawn",
        "inputs": [
            {
                "type": "address",
                "name": "_fundManager",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "_amtWithdrawn",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MarketCommissionChanged",
        "inputs": [
            {
                "type": "address",
                "name": "MarketManager",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "new_commission",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MarketInitiated",
        "inputs": [
            {
                "type": "address",
                "name": "_fundManager",
                "indexed": true
            },
            {
                "type": "bool",
                "name": "_isMarketplace",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RemovedShopCreator",
        "inputs": [
            {
                "type": "address",
                "name": "MarketManager",
                "indexed": true
            },
            {
                "type": "address",
                "name": "creator",
                "indexed": true
            }
        ]
    },
    {
        "type": "function",
        "name": "addShopCreator",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_addr"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "balance",
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
        "name": "changeEarningCommission",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "newCommission"
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
        "name": "earningCommission",
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
        "name": "isMarketplace",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bool"
            }
        ]
    },
    {
        "type": "function",
        "name": "isShopCreator",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_addr"
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
        "name": "removeShopCreator",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_addr"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "withdrawEarnings",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_amount"
            },
            {
                "type": "address",
                "name": "_to"
            }
        ],
        "outputs": []
    }
]
