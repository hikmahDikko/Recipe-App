import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./users.model";
import { Router } from "@angular/router";

export interface AuthResData {
    kind: string;
    idToken : string,
    email : string,
    refreshToken : string,
    expiresIn : string,
    localId : string,
    registered? : boolean
}

@Injectable({
    providedIn : 'root'
})
export class AuthService{
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer : any;
    
    constructor(private http : HttpClient, private router : Router) {}

    signUp(email : string, password : string){
        return this.http.post<AuthResData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC1zhWRhuZ_7PYVaSV6ia34BFom6hPLGec', {
            email : email,
            password : password,
            returnSecureToken : true
        }).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
    }
    
    signIn(email : string, password : string){
        return this.http.post<AuthResData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC1zhWRhuZ_7PYVaSV6ia34BFom6hPLGec', {
            email : email,
            password : password,
            returnSecureToken : true
        }).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
    }
    
    private handleAuthentication( email: string, userId : string, token : string, expiresIn : number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000)
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes : HttpErrorResponse) {
        let errorMessage = "An Unknown Error Occurred"

        if(!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage)
        }

        switch(errorRes.error.error.message) {
            case  'EMAIL_EXISTS' : 
                errorMessage = 'This email already exists';
            break;
            case 'OPERATION_NOT_ALLOWED' : 
                errorMessage = 'Password sign-in is disabled for this action';
            break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER' :
                errorMessage = 'Try again later'
            break;
            case 'INVALID_LOGIN_CREDENTIALS' : 
                errorMessage = 'Password or Email is invalid';
            break;
            case 'USER_DISABLED' :
                errorMessage = 'Account is Disabled'
            break;
        }

        return throwError(errorMessage)
    }

    autoLogin() {
        const userData : {
            email : string,
            id : string,
            _token : string,
            _expiresIn : string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        };

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._expiresIn));

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._expiresIn).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem("userData");

        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        };

        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }
}