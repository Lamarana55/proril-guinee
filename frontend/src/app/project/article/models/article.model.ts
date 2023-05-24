import { User } from "../../user-management/models/user.model"
import { CategorieArticle } from "./categorie-article.model"

export class Article {
    id: number
    titre: String
    description?: String
    image?: String
    isVedette: boolean
    observation?: String
    statut: String
    user = new User()
    idCategorieArticle = new CategorieArticle()
    categorieArticle: string
    
}
export class ImageArticle {
    id: number
    articleId: number
    fileName: string
    downloadURL: string
    fileType: string
    isVedette: boolean
}