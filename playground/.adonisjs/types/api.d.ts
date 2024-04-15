import type { MakeOptional, Serialize, Simplify, ConvertReturnTypeToRecordStatusResponse } from '@tuyau/utils/types'
import type { InferInput } from '@vinejs/vine/types'

export interface AdonisApi {
  'users': {
    'get': {
      'request': MakeOptional<InferInput<typeof import('../../app/validators/main.ts')['getUsersValidator']>>;
      'response': Simplify<Serialize<ConvertReturnTypeToRecordStatusResponse<Awaited<ReturnType<typeof import('../../app/controllers/users_controller.ts').default['prototype']['index']>>>>>;
    };
  };
  'simple-text': {
    'get': {
      'request': unknown;
      'response': Simplify<Serialize<ConvertReturnTypeToRecordStatusResponse<Awaited<ReturnType<typeof import('../../app/controllers/users_controller.ts').default['prototype']['simpleText']>>>>>;
    };
  };
  'file-upload': {
    'post': {
      'request': MakeOptional<InferInput<typeof import('../../app/validators/main.ts')['uploadFileValidator']>>;
      'response': Simplify<Serialize<ConvertReturnTypeToRecordStatusResponse<Awaited<ReturnType<typeof import('../../app/controllers/users_controller.ts').default['prototype']['fileUpload']>>>>>;
    };
  };
}
