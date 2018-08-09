const AirdropToken = artifacts.require('./AirdropToken.sol')
const colors = require('colors')

module.exports = (deployer, network) => {
    if(network != 'mainet' && network != 'ropsten')
        return deployer.deploy(AirdropToken, 'DROPPED TOKEN', 'SPT', 18, web3.toWei(100000))
            .then((instance) => {
                console.log(colors.green(`[airdropTokenInstance address]: ${instance.address}`))
            })
}