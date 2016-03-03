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
            var result  = await execute()
            var endTime = performance.now()
            options.process(endTime - startTime, null, useCase, params)
            return result
        } catch (err) {
            var endTime = performance.now()
            options.process(endTime - startTime, err, useCase, params)
            throw err
        }
    }
}

export default Benchmark