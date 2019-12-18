const path = require('path');

const Koa = require('koa');
const nanoid = require('nanoid');
const serve = require('koa-static');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const send = require('koa-send');

const payu = require('payu-sdk');

const app = new Koa();
const router = new Router();

const STATIC_PATH = path.resolve(__dirname + '../../../bolt-example-client');

app
  .use(bodyParser())
  .use(router.middleware())
  .use(router.allowedMethods())
  .use(serve(STATIC_PATH));


router.get('/', async ctx => {
  console.log(path.resolve(__dirname + '../../../'))
  await send(ctx, 'index.html', { root: STATIC_PATH })
})

router.post('/verify-hash', async (ctx) => {
  const { amount, txnid, productinfo, firstname, email, hash, status } = ctx.request.body;
  const isValidHash = payu.validateHash(hash, {
    key: process.env.PAYU_KEY || '',
    salt: process.env.PAYU_SALT || '', // should be on server side only
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    status
  });
  ctx.body = { isValidHash };
});


router.post('/generate-hash', async (ctx) => {
  const { amount, productinfo, firstname, email } = ctx.request.body;
  const txnid = nanoid();
  const hash = payu.generateHash({
    key: process.env.PAYU_KEY || '',
    salt: process.env.PAYU_SALT || '', // should be on server side only
    txnid, 
    amount,
    productinfo,
    firstname,
    email,
  });
  ctx.body = { hash, txnid };
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`server running on port ${PORT}`));

module.exports = app;
