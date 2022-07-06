import { Injectable } from '@nestjs/common';

@Injectable()
export class FutureQuery {
  getDreamQuery = (id): string => {
    return `
            select dream.id,
                   dream.subject,
                   dream.purpose,
                   dream.color,
                   dream.isSuccess
            from Dream dream
            where dream.userId = ${id} and dream.isSuccess = "NotSuccess"
        `;
  };
}
