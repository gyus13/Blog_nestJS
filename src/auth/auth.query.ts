import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthQuery {
  getFutureCharacterQuery = (id): string => {
    return `
        select
            user.id,
            user.nickname,
            user.subject,
            Characters.characterImageUrl as characterImageUrl
        from User user
        inner join CharacterUser CU on CU.userId = user.id
            inner join Characters on Characters.id = CU.characterId
        where CU.userId = ${id}
        `;
  };
}
