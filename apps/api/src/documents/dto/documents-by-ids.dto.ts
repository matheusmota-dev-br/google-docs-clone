import { ArrayMaxSize, IsArray, IsUUID } from "class-validator";

export class DocumentsByIdsDto {
  @IsArray()
  @ArrayMaxSize(100)
  @IsUUID("4", { each: true })
  ids: string[];
}
