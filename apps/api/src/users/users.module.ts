import { Module } from "@nestjs/common";

import { KeycloakAdminService } from "./keycloak-admin.service";
import { UsersController } from "./users.controller";

@Module({
  controllers: [UsersController],
  providers: [KeycloakAdminService],
  exports: [KeycloakAdminService],
})
export class UsersModule {}
