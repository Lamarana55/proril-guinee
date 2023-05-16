import { TypeCas } from './../../parametrage/models/type-cas.model';
import { User } from './../../user-management/models/user.model';
import { Mois } from './mois.model';
export class RapportSurveillance {
    id: number
    annee: number
    mois: Mois
    typeCas: TypeCas
    casAverer: number
    casEmpecher: number
    createdAt: string
    user?: User
}
