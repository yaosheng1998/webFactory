const express = require('express');
const router = express.Router();
const userDb = require('../db/users');
const sha1 = require('sha1');
const oss = require('../oss/index');
const formidable = require('express-formidable');
// app.use();

/* GET home page. */
router.post(
  '/background/upload',
  formidable(),
  async function (req, res, next) {
    // const form = new multiparty.Form();
    // form.parse(req, function (err, fields, file) {
    //   console.log(fields);
    //   res.send('数据已接收');
    // });
    // console.log(req.files);
    // console.log(req.fields);
    // console.log('body', req.body);
    const name = req.fields['name'];
    const path = req.fields['path'];
    const extend = req.fields['extend'];
    const url = await oss.uploadImage(
      req.files.file.path,
      `background/${path}.${extend}`
    );
    if (url) {
      res.send({ message: '上传成功', state: 1, url });
    } else {
      res.send({ message: '上传失败', state: -1 });
    }
  }
);

router.get('/background/delete', async function (req, res, next) {
  const query = req.query;
  const result = await oss.deleteImage(
    `/background/${query['userid']}_${query['pageid']}`
  );
  if (result) {
    res.send({ message: '删除成功', state: 1 });
  } else {
    res.send({ message: '删除失败', state: -1 });
  }
});

router.post('/element/upload', formidable(), async function (req, res, next) {
  const name = req.fields['name'];
  const path = req.fields['path'];
  const extend = req.fields['extend'];
  const url = await oss.uploadImage(
    req.files.file.path,
    `avatar/${path}.${extend}`
  );
  if (url) {
    res.send({ message: '上传成功', state: 1, url });
  } else {
    res.send({ message: '上传失败', state: -1 });
  }
});

router.post('/avatar/upload', formidable(), async function (req, res, next) {
  const name = req.fields['name'];
  const path = req.fields['path'];
  const extend = req.fields['extend'];
  await oss.deleteImage2(`/avatar/${path}`);
  const url = await oss.uploadImage(req.files.file.path, `avatar/${path}`);
  if (url) {
    res.send({ message: '上传成功', state: 1, url });
  } else {
    res.send({ message: '上传失败', state: -1 });
  }
});

router.get('/element/delete', async function (req, res, next) {
  const query = req.query;
  const result = await oss.deleteImage(
    `/element/${query['userid']}_${query['pageid']}_${query['elementid']}`
  );
  if (result) {
    res.send({ message: '删除成功', state: 1 });
  } else {
    res.send({ message: '删除失败', state: -1 });
  }
});

module.exports = router;
