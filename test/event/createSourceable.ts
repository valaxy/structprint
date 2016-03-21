import createSourceable from "../../lib/event/createSourceable"
import UseCase from "../../lib/case/UseCase";

QUnit.module('createSourceable')

QUnit.test('default', assert => {
    var sourceable = createSourceable(() => { })

    @sourceable()
    class Test {
    }

    @sourceable()
    class Test2 {
    }

    var test:any  = new Test()
    var test2:any = new Test()
    assert.ok(Test.prototype['execute'])
    assert.ok(test['execute'])
    assert.equal(test.sourceID, test2.sourceID)
    assert.ok(Test.prototype['sourceID'] != Test2.prototype['sourceID'])
})