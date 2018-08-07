const SampleToken = artifacts.require('SampleToken.sol')
const AirdropToken = artifacts.require('AirdropToken.sol')
const TokenLocker = artifacts.require('TokenLocker.sol')
const colors  = require('colors')

module.exports = async function(callback) {
    console.log(colors.magenta('[balance:locker]: getting balance of the TokenLocker and beneficiary plus TokenLocker owner tokens ...'))
    
    const sampleToken = await SampleToken.deployed()
    const airdropToken = await AirdropToken.deployed()
    const tokenLocker = await TokenLocker.deployed()
    const owner = web3.eth.accounts[0]
    const beneficiary = web3.eth.accounts[2]

    const tokenLockerAddress = tokenLocker.address
    
    const tokenLockerSampleBalance  = await sampleToken.balanceOf.call(tokenLockerAddress)
    const beneficiarySampleBalance = await sampleToken.balanceOf.call(beneficiary)

    const tokenLockerAirdropBalance = await airdropToken.balanceOf.call(tokenLockerAddress)
    const ownerAirdropBalance = await airdropToken.balanceOf.call(owner)

    console.log(colors.green(`[balance:locker]: SampleToken balance of the TokenLocker contract ${web3.fromWei(tokenLockerSampleBalance)}`))
    console.log(colors.green(`[balance:locker]: SampleToken balance of the TokenLocker contract beneficiary ${web3.fromWei(beneficiarySampleBalance)}`))
    console.log(colors.green(`[balance:locker]: AirdropToken balance of the TokenLocker contract ${web3.fromWei(tokenLockerAirdropBalance)}`))
    console.log(colors.green(`[balance:locker]: AirdropToken balance of the TokenLocker contract owner ${web3.fromWei(ownerAirdropBalance)}`))
}