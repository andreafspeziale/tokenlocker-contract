const config = require('./config/config')
module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    development: { // $ npm run ganache
      host: 'localhost',
      port: 7545,
      network_id: '47',
      gas: 4700000,
      gasPrice: 6000000000
    },
    parity: { // private parity remote node
      host: 'eidoo-dev-1.bchainapi.net',
      port: 8545,
      gas: 4700000,
      gasPrice: 65000000000,
      network_id: '8995'
    },
    mainet: {
      host: 'localhost',
      port: 8545,
      network_id: '1',
      gas: config.gas,
      gasPrice: config.gasPriceWei,
      from: config.from
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : {
      currency: 'CHF',
      gasPrice: config.gasPriceGWei,
    }
  }
}
