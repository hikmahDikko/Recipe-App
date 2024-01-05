import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

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
    constructor(private http : HttpClient) {}

    signUp(email : string, password : string){
        return this.http.post<AuthResData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC1zhWRhuZ_7PYVaSV6ia34BFom6hPLGec', {
            email : email,
            password : password,
            returnSecureToken : true
        }).pipe(catchError(this.handleError));
    }
    
    signIn(email : string, password : string){
        return this.http.post<AuthResData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC1zhWRhuZ_7PYVaSV6ia34BFom6hPLGec', {
            email : email,
            password : password,
            returnSecureToken : true
        }).pipe(catchError(this.handleError))
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
}