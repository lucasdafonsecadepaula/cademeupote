export type ChangeType<T, R> = Omit<T, keyof R> & R
