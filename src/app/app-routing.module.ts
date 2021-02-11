import { RouteGuardService } from './route-guard.service';
import { MemberComponent } from './Members/member/member.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
const routes: Routes = [
  { path: 'members', component: MemberComponent , canActivate:[RouteGuardService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
