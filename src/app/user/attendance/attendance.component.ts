import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/providers/services/global.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  constructor(public _global:GlobalService, private router:Router, private route:ActivatedRoute) {}
  user:any
  doctor:boolean = false
  admin:boolean = false
  student:boolean = false
  levelId:any
  subjectId:any
  students:any[] = []
  p0:any[]=[]
  p25:any[]=[]
  p50:any[]=[]
  p75:any[]=[]
  p100:any[]=[]

  errId:any

  searchText:string=''
  ngOnInit(): void {

    this.route.params.subscribe((params: Params)=>{
      this.subjectId = params.subject
      this.levelId = params.level
    })
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
      ()=>{}
    )


    this._global.getSubjectAttendance(this.levelId,this.subjectId).subscribe(
      data=>{
        this.students = data
        this.updateChart()
      },
      ()=>{},
      ()=>{}
    )

  }
  updateChart(){
    this.p0=[]
    this.p25=[]
    this.p50=[]
    this.p75=[]
    this.p100=[]
    this.students.forEach((s)=>{

      if(s.attendance[0]){
        s.attendance[0].count
        if(s.attendance[0].count==0){
          this.p0.push(s)
        }
    
        if(s.attendance[0].count>=1&&s.attendance[0].count<=3){
          this.p25.push(s)
        }
        if(s.attendance[0].count>3&&s.attendance[0].count<=6){
          this.p50.push(s)
        }
        if(s.attendance[0].count>6&&s.attendance[0].count<=11){
          this.p75.push(s)
        }
        if(s.attendance[0].count==12){
          this.p100.push(s)
        }
    }
    })

  }
  markAttendance (studentid:any){
    let data = {
      "subjectId": this.subjectId,
      "studentId": studentid
    }

    this.students.filter((el)=>{
      if(el.id==studentid){
        if(el.attendance[0].count<12){
        
          this._global.markAttendance(data).subscribe(
            data=>{

              this.students.forEach((s) => {
                if(s.id == studentid){

                  if(s.attendance[0]){
      
                    s.attendance[0].count +=1
                    this.updateChart()
                    
                }
              }})
            },
            ()=>{},
            ()=>{}
          )
        }
        else{
          this.errId=el.id
        }
      }
    })

  }

}
