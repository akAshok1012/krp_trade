import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  constructor(
    private http:HttpClient
  ) { }

  getShipment(){
    return this.http.get<any>(`${environment.apiUrl}/shipments`)
  }

  getShipmentListing(page:number, size:number, dir:string, sort:string, searchTerm: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment-listing?page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&search=${searchTerm}`);
  }

  getShipmentListingWithCustomer(page:number, size:number, dir:string, sort:string, searchTerm: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment-listing-customer?page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&search=${searchTerm}`);
  }

  getShipmentListingBySalesId(page:number, size:number, dir:string, sort:string, searchTerm: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipmentss-salesId?salesId=${searchTerm}&page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}`);
  }

  postShipment(data:any){
    return this.http.post<any>(`${environment.apiUrl}/shipment`,data)
  }
  //editpage data get by id
  getShipmentById(id:number){
    return this.http.get<any>(`${environment.apiUrl}/shipment/${id}`)
  }
  editShipment(id:number,data:any){
    return this.http.put<any>(`${environment.apiUrl}/shipment/${id}`,data)
  }

  updateShipment(data:any){
    return this.http.put<any>(`${environment.apiUrl}/shipment`,data)
  }

  deleteShipment(id:number){
    return this.http.delete<any>(`${environment.apiUrl}/shipment/${id}`)
  }
  getShipmentBySalesId(id:number){
    return this.http.get<any>(`${environment.apiUrl}/shipments-salesId?salesId=${id}`)
  }

  getShipmenWallet(id:number){
    return this.http.get<any>(`${environment.apiUrl}/customer-outstanding-userid?id=${id}`);
  }

  //shipment details
  getShipmentDetails(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/shipment-details`)
  }

  getShipmentDetailsListing(page:number, size:number, dir:string, sort:string, searchTerm: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment-details-listing?page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&search=${searchTerm}`);
  }

  getShipmentHistory(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment-history-salesid?salesId=${id}`);
  }

  getShipmentStatus(data:any, page:number, size:number, dir:string, sort:string, searchTerm: string):Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment-status?shipmentStatus=${data}&page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&search=${searchTerm}`);
   }

   getShipmentUserId(id:number,data:any, page:number, size:number, dir:string, sort:string, searchTerm: string):Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment-userId?id=${id}&shipmentStatus=${data}&page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&search=${searchTerm}`);
   }

   getShipmentUserSaleId(id:number,data:any, page:number, size:number, dir:string, sort:string, searchTerm: string):Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment-salesid-status?id=${id}&shipmentStatus=${data}&page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&salesId=${searchTerm}`);
   }

   getShipmentStatusBySalesId(data:any, page:number, size:number, dir:string, sort:string, searchTerm: number):Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment-salesid-status?shipmentStatus=${data}&salesId=${searchTerm}&page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}`);
   }
  
}
