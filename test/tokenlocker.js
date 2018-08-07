const AirdropToken   = artifacts.require('AirdropToken.sol')
const SampleToken    = artifacts.require('SampleToken.sol')
const TokenLocker    = artifacts.require('TokenLocker.sol')
const tryCatch       = require('./utils/exceptions.js').tryCatch
const latestTime     = require('./utils/time.js').latestTime
const errorTypes     = require('./utils/exceptions.js').errorTypes
const increaseTime   = require('./utils/time.js').increaseTime
const expectEvent    = require('./utils/events.js').expectEvent
const colors         = require('colors')

contract('TokenLocker', async (accounts) => {

    const beneficiary0   = accounts[2]
    const beneficiary1   = accounts[3]
    const beneficiary2   = accounts[4]
    const notBeneficiary = accounts[5]
    const holders        = [beneficiary0, beneficiary1, beneficiary2]

    const amount0 = web3.toWei(10)
    const amount1 = web3.toWei(5)
    const amount2 = web3.toWei(15)
    const amounts = [amount0, amount1, amount2]
    
    console.log(colors.magenta(`\n[holders]: ${holders}`))
    console.log(colors.magenta(`[amounts]: ${amounts.map((item)=>web3.fromWei(item))}`))
    console.log(colors.magenta(`[airdrop token owner]: ${accounts[0]}`))
    console.log(colors.magenta(`[sample token owner]: ${accounts[0]}`))

    before(async() => {
        airdropToken = await AirdropToken.deployed()
        sampleToken  = await SampleToken.deployed()
        console.log(colors.magenta(`\n[airdrop token]: ${airdropToken.address}`))
        console.log(colors.magenta(`[sampleToken token]: ${sampleToken.address}\n`))
    })

    describe('Airdrop token properties stuff: ', async () => {
        it('should have DROPPED TOKEN as name', async () => {
            const name = await airdropToken.name()
            expect(name).to.equal('DROPPED TOKEN')
        })
        it('should have totalTokens totalSupply', async () => {
            const totalSupply_ = await airdropToken.totalSupply()
            expect(totalSupply_.toString(10)).to.deep.equal(web3.toWei(100000).toString(10))
        })
        it('should have totalSupply as Wallet balances', async () => {
            const walletBalances = await airdropToken.balanceOf(accounts[0])
            expect(walletBalances.toString(10)).to.deep.equal(web3.toWei(100000).toString(10))
        })
    })

    describe('Sample token properties stuff: ', async () => {
        it('should have SAMPLE TOKEN as name', async () => {
            const name = await sampleToken.name()
            expect(name).to.equal('SAMPLE TOKEN')
        })
        it('should have totalTokens totalSupply', async () => {
            const totalSupply_ = await sampleToken.totalSupply()
            expect(totalSupply_.toString(10)).to.deep.equal(web3.toWei(100000).toString(10))
        })
        it('should have totalSupply as Wallet balances', async () => {
            const walletBalances = await sampleToken.balanceOf(accounts[0])
            expect(walletBalances.toString(10)).to.deep.equal(web3.toWei(100000).toString(10))
        })
    })

    describe('TokenLocker deploy fail cases: ', async () => {
        it('should not deploy since the inputs arrays have different length', async () => {
            const wHolders = [accounts[2], accounts[4]]
            const wAmounts = [web3.toWei(10)]
            const wExpireTimestamp0 = await latestTime() + 2
            const wexpireLockTimestamps = [wExpireTimestamp0, wExpireTimestamp0]
            await tryCatch(TokenLocker.new(wHolders, wAmounts, wexpireLockTimestamps, sampleToken.address), errorTypes.revert)
        })
        it('should not deploy since the one of the amounts = 0', async () => {
            const wHolders = [accounts[2], accounts[4]]
            const wAmounts = [web3.toWei(10), 0]
            const wExpireTimestamp0 = await latestTime() + 2 
            const wexpireLockTimestamps = [wExpireTimestamp0, wExpireTimestamp0]
            await tryCatch(TokenLocker.new(wHolders, wAmounts, wexpireLockTimestamps, sampleToken.address), errorTypes.revert)
        })
        it('should not deploy since the token address is 0', async () => {
            const expireTimestamp0 = await latestTime() + 2
            const expireLockTimestamps = [expireTimestamp0, expireTimestamp0, expireTimestamp0]
            const wsampleTokenAddress = ''
            await tryCatch(TokenLocker.new(holders, amounts, expireLockTimestamps, wsampleTokenAddress), errorTypes.revert)
        })
        it('should not deploy since the timestamp is not in the future', async () => {
            const expireTimestamp0 = await latestTime()
            const expireLockTimestamps = [expireTimestamp0, expireTimestamp0, expireTimestamp0]
            await tryCatch(TokenLocker.new(holders, amounts, expireLockTimestamps, sampleToken.address), errorTypes.revert)
        })
    })
    describe('TokenLocker deploy success cases: ', async () => {
        it('should deploy', async () => {
            const expireTimestamp0 = await latestTime() + 2
            const expireLockTimestamps = [expireTimestamp0, expireTimestamp0, expireTimestamp0]
            const deploy = await TokenLocker.new(holders, amounts, expireLockTimestamps, sampleToken.address)
            const tx = web3.eth.getTransactionReceipt(deploy.transactionHash)
            expect(tx.status).to.deep.equal('0x1')
        })
    })

    describe('TokenLocker release function fail cases: ', async () => {

        beforeEach(async() => {
            const expireTimestamp0 = await latestTime() + 3600
            const expireLockTimestamps = [expireTimestamp0, expireTimestamp0, expireTimestamp0]
            tokenLocker = await TokenLocker.new(holders, amounts, expireLockTimestamps, sampleToken.address)
        })

        it('should not release the tokens because the msg.sender is not a beneficiary', async() => {
            const sendToken = await sampleToken.transfer(tokenLocker.address, web3.toWei(30))
            await tryCatch(tokenLocker.sendTransaction({ from: notBeneficiary }), errorTypes.revert)
        })
        it('should not release the tokens because the contract does not have any token', async() => {
            await tryCatch(tokenLocker.sendTransaction({ from: beneficiary0 }), errorTypes.revert)
        })
        it('should not release the tokens because the contract does not sufficient tokens', async() => {
            const sendToken = await sampleToken.transfer(tokenLocker.address, web3.toWei(10))
            await tryCatch(tokenLocker.sendTransaction({ from: beneficiary0 }), errorTypes.revert)
        })
        it('should not release the tokens because the expiration date is not met yet', async() => {
            const sendToken = await sampleToken.transfer(tokenLocker.address, web3.toWei(30))
            await tryCatch(tokenLocker.sendTransaction({ from: beneficiary0 }), errorTypes.revert)
        })
    })

    describe('TokenLocker release function success cases: ', async () => {

        before(async() => {
            expireTimestamp0 = await latestTime() + 2
            const expireLockTimestamps = [expireTimestamp0, expireTimestamp0, expireTimestamp0]
            tokenLocker = await TokenLocker.new(holders, amounts, expireLockTimestamps, sampleToken.address)
            sendToken = await sampleToken.transfer(tokenLocker.address, web3.toWei(30))
        })

        it('should release the tokens to the first beneficiary expecting the LogRelease event', async() => {
            const increase = await increaseTime(3)
            const contractTokenBalanceBefore = await sampleToken.balanceOf.call(tokenLocker.address)
            const release = await tokenLocker.sendTransaction({from: beneficiary0})
            const contractTokenBalanceAfter = await sampleToken.balanceOf.call(tokenLocker.address)
            const ev = expectEvent(release, 'LogRelease')
            expect(ev.args.holder).to.equal(beneficiary0)
            expect(ev.args.amount.toString(10)).to.equal(web3.toWei(10).toString(10))
            expect(contractTokenBalanceAfter.toString(10)).to.equal(contractTokenBalanceBefore.sub(web3.toWei(10)).toString(10))
        })
        it('should release the tokens to the second beneficiary expecting the LogRelease event', async() => {
            const contractTokenBalanceBefore = await sampleToken.balanceOf.call(tokenLocker.address)
            const release = await tokenLocker.sendTransaction({from: beneficiary1})
            const contractTokenBalanceAfter = await sampleToken.balanceOf.call(tokenLocker.address)
            const ev = expectEvent(release, 'LogRelease')
            expect(ev.args.holder).to.equal(beneficiary1)
            expect(ev.args.amount.toString(10)).to.equal(web3.toWei(5).toString(10))
            expect(contractTokenBalanceAfter.toString(10)).to.equal(contractTokenBalanceBefore.sub(web3.toWei(5)).toString(10))
        })
        it('should release the tokens to the third beneficiary expecting the LogRelease event', async() => {
            const contractTokenBalanceBefore = await sampleToken.balanceOf.call(tokenLocker.address)
            const release = await tokenLocker.sendTransaction({from: beneficiary2})
            const contractTokenBalanceAfter = await sampleToken.balanceOf.call(tokenLocker.address)
            const ev = expectEvent(release, 'LogRelease')
            expect(ev.args.holder).to.equal(beneficiary2)
            expect(ev.args.amount.toString(10)).to.equal(web3.toWei(15).toString(10))
            expect(contractTokenBalanceAfter.toString(10)).to.equal(contractTokenBalanceBefore.sub(web3.toWei(15)).toString(10))
        })
        it('should have 0 sample token as balance', async() => {
            const contractTokenBalance = await sampleToken.balanceOf.call(tokenLocker.address)
            expect(contractTokenBalance.toString(10)).to.equal('0')
        })
        it('should not let first beneficiary to unlock and release again tokens', async() => {
            await tryCatch(tokenLocker.sendTransaction({ from: beneficiary0 }), errorTypes.revert)
        })
        it('should not let second beneficiary to unlock and release again tokens', async() => {
            await tryCatch(tokenLocker.sendTransaction({ from: beneficiary1 }), errorTypes.revert)
        })
        it('should not let third beneficiary to unlock and release again tokens', async() => {
            await tryCatch(tokenLocker.sendTransaction({ from: beneficiary2 }), errorTypes.revert)
        })
    })

    describe('TokenLocker withdraw airdopped ERC20 cases: ', async () => {
        
        before(async() => {
            // deploy
            expireTimestamp0 = await latestTime() + 2
            const expireLockTimestamps = [expireTimestamp0, expireTimestamp0, expireTimestamp0]
            tokenLocker = await TokenLocker.new(holders, amounts, expireLockTimestamps, sampleToken.address)
            // send lock token
            sendToken = await sampleToken.transfer(tokenLocker.address, web3.toWei(30))
            // send airdrop token
            tokenLockerAirdropBalanceBefore = await airdropToken.balanceOf(tokenLocker.address)
            airdropTokenOwnerBalanceBefore = await airdropToken.balanceOf(accounts[0])
            // console.log(`[tokenLockerAirdropBalanceBefore:send]: ${web3.fromWei(tokenLockerAirdropBalanceBefore).toString(10)}`)
            // console.log(`[airdropTokenOwnerBalanceBefore:send]: ${web3.fromWei(airdropTokenOwnerBalanceBefore).toString(10)}`)
            sendAirdropToken = await airdropToken.transfer(tokenLocker.address, web3.toWei(30))              
            tokenLockerAirdropBalanceAfter = await airdropToken.balanceOf(tokenLocker.address)
            // console.log(`[tokenLockerAirdropBalanceAfter:send]: ${web3.fromWei(tokenLockerAirdropBalanceAfter).toString(10)}`)
            airdropTokenOwnerBalanceAfter = await airdropToken.balanceOf(accounts[0])
            // console.log(`[airdropTokenOwnerBalanceAfter:send]: ${web3.fromWei(airdropTokenOwnerBalanceAfter).toString(10)}`)
            airdropTotalSup = await airdropToken.totalSupply.call()
        })

        describe('Withdraw function fail cases: ', async () => {
            it('should not let withdraw the locked tokens from a beneficiary account', async() => {
                await tryCatch(tokenLocker.withdraw(beneficiary0, sampleToken.address, { from: beneficiary0 }), errorTypes.revert)
            })
            it('should not let withdraw the locked tokens from an external owned account', async() => {
                await tryCatch(tokenLocker.withdraw(notBeneficiary, sampleToken.address, { from: notBeneficiary }), errorTypes.revert)
            })
            it('should not let withdraw the airdropped tokens from an external owned account that is not owner', async() => {
                await tryCatch(tokenLocker.withdraw(notBeneficiary, airdropToken.address, { from: notBeneficiary }), errorTypes.revert)
            })
            it('should not let withdraw the airdropped tokens passing 0 as token address', async() => {
                await tryCatch(tokenLocker.withdraw(accounts[0], '', { from: accounts[0] }), errorTypes.revert)
            })
            it('should not let withdraw the airdropped tokens passing 0 as recipient address', async() => {
                await tryCatch(tokenLocker.withdraw('', airdropToken.address, { from: accounts[0] }), errorTypes.revert)
            })
        })

        describe('Withdraw function success cases: ', async () => {
            it('should let withdraw the airdropped tokens from the owner account', async() => {
                const withdraw = await tokenLocker.withdraw(accounts[0], airdropToken.address, { from: accounts[0] })
                const tokenLockerAirdropBalanceAfter_ = await airdropToken.balanceOf(tokenLocker.address)
                const airdropTokenOwnerBalanceAfter_ = await airdropToken.balanceOf(accounts[0])

                expect(tokenLockerAirdropBalanceAfter_.toString(10)).to.equal('0')
                expect(airdropTokenOwnerBalanceAfter_.toString(10)).to.equal(airdropTotalSup.toString(10))
                // console.log(`[tokenLockerAirdropBalanceAfter:withdraw]: ${web3.fromWei(tokenLockerAirdropBalanceAfter_).toString(10)}`)
                // console.log(`[airdropTokenOwnerBalanceAfter:send]: ${web3.fromWei(airdropTokenOwnerBalanceAfter_).toString(10)}`)
            })
        })

    })
})
