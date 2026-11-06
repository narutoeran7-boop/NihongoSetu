// Ambient module declarations for Firebase subpath exports
declare module 'firebase/app' {
  export interface FirebaseApp {
    name: string;
    options: Record<string, unknown>;
  }
  export function initializeApp(options: Record<string, unknown>): FirebaseApp;
  export function getApps(): FirebaseApp[];
  export function getApp(): FirebaseApp;
}

declare module 'firebase/auth' {
  export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
  }
  export interface IdTokenResult {
    token: string;
    claims: Record<string, unknown>;
  }
  export interface Auth {
    currentUser: User | null;
  }
  export function getAuth(app?: unknown): Auth;
  export function onAuthStateChanged(auth: Auth, callback: (user: User | null) => void): () => void;
  export function signInWithPopup(auth: Auth, provider: unknown): Promise<{ user: User }>;
  export function signInWithEmailAndPassword(auth: Auth, email: string, pass: string): Promise<{ user: User }>;
  export function createUserWithEmailAndPassword(auth: Auth, email: string, pass: string): Promise<{ user: User }>;
  export function signOut(auth: Auth): Promise<void>;
  export function sendPasswordResetEmail(auth: Auth, email: string): Promise<void>;
  export function sendEmailVerification(user: User): Promise<void>;
  export function updateProfile(user: User, profile: { displayName?: string; photoURL?: string }): Promise<void>;
  export function getIdTokenResult(user: User, forceRefresh?: boolean): Promise<IdTokenResult>;
  export class GoogleAuthProvider {
    constructor();
  }
}

declare module 'firebase/firestore' {
  export interface Firestore {
    type: string;
  }
  export interface DocumentData {
    [field: string]: unknown;
  }
  export interface DocumentReference<T = DocumentData> {
    id: string;
    path: string;
  }
  export interface DocumentSnapshot<T = DocumentData> {
    id: string;
    exists(): boolean;
    data(): T | undefined;
  }
  export function getFirestore(app?: unknown): Firestore;
  export function doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference;
  export function getDoc(reference: DocumentReference): Promise<DocumentSnapshot>;
  export function setDoc(reference: DocumentReference, data: DocumentData, options?: { merge?: boolean }): Promise<void>;
  export function updateDoc(reference: DocumentReference, data: DocumentData): Promise<void>;
}
