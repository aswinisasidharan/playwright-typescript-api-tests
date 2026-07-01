import { APIRequestContext, APIResponse } from '@playwright/test';
import { Booking } from '../models/booking.model';

// Service object for the /booking endpoints. Every method returns the raw
// APIResponse so individual tests stay in control of their own assertions
// (status codes, headers, body). The client's job is to encapsulate the URL,
// payload shape, and auth wiring — not to decide what "pass" means.
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  getBookingIds(): Promise<APIResponse> {
    return this.request.get('/booking');
  }

  getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  createBooking(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  // PUT/PATCH/DELETE require a token. Restful-Booker accepts it either as a
  // Cookie header or a custom Authorisation header — we use the cookie form.
  updateBooking(
    id: number,
    booking: Booking,
    token: string,
  ): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
      data: booking,
    });
  }

  patchBooking(
    id: number,
    partial: Partial<Booking>,
    token: string,
  ): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
      data: partial,
    });
  }

  deleteBooking(id: number, token: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
  }

  ping(): Promise<APIResponse> {
    return this.request.get('/ping');
  }
}
