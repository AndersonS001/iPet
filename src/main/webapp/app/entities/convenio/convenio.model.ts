import { IConsulta } from 'app/entities/consulta/consulta.model';
import { IPet } from 'app/entities/pet/pet.model';

export interface IConvenio {
  id?: number;
  nome?: string | null;
  plano?: string | null;
  valor?: number | null;
  consultas?: IConsulta[] | null;
  pets?: IPet[] | null;
}

export class Convenio implements IConvenio {
  constructor(
    public id?: number,
    public nome?: string | null,
    public plano?: string | null,
    public valor?: number | null,
    public consultas?: IConsulta[] | null,
    public pets?: IPet[] | null
  ) {}
}

export function getConvenioIdentifier(convenio: IConvenio): number | undefined {
  return convenio.id;
}
