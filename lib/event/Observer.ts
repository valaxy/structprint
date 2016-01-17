import Event = require('./Event')
import _ = require('underscore')

class Observer {
    PATH_SPLITER:string                                  = String.fromCharCode(36)
    private _memberToEvent:{[index:string]:Array<Event>} = {}

    _pickAlwaysAppearEvents(eventsLists:Event[][]):Event[] {
        if (eventsLists.length == 0) return []

        var listCount               = eventsLists.length
        var listIndex               = 0
        var counter                 = 0
        var theAppearEvent:Event    = eventsLists[0][0]
        var theAppearEvents:Event[] = []
        var eventIndexes:number[]   = new Array(listCount).fill(0)
        var end                     = false

        while (true) {
            var list:Event[] = eventsLists[listIndex]

            while (true) {
                let eventIndex   = eventIndexes[listIndex]
                let currentEvent = list[eventIndex]
                if (eventIndex == list.length) {
                    end = true
                    break
                }

                if (theAppearEvent._id == currentEvent._id) {
                    counter += 1
                    eventIndexes[listIndex] += 1
                    if (listCount == counter) theAppearEvents.push(currentEvent)
                    break
                } else if (theAppearEvent._id < currentEvent._id) {
                    counter        = 1
                    eventIndexes[listIndex] += 1
                    theAppearEvent = currentEvent
                    if (listCount == counter) theAppearEvents.push(currentEvent)
                    break
                } else {
                    eventIndexes[listIndex] += 1
                }
            }

            if (end) break
            listIndex = (listIndex + 1) % listCount
        }

        return theAppearEvents
    }

    _getObjectComposition(obj:Object) {
        var iterate = (compositions:string[], prefix:string, obj:Object) => {
            for (var key in obj) {
                var value     = obj[key]
                var newPrefix = `${prefix}${this.PATH_SPLITER}${key}`
                if (typeof value == 'object') {
                    iterate(compositions, newPrefix, value)
                    continue
                }

                if (typeof value == 'string') {
                    var member = `${newPrefix}${this.PATH_SPLITER}${JSON.stringify(value)}`
                } else {
                    member = `${newPrefix}${this.PATH_SPLITER}${value}`
                }
                compositions.push(member.slice(1))
            }
            return compositions
        }

        return iterate([], '', obj)
    }

    // internal use
    _on(event:Object, callback:Function):Event {
        var composition:string[] = this._getObjectComposition(event)
        var e                    = new Event(callback, composition, this)
        composition.forEach(member => {
            if (member in this._memberToEvent) {
                this._memberToEvent[member].push(e)
            } else {
                this._memberToEvent[member] = [e]
            }
        })
        return e
    }

    // internal use
    _off(event:Event) {
        for (var member of event._composition) {
            let events = this._memberToEvent[member]
            let index  = _.indexOf(events, event)
            events.splice(index, 1)
        }
        return this
    }

    // internal use
    _offList(events:Event[]) {
        events.forEach(event => this._off(event))
        return this
    }

    trigger(event:string|Object, ...args) {
        if (typeof event == 'string') {
            event = {type: event}
        }

        var composition:string[] = this._getObjectComposition(event)
        var eventsList           = composition.map(member => {
            return this._memberToEvent[member] || []
        })

        var triggerEvents:Event[] = this._pickAlwaysAppearEvents(eventsList)
        triggerEvents.forEach(event => {
            event._callback.apply(this, args)
        })
    }
}



export = Observer