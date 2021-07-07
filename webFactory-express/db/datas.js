const mysql = require('mysql');
const dbConfig = require('../db.config');
const utils = require('../public/javascripts/utils');
const { parseResult, closeConnect, connectError, queryError } = utils;
module.exports = {
  updateData: async function (userid, pageid, elementid, data) {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(async err => {
        connectError(err);
        let userExist = await new Promise((resolve, reject) => {
          connection.query(
            'select userid from users where userid=?',
            [userid],
            (err, results, fields) => {
              queryError(err);
              resolve(!!parseResult(results).length);
            }
          );
        });
        if (!userExist) {
          resolve({ message: '用户不存在' });
          return;
        }
        let pageExist = await new Promise((resolve, reject) => {
          connection.query(
            'select pageid from pages where pageid=?',
            [pageid],
            (err, results, fields) => {
              queryError(err);
              resolve(!!parseResult(results).length);
            }
          );
        });
        if (!pageExist) {
          resolve({ message: '页面不存在' });
          return;
        }
        let exist = await new Promise((resolve, reject) => {
          connection.query(
            'select dataid from datas where userid=? and pageid=? and elementid=?',
            [userid, pageid, elementid],
            (err, results, fields) => {
              queryError(err);
              resolve(!!parseResult(results).length);
            }
          );
        });
        if (exist) {
          connection.query(
            'update datas set data=?, update_time=? where userid=? and pageid=? and elementid=?',
            [data, new Date(), userid, pageid, elementid],
            (err, results, fields) => {
              queryError(err);
              closeConnect(connection);
              resolve(parseResult(results));
            }
          );
        } else {
          connection.query(
            'insert into datas set ?',
            {
              userid,
              pageid,
              elementid,
              data,
              create_time: new Date(),
              update_time: new Date()
            },
            (err, results, fields) => {
              queryError(err);
              closeConnect(connection);
              resolve(parseResult(results));
            }
          );
        }
      });
    });
  },
  deleteData: async function (userid, pageid, elementid) {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        connection.query(
          'delete from datas where userid=? and pageid=? and elementid=?',
          [userid, pageid, elementid],
          (err, results, fields) => {
            queryError(err);
            closeConnect(connection);
            resolve(parseResult(results));
          }
        );
      });
    });
  },
  getPageData: async function (userid, pageid) {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        connection.query(
          'select * from datas where userid=? and pageid=?',
          [userid, pageid],
          (err, results, fields) => {
            queryError(err);
            closeConnect(connection);
            resolve(parseResult(results));
          }
        );
      });
    });
  },
  getAllGroup: async function () {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        connection.query(
          'select * from pgroups',
          [],
          (err, results, fields) => {
            queryError(err);
            closeConnect(connection);
            resolve(parseResult(results));
          }
        );
      });
    });
  },
  createGroup: async function (params) {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        connection.query(
          'insert into pgroups set ?',
          {
            userid: params['userid'],
            name: params['name']
          },
          (err, results, fields) => {
            queryError(err);
            resolve(parseResult(results));
          }
        );
      });
    }).then(res => {
      return new Promise((resolve, reject) => {
        connection.query(
          'select * from pgroups',
          [],
          (err, results, fields) => {
            queryError(err);
            closeConnect(connection);
            resolve(parseResult(results));
          }
        );
      });
    });
  }
};
