export type TRole = "STUDENT" | "ADMIN";

export interface AuthActionState {
	success: boolean;
	message: string;
	errors: { field: string; message: string }[];
	data?: {
		accessToken?: string;
		refreshToken?: string;
		user?: { id: string; name: string; email: string; role: TRole };
	};
}
