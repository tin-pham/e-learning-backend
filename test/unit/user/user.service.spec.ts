import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from 'src/user';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository: Partial<UserRepository> = {};

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
    // const userData: UserEntity = {
    //   username: 'username',
    //   password: 'password',
    //   email: 'email',
    //   phone: 'phone',
    //   displayName: 'displayName',
    // };
    beforeEach(() => {
      jest.spyOn(service, 'store');
    });

    it('should be defined', () => {
      expect(service.store).toBeDefined();
    });
  });
});
