export const encodeFormURL = (x: { [key: string]: string }) => Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');
