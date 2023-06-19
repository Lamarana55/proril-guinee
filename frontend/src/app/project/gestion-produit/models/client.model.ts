import { User } from "app/project/user-management/models/user.model"

export class Client{
    id: number
    nom: string
    prenom: string
    telephone?: string
    adresse?: string
    user? = new User()

}