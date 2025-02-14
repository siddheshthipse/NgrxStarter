import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as UserActions from './user.actions';
import { UserService } from './../service/user.service';

@Injectable()
export class UserEffects {

    constructor(
        private actions$: Actions,
        private userService: UserService
    ) { }

    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.loadUsers),
            mergeMap(() => this.userService.getUsers()
                .pipe(
                    map(users => UserActions.loadUsersSuccess({ users })),
                    catchError(error => of(UserActions.loadUsersFailure({ error })))
                ))
        )
    );

    updateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.updateUser),
            mergeMap(({ user }) => this.userService.updateUser(user)
                .pipe(
                    map(updatedUser => UserActions.updateUserSuccess({ user: updatedUser })),
                    catchError(error => of(UserActions.updateUserFailure({ error })))
                ))
        )
    );

    deleteUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.deleteUser),
            mergeMap(({ id }) => this.userService.deleteUser(id)
                .pipe(
                    map(() => UserActions.deleteUserSuccess({ id })),
                    catchError(error => of(UserActions.deleteUserFailure({ error })))
                ))
        )
    );
}