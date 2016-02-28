import Subject from "./Subject";
import Observer from "./Observer";

type ListenData = [string|Object, Function]

type TriggerData = any[]

const trigger = function (events:TriggerData, listens:ListenData[]) {
    var observer = new Observer
    var subject  = new Subject
    listens.forEach((listenData) => {
        let listenEvent    = listenData[0]
        let listenCallback = listenData[1]
        observer.listenTo(subject, listenEvent, listenCallback)
    })

    events.forEach(eventData => {
        subject.trigger.apply(subject, eventData)
    })
}

export default trigger