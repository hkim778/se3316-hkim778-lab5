import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {
  songs: Object;
  name: string;
  constructor(private http:HttpService) { }
  
  ngOnInit() {
    this.http.getAllSongs().subscribe(data=>{
      this.songs = data;
    });
  }

  search(){
    this.http.getSearch(this.name).subscribe(data=>{
      console.log(data);
    });
  }

}
