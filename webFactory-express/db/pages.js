const mysql = require('mysql');
const dbConfig = require('../db.config');
const utils = require('../public/javascripts/utils');

const { parseResult, closeConnect, connectError, queryError } = utils;
module.exports = {
  getAllPageDataByUserid: async function (userid) {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        connection.query(
          'select * from pages where userid=?',
          [userid],
          (err, results, fields) => {
            queryError(err);
            closeConnect(connection);
            resolve(parseResult(results));
          }
        );
      });
    });
  },
  savePageContent: async function (userid, pageid, content) {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        let sql =
          'update pages set controls=?,update_time=? where userid=? and pageid=?';
        let sqlParams = [content, new Date(), userid, pageid];
        connection.query(sql, sqlParams, (err, results, fields) => {
          queryError(err);
          closeConnect(connection);
          resolve(parseResult(results));
        });
      });
    });
  },
  createPage: async function (params) {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        const content = {
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
        };
        const date = new Date();
        let sql = 'insert into pages set ? ';
        let sqlParams = {
          userid: params['userid'],
          name: params['name'],
          controls: `[${JSON.stringify(content)}]`,
          visit_link: '',
          encode: params['encode'],
          encode_key: params['encode_key'],
          groupid: params['groupid'],
          publish: 0,
          datasourceid: 0,
          descript: params['descript'],
          create_time: date,
          update_time: date
        };
        connection.query(sql, sqlParams, (err, results, fields) => {
          queryError(err);
          closeConnect(connection);
          resolve(parseResult(results));
        });
      });
    });
  },
  deletePage: async function (userid, pageid) {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        let sql = 'update pages set delete_time=? where userid=? and pageid=?';
        let sqlParams = [new Date(), userid, pageid];
        connection.query(sql, sqlParams, (err, results, fields) => {
          queryError(err);
          closeConnect(connection);
          resolve(parseResult(results));
        });
      });
    });
  },
  deletePageReal: async function (userid, pageid) {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        let sql = 'delete from pages where userid=? and pageid=?';
        let sqlParams = [userid, pageid];
        connection.query(sql, sqlParams, (err, results, fields) => {
          queryError(err);
          closeConnect(connection);
          resolve(parseResult(results));
        });
      });
    });
  },
  recoverPage: async function (userid, pageid) {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        let sql =
          'update pages set delete_time=null where userid=? and pageid=?';
        let sqlParams = [userid, pageid];
        connection.query(sql, sqlParams, (err, results, fields) => {
          queryError(err);
          closeConnect(connection);
          resolve(parseResult(results));
        });
      });
    });
  },
  publishPage: async function (userid, pageid, publish) {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        let sql = 'update pages set publish=? where userid=? and pageid=?';
        let sqlParams = [publish, userid, pageid];
        connection.query(sql, sqlParams, (err, results, fields) => {
          queryError(err);
          closeConnect(connection);
          resolve(parseResult(results));
        });
      });
    });
  }
};
