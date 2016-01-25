"use strict"

import UseCase from '../UseCase'

interface Middleware {
    (execute, useCase:UseCase, ...params:any[]):void
}

export default Middleware