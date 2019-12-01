import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users: Object;
  activity:boolean;
  constructor(private http:HttpService, private router:Router) { }

  ngOnInit() {
    if(localStorage.admin == null)
    {
      this.router.navigateByUrl("/login");
      alert("Do not have access");
    }
    this.http.getAllUsers().subscribe(data=>{
      this.users = data;
    });

    this.activity = true;
  }

  grantPrivilege(user: Object){
    this.http.grantPrivilege(user['_id']).subscribe(data=>{
      alert(data['message']);
    })
    window.location.reload();
  }

  activation(user:Object)
  {
    this.http.deactivate(user['_id']).subscribe(data=>{
      alert(data['message']);
    })
    window.location.reload()
  }

}
