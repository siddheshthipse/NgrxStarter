import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as UserActions from './user.actions';
import { UserService } from './../service/user.service';
import { MessageService } from 'primeng/api';


@Injectable()
export class UserEffects {

    constructor(
        private actions$: Actions,
        private userService: UserService,
        private messageService: MessageService
    ) { }

    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.loadUsers),
            mergeMap(() => this.userService.getUsers()
                .pipe(
                    map(users => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Users loaded successfully'
                        });
                        return UserActions.loadUsersSuccess({ users });
                    }),
                    catchError(error => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Something went wrong, please try again'
                        });
                        return of(UserActions.loadUsersFailure({ error }));
                    })
                ))
        )
    );

    updateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.updateUser),
            mergeMap(({ user }) => this.userService.updateUser(user)
                .pipe(
                    map(updatedUser => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'User updated successfully'
                        });
                        return UserActions.updateUserSuccess({ user: updatedUser });
                    }),
                    catchError(error => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Something went wrong, please try again'
                        });
                        return of(UserActions.updateUserFailure({ error }));
                    })
                ))
        )
    );

    deleteUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.deleteUser),
            mergeMap(({ id }) => this.userService.deleteUser(id)
                .pipe(
                    map(() => {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Info',
                            detail: 'User deleted successfully'
                        });
                        return UserActions.deleteUserSuccess({ id });
                    }),
                    catchError(error => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Something went wrong, please try again'
                        });
                        return of(UserActions.deleteUserFailure({ error }));
                    })
                ))
        )
    );
}