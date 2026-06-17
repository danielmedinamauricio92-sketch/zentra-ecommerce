import LoginUserDto from "../dtos/loginUser.dto";
import RegisterUserDto from "../dtos/registerUser.dto";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/user.repository";
import { ClientError } from "../utils/errors";
import {
  checkPasswordService,
  createCredentialService,
} from "./credential.service";
import jwt from "jsonwebtoken";
import {
  FRONTEND_URL,
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  JWT_EXPIRES_IN,
  JWT_SECRET,
} from "../config/envs";

export type PublicUser = Omit<User, "credential">;

type GoogleUserInfo = {
  id: string;
  email: string;
  name: string;
  picture?: string;
};

const createSessionToken = (userId: number) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const toPublicUser = (user: User): PublicUser => {
  const { credential, ...publicUser } = user;
  return publicUser;
};

export const checkUserExists = async (email: string): Promise<boolean> => {
  const user = await UserRepository.findOneBy({ email });
  return !!user;
};

export const registerUserService = async (
  registerUserDto: RegisterUserDto
): Promise<User> => {
  const user = await UserRepository.create(registerUserDto);
  await UserRepository.save(user);
  const credential = await createCredentialService({
    password: registerUserDto.password,
  });
  user.credential = credential;
  await UserRepository.save(user);
  return user;
};

export const loginUserService = async (
  loginUserDto: LoginUserDto
): Promise<{ token: string; user: PublicUser }> => {
  const user: User | null = await UserRepository.findOne({
    where: {
      email: loginUserDto.email,
    },
    relations: ["credential", "orders"],
  });
  if (!user) throw new Error("User not found");
  if (!user.credential) {
    throw new ClientError("This account uses Google login", 401);
  }
  if (
    await checkPasswordService(loginUserDto.password, user.credential.password)
  ) {
    const token = createSessionToken(user.id);

    return {
      user: toPublicUser(user),
      token,
    };
  } else {
    throw new ClientError("Invalid password");
  }
};

export const getUserByIdService = async (
  userId: number
): Promise<PublicUser> => {
  const user = await UserRepository.findOneBy({ id: userId });

  if (!user) throw new ClientError("User not found", 404);

  return toPublicUser(user);
};

export const getGoogleAuthUrlService = () => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new ClientError("Google login is not configured", 500);
  }

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_CALLBACK_URL,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const loginWithGoogleService = async (
  code: string
): Promise<{ token: string; user: PublicUser }> => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new ClientError("Google login is not configured", 500);
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_CALLBACK_URL,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    error_description?: string;
  };

  if (!tokenResponse.ok || !tokenData.access_token) {
    throw new ClientError(
      tokenData.error_description || "Google token exchange failed",
      401
    );
  }

  const profileResponse = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );

  const googleUser = (await profileResponse.json()) as GoogleUserInfo;

  if (!profileResponse.ok || !googleUser.email) {
    throw new ClientError("Google profile could not be loaded", 401);
  }

  let user = await UserRepository.findOne({
    where: [{ googleId: googleUser.id }, { email: googleUser.email }],
  });

  if (!user) {
    user = UserRepository.create({
      name: googleUser.name,
      email: googleUser.email,
      address: "Pendiente de completar",
      phone: "Pendiente",
      googleId: googleUser.id,
      avatar: googleUser.picture,
    });
  } else {
    user.googleId = user.googleId || googleUser.id;
    user.avatar = googleUser.picture || user.avatar;
    user.name = user.name || googleUser.name;
  }

  const savedUser = await UserRepository.save(user);
  const token = createSessionToken(savedUser.id);

  return {
    user: toPublicUser(savedUser),
    token,
  };
};

export const getGoogleSuccessRedirect = () => `${FRONTEND_URL}/login?google=success`;
export const getGoogleErrorRedirect = () => `${FRONTEND_URL}/login?google=error`;
