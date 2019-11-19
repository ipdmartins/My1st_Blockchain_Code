const express = require('express');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

const uuid = require('uuid/v1');
//it creates an unique id with '-', but we don't want it, that's why the split
const nodeAddress = uuid()
    .split('-')
    .join('');

//in the package.json there is the 'scripts/start', which receives a sequence  of Strings that
//behave as an array, so the number 3001 is considered the third element. The argv[2] serves
//to get this element
const port = process.argv[2];
const rp = require('request-promise');

app.get('/blockchain', function (req, res) {
    res.send(bitcoin);
});

app.post('/transaction', function (req, res) {
    const blockIndex = bitcoin.createNewTransaction(
        req.body.amount,
        req.body.sender,
        req.body.recipient
    );
    res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLasBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    //refers to the miner's reward
    bitcoin.createNewTransaction(12.5, '00', nodeAddress);

    const newBlock = bitcoin.createNewBlock(nonce, blockHash, previousBlockHash);
    res.json({
        note: 'New block mined successfully',
        block: newBlock
    });
});

/*The next three functions have the role to add a new node to the chain. 1) This new node needs to
connect with an existent node, passing all its data to it. The existent one will then 
register_and_brodcast the new node to all others nodes already in the chain. 2) All the others 
nodes in the chain will then register the new node's data. 3) The existent 1st node connected will
get all the chain node's data and send it to the new node, which will finally register it in its
personal records register_nodes_bulk. All this proccess serve to let every node in the chain
aware about the others.*/

//register a node and brodcast it to the network
app.post('/register_and_brodcast_node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    //it means that if my newNodeUrl is not in the networkNodes, then push it into.
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
        bitcoin.networkNodes.push(newNodeUrl);
    }
    const regNodePromises = [];
    //for every node inside the network, it'll register register the newNodeUrl to them
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requesOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },
            json: true
        };
        regNodePromises.push(rp(requesOptions));
        Promise.all(regNodePromises)
            .then(data => {

            });
    });
});

//register a node with network
app.post('/register_node', function (req, res) { });

//register multiple nodes at once
app.post('/register_nodes_bulk', function (req, res) { });

app.listen(port, function () {
    console.log(`Listening on port ${port}...`);
});
