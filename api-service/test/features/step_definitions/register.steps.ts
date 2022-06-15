import { Test, TestingModule } from '@nestjs/testing';
import { binding, then, when, before, given } from 'cucumber-tsflow';
import { AppModule } from '../../../src/app.module';


// When('I register', function () {

// });

// Then('I should receive a password', function () {
//   return 'pending';
// });

class Context {
  public app;
  public response;
}

@binding([Context])
export class RegisterSteps {
  private email;

  constructor(protected context: Context) { }

  @before()
  public async before(): Promise<void> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.context.app = moduleFixture.createNestApplication();
    await this.context.app.init();
  }

  @given('I have an e-mail that has not been registered before')
  public setEmail() {
    this.email = "user@mail.com"
  }
}
