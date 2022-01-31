const Block = require('./Block');

class BlockChain{
    constructor(){
        this.blocks = [new Block([], BigInt("0x0"+ "F".repeat(64)), Date.now(), BigInt("0x" +"0".repeat(64)))];
    }

    getLastHash(){
        const lastBlockJson = this.blocks[this.getHeight()-1]
        const lastBlock = new Block(lastBlockJson.transactions, lastBlockJson.difficulty, lastBlockJson.timestamp, lastBlockJson.previousHash )
        return lastBlock.getHash()
    }
    getHeight(){
        return this.blocks.length;
    }

    addBlock(block){
        this.blocks.push(block)
    }
}

module.exports = BlockChain;
