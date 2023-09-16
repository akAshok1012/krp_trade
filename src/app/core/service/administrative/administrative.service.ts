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
    return this.http.get<any>(`${environment.apiUrl}/lead-reject-reason-list?page=${page}&size=${size}&sortByField=${sort}&sortBy=${dir}&search=${searchTerm}`)
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
}
