
import { Localite } from './../../../core/models/localite.model';
import { tap, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { UtilService } from 'app/project/core/services/util.service';
import { USER_URL, UserService } from 'app/project/user-management/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Confirmable } from 'app/project/core/decorators/confirmable.decorator';
import { User } from 'app/project/user-management/models/user.model';
import { Role } from 'app/project/user-management/models/role.model';

@Component({
  selector: 'app-info-grossiste',
  templateUrl: './info-grossiste.component.html',
  styleUrls: ['./info-grossiste.component.css']
})
export class InfoGrossisteComponent implements OnInit {

  userId: number;
  user$: Observable<User>;
  subject = new BehaviorSubject(0);
  localite: Localite;
  role: Role;
  returnUrl = '../..';
  urlSubscription: Subscription;
  userUrl = USER_URL;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private utils: UtilService,
              private router: Router) { }

  ngOnInit(): void {
    this.urlSubscription = this.utils.previousUrl$.subscribe(url => {
      this.returnUrl = !!url ? url : this.returnUrl;
    })
    this.userId = this.route.snapshot.params['id'];
    this.user$ = !isNaN(this.userId) ? this.subject.asObservable().pipe(
      switchMap(() => this.userService.getOne(this.userId).pipe(
        tap(user => {
          this.role = user.role;
        })
      ))
    ) : of(new User()).pipe(
      tap(() => {
        this.router.navigate([this.returnUrl])
      })
    );
  }

  onChangeStatus(idUser: number) {
    this.userService.changeStatus(idUser).subscribe(() => this.subject.next(0));
  }

  @Confirmable({
    html: 'Voulez-vous supprimer cet utilisateur ?',
    icon: 'warning'
  })
  onDelete(id: number) {
    this.userService.delete(id).subscribe(
      () => {
        this.utils.showNotif('Utilisateur supprimé avec succès', 'success');
        this.router.navigate([this.returnUrl]);
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors de l'operation ${err}`, 'danger')
      }
    )
  }

  ngOnDestroy() {
    if (this.urlSubscription) {
      this.urlSubscription.unsubscribe();
    }
  }
}
