import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MedicineService {
  private apiUrl = 'https://api.evitalrx.in/v1/patient/medicines/search';
  private apiKey = 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3'; // Your API KEY HERE

  constructor(private http: HttpClient) {}

  searchMedicines(searchstring: string, showSaleRate: string = 'yes'): Observable<any> {
    // Use `authorization` in lowercase (docs are case-sensitive)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiKey
    });

    const body = {
      searchstring,
      show_sale_rate: showSaleRate
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}