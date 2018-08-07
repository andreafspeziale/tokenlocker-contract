const SampleToken = artifacts.require('SampleToken.sol')
const TokenLocker = artifacts.require('TokenLocker.sol')
const colors  = require('colors')

module.exports = async function(callback) {
    console.log(colors.magenta('[send:sample:locker]: sending SampleToken to be locked into TokenLocker contract ...'))

    const sampleToken = await SampleToken.deployed()
    const tokenLocker = await TokenLocker.deployed()

    const beneficiary = web3.eth.accounts[2]
    const totalHolder = web3.eth.accounts[0]
    const tokenLockerAddress = tokenLocker.address

    const transferTx = await sampleToken.transfer(tokenLockerAddress, web3.toWei(20), {from: totalHolder})
    const tokenLockerBalance = await sampleToken.balanceOf.call(tokenLockerAddress)
    const beneficiarySampleBalance = await sampleToken.balanceOf.call(beneficiary)

    if(transferTx.receipt.status === '0x1' || transferTx.receipt.status === 1) {
        console.log(colors.green(`[send:sample:locker]: success`))
        console.log(colors.green(`[send:sample:locker]: SampleToken balance of the TokenLocker contract ${web3.fromWei(tokenLockerBalance)}`))
        console.log(colors.green(`[send:sample:locker]: SampleToken balance of one of the beneficiaries of the TokenLocker contract before the release ${web3.fromWei(beneficiarySampleBalance)}`))
    }
    else
        console.error(colors.red(`[send:sample:locker]: fail`))
}