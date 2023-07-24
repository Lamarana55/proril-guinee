package com.mady.backend.utils

import org.springframework.beans.factory.annotation.Value
import java.util.regex.Pattern


enum class Statut{Activated, Desactivated }


enum class StatutCas(val value: String){
    EN_ATTENTE("EN_ATTENTE"),
    EN_COURS("EN_COURS"),
    TRAITE("TRAITE"),
    ANNULE("ANNULE")
}

enum class StatutSurvi(val value: String){
    VIVANTE("VIVANTE"),
    DECEDE("DECEDE")
}

enum class OptionSender(val value: String){
    SMS("SMS"),
    EMAIL("EMAIL")
}

enum class OptionGetUser(val value: String){
    TOUT("TOUT"),
    REGION("REGION"),
    PREFECTURE("PREFECTURE")
}

data class Response(val status: Boolean, val data: Any)
data class ErrorResponse(val status: Int, val data: Any)


enum class Sexe{Masculin, Feminin}

enum class Delete{Yes, No}

enum class Provenance{MOBILE, USSD}

data class ResponseException(val message: String)

enum class Role(val value: String){
    ROLE_ADMIN("ROLE_ADMIN"),

    ROLE_POINT_FOCAL("ROLE_POINT_FOCAL"),
    ROLE_SURVEILLANT("ROLE_SURVEILLANT")
}

data class ImageReponse(
        val id: String,
        val articleId: Long?,
        val fileName: String,
        val downloadURL: String,
        val fileType: String,
        val isVedette: Boolean
)

val EMAIL_ADDRESS_REGEX = Regex(
        "[a-zA-Z0-9\\+\\.\\_\\%\\-\\+]{1,256}" +
                "\\@" +
                "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,64}" +
                "(" +
                "\\." +
                "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,25}" +
                ")+"
)

fun isValidEmail(email: String): Boolean {
    return !email.isNullOrEmpty() && EMAIL_ADDRESS_REGEX.matches(email)
}

/*class Role {
    companion object {
        const val ADMIN = "ROLE_ADMIN"
        const val USER = "ROLE_USER"
        const val WOMAN = "ROLE_WOMAN"
        const val PARTENAIRE = "ROLE_PARTENAIRE"

    }
}*/

