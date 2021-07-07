const express = require('express');
const router = express.Router();
const pagesDb = require('../db/pages');
const groupsDb = require('../db/groups');
const querystring = require('querystring');
const sha1 = require('sha1');
const { route } = require('.');

/* GET users listing. */
router.get('/getPageData', async function (req, res, next) {
  const query = req.query;
  const allPageData = await pagesDb.getAllPageDataByUserid(query['userid']);
  const groups = await groupsDb.getAllGroup();
  const page = allPageData.map(item => {
    return {
      pageid: item['pageid'],
      name: item['name'],
      sourceid: item['datasourceid'],
      groupid: item['groupid'],
      visit_link: item['visit_link'],
      create: item['create_time'],
      update: item['update_time'],
      delete: item['delete_time'],
      publish: item['publish'],
      visitKey: item['encode_key'],
      description: item['descript']
    };
  });
  console.log(groups);
  const group = groups.filter(item => {
    return item.userid == parseInt(query['userid']);
  });
  res.send({ page, groups: group });
});

router.get('/getPageContent', async function (req, res, next) {
  const query = req.query;
  const allPageData = await pagesDb.getAllPageDataByUserid(query['userid']);
  const pageData = allPageData.filter(item => {
    return item.pageid == parseInt(query['pageid']);
  })[0];
  res.send({ data: pageData.controls });
});

router.post('/savePageContent', async function (req, res, next) {
  const body = req.body;
  const result = await pagesDb.savePageContent(
    body['userid'],
    body['pageid'],
    body['content']
  );
  if (result) {
    res.send({ message: '保存成功', state: 1 });
  } else {
    res.send({ message: '保存失败', state: -1 });
  }
});

router.post('/createPage', async function (req, res, next) {
  const body = req.body;
  const result = await pagesDb.createPage({
    userid: body['userid'],
    name: body['name'],
    encode: body['encode'],
    encode_key:
      body['encode'] == '0'
        ? ''
        : sha1(new Date()).slice(0, 9).toLocaleUpperCase(),
    groupid: body['groupid'],
    descript: body['descript']
  });
  if (result) {
    res.send({ message: '新建成功', state: 1, pageid: result['insertId'] });
  } else {
    res.send({ message: '新建失败', state: -1 });
  }
});

router.post('/createGroup', async function (req, res, next) {
  const body = req.body;
  let result = await groupsDb.createGroup({
    userid: body['userid'],
    name: body['name']
  });
  result = result.filter(item => {
    return item.userid == body['userid'];
  });
  if (result) {
    res.send({ message: '添加成功', state: 1, groups: result });
  } else {
    res.send({ message: '添加失败', state: -1 });
  }
});

router.get('/deleteGroup', async function (req, res, next) {
  const query = req.query;
  const result = await groupsDb.deleteGroup(query['userid'], query['groupid']);
  if (result) {
    res.send({ message: '删除成功', state: 1 });
  } else {
    res.send({ message: '删除失败', state: -1 });
  }
});

router.get('/deletePage', async function (req, res, next) {
  const query = req.query;
  const result = await pagesDb.deletePage(query['userid'], query['pageid']);
  if (result) {
    res.send({ message: '删除成功', state: 1 });
  } else {
    res.send({ message: '删除失败', state: -1 });
  }
});

router.get('/realDeletePage', async function (req, res, next) {
  const query = req.query;
  const result = await pagesDb.deletePageReal(query['userid'], query['pageid']);
  if (result) {
    res.send({ message: '彻底删除成功', state: 1 });
  } else {
    res.send({ message: '彻底删除失败', state: -1 });
  }
});

router.get('/recoverPage', async function (req, res, next) {
  const query = req.query;
  const result = await pagesDb.recoverPage(query['userid'], query['pageid']);
  if (result) {
    res.send({ message: '恢复成功', state: 1 });
  } else {
    res.send({ message: '恢复失败', state: -1 });
  }
});

router.get('/publishPage', async function (req, res, next) {
  const query = req.query;
  const result = await pagesDb.publishPage(
    query['userid'],
    query['pageid'],
    query['publish'] == 'true' ? 1 : 0
  );
  if (result) {
    res.send({ message: '发布修改成功', state: 1 });
  } else {
    res.send({ message: '发布修改失败', state: -1 });
  }
});

