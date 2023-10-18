import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministrativeService {

  constructor(
    private http:HttpClient,
  ) {
   }

   // Leave Reject Reason
   getLeaveRejectReason(){
    return this.http.get<any>(`${environment.apiUrl}/leave-reject-reasons`)
  }
  getLeaveRejectReasonList(page:number, size:number, sort:string, dir:string, searchTerm:string): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/lead-reject-reason-list?page=${page}&size=${size}&sortByField=${sort}&search=${searchTerm}&sortBy=${dir}`)
  }
  getLeaveRejectReasonById(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/leave-reject-reason/${id}`);
  }
  postLeaveRejectReason(data:any){
    return this.http.post<any>(`${environment.apiUrl}/leave-reject-reason`,data)
  }
  editLeaveRejectReason(id:number,data:any){
    return this.http.put<any>(`${environment.apiUrl}/leave-reject-reason/${id}`,data)
  }
  deleteLeaveRejectReason(id:number){
    return this.http.delete<any>(`${environment.apiUrl}/leave-reject-reason/${id}`)
  }

    // Leave Reject Reason
    getHolidays(){
      return this.http.get<any>(`${environment.apiUrl}/holidays`)
    }
    getHolidayList(month:number, year:number): Observable<any>{
      return this.http.get<any>(`${environment.apiUrl}/holiday-by-month?month=${month}&year=${year}`)
    }
    getHolidayById(id:number): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/holiday/${id}`);
    }
    postHoliday(data:any){
      return this.http.post<any>(`${environment.apiUrl}/holiday`,data)
    }
    editHoliday(id:number,data:any){
      return this.http.put<any>(`${environment.apiUrl}/holiday/${id}`,data)
    }
    deleteHoliday(id:number){
      return this.http.delete<any>(`${environment.apiUrl}/holiday/${id}`)
    }

    //Notfication
    getNotification(){
      return this.http.get<any>(`${environment.apiUrl}/sms-logs`)
    }
    resendNotification(idList:number[]){
    return this.http.put<any>(`${environment.apiUrl}/sms-api`,idList)
   }
    deleteNotification(id: number){
      return this.http.delete<any>(`${environment.apiUrl}/sms-log/${id}`)
    }
    getNotificationList(page:number, size:number, sort:string, dir:string): Observable<any>{
      return this.http.get<any>(`${environment.apiUrl}/notification-list?page=${page}&size=${size}&sortByField=${sort}&sortBy=${dir}`)
    }
    getFailedNotification(){
      return this.http.get<any>(`${environment.apiUrl}/failed-notification`)
    }

    // Employee-Pay-Hours
    getEmployeePayHours(){
      return this.http.get<any>(`${environment.apiUrl}/employee-pay-hours`)
    }
    getEmployeePayHoursList(page:number, size:number, sort:string, dir:string, searchTerm:string): Observable<any>{
      return this.http.get<any>(`${environment.apiUrl}/employee-pay-hours-list?page=${page}&size=${size}&sortByField=${sort}&search=${searchTerm}&sortBy=${dir}`)
    }
    getEmployeePayHoursById(id:number): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/employee-pay-hours/${id}`);
    }
    postEmployeePayHours(data:any){
      return this.http.post<any>(`${environment.apiUrl}/employee-pay-hour`,data)
    }
    editEmployeePayHours(id:number,data:any){
      return this.http.put<any>(`${environment.apiUrl}/employee-pay-hours/${id}`,data)
    }
    deleteEmployeePayHours(id:number){
      return this.http.delete<any>(`${environment.apiUrl}/employee-pay-hours/${id}`)
    }
    EmployeePayHoursFilter(id:number,fromDate:string,toDate:string): Observable<any>{
      return this.http.get<any>(`${environment.apiUrl}/employee-pay-hours-filter?id=${id}&fromDate=${fromDate}&toDate=${toDate}`);
    }

    // Employee-Weekly-Wages
    getEmployeeWeeklyWages(){
      return this.http.get<any>(`${environment.apiUrl}/employee-weekly-wages`)
    }
    getEmployeeWeeklyWagesList(page:number, size:number, sort:string, dir:string, searchTerm:string): Observable<any>{
      return this.http.get<any>(`${environment.apiUrl}/employee-weekly-wages-list?page=${page}&size=${size}&sortByField=${sort}&search=${searchTerm}&sortBy=${dir}`)
    }
    getEmployeeWeeklyWagesById(id:number): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/employee-weekly-wages/${id}`);
    }
    postEmployeeWeeklyWages(data:any){
      return this.http.post<any>(`${environment.apiUrl}/employee-weekly-wages`,data)
    }
    editEmployeeWeeklyWages(id:number,data:any){
      return this.http.put<any>(`${environment.apiUrl}/employee-weekly-wages/${id}`,data)
    }
    deleteEmployeeWeeklyWages(id:number){
      return this.http.delete<any>(`${environment.apiUrl}/employee-weekly-wages/${id}`)
    }
}
