const UTXO = require('./UTXO');

//borrowed from the video intro, this was perf, simple code!
class Transaction {
  constructor(inputs, outputs) {
    this.inputs = inputs;
    this.outputs = outputs;
  }
  execute() {
    this.inputs.forEach((input) => {
      input.spent = true;
    });
    this.outputs.forEach((output) => {
      utxos.push(output);
    });
  }
}

module.exports = Transaction;
