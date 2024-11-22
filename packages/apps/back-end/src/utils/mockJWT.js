const crypto = require('crypto')

function sign(payload, salt) {
    let header = {
        alg: 'HS256', typ: 'JWT'
    }
    const tokenArr = []
    // 存header和payload
    tokenArr.push(base64UrlEncode(JSON.stringify(header)))
    tokenArr.push(base64UrlEncode(JSON.stringify(payload)))

    // 加密
    const signature = encryption(tokenArr.join('.'), salt)

    return [...tokenArr, signature].join('.')

}

function base64UrlEncode(str) {
    return Buffer.from(str).toString('base64')
}

function encryption(value, salt) {
    return crypto.createHmac('SHA256', salt).update(value).digest('base64')
}

// 解密
function verify(token, salt) {
    var [h, p, s] = token.split('.');
    const signature = encryption([h, p].join('.'), salt)
    return signature === s
}
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InpxIn0=.a764TIyJQSsJjK/hozDrv/b2Vl/GaM0RTgXhRlC4Nf4=
console.log(sign({ username: 'zq' }, 'course'))
console.log(verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InpxIn0=.a764TIyJQSsJjK/hozDrv/b2Vl/GaM0RTgXhRlC4Nf4=', 'course'))
