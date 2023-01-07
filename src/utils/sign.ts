import sha256 from 'crypto-js/sha256';
import hmacSHA256 from 'crypto-js/hmac-sha256';

// 生成签名字符串
function stringToSign(query: Record<string, any>, method: string, mode: string) {
  let sha256Str = '';
  let url = '';
  const headersStr = '';
  const map = {};
  let arr = [];
  let bodyStr = '';
 
  if (method === 'GET') {
    toJsonObj(query, arr, map);
  }
  if (this.data && method === 'POST') {
    if (mode === 'application/json') {
      bodyStr = JSON.stringify(this.data);
    }
  }
  console.log(this.data)
  sha256Str = sha256(bodyStr);
  arr = arr.sort();
  arr.forEach(function (item) {
    url += `${item}=${map[item]}&`;
  });

  if (url.length > 0) {
    url = url.substring(0, url.length - 1);
    url = `${this.url}?${url}`;
  } else {
    url = this.url;
  }

  const hash: any = {};
  hash.signUrl = `${method}\n${sha256Str}\n${headersStr}\n${url}`;
  hash.url = url;

  return hash;
}
function toJsonObj(params: any, arr: any[], map: { [x: string]: any }) {
  const hash = map;
  const jsonBodyStr = JSON.stringify(params);
  const jsonBody = JSON.parse(jsonBodyStr);
  Object.entries(jsonBody).forEach((item: any[]) => {
    arr.push(item[0]);
    hash[item[0]] = item[1];
  });
}
// 业务验签计算
function calcSign(clientId, accessToken, timestamp, nonce, signStr, secret) {
  const str = clientId + accessToken + timestamp + nonce + signStr;
  const hash = hmacSHA256(str, secret);
  const hashInBase64 = hash.toString();
  const signUp = hashInBase64.toUpperCase();
  return signUp;
}

export const getSign = function () {
  const timestamp = this.headers.t;
  const clientId = this.headers.client_id;
  const secret = '98b580514cd84809963a6c3903bf5ed5';
  const accessToken = '88d5c530f70debe0c5d0370a24c7c7e2';
  const nonce = '';
  const httpMethod = this.method.toUpperCase();
  const query = this.params;
  const mode = this.headers['Content-Type'];
  const signMap = stringToSign.call(this, query, httpMethod, mode);
  // const urlStr = signMap.url;
  const signStr = signMap.signUrl;
  const sign = calcSign(clientId, accessToken, timestamp, nonce, signStr, secret);
  return sign;
};
