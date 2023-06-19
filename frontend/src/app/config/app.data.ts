export enum LOCALITE {
    REGION = 'REGION',
    PREFECTURE = 'PREFECTURE',
    COMMUNE = 'COMMUNE',
    QUARTIER = 'QUARTIER',
    SECTEUR = 'SECTEUR'
}
export enum STATUT{
    ACTIVE = 'ACTIVER',
    DESACTIVE = 'DESACTIVE'
  }

export enum OPTION_GET_USER{
    TOUT = 'TOUT',
    REGION = 'REGION',
    PREFECTURE = 'PREFECTURE',
}

export enum PERMISSIONS {
    CAN_VIEW_DASHBORD = 'CAN_VIEW_DASHBOARD',

    // PRODUIT
    CAN_VIEW_PRODUIT_MENU = 'CAN_VIEW_PRODUIT_MENU',
    CAN_VIEW_PRODUIT_LIST = 'CAN_VIEW_PRODUIT_LIST',
    CAN_VIEW_PRODUIT_INFO = 'CAN_VIEW_PRODUIT_INFO',
    CAN_ADD_PRODUIT = 'CAN_ADD_PRODUIT',
    CAN_UPDATE_PRODUIT = 'CAN_UPDATE_PRODUIT',
    CAN_DELETE_PRODUIT = 'CAN_DELETE_PRODUIT',

    // GROSSISTE
    CAN_VIEW_GROSSISTE_MENU = 'CAN_VIEW_GROSSISTE_MENU',
    CAN_VIEW_GROSSISTE_LIST = 'CAN_VIEW_GROSSISTE_LIST',
    CAN_VIEW_GROSSISTE_INFO = 'CAN_VIEW_GROSSISTE_INFO',
    CAN_ADD_GROSSISTE = 'CAN_ADD_GROSSISTE',
    CAN_UPDATE_GROSSISTE = 'CAN_UPDATE_GROSSISTE',
    CAN_DELETE_GROSSISTE = 'CAN_DELETE_GROSSISTE',
    CAN_UPDATE_GROSSISTE_STATUS = 'CAN_UPDATE_GROSSISTE_STATUS',

    // ARTICLE 
    CAN_VIEW_ARTICLE_MENU = "CAN_VIEW_ARTICLE_MENU",
    CAN_VIEW_ARTICLE_LIST = "CAN_VIEW_ARTICLE_LIST",
    CAN_VIEW_ARTICLE_INFO = "CAN_VIEW_ARTICLE_INFO",
    CAN_ADD_ARTICLE = "CAN_ADD_ARTICLE",
    CAN_UPDATE_ARTICLE = "CAN_UPDATE_ARTICLE",
    CAN_DELETE_ARTICLE = "CAN_DELETE_ARTICLE", 
    
    // CATEGORIE_ARTICLE
    CAN_VIEW_CATEGORIE_ARTICLE_MENU = "CAN_VIEW_CATEGORIE_ARTICLE_MENU",
    CAN_VIEW_CATEGORIE_ARTICLE_LIST = "CAN_VIEW_CATEGORIE_ARTICLE_LIST",
    CAN_VIEW_CATEGORIE_ARTICLE_INFO = "CAN_VIEW_CATEGORIE_ARTICLE_INFO",
    CAN_ADD_CATEGORIE_ARTICLE = "CAN_ADD_CATEGORIE_ARTICLE",
    CAN_UPDATE_CATEGORIE_ARTICLE = "CAN_UPDATE_CATEGORIE_ARTICLE",
    CAN_DELETE_CATEGORIE_ARTICLE = "CAN_DELETE_CATEGORIE_ARTICLE", 


     // CATEGORIE
     CAN_VIEW_CATEGORIE_MENU = "CAN_VIEW_CATEGORIE_MENU",
     CAN_VIEW_CATEGORIE_LIST = "CAN_VIEW_CATEGORIE_LIST",
     CAN_VIEW_CATEGORIE_INFO = "CAN_VIEW_CATEGORIE_INFO",
     CAN_ADD_CATEGORIE = "CAN_ADD_CATEGORIE",
     CAN_UPDATE_CATEGORIE = "CAN_UPDATE_CATEGORIE",
     CAN_DELETE_CATEGORIE = "CAN_DELETE_CATEGORIE", 


     // CLIENT
     CAN_VIEW_CLIENT_MENU = "CAN_VIEW_CLIENT_MENU",
     CAN_VIEW_CLIENT_LIST = "CAN_VIEW_CLIENT_LIST",
     CAN_VIEW_CLIENT_INFO = "CAN_VIEW_CLIENT_INFO",
     CAN_ADD_CLIENT = "CAN_ADD_CLIENT",
     CAN_UPDATE_CLIENT = "CAN_UPDATE_CLIENT",
     CAN_DELETE_CLIENT = "CAN_DELETE_CLIENT",

     // VENTE
     CAN_VIEW_VENTE_MENU = "CAN_VIEW_VENTE_MENU",
     CAN_VIEW_VENTE_LIST = "CAN_VIEW_VENTE_LIST",
     CAN_VIEW_VENTE_INFO = "CAN_VIEW_VENTE_INFO",
     CAN_ADD_VENTE = "CAN_ADD_VENTE",
     CAN_UPDATE_VENTE = "CAN_UPDATE_VENTE",
     CAN_DELETE_VENTE = "CAN_DELETE_VENTE",

