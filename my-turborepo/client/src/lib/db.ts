interface Item {
  id: string;
  [key: string]: any;
}

export function getById<T extends Item>({ id, data }: { id: string; data: T[] }): T | undefined {
  return data.find((item) => item.id === id);
}

export function updateById<T extends Item>({
  id,
  originalData,
  updateData,
}: {
  id: string;
  originalData: T[];
  updateData: Partial<T>;
}): T[] {
  const index = originalData.findIndex((item) => item.id === id);

  if (index !== -1) {
    return originalData.map((item, i) => (i === index ? { ...item, ...updateData } : item));
  } else {
    return [
      ...originalData,
      {
        id,
        ...updateData,
      } as T,
    ];
  }
}
