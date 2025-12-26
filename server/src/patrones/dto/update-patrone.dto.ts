import { PartialType } from '@nestjs/mapped-types';
import { CreatePatronDto } from './create-patrone.dto';

export class UpdatePatronDto extends PartialType(CreatePatronDto) {}