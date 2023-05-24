import { Localite } from './../../core/models/localite.model';
import { Role } from './role.model';
export class User {
  id: number
  nom: string
  prenom: string
  email: string
  telephone: string
  username: string
  password: string
  statut: string
  role = new Role()
  fonction?: string
}
