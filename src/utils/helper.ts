export const enginenocopy = (val: any) => {
  return val.replace(/^(.{7})(?:\w+)(.{4})$/, '$1****$2');
};

/**
 * @desc 判断是否是对象
 * @param {Object} obj
 * @return {boolean}
 */
export const isObject = (obj: any) =>
  Object.prototype.toString.call(obj) === '[object Object]';

// from 表单转换
export const changeForm = (obj: any) => {
  const formData = new FormData();
  Object.keys(obj).forEach((item) => {
    formData.append(item, obj[item]);
  });
  return formData;
};

/**
 * @author: Blurain
 * @description: 生成随机数
 * @param {string} chars
 * @param {number} n
 * @return {*}
 */
const generateMixed = (chars: string[], n: number) => {
  let res = '';
  for (let i = 0; i < n; i += 1) {
    const id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }
  return res;
};

/**
 * @author: Blurain
 * @description: 生成随机数
 * @param {*}
 * @return {*}
 */
export const randomData = () => {
  const chars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  const data = generateMixed(chars, 10);
  return data;
};

// 获取cookie
export const getCookie = (cname: string) => {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(name) !== -1) return c.substring(name.length, c.length);
  }
  return '';
};


