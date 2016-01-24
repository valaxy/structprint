import Executor from "../../lib/case/Executor"
import QueueExecuteMiddleware from "../../lib/case/middleware/QueueExecute"
import UseCase from "../../lib/case/UseCase"

QUnit.module('QueueExecute')

QUnit.test('concurrency = 1', function (assert) {
    var done        = assert.async()
    var beginTime   = performance.now()
    var executor    = new Executor([
        QueueExecuteMiddleware(1)
    ])
    var TimeoutCase = class extends UseCase {
        async execute() {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000)
            })
        }
    }

    executor.execute(TimeoutCase).then(() => {
        var time = performance.now() - beginTime
        assert.ok(Math.abs(time - 1000) < 50)
    })
    executor.execute(TimeoutCase).then(() => {
        var time = performance.now() - beginTime
        assert.ok(Math.abs(time - 2000) < 50)
    })
    executor.execute(TimeoutCase).then(() => {
        var time = performance.now() - beginTime
        assert.ok(Math.abs(time - 3000) < 50)
        done()
    })
})


QUnit.test('concurrency = 2', function (assert) {
    var done        = assert.async()
    var beginTime   = performance.now()
    var executor    = new Executor([
        QueueExecuteMiddleware(2)
    ])
    var TimeoutCase = class extends UseCase {
        async execute() {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000)
            })
        }
    }

    executor.execute(TimeoutCase).then(() => {
        var time = performance.now() - beginTime
        assert.ok(Math.abs(time - 1000) < 50)
    })
    executor.execute(TimeoutCase).then(() => {
        var time = performance.now() - beginTime
        assert.ok(Math.abs(time - 1000) < 50)
    })
    executor.execute(TimeoutCase).then(() => {
        var time = performance.now() - beginTime
        assert.ok(Math.abs(time - 2000) < 50)
        done()
    })
})




