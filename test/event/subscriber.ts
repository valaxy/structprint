import Event from '../../lib/event/Event'
import Observer from '../../lib/event/Observer'
import Subscriber from '../../lib/event/Subscriber'


QUnit.module('Subscriber')


QUnit.test('listenTo()/stopListening(): struct event', function (assert) {
    var s:any = new Subscriber
    var o     = new Observer
    s.listenTo(o, {type: 'open', casefileID: 123}, () => {
        assert.ok(true)
    })

    o.trigger({type: 'open', casefileID: 123})
    assert.expect(1)

    o.trigger({type: 'open'})
    assert.expect(2)

    o.trigger({casefileID: 123})
    assert.expect(3)

    o.trigger({type: 'close', casefileID: 123})
    assert.expect(3)


    s.stopListening()
    assert.deepEqual(s._events, [])
    assert.expect(4)

    o.trigger({type: 'open'})
    assert.expect(4)
})



QUnit.test('listenToOnce()', function (assert) {
    var s = new Subscriber
    var o = new Observer
    s.listenToOnce(o, {type: 'open', casefileID: 123}, () => {
        assert.ok(true)
    })

    o.trigger({type: 'open'})
    o.trigger({type: 'open'})
    assert.expect(1)
})