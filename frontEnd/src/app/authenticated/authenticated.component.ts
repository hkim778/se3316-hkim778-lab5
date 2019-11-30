import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'


@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss']
})
export class AuthenticatedComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
    if(localStorage.username == null){
      this.router.navigateByUrl('/login');
      alert("You do not have access");
    }
  }

}
