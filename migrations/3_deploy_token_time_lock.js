const TokenTimelock = artifacts.require('./TokenTimelock.sol')
const SampleToken = artifacts.require('./SampleToken.sol')
const colors = require('colors')

module.exports = (deployer, network, accounts) => {

    if(network != 'mainet' && network != 'ropsten') {
        const beneficiary = accounts[1]
        const releaseTime = web3.eth.getBlock('latest').timestamp + 10

        return deployer
            .then(() => {
                return SampleToken.deployed()
            })
            .then((instance) => {
                sampleTokenAddress = instance.address
                return deployer.deploy(TokenTimelock, sampleTokenAddress, beneficiary, releaseTime)
            })
            .then((instance) => {
                console.log(colors.green(`[tokenTimelockInstance address]: ${instance.address}`))
            })
    }
}