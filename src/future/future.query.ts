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
            where dream.userId = ${id} and dream.isSuccess = false
        `;
  };

  getFutureTitleQuery = (id): string => {
    return `
            select title.title
            from User user
                inner join TitleUser TU on user.id = TU.userId
                inner join Title title on title.id = TU.titleId
            where TU.userId = ${id}
        `;
  };

  getFutureExperienceQuery = (id): string => {
    return `
            select
                sum(experience.value) div 100 as level,
                right(sum(experience.value),2) as experience
            from User user
                left join Experience experience on experience.userId = user.id
            where experience.userId = ${id}

        `;
  };

  getFutureCharacterQuery = (id): string => {
    return `
        select
            user.id,
            user.nickname,
            user.subject,
            Characters.id as id,
            Characters.characterImageUrl as characterImageUrl
        from User user
        inner join CharacterUser CU on CU.userId = user.id
            inner join Characters on Characters.id = CU.characterId
        where CU.userId = ${id}
        `;
  };
}
