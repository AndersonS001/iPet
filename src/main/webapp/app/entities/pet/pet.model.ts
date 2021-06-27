import * as dayjs from 'dayjs';
import { ITutor } from 'app/entities/tutor/tutor.model';
import { Especie } from 'app/entities/enumerations/especie.model';

export interface IPet {
  id?: number;
  nome?: string | null;
  dataNascimento?: dayjs.Dayjs | null;
  especie?: Especie | null;
  peso?: number | null;
  fotoContentType?: string | null;
  foto?: string | null;
  tutors?: ITutor[] | null;
}

export class Pet implements IPet {
  constructor(
    public id?: number,
    public nome?: string | null,
    public dataNascimento?: dayjs.Dayjs | null,
    public especie?: Especie | null,
    public peso?: number | null,
    public fotoContentType?: string | null,
    public foto?: string | null,
    public tutors?: ITutor[] | null
  ) {}
}

export function getPetIdentifier(pet: IPet): number | undefined {
  return pet.id;
}
