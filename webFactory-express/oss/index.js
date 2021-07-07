const OSS = require('ali-oss');

const fs = require('fs');

const client = new OSS({
  region: 'oss-cn-shanghai',
  accessKeyId: 'LTAI5tHrkfVnmYiRcWQYuY59',
  accessKeySecret: 'IJM4uWa21a4PSr60qmQhOzPyXXgnK8',
  bucket: 'ys-webfactory-shanghai'
});

module.exports = {
  getAvatar: async function () {
    try {
      let result = await client.generateObjectUrl('/avatar/touxiang.jpg');
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  },
  uploadImage: async function (filePath, uploadPath) {
    try {
      const buffer = fs.readFileSync(filePath);
      let result = await client.put(uploadPath, buffer);
      return result.url;
    } catch (e) {
      return false;
    }
  },
  deleteImage: async function (name) {
    try {
      let result = await client.delete(`${name}.jpg`);
      await client.delete(`${name}.png`);
      return result;
    } catch (e) {
      return false;
    }
  },
  deleteImage2: async function (name) {
    try {
      let result = await client.delete(`${name}`);
      return result;
    } catch (e) {
      return false;
    }
  },
  test: async function () {
    try {
      let result = await client.generateObjectUrl('/avatar/touxiang.jpg');
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }
};
