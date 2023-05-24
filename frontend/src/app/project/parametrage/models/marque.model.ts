import { Groupement } from "./Groupement.model"

export class Marque{
    id: number
    libelle: string
    description?: string
    groupement?: Groupement
}