import { Question } from './../../parametrage/models/question.model';
import { Cas } from './cas.model';
export class Reponse {
    id: number
    cas: Cas
    service: Question
    reponse: boolean
    description?: string
}
