import Middleware from "./Middleware";
import UseCase from "../UseCase";
import async = require('async')

var QueueExecute = function (concurrency?:number) {
    concurrency = concurrency || 1
    var queue   = async.queue<{useCase:UseCase,params:any[]}>((task, callback) => {
        task.useCase['execute'].apply(task.useCase, task.params).then(() => { // TODO
            callback()
        }).catch((e)=> {
            callback(e)
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