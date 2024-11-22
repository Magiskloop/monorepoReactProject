import UserService from "../services/userServices";
import { Controller, RequestMapping, RequestMethod, } from "../utils/decorator"

// decoratorsBeforeExport: true

export default @Controller("/user") class UserController {

    @RequestMapping(RequestMethod.GET, "/all") async getAllBooks(ctx) {
        ctx.body = {
            data: ['zq', 'qa']
        }
    }


    @RequestMapping(RequestMethod.GET, "/id") async getAllBooksById(ctx) {
        ctx.body = {
            data: 'zq'
        }
    }


    @RequestMapping(RequestMethod.POST, '/login') async loginUser(ctx) {
        const { body } = ctx.request;
        const userService = new UserService();
        ctx.body = await userService.validate(body)
    }
}

// 访问 /book/all,自动定位到 getAllBooks,应该如何做

// router的本质就是函数和地址的对应执行关系
// router.get('/api/book', async (ctx) => {
//     ctx.body = {
//         data: ['one love']
//     }
// })
