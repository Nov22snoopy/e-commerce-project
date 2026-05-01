import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { anything, capture, instance, mock, reset, verify, when } from 'ts-mockito';
import { UsersEntity, UserRole } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Builds a structurally-complete UsersEntity without calling the Sequelize
 * Model constructor, keeping tests fast and fully isolated from the database.
 */
function buildUser(
  overrides: Partial<Pick<UsersEntity, 'id' | 'email' | 'password' | 'role'>> = {},
): UsersEntity {
  const defaults: Pick<UsersEntity, 'id' | 'email' | 'password' | 'role'> = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    password: 'hashed_password',
    role: UserRole.USER,
  };
  return Object.assign(
    Object.create(UsersEntity.prototype) as UsersEntity,
    defaults,
    overrides,
  );
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('AuthService', () => {
  // Pure unit test — no NestJS DI container needed.
  // AuthService is instantiated directly with ts-mockito proxy instances.
  let authService: AuthService;
  let mockedUserService: UserService;
  let mockedJwtService: JwtService;

  beforeEach(() => {
    mockedUserService = mock(UserService);
    mockedJwtService = mock(JwtService);

    authService = new AuthService(
      instance(mockedUserService),
      instance(mockedJwtService),
    );
  });

  afterEach(() => {
    reset(mockedUserService);
    reset(mockedJwtService);
  });

  // =========================================================================
  // register()
  // =========================================================================

  describe('register', () => {
    it('should create a user and return an accessToken (happy path)', async () => {
      // Arrange
      const dto = { email: 'new@example.com', password: 'Password1!' };
      const createdUser = buildUser({ email: dto.email });
      when(mockedUserService.create(anything())).thenResolve(createdUser);
      when(mockedJwtService.sign(anything())).thenReturn('signed.jwt.token');

      // Act
      const result = await authService.register(dto);

      // Assert
      expect(result).toEqual({ accessToken: 'signed.jwt.token' });
      verify(mockedUserService.create(anything())).once();
      verify(mockedJwtService.sign(anything())).once();
    });

    it('should sign the JWT with sub, email and role from the created user', async () => {
      // Arrange
      const dto = { email: 'new@example.com', password: 'Password1!' };
      const createdUser = buildUser({ id: 'user-uuid-123', email: dto.email, role: UserRole.USER });
      when(mockedUserService.create(anything())).thenResolve(createdUser);
      when(mockedJwtService.sign(anything())).thenReturn('signed.jwt.token');

      // Act
      await authService.register(dto);

      // Assert
      const [capturedPayload] = capture(mockedJwtService.sign).last();
      expect(capturedPayload).toEqual({
        sub: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
      });
    });

    it('should propagate ConflictException without touching JwtService when email is taken', async () => {
      // Arrange
      const dto = { email: 'existing@example.com', password: 'Password1!' };
      when(mockedUserService.create(anything())).thenReject(
        new ConflictException('Email is already registered'),
      );

      // Act
      const act = authService.register(dto);

      // Assert
      await expect(act).rejects.toThrow(ConflictException);
      await expect(act).rejects.toThrow('Email is already registered');
      verify(mockedJwtService.sign(anything())).never();
    });
  });

  // =========================================================================
  // login()
  // =========================================================================

  describe('login', () => {
    it('should return an accessToken when credentials are valid (happy path)', async () => {
      // Arrange
      const plainPassword = 'correct_password';
      const hash = await bcrypt.hash(plainPassword, 1); // cost=1 for speed in tests
      const user = buildUser({ password: hash });
      when(mockedUserService.findByEmail(user.email)).thenResolve(user);
      when(mockedJwtService.sign(anything())).thenReturn('signed.jwt.token');

      // Act
      const result = await authService.login({ email: user.email, password: plainPassword });

      // Assert
      expect(result).toEqual({ accessToken: 'signed.jwt.token' });
      verify(mockedUserService.findByEmail(user.email)).once();
      verify(mockedJwtService.sign(anything())).once();
    });

    it('should sign the JWT with the correct payload on successful login', async () => {
      // Arrange
      const plainPassword = 'correct_password';
      const hash = await bcrypt.hash(plainPassword, 1);
      const user = buildUser({
        id: 'user-uuid-123',
        email: 'test@example.com',
        role: UserRole.USER,
        password: hash,
      });
      when(mockedUserService.findByEmail(user.email)).thenResolve(user);
      when(mockedJwtService.sign(anything())).thenReturn('signed.jwt.token');

      // Act
      await authService.login({ email: user.email, password: plainPassword });

      // Assert
      const [capturedPayload] = capture(mockedJwtService.sign).last();
      expect(capturedPayload).toEqual({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
    });

    it('should throw UnauthorizedException when the user email does not exist', async () => {
      // Arrange
      const dto = { email: 'ghost@example.com', password: 'any_password' };
      when(mockedUserService.findByEmail(dto.email)).thenResolve(null);

      // Act
      const act = authService.login(dto);

      // Assert
      await expect(act).rejects.toThrow(UnauthorizedException);
      await expect(act).rejects.toThrow('Invalid credentials');
      verify(mockedJwtService.sign(anything())).never();
    });

    it('should throw UnauthorizedException when the password does not match the stored hash', async () => {
      // Arrange
      const hash = await bcrypt.hash('correct_password', 1);
      const user = buildUser({ password: hash });
      when(mockedUserService.findByEmail(user.email)).thenResolve(user);

      // Act
      const act = authService.login({ email: user.email, password: 'wrong_password' });

      // Assert
      await expect(act).rejects.toThrow(UnauthorizedException);
      await expect(act).rejects.toThrow('Invalid credentials');
      verify(mockedJwtService.sign(anything())).never();
    });

    it('should return the same error message for missing user and wrong password to prevent user enumeration', async () => {
      // Arrange
      const hash = await bcrypt.hash('correct_password', 1);
      const existingUser = buildUser({ password: hash });
      when(mockedUserService.findByEmail('ghost@example.com')).thenResolve(null);
      when(mockedUserService.findByEmail(existingUser.email)).thenResolve(existingUser);

      // Act
      const notFoundError = await authService
        .login({ email: 'ghost@example.com', password: 'any' })
        .catch((e: Error) => e);
      const badPasswordError = await authService
        .login({ email: existingUser.email, password: 'wrong_password' })
        .catch((e: Error) => e);

      // Assert
      expect(notFoundError).toBeInstanceOf(UnauthorizedException);
      expect(badPasswordError).toBeInstanceOf(UnauthorizedException);
    });
  });
});
