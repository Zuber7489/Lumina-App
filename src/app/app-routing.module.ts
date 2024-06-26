import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AvatarComponent } from './avatar/avatar.component';


const routes: Routes = [
 {path:'',component:LoginComponent,pathMatch:'full'},
 {path:'home',component:HomeComponent},
 {path:'login',component:LoginComponent},
 {path:'signup',component:SignupComponent},
 {path:'avatar',component:AvatarComponent},
 
 
 
 

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
