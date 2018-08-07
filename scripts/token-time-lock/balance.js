const SampleToken = artifacts.require('SampleToken.sol')
const TokenTimelock = artifacts.require('TokenTimelock.sol')
const colors  = require('colors')

module.exports = async function(callback) {
    console.log(colors.magenta('[balance:timelock]: getting balance of the TokenTimelock and beneficiarytokens ...'))

    const sampleToken = await SampleToken.deployed()
    const tokenTimelock = await TokenTimelock.deployed()
    const beneficiary = web3.eth.accounts[1]

    const tokenTimelockAddress = tokenTimelock.address 
    const tokenTimelockBalance = await sampleToken.balanceOf.call(tokenTimelockAddress)
    const beneficiaryBalance = await sampleToken.balanceOf.call(beneficiary)

    console.log(colors.green(`[balance:timelock]: SampleToken balance of the TokenTimelock contract ${web3.fromWei(tokenTimelockBalance)}`))
    console.log(colors.green(`[balance:timelock]: SampleToken balance of the TokenTimelock contract beneficiary ${web3.fromWei(beneficiaryBalance)}`))
}