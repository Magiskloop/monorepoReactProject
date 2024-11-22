import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import Rs from './controllers/index'
import { controllers } from './utils/decorator'
import { jwtVerify } from './utils/jwt';

const app = new Koa();

const router = new Router();

app.use(bodyParser());

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Headers', '*')
    ctx.set('Access-Control-Allow-Method', '*')
    ctx.set('Content-Type', 'application/json;charset=utf-8')
    if (ctx.request.method.toLowerCase() === 'options') {
        ctx.state = 200;
    }
    else {
        await next()
    }
})

app.use(jwtVerify([
    '/use/login',
    '/user/register'
]))

// router.get('/api/test', async(ctx)=>{
//     ctx.body = {
//         data:['zq']
//     }
// })

controllers.forEach((item) => {
    let { method, path, handler, constructor } = item
    const { prefix } = constructor;
    if (prefix) {
        path = `${prefix}${path}`;
    }
    router[method](path, handler)
})
// router.get('/api/test', async (ctx) => {
//     ctx.body = {
//         data: ['zq']
//     }
// })
// router.get('/api/book', async (ctx) => {
//     ctx.body = {
//         data: ['one love']
//     }
// })

app.use(router.routes());

app.listen(3008, () => {
    console.log('3008 is listening....')
})