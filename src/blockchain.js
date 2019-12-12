const sha256 = require('sha256');
const uuid = require('uuid/v1');

//it gets the url localhost address registered in package.json
const currentNodeUrl = process.argv[3];

//example of Javascpript constructor
function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];

    //this is called the Genesus block, the 1st one of the chain. So it receives arbitrarian
    //parameters. However, the upcoming blocks must get legitimate parameters to run properly.
    this.createNewBlock(10, '0', '0');
}

Blockchain.prototype.createNewBlock = function (nonce, hash, previousBlockHash) {
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

Blockchain.prototype.getLasBlock = function () {
    return this.chain[this.chain.length - 1];
};

//recipient is the one who receive
Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuid().split('-').join('')
    };
    return newTransaction;
};

Blockchain.prototype.addTransactionToPendingTransactions = function (transactionObj) {
    this.pendingTransactions.push(transactionObj);
    return this.getLasBlock()['index'] + 1;
}

//the 3 parameters received by this function will be converted by sha256 in a single String code
Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
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
Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
};

//validate if a chain is legitimate or not
Blockchain.prototype.chainIsValid = function (blockchain) {
    let validChain = true;
    for (var i = 1; i < blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const previousBlock = blockchain[i - 1];
        const blockHash = this.hashBlock(
            previousBlock['hash'],
            {
                transactions: currentBlock['transactions'],
                index: currentBlock['index']
            },
            currentBlock['nonce']
        );

        if (currentBlock['previousBlockHash'] !== previousBlock['hash']) {
            validChain = false;
        } else if (blockHash.substring(0, 4) !== '0000') {
            validChain = false;
        }
        console.log('previousBlockHash =>', previousBlock['hash']);
        console.log('currentBlockHash =>', currentBlock['hash']);

    }

    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 10;
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] === '0';
    const correctTransactions = genesisBlock['transactions'].length === 0;

    if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) {
        validChain = false;
    }

    return validChain;
}


module.exports = Blockchain;
