import PocketBase from "pocketbase";

const PB_URL =
  (typeof window !== "undefined" ? import.meta.env.VITE_POCKETBASE_URL : undefined) ||
  import.meta.env.VITE_POCKETBASE_URL ||
  process.env.VITE_POCKETBASE_URL ||
  process.env.POCKETBASE_URL ||
  "http://127.0.0.1:8090";

let _pb: PocketBase | undefined;

function create() {
  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);
  return pb;
}

export const pb: PocketBase = new Proxy({} as PocketBase, {
  get(_t, prop, receiver) {
    if (!_pb) _pb = create();
    return Reflect.get(_pb, prop, receiver);
  },
});

export const POCKETBASE_URL = PB_URL;

/** Build a public file URL for a record file field. */
export function fileUrl(
  record: { id: string; collectionId?: string; collectionName?: string },
  filename: string | undefined | null,
): string {
  if (!filename) return "";
  if (/^https?:\/\//i.test(filename)) return filename;
  const collection = record.collectionId || record.collectionName;
  if (!collection || !record.id) return "";
  return `${PB_URL}/api/files/${collection}/${record.id}/${filename}`;
}
