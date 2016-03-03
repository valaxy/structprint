import Executor from "../../lib/case/Executor"
import QueueExecuteMiddleware from "../../lib/case/middleware/QueueExecute"
import UseCase from "../../lib/case/UseCase"

QUnit.module('QueueExecute')

QUnit.test('concurrency = 1', assert => {
    var done        = assert.async()
    var beginTime   = performance.now()
    var executor    = new Executor([
        QueueExecuteMiddleware(1)
    ])
    var TimeoutCase = class extends UseCase {
        async execute() {
            await new Promise((resolve) => {
                setTimeout(resolve, 200)
            })
        }
    }

    executor.execute(TimeoutCase).then(() => {
        var time = performance.now() - beginTime
        assert.ok(Math.abs(time - 200) < 30)
    })
    executor.execute(TimeoutCase).then(() => {
        var time = performance.now() - beginTime
        assert.ok(Math.abs(time - 400) < 30)
    })
    executor.execute(TimeoutCase).then(() => {
        var time = performance.now() - beginTime
        assert.ok(Math.abs(time - 600) < 30)
        done()
    })
})


QUnit.test('concurrency = 2', assert => {
    var done        = assert.async()
    var beginTime   = performance.now()
    var executor    = new Executor([
        QueueExecuteMiddleware(2)
    ])
    var TimeoutCase = class extends UseCase {
        async execute() {
            await new Promise((resolve) => {
                setTimeout(resolve, 200)
            })
        }
    }

    executor.execute(TimeoutCase).then(() => {
        var time = performance.now() - beginTime
        assert.ok(Math.abs(time - 200) < 50)
    })
    executor.execute(TimeoutCase).then(() => {
        var time = performance.now() - beginTime
        assert.ok(Math.abs(time - 200) < 50)
    })
    executor.execute(TimeoutCase).then(() => {
        var time = performance.now() - beginTime
        assert.ok(Math.abs(time - 400) < 50)
        done()
    })
})


QUnit.test('timeout', assert => {
    var done      = assert.async()
    var beginTime = performance.now()
    var executor  = new Executor([
        QueueExecuteMiddleware(1, 200)
    ])

    var TimeoutCase = class extends UseCase {
        async execute() {
            await new Promise((resolve) => {
                setTimeout(resolve, 500)
            })
        }
    }

    executor.execute(TimeoutCase).catch((e) => {
        var time = performance.now() - beginTime
        assert.ok(e.message.indexOf('timeout') >= 0)
        assert.ok(Math.abs(time - 200) < 50)
        done()
    })
})



