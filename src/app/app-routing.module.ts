import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StreamComponent } from './admin/stream/stream.component';
import { IsLoggedGuard } from './providers/guards/is-logged.guard';
import { IsNotLoggedGuard } from './providers/guards/is-not-logged.guard';
import { AttendanceComponent } from './user/attendance/attendance.component';
import { LevelComponent } from './user/level/level.component';
import { LoginComponent } from './user/login/login.component';
import { SubjectComponent } from './user/subject/subject.component';

const routes: Routes = [
  {path:"login", component:LoginComponent, canActivate:[IsNotLoggedGuard]},
  {path:"subject/:level", component:SubjectComponent, canActivate:[IsLoggedGuard]},
  {path:"level", component:LevelComponent, canActivate:[IsLoggedGuard]},
  {path:"attendance/:level/:subject", component:AttendanceComponent, canActivate:[IsLoggedGuard]},
  {path:"stream/:level/:subject", component:StreamComponent, canActivate:[IsLoggedGuard]},
  { path: '',   redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
