import axios from 'axios';

const request = (
  method: 'POST' | 'GET',
  url: string,
  body: object,
  config?: object
) => {
  if (method == 'POST') {
    return axios.post(url, body, config).then(res => {
      if (res.status == 200) {
        return res.data;
      }
    });
  } else {
    return axios.get(url, { params: body, ...config }).then(res => {
      if (res.status == 200) {
        return res.data;
      }
    });
  }
};

export default request;
