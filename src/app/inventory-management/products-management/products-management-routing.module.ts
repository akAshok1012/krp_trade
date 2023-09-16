import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllItemsComponent } from './all-items/all-items.component';
import { AddItemsComponent } from './add-items/add-items.component';


const routes: Routes = [
  {
    path:'manage-items',
    component:AllItemsComponent
  },
  {
    path:'add-items',
    component:AddItemsComponent

  },
  {
    path:'edit-items',
    component:AddItemsComponent

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsManagementRoutingModule { }
