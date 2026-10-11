import { PartialType } from '@nestjs/swagger';
import { CreateSiteTeamDto } from './create-site-team.dto';

export class UpdateSiteTeamDto extends PartialType(CreateSiteTeamDto) {}
