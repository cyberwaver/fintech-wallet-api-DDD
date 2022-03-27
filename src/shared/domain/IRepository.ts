export interface IRepository<T> {
  findById(id: string): Promise<T>;
  save(dto: T): Promise<void>;
}
