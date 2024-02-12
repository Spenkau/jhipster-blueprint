import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 19938,
};

export const sampleWithPartialData: ITask = {
  id: 4947,
  name: 'for whole',
};

export const sampleWithFullData: ITask = {
  id: 26602,
  name: 'although',
};

export const sampleWithNewData: NewTask = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
