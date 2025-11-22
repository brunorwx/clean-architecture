export class User {
	readonly id: string;
	readonly name: string;
	readonly email: string;

	private constructor(props: { id: string; name: string; email: string }) {
		this.id = props.id;
		this.name = props.name;
		this.email = props.email;
	}

	static create(props: { id?: string; name: string; email: string }) {
		const id = props.id ?? `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
		// Basic email validation
		const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
		if (!emailRegex.test(props.email)) {
			throw new Error('Invalid email');
		}
		if (!props.name || props.name.trim().length === 0) {
			throw new Error('Name is required');
		}

		return new User({ id, name: props.name.trim(), email: props.email.trim().toLowerCase() });
	}
}

