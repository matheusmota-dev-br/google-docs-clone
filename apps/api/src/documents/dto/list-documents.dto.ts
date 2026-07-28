import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class ListDocumentsDto {
  @IsOptional()
  @IsString()
  search?: string;

  /** Keycloak group name. Omit to list the caller's personal documents. */
  @IsOptional()
  @IsString()
  organizationId?: string;

  /** Id of the last item of the previous page. */
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 5;
}
