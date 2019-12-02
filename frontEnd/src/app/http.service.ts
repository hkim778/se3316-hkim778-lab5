import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  url: String = 'http://localhost:8081/api';
  constructor(private http: HttpClient) {
    
   }

  logIn(user:object){
    let url = this.url + "/login";
    return this.http.post(url,user);
  }

  newUser(user:object){
    let url = this.url + "/newUser";
    return this.http.post(url,user);
  }

  getAllSongs(){
    let url = this.url + "/open/song";
    return this.http.get(url);
  }

  getSearch(title: string){
    let url = this.url + "/open/song/search/" + title;
    return this.http.get(url);
  }

  putReview(review:object, title:string){
    let url = this.url + "/secure/review/" + title;
    return this.http.put(url,review);
  }

  createSong(song:object){
    let url = this.url + "/secure/song";
    return this.http.post(url,song);
  }

  getAllUsers(){
    let url = this.url + "/admin/users";
    return this.http.get(url);
  }

  grantPrivilege(id:string){
    let url = this.url + "/admin/user/" + id;
    return this.http.get(url);
  }


  deactivate(id:string){
    let url = this.url + "/admin/user/deactivate/" + id;
    return this.http.get(url);
  }

  getAllPolicy(){
    let url = this.url + "/admin/policy";
    return this.http.get(url);
  }

  createPolicy(policies:object){
    let url = this.url + "/admin/policy";
    return this.http.post(url,policies);
  }

  updatePolicy(id:string,policies:object){
    let url = this.url + "/admin/policy/"+id;
    return this.http.put(url,policies);
  }


}
