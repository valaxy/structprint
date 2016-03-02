"use strict"

import Remote from './Remote'
import formUrlEncoded from './ajax/formUrlEncoded'
import formData from './ajax/formData'
import json from './ajax/json'
import xml from './ajax/xml'

const EVENTS = [
    'onloadstart',
    'onprogress',
    'onabort',
    'onerror',
    'onload',
    'ontimeout',
    'onloadend'
]

const CONTENT_TYPE_PROCESS = {
    'application/x-www-form-urlencoded': formUrlEncoded,
    'multipart/form-data'              : formData,
    'application/json'                 : json,
    'text/xml'                         : xml
}

class AJAX extends Remote {
    //
    //
    // Static

    //
    // Attributes
    //
    private _xhr:XMLHttpRequest     = new XMLHttpRequest
    private _method:string          = 'post'
    private _url:string
    private _requestHeaders:Object  = {}
    private _requestData:any
    private _contentType:string     = 'application/json'
    private _responseHeaders:Object = null

    get method():string { return this._method}

    set method(value:string) { this._method = value.toLowerCase()}

    get url():string { return this._url}

    set url(value:string) { this._url = value}

    get requestHeaders():Object { return this._requestHeaders}

    get timeout():number { return this._xhr.timeout}

    set timeout(value:number) { this._xhr.timeout = value}

    get requestData() { return this._requestData}

    set requestData(value) { this._requestData = value}

    get contentType() {return this._contentType}

    set contentType(value) { this._contentType = value.toLowerCase()}

    get status() {return this._xhr.status}

    get statusText() {return this._xhr.statusText}

    get responseHeaders():Object { return this._responseHeaders }

    get responseData():any { return this._xhr.response }

    get responseType():string {return this._xhr.responseType}

    set responseType(value) { this._xhr.responseType = value}

    //
    // Cycles
    //
    private _onloadstart:Promise<any>
    private _onprogress:Promise<any>
    private _onabort:Promise<any>
    private _onerror:Promise<any>
    private _onload:Promise<any>
    private _ontimeout:Promise<any>
    private _onloadend:Promise<any>

    get onloadstart() {return this._onloadstart}

    get onprogress() {return this._onprogress}

    get onabort() {return this._onabort}

    get onerror() {return this._onerror}

    get onload() {return this._onload}

    get ontimeout() {return this._ontimeout}

    get onloadend() {return this._onloadend}

    constructor() {
        super()

        EVENTS.forEach((event) => {
            this[`_${event}`] = new Promise<any>((resolve) => {
                this._xhr.addEventListener(event.slice(2), () => {
                    resolve(this)
                })
            })
        })

        this.onload.then(() => {
            var headers           = this._xhr.getAllResponseHeaders().split('\r\n')
            this._responseHeaders = {}
            headers.forEach(header => {
                var pair = header.split(': ')
                if (pair.length >= 2) {
                    this._responseHeaders[pair[0].toLowerCase()] = pair[1]
                }
            })
        })
    }

    send() {
        if (this.method == 'get') {
            this._xhr.open(this.method, this.url)
        } else {
            this._xhr.open(this.method, this.url)
        }

        for (var header in this.requestHeaders) {
            var value = this.requestHeaders[header]
            this._xhr.setRequestHeader(header, value)
        }

        this._xhr.setRequestHeader('content-type', this.contentType + ';charset=utf-8')
        if (this.contentType in CONTENT_TYPE_PROCESS) {
            CONTENT_TYPE_PROCESS[this.contentType](this._xhr, this.requestData)
        } else {
            this._xhr.send(this.requestData)
        }
        return this
    }

    abort() {
        this._xhr.abort()
        return this
    }
}

export default AJAX