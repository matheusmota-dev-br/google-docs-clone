import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import type { AuthUser } from "../auth/auth-user";
import { CurrentUser } from "../auth/current-user.decorator";
import { DocumentsService } from "./documents.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { DocumentsByIdsDto } from "./dto/documents-by-ids.dto";
import { ListDocumentsDto } from "./dto/list-documents.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";

@Controller("documents")
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Get()
  list(@Query() query: ListDocumentsDto, @CurrentUser() user: AuthUser) {
    return this.documents.list(query, user);
  }

  @Post()
  create(@Body() dto: CreateDocumentDto, @CurrentUser() user: AuthUser) {
    return this.documents.create(dto, user);
  }

  /** POST rather than GET so a long list of ids is not crammed into the URL. */
  @Post("by-ids")
  @HttpCode(HttpStatus.OK)
  byIds(@Body() dto: DocumentsByIdsDto, @CurrentUser() user: AuthUser) {
    return this.documents.findManyByIds(dto.ids, user);
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.documents.findOne(id, user);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateDocumentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.documents.update(id, dto, user);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.documents.remove(id, user);
  }
}
