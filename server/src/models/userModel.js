import bcryptjs from "bcryptjs";
import { randomUUID } from "crypto";
import { pool } from "../db/connectDb.js";

const mapUser = (row) => {
  if (!row) return null;

  return {
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    username: row.username,
    email: row.email,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

const normalizeEmail = (email) => email.trim().toLowerCase();

export const findUserByUsernameOrEmail = async (username, email) => {
  const { rows } = await pool.query(
    `
      SELECT id, first_name, last_name, username, email, created_at, updated_at
      FROM users
      WHERE username = $1 OR email = $2
      LIMIT 1
    `,
    [username.trim(), normalizeEmail(email)],
  );

  return mapUser(rows[0]);
};

export const findUserForLogin = async (identifier) => {
  const trimmedIdentifier = identifier.trim();
  const isEmail = trimmedIdentifier.includes("@");

  const { rows } = await pool.query(
    `
      SELECT id, first_name, last_name, username, email, password_hash, created_at, updated_at
      FROM users
      WHERE ${isEmail ? "email = $1" : "username = $1"}
      LIMIT 1
    `,
    [isEmail ? normalizeEmail(trimmedIdentifier) : trimmedIdentifier],
  );

  const row = rows[0];
  if (!row) return null;

  return {
    ...mapUser(row),
    passwordHash: row.password_hash,
  };
};

export const findUserById = async (id) => {
  const { rows } = await pool.query(
    `
      SELECT id, first_name, last_name, username, email, created_at, updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return mapUser(rows[0]);
};

export const createUser = async ({
  firstName,
  lastName,
  username,
  email,
  password,
}) => {
  const id = randomUUID();
  const passwordHash = await bcryptjs.hash(password, 10);

  const { rows } = await pool.query(
    `
      INSERT INTO users (
        id,
        first_name,
        last_name,
        username,
        email,
        password_hash
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, first_name, last_name, username, email, created_at, updated_at
    `,
    [
      id,
      firstName.trim(),
      lastName.trim(),
      username.trim(),
      normalizeEmail(email),
      passwordHash,
    ],
  );

  return mapUser(rows[0]);
};
