import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity, UserModule } from 'src/user';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { UserStoreDTO } from 'src/user/dto/user.dto';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository: Partial<UserRepository> = {
    insertWithTransaction: jest.fn(),
    countByUserName: jest.fn(),
    countByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .compile();

    service = module.get<UserService>(UserService);
  });

  it('should have the it defined', () => {
    expect(service).toBeDefined();
  });

  describe('#store', () => {
    const userData: UserStoreDTO = {
      username: 'username',
      password: 'password',
      email: 'email',
      phone: 'phone',
      displayName: 'displayName',
    };
    const user: UserEntity = {
      id: '1',
      username: 'username',
      password: 'password',
      email: 'email',
      phone: 'phone',
      displayName: 'displayName',
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    };
    beforeEach(() => {
      jest.spyOn(mockUserRepository, 'countByUserName').mockResolvedValue(0);
      jest.spyOn(mockUserRepository, 'countByEmail').mockResolvedValue(0);
      jest.spyOn(mockUserRepository, 'store').mockResolvedValue(user);
    });

    it('should be defined', () => {
      expect(service.store).toBeDefined();
    });

    it('should success when store successfully', async () => {
      const response = await service.store(userData);

      expect(response).toEqual({
        username: user.username,
        email: user.email,
        phone: user.phone,
        displayName: user.displayName,
      });
    });

    it('should fail when username already exists', async () => {
      jest
        .spyOn(mockUserRepository, 'countByUserName')
        .mockResolvedValueOnce(1);

      await expect(service.store(userData)).rejects.toThrow();
    });

    it('should fail when email already exists', async () => {
      jest.spyOn(mockUserRepository, 'countByEmail').mockResolvedValueOnce(1);

      await expect(service.store(userData)).rejects.toThrow();
    });

    it('should fail when repository fail to store', async () => {
      jest
        .spyOn(mockUserRepository, 'store')
        .mockRejectedValueOnce(new Error('repository error'));

      await expect(service.store(userData)).rejects.toThrow();
    });
  });
});
