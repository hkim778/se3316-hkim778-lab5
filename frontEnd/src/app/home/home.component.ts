import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  songs: Object;
  name: string;
  detailed: Object;
  openDetailed: Boolean;

  viewAll: boolean;
  avg: String;

  reviews: Object;

  total: number;
  loggedIn: boolean;

  username:string;

  reviewField: boolean;
  review: string;
  rating: number;

  newSong: boolean;

  title:string;
  artist:string;
  album:string;
  year:number;
  track:number;
  genre:string;


  
  constructor(private http:HttpService, private router:Router) { }

  ngOnInit() {
    //localStorage.clear();
    this.http.getAllSongs().subscribe(data=>{
      this.songs = data;
    });
    this.viewAll = false;

    if(localStorage.username == null)
    {
      this.loggedIn = false;
      //console.log(this.loggedIn);
    }
    else{
      this.username = JSON.stringify(localStorage.username).split("@")[0].replace(/\"/g, "");

      this.loggedIn = true;
      //console.log(this.loggedIn);
    }

    this.openDetailed = false;



  }
  search(){
    this.http.getSearch(this.name).subscribe(data=>{
      this.songs = data;
      this.reviews = data["review"];
    });
  }

  detailedView(song:Object){
    this.detailed = song;
    if(!this.openDetailed){
      this.openDetailed = true;
    }
    else
      this.openDetailed = false;
  }

  showAll(){
    if(!this.viewAll){
      this.viewAll = true;
    }
    else
      this.viewAll = false;
 
  }

  average(value: object,length: number){
    
    this.total = 0;
    
    for(var i = 0; i<length ; i ++ )
    {
      if(value[i].rating== null || value[i].rating== NaN || value[i].rating === undefined){
      }
      else{
        this.total += value[i].rating
      }
      
    } 

    this.avg = (this.total/length).toFixed(1);
  }

  logOut(){
    localStorage.clear();
    this.loggedIn = false;
    alert("Successfully Logged Out");
  }

  addReview(){
    if(this.reviewField){
      this.reviewField = false;
    }
    else{
      this.reviewField = true;
      this.rating = 0;
    }
    
  }
  sendReview(title:string){
    var temp = {
      username: this.username,
      review: this.review,
      rating: this.rating
    }
    console.log(temp);
    this.http.putReview(temp,title).subscribe(data=>{
      alert(data["message"]);
    });
    this.reviewField = false;
    this.review = "";
    this.rating = 0;
    window.location.reload();
  }
  addNewSong(){
    if(this.newSong){
      this.newSong = false;
    }
    else{
      this.newSong= true;
    }
  }

  createSong(){
    let song = {
      title: this.title,
      artist:this.artist,
      album: this.album,
      year: this.year,
      track: this.track,
      genre: this.genre,
      username:this.username,
      review: this.review,
      rating: this.rating
    }
    if(this.title =="" || this.artist ==""||this.album ==""||this.year == null || this.track ==null||this.genre == ""){
      alert("Please Fill in the inputs properly")
    }
    else{
      this.http.createSong(song).subscribe(data=>{
        alert(data["message"]);
      })
  
      this.newSong = false;

      this.title = "";
      this.artist = "";
      this.album="";
      this.year = null;
      this.track =null;
      this.genre = "";
      this.review = "";
      this.rating = null;

      window.location.reload();
    }

  }


}
