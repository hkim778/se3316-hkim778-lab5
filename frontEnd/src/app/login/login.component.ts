import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']

})
export class LoginComponent implements OnInit {

  public authentication: Boolean = false;
  email:String = '';
  password: String ='';
  constructor(private _http: HttpService, private router: Router) { }

  ngOnInit() {

  }

  log(){
    let user = {
      email: this.email,
      password:this.password
    }

    this._http.logIn(user).subscribe(data=>{
      if(data['message']=="Logged in successfully!"){
        this.router.navigateByUrl("/authenticated");
        this.authentication = true;
      }
      //need to add statements
      else{
        alert("Wrong Account");
        this.email = "";
        this.password="";
        
      }
    });
  }

}
