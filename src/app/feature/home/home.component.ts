import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../state/user.model';
import * as UserActions from '../../state/user.actions';
import * as UserSelectors from '../../state/user.selectors';
import { map, take } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(
    private store: Store,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  @ViewChild('searchInput') searchInput!: ElementRef;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault();
      this.searchInput.nativeElement.focus();
    }
  }

  users$ = this.store.select(UserSelectors.selectAllUsers);
  filteredUsers$ = this.users$;
  loading$ = this.store.select(UserSelectors.selectUserLoading);
  forms: FormGroup[] = [];

  searchUsers(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredUsers$ = this.users$.pipe(
      map(users => users.filter(user =>
        user.name.toLowerCase().includes(searchTerm)
      ))
    );
  }

  ngOnInit() {
    this.store.dispatch(UserActions.loadUsers());

    this.users$.subscribe(users => {
      this.forms = users.map(user => this.createForm(user));
    });
  }

  createForm(user: User): FormGroup {
    return this.fb.group({
      name: [user.name, Validators.required],
      username: [user.username, Validators.required],
      email: [user.email, [Validators.required, Validators.email]]
    });
  }

  getFormControl(rowIndex: number, field: string): FormControl {
    return this.forms[rowIndex]?.get(field) as FormControl;
  }

  onRowEditInit(user: User, ri: number) {
    this.forms[ri] = this.createForm(user);
  }

  onRowEditSave(ri: number) {
    if (this.forms[ri].valid) {
      const formValue = this.forms[ri].value;

      this.users$.pipe(
        take(1),
        map(users => {
          const currentUser = users.find(user => user.id === ri + 1);
          const isDuplicateUsername = users.some(user =>
            user.username.toLowerCase() === formValue.username.toLowerCase() &&
            user.id !== ri + 1
          );

          return { currentUser, isDuplicateUsername };
        })
      ).subscribe(({ currentUser, isDuplicateUsername }) => {
        if (isDuplicateUsername) {
          this.messageService.add({
            severity: 'error',
            summary: 'Username taken',
            detail: 'Username already exists. Please choose a different username.',
            life: 3000
          });
          return;
        }

        if (currentUser) {
          this.messageService.add({
            severity: 'info',
            summary: 'In Progress',
            detail: 'Updating user...',
            life: 3000
          });

          this.store.dispatch(UserActions.updateUser({
            user: {
              ...currentUser,
              ...formValue
            }
          }));
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Form',
        detail: 'Please check all required fields',
        life: 3000
      });
    }
  }

  onRowEditCancel(user: User, ri: number) {
    this.forms[ri] = this.createForm(user);
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${user.name}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      acceptButtonStyleClass: "p-button-text p-button-danger",
      accept: () => {
        this.store.dispatch(UserActions.deleteUser({ id: user.id }));
      }
    });
  }

  sidebarVisible = false;
  selectedUser: User | null = null;

  getInitials(name: string): string {
    return name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }

  getRandomColor(): { background: string, text: string } {
    const colors = [
      { background: '#fde3cf', text: '#f56a00' },
      { background: '#e6f7ff', text: '#1890ff' },
      { background: '#f6ffed', text: '#52c41a' }
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  showUserInfo(user: User) {
    console.log('Input args', user)
    this.users$.pipe(
      map(users => users.find(u => u.id === user.id)),
    ).subscribe(completeUser => {
      if (completeUser) {
        this.selectedUser = completeUser;
        console.log('Complete', completeUser, 'Selected', this.selectedUser)
        this.sidebarVisible = true;
      }
    });
  }
}
