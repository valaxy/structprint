class Event {
    private static ID_GENERATOR:number = 0

    private __id:number = Event.ID_GENERATOR++
    private __callback:Function
    private __composition:string[]
    private __observer

    get _id() { return this.__id}

    get _callback() {return this.__callback}

    get _composition() {return this.__composition}

    constructor(callback, composition, observer) {
        this.__callback    = callback
        this.__composition = composition
        this.__observer    = observer
    }

    stopListening():void {
        this.__observer._off(this)
    }
}

export = Event

//__subscriberID:number
//        this.__subscriberID = subscriberID
//get _subscriberID() {return this.__subscriberID}
