import log from '../utils/log.util';
import { EWidget, IBubble, IMaps, IScatter } from '@/shared/types/index';
export class ValidationHelper {
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

  private isScatter(data: any): data is IScatter {
    return 'x' in data && 'y' in data;
  }

  private isBubble(data: any): data is IBubble {
    return 'x' in data && 'y' in data && 'r' in data;
  }

  private isMaps(data: any): data is IMaps {
    return 'latitude' in data && 'longitude' in data;
  }
}
