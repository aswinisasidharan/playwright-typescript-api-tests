import { test, expect } from '../src/fixtures/api.fixtures';
import { buildBooking } from '../src/utils/booking.builder';

// Destructive / negative testing — deliberately misuse the API and assert it
// fails safely. The Storefront role calls out "explorative and destructive"
// testing explicitly, so these cover auth gaps, bad input, and missing data.
test.describe('Booking API — negative & destructive @negative', () => {
  test('GET a non-existent booking returns 404', async ({ bookingClient }) => {
    const response = await bookingClient.getBooking(99999999);
    expect(response.status()).toBe(404);
  });

  test('PUT without a valid token is rejected (403)', async ({
    bookingClient,
  }) => {
    const response = await bookingClient.updateBooking(
      1,
      buildBooking(),
      'invalid-or-missing-token',
    );
    // No valid session -> Restful-Booker refuses the write with 403 Forbidden.
    expect(response.status()).toBe(403);
  });

  test('DELETE without a valid token is rejected (403)', async ({
    bookingClient,
  }) => {
    const response = await bookingClient.deleteBooking(1, 'not-a-real-token');
    expect(response.status()).toBe(403);
  });

  test('POST with a malformed payload does not succeed', async ({ request }) => {
    // Send a body that violates the contract (missing required fields, wrong
    // types). A well-behaved API must not return 200 for this.
    const response = await request.post('/booking', {
      data: { firstname: 12345, totalprice: 'not-a-number' },
    });
    expect(response.status()).not.toBe(200);
  });

  test('GET a booking with a non-numeric id never returns a 5xx', async ({
    request,
  }) => {
    const response = await request.get('/booking/not-an-id');
    // Bad input should surface as a client error, never a server crash.
    expect(response.status()).toBeLessThan(500);
  });
});
