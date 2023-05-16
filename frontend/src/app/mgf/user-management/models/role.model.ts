import { Permission } from './permission.model';

export class Role {
  id: number
  nom: string
  description: string
  permissions = new Array<Permission>()
}
