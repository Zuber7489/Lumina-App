import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent  implements OnInit {

  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService,public router:Router,private toastController: ToastController) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit(): void {
    
  }
  signup() {
    const { email, password } = this.signupForm.value;
    
    this.authService.signUp(email, password)
      .then(() => {
        console.log('Sign up successful');
        this.presentToast('Sign up successful', 'success');
        this.router.navigate(['login']);
      })
      .catch(error => {
        console.error('Sign up error', error);
        this.presentToast('Sign up failed. Please Enter Correct Gmail or Password.', 'danger');
      });
  }
  

  signupredirect(){
    this.router.navigate(['login'])
  }


  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color, // 'success' for green, 'danger' for red, etc.
      position: 'top'
    });
  
    await toast.present();
  }
  
}
