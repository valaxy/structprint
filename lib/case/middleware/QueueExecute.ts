"use strict"

import Middleware from "./Middleware";
import UseCase from "../UseCase";
import async = require('async')

interface Task {
    useCase:UseCase,
    params:any[]
}

// todo, 即使timeout任务仍然会继续执行下去
var QueueExecute = function (concurrency?:number, timeoutInMS?:number) { // todo :Middleware??
    concurrency = concurrency || 1
    timeoutInMS = timeoutInMS || 5000
    var queue   = async.queue<Task>((task, callback) => {
        let makeTimeout = () => {
            timeoutHandle = null
            var e:any     = new Error(`id=${task.useCase.id}, name=${task.useCase.constructor.name} timeout of ${timeoutInMS}ms`)
            e.useCase     = task.useCase
            e.params      = task.params
            callback(e)
        }

        let makeSuccess = (result) => {
            timeoutHandle = null;
            (callback as any)(null, result) // todo, 这里的queue.push的callback类型有问题
        }

        let makeError = (e) => {
            timeoutHandle = null
            callback(e)
        }

        let timeoutHandle = setTimeout(() => {
            if (timeoutHandle !== null) makeTimeout()
        }, timeoutInMS)

        task.useCase['execute'].apply(task.useCase, task.params).then((result) => {
            if (timeoutHandle !== null) makeSuccess(result)
        }, (e) => {
            if (timeoutHandle !== null) makeError(e)
        })
    }, concurrency)

    return function (execute, useCase:UseCase, ...params) {
        return new Promise((resolve, reject) => {
            // todo, 这里的queue.push的callback类型有问题
            (queue as any).push({
                useCase: useCase,
                params : params
            }, function (err, result) {
                if (err) return reject(err)
                resolve(result)
            })
        })
    }
}

export default QueueExecute