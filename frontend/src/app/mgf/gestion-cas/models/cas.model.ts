import { Partenaire } from '../../parametrage/models/partenaire.model';
import { User } from './../../user-management/models/user.model';
import { Victime } from './victime.model';
import { Localite } from './../../core/models/localite.model';
import { TypeCas } from './../../parametrage/models/type-cas.model';
import { Alerte } from './alerte.model';
export class Cas {
    id: number
    code: string
    statut: string
    typeCas: TypeCas
    victime: Victime
    localite: Localite
    // typeAppui: TypeAppui
    // cout: number
    alerte: Alerte
    partenaire: Partenaire
    description: string
    user?: User
    createdAt?: string
}
