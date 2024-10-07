export interface AppointmentProps {
  customer: string;
  startsAt: Date;
  endsAt: Date;
}

export class Appointment {
  private props: AppointmentProps;

  get customer() {
    return this.props.customer;
  }

  get startsAt() {
    return this.props.startsAt;
  }

  get endsAt() {
    return this.props.endsAt;
  }

  constructor(props: AppointmentProps) {
    this.props = props;

    if (this.startsAt <= new Date()) {
      throw new Error("Start date cannot be before now");
    }

    if (this.endsAt <= this.startsAt) {
      throw new Error("End date cannot be before start date");
    }
  }
}
