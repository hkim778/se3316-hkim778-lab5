import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public email:String = '';
  public password: String ='';
  constructor(private _http: HttpService) { }

  ngOnInit() {

  }

  log(){
    let user = {
      email: this.email,
      password:this.password
    }

    this._http.logIn(user).subscribe(data=>{
      console.log(data);
    })
  }

}
