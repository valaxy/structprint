import Event from '../../lib/event/Event'
import Subject from '../../lib/event/Subject'
import Observer from '../../lib/event/Observer'

QUnit.module('Observer')

QUnit.test('listenTo()/stopListening(): struct event', assert => {
    var obs:any = new Observer
    var sub     = new Subject
    obs.listenTo(sub, {type: 'open'}, () => {
        assert.ok(true)
    })

    sub.trigger({type: 'open'})
    sub.trigger({type: 'open', casefileID: 123})

    obs.stopListening().listenTo(sub, {type: 'open', casefileID: 123}, () => {assert.ok(true)})
    sub.trigger({type: 'open', casefileID: 123})

    sub.trigger({casefileID: 123})
    sub.trigger({type: 'open'})

    obs.stopListening()
    assert.deepEqual(obs._events, [])
    assert.expect(4)
})

//QUnit.test('listenTo(): execute fail', assert => {
//    var obs  = new Observer
//    var sub  = new Subject({
//        tryCatch: function () {}
//    })
//    var done = assert.async()
//
//    obs.listenTo(sub, 'abc', () => {
//        throw new Error('xx')
//    })
//
//    obs.listenTo(sub, 'abc', () => {
//        assert.ok(true)
//        done()
//    })
//
//    sub.trigger('abc')
//})

QUnit.test('listenToOnce()', assert => {
    var obs     = new Observer
    var subject = new Subject
    obs.listenToOnce(subject, {type: 'open'}, () => {
        assert.ok(true)
    })

    subject.trigger({type: 'open'})
    subject.trigger({type: 'open'})
    assert.expect(1)
})

QUnit.test('listenToMany()', assert => {
    var obs     = new Observer
    var subject = new Subject

    obs.listenToMany(subject, [
        ['type1', () => {assert.ok(true)}],
        ['type2', () => {assert.ok(true)}]
    ])

    subject.trigger('type1')
    subject.trigger('type2')
    assert.expect(2)
})


//QUnit.test('listenTo()/stopListening(): struct event', function (assert) {
//    var s:any = new Subscriber
//    var o     = new Observer
//    s.listenTo(o, {type: 'open', casefileID: 123}, () => {
//        assert.ok(true)
//    })
//
//    o.trigger({type: 'open', casefileID: 123})
//    assert.expect(1)
//
//    o.trigger({type: 'open'})
//    assert.expect(2)
//
//    o.trigger({casefileID: 123})
//    assert.expect(3)
//
//    o.trigger({type: 'close', casefileID: 123})
//    assert.expect(3)
//
//
//    s.stopListening()
//    assert.deepEqual(s._events, [])
//    assert.expect(4)
//
//    o.trigger({type: 'open'})
//    assert.expect(4)
//})
