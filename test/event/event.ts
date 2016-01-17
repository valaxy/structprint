import Event = require('../../lib/event/Event')
import Observer = require('../../lib/event/Observer')
import Subscriber = require('../../lib/event/Subscriber')

QUnit.module('Event')


QUnit.test('_id', function (assert) {
    var e1 = new Event
    var e2 = new Event
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


