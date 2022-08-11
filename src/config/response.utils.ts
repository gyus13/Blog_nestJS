export const response = {
  SUCCESS: {
    isSuccess: true,
    code: 1000,
    message: '성공',
  },
  CHECK_JWT_TOKEN: {
    isSuccess: false,
    message: 'JWT 토큰을 확인해주세요.',
  },
  USER_ID_EMPTY: {
    isSuccess: false,
    code: 2001,
    message: '아이디가 없습니다.',
  },
  NON_EXIST_EMAIL: {
    isSuccess: false,
    code: 2002,
    message: '이메일을 확인해주세요.',
  },
  NON_MATCH_PASSWORD: {
    isSuccess: false,
    code: 2003,
    message: '비밀번호가 일치하지 않습니다.',
  },
  EMPTY_EMAIL: {
    isSuccess: false,
    code: 2004,
    message: '이메일을 입력해주세요.',
  },
  INVALID_EMAIL: {
    isSuccess: false,
    code: 2005,
    message: '유효하지 않은 이메일 입니다.',
  },
  EMPTY_PASSWORD: {
    isSuccess: false,
    code: 2006,
    message: '비밀번호를 입력해주세요.',
  },
  INVALID_PASSWORD: {
    isSuccess: false,
    code: 2007,
    message: '유효하지 않은 비밀번호 입니다.',
  },
  EMPTY_CONFIRM_PASSWORD: {
    isSuccess: false,
    code: 2008,
    message: '확인 비밀번호를 입력해주세요.',
  },
  INVALID_CONFIRM_PASSWORD: {
    isSuccess: false,
    code: 2009,
    message: '유효하지 않은 확인 비밀번호 입니다.',
  },
  NOT_MATCH_CONFIRM_PASSWORD: {
    isSuccess: false,
    code: 2010,
    message: '확인 비밀번호와 일치하지 않습니다.',
  },
  EMPTY_NICKNAME: {
    isSuccess: false,
    code: 2011,
    message: '닉네임을 입력해주세요.',
  },
  EXIST_EMAIL: {
    isSuccess: false,
    code: 2012,
    message: '이미 사용중인 이메일입니다.',
  },
  NON_EXIST_USER: {
    isSuccess: false,
    code: 2013,
    message: '존재하지 않는 유저입니다.',
  },
  EMPTY_AUTHORITY: {
    isSuccess: false,
    code: 2014,
    message: '권한을 입력해주세요.',
  },
  INVALID_AUTHORITY: {
    isSuccess: false,
    code: 2015,
    message: '유효하지 않은 권한입니다.',
  },
  CANNOT_ACCESS_BY_AUTHORITY: {
    isSuccess: false,
    code: 2016,
    message: '접근이 불가능한 권한입니다.',
  },
  INVALID_NICKNAME: {
    isSuccess: false,
    code: 2017,
    message: '닉네임은 3~8자 입력 가능합니다.',
  },
  NOT_SIX_TICKET: {
    isSuccess: false,
    code: 2018,
    message: '티켓은 6개까지만 생성 가능합니다.',
  },
  EMPTY_TITLE: {
    isSuccess: false,
    code: 2019,
    message: '제목을 입력해주세요.',
  },
  EMPTY_START: {
    isSuccess: false,
    code: 2020,
    message: '시작역을 입력해주세요.',
  },
  EMPTY_END: {
    isSuccess: false,
    code: 2021,
    message: '목적을 입력해주세요.',
  },
  EMPTY_COLOR: {
    isSuccess: false,
    code: 2022,
    message: '색을 입력해주세요.',
  },
  EMPTY_CATEGORY: {
    isSuccess: false,
    code: 2023,
    message: '카테고리를 입력해주세요.',
  },
  EMPTY_TOUCHCOUNT: {
    isSuccess: false,
    code: 2024,
    message: '터치횟수를 입력해주세요.',
  },
  NOT_SIX_DREAM: {
    isSuccess: false,
    code: 2025,
    message: '상상해보기은 6개까지만 생성 가능합니다.',
  },
  EMPTY_ID_TOKEN: {
    isSuccess: false,
    code: 2026,
    message: 'id 토큰을 입력해주세요',
  },
  FAIL_PUSH: {
    isSuccess: false,
    code: 2027,
    message: '푸시알림에 실패했습니다.',
  },
  ERROR: {
    isSuccess: false,
    code: 4000,
    message: '서버 에러',
  },
};
