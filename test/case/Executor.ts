import Middleware from '../../lib/case/middleware/Middleware'
import Executor from "../../lib/case/Executor"
import UseCase from "../../lib/case/UseCase"



class MyUseCase extends UseCase {
    async execute() {
        return '123'
    }
}

QUnit.module('Executor')

QUnit.test('no middleware', function (assert) {
    var done     = assert.async()
    var executor = new Executor()
    executor.execute(MyUseCase).then(function () {
        assert.ok(true)
        done()
    })
})


QUnit.test('single middleware', function (assert) {
    var done         = assert.async()
    var myMiddleware = async function (execute, useCase, data) {
        await execute()
        assert.ok(useCase instanceof MyUseCase)
        assert.equal(data, '123')
        return 'abc'
    }
    var executor     = new Executor([
        myMiddleware
    ])
    executor.execute(MyUseCase, '123').then(function () {
        assert.expect(2)
        done()
    })
})


QUnit.test('multiply middlewares: success', function (assert) {
    var done        = assert.async()
    var counter     = 0
    var middleware1 = async function (execute) {
        assert.equal(counter++, 2)
        await execute()
        assert.equal(counter++, 3)
    }
    var middleware2 = async function (execute) {
        assert.equal(counter++, 1)
        await execute()
        assert.equal(counter++, 4)
    }
    var middleware3 = async function (execute, useCase, data) {
        assert.equal(counter++, 0)
        await execute()
        assert.equal(counter++, 5)
        assert.equal(data, '123')
    }
    var executor    = new Executor([
        middleware1,
        middleware2,
        middleware3
    ])
    executor.execute(MyUseCase, '123').then(function () {
        assert.expect(7)
        done()
    })
})

QUnit.test('multiply middlewares: fail', function (assert) {
    var done        = assert.async()
    var counter     = 0
    var middleware1 = async function (execute) {
        assert.equal(counter++, 1)
        if (1 == 1) throw new Error('for test')
        await execute()
        assert.equal(counter++, 2)

    }
    var middleware2 = async function (execute) {
        assert.equal(counter++, 0)
        await execute()
        assert.equal(counter++, 3)
    }
    var executor    = new Executor([
        middleware1,
        middleware2
    ])
    executor.execute(MyUseCase).then(null, function () {
        assert.expect(2)
        done()
    })
})


//QUnit.test('multiply middlewars fail', function (assert) {
//    var done        = assert.async()
//    var middleware1 = async function (execute) {
//        await execute()
//    }
//
//    var middleware2 = async function (execute) {
//        await execute()
//    }
//    var executor    = new Executor([
//        middleware1,
//        middleware2
//    ])
//    executor.execute(MyUseCase).then(function () {
//        assert.expect(7)
//        done()
//    })
//
//})