"use strict"

class UseCase {
    static ID_COUNTER:number = 0
    private _id

    get id() {return this._id}

    constructor() {
        this._id = UseCase.ID_COUNTER++
    }

    //async execute() {
    //    throw new Error('execute() should override and implement')
    //}
}

export default UseCase