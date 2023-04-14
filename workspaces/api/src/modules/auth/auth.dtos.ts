import { IsString } from "class-validator";

export class AdminTokenGenerateDto {
  @IsString()
  userEmail: string;
}

export class AdminLoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class VerifyTokenDto {
  @IsString()
  token: string;
}
