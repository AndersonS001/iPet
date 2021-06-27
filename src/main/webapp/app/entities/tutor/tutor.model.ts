import * as dayjs from 'dayjs';
import { IPet } from 'app/entities/pet/pet.model';

export interface ITutor {
  id?: number;
  nome?: string | null;
  email?: string | null;
  dataNascimento?: dayjs.Dayjs | null;
  pet?: IPet | null;
}

export class Tutor implements ITutor {
  constructor(
    public id?: number,
    public nome?: string | null,
    public email?: string | null,
    public dataNascimento?: dayjs.Dayjs | null,
    public pet?: IPet | null
  ) {}
}

export function getTutorIdentifier(tutor: ITutor): number | undefined {
  return tutor.id;
}
