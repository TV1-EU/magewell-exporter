import http from 'http';
import { URL } from 'url';

function HttpUtils() { }

export type Options = { headers?: http.OutgoingHttpHeaders, timeout?: number }
// get
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

// // upload
// HttpUtils.prototype.upload = function (url, filePath, options = {}) {

//     return new Promise((resolve, reject) => {
//         const urlInfo = new URL(url)

//         const boundaryKey = '----WebKitFormBoundarypQg2o6On0TJpWqIk';
//         const opts = {
//             hostname: urlInfo.hostname,
//             path: urlInfo.pathname + urlInfo.search,
//             port: urlInfo.port || 80,
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'multipart/form-data; boundary=' + boundaryKey,
//                 'Cookie': options.headers.Cookie
//             }
//         }

//         //read file
//         fs.readFile(filePath, function (err, data) {

//             if (err) {
//                 reject(err);
//                 return false;
//             }

//             //"multipart/form-data" encoding, see https://www.w3.org/TR/html4/interact/forms.html#didx-multipartform-data
//             let payloadStart = `--${boundaryKey}\r\n`;
//             payloadStart += `Content-Disposition: form-data; name="file"; filename="${path.basename(filePath)}"\r\n`;
//             payloadStart += 'Content-Type: application/octet-stream\r\n\r\n';

//             let payloadEnd = '\r\n--';
//             payloadEnd += boundaryKey + '--\r\n';

//             // to Buffer
//             const payloadBufStart = Buffer.from(payloadStart);
//             const payloadBufEnd = Buffer.from(payloadEnd);

//             // payloadBufStart + data + payloadBufEnd
//             const payloadBufs = [payloadBufStart, data, payloadBufEnd];
//             const payloadBuf = Buffer.concat(payloadBufs);

//             const payloadLength = Buffer.byteLength(payloadBuf);

//             const req = http.request(opts, (res) => {
//                 let resData = '';
//                 res.setEncoding('utf8');
//                 res.on('data', (chunk) => {
//                     resData += chunk;
//                 });
//                 res.on('end', () => {
//                     try {
//                         resolve(JSON.parse(resData));
//                     } catch (err) {
//                         reject(resData);
//                     }

//                 });
//             });

//             req.on('error', (e) => {
//                 reject(e.message);
//             });

//             req.setHeader('Content-Length', payloadLength);
//             req.write(payloadBuf);
//             req.end();
//         });
//     });
// }

export default HttpUtils