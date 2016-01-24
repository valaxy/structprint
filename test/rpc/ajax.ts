import AJAX from '../../lib/rpc/AJAX'

QUnit.module('AJAX')


//var collectEvent = function (events, flag) {
//    return function () {
//        events.push(flag)
//    }
//}
//
//
//var initTestCycle = function () {
//    var ajax   = new AJAX
//    var events = []
//    ajax.onloadstart.then(collectEvent(events, 1))
//    ajax.onabort.then(collectEvent(events, 2))
//    ajax.onerror.then(collectEvent(events, 3))
//    ajax.onload.then(collectEvent(events, 4))
//    ajax.ontimeout.then(collectEvent(events, 5))
//    ajax.onloadend.then(collectEvent(events, 6))
//    return {ajax, events}
//}
//
//QUnit.test('method', function (assert) {
//    var ajax = new AJAX
//    assert.equal(ajax.method, 'post')
//
//    ajax.method = 'Get'
//    assert.equal(ajax.method, 'get')
//})
//
//QUnit.test('url', function (assert) {
//    var ajax = new AJAX
//    assert.strictEqual(ajax.url, undefined)
//
//    ajax.url = '123'
//    assert.equal(ajax.url, '123')
//})
//
//QUnit.test('requestHeaders', function (assert) {
//    var ajax = new AJAX
//    assert.deepEqual(ajax.requestHeaders, {})
//})
//
//
//QUnit.test('timeout', function (assert) {
//    var ajax = new AJAX
//    assert.equal(ajax.timeout, 0)
//
//    ajax.timeout = 1000
//    assert.equal(ajax.timeout, 1000)
//})
//
//QUnit.test('requestData', function (assert) {
//    var ajax = new AJAX
//    assert.strictEqual(ajax.requestData, undefined)
//
//    ajax.requestData = '123'
//    assert.equal(ajax.requestData, '123')
//})
//
//QUnit.test('contentType', function (assert) {
//    var ajax = new AJAX
//    assert.equal(ajax.contentType, 'application/json')
//
//    ajax.contentType = 'application/XML'
//    assert.equal(ajax.contentType, 'application/xml')
//})
//
//
//
//QUnit.test('load: 404/status/statusText', function (assert) {
//    var done = assert.async()
//    var {ajax,events} = initTestCycle()
//    ajax.url = '/notexist'
//
//    ajax.onloadend.then(() => {
//        console.warn('404 above is intentional')
//        assert.deepEqual([1, 4, 6], events)
//        assert.strictEqual(ajax.status, 404)
//        assert.equal(ajax.statusText, 'Not Found')
//        done()
//    })
//
//    ajax.send()
//})
//
//
//QUnit.test('load: 200/status/statusText/responseHeaders', function (assert) {
//    var done = assert.async()
//    var {ajax,events} = initTestCycle()
//    ajax.url = '/time/0'
//
//    ajax.onloadend.then(() => {
//        assert.deepEqual([1, 4, 6], events)
//        assert.strictEqual(ajax.status, 200)
//        assert.equal(ajax.statusText, 'OK')
//        assert.equal(ajax.responseHeaders['content-type'], 'application/json; charset=utf-8')
//        assert.equal(ajax.responseHeaders['content-length'], '12')
//        done()
//    })
//
//    ajax.send()
//})
//
//QUnit.test('load: 500/status/statusText', function (assert) {
//    var done = assert.async()
//    var {ajax,events} = initTestCycle()
//    ajax.url = '/500'
//
//    ajax.onloadend.then(() => {
//        console.warn('500 above is intentional')
//        assert.deepEqual([1, 4, 6], events)
//        assert.strictEqual(ajax.status, 500)
//        assert.equal(ajax.statusText, 'Internal Server Error')
//        done()
//    })
//
//    ajax.send()
//})
//
//QUnit.test('timeout/status/statusText/responseHeaders', function (assert) {
//    var done     = assert.async()
//    var {ajax,events} = initTestCycle()
//    ajax.url     = '/time/2000'
//    ajax.timeout = 300
//
//    ajax.onloadend.then(() => {
//        assert.deepEqual([1, 5, 6], events)
//        assert.strictEqual(ajax.status, 0)
//        assert.equal(ajax.statusText, '')
//        assert.deepEqual(ajax.responseHeaders, null)
//        done()
//    })
//
//    ajax.send()
//})
//
//QUnit.test('abort/status/statusText', function (assert) {
//    var done = assert.async()
//    var {ajax,events} = initTestCycle()
//    ajax.url = '/time/10000'
//
//    ajax.onloadend.then(() => {
//        assert.deepEqual([1, 2, 6], events)
//        assert.strictEqual(ajax.status, 0)
//        assert.equal(ajax.statusText, '')
//        done()
//    })
//
//    ajax.send()
//    ajax.abort()
//})
//
//
//
//QUnit.test('responseData: json & application/json', function (assert) {
//    var done = assert.async()
//    var ajax = new AJAX
//    ajax.url = '/json'
//
//    ajax.onloadend.then(() => {
//        assert.deepEqual(ajax.responseData, JSON.stringify({msg: 'json'}))
//        done()
//    })
//
//    ajax.send()
//})
//
//QUnit.test('responseData: jsonstring & text/plain', function (assert) {
//    var done = assert.async()
//    var ajax = new AJAX
//    ajax.url = '/jsonstring'
//
//    ajax.onloadend.then(() => {
//        assert.deepEqual(ajax.responseData, JSON.stringify({msg: 'jsonstring'}))
//        done()
//    })
//
//    ajax.send()
//})
//
//
//QUnit.test('formUrlEncoded', function (assert) {
//    var done          = assert.async()
//    var ajax          = new AJAX
//    ajax.url          = '/formUrlEncoded'
//    ajax.contentType  = 'application/x-www-form-urlencoded'
//    ajax.responseType = 'json'
//    ajax.requestData  = {value: '~!@#$%^&*()_+qwe123'}
//
//    ajax.onloadend.then(() => {
//        assert.deepEqual(ajax.responseData, {value: '~!@#$%^&*()_+qwe123'})
//        done()
//    })
//
//    ajax.send()
//})