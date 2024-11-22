import { Controller, RequestMapping, RequestMethod, } from "../utils/decorator"

// decoratorsBeforeExport: true
@Controller("/book")
export default class BookController {

    @RequestMapping(RequestMethod.GET, "/all")
    async getAllBooks(ctx) {
        ctx.body = {
            data: ['one love']
        }
    }
}

// 访问 /book/all,自动定位到 getAllBooks,应该如何做

// router的本质就是函数和地址的对应执行关系
// router.get('/api/book', async (ctx) => {
//     ctx.body = {
//         data: ['one love']
//     }
// })
