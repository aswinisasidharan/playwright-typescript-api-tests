import { test, expect } from '../src/fixtures/api.fixtures';
import { buildBooking } from '../src/utils/booking.builder';
import { CreatedBooking } from '../src/models/booking.model';

// Focused CRUD coverage — each operation verified in isolation with clear
// status-code and body assertions.
test.describe('Booking API — CRUD', () => {
  test('POST creates a booking and echoes the payload @e2e', async ({
    bookingClient,
  }) => {
    const payload = buildBooking({ firstname: 'Create', lastname: 'Test' });

    const response = await bookingClient.createBooking(payload);
    expect(response.status()).toBe(200);

    const body = (await response.json()) as CreatedBooking;
    expect(body.bookingid).toBeGreaterThan(0);
    expect(body.booking.firstname).toBe('Create');
    expect(body.booking.totalprice).toBe(payload.totalprice);
  });

  test('GET returns a previously created booking @e2e', async ({
    bookingClient,
  }) => {
    const created = await bookingClient.createBooking(buildBooking());
    const { bookingid } = (await created.json()) as CreatedBooking;

    const response = await bookingClient.getBooking(bookingid);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('firstname');
    expect(body).toHaveProperty('bookingdates');
  });

  test('PUT fully updates a booking when authenticated @e2e', async ({
    bookingClient,
    authToken,
  }) => {
    const created = await bookingClient.createBooking(buildBooking());
    const { bookingid } = (await created.json()) as CreatedBooking;

    const updated = buildBooking({ firstname: 'Updated', totalprice: 999 });
    const response = await bookingClient.updateBooking(
      bookingid,
      updated,
      authToken,
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe('Updated');
    expect(body.totalprice).toBe(999);
  });

  test('PATCH partially updates a booking when authenticated @e2e', async ({
    bookingClient,
    authToken,
  }) => {
    const created = await bookingClient.createBooking(
      buildBooking({ firstname: 'Before' }),
    );
    const { bookingid } = (await created.json()) as CreatedBooking;

    const response = await bookingClient.patchBooking(
      bookingid,
      { firstname: 'After' },
      authToken,
    );
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.firstname).toBe('After');
  });

  test('DELETE removes a booking when authenticated @e2e', async ({
    bookingClient,
    authToken,
  }) => {
    const created = await bookingClient.createBooking(buildBooking());
    const { bookingid } = (await created.json()) as CreatedBooking;

    const response = await bookingClient.deleteBooking(bookingid, authToken);
    // Restful-Booker returns 201 Created on a successful delete.
    expect(response.status()).toBe(201);

    // Confirm it's gone.
    const getResponse = await bookingClient.getBooking(bookingid);
    expect(getResponse.status()).toBe(404);
  });
});
