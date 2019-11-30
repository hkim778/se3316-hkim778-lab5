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
  viewAll: boolean
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

}
