export function toBase44(doc) {
  if (!doc) return doc;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  const { _id, __v, createdAt, updatedAt, ...rest } = obj;
  return {
    id: String(_id ?? obj.id),
    ...rest,
    created_date: obj.created_date ?? (createdAt ? new Date(createdAt).toISOString() : undefined),
  };
}

export function sortSpec(sortKey) {
  // Base44 calls look like 'display_order' or '-created_date'
  if (!sortKey || typeof sortKey !== 'string') return { createdAt: -1 };
  const desc = sortKey.startsWith('-');
  const field = desc ? sortKey.slice(1) : sortKey;
  const direction = desc ? -1 : 1;
  if (field === 'created_date') return { createdAt: direction };
  return { [field]: direction, createdAt: -1 };
}

