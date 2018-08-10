import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AngularFireStorage } from 'angularfire2/storage'
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup
  isSubmitted: boolean
  user: User = new User()
  uploadImage: File
  uploadProgress: number
  constructor(
    private fb: FormBuilder, 
    private afs: AngularFireStorage,
    private router: Router, 
    private authService: AuthService) { }

  ngOnInit() {
    this.initSignForm()
  }

  ngOnDestroy() {
    if(!this.isSubmitted) {
      this.afs.ref(`/profilePictures/${this.uploadImage.name}`).delete().subscribe()
    }
  }

  initSignForm() {
    this.signUpForm = this.fb.group({
      'email': ['', [Validators.email, Validators.required]],
      'password': ['', Validators.required],
      'displayName': ['', [Validators.maxLength(10), Validators.minLength(3)]],
    })
  }

  onImageAdded(e: any) {
    [this.uploadImage] = e.target.files
    const directoryRef = this.afs.ref(`/profilePictures/${this.uploadImage.name}`)
    const uploadTask = directoryRef.put(this.uploadImage)
    uploadTask.percentageChanges().subscribe(value => this.uploadProgress = value)
    uploadTask.snapshotChanges().pipe(
      finalize(() => directoryRef.getDownloadURL().subscribe(res => this.user.photoURL = res))
    ).subscribe()
    
  }

  submit() {
    if(this.signUpForm.invalid) {
      console.error('form is invalid')
      return
    }

    this.isSubmitted = true
    this.user = {...this.user, ...this.signUpForm.value}
    this.authService.signUp(this.user)
        .then(() => {
          this.router.navigate(['/chat'])
        })
        .catch(err => {
          console.warn(err)
        })
  }

}
