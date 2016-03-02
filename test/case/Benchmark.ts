import Executor from "../../lib/case/Executor"
import Benchmark from "../../lib/case/middleware/Benchmark"
import QueueExecute from "../../lib/case/middleware/QueueExecute"
import UseCase from "../../lib/case/UseCase"

QUnit.module('Benchmark')

QUnit.test('default', assert => {
    var done     = assert.async()
    var executor = new Executor([
        QueueExecute(1),
        Benchmark({
            process: (durationInMS, err, useCase) => {
                assert.ok(durationInMS > 0)
                assert.ok(err === null)
                assert.ok(useCase.id >= 0)
            }
        })
    ])

    var DoNothingCase = class extends UseCase {
        async execute() {
            await new Promise((resolve) => {
                resolve()
            })
        }
    }

    executor.execute(DoNothingCase).then(done)
})


QUnit.test('collect info when fail', assert => {
    var done     = assert.async()
    var executor = new Executor([
        QueueExecute(1),
        Benchmark({
            process: (durationInMS, err, useCase) => {
                assert.ok(durationInMS > 0)
                assert.equal(err, e)
                assert.ok(useCase.id >= 0)
            }
        })
    ])

    var e         = new Error()
    var ErrorCase = class extends UseCase {
        async execute() {
            throw e
        }
    }

    executor.execute(ErrorCase).then(done)
})

