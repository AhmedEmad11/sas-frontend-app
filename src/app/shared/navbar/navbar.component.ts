import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/providers/services/global.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(public _global:GlobalService, private router:Router) {}
  user:any
  isdoctor:boolean=false
  ngOnInit(): void {
    this._global.profile().subscribe(
      data=>{
        this._global.userData = data
        this.user = data
        this._global.isAuthed = true
        
        if(data.role=="doctor"){
          localStorage.setItem('isDoctor', "true")
        }

        if(data.role=="admin"){
          localStorage.setItem('isAdmin', "true")
        }

        if(data.role=="student"){
          localStorage.setItem('isStudent', "true")
        }
      },
      ()=>{},
      ()=>{}
    )
  }

  logout(){
    this._global.logout().subscribe(
      (data)=>{
        localStorage.removeItem('token')
        if(localStorage.getItem('isAdmin')){
          localStorage.removeItem('isAdmin')
        }
        if(localStorage.getItem('isDoctor')){
          localStorage.removeItem('isDoctor')
        }
        if(localStorage.getItem('isStudent')){
          localStorage.removeItem('isStudent')
        }
        this._global.isAuthed =false
      },
      ()=>{},
      ()=>{
        this.router.navigateByUrl('/login')
      }
    )
  }

}
