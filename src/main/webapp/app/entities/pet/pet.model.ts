import * as dayjs from 'dayjs';
import { IConvenio } from 'app/entities/convenio/convenio.model';
import { IVacina } from 'app/entities/vacina/vacina.model';
import { IConsulta } from 'app/entities/consulta/consulta.model';
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
  convenios?: IConvenio[] | null;
  vacinas?: IVacina[] | null;
  consultas?: IConsulta[] | null;
  tutor?: ITutor | null;
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
    public convenios?: IConvenio[] | null,
    public vacinas?: IVacina[] | null,
    public consultas?: IConsulta[] | null,
    public tutor?: ITutor | null
  ) {}
}

export function getPetIdentifier(pet: IPet): number | undefined {
  return pet.id;
}
