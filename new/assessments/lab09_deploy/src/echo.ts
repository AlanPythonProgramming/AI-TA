import { InputError } from './errors';

export function echo(message: string) {
  if (message === 'echo') {
    throw new InputError("Cannot echo 'echo' lolsss!");
  }
  return { message };
}
