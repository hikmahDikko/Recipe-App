import { NgModule } from "@angular/core";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { ShoppingListRoutingModule } from "./shopping-list-routing.module";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations : [
        ShoppingListComponent,
        ShoppingEditComponent,
    ],
    imports : [
        SharedModule,
        FormsModule, 
        ShoppingListRoutingModule],
    exports : [
        ShoppingListComponent,
        ShoppingEditComponent,
    ]
})
export class ShoppingListModule {}