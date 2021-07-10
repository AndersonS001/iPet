import * as dayjs from 'dayjs';
import { IPet } from 'app/entities/pet/pet.model';
import { TipoVacina } from 'app/entities/enumerations/tipo-vacina.model';

export interface IVacina {
  id?: number;
  nome?: string | null;
  dataAplicacao?: dayjs.Dayjs | null;
  tipo?: TipoVacina | null;
  pets?: IPet[] | null;
}

export class Vacina implements IVacina {
  constructor(
    public id?: number,
    public nome?: string | null,
    public dataAplicacao?: dayjs.Dayjs | null,
    public tipo?: TipoVacina | null,
    public pets?: IPet[] | null
  ) {}
}

export function getVacinaIdentifier(vacina: IVacina): number | undefined {
  return vacina.id;
}
