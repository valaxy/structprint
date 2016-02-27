import Event from '../../lib/event/Event'
import Observer from '../../lib/event/Observer'
import Subscriber from '../../lib/event/Subscriber'

QUnit.module('Event')

var createEvent = function () {
    return new Event(null, null, null)
}

QUnit.test('_id', function (assert) {
    var e1 = createEvent()
    var e2 = createEvent()
    assert.equal(e2._id, e1._id + 1)
})


QUnit.test('stopListening()', function (assert) {
    var s           = new Subscriber
    var o           = new Observer
    var event:Event = s.listenTo(o, 'open', () => {
        assert.ok(true)
    })

    o.trigger('open')
    assert.expect(1)

    event.stopListening()
    o.trigger('open')
    assert.expect(1)
})


