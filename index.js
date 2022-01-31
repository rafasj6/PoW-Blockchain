const Node = require('./Node');
const BlockChain = require('./BlockChain');
const {TIME_INTERVAL} = require('./config');

const n = 20
const network = []
for(var i = 0;i<n;i++){
    network.push(new Node(i,[], new BlockChain()));
}
network.forEach(node=> node.receiveNodes(network.map(x=>x.address)))

mineNode(0,network)


function mineNode(i, network){
    if(i>n-1){
            setTimeout(function(){mineNode(i+1,network)},TIME_INTERVAL)
            console.log("it's time!!! "+ Date.now() )
            return;
            }
    setTimeout(function(){mineNode(i+1,network)},0)
    network[i].mine();
}



