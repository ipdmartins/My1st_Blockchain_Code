const sha256 = require('sha256');

//example of Javascpript constructor
function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];

    //this is called the Genesus block, the 1st one of the chain. So it receives arbitrarian
    //parameters. However, the upcoming blocks must get legitimate parameters to run properly.
    this.createNewBlock(10, '0', '0');
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

/*The proof aims to get the parameters and repeatedly mine new hash codes untill it finds the 
any hash, starting with four zeros like '0000LJH2HG5KJ2G5KG25GK2'. To do that an algorithm
keeps constantly changing the nonce. It takes a very high computing proccessing and high amount
of energy. It becomes safe because anyone that tries to remine the hash to get the exact result,
would also to recreate every previous block that is linked to this one. After that they should
recreate the entire blockchain to a new one. It would spend an incredible amount of energy and 
complex calculations that makes the task not feasible. */
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    console.log(hash);
    return nonce;
};

module.exports = Blockchain;
