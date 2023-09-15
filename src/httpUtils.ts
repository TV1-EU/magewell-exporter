import http from 'http';
import { URL } from 'url';

function HttpUtils() { }

export type Options = { headers?: http.OutgoingHttpHeaders, timeout?: number }

HttpUtils.prototype.get = function (url: string, options: Options = {}) {
    return new Promise((resolve, reject) => {
        const urlInfo = new URL(url)
        const opts: http.RequestOptions = {}
        opts.hostname = urlInfo.hostname
        opts.path = urlInfo.pathname + urlInfo.search
        opts.port = urlInfo.port || 80
        opts.headers = options.headers || {}
        opts.timeout = options.timeout || 5000

        // set timeout, default 5s
        const requestTimerID = setTimeout(() => {
            httpGet.abort()
        }, opts.timeout)

        const httpGet = http.get(opts, (res) => {
            clearTimeout(requestTimerID)
            const { statusCode, headers } = res
            let error = null
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code:  ${statusCode}`)
            }
            if (error) {
                res.resume()
                reject(error)
            }

            res.setEncoding('utf8')
            let rawData = ''
            res.on('data', (chunk) => {
                rawData += chunk
            })
            res.on('end', () => {
                const resData = {
                    statusCode,
                    headers,
                    data: headers['content-type'] === 'application/json' ? JSON.parse(rawData) : rawData
                }
                resolve(resData)
            })
        }).on('error', (e) => {
            reject(e.message)
        })
    })
}

export default HttpUtils