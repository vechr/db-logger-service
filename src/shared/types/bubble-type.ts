interface IBubble {
  x: number
  y: number
  r: number
}

export function isBubble(data: any): data is IBubble {
  return 'r' in data && 'y' in data && 'r' in data;
}