import Event from '../../lib/event/Event'
import Subject from '../../lib/event/Subject'
import Observer from '../../lib/event/Observer'

QUnit.module('Observer')

QUnit.test('listenTo(): event is plain data', assert => {
    var obs:any = new Observer
    var sub     = new Subject
    obs.listenTo(sub, {type: 'open'}, ({type}) => {
        assert.equal(type, 'open')
    })

    sub.trigger('open')
    sub.trigger({type: 'open'})
    sub.trigger({type: 'open', casefileID: 123})
    assert.expect(3)
})

QUnit.test('listenTo(): event has complex data', assert => {
    var obs   = new Observer
    var sub   = new Subject
    var Model = class { }

    obs.listenTo(sub, {type: 'open', id: 123}, ({type, id, model}) => {
        assert.ok(model instanceof Model)
        assert.equal(type, 'open')
        assert.equal(id, 123)
    })

    sub.trigger({
        type : 'open',
        id   : 123,
        model: new Model
    })
})

QUnit.test('stopListening(): ', assert => {
    var obs:any = new Observer
    var sub     = new Subject

    obs.listenTo(sub, 'open', () => {assert.ok(true)})
    obs.stopListening().listenTo(sub, {type: 'open', casefileID: 123}, () => {assert.ok(true)})

    sub.trigger({type: 'open', casefileID: 123})

    obs.stopListening()
    assert.deepEqual(obs._events, [])
    assert.expect(2)
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