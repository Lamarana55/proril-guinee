import { TypeCas } from './type-cas.model';
export class Question {
    id: number
    libelle: string
    statutParent: boolean
    typeCas = new TypeCas()
    idParent: number
    description?: string
}
