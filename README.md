<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Clean Architecture NestJS Example

This repository demonstrates a small NestJS project organized using a Clean Architecture style. The intention is to make responsibilities explicit and to make it easy for junior developers to follow the pattern when adding new features.

Below you'll find a short guide describing the folder layout, responsibilities for each layer, common conventions used in this codebase, and a worked example for adding a new `User` feature.

**Why this structure?**
- Keeps domain logic (business rules) independent from framework and infrastructure details.
- Makes code easier to test and reason about.
- Makes it explicit where to add new code (domain, application, infrastructure, presentation).

---

**Quick start**

Install and run the app:

```bash
npm install
npm run start:dev
```

When the app starts it will log the URL, e.g. `Application is running on: http://localhost:3000`.

---

**Project layout (top-level)**

- `src/`
  - `app.module.ts` — root module, wires global modules like TypeORM
  - `main.ts` — application bootstrap (starts Nest and logs the URL)
  - `users/` — feature module following clean architecture
    - `application/` — DTOs, mappers and use-cases (application services)
      - `dto/` — input/output DTO definitions
      - `mappers/` — convert domain objects to responses and vice-versa
      - `use-cases/` — application use-cases (commands/queries)
    - `domain/` — pure domain logic
      - `entities/` — domain entities (business models)
      - `repositories/` — repository interfaces (abstractions)
      - `services/` — domain services (business rules that need repositories)
    - `infrastructure/` — framework and persistence implementations
      - `persistence/` — TypeORM entities and repository implementations
    - `presentation/` — controllers, request/response shapes

Files are grouped by feature (users) and then by layer. This makes it easier to find all code related to a feature.

---

**Layer responsibilities (short)**

- Domain: The heart of the application. Contains entities and rules. No framework or Nest imports here.
- Application: Orchestrates domain operations. Exposes use-cases that the presentation layer calls. Translates DTOs to domain models and vice versa.
- Infrastructure: Implements repository interfaces and any framework-specific code (TypeORM entities, external API clients, file storage).
- Presentation: Nest controllers and HTTP-specific request/response mappings.

---

- **Conventions used in this repo**

- Repository tokens: repository contracts are expressed as an exported `abstract class` (for example `export abstract class IUserRepository { ... }`). We bind a concrete implementation to that abstract class in the infrastructure module. This lets Nest use runtime type metadata so you can inject the repository using the `IUserRepository` type directly (no `@Inject` or `any` required).
- Use `User.create()` factory methods in domain entities for validation and invariants.
- Keep DTOs in `application/dto` as plain interfaces or classes (we can add `class-validator` later for runtime validation).
- Use `mappers` to convert domain entities to response objects: `toResponse(user)`.
- Keep controllers thin: they call use-cases and map results to responses.

---

How to add a new feature (step-by-step)
--------------------------------------

This section walks through adding a new `User` feature (the repo already includes a `users` example — follow this pattern):

1) Domain

- Create a domain entity in `src/users/domain/entities/user.entity.ts`:

```ts
export class User {
  readonly id: string;
  readonly name: string;
  readonly email: string;

  private constructor(props: { id: string; name: string; email: string }) { /* ... */ }

  static create(props: { id?: string; name: string; email: string }) {
    // validate email and name, create id if needed
  }
}
```

-- Add a repository contract in `src/users/domain/repositories/user.repository.ts` (use an abstract class as DI token):

```ts
import { User } from '../entities/user.entity';

export abstract class IUserRepository {
  abstract save(user: User): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
}
```

2) Application

- Add DTO(s) in `src/users/application/dto` (e.g. `create-user.dto.ts`):

```ts
export interface CreateUserDto { name: string; email: string }
```

-- Add use-cases in `src/users/application/use-cases` that orchestrate domain logic and repositories. Example `CreateUserUseCase` (inject the abstract class directly):

```ts
@Injectable()
export class CreateUserUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(dto: CreateUserDto) {
    const user = User.create(dto);
    await this.repo.save(user);
    return user;
  }
}
```

- Add mappers to transform domain entities to API responses in `src/users/application/mappers`:

```ts
export function toResponse(user: User) {
  return { id: user.id, name: user.name, email: user.email };
}
```

3) Infrastructure (TypeORM persistence)

- Create a TypeORM entity in `src/users/infrastructure/persistence/user.orm-entity.ts`:

```ts
@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn() id: string;
  @Column() name: string;
  @Column({ unique: true }) email: string;
}
```

-- Implement the repository that maps between the ORM entity and the domain entity (see `src/users/infrastructure/persistence/user.orm-repository.ts`). Register it in a module with `TypeOrmModule.forFeature([...])` and provide it under the `IUserRepository` abstract-class token. Example provider:

```ts
@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [{ provide: IUserRepository, useClass: TypeOrmUserRepository }],
  exports: [IUserRepository],
})
export class UserRepositoryModule {}
```

4) Presentation

- Add a controller in `src/users/presentation/controllers/users.controller.ts`:

```ts
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  @Post()
  async create(@Body() body: any) {
    const user = await this.createUserUseCase.execute(body);
    return toResponse(user);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const user = await this.getUserUseCase.execute(id);
    return user ? toResponse(user) : null;
  }
}
```

5) Module wiring

-- Create a feature module `src/users/users.module.ts` and import the `UserRepositoryModule` (which provides the `IUserRepository` token) and declare controllers and use-case providers there.

6) Tests

- Unit test domain logic (entities and domain services). Use plain Jest and avoid Nest at this layer.
- Integration tests for controllers/use-cases can use Nest's `@nestjs/testing` utilities and an in-memory sqlite or test database.

Working with TypeORM in this project
-----------------------------------

- This project uses `TypeOrmModule.forRoot(...)` in `src/app.module.ts` configured with sqlite for simplicity.
- To change to another database (Postgres, MySQL), update `TypeOrmModule.forRoot` with the appropriate `type`, `host`, `port`, and connection options. Keep `synchronize: false` in production and use migrations.

Example: switching to Postgres (brief)

```ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.orm-entity.{ts,js}'],
  synchronize: false,
});
```

Operational notes and tips
-------------------------

- IDs: For predictable IDs use the `uuid` package (already in `package.json`) instead of timestamp-based ids.
- Validation: Add `class-validator` + `class-transformer` and use DTO classes for automatic request validation in controllers.
- Errors: Throw domain errors from domain/services and translate them to HTTP responses in controllers (use `BadRequestException`, `ConflictException`, etc.).
- Migrations: For production, prefer migrations rather than `synchronize: true`.

Where to ask questions
----------------------

- If you're unsure where to put code, open a short PR describing what you want to add and ask for a review. Keep PRs small and focused.

---

This README should give you a concise, practical view of how this repository is organized and how to add new features while following the clean architecture principles used here. If you want, I can also add:

- a README section with a real, step-by-step example that adds a new feature starting from an empty folder (I can implement it), or
- automated code generators/templates for scaffolding new features.

Pick one and I'll proceed.
