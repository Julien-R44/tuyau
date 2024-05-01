import type { MakeTuyauRequest, MakeTuyauResponse } from '@tuyau/utils/types'
import type { InferInput } from '@vinejs/vine/types'

export interface AdonisApi {
  'users': {
    '$url': {
    };
    '$get': {
      'request': MakeTuyauRequest<InferInput<typeof import('../../app/validators/main.ts')['getUsersValidator']>>;
      'response': MakeTuyauResponse<import('../../app/controllers/users_controller.ts').default['index']>;
    };
    '$head': {
      'request': MakeTuyauRequest<InferInput<typeof import('../../app/validators/main.ts')['getUsersValidator']>>;
      'response': MakeTuyauResponse<import('../../app/controllers/users_controller.ts').default['index']>;
    };
  };
  'simple-text': {
    '$url': {
    };
    '$get': {
      'request': unknown;
      'response': MakeTuyauResponse<import('../../app/controllers/users_controller.ts').default['simpleText']>;
    };
    '$head': {
      'request': unknown;
      'response': MakeTuyauResponse<import('../../app/controllers/users_controller.ts').default['simpleText']>;
    };
  };
  'file-upload': {
    '$url': {
    };
    '$post': {
      'request': MakeTuyauRequest<InferInput<typeof import('../../app/validators/main.ts')['uploadFileValidator']>>;
      'response': MakeTuyauResponse<import('../../app/controllers/users_controller.ts').default['fileUpload']>;
    };
  };
}
