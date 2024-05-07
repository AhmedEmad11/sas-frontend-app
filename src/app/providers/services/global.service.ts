import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  // private baseUrl:string = "http://127.0.0.1:8000" 
  private baseUrl:string = "https://sas-backend-app.herokuapp.com"
  
  public userData:any

  
  public isAuthed:boolean = false
  public isAdmin:boolean = false


  constructor(private _http:HttpClient) { }

  login(data:any):Observable<any>{
    return this._http.post(`${this.baseUrl}/login`, data)
  }

  logout():Observable<any>{
    return this._http.post(`${this.baseUrl}/logout`, null)
  }
  
  profile():Observable<any>{
    return this._http.get(`${this.baseUrl}/getProfile`)
  }

  getSubjectAttendance(levelId:any,subjectId:any):Observable<any>{
    return this._http.get(`${this.baseUrl}/getSubjectAttendance/${levelId}/${subjectId}/`)
    
  }

  markAttendance(data:any):Observable<any>{
    return this._http.post(`${this.baseUrl}/markAttendance/`, data)
  }

  getSubject():Observable<any>{
    return this._http.get(`${this.baseUrl}/getSubjects`)
  }

  getLevels():Observable<any>{
    return this._http.get(`${this.baseUrl}/getLevels`)
  }

  getLevelSubjects(data:any):Observable<any>{
    return this._http.get(`${this.baseUrl}/getLevelSubjects/${data}/`)
  }
  getLevelStudents(data:any):Observable<any>{
    return this._http.get(`${this.baseUrl}/getLevelStudents/${data}/`)
  }
  createAttendanceForLevel(data:any):Observable<any>{
    return this._http.post(`${this.baseUrl}/createAttendanceForLevel/`, data)
  }
}
