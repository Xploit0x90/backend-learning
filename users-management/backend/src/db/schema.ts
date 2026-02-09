import {pgTable, serial, text, varchar, integer, timestamp, pgEnum} from 'drizzle-orm/pg-core'
import {relations} from "drizzle-orm"

export const statusEnum = pgEnum('status', ['todo','in_progress','done'])

export const users = pgTable('users', {
    id: serial("id").primaryKey(),
    email: varchar("email", {length:255}).notNull().unique(),
    password: varchar("password", {length:255}).notNull(),
    name: varchar("name", {length:100}).notNull(),
    age: integer("age").notNull(), 
    createdAt: timestamp("created_at").defaultNow()
})

export const projects = pgTable('projects', {
    id: serial("id").primaryKey(),
    name: varchar("name", {length:100}).notNull(),
    userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").defaultNow()
}
)

export const tasks = pgTable("tasks",{
    id: serial("id").primaryKey(),
    name: varchar("name", {length:100}).notNull(),
    status: statusEnum("status").notNull().default('todo'),
    projectId: integer("project_id").notNull().references( () => projects.id, {onDelete: 'cascade'}),
    assignedUserId: integer("assigned_user_id").notNull().references(() => users.id, {onDelete: 'cascade'}),
})

// User relations (one user has many tasks and many projects)
export const usersRelations = relations(users, ({ many }) => ({
    assignedTasks: many(tasks),
    projects: many(projects)
}));

// Project relations (one project has many tasks, belongs to one user)
export const projectsRelations = relations(projects, ({ many, one }) => ({
    tasks: many(tasks),
    user: one(users, { fields: [projects.userId], references: [users.id] })
}));

// Task relations (task belongs to one project and one user)
export const tasksRelations = relations(tasks, ({ one }) => ({
    project: one(projects, {
        fields: [tasks.projectId],
        references: [projects.id]
    }),
    assignedUser: one(users, {
        fields: [tasks.assignedUserId],
        references: [users.id]
    })
}));