class Permissions{
    companion object{
//        const val CAN_VIEW_DASHBORD = "CAN_VIEW_DASHBOARD"

        const val CAN_VIEW_USER_MENU = "CAN_VIEW_USER_MENU"
        const val CAN_VIEW_USER_LIST = "CAN_VIEW_USER_LIST"
        const val CAN_VIEW_USER_INFO = "CAN_VIEW_USER_INFO"
        const val CAN_ADD_USER = "CAN_ADD_USER"
        const val CAN_UPDATE_USER = "CAN_UPDATE_USER"
        const val CAN_DELETE_USER = "CAN_DELETE_USER"

        const val CAN_VIEW_ROLE_MENU = "CAN_VIEW_ROLE_MENU"
        const val CAN_VIEW_ROLE_LIST = "CAN_VIEW_ROLE_LIST"
        const val CAN_VIEW_ROLE_INFO = "CAN_VIEW_ROLE_INFO"
        const val CAN_ADD_ROLE = "CAN_ADD_ROLE"
        const val CAN_UPDATE_ROLE = "CAN_UPDATE_ROLE"
        const val CAN_DELETE_ROLE = "CAN_DELETE_ROLE"

        const val CAN_VIEW_ARTICLE_MENU = "CAN_VIEW_ARTICLE_MENU"
        const val CAN_VIEW_ARTICLE_LIST = "CAN_VIEW_ARTICLE_LIST"
        const val CAN_VIEW_ARTICLE_INFO = "CAN_VIEW_ARTICLE_INFO"
        const val CAN_ADD_ARTICLE = "CAN_ADD_ARTICLE"
        const val CAN_UPDATE_ARTICLE = "CAN_UPDATE_ARTICLE"
        const val CAN_DELETE_ARTICLE = "CAN_DELETE_ARTICLE"


        const val CAN_VIEW_CLIENT_MENU = "CAN_VIEW_CLIENT_MENU"
        const val CAN_VIEW_CLIENT_LIST = "CAN_VIEW_CLIENT_LIST"
        const val CAN_VIEW_CLIENT_INFO = "CAN_VIEW_CLIENT_INFO"
        const val CAN_ADD_CLIENT = "CAN_ADD_CLIENT"
        const val CAN_UPDATE_CLIENT = "CAN_UPDATE_CLIENT"
        const val CAN_DELETE_CLIENT = "CAN_DELETE_ARTICLE"


        const val CAN_VIEW_CATEGORIE_MENU = "CAN_VIEW_CATEGORIE_MENU"
        const val CAN_VIEW_CATEGORIE_LIST = "CAN_VIEW_CATEGORIE_LIST"
        const val CAN_VIEW_CATEGORIE_INFO = "CAN_VIEW_CATEGORIE_INFO"
        const val CAN_ADD_CATEGORIE = "CAN_ADD_CATEGORIE"
        const val CAN_UPDATE_CATEGORIE = "CAN_UPDATE_CATEGORIE"
        const val CAN_DELETE_CATEGORIE = "CAN_DELETE_CATEGORIE"

        const val CAN_VIEW_MARQUE_MENU = "CAN_VIEW_MARQUE_MENU"
        const val CAN_VIEW_MARQUE_LIST = "CAN_VIEW_MARQUE_LIST"
        const val CAN_VIEW_MARQUE_INFO = "CAN_VIEW_MARQUE_INFO"
        const val CAN_ADD_MARQUE = "CAN_ADD_MARQUE"
        const val CAN_UPDATE_MARQUE = "CAN_UPDATE_MARQUE"
        const val CAN_DELETE_MARQUE = "CAN_DELETE_MARQUE"

        const val CAN_VIEW_GROUPEMENT_MENU = "CAN_VIEW_GROUPEMENT_MENU"
        const val CAN_VIEW_GROUPEMENT_LIST = "CAN_VIEW_GROUPEMENT_LIST"
        const val CAN_VIEW_GROUPEMENT_INFO = "CAN_VIEW_GROUPEMENT_INFO"
        const val CAN_ADD_GROUPEMENT = "CAN_ADD_GROUPEMENT"
        const val CAN_UPDATE_GROUPEMENT = "CAN_UPDATE_GROUPEMENT"
        const val CAN_DELETE_GROUPEMENT = "CAN_DELETE_GROUPEMENT"


        const val CAN_VIEW_PRODUIT_MENU = "CAN_VIEW_PRODUIT_MENU"
        const val CAN_VIEW_PRODUIT_LIST = "CAN_VIEW_PRODUIT_LIST"
        const val CAN_VIEW_PRODUIT_INFO = "CAN_VIEW_PRODUIT_INFO"
        const val CAN_ADD_PRODUIT = "CAN_ADD_PRODUIT"
        const val CAN_UPDATE_PRODUIT = "CAN_UPDATE_PRODUIT"
        const val CAN_DELETE_PRODUIT = "CAN_DELETE_PRODUIT"

        const val CAN_VIEW_IMAGE_ARTICLE = "CAN_VIEW_IMAGE_ARTICLE"
        const val CAN_ADD_IMAGE_ARTICLE = "CAN_ADD_IMAGE_ARTICLE"
        const val CAN_UPDATE_IMAGE_ARTICLE = "CAN_UPDATE_IMAGE_ARTICLE"
        const val CAN_DELETE_IMAGE_ARTICLE = "CAN_DELETE_IMAGE_ARTICLE"




        const val CAN_VIEW_STATISTIQUE_MENU = "CAN_VIEW_STATISTIQUE_MENU"
        const val CAN_VIEW_STATISTIQUE_LIST = "CAN_VIEW_STATISTIQUE_LIST"

    }
}



@Value("\${mgf.app.frontend.url}")
const val CROSS_ORIGIN =""