import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/providers/services/global.service';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {

  constructor(public _global:GlobalService, private router:Router) {}
  user:any
  doctor:boolean = false
  admin:boolean = false
  student:boolean = false
  levels:any[] = []
  icon:string[] = [
    "fa-solid fa-book",
    "fa-solid fa-book-open-reader",
    "fa-solid fa-laptop-code",
    "fa-solid fa-user-graduate"
]


  ngOnInit(): void {
    this._global.profile().subscribe(
      data=>{
        this.user = data
        this._global.isAuthed = true
        if(data.role=="doctor"){
          this.doctor = true
        }

        else if(data.role=="admin"){
          this.admin = true
        }

        else {
          this.student = true
        }
        
      },
      ()=>{},
      ()=>{
        if(this.user.role == 'student'){
          this.router.navigateByUrl(`/subject/${this.user.level}`)  
        } else {
          this._global.getLevels().subscribe(
            data=>{
              
              this.levels = data
            },
            ()=>{},
            ()=>{}
          )
        }
      }
    )
  }
}
