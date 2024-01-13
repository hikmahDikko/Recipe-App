import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

const routes : Routes = [
    { path: '', component: AuthComponent}
]

@NgModule({
    declarations : [AuthComponent],
    imports : [SharedModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes)],
    exports : [RouterModule, AuthComponent]
})
export class AuthModule {}