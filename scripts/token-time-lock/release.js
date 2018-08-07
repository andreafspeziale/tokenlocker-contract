const SampleToken = artifacts.require('SampleToken')
const TokenTimelock = artifacts.require('TokenTimelock')
const colors  = require('colors')

module.exports = async function(callback) {
    console.log(colors.magenta('[release:timelock]: releasing SampleToken tokens to the TokenTimelock benefiaciary ...'))
    const beneficiary = web3.eth.accounts[1]
    
    const sampleToken = await SampleToken.deployed()
    const tokenTimelock = await TokenTimelock.deployed()
    const tokenTimelockAddress = tokenTimelock.address
    
    const releaseTx = await tokenTimelock.release({from: beneficiary})
    const tokenTimelockBalance = await sampleToken.balanceOf.call(tokenTimelockAddress)
    const beneficiaryBalance = await sampleToken.balanceOf.call(beneficiary)

    if(releaseTx.receipt.status === '0x1' || releaseTx.receipt.status === 1) {
        console.log(colors.green(`[release:timelock]: success`))
        console.log(colors.green(`[release:timelock]: SampleToken balance of the TokenTimelock contract ${web3.fromWei(tokenTimelockBalance)}`))
        console.log(colors.green(`[release:timelock]: SampleToken balance of the beneficiary of the TokenTimelock contract after the release ${web3.fromWei(beneficiaryBalance)}`))
    } else
        console.log(colors.red(`[release:timelock]: fail`))
}