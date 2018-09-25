
export function resolveDisabled(disabled: boolean, className: string = ''): string {
  switch (disabled) {
    case true:
      return `${className} disabled`;
    default:
      return className;
  }
}
