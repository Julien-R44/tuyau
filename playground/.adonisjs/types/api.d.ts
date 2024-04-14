import type { Serialize, Simplify, ConvertReturnTypeToRecordStatusResponse } from '@tuyau/utils/types'
import type { InferInput } from '@vinejs/vine/types'

export interface AdonisApi {
  'users': {
    'get': {
      'request': unknown;
      'response': Simplify<Serialize<ConvertReturnTypeToRecordStatusResponse<Awaited<ReturnType<typeof import('../../app/controllers/users_controller.ts').default['prototype']['index']>>>>>;
    };
  };
}
