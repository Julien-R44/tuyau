import type { HttpContext } from '@adonisjs/core/http'

import { getMiscValidator } from '#validators/main'

export enum UserType {
  USER = 'user',
  ADMIN = 'admin',
  CREWMAN = 'crewman',
  DISPATCHER = 'dispatcher',
}

enum A {
  A = 'a',
  B = 'b',
}

class MiscPresenter {
  toJson() {
    return {
      numberOrUndefined: 1 as number | undefined,
      stringOrUndefinedOrNull: 'Random thing' as string | undefined | null,
      justString: 'string',
      stringLiteral: 'literal' as const,
      exportedEnum: UserType.USER,
      standardEnum: A.A,
      any: 'foo' as any,
      null: null,
      nestedObj: {
        foo: 'bar',
        baz: 1,
        test: {
          nested: 'nested' as string | undefined,
        },
      },
    }
  }
}

export default class MiscController {
  async store({ request }: HttpContext) {
    await request.validateUsing(getMiscValidator)
    return new MiscPresenter().toJson()
  }

  async index({ request }: HttpContext) {
    await request.validateUsing(getMiscValidator)
    return 'Hello, world!' as const
  }

  async show({ request }: HttpContext) {
    await request.validateUsing(getMiscValidator)
    return new MiscPresenter().toJson()
  }
}
