const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

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
