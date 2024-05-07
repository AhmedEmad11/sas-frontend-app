import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/providers/services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  
  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  })
  error:any
  er:string[]=[
    "*this field required",
  ]
  

  constructor(private _global:GlobalService, private router:Router) { }

  ngOnInit(): void {
    
  }

  get password(){ return this.loginForm.get("password") }
  get username(){ return this.loginForm.get("username") }

  login(){
    if(this.loginForm.valid){
      this._global.login(this.loginForm.value).subscribe(
        (data)=>{
          localStorage.setItem('token', data.token)
        },
        (err)=>{

          this.error = err
        },
        ()=>{
        
          this.router.navigateByUrl('/level')

        }//final
      )
    }
  }

}