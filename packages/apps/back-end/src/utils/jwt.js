import jwt from 'jsonwebtoken'

const SALT = 'zqisfkingcrazy.vmetoken'

const verify = async (token) => {
    return new Promise((resolve) => {
        if (token) {
            jwt.verify(token, SALT, (err, data) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        resolve({
                            status: 'failed',
                            error: 'token 已过期'
                        })
                    }
                    else {
                        resolve({
                            status: 'failed',
                            error: 'token 非法'
                        })
                    }
                }
                else {
                    resolve({
                        status: 'success',
                        data,
                    })
                }
            })
        } else {
            resolve({
                status: 'failed',
                data: "token is null"
            })
        }
    })
}

export const signature = (user) => jwt.sign(user, SALT, {
    expiresIn: '10h'
});

export const jwtVerify = (whiteList) => async (ctx, next) => {
    if (whiteList.includes(ctx.path)) {
        next(ctx)
    }
    else {
        // 鉴权
        let token;
        try {
            token = ctx.request.headers?.authorization?.split('Bearer ')[1];

        } catch (err) {

        }

        const res = await verify(token)

        if (res.status === 'success') {
            next(ctx)
        }
        else {
            ctx.body = {
                ...res,
                code: 401
            }
        }
    }
}