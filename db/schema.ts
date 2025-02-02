import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  googleId: text("google_id").unique().notNull(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  meals: many(meals),
}));

export const mealsRelations = relations(meals, ({ one }) => ({
  user: one(users, {
    fields: [meals.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertMealSchema = createInsertSchema(meals);
export const selectMealSchema = createSelectSchema(meals);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertMeal = typeof meals.$inferInsert;
export type SelectMeal = typeof meals.$inferSelect;
