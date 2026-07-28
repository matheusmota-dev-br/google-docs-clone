import { Controller, ForbiddenException, Get, Query } from "@nestjs/common";
import { IsOptional, IsString } from "class-validator";

import type { AuthUser } from "../auth/auth-user";
import { CurrentUser } from "../auth/current-user.decorator";
import { KeycloakAdminService, type Member, colorFor } from "./keycloak-admin.service";

class ListMembersDto {
  @IsOptional()
  @IsString()
  organizationId?: string;
}

@Controller("users")
export class UsersController {
  constructor(private readonly keycloak: KeycloakAdminService) {}

  /**
   * People who can be mentioned in the current context: the members of the
   * active organisation, or just yourself in a personal document.
   */
  @Get()
  async list(
    @Query() query: ListMembersDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Member[]> {
    if (!query.organizationId) {
      return [
        { id: user.id, name: user.name, email: user.email, color: colorFor(user.id) },
      ];
    }

    if (!user.organizations.includes(query.organizationId)) {
      throw new ForbiddenException(`You are not a member of "${query.organizationId}"`);
    }

    return this.keycloak.membersOfGroup(query.organizationId);
  }

  /** The caller's own profile, including the organisations from their token. */
  @Get("me")
  me(@CurrentUser() user: AuthUser) {
    return { ...user, color: colorFor(user.id) };
  }
}
