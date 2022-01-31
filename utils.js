const Block = require('./Block');

function newBlockFromJSON(json){
    return new Block(json.transactions, json.difficulty, json.timestamp, json.previousHash )
}

module.exports = {
  newBlockFromJSON,
};