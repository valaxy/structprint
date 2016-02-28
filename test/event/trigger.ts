import trigger from '../../lib/event/trigger'

QUnit.module('trigger')


QUnit.test('empty', assert => {
    trigger([], [])
    assert.ok(true)
})

QUnit.test('one event', assert => {
    var ok = () => { assert.ok(true) }

    trigger([
        ['abc']
    ], [
        ['abc', ok],
        ['xyz', ok]
    ])
    assert.expect(1)
})


QUnit.test('multiply events', assert => {
    trigger([
        ['abc', 123],
        ['abc', 123],
        ['xyz'],
        ['abcxyz']
    ], [
        ['abc', (data) => {assert.equal(data, 123)}],
        ['xyz', ()=> {assert.ok(true)}]
    ])

    assert.expect(3)
})