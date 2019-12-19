import { Gebruiker } from '../auth/models/gebruiker.model';

export class Actie {
    id: string;
    omschrijving: string;
    tijdstip: Date;
    wie: Gebruiker;
}
