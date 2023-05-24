import { Commune } from './commune.model';

export class Quartier {
  id: number
  nom: string
  code: string
  description: string
  commune = new Commune();
}
