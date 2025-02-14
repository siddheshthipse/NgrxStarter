import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../state/user.model';
import * as UserActions from '../state/user.actions';
import * as UserSelectors from '../state/user.selectors';
import { map } from 'rxjs';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(
    private store: Store,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
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

    // Subscribe to users to create forms
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
      this.store.dispatch(UserActions.updateUser({
        user: {
          ...formValue,
          id: ri + 1 // Assuming IDs are 1-based
        }
      }));
    }
  }

  onRowEditCancel(user: User, ri: number) {
    this.forms[ri] = this.createForm(user);
  }

  deleteUser(user: User) {
    console.log('Called delete')
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
}
