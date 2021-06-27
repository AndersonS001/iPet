import { IExame } from 'app/entities/exame/exame.model';
import { IRemedios } from 'app/entities/remedios/remedios.model';

export interface IConsulta {
  id?: number;
  especialidade?: string | null;
  medico?: string | null;
  valor?: number | null;
  receitaContentType?: string | null;
  receita?: string | null;
  exames?: IExame[] | null;
  remedios?: IRemedios[] | null;
}

export class Consulta implements IConsulta {
  constructor(
    public id?: number,
    public especialidade?: string | null,
    public medico?: string | null,
    public valor?: number | null,
    public receitaContentType?: string | null,
    public receita?: string | null,
    public exames?: IExame[] | null,
    public remedios?: IRemedios[] | null
  ) {}
}

export function getConsultaIdentifier(consulta: IConsulta): number | undefined {
  return consulta.id;
}
