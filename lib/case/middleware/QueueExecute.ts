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

        let makeSuccess = () => {
            timeoutHandle = null
            callback()
        }

        let makeError = (e) => {
            timeoutHandle = null
            callback(e)
        }

        let timeoutHandle = setTimeout(() => {
            if (timeoutHandle !== null) makeTimeout()
        }, timeoutInMS)

        task.useCase['execute'].apply(task.useCase, task.params).then(() => {
            if (timeoutHandle !== null) makeSuccess()
        }, (e) => {
            if (timeoutHandle !== null) makeError(e)
        })
    }, concurrency)

    return function (execute, useCase:UseCase, ...params) {
        return new Promise((resolve, reject)=> {
            queue.push({
                useCase: useCase,
                params : params
            }, function (err) {
                if (err) return reject(err)
                resolve()
            })
        })
    }
}

export default QueueExecute