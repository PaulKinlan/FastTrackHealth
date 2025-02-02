import type { Express } from "express";
import { createServer } from "http";
import { db } from "@db";
import { meals, users } from "@db/schema";
import { desc, eq } from "drizzle-orm";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@db";

const PgSession = connectPgSimple(session);

export function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Session setup
  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "session",
      }),
      secret: "your-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production" },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let [user] = await db
            .select()
            .from(users)
            .where(eq(users.googleId, profile.id));

          if (!user) {
            [user] = await db
              .insert(users)
              .values({
                googleId: profile.id,
                email: profile.emails![0].value,
                name: profile.displayName,
                avatarUrl: profile.photos?.[0]?.value,
              })
              .returning();
          }

          done(null, user);
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  app.get("/api/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"],
  }));

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.get("/api/auth/user", (req, res) => {
    res.json(req.user || null);
  });

  app.post("/api/auth/signout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  // Meal routes
  app.get("/api/meals", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userMeals = await db
      .select()
      .from(meals)
      .where(eq(meals.userId, (req.user as any).id))
      .orderBy(desc(meals.timestamp))
      .limit(100);

    res.json(userMeals);
  });

  app.post("/api/meals", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [meal] = await db
      .insert(meals)
      .values({
        userId: (req.user as any).id,
      })
      .returning();

    res.json(meal);
  });

  return httpServer;
}
