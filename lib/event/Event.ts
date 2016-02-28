"use strict"

class Event {
    private static ID_GENERATOR:number = 0

    __id:number         = Event.ID_GENERATOR++
    __callback:Function
    __composition:string[]
    __subject
    __matchCount:number = 0

    get _id() { return this.__id}

    get _callback() {return this.__callback}

    get _composition() {return this.__composition}

    get _compositionCount() {return this.__composition.length}

    constructor(callback, composition, subject) {
        this.__callback    = callback
        this.__composition = composition
        this.__subject     = subject
    }

    stopListening():void {
        this.__subject._off(this)
    }
}

export default Event

//__subscriberID:number
//        this.__subscriberID = subscriberID
//get _subscriberID() {return this.__subscriberID}
