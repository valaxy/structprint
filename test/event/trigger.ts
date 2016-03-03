import trigger from '../../lib/event/trigger'

QUnit.module('trigger')


QUnit.test('empty', assert => {
    trigger([], [])
    assert.ok(true)
})

QUnit.test('one event', assert => {
    var ok = ({type}) => { assert.equal(type, 'abc') }

    trigger([
        'abc'
    ], [
        ['abc', ok],
        ['xyz', ok]
    ])
})


QUnit.test('multiply events', assert => {
    trigger([
        {type: 'abc', data: 123},
        {type: 'abc', data: 123},
        'xyz',
        'abcxyz'
    ], [
        ['abc', (data) => {assert.deepEqual(data, {type: 'abc', data: 123})}],
        ['xyz', ({type})=> {assert.equal(type, 'xyz')}]
    ])

    assert.expect(3)
})