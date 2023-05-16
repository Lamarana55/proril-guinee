import { Commune } from './../../core/models/commune.model';
import { User } from './../../user-management/models/user.model';
import { Region } from 'app/mgf/core/models/region.model';
import { TypeCas } from './../../parametrage/models/type-cas.model';
export class Alerte {
    id: number
    msisdn: string
    statut: string
    typeCas: TypeCas
    commune: Commune
    createdAt: string
    code: string
    user?: User
}
