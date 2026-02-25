import { CreateUserInput, UserResponse } from '../schemas/user.schema';

// Business Logic Pura - Independiente de Fastify
export class UserService {
    // Simulación de DB para el proyecto base
    private users: UserResponse[] = [];
    private idCounter = 1;

    async createUser(data: CreateUserInput): Promise<UserResponse> {
        // Aquí normalmente iría Drizzle: await db.insert(users).values(data).returning()
        const newUser: UserResponse = {
            id: this.idCounter++,
            name: data.name,
            email: data.email,
            createdAt: new Date(),
        };
        this.users.push(newUser);
        return newUser;
    }

    async getAllUsers(): Promise<UserResponse[]> {
        // Aquí normalmente: await db.select().from(users)
        return this.users;
    }
}

export const userService = new UserService();
