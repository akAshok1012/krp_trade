import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private http: HttpClient) { }

  getDashboardCountDetails() {
    return this.http.get(`${environment.apiUrl}/order-sales-master-count`);
  }

  getDashboardPaymentDetails() {
    return this.http.get(`${environment.apiUrl}/total-payment-summary`);
  }

  customerSalesOrdersCount(page:number, data:string) {
    return this.http.get(`${environment.apiUrl}/customer-sales-orders-count?page=${page}&size=5&sortBy=DESC&search=${data}`);
  }

  customerSalesOrdersChartCount(id:any) {
    return this.http.get(`${environment.apiUrl}/customer-sales-orders-payment-summary?id=${id}`);
  }

  dashboardCustomerSalesCount(id:any) {
    return this.http.get(`${environment.apiUrl}/customer-sales-orders-payment-summaries?id=${id}`);
  }

  getDashboardDetails2() {
    return this.http.get(`${environment.apiUrl}/customer-payment-summary`);
  }

  getDashboardDetails3() {
    return this.http.get(`${environment.apiUrl}/customer-monthly-payment-summary`);
  }

  getDashboardDetails4() {
    return this.http.get(`${environment.apiUrl}/customer-daily-sales-orders-count`);
  }

  getDashboardDetails5() {
    return this.http.get(`${environment.apiUrl}/customer-daily-payment-summary`);
  }



  //Lead Status ----------------------------------------------------------------------------

  leadStatusCount(id:number) {
    return this.http.get(`${environment.apiUrl}/lead-generation-count-by-status`); //?id=${id}
  }

  leadStatusCreaterCount() {
    return this.http.get(`${environment.apiUrl}/lead-generation-count-created-by`);
  }

  leadDailyCount() {
    return this.http.get(`${environment.apiUrl}/lead-daily-generation-count`);
  }

  leadWeeklyCount() {
    return this.http.get(`${environment.apiUrl}/lead-weekly-generation-count`);
  }

  leadYearlyCount() {
    return this.http.get(`${environment.apiUrl}/lead-yearly-generation-count`);
  }

   // Order, Sales and Payment Count ----------------------------------------------------------------------------


  DailyCount() {
    return this.http.get(`${environment.apiUrl}/daily-sales-orders-payment-count`);
  }

  WeeklyCount() {
    return this.http.get(`${environment.apiUrl}/weekly-sales-orders-payment-count`);
  }

  MonthlyCount() {
    return this.http.get(`${environment.apiUrl}/monthly-sales-orders-payment-count`);
  }


}
