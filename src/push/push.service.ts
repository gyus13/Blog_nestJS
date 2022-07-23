import { Injectable } from '@nestjs/common';
const admin = require('firebase-admin');

const defaultAppConfig = {
  credential: admin.credential.cert({
    type: 'service_account',
    project_id: 'endticket',
    private_key_id: '4fa6a017e917d68a6af5bc47a5dd944671e1ca8c',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDUfANAd0KlPb8g\nvVGIKpAYpoGpkrpmjm61ptFO7tkHo2uZULMjnYxbhS4NllnM04x3ET+b6gHLiTGp\nMR14dWfC/86umBmJv2j2o/yGcXINFUPRNrIApxFf77BoNiyGgLxOnmASyALN/UgA\nQsGttQozxVT/KyrMLaAXbKWdFfKTnuQCs9EUrkaXqQq1yy/hOgNfp2awEgwpbuJu\nqoowkQm5m5Dgy/Lnn5equpk1SWJd32lrduXJm5VWhY3hE1hymlEVtebu8SkuxEk5\nlnHAcU/l9TizFKvzqXmR9ykGV8BCILqLQdMYh2UgPqyqjwoqSQKtLQDDR1vmgMFJ\nU3EyX9NrAgMBAAECggEAC/1baZ3RIuXTDRPhr99G9j0e/+SJpBPRZ2qcUOnlUSsF\nfUcydIYFT3y6VoXvV0FwoZ9ViYSwyT1akgN1eECXtEce8HcgqcclMxWZwDRSjS5v\n/zQo4ySKNHGf8KFt7cEB3yXMogKrNdhe4bTinNykULuHykYzSgYhDHFS/wQoBfBM\n5FNRqtxy2k/I4CAlBqSUXcWZKk++1YlbSqNZXAunuzBby55FjvHSQTASepFDSaok\ncPsNuiTzKJ2DjSjgtAHQp2KSpaEVXvdLGriLyvdVLW/nhZesp8PD5l323kft08MV\nfE8N31rzsgFEdhshmSuxccmoLJPXF0cjmM15UlgvUQKBgQD7XsCCZ9jhrDzY8gmj\nkGTVlwBP0GufIWOhKuhFCFjPdWt6jIU0lzL62ismGjmdbkRfMENgZAeWP1LxKPMU\nwYjfxe4yj1vcs5bbcyAAyZ7KL1FmOcdvWAZ15Is2/oLtl70IhFL7jIL2mtSyw+ik\nNC5oUxwQVN9hzPvMiFNHbe8NfQKBgQDYZeilnHzxQjBM6GAiwoe2sJB0472bUxKJ\nH00jjg0LsAlkAMjO2Ca/xgPpcF3d7omWaBhV0ww42w/8wleESb8EZ4JWWYKJ0ADX\njXGyw2DXn9vUTv2b5xCN2DaOMFfKy44dO16PqU/0VtO43xAyb5ORhtlInBhAN9Mf\nH+fJap5ZBwKBgBIVqA35wK3DwYDuMOlWmxqOyZP0b7m8IjnXJ2zIA/OxA/GGKJM3\nCZDon1AXdOuxojOi+kX2DGGv3pzBEHP+1IUc7V0v2TEQrprNNpE38DelndqX75RA\nJf7XWXi0aOEFGLGDK6EzY7ywOPs/gv5FTs1spUk7gfK8V6VIbY1nCFrVAoGAdayF\nJHnCX5d0mH3MuVo7XpcJFuc5FhvIepRw6CK46WAi2ySqDgDwoVxWiDy4bpTmcMnO\nYe1QOiK1wOcVnDRWEVkQQVCPcc2Qh6a8607ffKHLcto5guvVzqyCjjOvqfGjKDY+\np7SUa/RDUcbLEgImpv5Dbf6kGVfCEKzS6G54CUUCgYB1snwMz2p7N7bZem7S8/54\nvN+vK8RD3FH2RYW+cRILTdRwVHRAI6eAFHk1QiSxavoqAkx2j4HyQgXPZ+4l/wTY\nomNVx2K2PM+ELa1V/QMP/3SCYMHgQImIlwjn4ArzgFVAU4NbZAnq6yrQNek8Wqe7\nRXMu7ORJSfnaO9C74Oj1Kw==\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-av8dc@endticket.iam.gserviceaccount.com',
    client_id: '105733054948442964525',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-av8dc%40endticket.iam.gserviceaccount.com',
  }),
};

const defaultApp = admin.initializeApp(defaultAppConfig);

@Injectable()
export class PushService {
  async sendPush(postPushRequest) {
    const target_token = postPushRequest.token;
    //target_token은 푸시 메시지를 받을 디바이스의 토큰값입니다

    const message = {
      data: {
        title: '테스트 데이터 발송',
        body: '데이터가 잘 가나요?',
        style: '굳굳',
      },
      token: target_token,
    };

    admin
      .messaging()
      .send(message)
      .then(function (response) {
        console.log('Successfully sent message: : ', response);
      })
      .catch(function (err) {
        console.log('Error Sending message!!! : ', err);
      });
  }
}
