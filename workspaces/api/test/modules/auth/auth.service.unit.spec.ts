import { faker } from "@faker-js/faker";
import { HttpService } from "@nestjs/axios";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "src/modules/auth/auth.service";
import { ConnectionService } from "src/modules/connection/connection.service";
import { DeveloperService } from "src/modules/developer/developer.service";
import { ProjectService } from "src/modules/project/project.service";

describe("AuthService", () => {
  let service: AuthService;
  let developerService: DeveloperService;

  const mockDeveloper = {
    id: faker.datatype.uuid(),
    name: faker.name.firstName(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: DeveloperService,
          useValue: {
            getDeveloperByEmail: jest.fn(),
          },
        },
        {
          provide: ConnectionService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockImplementation((payload) => payload),
          },
        },
        {
          provide: ProjectService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    developerService = module.get<DeveloperService>(DeveloperService);
  });

  describe("adminGenerateToken", () => {
    let getDeveloperByEmailSpy: jest.SpyInstance;

    beforeEach(() => {
      getDeveloperByEmailSpy = jest.spyOn(
        developerService,
        "getDeveloperByEmail"
      );
    });

    test("should return a token", async () => {
      getDeveloperByEmailSpy.mockResolvedValue(mockDeveloper);
      const token = await service.adminGenerateToken({
        userEmail: faker.internet.email(),
      });

      expect(token).toBeDefined();
    });

    test("should throw an error if the user is not found", async () => {
      getDeveloperByEmailSpy.mockResolvedValue(null);

      const token = service.adminGenerateToken({
        userEmail: faker.internet.email(),
      });

      await expect(token).rejects.toThrowError(BadRequestException);
    });
  });

  describe("adminLogin", () => {
    let getDeveloperByEmailSpy: jest.SpyInstance;

    beforeEach(() => {
      const adminEmail = faker.internet.email();
      const adminPassword = faker.internet.password();
      process.env.ADMIN_EMAIL = adminEmail;
      process.env.ADMIN_PASSWORD = adminPassword;

      getDeveloperByEmailSpy = jest.spyOn(
        developerService,
        "getDeveloperByEmail"
      );
    });

    test("should return a token", async () => {
      getDeveloperByEmailSpy.mockResolvedValue(mockDeveloper);

      const token = await service.adminLogin({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });

      expect(token).toBeDefined();
    });

    test("should throw an error if the email is wrong", async () => {
      getDeveloperByEmailSpy.mockResolvedValue(mockDeveloper);

      const token = service.adminLogin({
        email: faker.internet.email(),
        password: process.env.ADMIN_PASSWORD,
      });

      await expect(token).rejects.toThrowError(UnauthorizedException);
    });

    test("should throw an error if the password is wrong", async () => {
      getDeveloperByEmailSpy.mockResolvedValue(mockDeveloper);

      const token = service.adminLogin({
        email: process.env.ADMIN_EMAIL,
        password: faker.internet.password(),
      });

      await expect(token).rejects.toThrowError(UnauthorizedException);
    });
  });
});
