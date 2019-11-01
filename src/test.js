const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

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

/*
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
