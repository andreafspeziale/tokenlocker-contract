const TokenLocker  = artifacts.require('TokenLocker.sol')
const AirdropToken = artifacts.require('AirdropToken.sol')
const colors       = require('colors')

module.exports = async function(callback) {
    console.log(colors.magenta('[send:airdrop:locker]: sending AirdropToken to be withdrawed on demand to TokenLocker contract ...'))

    const tokenLocker = await TokenLocker.deployed()
    const airdropToken = await AirdropToken.deployed()

    const totalHolder = web3.eth.accounts[0]
    const tokenLockerAddress = tokenLocker.address

    const transferTx = await airdropToken.transfer(tokenLockerAddress, web3.toWei(20), {from: totalHolder})
    const tokenLockerBalance = await airdropToken.balanceOf.call(tokenLockerAddress)
    const tokenLockerOwnerAirdropBalance = await airdropToken.balanceOf.call(web3.eth.accounts[0])

    if(transferTx.receipt.status === '0x1' || transferTx.receipt.status === 1) {
        console.log(colors.green(`[send:airdrop:locker]: success`))
        console.log(colors.green(`[send:airdrop:locker]: AirdropToken balance of the TokenLocker contract ${web3.fromWei(tokenLockerBalance)}`))
        console.log(colors.green(`[send:airdrop:locker]: AirdropToken balance of the TokenLocker contract Owner before the withdraw ${web3.fromWei(tokenLockerOwnerAirdropBalance)}`))
    }
    else
        console.error(colors.red(`[send:airdrop:locker]: fail`))
}