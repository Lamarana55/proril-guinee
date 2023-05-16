import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';


export enum HttpProgressState {
  start, end
}

export interface IHttpState {
  url: string
  state: HttpProgressState
  isError: boolean
}

@Injectable({
  providedIn: 'root'
})
export class HttpStateService {

  public state = new BehaviorSubject<IHttpState>({} as IHttpState);

  constructor() { }
}
