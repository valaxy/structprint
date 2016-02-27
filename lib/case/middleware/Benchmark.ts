import UseCase from "../UseCase";

interface BenchmarkOptions {
    process?: (timeInMS:number, useCase:UseCase, ...params) => void
}

var Benchmark = function (options?:BenchmarkOptions) {
    options         = options || {}
    options.process = options.process || (() => {})

    return async function (execute, useCase:UseCase, ...params) {
        var startTime = performance.now()
        await execute()
        var endTime = performance.now()
        options.process(endTime - startTime, useCase, ...params)
    }
}

export default Benchmark