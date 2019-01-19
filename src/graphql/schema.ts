import { buildSchema } from 'graphql';

export const rootSchema = buildSchema(`
type Query {
  hello: String
}
`);

export const rootValues = {
    hello() {
        return 'Hello world!';
    },
};
