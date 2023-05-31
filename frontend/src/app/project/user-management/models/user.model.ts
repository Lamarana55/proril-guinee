import { Region } from 'app/project/core/models/region.model';
import { Localite } from './../../core/models/localite.model';
import { Role } from './role.model';
import { Prefecture } from 'app/project/core/models/prefecture.model';
import { Commune } from 'app/project/core/models/commune.model';
import { Quartier } from 'app/project/core/models/quartier.model';
import { Secteur } from 'app/project/core/models/secteur.model';
export class User {
  id: number
  nom: string
  prenom: string
  email: string
  telephone: string
  username?: string
  password: string
  statut: string
  role = new Role()
  region? = new Region()
  prefecture? = new Prefecture()
  commune? = new Commune()
  quartier? = new Quartier()
  secteur? = new Secteur()
}
