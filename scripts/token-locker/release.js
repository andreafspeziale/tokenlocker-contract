const SampleToken = artifacts.require('SampleToken.sol')
const TokenLocker = artifacts.require('TokenLocker.sol')
const colors  = require('colors')

module.exports = async function(callback) {
    console.log(colors.magenta('[release:locker]: releasing SampleToken tokens to one of the TokenLocker benefiaciaries ...'))
    const beneficiary = web3.eth.accounts[2]
    
    const sampleToken = await SampleToken.deployed()
    const tokenLocker = await TokenLocker.deployed()
    const tokenLockerAddress = tokenLocker.address
    
    const releaseTx = await tokenLocker.sendTransaction({ from: beneficiary })
    const tokenLockerBalance = await sampleToken.balanceOf.call(tokenLockerAddress)
    const beneficiarySampleBalance = await sampleToken.balanceOf.call(web3.eth.accounts[2])

    if(releaseTx.receipt.status === '0x1' || releaseTx.receipt.status === 1) {
        console.log(colors.green(`[release:locker]: success`))
        console.log(colors.green(`[release:locker]: SampleToken balance of the TokenLocker contract ${web3.fromWei(tokenLockerBalance)}`))
        console.log(colors.green(`[release:locker]: SampleToken balance of one of the beneficiaries of the TokenLocker contract after the release ${web3.fromWei(beneficiarySampleBalance)}`))
    } else
        console.error(colors.red(`[release:locker]: fail`))
}