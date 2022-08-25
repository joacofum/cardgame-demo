import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

//TODO: componente para el login con google
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;

  constructor(private auth: Auth, private authService: AuthService, private router: Router) {
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
   }

   ngOnInit():void{
   }

   onSubmit(){
    this.authService.login(this.formLogin.value)
    .then(resp => {
      console.log(resp)
    })
    .catch(err=>console.log(err));
   }
   
   onclick(){
    this.authService.loginWithGoogle()
    .then(resp =>{
      console.log(resp)
      this.router.navigate(['home'])
    }).catch(err=>console.log(err))
   }

}