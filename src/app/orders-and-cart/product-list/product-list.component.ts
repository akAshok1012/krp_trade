import { Component, HostListener, OnInit } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component";
import { AuthService } from "app/core/service/auth.service";
import { InventoryService } from "app/core/service/inventory/inventory.service";
import { noImg } from "app/inventory-management/inventory-management.module";

export class list {
  itemMaster: any;
  unitOfMeasure: any;
  orderedQuantity: any;
  unitPrice: number;
  quantity: any;
}
@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {

  @HostListener('scroll', ['$event'])
  orderForm: FormGroup;
  hideList = false;
  units: any;
  quantity = 0;
  page: number = 0;
  size: number = 6;
  searchTerm: string = '';
  productList: Array<list> = [];
  itemList: Array<list> = [];
  orderData: any;
  total = 0;
  noImg = noImg

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private inventoryService: InventoryService,
    private notification: NotificationsComponent,
  ) { }

  ngOnInit(): void {
    this.getData();
    window.addEventListener('scroll', this.scrollEvent, true);
    this.orderForm = this.fb.group({
      orderedQuantity: ['', [Validators.required]],
      unit: ["", [Validators.required]],
    });
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollEvent, true);
  }

  onSearch() {
    this.page = 0;
    this.productList = [];
    this.getData();
  }

  getData() {
    
    this.inventoryService.getCartItems(
      this.page,
      this.size,
      this.searchTerm
    ).subscribe((response: any) => {
      for (let item of response.data.content) {
        this.productList.push(item);
      }
    });
    
  }

  scrollEvent = (event: any): void => {

    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      this.page = this.page + 1;
      this.getData();
    }
  }

  preventScroll(e){
    e.preventDefault()
  }

  addToList(itemMaster: any, unit, orderedQuantity) {
    if (this.itemList.length > 0) {
      for (let item of this.itemList) {
        if (
          item.itemMaster.id === itemMaster.id &&
          item.unitOfMeasure.id === this.orderForm.value.unit.id
        ) {
          item.orderedQuantity = parseInt(item.orderedQuantity) + parseInt(orderedQuantity);
          this.orderForm.reset();
          this.totalPrice();
          return
        }
      }
    }
    this.orderForm.reset();
    let itemObj = new list();
    itemObj.itemMaster = itemMaster;
    itemObj.unitOfMeasure = unit;
    itemObj.unitPrice = itemMaster.fixedPrice;
    itemObj.orderedQuantity = orderedQuantity;
    this.itemList.push(itemObj);
    this.totalPrice();
  }


  removeObject(row: any) {
    const index: number = this.itemList.indexOf(row);
    if (index !== -1) {
      this.itemList.splice(index, 1);
    }
    this.totalPrice();
  }

  onSelect(data) {
    this.orderForm.controls["unit"].setValue(data);
  }

  totalPrice() {
    this.total = 0;
    for (let data of this.itemList) {
      this.total += data.itemMaster.fixedPrice * (data.unitOfMeasure.unitWeight * data.orderedQuantity);
    }
  }

  reset(){
    this.orderForm.reset();
    this.itemList = [];
    this.orderData = null;
    this.hideList = false;
    this.total = 0
  }

  placeOrder() {
    this.orderData = {
      userId: {
        id: this.authService.currentUserValue.userId,
      },
      itemDetails: this.itemList,
      updatedBy: this.authService.currentUserValue.userId,
      orderStatus: "PENDING",
    };
    this.inventoryService.postOrder(this.orderData).subscribe((res) => {
      if (res) {
          let message;
          if (res.status === "OK") {
          this.reset();
          this.notification.showNotification(
            "top",
            "right",
            (message = {
              message: res.message,
              status: "success",
            })
          );
        }
        else {
          this.orderForm.reset();
          this.notification.showNotification(
            "top",
            "right",
            (message = {
              message: res.message,
              status: "warning",
            })
          );
        }
      }
    });
  }
}
