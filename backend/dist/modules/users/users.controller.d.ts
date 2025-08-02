import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        email: string;
        username: string;
        password: string;
        avatar: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
