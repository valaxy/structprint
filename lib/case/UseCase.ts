var idCounter:number = 0

class UseCase {
    private _id = idCounter++

    get id():number {return this._id}

    //async execute() {
    //    throw new Error('execute() should override and implement')
    //}
}

export default UseCase