import * as dayjs from 'dayjs';
import { TipoVacina } from 'app/entities/enumerations/tipo-vacina.model';

export interface IVacina {
  id?: number;
  nome?: string | null;
  dataAplicacao?: dayjs.Dayjs | null;
  tipo?: TipoVacina | null;
}

export class Vacina implements IVacina {
  constructor(
    public id?: number,
    public nome?: string | null,
    public dataAplicacao?: dayjs.Dayjs | null,
    public tipo?: TipoVacina | null
  ) {}
}

export function getVacinaIdentifier(vacina: IVacina): number | undefined {
  return vacina.id;
}
