import { Commune } from "app/project/core/models/commune.model"
import { Prefecture } from "app/project/core/models/prefecture.model"
import { Quartier } from "app/project/core/models/quartier.model"
import { Region } from "app/project/core/models/region.model"

export class Groupement{
    id: number
    nom: string
    telephone?: string
    email?: string
    description?: string
    region?: Region
    prefecture?: Prefecture | null = null;
    commune?: Commune | null = null;
    quartier?: Quartier| null = null;
}