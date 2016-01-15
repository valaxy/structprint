import express    = require('express')
import path       = require('path')
import bodyParser = require('body-parser')

export = {
    start: function (callback) {
        var app = express()

        this.server = app.listen(12010, function () {
            callback && callback()
        })


        app.post('/time/:time', function (req, res) {
            var time = req.params.time
            setTimeout(function () {
                res.status(200)
                res.send({msg: 'ok'})
            }, time)
        })

        app.post('/json', function (req, res) {
            res.send({msg: 'json'})
        })

        app.post('/string', function (req, res) {
            res.send("string")
        })

        app.post('/jsonstring', function (req, res) {
            res.type('text')
            res.send('{"msg":"jsonstring"}')
        })

        app.post('/formUrlEncoded', bodyParser.urlencoded({extended: false}), function (req, res) {
            res.send({value: req.body.value})
        })

        app.post('/500', function (req, res) {
            res.status(500)
            res.send({msg: 'bad'})
        })
        app.use('/', express.static(path.join(__dirname, '../')))
    },

    stop: function () {
        this.server.stop()
    }
}