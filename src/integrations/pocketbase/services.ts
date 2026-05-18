/**
 * PocketBase service layer — replaces all Supabase data access.
 *
 * Collections (see pocketbase/pb_schema.json):
 *   - projects        (gallery/projects, image file field)
 *   - gallery_images  (image file field)
 *   - testimonials
 *   - submissions     (contact leads)
 *   - site_settings   (single record)
 *
 * Admin authentication uses PocketBase superusers (collection `_superusers`).
 */
import { pb, fileUrl } from "./client";

/* ----------------------------------------------------------------- types -- */

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  year: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  message: string;
  avatar_url: string;
  published: boolean;
  sort_order: number;
}

export interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export interface SiteSettings {
  id?: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  about_heading: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  whatsapp_number: string;
  address_head_office: string;
  address_branch_office: string;
  branches_list: string;
  phone_secondary: string;
  phone_tertiary: string;
  map_embed_url: string;
  loan_info: string;
  warranty_years: number;
}

/* --------------------------------------------------------------- mappers -- */

type PBRecord = Record<string, unknown> & {
  id: string;
  collectionId?: string;
  collectionName?: string;
  created?: string;
  updated?: string;
};

function imgUrl(record: PBRecord, field = "image"): string {
  const v = record[field];
  if (typeof v === "string" && v) return fileUrl(record, v);
  return "";
}

function mapProject(r: PBRecord): Project {
  return {
    id: r.id,
    title: (r.title as string) ?? "",
    category: (r.category as string) ?? "Solar",
    description: (r.description as string) ?? "",
    image_url: imgUrl(r),
    year: (r.year as string) ?? "",
    sort_order: (r.sort_order as number) ?? 0,
    published: (r.published as boolean) ?? false,
    created_at: r.created ?? "",
    updated_at: r.updated ?? "",
  };
}

function mapGallery(r: PBRecord): GalleryImage {
  return {
    id: r.id,
    image_url: imgUrl(r),
    caption: (r.caption as string) ?? "",
    sort_order: (r.sort_order as number) ?? 0,
    published: (r.published as boolean) ?? false,
    created_at: r.created ?? "",
  };
}

function mapTestimonial(r: PBRecord): Testimonial {
  return {
    id: r.id,
    name: (r.name as string) ?? "",
    location: (r.location as string) ?? "",
    rating: (r.rating as number) ?? 5,
    message: (r.message as string) ?? "",
    avatar_url: imgUrl(r, "avatar"),
    published: (r.published as boolean) ?? false,
    sort_order: (r.sort_order as number) ?? 0,
  };
}

function mapSubmission(r: PBRecord): Submission {
  return {
    id: r.id,
    name: (r.name as string) ?? "",
    email: (r.email as string) ?? "",
    phone: (r.phone as string) ?? "",
    message: (r.message as string) ?? "",
    created_at: r.created ?? "",
  };
}

const SETTINGS_DEFAULTS: SiteSettings = {
  hero_eyebrow: "PM Surya Ghar Subsidy Available",
  hero_title: "Green Spark Solar",
  hero_subtitle: "Power Your Home with the Sun",
  about_heading: "",
  contact_phone: "9652847145",
  contact_email: "greensparksolar11@gmail.com",
  contact_address: "Shop No-5, Vijay Bashakar Complex, Pothurajugandi, Addanki - 523201",
  whatsapp_number: "916302021671",
  address_head_office: "Shop No-5, Vijay Bashakar Complex, Pothurajugandi, Addanki - 523201, Andhra Pradesh",
  address_branch_office: "Shop No-5, Vijay Bashakar Complex, Pothurajugandi, Addanki - 523201, Andhra Pradesh",
  branches_list: "Addanki | Prakasam | Bapatla",
  phone_secondary: "9100864364",
  phone_tertiary: "",
  map_embed_url: "https://www.google.com/maps?q=Addanki,Prakasam,Andhra+Pradesh+523201&output=embed",
  loan_info: "We support the complete bank loan and PM Surya Ghar subsidy sanctioning process — from paperwork to disbursement.",
  warranty_years: 25,
};

