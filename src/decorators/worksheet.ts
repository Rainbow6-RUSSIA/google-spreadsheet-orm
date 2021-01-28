import { AbstractModel } from '../models/AbstractModel';

/**
 * Adds information about worskheed into meta
 * @param  {number} workSheetId
 */
export const worksheet = (workSheetId: number) => (target: typeof AbstractModel) => {
  Reflect.defineMetadata('schema:workSheetId', workSheetId, target);
};
