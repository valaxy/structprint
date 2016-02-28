import Event from '../../lib/event/Event'
import Subject from '../../lib/event/Subject'
import Observer from '../../lib/event/Observer'

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
    var s           = new Observer
    var o           = new Subject
    var event:Event = s.listenTo(o, 'open', () => {
        assert.ok(true)
    })

    o.trigger('open')
    assert.expect(1)

    event.stopListening()
    o.trigger('open')
    assert.expect(1)
})


