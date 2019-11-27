import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { parse } from 'querystring';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.scss']
})
export class NewAccountComponent implements OnInit {

  email: String;
  password: String;

  

  constructor(private _http: HttpService) { }
  
  ngOnInit() {}

  register(){
    let user = {
      email: this.email,
      password:this.password
    };

    this._http.newUser(user).subscribe(data=>{
      console.log(data['message']);

      
    });

  }
}
