import { PartialType } from '@nestjs/mapped-types';
import { CreateImageProcessingDto } from './create-image-processing.dto';

export class UpdateImageProcessingDto extends PartialType(CreateImageProcessingDto) {}
