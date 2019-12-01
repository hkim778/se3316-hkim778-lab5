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
    if(localStorage.username != null){
      this.router.navigateByUrl("/");
    }
  }

  log(){
    let user = {
      email: this.email,
      password:this.password
    }

    this._http.logIn(user).subscribe(data=>{
      let message = data['message'];
      if(message=="Logged in successfully!"){
        this.router.navigateByUrl("/");
        this.authentication = true;

        localStorage.username=this.email;
      }
      else if (message == "Welcome, Admin")
      {
        localStorage.admin = this.email;
        localStorage.username = "Site Manager";
        this.router.navigateByUrl("/admin");
      }
      else if(message =="Account is deactivated. Contact the store manager")
      {
        alert(message);
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
