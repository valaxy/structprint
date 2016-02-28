"use strict"

import Subject from './Subject'
import Event from './Event'

// @日志:
// - 没有监听所有事件的API

class Observer {
    private _events:Event[] = []

    private _listenTo(subject:Subject, event:Object, callback:Function):Event {
        return subject._on(event, callback)
    }

    listenTo(subject:Subject, event:string|Object, callback:Function):Event {
        if (typeof event == 'string') {
            var e = this._listenTo(subject, {type: event}, callback)
        } else if (typeof event == 'object') {
            e = this._listenTo(subject, event, callback)
        } else {
            throw new Error('event error, only can be string|object')
        }

        this._events.push(e)
        return e
    }

    listenToOnce(subject:Subject, event:string|Object, callback:Function):Event {
        var e = this.listenTo(subject, event, (...args) => {
            callback.apply(this, args)
            e.stopListening()
        })
        return e
    }

    stopListening() {
        this._events.forEach(event => {event.stopListening()})
        this._events = []
        return this
    }
}

export default Observer


//private static _SID_GENERATOR = 0
//private _sid                  = Subscriber._SID_GENERATOR++

//private _listenToAll(obs:Observer, callback:Function):Event {
//    return obs._on(this._sid, callback)
//}

