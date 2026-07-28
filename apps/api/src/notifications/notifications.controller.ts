import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ArrayMaxSize, IsArray, IsOptional, IsUUID } from "class-validator";

import type { AuthUser } from "../auth/auth-user";
import { CurrentUser } from "../auth/current-user.decorator";
import { NotificationsService } from "./notifications.service";

class MarkReadDto {
  /** Omit to mark the entire inbox as read. */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsUUID("4", { each: true })
  ids?: string[];
}

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.notifications.list(user);
  }

  @Post("read")
  @HttpCode(HttpStatus.NO_CONTENT)
  markRead(@Body() dto: MarkReadDto, @CurrentUser() user: AuthUser) {
    return this.notifications.markRead(user, dto.ids);
  }
}
