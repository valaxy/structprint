import UseCase from "../UseCase";
import Middleware from "./Middleware";

interface BenchmarkOptions {
    process?: (timeInMS:number, useCase:UseCase, ...params) => void
}

var Benchmark = function (options?:BenchmarkOptions):Middleware {
    options         = options || {}
    options.process = options.process || (() => {})

    return async function (execute, useCase:UseCase, ...params) {
        var startTime = performance.now()
        try {
            await execute()
            var endTime = performance.now()
            options.process(endTime - startTime, null, useCase, params)
        } catch (err) {
            var endTime = performance.now()
            options.process(endTime - startTime, err, useCase, params)
        }
    }
}

export default Benchmark