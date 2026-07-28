/**
 * `@repo/ui` — the shared design system, organised by Atomic Design.
 *
 *   atoms      → indivisible primitives (Button, Input, Spinner)
 *   molecules  → small compositions with one job (SearchField, Dialog)
 *   organisms  → complete interface sections (AppHeader, DocumentTable)
 *   templates  → page layouts made of slots (AppShell, EditorShell)
 *
 * Prefer the layered entrypoints — `@repo/ui/atoms`, `@repo/ui/molecules`, … —
 * in application code: the import path then states which layer you depend on,
 * which is exactly the constraint Atomic Design is there to enforce.
 */

export * from "./atoms";
export * from "./molecules";
export * from "./organisms";
export * from "./templates";
export * from "./hooks";
export * from "./lib/utils";
