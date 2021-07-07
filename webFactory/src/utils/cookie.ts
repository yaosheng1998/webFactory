export const getCookie = () => {
  const cookie = document.cookie;
  const cookieArr = cookie.split(';');
  let result = {};
  cookieArr.forEach((item: string) => {
    const slice1 = item.slice(0, item.indexOf('=')).trim();
    const slice2 = item.slice(item.indexOf('=') + 1).trim();
    result[slice1] = slice2;
  });
  return result;
};

export const deleteCookie = (name: string) => {
  const date = new Date();
  date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie = name + '=' + '' + '; ' + expires;
};
