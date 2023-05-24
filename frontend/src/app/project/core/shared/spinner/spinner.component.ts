import { HttpProgressState, HttpStateService } from './../../services/http-state.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  public isLoading = false;
  public isError = false;
  @Input() public filterBy: string | null = null;
  @Input() public diameter = 40;
  @Input() public display = true;
  @Output() public loadingEvent$ = new EventEmitter<boolean>();

  constructor(private httpState: HttpStateService) { }

  ngOnInit(): void {
    this.httpState.state.subscribe(progress => {
      // console.log('progressValue', progress)
      if (progress && progress.url) {
        if (!this.filterBy) {
          this.isLoading = progress.state === HttpProgressState.start;
          this.isError = progress.isError;
        } else if (progress.url.indexOf(this.filterBy) !== -1) {
          this.isLoading = progress.state === HttpProgressState.start;
          this.isError = progress.isError;
        }
        this.loadingEvent$.emit(this.isLoading);
      }
    })
  }

}
