module.exports = {
  parseResult: function (result) {
    return JSON.parse(JSON.stringify(result));
  },
  queryError: function (error) {
    if (error) {
      console.log('mysql query error');
      throw error;
    }
  },
  connectError: function (error) {
    if (error) {
      console.log('mysql connect error');
      throw error;
    }
  },
  closeConnect: function (connection) {
    connection.end(function (error) {
      if (error) {
        console.log('close mysql error');
        throw error;
      }
    });
  }
};
