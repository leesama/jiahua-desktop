type StoreValue = any;

declare interface FormValue {
  [name: string]: StoreValue;
}
declare module '@/config' {
  const appid: string;
  const secret: string;
  const env: string;
}

declare interface TableItem {
  [name: string]: string;
}
