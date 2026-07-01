import { test, expect } from '../src/fixtures/api.fixtures';

// Smoke tests answer one question: "is the API alive and serving its most
// critical path?" They must be fast and stable, so they run on every deploy
// as a gate. Tagged @smoke.
test.describe('API — smoke @smoke', () => {
  test('health check responds to /ping', async ({ bookingClient }) => {
    const response = await bookingClient.ping();
    // Restful-Booker's health endpoint returns 201 Created on success.
    expect(response.status()).toBe(201);
  });

  test('booking list endpoint returns 200 and an array', async ({
    bookingClient,
  }) => {
    const response = await bookingClient.getBookingIds();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    // Contract check: every item exposes a numeric bookingid.
    expect(body[0]).toHaveProperty('bookingid');
    expect(typeof body[0].bookingid).toBe('number');
  });

  test('auth endpoint issues a token', async ({ authToken }) => {
    expect(authToken).toBeTruthy();
    expect(authToken.length).toBeGreaterThan(0);
  });
});