function mapSettings(r: PBRecord): SiteSettings {
  return {
    id: r.id,
    hero_eyebrow: (r.hero_eyebrow as string) ?? SETTINGS_DEFAULTS.hero_eyebrow,
    hero_title: (r.hero_title as string) ?? SETTINGS_DEFAULTS.hero_title,
    hero_subtitle: (r.hero_subtitle as string) ?? SETTINGS_DEFAULTS.hero_subtitle,
    about_heading: (r.about_heading as string) ?? "",
    contact_phone: (r.contact_phone as string) ?? "",
    contact_email: (r.contact_email as string) ?? "",
    contact_address: (r.contact_address as string) ?? "",
    whatsapp_number: (r.whatsapp_number as string) ?? "",
    address_head_office: (r.address_head_office as string) ?? "",
    address_branch_office: (r.address_branch_office as string) ?? "",
    branches_list: (r.branches_list as string) ?? "",
    phone_secondary: (r.phone_secondary as string) ?? "",
    phone_tertiary: (r.phone_tertiary as string) ?? "",
    map_embed_url: (r.map_embed_url as string) ?? "",
    loan_info: (r.loan_info as string) ?? "",
    warranty_years: (r.warranty_years as number) ?? 25,
  };
}

/* ------------------------------------------------------------- projects -- */

export async function listProjects(opts: { onlyPublished?: boolean } = {}) {
  const filter = opts.onlyPublished ? "published = true" : "";
  const records = await pb
    .collection("projects")
    .getFullList({ sort: "sort_order,-created", filter });
  return records.map((r) => mapProject(r as PBRecord));
}

export async function createProject(data: Partial<Project> & { imageFile?: File | null }) {
  const fd = toFormData(data, "image");
  const r = await pb.collection("projects").create(fd);
  return mapProject(r as PBRecord);
}

export async function updateProject(id: string, data: Partial<Project> & { imageFile?: File | null }) {
  const fd = toFormData(data, "image");
  const r = await pb.collection("projects").update(id, fd);
  return mapProject(r as PBRecord);
}

export async function deleteProject(id: string) {
  await pb.collection("projects").delete(id);
}

/* --------------------------------------------------------------- gallery -- */

export async function listGallery(opts: { onlyPublished?: boolean; limit?: number } = {}) {
  const filter = opts.onlyPublished ? "published = true" : "";
  const records = await pb
    .collection("gallery_images")
    .getFullList({ sort: "sort_order,-created", filter });
  const mapped = records.map((r) => mapGallery(r as PBRecord));
  return opts.limit ? mapped.slice(0, opts.limit) : mapped;
}

export async function createGallery(data: Partial<GalleryImage> & { imageFile?: File | null }) {
  const fd = toFormData(data, "image");
  const r = await pb.collection("gallery_images").create(fd);
  return mapGallery(r as PBRecord);
}

export async function updateGallery(id: string, data: Partial<GalleryImage> & { imageFile?: File | null }) {
  const fd = toFormData(data, "image");
  const r = await pb.collection("gallery_images").update(id, fd);
  return mapGallery(r as PBRecord);
}

export async function deleteGallery(id: string) {
  await pb.collection("gallery_images").delete(id);
}

/* ---------------------------------------------------------- testimonials -- */

export async function listTestimonials(opts: { onlyPublished?: boolean; limit?: number } = {}) {
  const filter = opts.onlyPublished ? "published = true" : "";
  const records = await pb
    .collection("testimonials")
    .getFullList({ sort: "sort_order,-created", filter });
  const mapped = records.map((r) => mapTestimonial(r as PBRecord));
  return opts.limit ? mapped.slice(0, opts.limit) : mapped;
}

export async function createTestimonial(data: Partial<Testimonial>) {
  const r = await pb.collection("testimonials").create(stripUndefined(data));
  return mapTestimonial(r as PBRecord);
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>) {
  const r = await pb.collection("testimonials").update(id, stripUndefined(data));
  return mapTestimonial(r as PBRecord);
}

export async function deleteTestimonial(id: string) {
  await pb.collection("testimonials").delete(id);
}

/* ----------------------------------------------------------- submissions -- */

export async function submitContact(data: { name: string; email: string; phone?: string; message: string }) {
  const r = await pb.collection("submissions").create({
    name: data.name,
    email: data.email,
    phone: data.phone ?? "",
    message: data.message,
  });
  return mapSubmission(r as PBRecord);
}

export async function listSubmissions() {
  const records = await pb.collection("submissions").getFullList({ sort: "-created" });
  return records.map((r) => mapSubmission(r as PBRecord));
}

export async function deleteSubmission(id: string) {
  await pb.collection("submissions").delete(id);
}

/* --------------------------------------------------------------- reviews -- */

export interface Review {
  id: string;
  customer_name: string;
  customer_photo: string;
  rating: number;
  review_message: string;
  location: string;
  approved: boolean;
  created_at: string;
}

