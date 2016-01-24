import UseCase from '../../lib/case/UseCase'

class CorrectCase extends UseCase {
    async execute(data1, data2) {
        return data1 + ' ' + data2
    }
}

QUnit.module('UseCase')


QUnit.test('execute correct', function (assert) {
    var done = assert.async()
    var c    = new CorrectCase
    c.execute('1', '2').then((result) => {
        assert.equal('1 2', result)
        done()
    })
})


QUnit.test('execute wrong', function (assert) {
    class WrongCase extends UseCase {
        async execute() {
            throw new Error('wrong')
        }
    }

    var done = assert.async()
    var c    = new WrongCase
    c.execute().catch((result)=> {
        assert.equal(result.message, 'wrong')
        done()
    })
})


QUnit.test('id', function (assert) {
    var c1 = new CorrectCase()
    var c2 = new CorrectCase()
    assert.equal(c1.id + 1, c2.id)
})

