import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'app/mgf/core/services/util.service';

@Component({
  selector: 'app-edit-victime',
  templateUrl: './edit-victime.component.html',
  styleUrls: ['./edit-victime.component.css']
})
export class EditVictimeComponent implements OnInit {

  isNew = true;
  victimeId = 0;
  returnUrl = '..';

  constructor(private route: ActivatedRoute,
              private utils: UtilService,
              private router: Router) { }

  ngOnInit(): void {
    this.utils.previousUrl$.subscribe(url => {
      this.returnUrl = !!url ? url : this.returnUrl;
    })
    this.victimeId = this.route.snapshot.params['id'];
    this.isNew = isNaN(this.victimeId);
    if (this.isNew) { // add method not supported
      this.router.navigate(['dashboard'])
    }
  }

  onUpdated(isDone = false) {
    if (isDone) {
      this.router.navigate([this.returnUrl])
    }
  }

}
