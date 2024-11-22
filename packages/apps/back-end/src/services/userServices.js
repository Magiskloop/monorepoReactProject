import { signature } from "../utils/jwt";


export default class UserService {
    async validate({ username, password }) {
        if (username && password) {
            // with MySql校验
            if (username === 'zq') {
                if (password === '123456')
                // 颁发口令
                {
                    const token = signature({ username });
                    return {
                        code: 200,
                        msg: '登陆成功',
                        status: 'success',
                        data: { token }
                    }
                }

                return {
                    code: 200,
                    status: 'failed',
                    msg: '密码错误',
                    data: void 0
                }
            }
            return {
                code: 200,
                status: 'failed',
                msg: '该账号未注册',
                data: void 0
            }

        }
        return {
            code: 200,
            status: 'failed',
            msg: '账号或密码不可为空',
            data: void 0
        }
    }
}