import { IConsulta } from 'app/entities/consulta/consulta.model';
import { TipoRemedio } from 'app/entities/enumerations/tipo-remedio.model';

export interface IRemedios {
  id?: number;
  nome?: string | null;
  fabricante?: string | null;
  tipo?: TipoRemedio | null;
  consultas?: IConsulta[] | null;
}

export class Remedios implements IRemedios {
  constructor(
    public id?: number,
    public nome?: string | null,
    public fabricante?: string | null,
    public tipo?: TipoRemedio | null,
    public consultas?: IConsulta[] | null
  ) {}
}

export function getRemediosIdentifier(remedios: IRemedios): number | undefined {
  return remedios.id;
}
