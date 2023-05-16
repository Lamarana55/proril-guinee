import { Quartier } from './quartier.model';

export class Secteur {
  id: number
  nom: string
  code: string
  description: string
  quartier = new Quartier();
}
