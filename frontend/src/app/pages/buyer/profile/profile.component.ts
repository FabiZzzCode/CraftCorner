import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  auth = inject(AuthService);
  userService = inject(UserService);

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName:  ['', Validators.required],
    phone:     ['']
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword:     ['', [Validators.required, Validators.minLength(6)]]
  });

  profileSuccess = '';
  profileError = '';
  passwordSuccess = '';
  passwordError = '';
  savingProfile = false;
  savingPassword = false;

  ngOnInit(): void {
    this.auth.getProfile().subscribe(res => {
      this.profileForm.patchValue({
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        phone: res.data.phone
      });
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.savingProfile = true;
    const userId = this.auth.currentUser()!.userId;
    this.userService.update(userId, this.profileForm.value as any).subscribe({
      next: () => { this.profileSuccess = 'Profile updated!'; this.savingProfile = false; },
      error: () => { this.profileError = 'Failed to update.'; this.savingProfile = false; }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    this.savingPassword = true;
    this.userService.changePassword(this.passwordForm.value as any).subscribe({
      next: () => { this.passwordSuccess = 'Password changed!'; this.savingPassword = false; this.passwordForm.reset(); },
      error: err => { this.passwordError = err.error?.message || 'Failed.'; this.savingPassword = false; }
    });
  }
}
