import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserStoreDTO } from 'src/user/dto/user.dto';

describe('UserDTO', () => {
  describe('UserStoreDTO', () => {
    const passDTO: UserStoreDTO = {
      username: 'username',
      password: 'password',
      email: 'email@example.com',
      phone: '0965599132',
      displayName: 'displayName',
    };
    it('should fail if send empty object', async () => {
      const errors = await validate(plainToInstance(UserStoreDTO, {}));
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should pass if send valid object', async () => {
      const errors = await validate(plainToInstance(UserStoreDTO, passDTO));
      expect(errors.length).toBe(0);
    });

    describe('#username', () => {
      it('should fail if username not provided', async () => {
        const dto = {
          ...passDTO,
        };
        delete dto.username;

        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBeGreaterThan(0);
      });
      it('should fail if send empty username', async () => {
        const dto = {
          ...passDTO,
          username: '',
        };

        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBeGreaterThan(0);
      });
      it('should fail if send username not a string', async () => {
        const dto = {
          ...passDTO,
          username: 123,
        };

        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    describe('#password', () => {
      it('should fail if password not provided', async () => {
        const dto = {
          ...passDTO,
        };
        delete dto.password;

        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBeGreaterThan(0);
      });
      it('should fail if send empty password', async () => {
        const dto = {
          ...passDTO,
          password: '',
        };

        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBeGreaterThan(0);
      });
      it('should fail if send password not a string', async () => {
        const dto = {
          ...passDTO,
          password: 123,
        };

        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    describe('#email', () => {
      it('should pass if email not provided', async () => {
        const dto = {
          ...passDTO,
        };
        delete dto.email;

        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBe(0);
      });
      it('should fail if send empty email', async () => {
        const dto = {
          ...passDTO,
          email: '',
        };

        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBeGreaterThan(0);
      });
      it('should fail if send email not a string', async () => {
        const dto = {
          ...passDTO,
          email: 123,
        };

        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBeGreaterThan(0);
      });
      it('should fail if not a valid email', async () => {
        const dto = {
          ...passDTO,
          email: 'notvalid@',
        };
        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    describe('#phone', () => {
      it('should pass if phone not provided', async () => {
        const dto = {
          ...passDTO,
        };
        delete dto.phone;

        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBe(0);
      });
      it('should fail if send empty phone', async () => {
        const dto = {
          ...passDTO,
          phone: '',
        };

        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBeGreaterThan(0);
      });
      it('should fail if send phone not a string', async () => {
        const dto = {
          ...passDTO,
          phone: 123,
        };

        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBeGreaterThan(0);
      });
      it('should fail if not a valid Vietnamese phone', async () => {
        const dto = {
          ...passDTO,
          phone: '12345',
        };

        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    describe('#displayName', () => {
      it('should fail if displayName not provided', async () => {
        const dto = {
          ...passDTO,
        };
        delete dto.displayName;

        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBeGreaterThan(0);
      });
      it('should fail if send empty displayName', async () => {
        const dto = {
          ...passDTO,
          displayName: '',
        };

        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBeGreaterThan(0);
      });
      it('should fail if send displayName not a string', async () => {
        const dto = {
          ...passDTO,
          displayName: 123,
        };

        const errors = await validate(plainToInstance(UserStoreDTO, dto));
        expect(errors.length).toBeGreaterThan(0);
      });
    });
  });
});
