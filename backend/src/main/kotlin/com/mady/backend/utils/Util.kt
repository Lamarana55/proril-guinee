package com.mady.backend.utils

import org.springframework.beans.factory.annotation.Value

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


        const val CAN_VIEW_CATEGORIE_MENU = "CAN_VIEW_CATEGORIE_MENU"
        const val CAN_VIEW_CATEGORIE_LIST = "CAN_VIEW_CATEGORIE_LIST"
        const val CAN_VIEW_CATEGORIE_INFO = "CAN_VIEW_CATEGORIE_INFO"
        const val CAN_ADD_CATEGORIE = "CAN_ADD_CATEGORIE"
        const val CAN_UPDATE_CATEGORIE = "CAN_UPDATE_CATEGORIE"
        const val CAN_DELETE_CATEGORIE = "CAN_DELETE_CATEGORIE"

        const val CAN_VIEW_IMAGE_ARTICLE = "CAN_VIEW_IMAGE_ARTICLE"
        const val CAN_ADD_IMAGE_ARTICLE = "CAN_ADD_IMAGE_ARTICLE"
        const val CAN_UPDATE_IMAGE_ARTICLE = "CAN_UPDATE_IMAGE_ARTICLE"
        const val CAN_DELETE_IMAGE_ARTICLE = "CAN_DELETE_IMAGE_ARTICLE"


        const val CAN_VIEW_QUESTION_MENU = "CAN_VIEW_QUESTION_MENU"
        const val CAN_VIEW_QUESTION_LIST = "CAN_VIEW_QUESTION_LIST"
        const val CAN_VIEW_QUESTION_INFO = "CAN_VIEW_QUESTION_INFO"
        const val CAN_ADD_QUESTION = "CAN_ADD_QUESTION"
        const val CAN_UPDATE_QUESTION = "CAN_UPDATE_QUESTION"
        const val CAN_DELETE_QUESTION = "CAN_DELETE_QUESTION"

        const val CAN_VIEW_TYPE_CAS_MENU = "CAN_VIEW_TYPE_CAS_MENU"
        const val CAN_VIEW_TYPE_CAS_LIST = "CAN_VIEW_TYPE_CAS_LIST"
        const val CAN_VIEW_TYPE_CAS_INFO = "CAN_VIEW_TYPE_CAS_INFO"
        const val CAN_ADD_TYPE_CAS = "CAN_ADD_TYPE_CAS"
        const val CAN_UPDATE_TYPE_CAS = "CAN_UPDATE_TYPE_CAS"
        const val CAN_DELETE_TYPE_CAS = "CAN_DELETE_TYPE_CAS"

        const val CAN_VIEW_TYPE_APPUI_MENU = "CAN_VIEW_TYPE_APPUI_MENU"
        const val CAN_VIEW_TYPE_APPUI_LIST = "CAN_VIEW_TYPE_APPUI_LIST"
        const val CAN_VIEW_TYPE_APPUI_INFO = "CAN_VIEW_TYPE_APPUI_INFO"
        const val CAN_ADD_TYPE_APPUI = "CAN_ADD_TYPE_APPUI"
        const val CAN_UPDATE_TYPE_APPUI = "CAN_UPDATE_TYPE_APPUI"
        const val CAN_DELETE_TYPE_APPUI = "CAN_DELETE_TYPE_APPUI"

        const val CAN_VIEW_SURVEILLANCE_MENU = "CAN_VIEW_SURVEILLANCE_MENU"
        const val CAN_VIEW_SURVEILLANCE_LIST = "CAN_VIEW_SURVEILLANCE_LIST"
        const val CAN_VIEW_SURVEILLANCE_INFO = "CAN_VIEW_SURVEILLANCE_INFO"
        const val CAN_ADD_SURVEILLANCE = "CAN_ADD_SURVEILLANCE"
        const val CAN_UPDATE_SURVEILLANCE = "CAN_UPDATE_SURVEILLANCE "
        const val CAN_DELETE_SURVEILLANCE = "CAN_DELETE_SURVEILLANCE"

        const val CAN_VIEW_PARTENAIRE_MENU = "CAN_VIEW_PARTENAIRE_MENU"
        const val CAN_VIEW_PARTENAIRE_LIST = "CAN_VIEW_PARTENAIRE_LIST"
        const val CAN_VIEW_PARTENAIRE_INFO = "CAN_VIEW_PARTENAIRE_INFO"
        const val CAN_ADD_PARTENAIRE = "CAN_ADD_PARTENAIRE"
        const val CAN_UPDATE_PARTENAIRE = "CAN_UPDATE_PARTENAIRE "
        const val CAN_DELETE_PARTENAIRE = "CAN_DELETE_PARTENAIRE"

        const val CAN_VIEW_STATISTIQUE_MENU = "CAN_VIEW_STATISTIQUE_MENU"
        const val CAN_VIEW_STATISTIQUE_LIST = "CAN_VIEW_STATISTIQUE_LIST"

    }
}



@Value("\${mgf.app.frontend.url}")
const val CROSS_ORIGIN =""