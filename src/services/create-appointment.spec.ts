import { Appointment } from "../entities/appointment";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments";
import { getFutureDate } from "../tests/utils/get-future-date";
import { CreateAppointment } from "./create-appointment";
import { describe, expect, it } from "vitest";

describe("create an appointment", () => {
  it("should create an appointment", () => {
    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const createAppointment = new CreateAppointment(appointmentsRepository);

    const startsAt = getFutureDate("2022-02-28");
    const endsAt = getFutureDate("2022-03-01");

    createAppointment
      .execute({
        customer: "John Doe",
        startsAt,
        endsAt,
      })
      .then((appointment) => {
        expect(appointment).toBeInstanceOf(Appointment);
        expect(appointment.customer).toBe("John Doe");
        expect(appointment.startsAt).toBeInstanceOf(Date);
        expect(appointment.endsAt).toBeInstanceOf(Date);
        expect(appointment.startsAt).toEqual(startsAt);
        expect(appointment.endsAt).toEqual(endsAt);
      });
  });

  it("should not be able to create an appointment with overlapping dates", async () => {
    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const createAppointment = new CreateAppointment(appointmentsRepository);

    const startsAt = getFutureDate("2022-02-28");
    const endsAt = getFutureDate("2022-03-01");

    await createAppointment.execute({
      customer: "John Doe",
      startsAt,
      endsAt,
    });

    expect(
      createAppointment.execute({
        customer: "Jane Doe",
        startsAt: getFutureDate("2022-02-28"),
        endsAt: getFutureDate("2022-03-01"),
      })
    ).rejects.toThrowError(
      new Error("Appointment overlaps with another appointment")
    );
  });
});
