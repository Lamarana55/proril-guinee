import { environment } from './../../../../environments/environment';
import { Permission } from '../models/permission.model';
import { Role } from '../models/role.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UpdatePassword } from 'app/project/core/models/update-password.model';
import { RequestCasParam } from 'app/project/core/models/request-cas-param';
import { Pagination } from 'app/project/utils/pagination';

export const USER_URL = 'users';
export const ROLE_URL = 'roles';
const permissionUrl = 'permissions';

const apirUrl = environment.apiUrl;


const isValidNumber = (num: number) => (!!num && !isNaN(num));
 
const makeParams = (requestParam: RequestCasParam) => {
  let params = '';
    params += requestParam.dateDebut && requestParam.dateFin ?
                  `&dateDebut=${requestParam.dateDebut}&dateFin=${requestParam.dateFin}` : '';
    params += isValidNumber(requestParam.ageDebut) && isValidNumber(requestParam.ageFin) ?
                  `&ageDebut=${requestParam.ageDebut}&ageFin=${requestParam.ageFin}` : '';

    params += isValidNumber(requestParam.idRegion) ? '&idRegion=' + requestParam.idRegion : '';
    params += isValidNumber(requestParam.idPrefecture) ? '&idPrefecture=' + requestParam.idPrefecture : '';
    params += isValidNumber(requestParam.idCommune) ? '&idCommune=' + requestParam.idCommune : '';
    params += isValidNumber(requestParam.idQuartier) ? '&idQuartier=' + requestParam.idQuartier : '';
    params += isValidNumber(requestParam.idSecteur) ? '&idSecteur=' + requestParam.idSecteur : '';

    params += !!requestParam.role?`&role=`+requestParam.role : '';
    //params += isValidNumber(requestParam.role) ? '&role=' + requestParam.role : '';
    return params;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // ====================== User management ========================= //

  getAll(params?: RequestCasParam): Observable<Pagination> {
    //return this.http.get<User[]>(apirUrl + USER_URL);
    console.log();
    
    let request = apirUrl + USER_URL + `?page=${params.page}&size=${params.size}`;
    if (params) {
      request += makeParams(params);
    }
    return this.http.get<Pagination>(request);
    
  }

  getAllByRegion(idRegion: number): Observable<Pagination> {
    return this.http.get<Pagination>(apirUrl + USER_URL + `/region/${idRegion}`);
  }
  
  getAllUsersAffectation(id: number, option: string): Observable<User[]> {
    return this.http.get<User[]>(apirUrl + USER_URL + `/affectations?id=${id}&option=${option}`);
  }

 
  getOne(id: number): Observable<User> {
    return this.http.get<User>(apirUrl + USER_URL + '/' + id);
  }

  add(user: Partial<User>): Observable<User> {
    return this.http.post<User>(apirUrl + USER_URL, user);
  }

  update(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(apirUrl + USER_URL + '/' + id, user);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(apirUrl + USER_URL + '/' + id);
  }

  changeStatus(id: number): Observable<any> {
    return this.http.get(apirUrl + USER_URL + '/changeStatut/' + id)
  }

  updatePassword(request: UpdatePassword): Observable<any> {
    return this.http.post(apirUrl + USER_URL + '/' + 'changePassword', request, {responseType: 'text'});
  }

  reinitialisationPassword(data: any): Observable<any> {
    return this.http.post(apirUrl + USER_URL + '/regenerePassword', data) 
  }


  // ========================= Role management ==================== //

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(apirUrl + ROLE_URL);
  }

  getOneRole(id: number): Observable<Role> {
    return this.http.get<Role>(apirUrl + ROLE_URL + '/' + id);
  }

  addRole(role: Partial<Role>): Observable<Role> {
    return this.http.post<Role>(apirUrl + ROLE_URL, role);
  }

  updateRole(id: number, role: Partial<Role>): Observable<Role> {
    return this.http.put<Role>(apirUrl + ROLE_URL + '/' + id, role);
  }

  deleteRole(id: number): Observable<any> {
    return this.http.delete(apirUrl + ROLE_URL + '/' + id);
  }

  // ========================= Permission management =================== //

  getAllPermission(): Observable<Permission[]> {
    return this.http.get<Permission[]>(apirUrl + permissionUrl);
  }

  getOnePermission(id: number): Observable<Permission> {
    return this.http.get<Permission>(apirUrl + permissionUrl + '/' + id);
  }

  addPermission(permission: Partial<Permission>): Observable<Permission> {
    return this.http.post<Permission>(apirUrl + permissionUrl, permission);
  }

  updatePermission(permission: Partial<Permission>): Observable<Permission> {
    return this.http.put<Permission>(apirUrl + permissionUrl + '/' + permission.id, permission);
  }

  deletePermission(id: number): Observable<any> {
    return this.http.delete(apirUrl + permissionUrl + '/' + id);
  }

}
