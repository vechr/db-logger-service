interface IScatter {
  x: number
  y: number
}

export function isScatter(data: any): data is IScatter {
  return 'r' in data && 'y' in data;
}