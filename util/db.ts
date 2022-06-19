import { Client } from "postgress";
import "dotenv/load.ts";

export interface Article {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const client = new Client({
  user: Deno.env.get("DB_USER"),
  database: Deno.env.get("POSTGRES_DB"),
  hostname: Deno.env.get('DB_HOST'),
  password: Deno.env.get('DB_PASSWORD'),
  port: Deno.env.get('DB_PORT'),
});

await client.connect();

export const findAllArticles = async () => {
  try {
    const result = await client.queryObject<Article>(
      "SELECT * FROM articles ORDER BY created_at DESC"
    );
    return result.rows;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export const findArticleById = async (id: string) => {
  try {
    const result = await client.queryObject<Article>(
      "SELECT * FROM articles WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return null
    }
    return result.rows[0];
  } catch (e) {
    console.error(e);
    return null;
  }
}

export const createArticle = async (article: Pick<Article, 'title' | 'content'>) => {
  try {
    const result = await client.queryObject<Article>(
      "INSERT INTO articles (title, content) VALUES ($1, $2) RETURNING *",
      [article.title, article.content]
    );
    return result.rows[0];
  } catch (e) {
    console.error(e);
    return null;
  }
}