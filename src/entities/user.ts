export interface UserProps {
  name: string;
  email: string;
  id: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date | null; // Inicialmente será null
}

export class User {
  private props: UserProps;

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get id() {
    return this.props.id;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get deletedAt() {
    return this.props.deletedAt ?? null;
  }

  set deletedAt(value: Date | null) {
    this.props.deletedAt = value;
  }

  constructor(props: UserProps) {
    if (!props.name || props.name.trim() === "") {
      throw new Error("Name cannot be empty!");
    }

    if (!props.email || props.email.trim() === "") {
      throw new Error("Email is required");
    }

    if (props.name.length < 3) {
      throw new Error("Name must contain at least 3 characters");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(props.email)) {
      throw new Error("Invalid email");
    }

    this.props = props;
  }
}
