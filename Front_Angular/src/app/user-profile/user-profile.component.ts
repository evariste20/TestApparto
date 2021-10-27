import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";
import { User } from '../shared/user.model';
import { NgForm } from '@angular/forms';
import { iif } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails;
  userAll;
  edit;
  addAmis = true;
  serverErrorMessages;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res['user'];
        console.log(this.userDetails);
      },
      err => { 
        console.log(err);
        
      }
    );

    this.userService.getallUser().subscribe(
      res => {
        this.userAll = res;
        console.log(this.userAll);
      },
      err => { 
        console.log(err);
      }
    );
    
  }

  onLogout(){
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }

  onEdit(userDetails : User){
      this.edit = true;
      console.log("  edit ");
  }

  onSubmit(form : NgForm){
    this.edit = false;
    console.log(form.value);
    var newUser = new User(); 
    newUser = form.value;
    //console.log(this.userDetails.listeAmis);
    newUser._id = this.userDetails._id;
    if(this.userDetails.listeAmis == null ){
      newUser.listeAmis = [];
    }else{
     newUser.listeAmis = newUser.listeAmis.concat(this.userDetails.listeAmis);
    }
    console.log(newUser);

    this.userService.putUser(newUser).subscribe(
      res => {
        //this.userService.setToken(res['token']);
        //this.router.navigateByUrl('/userprofile');
        this.ngOnInit();
      },
      err => {
        this.serverErrorMessages = err.error.message;
      }
    );
  }

  onDrop(user: User){
    
    if(this.userDetails.listeAmis != null) {
      console.log(this.userDetails.listeAmis.length);
      this.userDetails.listeAmis.splice(this.userDetails.listeAmis.indexOf(user));
    
    this.userService.putUser(this.userDetails).subscribe(
      res => {
        this.router.navigateByUrl('/userprofile');
        this.ngOnInit();
      }, 
      err => {
        this.serverErrorMessages = err.error.message;
      }
    );
    }
    
    console.log(" liste d'amis vide");

  }

  onAdd(user: User){
    console.log(this.userDetails.listeAmis.length);
    this.userDetails.listeAmis.push(user);
    console.log(this.userDetails.listeAmis);
      this.userService.putUser(this.userDetails).subscribe(
        res => {
          this.router.navigateByUrl('/userprofile');
          this.ngOnInit();
        }, 
        err => {
          this.serverErrorMessages = err.error.message;
        }
      )
  }

  addAmisOnlist(){  
    if(this.addAmis == true)
      this.addAmis = false;
    else
      this.addAmis = true;
    console.log("addAmis" + this.addAmis);
  }

  onSubmit2(form : NgForm){

    var newUser = new User();
    newUser = form.value;
    this.userDetails.listeAmis.push(newUser);

    console.log(this.userDetails);

    this.userService.postUser(form.value).subscribe(
      res => {
        //this.userService.setToken(res['token']);
        //this.router.navigateByUrl('/userprofile');
      },
      err => {
        this.serverErrorMessages = err.error.message;
      }
    );

    this.userService.putUser(this.userDetails).subscribe(
      res => {
        this.router.navigateByUrl('/userprofile');
        this.ngOnInit();
      }, 
      err => {
        this.serverErrorMessages = err.error.message;
      })


  }

}




