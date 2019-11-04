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

app.get('/blockchain', function(req, res) {
    res.send(bitcoin);
});

app.post('/transaction', function(req, res) {
    const blockIndex = bitcoin.createNewTransaction(
        req.body.amount,
        req.body.sender,
        req.body.recipient
    );
    res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

app.get('/mine', function(req, res) {
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

app.listen(3000, function() {
    console.log('Listening on port 3000...');
});
