const sha256 = require('sha256');

//example of Javascpript constructor
function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];
}

Blockchain.prototype.createNewBlock = function(nonce, hash, previousBlockHash) {
    //every new block will look like this
    const newBlock = {
        index: this.chain.length + 1,
        timeStamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce, //it's a number that refers to a proof of work
        hash: hash, //all transactions will be compressed in a single String of data
        previousBlockHash: previousBlockHash //all data from the previous block
    };
    this.pendingTransactions = [];
    this.chain.push(newBlock);
    return newBlock;
};

Blockchain.prototype.getLasBlock = function() {
    return this.chain[this.chain.length - 1];
};

//recipient is the one who receive
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient
    };
    this.pendingTransactions.push(newTransaction);
    return this.getLasBlock()['index'] + 1;
};

//the 3 parameters received by this function will be converted by sha256 in a single String code
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    //currentBlockData is an object with data inside and must be converted to String.
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
};

module.exports = Blockchain;
