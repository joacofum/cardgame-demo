import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  FormRegister:FormGroup;

  constructor(private authService: AuthService,private router: Router) {
    this.FormRegister = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
   }

  ngOnInit() {
  }

  onSubmit(){
    this.authService.register(this.FormRegister.value)
    .then(resp =>{
      console.log(resp)
      this.router.navigate([]);
    })
    .catch(error => console.log(error));
  }

 

}
