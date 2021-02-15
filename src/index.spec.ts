import { ParsedRow } from './interfaces/ParsedRow';
import SheetConnection, { Config } from './';
import { WhereCondition } from './interfaces/WhereCondition';
import { AbstractModel } from './models/AbstractModel';
import { worksheet } from './decorators/worksheet';
import { Auth } from 'googleapis';
import { column } from './decorators/column';
const clearModule = require('clear-module');

const mockParsedRows: ParsedRow[] = [
  {
    name: 'John Doe',
    url: 'www.atlas.cz',
    age: '8',
  },
];
const mockParsedRowsMultiline: ParsedRow[] = [
  {
    name: 'John Doe',
    url: 'www.atlas.cz',
    age: '8',
  },
  {
    name: 'Zack MacFront',
    url: 'www.centrum.cz',
    age: '10',
  },
  {
    name: 'Elania Beer',
    url: 'www.atlas.cz',
    age: '8',
  },
];

const mockWhere: WhereCondition = {
  name: (val: string | number) => val === 'John Doe',
  url: 'www.atlas.cz',
  age: '8',
};

const mockWhereUniversal: WhereCondition = {
  url: 'www.atlas.cz',
  age: '8',
};

describe('Apply where condition', () => {
  beforeEach(() => {
    clearModule('./index.ts');
  });

  test('Multiple where condition on one item, return only one item', () => {
    let iP = new (SheetConnection as any)({ disableSingleton: true });
    expect((iP as any).applyWhere(mockParsedRows, mockWhere)).toMatchSnapshot();
  });
  test('Two where condition on multiple items, should return two items.', () => {
    let iP = new (SheetConnection as any)({ disableSingleton: true });
    expect((iP as any).applyWhere(mockParsedRowsMultiline, mockWhereUniversal)).toMatchSnapshot();
  });
  test('Without where condition should return all  items.', () => {
    let iP = new (SheetConnection as any)({ disableSingleton: true });
    expect((iP as any).applyWhere(mockParsedRowsMultiline, {})).toMatchSnapshot();
  });
});

describe('parseRowsFromMetaFilter', () => {
  beforeEach(() => {
    clearModule('./index.ts');
  });

  test('It should parse sheet data', () => {
    const fixture = require('./__fixtures__/parseRowsFromMetaFilter.js');
    const iP = new (SheetConnection as any)({ disableSingleton: true }) as any;
    const output = iP.parseRowsFromMetaFilter(fixture);
    expect(output).toMatchSnapshot();
  });
});

describe('readAndWrite', () => {
  @worksheet(2088806053)
  class Model extends AbstractModel {
    @column
    id: string
    @column
    string: string
  }

  const authClient = new Auth.OAuth2Client()
  authClient.setCredentials({ access_token: '<censored>' })
  let connection: SheetConnection
  const str = Math.random().toString()
  
  beforeAll(async () => {
    connection = await SheetConnection.connect({ spreadsheetId: '11CF9K9biUAHy_3ZqcOm0I-EPgl22jdM2g5YT-j3Q1NU', migrate: 'drop', authClient, disableSingleton: true } as Config)
    await connection.dropModel(Model)
  })

  test('It should successfully validates', async () => {
    expect(await connection.validateModel(Model)).not.toBeFalsy()
  })
  test('It should successfully write', async () => {
    const m = new Model();
    m.id = 'test'
    m.string = str
    console.log(await connection.setInfo(m))
  })
  test('It should successfully read', async () => {
    const m = await connection.getInfos(Model)
    expect(m).toMatchObject([{
      id: 'test',
      string: str
    }])
  })
})