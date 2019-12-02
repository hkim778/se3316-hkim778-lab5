import { Component, OnInit } from '@angular/core';
import { HttpService } from "../http.service";

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.scss']
})
export class ClaimComponent implements OnInit {
  claims:object;
  name:string;
  description: string;
  constructor(private http: HttpService) { }

  ngOnInit() {
    this.http.getAllClaims().subscribe(data=>{
      this.claims = data;
    })
    this.description = "Date: Music: ";
  }

  reportClaim(){
    let claim = {
      name: this.name,
      description: this.description
    }

    this.http.creatClaim(claim).subscribe(data=>{
      alert(data['message']);
    })

    window.location.reload();
    this.description = "Date: Music: ";
  }

}
