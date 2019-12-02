import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'frontEnd';
  admin:boolean;
  ngOnInit(){
    this.admin = false;
    if(localStorage.admin == "site manager"){
      this.admin = true;
      
    }
    else
      this.admin = false;
  }
}
