const Block = require('./Block');
const {TIME_INTERVAL,BLOCK_REWARD} = require('./config');
const UTXO = require('./UTXO');
const fs = require("fs");
const Transaction = require('./Transaction');
const {newBlockFromJSON} = require('./utils');


class Node{
    constructor(address, network, blockchain){
        this.address = address
        this.network = network
        this.longestBlockChain = blockchain
        this.mempool = []
    }

    // shareTransactions(){
    //      for (var i = 0; i< this.network.length; i++){
    //         this.network[i].receiveTransactions(this.mempool)
    //     }
    // }

    // receiveTransactions(transactions){
    //     this.mempool.concat(transactions)
    // }
    
    // shareLongestBlockchain(){
    //     for (var i = 0; i< this.network.length; i++){
    //         this.network[i].receiveLongestBlockchain(this.longestBlockChain, this.address)
    //     }
    // }

    // receiveLongestBlockchain(blockchain, minerAdress){
    //     if(this.address != minerAdress && blockchain.getHeight() > this.longestBlockChain.getHeight()){
    //       this.longestBlockChain.blocks = [...blockchain.blocks]
    //       console.log(`Miner ${this.address} received blockchain`)
    //     }
    // }



    shareLongestBlockchain(){
        console.log("sharing blockchain " + this.address)
        for (var i = 0; i< this.network.length; i++){
            fs.writeFile(`./files/blockchain_${this.network[i]}.json`, this.toObject(), err => {
            if (err) throw err; 
            });
        }
    }
    receiveNodes(nodes){
        this.network = this.network.concat(nodes).filter(x=> {return x!= this.address})
    }

    mine(){
        const node = this;
        if (!fs.existsSync(`./files/blockchain_${this.address}.json`)) {
         //file doesn't exists
        fs.writeFile(`./files/blockchain_${this.address}.json`, "", { flag: 'w' }, function (err) {
                if (err) throw err;
                console.log("created")
            });
  }
        

        fs.watch(`./files/blockchain_${this.address}.json`, (eventType, filename) => {
            console.log("changed!")

            fs.readFile(`./files/blockchain_${this.address}.json`, function(err, data) {
                console.log("read!" +node.address)
                // Check for errors
                if (err) throw err;
            
                // Converting to JSON
                try{
                    const blocks = JSON.parse(data);
                    console.log( node.longestBlockChain)
                    node.longestBlockChain.blocks = blocks
                    console.log( node.longestBlockChain)

                }  catch(exception_var){
                }
            });
            });

        const diff = BigInt("0x0000" + "F".repeat(60));
        const rewardUXTO = new UTXO(this.address, BLOCK_REWARD);
        const rewardTransaction = new Transaction([], [rewardUXTO]);
        const block = new Block(this.mempool.concat([rewardTransaction]), diff, Date.now(), this.longestBlockChain.getLastHash(), this.address);
        const timeToEnd = block.timestamp + Math.abs(TIME_INTERVAL- (block.timestamp % TIME_INTERVAL))
        const lastBlockHash = this.longestBlockChain.getLastHash();
        
        while(BigInt('0x' + block.getHash()) >= diff){
            if (Date.now() >timeToEnd){
                setTimeout(function () {node.mine();}, timeToEnd - Date.now());
                console.log(`Miner ${this.address} Timeout`);
                return;
            } 
            if( lastBlockHash !== this.longestBlockChain.getLastHash()){
                setTimeout(function () {node.mine();}, timeToEnd - Date.now());
                console.log(`Miner ${this.address}: someone found blockchain first!`);
                return;
            }
            block.nonce++;
        }

        console.log(`Miner ${this.address} just mined a block! Hash: 0x${block.getHash()} with nonce ${block.nonce}`)
        this.longestBlockChain.addBlock(block);
        this.shareLongestBlockchain();
        console.log("height",this.longestBlockChain.getHeight())
        this.getBalance()

        this.mempool = [] //clear mempool
        setTimeout(function () {
            node.mine();
        }, timeToEnd - Date.now() );
    
    }

    getBalance(){
        var utxos = []
        for(var i = 0;i<this.longestBlockChain.getHeight();i++){
            utxos = utxos.concat(newBlockFromJSON(this.longestBlockChain.blocks[i]).getOutputUTXOs())
        }
        const ourUTXOs = utxos.filter(x => {
        return x.owner === this.address && !x.spent;
        });
        const sum = ourUTXOs.reduce((p,c) => p + c.amount, 0);
        console.log(`miner  ${this.address} has balance of ${sum}`)
    }

    toObject() {
        return JSON.stringify(this.longestBlockChain.blocks, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value // return everything else unchanged
        );
    }
}

module.exports = Node;
