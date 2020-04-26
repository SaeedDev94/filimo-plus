import { IHome, IUser } from '../app.interface';

export interface IAuth extends IHome {
  user: IUser;
}
