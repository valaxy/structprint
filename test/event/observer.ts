import Observer = require('../../lib/event/Observer')
import Event = require('../../lib/event/Event')

QUnit.module('Observer')


QUnit.test('_pickAlwaysAppearEvents(): empty', function (assert) {
    var obs = new Observer
    assert.deepEqual(obs._pickAlwaysAppearEvents([]), [])
    assert.deepEqual(obs._pickAlwaysAppearEvents([[]]), [])
    assert.deepEqual(obs._pickAlwaysAppearEvents([
        [new Event],
        []
    ]), [])
})


QUnit.test('_pickAlwaysAppearEvents(): exactly same', function (assert) {
    var obs = new Observer
    var e1  = new Event
    var e2  = new Event
    var e3  = new Event
    assert.deepEqual(obs._pickAlwaysAppearEvents([
        [e1]
    ]), [e1])
    assert.deepEqual(obs._pickAlwaysAppearEvents([
        [e1],
        [e1],
        [e1]
    ]), [e1])
    assert.deepEqual(obs._pickAlwaysAppearEvents([
        [e1, e2, e3],
        [e1, e2, e3]
    ]), [e1, e2, e3])
})


QUnit.test('_pickAlwaysAppearEvents(): mix', function (assert) {
    var obs = new Observer
    var e1  = new Event
    var e2  = new Event
    var e3  = new Event
    assert.deepEqual(obs._pickAlwaysAppearEvents([
        [e1, e2],
        [e2, e3],
        [e1, e2, e3]
    ]), [e2])
})


QUnit.test('_pickAlwaysAppearEvents(): none', function (assert) {
    var obs = new Observer
    var e1  = new Event
    var e2  = new Event
    var e3  = new Event
    assert.deepEqual(obs._pickAlwaysAppearEvents([
        [e1, e2],
        [e2, e3],
        [e1, e3]
    ]), [])
})


QUnit.test('_getObjectComposition()', function (assert) {
    var obs          = new Observer
    obs.PATH_SPLITER = '$'
    assert.deepEqual(obs._getObjectComposition({
            a: '123',
            b: 123,
            c: true,
            d: {
                a: '1'
            }
        }),
        [
            'a$"123"',
            'b$123',
            'c$true',
            'd$a$"1"'
        ]
    )
})


QUnit.test('_on()', function (assert) {
    var obs   = new Observer
    var fn    = () => {}
    var event = obs._on({type: 'a'}, fn)

    assert.ok(event._id >= 0)
    assert.equal(event._callback, fn)
    assert.deepEqual(event._composition, ['type$"a"'])
    assert.deepEqual(obs._memberToEvent, {
        'type$"a"': [event]
    })

    var event2 = obs._on({type: 'a', data: 123}, fn)
    assert.deepEqual(obs._memberToEvent, {
        'type$"a"': [event, event2],
        'data$123': [event2]
    })
})



QUnit.test('_off()', function (assert) {
    var obs            = new Observer
    var event          = new Event(null, [
        'aaa',
        'bbb'
    ], obs)
    obs._memberToEvent = {
        aaa: [event, 1],
        bbb: [2, event],
        ccc: [3]
    }
    obs._off(event)
    assert.deepEqual(obs._memberToEvent, {
        aaa: [1],
        bbb: [2],
        ccc: [3]
    })
})


QUnit.test('_offList()', function (assert) {
    var obs            = new Observer
    var event          = new Event(null, ['aaa'])
    var event2         = new Event(null, ['bbb'])
    obs._memberToEvent = {
        aaa: [event, 1],
        bbb: [2, event],
        ccc: [3]
    }
    obs._offList([event, event2])
    assert.deepEqual(obs._memberToEvent, {
        aaa: [1],
        bbb: [2],
        ccc: [3]
    })
})


// todo, add string event

QUnit.test('trigger(): struct event', function (assert) {
    var obs   = new Observer
    var event = obs._on({type: 't1', data: 123}, () => {
        assert.ok(true)
    })
    assert.deepEqual(obs._memberToEvent, {
        'type$"t1"': [event],
        'data$123' : [event]
    })

    obs.trigger({type: 't1'})
    obs.trigger({type: 't1', data: 123})
    obs.trigger({data: 123})
    obs.trigger({type: 't2'})
    assert.expect(4)
})