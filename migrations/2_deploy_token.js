const SampleToken = artifacts.require('./SampleToken.sol')
const colors = require('colors')

module.exports = (deployer, network) => {
    if(network != 'mainet')
        return deployer.deploy(SampleToken, 'SAMPLE TOKEN', 'SPT', 18, web3.toWei(100000))
            .then((instance) => {
                console.log(colors.green(`[sampleTokenInstance address]: ${instance.address}`))
            })
}