import 'dotenv/config';
import pg from 'pg';
import argon2 from 'argon2';
import express from 'express';
import jwt from 'jsonwebtoken';
import ClientError from './lib/client-error.js';
import errorMiddleware from './lib/error-middleware.js';
import { authorizationMiddleware } from './lib/authorization-middleware.js';

// eslint-disable-next-line no-unused-vars -- Remove when used
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/build', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

// Sign up
app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "users" ("username", "hashedPassword", "email")
      values ($1, $2, $3)
      returning *
    `;
    const params = [username, hashedPassword, email];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// Sign in
app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
      select "userId",
            "hashedPassword"
        from "users"
      where "username" = $1
    `;
    const params = [username];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { userId, hashedPassword } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { userId, username };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

// Get lists
app.get('/api/lists', async (req, res, next) => {
  try {
    const sql = `
      SELECT *
        FROM "lists"
    `;
    const result = await db.query(sql);
    res.status(201).json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Get meds in a list
app.get('/api/listContent/:listId', async (req, res, next) => {
  try {
    const listId = Number(req.params.listId);
    if (!Number.isInteger(listId) || listId < 1) {
      throw new ClientError(400, 'listId must be a positive integer.');
    }
    const sql = `
      SELECT *
        FROM "listContent"
        JOIN "lists" USING ("listId")
        WHERE "listId" = $1 AND "userId" = $2
        order by "listContentId" desc;
    `;
    const params = [listId];
    const result = await db.query(sql, params);
    res.status(201).json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Add meds to list
app.post('/api/listContent/:listId', async (req, res, next) => {
  try {
    const listId = Number(req.params.listId);
    if (!Number.isInteger(listId) || listId < 1) {
      throw new ClientError(400, 'listContentId must be a positive integer.');
    }

    const { medicationId, genericName, dosage, route, frequency } = req.body;

    if (
      !medicationId ||
      !genericName ||
      !dosage ||
      !route ||
      !frequency ||
      !listId
    ) {
      throw new ClientError(
        400,
        'medicationId, genericName, dosage, route, frequency, and listId are required fields'
      );
    }
    const sql = `
      INSERT INTO "listContent" ("medicationId", "genericName", "dosage", "route", "frequency", "listId")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const params = [
      medicationId,
      genericName,
      dosage,
      route,
      frequency,
      listId,
    ];
    const result = await db.query(sql, params);
    const [entry] = result.rows;
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

// Add a list
app.post('/api/list', async (req, res, next) => {
  try {
    const { name, userId } = req.body;

    if (!name) {
      throw new ClientError(400, 'Name of table is a required');
    }
    const sql = `
      INSERT INTO "lists" ("name", "userId")
      VALUES ($1, $2)
      RETURNING *;
    `;
    const params = [name, userId];
    const result = await db.query(sql, params);
    const [table] = result.rows;
    res.status(201).json(table);
  } catch (err) {
    next(err);
  }
});

// Update meds in a list
app.put(
  '/api/listContent/:listContentId',
  authorizationMiddleware,
  async (req, res, next) => {
    try {
      const listContentId = Number(req.params.listContentId);
      if (!Number.isInteger(listContentId || listContentId < 1)) {
        throw new ClientError(400, 'listContentId must be a positve integer.');
      }

      const { medicationId, genericName, dosage, route, frequency, listId } =
        req.body;
      if (
        !listContentId ||
        !medicationId ||
        !genericName ||
        !dosage ||
        !route ||
        !frequency ||
        !listId
      ) {
        throw new ClientError(
          400,
          'listContentId, medicationId, genericName, dosage, route, frequency, and listId are required fields'
        );
      }

      const sql = `
      UPDATE "listContent"
        SET "medicationId" = $1,
            "genericName" = $2,
            "dosage" = $3,
            "route" = $4,
            "frequency" = $5
        WHERE "listContentId" = $6 AND "listId" = $7
        RETURNING *;
    `;
      const params = [
        medicationId,
        genericName,
        dosage,
        route,
        frequency,
        listContentId,
        listId,
      ];
      const result = await db.query(sql, params);
      const [listContent] = result.rows;
      if (!listContent) {
        throw new ClientError(
          404,
          `List content with id ${listContentId} not found`
        );
      }
      res.status(201).json(listContent);
    } catch (err) {
      next(err);
    }
  }
);

// Update list name
app.put(
  '/api/lists/:listId',
  authorizationMiddleware,
  async (req, res, next) => {
    try {
      const listId = Number(req.params.listId);
      const { name } = req.body;
      if (!Number.isInteger(listId) || !name) {
        throw new ClientError(400, 'listId and name are required fields');
      }
      const sql = `
      UPDATE "lists"
        SET "name" = $1
        WHERE "listId" = $2 AND "userId" = $3
        RETURNING *;
    `;
      const params = [name, listId, req.user.userId];
      const result = await db.query(sql, params);
      const [list] = result.rows;
      if (!list) {
        throw new ClientError(404, `List with id ${listId} not found`);
      }
      res.status(201).json(list);
    } catch (err) {
      next(err);
    }
  }
);

// Delete a medication from list
app.delete(
  '/api/listContent/:listContentId',
  authorizationMiddleware,
  async (req, res, next) => {
    try {
      const listContentId = Number(req.params.listContentId);
      if (!Number.isInteger(listContentId) || !listContentId < 1) {
        throw new ClientError(400, 'listContentId must be a positive integer');
      }

      const { listId } = req.body;
      if (!listId) {
        throw new ClientError(400, 'listId is a required field');
      }

      const sql = `
      DELETE from "listContent"
        WHERE "listContentId" = $1 AND "listId" = $2
        RETURNING *;
    `;

      const params = [listContentId, listId];
      const result = await db.query(sql, params);
      const [deleted] = result.rows;
      if (!deleted) {
        throw new ClientError(
          404,
          `List content with id ${listContentId} not found`
        );
      }
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

// Delete a list
app.delete(
  '/api/list/:listId',
  authorizationMiddleware,
  async (req, res, next) => {
    try {
      const listId = Number(req.params.listId);
      if (!Number.isInteger(listId) || listId < 1) {
        throw new ClientError(400, 'listId must be a positive integer.');
      }
      const sql = `
      Delete from "lists"
        where "listId" = $1 AND "userId" = $2
        returning *;
    `;
      const params = [listId, req.user.userId];
      const result = await db.query(sql, params);
      const [deleted] = result.rows;
      if (!deleted) {
        throw new ClientError(404, `list with id ${listId} not found`);
      }
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Serves React's index.html if no api route matches.
 *
 * Implementation note:
 * When the final project is deployed, this Express server becomes responsible
 * for serving the React files. (In development, the Create React App server does this.)
 * When navigating in the client, if the user refreshes the page, the browser will send
 * the URL to this Express server instead of to React Router.
 * Catching everything that doesn't match a route and serving index.html allows
 * React Router to manage the routing.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
