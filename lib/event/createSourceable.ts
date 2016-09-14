export interface Execute {
    (UseCase, ...params):any
}

export default function createSourceable(execute:Execute) {
    var sourceID = 0

    return function sourceable() {
        return function (targetClass) {
            Object.assign(targetClass.prototype, {
                sourceID: sourceID++,

                execute(UseCase, ...params) {
                    execute(UseCase, ...params, this.constructor.prototype.sourceID)
                }
            })
        }
    }
}