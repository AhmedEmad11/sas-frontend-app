import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/providers/services/global.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {

  constructor(public _global:GlobalService, private router:Router, private route:ActivatedRoute) {}
  user:any
  doctor:boolean = false
  admin:boolean = false
  student:boolean = false
  subjects:any
  levelId:any
  icon:string[] = [
    "fa-solid fa-code",
    "fa-solid fa-brain",
    "fa-solid fa-database",
    "fa-solid fa-microchip"
]
  done:boolean=false

  ngOnInit(): void {
    this.route.params.subscribe((params: Params)=>{
      this.levelId = params.level
    } )

    this._global.profile().subscribe(
      data=>{
        this._global.userData = data
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
        if(this.user.role == "student"){
          this._global.getSubject().subscribe(
            data=>{
              this.subjects = data
            },
            ()=>{},
            ()=>{}
          )
        } else {
          this._global.getLevelSubjects(this.levelId).subscribe(
            data=>{
              this.subjects = data
            },
            ()=>{},
            ()=>{}
          )
      
        }
      }
    )

  }
  createAttendanceForLevel(){     
    let data = { "levelId": this.levelId }    
    this._global.createAttendanceForLevel(data).subscribe(
      data=>{
        this.done=true
      },
      ()=>{},
      ()=>{}
      )
    }
}
