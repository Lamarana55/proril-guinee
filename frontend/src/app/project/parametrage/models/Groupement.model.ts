import { Commune } from "app/mgf/core/models/commune.model"
import { Prefecture } from "app/mgf/core/models/prefecture.model"
import { Quartier } from "app/mgf/core/models/quartier.model"
import { Region } from "app/mgf/core/models/region.model"

export class Groupement{
    id: number
    libelle: string
    nom: string
    telephone?: string
    email?: string
    marqueGroupement?: string
    description?: string
    region?: Region
    prefecture?: Prefecture
    commune?: Commune
    quartier?: Quartier

}