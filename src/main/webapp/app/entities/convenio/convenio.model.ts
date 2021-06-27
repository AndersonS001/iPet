export interface IConvenio {
  id?: number;
  nome?: string | null;
  email?: string | null;
  valor?: number | null;
}

export class Convenio implements IConvenio {
  constructor(public id?: number, public nome?: string | null, public email?: string | null, public valor?: number | null) {}
}

export function getConvenioIdentifier(convenio: IConvenio): number | undefined {
  return convenio.id;
}