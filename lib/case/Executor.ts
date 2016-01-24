import UseCase from './UseCase'
import Middleware from './middleware/Middleware'

class Executor {
    private _middlewares:Middleware[]

    constructor(middlewares?:Middleware[]) {
        this._middlewares = middlewares || []
    }

    async execute(UseCase, ...params) {
        var useCase = new UseCase
        var execute = async () => {}
        this._middlewares.forEach((middleware) => {
            let oldExecute = execute
            execute        = async () => {
                await middleware.apply(this, [].concat(oldExecute, useCase, params))
            }
        })

        await execute()
    }
}

export default Executor

