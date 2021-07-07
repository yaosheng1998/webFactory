const mysql = require('mysql');
const dbConfig = require('../db.config');
const utils = require('../public/javascripts/utils');
const { parseResult, closeConnect, connectError, queryError } = utils;
module.exports = {
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
  },
  deleteGroup: async function (userid, groupid) {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        connection.query(
          'delete from pgroups where userid=? and groupid=?',
          [userid, groupid],
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
