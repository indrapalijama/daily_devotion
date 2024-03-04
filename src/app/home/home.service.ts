import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDevotion } from './home.page';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  path = environment.enpoint;
  key = environment.acceskey;
  constructor(private http: HttpClient) {}

  getToday(): Observable<IDevotion> {
    return this.http.get<IDevotion>(this.path + 'reflection', {
      headers: {
        accesskey: this.key,
      },
    });
  }
}
