import { createAction, props } from '@ngrx/store';
import { AuthResponse } from '../models/auth.models';

export const login = createAction('[Auth] Login', props<{ request: any }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ response: AuthResponse }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());
export const register = createAction('[Auth] Register', props<{ request: any }>());
export const registerSuccess = createAction('[Auth] Register Success', props<{ response: AuthResponse }>());
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());
export const logout = createAction('[Auth] Logout');
export const authFailure = createAction('[Auth] Auth Failure', props<{ error: string }>());