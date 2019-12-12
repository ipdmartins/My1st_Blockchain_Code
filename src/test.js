const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();


// 20191211094329
// http://localhost:3001/blockchain

const bc1 = {
    "chain": [
        {
            "index": 1,
            "timeStamp": 1576067770644,
            "transactions": [

            ],
            "nonce": 10,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timeStamp": 1576067868646,
            "transactions": [

            ],
            "nonce": 18140,
            "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timeStamp": 1576068145552,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "cf9e04501c1211ea8040f56df76409fc",
                    "transactionId": "0a2143d01c1311ea8040f56df76409fc"
                },
                {
                    "amount": 8,
                    "sender": "JRJ99F9SkfhL2J4L2J",
                    "recipient": "JLJ4LJFSD4FDF4HFGHS4FJ3L",
                    "transactionId": "463cfda01c1311ea8040f56df76409fc"
                },
                {
                    "amount": 16,
                    "sender": "JRJ99F9SkfDFAhL2J4L2J",
                    "recipient": "JLJ4LJFSFSDD4FDF4HFGHS4FJ3L",
                    "transactionId": "5a03db601c1311ea8040f56df76409fc"
                },
                {
                    "amount": 24,
                    "sender": "JRJ99F9SkfDFAhASDWEY4L2J",
                    "recipient": "JLJ4LJFSFSDD4FDFLJ,GHS4FJ3L",
                    "transactionId": "61c973501c1311ea8040f56df76409fc"
                }
            ],
            "nonce": 71561,
            "hash": "00007e63cd1cf0a3f325c1c12dd41b6a6acfd37bbe944df5fcac1acddbedfb7f",
            "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
        },
        {
            "index": 4,
            "timeStamp": 1576068202951,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "cf9e04501c1211ea8040f56df76409fc",
                    "transactionId": "af1497201c1311ea8040f56df76409fc"
                },
                {
                    "amount": 7,
                    "sender": "JRJ99F9SkfDFAWQQWEY4L2J",
                    "recipient": "JLJ4LJFSFSD23EFDFLJ,GHS4FJ3L",
                    "transactionId": "c523b7301c1311ea8040f56df76409fc"
                },
                {
                    "amount": 14,
                    "sender": "J3439F9SkfDFAWQQWEY4L2J",
                    "recipient": "JLJ4LJT3RD23EFDFLJ,GHS4FJ3L",
                    "transactionId": "ccbd36101c1311ea8040f56df76409fc"
                }
            ],
            "nonce": 116352,
            "hash": "00000e50f1939f9433c8ae09ef0d2ec16652ee7ecef02bfc698b550baa6e0c65",
            "previousBlockHash": "00007e63cd1cf0a3f325c1c12dd41b6a6acfd37bbe944df5fcac1acddbedfb7f"
        }
    ],
    "pendingTransactions": [
        {
            "amount": 12.5,
            "sender": "00",
            "recipient": "cf9e04501c1211ea8040f56df76409fc",
            "transactionId": "d14ad4801c1311ea8040f56df76409fc"
        }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": [

    ]
};

console.log('Valid', bitcoin.chainIsValid(bc1.chain));



/*

console.log(bitcoin.chain[0]);

const previousBlockHash = 'DF4A6G4S89HDA6D4FA6SD4G';

const currentBlockData = [
    {
        amount: 30,
        sender: '1161DGS1DGF1S6DF1G',
        recipient: '1G651SDFG1DG6DF11G6'
    },
    {
        amount: 45,
        sender: 'GSD6FG1SD1FG61GG1F',
        recipient: '1UK1TI1LUI6L61UI1L'
    },
    {
        amount: 90,
        sender: 'WRAF1E5E6F11E6F6',
        recipient: 'R6TER1T61R6T16ERH6'
    }
];

//It has to mine the proper hash code, generating the block with 4 zeros.
const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
console.log(nonce);

//it passes Strings and an object to the function that will convert it to a hash code. If I
//change a single letter in the parameters, it has to generate a complete diferent hash.
console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));


//previous block
bitcoin.createNewBlock(1980, 'EREOJASFJJRUEU98', 'DF4A6G4S89HDA6D4FA6SD4G');

//it will be registered in a new mined block
bitcoin.createNewTransaction(1000, 'SENDER34R4334', 'RECEIVER80F8DS8FG8');

//new block mined to be inserted the transaction
bitcoin.createNewBlock(4189, 'FG119FD1G91DFG9FG', 'D49GFD9G49SDF9GG');

//these 3 transactions can be put into a single mined block as this example
bitcoin.createNewTransaction(150, 'SENDERGFD9G9', 'RECEIVER1GS1DF56G1');
bitcoin.createNewTransaction(700, 'SENDERGFD9G9', 'RECEIVER1GS1DF56G1');
bitcoin.createNewTransaction(855, 'SENDERGFD9G9', 'RECEIVER1GS1DF56G1');

bitcoin.createNewBlock(79846, 'FALJ343J3J5225', '3434KJ23J44234H');

console.log(bitcoin.chain[2]);
*/
