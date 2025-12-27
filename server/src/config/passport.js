import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import pool from "../utils/db.js";

dotenv.config();

console.log("GOOGLE CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE CALLBACK:", process.env.GOOGLE_CALLBACK_URL);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        let user;

        if (result.rows.length === 0) {
          const newUser = await pool.query(
            `
            INSERT INTO users (firstname, lastname, username, birthdate, email, password)
            VALUES ($1, $2, $3, '2000-01-01', $4, '')
            RETURNING *
            `,
            [
              profile.name.givenName,
              profile.name.familyName,
              profile.displayName,
              email,
            ]
          );
          user = newUser.rows[0];
        } else {
          user = result.rows[0];
        }

        return done(null, user);
      } catch (err) {
        console.error("GOOGLE STRATEGY ERROR:", err);
        return done(err, null);
      }
    }
  )
)

export default passport
