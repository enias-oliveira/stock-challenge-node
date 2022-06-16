import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { binding, then, when, before, given } from 'cucumber-tsflow';
import { AppModule } from '../../../src/app.module';
import * as request from 'supertest';
import assert from 'assert';


// When('I register', function () {

// });

// Then('I should receive a password', function () {
//   return 'pending';
// });

class Context {
  public app: INestApplication;
  public response: request.Response;
  public email: string;
}

@binding([Context])
export class RegisterSteps {
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
    this.context.email = "user@mail.com"
  }

  @when('I register with user role')
  public async register() {
    const body = {
      email: this.context.email,
      role: 'user'
    }

    const post = request(this.context.app.getHttpServer()).post('/register');

    const response = await post.send(body)

    this.context.response = response
  }


  @then('I should receive a password of 32 characters long')
  public async receivedPassword() {
    return this.context.response.body?.password === 32;
  }
}
