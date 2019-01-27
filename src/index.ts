import Express, { Request } from 'express';
import graphqlHTTP from 'express-graphql';
import session from 'express-session';
import { createSchema } from 'ts2graphql';
import { config } from './config';
import { db, DBUser } from './graphql/fakedb';
import { query } from './graphql/implementation';
import { printSchema } from 'graphql';
import cors from 'cors';
// const bundler = new Bundler(__dirname + '/../front/src/index.html', { cache: false });
// express.use((bundler as any).middleware());

export interface ReqWithUser extends Request {
	currentUser: DBUser | undefined;
}

const express = Express();
express.use(session({ secret: config.secret, resave: true, saveUninitialized: true }));
express.use(cors());

express.use((req, res, next) => {
	const currentUserId = '1';
	db.user.findById(currentUserId).then(user => {
		(req as ReqWithUser).currentUser = user;
		next();
	});
});

const schema = createSchema(__dirname + '/graphql/schema.d.ts');
express.get(
	'/api/graphql',
	graphqlHTTP({
		schema: schema,
		rootValue: query,
		graphiql: true,
	}),
);
express.post(
	'/api/graphql',
	graphqlHTTP({
		schema: schema,
		rootValue: query,
		formatError(err) {
			console.error(err);
			return err;
		},
	}),
);

express.use((err: any, _: Express.Request, res: Express.Response, _next: Express.NextFunction) => {
	console.error(err);
	return res.status(400).send({ status: 'error', error: '' });
});

express.listen(4000, () =>
	console.log(
		'server is running on http://localhost:4000, graphql: http://localhost:4000/api/graphql',
	),
);

declare const type = '__typename';