    // Marque
    CAN_VIEW_MARQUE_MENU = "CAN_VIEW_MARQUE_MENU",
    CAN_VIEW_MARQUE_LIST = "CAN_VIEW_MARQUE_LIST",
    CAN_VIEW_MARQUE_INFO = "CAN_VIEW_MARQUE_INFO",
    CAN_ADD_MARQUE = "CAN_ADD_MARQUE",
    CAN_UPDATE_MARQUE = "CAN_UPDATE_MARQUE",
    CAN_DELETE_MARQUE = "CAN_DELETE_MARQUE",

    // Groupement
    CAN_VIEW_GROUPEMENT_MENU = "CAN_VIEW_GROUPEMENT_MENU",
    CAN_VIEW_GROUPEMENT_LIST = "CAN_VIEW_GROUPEMENT_LIST",
    CAN_VIEW_GROUPEMENT_INFO = "CAN_VIEW_GROUPEMENT_INFO",
    CAN_ADD_GROUPEMENT = "CAN_ADD_GROUPEMENT",
    CAN_UPDATE_GROUPEMENT = "CAN_UPDATE_GROUPEMENT",
    CAN_DELETE_GROUPEMENT = "CAN_DELETE_GROUPEMENT",
    

    // Utilisateur
    CAN_VIEW_USER_MENU = 'CAN_VIEW_USER_MENU',
    CAN_VIEW_USERS_LIST = 'CAN_VIEW_USER_LIST',
    CAN_VIEW_USER_INFO = 'CAN_VIEW_USER_INFO',
    CAN_ADD_USER = 'CAN_ADD_USER',
    CAN_UPDATE_USER = 'CAN_UPDATE_USER',
    CAN_DELETE_USER = 'CAN_DELETE_USER',

    // Role
    CAN_VIEW_ROLE_MENU = 'CAN_VIEW_ROLE_MENU',
    CAN_VIEW_ROLES_LIST = 'CAN_VIEW_ROLE_LIST',
    CAN_VIEW_ROLE_INFO = 'CAN_VIEW_ROLE_INFO',
    CAN_ADD_ROLE = 'CAN_ADD_ROLE',
    CAN_UPDATE_ROLE = 'CAN_UPDATE_ROLE',
    CAN_DELETE_ROLE = 'CAN_DELETE_ROLE',


    // TYPE_GROSSISTE
    CAN_VIEW_TYPE_GROSSISTE_MENU = 'CAN_VIEW_TYPE_GROSSISTE_MENU',
    CAN_VIEW_TYPE_GROSSISTE_LIST = 'CAN_VIEW_TYPE_GROSSISTE_LIST',
    CAN_VIEW_TYPE_GROSSISTE_INFO = 'CAN_VIEW_TYPE_GROSSISTE_INFO',
    CAN_ADD_TYPE_GROSSISTE = 'CAN_ADD_TYPE_GROSSISTE',
    CAN_UPDATE_TYPE_GROSSISTE = 'CAN_UPDATE_TYPE_GROSSISTE',
    CAN_DELETE_TYPE_GROSSISTE = 'CAN_DELETE_TYPE_GROSSISTE',


    // STATISTIQUE
    CAN_VIEW_STATISTIQUE_MENU = 'CAN_VIEW_STATISTIQUE_MENU',
    CAN_VIEW_STATISTIQUE_LIST = 'CAN_VIEW_STATISTIQUE_LIST',
    CAN_VIEW_STATISTIQUE_INFO = 'CAN_VIEW_STATISTIQUE_INFO',
    CAN_ADD_STATISTIQUE = 'CAN_ADD_STATISTIQUE',
    CAN_UPDATE_STATISTIQUE = 'CAN_UPDATE_STATISTIQUE',
    CAN_DELETE_STATISTIQUE = 'CAN_DELETE_STATISTIQUE',
}

export const DATE_FORMAT = 'yyyy-MM-dd';

export const DISPLAY_DATE_FORMAT = 'dd/MM/yyyy';

export const TEL_PATTERN = /^[0-9]{9}$/;

export const SELECT_NUMBER_PATTERN = /^[1-9][0-9]*$/;

export const SELECT_EMAIL_PATTERN = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

export const NUMBER_ONLY_PATTERN = /^[0-9]*$/;

export const DESCRIPTION_MINIMUM_LENGTH = 4 ;


export enum STATUT_ALERTE {
    TRAITE = 'TRAITE',
    NON_TRAITE = 'NON_TRAITE'
}

export enum STATUT_CAS {
    EN_ATTENTE = 'EN_ATTENTE',
    EN_COURS = 'EN_COURS',
    TRAITE = 'TRAITE',
    ANNULE = 'ANNULE' 
}

export enum STATUT_PRODUITE {
    TRAITE = 'TRAITE',
    NON_TRAITE = 'NON_TRAITE'
}

export enum STATUT_GROSSISTE {
    EN_ATTENTE = 'EN_ATTENTE',
    EN_COURS = 'EN_COURS',
    TRAITE = 'TRAITE',
    ANNULE = 'ANNULE'
}

export enum ROLE_NAME{
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_GROSSISTE = 'ROLE_GROSSISTE',
    ROLE_ASSISTANT_ADMIN = 'ROLE_ASSISTANT_ADMIN',
    ROLE_CONSULTANT = 'ROLE_CONSULTANT'
}