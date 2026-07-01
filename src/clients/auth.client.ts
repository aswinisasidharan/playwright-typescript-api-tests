import { APIRequestContext, expect } from '@playwright/test';
import { AuthResponse } from '../models/booking.model';

// Service object for the /auth endpoint. Wrapping the raw HTTP call behind a
// method keeps token logic in one place, so tests read as intent
// ("get me a token") rather than transport detail.
export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  async createToken(
    username = 'admin',
    password = 'password123',
  ): Promise<string> {
    const response = await this.request.post('/auth', {
      data: { username, password },
    });

    expect(response.status(), 'auth should return 200').toBe(200);

    const body = (await response.json()) as AuthResponse;
    expect(body.token, 'auth response should contain a token').toBeTruthy();

    return body.token;
  }
}
