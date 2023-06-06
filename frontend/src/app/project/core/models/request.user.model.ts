export interface RequestUserParam {
    nom?: string;
    prenom?: string;
    telephone?: string;
    email?: string;
    idRegion?: number;
    idPrefecture?: number;
    idCommune?: number;
    idQuartier?: number;
    idSecteur?: number;
    role?: string;
    page?: number; 
    size?: number;
  }