import { Booking } from '../models/booking.model';

// A small test-data builder. Centralising object creation means a test only
// specifies the fields it cares about, and everything else gets a sensible
// default. This keeps tests readable and avoids duplicated literals.
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: 'Aswini',
    lastname: 'QA',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2025-01-10',
      checkout: '2025-01-15',
    },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