function mapReview(r: PBRecord): Review {
  return {
    id: r.id,
    customer_name: (r.customer_name as string) ?? "",
    customer_photo: imgUrl(r, "customer_photo"),
    rating: (r.rating as number) ?? 5,
    review_message: (r.review_message as string) ?? "",
    location: (r.location as string) ?? "",
    approved: (r.approved as boolean) ?? false,
    created_at: r.created ?? "",
  };
}

export async function listApprovedReviews(limit = 50) {
  const records = await pb.collection("reviews").getList(1, limit, {
    filter: "approved = true",
    sort: "-created",
  });
  return records.items.map((r) => mapReview(r as unknown as PBRecord));
}

export async function listAllReviews() {
  const records = await pb.collection("reviews").getFullList({ sort: "-created" });
  return records.map((r) => mapReview(r as PBRecord));
}

export async function submitReview(data: {
  customer_name: string;
  rating: number;
  review_message: string;
  location?: string;
  customer_photo?: File | null;
}) {
  const fd = new FormData();
  fd.append("customer_name", data.customer_name.trim());
  fd.append("rating", String(data.rating));
  fd.append("review_message", data.review_message.trim());
  fd.append("location", (data.location ?? "").trim());
  fd.append("approved", "false");
  if (data.customer_photo) fd.append("customer_photo", data.customer_photo);
  try {
    const r = await pb.collection("reviews").create(fd);
    return mapReview(r as PBRecord);
  } catch (err) {
    console.error("PocketBase Review Creation Error:", err);
    throw err;
  }
}

export async function approveReview(id: string) {
  const r = await pb.collection("reviews").update(id, { approved: true });
  return mapReview(r as PBRecord);
}

export async function rejectReview(id: string) {
  const r = await pb.collection("reviews").update(id, { approved: false });
  return mapReview(r as PBRecord);
}

export async function deleteReview(id: string) {
  await pb.collection("reviews").delete(id);
}

/** Subscribe to realtime changes on the reviews collection. Returns unsubscribe. */
export function subscribeReviews(cb: (e: { action: string; record: PBRecord }) => void) {
  let unsub: (() => void) | undefined;
  pb.collection("reviews")
    .subscribe("*", (e) => cb(e as unknown as { action: string; record: PBRecord }))
    .then((u) => {
      unsub = u;
    })
    .catch(() => {});
  return () => {
    if (unsub) unsub();
    else pb.collection("reviews").unsubscribe("*").catch(() => {});
  };
}

/* -------------------------------------------------------------- settings -- */

export async function getSettings(): Promise<SiteSettings> {
  try {
    const list = await pb
      .collection("site_settings")
      .getList(1, 1, { sort: "-created" });
    if (list.items.length === 0) return SETTINGS_DEFAULTS;
    return mapSettings(list.items[0] as unknown as PBRecord);
  } catch {
    return SETTINGS_DEFAULTS;
  }
}

export async function updateSettings(data: SiteSettings): Promise<SiteSettings> {
  const { id, ...rest } = data;
  if (id) {
    const r = await pb.collection("site_settings").update(id, rest);
    return mapSettings(r as PBRecord);
  }
  const r = await pb.collection("site_settings").create(rest);
  return mapSettings(r as PBRecord);
}

/* ------------------------------------------------------------------ auth -- */

export async function loginAdmin(email: string, password: string) {
  // PocketBase >= 0.23 — superuser auth lives in the `_superusers` collection.
  await pb.collection("_superusers").authWithPassword(email, password);
}

export function logoutAdmin() {
  pb.authStore.clear();
}

export function isAdminAuthed() {
  // In PocketBase 0.23+, superusers are in the "_superusers" collection.
  // We check if the current auth record is a superuser.
  const record = pb.authStore.record;
  return pb.authStore.isValid && !!record && (record as any).collectionName === "_superusers";
}

export function onAuthChange(cb: () => void) {
  return pb.authStore.onChange(cb);
}

/* ---------------------------------------------------------------- utils -- */

function toFormData(obj: Record<string, unknown>, fileField: string): FormData {
  const fd = new FormData();
  const file = obj.imageFile as File | null | undefined;
  for (const [key, value] of Object.entries(obj)) {
    if (key === "imageFile" || key === "image_url" || key === "id" || key === "created_at" || key === "updated_at") continue;
    if (value === undefined || value === null) continue;
    if (typeof value === "boolean") {
      fd.append(key, value ? "true" : "false");
    } else {
      fd.append(key, String(value));
    }
  }
  if (file) fd.append(fileField, file);
  return fd;
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === "id" || v === undefined) continue;
    out[k] = v;
  }
  return out;
}
