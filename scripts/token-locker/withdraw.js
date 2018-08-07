const AirdropToken = artifacts.require('AirdropToken.sol')
const TokenLocker  = artifacts.require('TokenLocker.sol')
const colors       = require('colors')

module.exports = async function(callback) {
    console.log(colors.magenta('[withdraw]: withdrawing the accidentally dropped AirdropToken by the TokenLocker owner ...'))
    const owner = web3.eth.accounts[0]
    
    const tokenLocker = await TokenLocker.deployed()
    const tokenLockerAddress = tokenLocker.address
    const airdropToken = await AirdropToken.deployed()
    const airdropTokenAddress = airdropToken.address
    
    const withdrawTx = await tokenLocker.withdraw(owner, airdropTokenAddress, { from: owner })
    const tokenLockerAirdropBalance = await airdropToken.balanceOf.call(tokenLockerAddress)
    const tokenLockerOwnerAirdropBalance = await airdropToken.balanceOf.call(owner)

    if(withdrawTx.receipt.status === '0x1' || withdrawTx.receipt.status === 1) {
        console.log(colors.green(`[withdraw]: success`))
        console.log(colors.green(`[withdraw]: AirdropToken balance of the TokenLocker contract ${web3.fromWei(tokenLockerAirdropBalance)}`))
        console.log(colors.green(`[withdraw]: AirdropToken balance of the TokenLocker contract owner ${web3.fromWei(tokenLockerOwnerAirdropBalance)}`))
    } else
        console.error(colors.red(`[withdraw]: fail`))
}