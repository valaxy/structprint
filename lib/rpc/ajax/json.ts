export default function json(xhr:XMLHttpRequest, data:any) {
    xhr.setRequestHeader('content-type', 'application/json')
    xhr.send(JSON.stringify(data))
}