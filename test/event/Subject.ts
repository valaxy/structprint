import Subject from '../../lib/event/Subject'
import Event  from '../../lib/event/Event'

QUnit.module('Subject')

var createEvent = function () {
    return new Event(null, null, null)
}

QUnit.test('_pickSubset()', assert => {
    var obs = new Subject
    var e0  = new Event(null, ['0', '1'], null)
    var e1  = new Event(null, ['1', '2'], null)
    var e2  = new Event(null, ['0', '1', '3'], null)
    assert.deepEqual(obs._pickSubSet([]), [])
    assert.deepEqual(obs._pickSubSet([
        [e0, e2],
        [e0, e1, e2],
        [e1]
    ]), [e0, e1])

    assert.equal(e0.__matchCount, 0)
    assert.equal(e1.__matchCount, 0)
    assert.equal(e2.__matchCount, 0)
})


QUnit.test('_pickAlwaysAppearEvents(): empty', function (assert) {
    var obs = new Subject
    assert.deepEqual(obs._pickAlwaysAppearEvents([]), [])
    assert.deepEqual(obs._pickAlwaysAppearEvents([[]]), [])
    assert.deepEqual(obs._pickAlwaysAppearEvents([
        [createEvent()],
        []
    ]), [])
})


QUnit.test('_pickAlwaysAppearEvents(): exactly same', function (assert) {
    var obs = new Subject
    var e1  = createEvent()
    var e2  = createEvent()
    var e3  = createEvent()
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
    var obs = new Subject
    var e1  = createEvent()
    var e2  = createEvent()
    var e3  = createEvent()
    assert.deepEqual(obs._pickAlwaysAppearEvents([
        [e1, e2],
        [e2, e3],
        [e1, e2, e3]
    ]), [e2])
})


QUnit.test('_pickAlwaysAppearEvents(): none', function (assert) {
    var obs = new Subject
    var e1  = createEvent()
    var e2  = createEvent()
    var e3  = createEvent()
    assert.deepEqual(obs._pickAlwaysAppearEvents([
        [e1, e2],
        [e2, e3],
        [e1, e3]
    ]), [])
})


QUnit.test('_flattenEvent()', function (assert) {
    var obs          = new Subject
    obs.PATH_SPLITER = '$'

    // plain value
    assert.deepEqual(obs._flattenEvent({
            a: '123',
            b: 123,
            c: true,
            d: {
                a: '1'
            },
            e: null,
            f: undefined
        }), [
            'a$"123"',
            'b$123',
            'c$true',
            'd$a$"1"',
            'e$null',
            'f$undefined'
        ]
    )

    // plain value + complex value
    assert.deepEqual(obs._flattenEvent({
        a: '123',
        b: new Function,
        c: new RegExp("aa"),
        d: [1, 2, 3]
    }), [
        'a$"123"'
    ])
})


QUnit.test('_on()', function (assert) {
    var obs:any = new Subject
    var fn      = () => {}
    var event   = obs._on({type: 'a'}, fn)

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
    var obs:any        = new Subject
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
    var obs:any        = new Subject
    var event          = new Event(null, ['aaa'], null)
    var event2         = new Event(null, ['bbb'], null)
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

QUnit.test('trigger(): string event', assert => {
    var obs = new Subject
    obs._on({type: 'tt'}, () => {
        assert.ok(true)
    })

    obs.trigger({type: 'tt'})
    assert.expect(1)
})

QUnit.test('trigger(): struct event', function (assert) {
    var sub:any = new Subject
    var event   = sub._on({type: 't1', data: 123}, () => {
        assert.ok(true)
    })
    assert.deepEqual(sub._memberToEvent, {
        'type$"t1"': [event],
        'data$123' : [event]
    })

    sub.trigger({type: 't1'})
    sub.trigger({type: 't1', data: 123})
    sub.trigger({data: 123})
    sub.trigger({type: 't2'})
    assert.expect(2)
})