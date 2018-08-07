const TokenLocker = artifacts.require('./TokenLocker.sol')
const SampleToken = artifacts.require('./SampleToken.sol')
const config = require('../config/config')
const colors = require('colors')

module.exports = async (deployer, network, accounts) => {
    let tokenAddress
    let wallet
    let holders
    let amounts
    let expireLockTimeStamps

    if(network != 'mainet') {
        wallet = accounts[0]
        holders = [accounts[2], accounts[3], accounts[4]]
        amounts = [web3.toWei(10), web3.toWei(10), web3.toWei(10)]
        expireLockTimeStamps = [web3.eth.getBlock('latest').timestamp + 10, web3.eth.getBlock('latest').timestamp + 10, web3.eth.getBlock('latest').timestamp + 10]

        return deployer
            .then(() => {
                return SampleToken.deployed()
            })
            .then((instance) => {
                tokenAddress = instance.address
                return deployer.deploy(TokenLocker, 
                    holders, 
                    amounts, 
                    expireLockTimeStamps, 
                    tokenAddress, 
                    { from: wallet }
                )
            })
            .then((instance) => {
                console.log(colors.green(`[tokenLockerInstance address]: ${instance.address}`))
            })
    } else {
        tokenAddress = config.token
        wallet = config.from
        holders = config.holders
        amounts = config.amounts
        expireLockTimeStamps = config.expireLockTimeStamps

        return deployer
            .then(() => {
                return deployer.deploy(TokenLocker, 
                    holders, 
                    amounts, 
                    expireLockTimeStamps, 
                    tokenAddress, {from: wallet})
            })
            .then((instance) => {
                console.log(colors.green(`[tokenLockerInstance address]: ${instance.address}`))
            })
    }
}