module.exports = router;

[
  {
    id: -1,
    type: 'Screen',
    name: '背景屏幕',
    backgroundColor: '#FFFFFF',
    height: 1080,
    width: 1920,
    left: 0,
    top: 0,
    isLock: false,
    layerOpen: true,
    selected: true,
    colorGradient: 'none',
    endBackgroundColor: '#FFFFFF',
    image: {
      left: 0,
      top: 0,
      state: 'none'
    }
  },
  {
    id: 0,
    type: 'Text',
    name: '图层1',
    height: 200,
    width: 200,
    left: 10,
    top: 30,
    isLock: false,
    layerOpen: true,
    selected: false,
    value: 'Insert Text Content',
    editing: false
  },
  {
    id: 1,
    type: 'Text',
    name: '图层??',
    height: 100,
    width: 100,
    left: 0,
    top: 0,
    isLock: false,
    layerOpen: true,
    selected: false,
    value: 'Insert Text Content',
    editing: false
  },
  {
    id: 2,
    type: 'Chart',
    name: '基础柱状图',
    height: 200,
    width: 400,
    left: 130,
    top: 130,
    isLock: false,
    layerOpen: true,
    selected: false,
    value: 'Insert Text Content',
    editing: false,
    options: {
      title: {
        show: true,
        text: '基础柱状图',
        textStyle: {
          fontSize: 18
        }
      },
      xAxis: {
        type: 'category',
        data: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        axisLabel: {
          textStyle: {
            fontSize: 12
          }
        }
      },
      grid: {
        top: 40,
        left: 30,
        right: 0,
        bottom: 30
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          textStyle: {
            fontSize: 12
          }
        }
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130, 60, 90, 110],
          type: 'bar'
        }
      ]
    },
    title: {
      show: true,
      content: '基础柱状图',
      position: 'left',
      fontSize: 18,
      fontWeight: 600,
      fontColor: '#ccc'
    },
    grid: {
      left: 30,
      top: 40,
      right: 0,
      bottom: 30
    },
    backgroundColor: '#fff'
  }
];
[
  {
    id: -1,
    type: 'Screen',
    name: '背景屏幕',
    backgroundColor: '#FFFFFF',
    height: 1080,
    width: 1920,
    left: 0,
    top: 0,
    isLock: false,
    layerOpen: true,
    selected: true,
    colorGradient: 'none',
    endBackgroundColor: '#FFFFFF',
    image: {
      left: 0,
      top: 0,
      state: 'none'
    }
  },
  {
    id: 0,
    type: 'Text',
    name: '图层1',
    height: 200,
    width: 200,
    left: 10,
    top: 30,
    isLock: false,
    layerOpen: true,
    selected: false,
    value: 'Insert Text Content',
    editing: false
  },
  {
    id: 1,
    type: 'Text',
    name: '图层??',
    height: 100,
    width: 100,
    left: 0,
    top: 0,
    isLock: false,
    layerOpen: true,
    selected: false,
    value: 'Insert Text Content',
    editing: false
  },
  {
    id: 2,
    type: 'Chart',
    name: '基础柱状图',
    height: 200,
    width: 400,
    left: 130,
    top: 130,
    isLock: false,
    layerOpen: true,
    selected: false,
    value: 'Insert Text Content',
    editing: false,
    options: {
      title: {
        show: true,
        text: '基础柱状图',
        textStyle: {
          fontSize: 18
        }
      },
      xAxis: {
        type: 'category',
        data: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        axisLabel: {
          textStyle: {
            fontSize: 12
          }
        }
      },
      grid: {
        top: 40,
        left: 30,
        right: 0,
        bottom: 30
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          textStyle: {
            fontSize: 12
          }
        }
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130, 60, 90, 110],
          type: 'bar'
        }
      ]
    },
    title: {
      show: true,
      content: '基础柱状图',
      position: 'left',
      fontSize: 18,
      fontWeight: 600,
      fontColor: '#ccc'
    },
    grid: {
      left: 30,
      top: 40,
      right: 0,
      bottom: 30
    },
    backgroundColor: '#fff'
  }
];
