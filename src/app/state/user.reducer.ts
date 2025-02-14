import { createReducer, on } from '@ngrx/store';
import { User } from './user.model';
import * as UserActions from './user.actions';

export interface UserState {
    users: User[];
    loading: boolean;
    error: any;
}

export const initialState: UserState = {
    users: [],
    loading: false,
    error: null
};

export const userReducer = createReducer(
    initialState,
    on(UserActions.loadUsers, state => ({
        ...state,
        loading: true
    })),
    on(UserActions.loadUsersSuccess, (state, { users }) => ({
        ...state,
        users,
        loading: false
    })),
    on(UserActions.loadUsersFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    })),
    on(UserActions.updateUserSuccess, (state, { user }) => ({
        ...state,
        users: state.users.map(u => u.id === user.id ? user : u)
    })),
    on(UserActions.deleteUserSuccess, (state, { id }) => ({
        ...state,
        users: state.users.filter(user => user.id !== id)
    }))
);