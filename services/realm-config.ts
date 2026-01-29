import Realm from 'realm';

// User Schema
export class UserData extends Realm.Object {
  id!: number;
  email!: string;
  fullName!: string;
  phone!: string;
  createdAt!: string;

  static schema: Realm.ObjectSchema = {
    name: 'UserData',
    primaryKey: 'id',
    properties: {
      id: 'int',
      email: 'string',
      fullName: 'string',
      phone: 'string?',
      createdAt: 'string',
    },
  };
}

// AuthToken Schema
export class AuthToken extends Realm.Object {
  id!: string;
  token!: string;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'AuthToken',
    primaryKey: 'id',
    properties: {
      id: 'string',
      token: 'string',
      createdAt: 'date',
    },
  };
}

// Realm configuration
export const realmConfig: Realm.Configuration = {
  schema: [UserData, AuthToken],
  schemaVersion: 1,
};

// Singleton Realm instance
let realmInstance: Realm | null = null;

export const getRealm = async (): Promise<Realm> => {
  if (!realmInstance) {
    realmInstance = await Realm.open(realmConfig);
  }
  return realmInstance;
};

export const closeRealm = () => {
  if (realmInstance && !realmInstance.isClosed) {
    realmInstance.close();
    realmInstance = null;
  }
};
