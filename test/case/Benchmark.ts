import Executor from "../../lib/case/Executor"
import Benchmark from "../../lib/case/middleware/Benchmark"
import QueueExecute from "../../lib/case/middleware/QueueExecute"
import UseCase from "../../lib/case/UseCase"

QUnit.module('Benchmark')

QUnit.test('default', function (assert) {
    var done     = assert.async()
    var executor = new Executor([
        Benchmark({
            process: (timeInMS) => {
                assert.ok(timeInMS > 0)
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

    executor.execute(DoNothingCase).then(() => {
        assert.expect(1)
        done()
    })
})



