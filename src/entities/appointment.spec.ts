import { test, expect } from "vitest";
import { Appointment } from "./appointment";
import { getFutureDate } from "../tests/utils/get-future-date";

test("create an appointment", () => {
  const startsAt = getFutureDate("2022-02-28");
  const endsAt = getFutureDate("2022-03-01");

  const appointment = new Appointment({
    customer: "John Doe",
    startsAt,
    endsAt,
  });

  expect(appointment).toBeInstanceOf(Appointment);
  expect(appointment.customer).toBe("John Doe");
  expect(appointment.startsAt).toBeInstanceOf(Date);
  expect(appointment.endsAt).toBeInstanceOf(Date);
  expect(appointment.startsAt).toEqual(startsAt);
  expect(appointment.endsAt).toEqual(endsAt);
});

test("cannot create an appointment with end date before start date", () => {
  const startsAt = getFutureDate("2022-02-28");
  const endsAt = getFutureDate("2022-02-27");

  expect(() => {
    new Appointment({
      customer: "John Doe",
      startsAt,
      endsAt,
    });
  }).toThrowError(new Error("End date cannot be before start date"));
});

test("cannot create an appointment with start date before now", () => {
  const startsAt = new Date(new Date().setDate(new Date().getDate() - 1));
  const endsAt = new Date(new Date().setDate(new Date().getDate() + 1));

  expect(() => {
    new Appointment({
      customer: "John Doe",
      startsAt,
      endsAt,
    });
  }).toThrowError(new Error("Start date cannot be before now"));
});
