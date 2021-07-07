const express = require('express');
const router = express.Router();
const datasDb = require('../db/datas');
const pagesDb = require('../db/pages');

router.post('/updateData', async function (req, res, next) {
  const body = req.body;
  console.log(body);
  const result = await datasDb.updateData(
    body['userid'],
    body['pageid'],
    body['elementid'],
    JSON.stringify(body['data'])
  );
  console.log('result', result);
  if (result) {
    res.send({ message: '数据修改成功', state: 1 });
  } else {
    res.send({ message: '数据修改失败', state: -1 });
  }
});

router.post('/deleteData', async function (req, res, next) {
  const body = req.body;
  console.log(typeof body['elementid'], body['elementid'][0]);
  let result = {};
  for (let i = 0; i < body['elementid'].length; i++) {
    result = await datasDb.deleteData(
      body['userid'],
      body['pageid'],
      body['elementid'][i]
    );
  }
  // const result =
  // console.log('result', result);
  if (result) {
    res.send({ message: '数据删除成功', state: 1 });
  } else {
    res.send({ message: '数据删除失败', state: -1 });
  }
});

router.get('/getPageData', async function (req, res, next) {
  const query = req.query;
  const result = await datasDb.getPageData(query['userid'], query['pageid']);
  let data = {};
  result.forEach(item => {
    data[item.elementid] = JSON.parse(item.data);
  });
  console.log('result', result);
  if (!result['message']) {
    res.send({ message: '获取成功', state: 1, data });
  } else {
    res.send({ message: '获取失败', state: -1 });
  }
});

router.get('/getPageElementData', async function (req, res, next) {
  const query = req.query;
  const allPageData = await pagesDb.getAllPageDataByUserid(query['userid']);
  const element = JSON.parse(
    allPageData.filter(item => {
      return item.pageid == parseInt(query['pageid']);
    })[0].controls
  );
  const result = await datasDb.getPageData(query['userid'], query['pageid']);
  const data = result.map(item => {
    const _element = element.filter(_item => {
      return _item.id == item.elementid;
    });
    return {
      elementid: item['elementid'],
      elementName: _element.length ? _element[0].name : '错误',
      data: JSON.parse(item.data),
      update_time: item['update_time'],
      create_time: item['create_time']
    };
  });
  if (!result['message']) {
    res.send({ message: '获取成功', state: 1, data });
  } else {
    res.send({ message: '获取失败', state: -1 });
  }
});

module.exports = router;
