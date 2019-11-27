import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  url: String = 'http://localhost:8081/api';
  constructor(private http: HttpClient) {
    
   }

  logIn(user){
    let url = this.url + "/login";
    return this.http.post(url,user);
  }

  newUser(user){
    let url = this.url + "/newUser";
    return this.http.post(url,user);
  }

}
