import Express from 'express';
import graphqlHTTP from 'express-graphql';
import session from 'express-session';
import { config } from './config';
import { rootSchema, rootValues } from './graphql/schema';

// const bundler = new Bundler(__dirname + '/../front/src/index.html', { cache: false });
// express.use((bundler as any).middleware());

const express = Express();
express.use(session({ secret: config.secret, resave: true, saveUninitialized: true }));

express.use(
    '/api/graphql',
    graphqlHTTP({
        schema: rootSchema,
        rootValue: rootValues,
        graphiql: true,
    })
);

express.use((err: any, _: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    console.error(err);
    return res.status(400).send({ status: 'error', error: '' });
});
express.listen(4000, () => console.log('server is running on http://localhost:4000, graphql: http://localhost:4000/api/graphql'));
