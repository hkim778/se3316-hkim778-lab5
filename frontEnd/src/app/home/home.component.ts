import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  songs: Object;
  name: string;
  detailed: Object;
  viewAll: boolean;
  avg: Number;

  total: number;


  constructor(private http:HttpService) { }

  ngOnInit() {
    localStorage.clear();
    this.http.getAllSongs().subscribe(data=>{
      this.songs = data;
    });
    this.viewAll = false;

  }
  search(){
    this.http.getSearch(this.name).subscribe(data=>{
      this.songs = data;
    });
  }

  detailedView(song:Object){
    this.detailed = song;
  }

  showAll(){
    if(!this.viewAll){
      this.viewAll = true;
    }
    else
      this.viewAll = false;
 
  }

  average(value: object,length: number){
    this.avg = 0;
    this.total = 0;
    
    for(var i = 0; i<length ; i ++ )
    {
      if(value[i]== null || value[i]== NaN){
      }
      else{
        this.total += value[i].rating
      }
      
    } 

    this.avg = this.total/length;
  }

}
