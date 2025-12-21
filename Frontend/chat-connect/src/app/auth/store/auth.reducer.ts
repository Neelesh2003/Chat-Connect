import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthResponse, initialAuthState } from '../models/auth.models';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, state => ({ ...state, loading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    user: response.user,
    token: response.token,
    isAuthenticated: true,
    loading: false
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AuthActions.register, state => ({ ...state, loading: true, error: null })),
  on(AuthActions.registerSuccess, (state, { response }) => ({
    ...state,
    user: response.user,
    token: response.token,
    isAuthenticated: true,
    loading: false
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AuthActions.logout, () => initialAuthState),
  on(AuthActions.authFailure, (state, { error }) => ({
    ...state,
    error
  }))
);