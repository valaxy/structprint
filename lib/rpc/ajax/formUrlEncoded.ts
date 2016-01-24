export default function (xhr:XMLHttpRequest, data:Object) {
    var requestData = ''
    for (var key in data) {
        var value = data[key]
        requestData += key + '=' + encodeURIComponent(value) + '&'
    }
    requestData = requestData.slice(0, requestData.length - 1)
    xhr.send(requestData)
}