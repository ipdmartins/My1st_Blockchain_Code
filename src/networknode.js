const express = require('express');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

const uuid = require('uuid/v1');//creates a unique string
//it creates an unique id with '-', but we don't want it, that's why the split
const nodeAddress = uuid().split('-').join('');

//in the package.json there is the 'scripts/start', which receives a sequence  of Strings that
//behave as an array, so the number 3001 is considered the third element. The argv[2] serves
//to get this element
const port = process.argv[2];
//it will allow to make requests to all the other nodes inside the network
const rp = require('request-promise');

app.get('/blockchain', function (req, res) {
    res.send(bitcoin);
});

/*A transaction uses the createNewTransaction method, passing a amount, a sender and recipient
address. It gets back the block index created*/
app.post('/transaction', function (req, res) {
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
    res.json({ note: `Transaction will be added in block ${blockIndex}.` })
});

//it creates a new transaction and broadcast it to all the other nodes
app.post('/transaction/broadcast', function (req, res) {
    const newTransaction = bitcoin.createNewTransaction(
        req.body.amount, req.body.sender, req.body.recipient);
    bitcoin.addTransactionToPendingTransactions(newTransaction);

    const requestPromises = [];
    //networkNodes is an array variable
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });
    Promise.all(requestPromises).then(data => {
        res.json({ note: 'Transaction created and broadcasted successfully.' })
    });
});

//it'll create a new block using the createNewBlock method
app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLasBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = bitcoin.createNewBlock(nonce, blockHash, previousBlockHash);

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: { newBlock: newBlock },
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });

    //refers to the miner's reward that will be broadcasted to all network
    Promise.all(requestPromises).then(data => {
        const requestOptions = {
            uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
            method: 'POST',
            body: {
                amount: 12.5,
                sender: "00",
                recipient: nodeAddress
            },
            json: true
        };
        return rp(requestOptions);
    }).then(data => {
        res.json({
            note: 'New block mined and broadcasted successfully',
            block: newBlock
        });
    });
});

app.post('/receive-new-block', function (req, res) {
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLasBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

    if (correctHash && correctIndex) {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        res.json({
            note: 'New block received and accepted.',
            newBlock: newBlock
        });
    } else {
        res.json({
            note: 'New block rejected.',
            newBlock: newBlock
        });
    }
});

/*The next three functions have the role to add a new node to the chain. 1) This new node needs to
connect with an existent node, passing all its data to it. The existent one will then 
register_and_brodcast the new node to all others nodes already in the chain. 2) All the others 
nodes in the chain will then register the new node's data. 3) The existent 1st node connected will
get all the chain node's data and send it to the new node, which will finally register it in its
personal records register_nodes_bulk. All this proccess serve to let every node in the chain
aware about the others.*/

//register a node and brodcast it to the network
app.post('/register-and-broadcast-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

    const regNodesPromises = [];
    /*It runs all the nodes already in the network, then call another function that will be
    registering the new node data inside the existent node through the request asyncronous
    promise*/
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },
            json: true
        };
        regNodesPromises.push(rp(requestOptions));
    });
    /*At this point, all the network nodes already have the new node registration, now it gets
    the resultant data and send it to the new node, to let it aware about the entire chain*/
    Promise.all(regNodesPromises)
        .then(data => {
            const bulkRegisterOptions = {
                uri: newNodeUrl + '/register-nodes-bulk',
                method: 'POST',
                //take all nodes inside the network and send the data back to the new node
                body: { allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl] },
                json: true
            };

            return rp(bulkRegisterOptions);
        })
        .then(data => {
            res.json({ note: 'New node registered with network successfully.' });
        });
});

//register a node with network. EVERY NODE THAT RECEIVES A NEW NODE URL, NEEDS TO ONLY REGISTER
//IT AND NOT BROADCAST IT, IF THEY DO SO, IT WILL SEVERLY DECREASE THE PERFOMANCE AND EVEN
//BREAK THE NETWORK.
app.post('/register-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    //if the newNodeUrl is -1, means that it does not exists in the array, it'll be false
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    //it serves to not add itself in the chain
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
    res.json({ note: 'New node registered successfully.' });
    /*after this, if I go inside the browser url 3001 for example I have to see the url 3002
    in the netWorkNodes variable, after test it with Postman for example. However, at this
    point, for while the 3002 will not yet be aware of 3001. It'll be solved in the next function*/
});

//register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
    });
    res.json({ note: 'Bulk registration successful.' });
});

//request every other node's copy of the blockchain to compare to this current
app.get('/consensus', function (req, res) {
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });

    //it will look if there is any other blockchain longer than the current one. It's a need
    //if a new block is connected to the network, so it has to be update.
    Promise.all(requestPromises)
        .then(blockchains => {
            const currentChainLength = bitcoin.chain.length;
            let maxChainLength = currentChainLength;
            let newLongestChain = null;
            let newPendingTransactions = null;

            blockchains.forEach(blockchain => {
                if (blockchain.chain.length > maxChainLength) {
                    maxChainLength = blockchain.chain.length;
                    newLongestChain = blockchain.chain;
                    newPendingTransactions = blockchain.pendingTransactions;
                };
            });

            if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
                res.json({
                    note: 'Current chain has not been replaced.',
                    chain: bitcoin.chain
                });
            }
            else {
                bitcoin.chain = newLongestChain;
                bitcoin.pendingTransactions = newPendingTransactions;
                res.json({
                    note: 'This chain has been replaced.',
                    chain: bitcoin.chain
                });
            }
        });
});

//Block explorer is an online API that allows to interact with the code inside our Blockchain
//example (https://blockchain.info/q)
//this functions server to query a specific hash and look for in the entire Blockchain for it
app.get('/block/:blockHash', function (req, res) {
    const blockHash = req.params.blockHash;
    const correctBlock = bitcoin.getBlock(blockHash);
    res.json({
        block: correctBlock
    });
});

app.get('/transaction/:transactionId', function (req, res) {
    const transactionId = req.params.transactionId;
    const transactionData = bitcoin.getTransaction(transactionId);
    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    });
});

app.get('/address/:address', function (req, res) {
    const address = req.params.address;
    const addressData = bitcoin.getAddressData(address);
    res.json({
        addressData: addressData
    });
});

app.get('/block-explorer', function (req, res) {
    res.sendFile('./block-explorer/index.html', { root: __dirname });
});

app.listen(port, function () {
    console.log(`Listening on port ${port}...`);
});
