import { ResponseStatus } from '../constant/response-status.enum';
import { ResponseMessage } from '../constant/response-message.enum';
import { ValidationMessage } from '../constant/validation-message.enum';
export interface HttpResponseInterface<T> {
  status: ResponseStatus;
  message: ResponseMessage;
  data?: T;
  errors?: ValidationMessage[];
}
