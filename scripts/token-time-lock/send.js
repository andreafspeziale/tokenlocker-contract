const SampleToken = artifacts.require('SampleToken.sol')
const TokenTimelock = artifacts.require('TokenTimelock.sol')
const colors  = require('colors')

module.exports = async function(callback) {
    console.log(colors.magenta('[send:sample:timelock]: sending SampleToken to be locked into TokenTimelock contract ...'))
    const sampleToken = await SampleToken.deployed()
    const tokenTimelock = await TokenTimelock.deployed()

    const totalHolder = web3.eth.accounts[0]
    const beneficiary = web3.eth.accounts[1]
    const lockerContractAddress = tokenTimelock.address

    const transferTx = await sampleToken.transfer(lockerContractAddress, web3.toWei(20), {from: totalHolder})
    const lockerContractBalance = await sampleToken.balanceOf.call(lockerContractAddress)
    const beneficiaryBalance = await sampleToken.balanceOf.call(beneficiary)

    if(transferTx.receipt.status === '0x1' || transferTx.receipt.status === 1) {
        console.log(colors.green(`[send:sample:timelock]: success`))
        console.log(colors.green(`[send:sample:timelock]: SampleToken balance of the TokenTimelock contract ${web3.fromWei(lockerContractBalance)}`))
        console.log(colors.green(`[send:sample:timelock]: SampleToken balance of the beneficiary of the TokenTimelock contract before the release ${web3.fromWei(beneficiaryBalance)}`))
    }
    else
        console.log(colors.red(`[send:sample:timelock]: fail`))
}

