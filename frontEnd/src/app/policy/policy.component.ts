import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit {

  policies:object;
  edit: boolean;
  constructor(private http: HttpService) { }

  policy1:string;
  policy2:string;
  policy3:string;

  admin:boolean;

  create:boolean;

  new1:string;
  new2:string;
  new3:string;

  ngOnInit() {
    this.edit = false;
    this.create = false;
    this.http.getAllPolicy().subscribe(data=>{
      this.policies = data;
    });

    if(localStorage.admin == null)
    {
      this.admin = false;
    }
    else 
      this.admin = true;
  }

  editPolicy(policy:object){
    if(!this.edit)
    {
      this.edit = true;
      this.policy1 = policy['policy1'];
      this.policy2 = policy['policy2'];
      this.policy3 = policy['policy3'];
    }
    else{
      this.edit = false;
      let policies = {
        policy1: this.policy1,
        policy2: this.policy2,
        policy3: this.policy3,
      }
      this.http.updatePolicy(policy['_id'],policies).subscribe(data=>{
        window.location.reload();
        alert(data["message"]);
        
      });
      
    }
  }
  createPolicy(){
    if(!this.create)
    {
      this.create = true;
    }//submit
    else{
      let policies = {
        policy1: this.new1,
        policy2: this.new2,
        policy3: this.new3
      }
      this.http.createPolicy(policies).subscribe(data=>{
        window.location.reload();
        alert(data["message"]);
      })
      this.create = false;
    }
  }


}
