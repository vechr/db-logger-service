import { BaseEntity } from '@/core/base/domain/entities';

export enum EWidget {
  BAR = 'BAR',
  BUBBLE = 'BUBBLE',
  DOUGHNUT = 'DOUGHNUT',
  PIE = 'PIE',
  GAUGE = 'GAUGE',
  LINE = 'LINE',
  POLAR = 'POLAR',
  RADAR = 'RADAR',
  SCATTER = 'SCATTER',
  MAPS = 'MAPS',
}

export class Widget extends BaseEntity {
  dashboardId: string;
  node: object;
  nodeId: string;
  widgetData: object;
  widgetType: EWidget;
  shiftData: boolean | null;
  topicId: string;
}
