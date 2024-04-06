import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService,public router:Router,private toastController: ToastController) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit(): void {
    // Check if login credentials are stored in localStorage
    const storedEmail = localStorage.getItem('loggedInUserEmail');
    const storedPassword = localStorage.getItem('loggedInUserPassword');
  
    if (storedEmail && storedPassword) {
      // Auto-login the user using stored credentials
      this.authService.signIn(storedEmail, storedPassword)
        .then(() => {
          console.log('Auto-login successful');
          this.presentToast('Auto-login successful', 'success');
          this.router.navigate(['avatar']);
        })
        .catch(error => {
          console.error('Auto-login error', error);
          this.presentToast('Auto-login Failed', 'danger');
          // Clear stored credentials if auto-login fails
          localStorage.removeItem('loggedInUserEmail');
          localStorage.removeItem('loggedInUserPassword');
          this.router.navigate(['login']);
        });
    }
  }

  async login() {
    const { email, password } = this.loginForm.value;
    try {
      await this.authService.signIn(email, password);
      console.log('Login successful');
       // Save login credentials to localStorage
    localStorage.setItem('loggedInUserEmail', email);
    localStorage.setItem('loggedInUserPassword', password);
      await this.presentToast('Login successful', 'success');
      this.router.navigate(['avatar']); // Replace '/avatar' with the actual route you want to navigate to
    } catch (error) {
      await this.presentToast('Please Enter Correct Login Email or Password', 'danger');
      console.error('Login error', error);
    }
  }
  
  
  signup(){
    this.router.navigate(['signup'])
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().then((userCredential) => {
      // Handle login success
      console.log(userCredential.user);
      this.router.navigate(['avatar']);
    })
    .catch((error) => {
      // Handle login error
      console.error(error);
    });
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
