import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthResData, AuthService } from "./auth.service";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";

@Component({
    selector : 'app-auth',
    templateUrl : './auth.component.html'
})
export class AuthComponent implements OnDestroy{
    isLoginMode = true;
    loading = false;
    error : string = null;
    @ViewChild(PlaceholderDirective, {static: true}) alertHost : PlaceholderDirective;
    closeSub : Subscription;

    constructor(private authService :AuthService, private router : Router, private componenetFactoryResolver : ComponentFactoryResolver) {}
    
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
            this.showerrorAlert(errorRes);
            this.loading = false;
        })
        
        form.reset();
    }

    onHandleError(){
        this.error = null;
    }

    private showerrorAlert(message: string) {
        const alertComponent = this.componenetFactoryResolver.resolveComponentFactory(AlertComponent)
        const hostViewContainerref = this.alertHost.viewContainerRef;
        hostViewContainerref.clear();

        const componetRef = hostViewContainerref.createComponent(alertComponent)
        componetRef.instance.message = message
        this.closeSub = componetRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerref.clear();
        });
    }

    ngOnDestroy(){
        if(this.closeSub) {
            this.closeSub.unsubscribe();
        }
    }
}