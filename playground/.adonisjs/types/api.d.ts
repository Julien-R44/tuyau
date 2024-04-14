import type { Serialize, Simplify, ConvertReturnTypeToRecordStatusResponse, MakeOptional } from '@tuyau/utils/types'
import type { InferInput } from '@vinejs/vine/types'

export interface AdonisApi {
  'users': {
    'get': {
      'request': MakeOptional<InferInput<typeof import('../../app/validators/main.ts')['getUsersValidator']>>,
      'response': Simplify<Serialize<ConvertReturnTypeToRecordStatusResponse<Awaited<ReturnType<typeof import('../../app/controllers/users_controller.ts').default['prototype']['index']>>>>>;
    };
  };
}
