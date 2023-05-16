import { User } from './../../user-management/models/user.model';
import { Cas } from './cas.model';
export class TraitementCas {
    id: number
    cas: Cas
    statutCas: string
    description?: string
    user?: User
    createdAt: string
}
