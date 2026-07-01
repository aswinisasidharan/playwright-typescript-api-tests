import { test as base } from '@playwright/test';
import { AuthClient } from '../clients/auth.client';
import { BookingClient } from '../clients/booking.client';

// Custom fixtures extend Playwright's base `test`. Instead of every spec
// newing-up clients and fetching a token by hand, we declare them once here
// and Playwright injects them per-test. This is the API equivalent of wiring
// up Page Objects for UI tests, and it keeps specs focused on behaviour.
type ApiFixtures = {
  authClient: AuthClient;
  bookingClient: BookingClient;
  authToken: string;
};

export const test = base.extend<ApiFixtures>({
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },

  bookingClient: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  // Depends on authClient — Playwright resolves the graph automatically, so any
  // test that asks for `authToken` gets a fresh, valid token with no boilerplate.
  authToken: async ({ authClient }, use) => {
    const token = await authClient.createToken();
    await use(token);
  },
});

export { expect } from '@playwright/test';
