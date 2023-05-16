import { Region } from './region.model';

export class Prefecture {
  id: number
  nom: string
  code: string
  description: string
  region = new Region()
}
