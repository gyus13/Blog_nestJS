import { Injectable } from '@nestjs/common';
const admin = require('firebase-admin');

const defaultAppConfig = {
  credential: admin.credential.cert({
    type: 'service_account',
    project_id: 'endticket',
    private_key_id: '5708b2caf6a5ee6e4749cc5b86624a2124d8e844',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDAzRTNlOojJF0\n8a2EzbQblETbLZMLKerfZ6zuVzA6HYXLvYqSnMPM2BE/SVWDsxYkWWCp+ozfSm0O\np8GplrbyCu+EOdKNmdc1QB90KfVp7o0gLcPTe4/Hed+bhRY5lX2ZSvrLD6/GBLWC\nDNAJN5ZQxovcx/Pyntx1kOp9C50KElQb1XnZWsikSgLTvn1eiHGET8Eaa/jSjcWd\n3yoaCdkDnSf0gsM/uW/EAlTBe0hWZNBQi9fbgMyAC8iYjAV4vI9w8u9jIjQRuuxW\ngFNnEcwC3m4PeaL1j4e0gdOt/EsXnj9GHMGV2xlrfPEnqvfG95mXQqz/Pn7Q7QAE\nNcf/vCz9AgMBAAECggEAFFl1gJhq7uvqMsyUWYcYnAcjD0cIcNIJNRJNwJo/CVVy\n1IGdH/L1WJ8UX6kAoCtULGtaM6qWQCe1TSHyysZUJVpAR6k8ADQ1OZSNI7NMLWdr\n+Rdld6BNbtiYHZOr78rabiBdnspugmiT4zQAknGnQRsS1bFU0rTClw8N9Qn882Or\nFaR5thDnFqtDoTO0vqDMW5uO6ntB5V73iK/p+pzdPN6QulFI/31iwDavjckDVtAx\n1j/OsOzHkyFhUVEVzGaT/aOq7t8kj51S5W4LiKuaY16mRDxMoLhgTPkDeMol7esF\nVzPGLU22QlEkw3ywbHPriw6UflMXz3wzlflXx1n2CQKBgQDmRyck0DHMIuPaY6+Z\n6WaVW7KwqHNcbSfVVkEte6PPOk5XRT2zmxpQ5DUcBTADAUwCNS+tuPBWJVgLiOwQ\nDwEQ5CYHE9T14rkKAIh2ehgHpLzm+IU4yqNgKMeu63weDo7NjHhp5x2/rMnhWGVw\nPdjF/Pr0G0R7uqluiF2FZE3qBQKBgQDYy6EO2vZtIa1Yg2YaDS+/mag/JtNlopRU\n+IMhl8m9PoxhdGU22DgOdxVH6n5+hz9bMl30S+3/+TUmHu309t8gPwtrSflUDdOf\n/mToqZb8kO1ZbMAbLoZ70Jfr/7WwSPPFYZfwECV6wqlmnRWGJTACQVxuOSAy4w3b\nijQJy08QmQKBgQCIG2Y3jBbi4XxriKAyCJJplVl4sRf+eUYiAmljyMB5q6zCSFq/\n3d0gEsKRXT+ThyC17VnRBI6JXGk96CAfHb8zjKYtaLtm2iskjkwaOvAZFHXSzvFv\nL9aA75mW+fjSiyg8tdo2PjSHJknst6K9RNDrtStfPP6tYxbiDhe40CB9QQKBgEw+\nEL4ws0ld9qCSVW4EBS7U0x6igOXVb2USoMtHnmM3hBch4BaRo+UybAGGrkXBOr7P\nz8sCiQjkk5R8fCMSTxYAFfv9X/n3gt1ZkhNg0QCx10cDv+vPSOxyR3tvym3cuh5I\nXC7I/uVVYE3+IHu0yFWCtwbsgC5lO5Jh4DsxjPTBAoGAf6+JIeITP/gNJ7gd9DyM\no5OIRIqbF+NP6kDcNGv2c1vvRtRtnKkoOGRuuUiLbEZBI6oYkRQys94L+SBL1Igl\nlG+azG5sfNq0lOUWFtb+3pjnL1hvSiPBI3ckHcydgFCZ+TTlbpIAjAQxxTORP6FT\nqQkmhXrwhgahDTj4iyqxMvE=\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-av8dc@endticket.iam.gserviceaccount.com',
    client_id: '105733054948442964525',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-av8dc%40endticket.iam.gserviceaccount.com',
  }),
};

admin.initializeApp(defaultAppConfig);

@Injectable()
export class PushService {
  async sendPush(postPushRequest) {
    const target_token = postPushRequest.token;
    //target_token은 푸시 메시지를 받을 디바이스의 토큰값입니다

    console.log(target_token);
    const message = {
      data: {
        title: '테스트 데이터 발송',
        body: '데이터가 잘 가나요?',
      },
      notification: {
        title: 'notification title text',
        body: 'notification body text',
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
