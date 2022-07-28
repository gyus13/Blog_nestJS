import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../common/firebase-key.json';
import { ServiceAccount } from 'firebase-admin';

@Injectable()
export class PushService {
  constructor() {
    console.log('constructor called()');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount),
      });
    }
    console.log('constructor executed()');
  }
  async sendPush(postPushRequest) {
    const target_token = postPushRequest.token;
    //target_token은 푸시 메시지를 받을 디바이스의 토큰값입니다

    const payload = {
      data: {
        title: '테스트 데이터 발송',
        body: '데이터가 잘 가나요?',
      },
      notification: {
        title: 'notification title text',
        body: 'notification body text',
      },
    };

    await Promise.all([
      await admin.messaging().sendToDevice(target_token, payload),
    ]);

    // admin
    //   .messaging()
    //   .send(message)
    //   .then(function (response) {
    //     console.log('Successfully sent message: : ', response);
    //   })
    //   .catch(function (err) {
    //     console.log('Error Sending message!!! : ', err);
    //   });
  }
}
