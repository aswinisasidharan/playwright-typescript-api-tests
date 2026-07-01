import { test, expect } from '../src/fixtures/api.fixtures';
import { buildBooking } from '../src/utils/booking.builder';
import { CreatedBooking } from '../src/models/booking.model';

// End-to-end flow: exercise the full lifecycle of a booking in a single test,
// the way a real consumer of the API would — create, read, update, then
// delete — asserting state at every hop.
test.describe('Booking API — end-to-end lifecycle @e2e', () => {
  test('create -> read -> update -> delete a booking', async ({
    bookingClient,
    authToken,
  }) => {
    // 1. Create
    const createResponse = await bookingClient.createBooking(
      buildBooking({ firstname: 'Lifecycle', lastname: 'Journey' }),
    );
    expect(createResponse.status()).toBe(200);
    const { bookingid } = (await createResponse.json()) as CreatedBooking;

    // 2. Read back
    const readResponse = await bookingClient.getBooking(bookingid);
    expect(readResponse.status()).toBe(200);
    expect((await readResponse.json()).firstname).toBe('Lifecycle');

    // 3. Update (authenticated)
    const updateResponse = await bookingClient.updateBooking(
      bookingid,
      buildBooking({
        firstname: 'Lifecycle',
        lastname: 'Updated',
        totalprice: 500,
      }),
      authToken,
    );
    expect(updateResponse.status()).toBe(200);
    expect((await updateResponse.json()).totalprice).toBe(500);

    // 4. Delete (authenticated)
    const deleteResponse = await bookingClient.deleteBooking(
      bookingid,
      authToken,
    );
    expect(deleteResponse.status()).toBe(201);

    // 5. Verify removal
    const verifyResponse = await bookingClient.getBooking(bookingid);
    expect(verifyResponse.status()).toBe(404);
  });
});
