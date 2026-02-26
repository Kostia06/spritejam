export async function uploadObject(
  r2: R2Bucket,
  key: string,
  data: ArrayBuffer,
  contentType: string,
): Promise<void> {
  await r2.put(key, data, {
    httpMetadata: { contentType },
  });
}

export async function getObject(
  r2: R2Bucket,
  key: string,
): Promise<R2ObjectBody | null> {
  const object = await r2.get(key);
  return object;
}

export async function deleteObject(
  r2: R2Bucket,
  key: string,
): Promise<void> {
  await r2.delete(key);
}
