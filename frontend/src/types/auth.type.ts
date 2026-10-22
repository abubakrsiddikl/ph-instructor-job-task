export type TRole = "STUDENT" | "MENTOR";

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


export interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: TRole;
  createdAt: Date;
  updatedAt: Date;
//   projects?: Project[]; // Optional relation field
}
export interface ILoginResponse {
  user: IUser;
  accessToken: string;
}