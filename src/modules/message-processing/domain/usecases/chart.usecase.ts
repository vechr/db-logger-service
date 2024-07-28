import { Injectable } from '@nestjs/common';
import { Bubble, EWidget, Maps, Scatter } from '../entities';
import log from '@/core/base/frameworks/shared/utils/log.util';

@Injectable()
export class ChartUseCase {
  validation(widgetType: string, data: string): boolean {
    try {
      if (
        widgetType === EWidget.BAR ||
        widgetType === EWidget.DOUGHNUT ||
        widgetType === EWidget.GAUGE ||
        widgetType === EWidget.LINE ||
        widgetType === EWidget.PIE ||
        widgetType === EWidget.POLAR ||
        widgetType === EWidget.RADAR
      ) {
        const result = Number(data);
        if (Number.isNaN(result)) {
          log.error("Data wouldn't be store, since type is different");
          return false;
        }
      } else if (widgetType === EWidget.SCATTER) {
        if (!this.isScatter(JSON.parse(data))) {
          log.error("Data wouldn't be store, since type is not Scatter");
          return false;
        }
      } else if (widgetType === EWidget.BUBBLE) {
        if (!this.isBubble(JSON.parse(data))) {
          log.error("Data wouldn't be store, since type is not Bubble");
          return false;
        }
      } else if (widgetType === EWidget.MAPS) {
        if (!this.isMaps(JSON.parse(data))) {
          log.error("Data wouldn't be store, since type is not Maps");
          return false;
        }
      }

      return true;
    } catch (error) {
      log.error(`${error}`);
      return false;
    }
  }

  private isScatter(data: any): data is Scatter {
    return 'x' in data && 'y' in data;
  }

  private isBubble(data: any): data is Bubble {
    return 'x' in data && 'y' in data && 'r' in data;
  }

  private isMaps(data: any): data is Maps {
    return 'latitude' in data && 'longitude' in data;
  }
}
