// Type definitions that mirror the Restful-Booker API contract.
// Keeping request/response shapes in one place makes schema assertions
// consistent across every test and gives us editor autocompletion.

export interface BookingDates {
  checkin: string; // ISO date, e.g. "2025-01-10"
  checkout: string; // ISO date, e.g. "2025-01-15"
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

// POST /booking wraps the created record in { bookingid, booking }.
export interface CreatedBooking {
  bookingid: number;
  booking: Booking;
}

// GET /booking returns a list of { bookingid } objects.
export interface BookingIdRef {
  bookingid: number;
}

// POST /auth response.
export interface AuthResponse {
  token: string;
}
