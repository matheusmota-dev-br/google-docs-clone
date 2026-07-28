import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateDocumentDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  initialContent?: string;

  /** Keycloak group name. Omit for a personal document. */
  @IsOptional()
  @IsString()
  organizationId?: string;
}
