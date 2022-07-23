import { HttpException } from '@nestjs/common';
import { response } from '../config/response.utils';
import { getManager } from 'typeorm';

/**
 * description : response를 만들어 주는 함수, result에 들어갈 것이 없다면 undefined 입력해야함
 * @param response
 * @param data
 * @returns object
 */
export function makeResponse(response: any, data: any | any[] | undefined) {
  response.result = data;
  return response;
}

/**
 * description : 권한 체크 함수
 * @param gridgeAuthority
 * @param list
 * @returns boolean
 */
export function apiAuthorityCheck(Authority: string, list: string[]) {
  if (list.indexOf(Authority) === -1) {
    return false;
  }
  return true;
}

/**
 * description : ApiCallHistory에 로그 저장하는 함수
 * historyType : HistoryType ENUM에서 C, R, U, D에 맞게 넣으면 됩니다.
 * userType : UserType ENUM에서 유저에 맞게 넣으면 됩니다.
 * apiName : 각 도메인+controller에 작성되어있는 Swagger의 API명을 넣으면 됩니다.
 * req : request 객체를 넣으면 됩니다.
 * res : makeResponse()를 통해 만들어진 response를 넣으면 됩니다.
 */
export async function saveApiCallHistory(
  historyType: string,
  userType: string,
  apiName: string,
  req: any,
  res: any,
) {
  let id = 0;
  let queryString = null;
  let pathVariable = null;
  let body = null;
  try {
    // 유저의 아이디가 있는지 검사하는 로직
    if (req.user != undefined) {
      id = req.user.id;
    }
    // query string이 있는지 검사하는 로직
    if (req.query != undefined) {
      queryString = req.query;
    }
    // path variable이 있는지 검사하는 로직
    if (req.params != undefined) {
      pathVariable = req.params;
    }
    // body가 있는지 검사하는 로직
    if (req.body != undefined) {
      body = req.body;
    }
    const query = `
      INSERT INTO ApiCallHistory(historyType, userType, savedId, apiUri, apiName, apiMethod,
      requestQuery, requestBody, requestPath, response, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', CURRENT_TIMESTAMP)
    `;
    const param = [
      historyType,
      userType,
      id,
      req.url,
      apiName,
      req.method,
      JSON.stringify(queryString),
      JSON.stringify(body),
      JSON.stringify(pathVariable),
      JSON.stringify(res),
    ];
    const entityManager = getManager();
    await entityManager.query(query, param);
  } catch (error) {
    throw new HttpException(response.ERROR, 201);
  }
}

export async function decodeJwt(accessToken) {
  const base64Payload = accessToken.split('.')[1]; //value 0 -> header, 1 -> payload, 2 -> VERIFY SIGNATURE
  const payload = Buffer.from(base64Payload, 'base64');
  const result = JSON.parse(payload.toString());
  return result;
}

// description : 현재 한국 날짜, 시간을 구하는 함수
export function getcurrentDateTime(): string {
  const now = new Date();
  const koreaNow = new Date(
    now.getTime() - now.getTimezoneOffset() * 60 * 1000,
  );

  return koreaNow.toISOString().slice(0, 19).replace('T', ' ');
}

export function getAfterSevenDayTime(): string {
  const now = new Date();
  const koreaNow = new Date(
    now.getTime() - now.getTimezoneOffset() * 60 * 1000,
  );

  const year = koreaNow.getFullYear(); // 년
  const month = koreaNow.getMonth(); // 월
  const day = koreaNow.getDate(); // 일
  const hours = koreaNow.getHours();
  const minutes = koreaNow.getMinutes();
  const seconds = koreaNow.getSeconds();

  const korea7Day = new Date(year, month, day + 7, hours, minutes, seconds);
  return korea7Day.toISOString().slice(0, 19).replace('T', ' ');
}

// Date to string 함수
export function dateToString(format) {
  // let date = format.getDate();
  // if (date < 10) date = '0' + date;

  let hour = format.getHours();
  if (hour < 10) hour = '0' + hour;

  let min = format.getMinutes();
  if (min < 10) min = '0' + min;

  return ' ' + hour + ':' + min;
}

// Date to string 함수
export function defaultCurrentDateTime() {
  const object = generateDateFormatComponent();

  return (
    object.year +
    '-' +
    object.month +
    '-' +
    object.day +
    ' ' +
    object.hour +
    ':' +
    object.min +
    ':' +
    object.sec
  );
}

export function generateDateFormatComponent() {
  const date = new Date();

  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1).toString()
      : (date.getMonth() + 1).toString();

  const day =
    date.getDate() < 10
      ? '0' + date.getDate().toString()
      : date.getDate().toString();

  const hour =
    date.getHours() < 10
      ? '0' + date.getHours().toString()
      : date.getHours().toString();

  const min =
    date.getMinutes() < 10
      ? '0' + date.getMinutes().toString()
      : date.getMinutes().toString();

  const sec =
    date.getSeconds() < 10
      ? '0' + date.getSeconds().toString()
      : date.getSeconds().toString();

  const milSec =
    date.getMilliseconds() < 10
      ? '00' + date.getMilliseconds().toString()
      : date.getMilliseconds() < 100
      ? '0' + date.getMilliseconds().toString()
      : date.getMilliseconds().toString();

  return {
    year: year,
    month: month,
    day: day,
    hour: hour,
    min: min,
    sec: sec,
    milSec: milSec,
  };
}
