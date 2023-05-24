import { Prefecture } from './prefecture.model';

export class Commune {
  id: number
  nom: string
  code: string
  description: string
  prefecture = new Prefecture()
}
