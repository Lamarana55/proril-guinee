import { Groupement } from "app/project/parametrage/models/Groupement.model"
import { Categorie } from "app/project/parametrage/models/categorie.model"

export class Produit{
    id: number
    nom: string
    poids: string
    prixUnit: number
    description?: string
    categorie = new Categorie()
    groupement? = new Groupement()

}