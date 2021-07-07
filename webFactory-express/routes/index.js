const express = require('express');
const router = express.Router();
const userDb = require('../db/users');
const sha1 = require('sha1');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * 注册接口
 * POST
 * {
 *    usetname: 'xxxx',
 *    password: 'xxxx',
 * }
 *
 */
router.post('/regist', async function (req, res, next) {
  const body = req.body;
  if (!body['username']) {
    res.send({ message: '用户名为空', state: -1 });
  } else if (!body['password']) {
    res.send({ message: '密码为空', state: -2 });
  } else {
    const result = await userDb.addUser(body['username'], body['password']);
    if (result) {
      res.send({ message: '用户名已经存在', state: -3 });
    } else {
      res.send({ message: '注册成功', state: 1 });
    }
  }
});
router.get('/login', async function (req, res, next) {
  const query = req.query;
  if (!query['username']) {
    res.send({ message: '用户名为空', state: -1 });
    return;
  }
  let result = await userDb.getUsersByParmas({
    username: query['username']
  });
  if (!result.length) {
    res.send({ message: '用户名不存在', state: -2 });
    return;
  }
  result = result[0];
  console.log(query['password']);
  if (result['password'] == query['password']) {
    var expires = new Date(new Date().getTime() + 3600 * 1000 * 24 * 7);
    userDb.setUsersById(result['userid'], { expiration: expires });
    res.cookie(
      'token',
      sha1(result['userid'] + Math.floor(expires.getTime() / 100000)),
      {
        expires
      }
    );
    console.log(Math.floor(expires.getTime() / 100000));
    res.send({ message: '登录成功', state: 1, user: result });
  } else {
    res.send({ message: '密码错误', state: -3 });
  }
});
router.get('/token', async function (req, res, next) {
  const query = req.query;
  let result = await userDb.getAllUsers();
  let flag = false;
  for (let i = 0; i < result.length; i++) {
    const expiration = new Date(result[i]['expiration']);
    const _token = sha1(
      result[i]['userid'] + Math.floor(expiration.getTime() / 100000)
    );
    console.log(Math.floor(expiration.getTime() / 100000));
    if (_token == query['token'] && +new Date() <= expiration.getTime()) {
      flag = true;
      res.send({ message: '登陆成功', state: 1, user: result[i] });
      return;
    }
  }
  if (!flag) {
    res.send({ state: -1 });
  }
});
router.post('/updateBirthday', async function (req, res, next) {
  const body = req.body;
  const result = await userDb.updateBirthday(
    new Date(body['birthday']),
    body['userid']
  );
  if (result) {
    res.send({ message: '修改出生日期成功', state: 1 });
  } else {
    res.send({ message: '修改出生日期失败', state: -1 });
  }
});
router.post('/updateEmail', async function (req, res, next) {
  const body = req.body;
  const result = await userDb.updateEmail(body['email'], body['userid']);
  if (result) {
    res.send({ message: '修改邮箱成功', state: 1 });
  } else {
    res.send({ message: '修改邮箱失败', state: -1 });
  }
});
router.post('/updateAvatar', async function (req, res, next) {
  console.log('????');
  const body = req.body;
  const result = await userDb.updateAvatar(body['avatar'], body['userid']);
  if (result) {
    res.send({ message: '修改头像成功', state: 1 });
  } else {
    res.send({ message: '修改头像失败', state: -1 });
  }
});

module.exports = router;
