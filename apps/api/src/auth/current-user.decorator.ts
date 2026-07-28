import { type ExecutionContext, createParamDecorator } from "@nestjs/common";

import type { AuthUser } from "./auth-user";

/** Injects the caller resolved from the bearer token. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser =>
    context.switchToHttp().getRequest<{ user: AuthUser }>().user,
);
