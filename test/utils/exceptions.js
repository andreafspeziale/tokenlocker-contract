const prefix = 'VM Exception while processing transaction: '
const errorTypes = {
    revert: 'revert',
    outOfGas: 'out of gas',
    invalidJump: 'invalid JUMP',
    invalidOpcode: 'invalid opcode',
    stackOverflow: 'stack overflow',
    stackUnderflow: 'stack underflow',
    staticStateChange: 'static state change'
}

const tryCatch = async (promise, errType) => {
    try {
        await promise
        throw null
    } catch (error) {
        assert(error, 'Expected an error but did not get one')
        assert(error.message.startsWith(prefix + errType), `Expected an error starting with ${prefix + errType} but got ${error.message} instead`)
    }
}

module.exports = {
    errorTypes: errorTypes,
    tryCatch: tryCatch,
}