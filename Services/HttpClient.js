
import axios from 'axios'
var KJUR = require('jsrsasign');
const key = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvbEDWX/5onumA\ndJC8g7Bk+Vb964PzQaapFUEJOISryRUyhCo0uLgsew7JIbO+z9KTkauIEm2Hxv9w\n+vA+R1kh2oqMGO1FsCuh9DRCJJyVzOskgflPkganAFohFnLLWyH0UX3NGVkxi3SJ\nufTmp4v2c0l71av128JBUlAH8tWVDFLgLIpXI+arjeb+SV5KB0drLNK73Dk/br+U\ndjXULYSg47VFJSRU/JJm3GpERsaYnkUCONLpo5Ucx4rIXtLukoIU/WtjyaNjgX7d\nG62XzP8YLBfP/wBrDwj05M9rPgEcNNZj18htFVYkaAvtqmTOtZct2qh1WZpZXEPS\nOmBdHeqpAgMBAAECggEAE2zATTy59inKn2/I6ycF7Fhz2pAuv0wAwW5aEkRQ5JjS\noRJjfg0KT9qci4cQ2Us3/SE/RkUMHeHaPU98NNk/tHD3sIW+GF5mpntdIgnd0PSt\nARDnY3k/BVUTpeBPe9cujlhLvt9UshjIIcwWo0fgRr0DYRQLA6F/BC6yL/8iyWsx\nyzwwJouDYZtzTgmgyTSaQwjqPTCTqjEJoX2JMkfqgUSTiyEUM7ZPxQKYg/XqZ47Y\nPTRNY6xdT6+LjGTdzb2Tt8W9aRX8xBvVoYPVqO+Fuoyn5ilBiLvvNYshv9EuyImW\nJ9Y9ITDqcQez/OUmtCZXHM6KlUQ3zn73rgcYDJMogQKBgQDooLbB+kRHN5HwU062\n5P+gG3aOS5RnpduHHE13ZJEsRZwXE9vWkWi4Y+UB0i+HS+ykwJLVNoukfrlb8zMY\ndTH0UTiDPW3RcDp5ew3PJcOGB2btYpwL4hOB+3abfV0W9oQlRk5Q1H+9ngpJQKef\nfe+SdFZmniD0p5wNom+fd9LmOQKBgQDBDDRL2M+cKwnvoXT2hnVGmLpHd/ouR2RP\nNDYN2W+EO9iBGZgQY/73/C41c6m8npi6ZPnkcU/adk3ZLxxXSoROyMMi9ihAXJda\ntDtDag7hzFscAXiOF9W/k29JPOZcfM9Af6Bc12jp6L8oWzNBKPHtnQ+Vsv/il19E\nKAEBdoSn8QKBgQCxJenmj+G85flxrM8NgheT4jYHKFEMGQayvf/UArZ2o0+5Vzsb\nC8JWYGP9XgUpn8zGrYtjaFUw3/vhpLLtVhnDdrJ1ZqshSbiN2AJtE9HwV+Sus2An\nwHKgklEBGZdxLCr3g7GR5jCcwiQNInpDf5CX05YUMSjhhl3VGDSumH33KQKBgCBZ\nUTIchL2goKudHKJq6aAI2746Jpw2rmJvV1d+xicceC06ArdMal9XzM58MUdANEuX\nvCBBtKXhCS6JrHAcNouVLM3g/eG7Ikm6xeuIDDJeMi5BONhmuhS+OfnF0LxS1c/z\nEwY7uoLn05CJp88Vc2Tj2sa1Fhf8UaR0J6b9G0GhAoGASrMG6ZyOCRMV+2lBLqvP\n5OdfQK4/m6RIXXtK9nnYXaCi2/TvAm8BieXcLY1NneAl/uh1bmIcw6wUULLx1DKc\noAl4DVhmPa9DtGBsPCMOJzsvYM5bAuUxwrAtGqnmSXQF9dtVQ4TYkuE1Q7qUSTGr\n88O54CUsPpA0CObiPSzE/K4=\n-----END PRIVATE KEY-----\n";
var DIALOG_FLOW_TOKEN = "ya29.c.KpYB0wfPbkdyYWZOJvZsyVQa1LjWjwJaXY8iKrH8kBlbiQ-6R9ZBDVCZNhtwvg4DvhzNLfbIJdRazoAfvjdYUmdKLnETmGG_2ivyhZtF-vBS_BT0LSN86z2CnWedWzgM1pij-0ixodqcqTsJdQtnq1_2y1uSrif8T0dW_Pb5-ITNXDHePDm6hM0DloDt7yRWTB6Pii1Q1bwu"
const pHeader = { "alg": "RS256", "typ": "JWT" }
const sHeader = JSON.stringify(pHeader);
const pClaim = {};
pClaim.aud = "https://www.googleapis.com/oauth2/v3/token";
pClaim.scope = "https://www.googleapis.com/auth/dialogflow";
pClaim.iss = "dialogflow-xdkddm@secret-rope-269306.iam.gserviceaccount.com";
pClaim.exp = KJUR.jws.IntDate.get("now + 1hour");
pClaim.iat = KJUR.jws.IntDate.get("now");

var sClaim = JSON.stringify(pClaim)
var sJWS = KJUR.jws.JWS.sign(null, sHeader, sClaim, key);

async function getAccessToken() {
  let urlEncodedData = "";
  let urlEncodedDataPairs = [];

  urlEncodedDataPairs.push(encodeURIComponent("grant_type") + '=' + encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer"));
  urlEncodedDataPairs.push(encodeURIComponent("assertion") + '=' + encodeURIComponent(sJWS));
  urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

  return axios.post('https://www.googleapis.com/oauth2/v3/token',urlEncodedData,{
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  })
}

export const ApiClient = axios.create({
  /**
   * Import the config from the App/Config/index.js file
   */
  baseURL: "https://dialogflow.googleapis.com/v2",
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',

  },
  timeout: 3000,
})
ApiClient.interceptors.request.use(function (config) {
  // Do something before request is sent
  return getAccessToken()
    .then((response) => {
      config.headers.Authorization = "Bearer "+response.data.access_token
      return Promise.resolve(config);
    })
    .catch((error) => {
      return Promise.resolve(config);
    });
}, function (error) {
  return Promise.reject(error);
});

export const HttpClient = axios.create({
  /**
   * Import the config from the App/Config/index.js file
   */
  baseURL: "https://secret-dusk-19853.herokuapp.com",
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',

  },
})