"use strict"

class Event {
    private static ID_GENERATOR:number = 0

    __id:number         = Event.ID_GENERATOR++
    __callback:Function
    __composition:string[]
    __observer
    __matchCount:number = 0

    get _id() { return this.__id}

    get _callback() {return this.__callback}

    get _composition() {return this.__composition}

    get _compositionCount() {return this.__composition.length}

    constructor(callback, composition, observer) {
        this.__callback    = callback
        this.__composition = composition
        this.__observer    = observer
    }

    stopListening():void {
        this.__observer._off(this)
    }
}

export default Event

//__subscriberID:number
//        this.__subscriberID = subscriberID
//get _subscriberID() {return this.__subscriberID}
