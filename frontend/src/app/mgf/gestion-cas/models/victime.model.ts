export class Victime {
    id: number
    nom: string
    prenom: string
    age: number
    sexe: 'M' | 'F'
    adresse?: string
    contactTuteur?: string
    handicap: 'OUI' | 'NON'
    photo?: any
}
