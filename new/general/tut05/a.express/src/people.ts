import { Person, getData } from './dataStore';

const findPerson = (personId: number): Person | undefined => {
  // NOTE: requires { "lib": ["ES2015"] } in tsconfig.json
  return getData().people.find(person => person.personId === personId);
};

const findPersonByName = (name: string): Person | undefined => {
  // NOTE: requires { "lib": ["ES2015"] } in tsconfig.json
  return getData().people.find(person => person.name === name);
};

export function clear() {
  getData().people = [];
  return {};
}

export function peopleAdd(name: string, age: number) {
  const data = getData();
  if (name === '') {
    return { error: 'Name is an empty string' };
  }
  if (findPersonByName(name) || age <= 0) {
    return { error: 'Name already exists or age is not strictly positive.' };
  }
  const person = { name, age, personId: data.numPeopleCreated };
  data.people.push(person);
  data.numPeopleCreated += 1;
  return { personId: person.personId };
}

export function peopleList(minAge: number) {
  const data = getData();
  if (minAge < 0) {
    return { error: 'minAge must be non-negative' };
  }
  const people = data.people
    .filter(p => p.age >= minAge)
    .sort((p1, p2) => p2.age - p1.age || p1.name.localeCompare(p2.name));
  return { people };
}

export function personView(personId: number) {
  const person = findPerson(personId);
  if (person === undefined) {
    return { error: 'no such person with given id ' };
  }
  return { person };
}

export function personEdit(personId: number, name: string, age: number) {
  const person = findPerson(personId);
  if (person === undefined) {
    return { error: 'name is empty or age is not strictly positive' };
  }
  if (!name || age <= 0 || (name !== person.name && findPersonByName(name))) {
    return { error: 'name is empty, age is not strictly positive or name is already taken' };
  }
  person.name = name;
  person.age = age;
  return {};
}

export function personRemove(personId: number) {
  if (!findPerson(personId)) {
    return { error: 'person with given id does not exist' };
  }
  const data = getData();
  data.people = getData().people.filter(person => person.personId !== personId);
  return {};
}

export function peopleStats() {
  const data = getData();
  if (data.people.length === 0) {
    return { error: 'no entries available in the data store' };
  }
  return {
    stats: {
      minAge: Math.min(...data.people.map(nameAge => nameAge.age)),
      maxAge: Math.max(...data.people.map(nameAge => nameAge.age)),
      averageAge: data.people.reduce((sum, nameAge) => sum + nameAge.age, 0) / data.people.length,
    }
  };
}
