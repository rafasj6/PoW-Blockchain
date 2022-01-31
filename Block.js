const {TIME_INTERVAL,BLOCK_REWARD} = require('./config');
const SHA256 = require('crypto-js/sha256');
const UTXO = require('./UTXO');
const Transaction = require('./Transaction');

class Block{
    constructor(transactions, difficulty, timestamp, previousHash ){
        this.nonce = 0 
        this.timestamp = timestamp
        this.transactions = transactions
        this.difficulty = difficulty
        this.previousHash = previousHash
    }

    getOutputUTXOs(){
        var utxos =[]
        for (var i=0; i< this.transactions.length; i++ ){
            utxos = utxos.concat(this.transactions[i].outputs)
        }
        return utxos;
    }

    getHash(){
        return SHA256(
            this.previousHash + "" +
            this.timestamp + "" +
            this.nonce + "" +
            JSON.stringify(this.transactions)
            ).toString();
    }
}



module.exports = Block;

