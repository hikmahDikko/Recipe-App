import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthResData, AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Component({
    selector : 'app-auth',
    templateUrl : './auth.component.html'
})
export class AuthComponent{
    constructor(private authService :AuthService, private router : Router) {}

    isLoginMode = true;
    loading = false;
    error : string = null;

    onSwitchMode () {
        this.isLoginMode = !this.isLoginMode
    }

    onSubmit(form : NgForm) {
        const email = form.value.email;
        const password = form.value.password;
        let authObs : Observable<AuthResData>;

        if(!form.valid) return;

        this.loading = true;

        if(this.isLoginMode){
            authObs = this.authService.signIn(email, password);
        } else {
           authObs = this.authService.signUp(email, password);
        }

        authObs.subscribe(res => {
            console.log(res);
            this.loading = false;
            this.router.navigate(['/recipes'])
        }, errorRes => {
            console.log(errorRes);
            this.error = errorRes;
            this.loading = false;
        })
        
        form.reset();
    }
}