const expectEvent = (res, eventName) => {
    const ev = _.find(res.logs, {event: eventName})
    expect(ev).to.not.be.undefined
    return ev
}

module.exports = {
    expectEvent: expectEvent
}