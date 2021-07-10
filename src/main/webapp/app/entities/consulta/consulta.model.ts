import { IRemedios } from 'app/entities/remedios/remedios.model';
import { IExame } from 'app/entities/exame/exame.model';
import { IConvenio } from 'app/entities/convenio/convenio.model';
import { IPet } from 'app/entities/pet/pet.model';

export interface IConsulta {
  id?: number;
  especialidade?: string | null;
  medico?: string | null;
  valor?: number | null;
  receitaContentType?: string | null;
  receita?: string | null;
  remedios?: IRemedios[] | null;
  exames?: IExame[] | null;
  convenios?: IConvenio[] | null;
  pets?: IPet[] | null;
}

export class Consulta implements IConsulta {
  constructor(
    public id?: number,
    public especialidade?: string | null,
    public medico?: string | null,
    public valor?: number | null,
    public receitaContentType?: string | null,
    public receita?: string | null,
    public remedios?: IRemedios[] | null,
    public exames?: IExame[] | null,
    public convenios?: IConvenio[] | null,
    public pets?: IPet[] | null
  ) {}
}

export function getConsultaIdentifier(consulta: IConsulta): number | undefined {
  return consulta.id;
}
