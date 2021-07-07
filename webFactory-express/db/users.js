const mysql = require('mysql');
const dbConfig = require('../db.config');
const utils = require('../public/javascripts/utils');
const { parseResult, closeConnect, connectError, queryError } = utils;
module.exports = {
  getAllUsers: async function () {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        connection.query('select * from users', [], (err, results, fields) => {
          queryError(err);
          closeConnect(connection);
          resolve(parseResult(results));
        });
      });
    });
  },
  getUsersByParmas: async function (params) {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        let sql = 'select * from users where ';
        let sqlParams = [];
        for (prop in params) {
          sql += `${prop}=? `;
          sqlParams.push(params[prop]);
        }
        connection.query(sql, sqlParams, (err, results, fields) => {
          queryError(err);
          closeConnect(connection);
          resolve(parseResult(results));
        });
      });
    });
  },
  setUsersById: async function (id, params) {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        let sql = 'update users set ';
        let sqlParams = [];
        for (prop in params) {
          sql += `${prop}=? `;
          sqlParams.push(params[prop]);
        }
        sql += `where userid=${id}`;
        connection.query(sql, sqlParams, (err, results, fields) => {
          queryError(err);
          closeConnect(connection);
          resolve(parseResult(results));
        });
      });
    });
  },
  addUser: async function (username, password) {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(async err => {
        let exist = false;
        connectError(err);
        exist = await new Promise((resolve, reject) => {
          connection.query(
            'select userid from users where username=?',
            [username],
            (err, results, fields) => {
              queryError(err);
              resolve(!!parseResult(results).length);
            }
          );
        });
        if (exist) {
          resolve(exist);
          closeConnect(connection);
        } else {
          connection.query(
            'insert into users set ? ',
            {
              username,
              password,
              avatar:
                'https://ys-webfactory-shanghai.oss-cn-shanghai.aliyuncs.com/avatar/touxiang.jpg',
              skin: 0,
              email: '',
              language: 'zh',
              admin: 0
            },
            (err, results, fields) => {
              queryError(err);
              closeConnect(connection);
              resolve(false);
            }
          );
        }
      });
    });
  },
  updateBirthday: async function (birthday, userid) {
    console.log(birthday, userid);
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        let sql = 'update users set birthday=? where userid=?';
        let sqlParams = [birthday, userid];
        connection.query(sql, sqlParams, (err, results, fields) => {
          queryError(err);
          closeConnect(connection);
          resolve(parseResult(results));
        });
      });
    });
  },
  updateEmail: async function (email, userid) {
    console.log(email, userid);
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        let sql = 'update users set email=? where userid=?';
        let sqlParams = [email, userid];
        connection.query(sql, sqlParams, (err, results, fields) => {
          queryError(err);
          closeConnect(connection);
          resolve(parseResult(results));
        });
      });
    });
  },
  updateAvatar: async function (avatar, userid) {
    const connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
      connection.connect(err => {
        connectError(err);
        let sql = 'update users set avatar=? where userid=?';
        let sqlParams = [avatar, userid];
        connection.query(sql, sqlParams, (err, results, fields) => {
          queryError(err);
          closeConnect(connection);
          resolve(parseResult(results));
        });
      });
    });
  },
  query: function (sql, params, callback) {
    //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
    const connection = mysql.createConnection(dbConfig);
    connection.connect(function (err) {
      if (err) {
        console.log('数据库链接失败');
        throw err;
      }
      //开始数据操作
      connection.query(sql, params, function (err, results, fields) {
        if (err) {
          console.log('数据操作失败');
          throw err;
        }
        //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
        callback &&
          callback(
            JSON.parse(JSON.stringify(results)),
            JSON.parse(JSON.stringify(fields))
          );
        //results作为数据操作后的结果，fields作为数据库连接的一些字段，大家可以打印到控制台观察一下
        //停止链接数据库，必须再查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
        connection.end(function (err) {
          if (err) {
            console.log('关闭数据库连接失败！');
            throw err;
          }
        });
      });
    });
  }
};
