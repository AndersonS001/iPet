import { IConsulta } from 'app/entities/consulta/consulta.model';

export interface IExame {
  id?: number;
  especialidade?: string | null;
  medico?: string | null;
  valor?: number | null;
  resultadoContentType?: string | null;
  resultado?: string | null;
  consulta?: IConsulta | null;
}

export class Exame implements IExame {
  constructor(
    public id?: number,
    public especialidade?: string | null,
    public medico?: string | null,
    public valor?: number | null,
    public resultadoContentType?: string | null,
    public resultado?: string | null,
    public consulta?: IConsulta | null
  ) {}
}

export function getExameIdentifier(exame: IExame): number | undefined {
  return exame.id;
}
