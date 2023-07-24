import { Groupement } from "app/project/parametrage/models/Groupement.model"

export class Produit{
    id: number
    nom: string
    poids: string
    prixUnit: number
    quantite: number
    marque?: string
    description?: string
    groupement? = new Groupement()

}