export interface Person {
  personId: number;
  name: string;
  age: number;
}

interface DataStore {
  people: Person[];
  // For id deletion for people deletion requirement
  numPeopleCreated: number;
}

const dataStore: DataStore = {
  people: [],
  numPeopleCreated: 0,
};

export const getData = () => dataStore;
