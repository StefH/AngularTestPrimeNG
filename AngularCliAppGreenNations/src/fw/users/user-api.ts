import { Observable } from 'rxjs/Observable';

export abstract class UserApi {
    public signIn: (username: string, password: string, rememberMe: boolean) => Observable<any>;
    public signOut: () => Observable<any>;
}
