declare module "react-cache" {
  import { Context } from "react";

  type ResourceType = object;

  /**
   * A cache.
   */
  export interface Cache {
    invalidate(): void;

    /**
     * Retrieve a value from the cache or request it by calling miss.
     *
     * @param resourceType
     * A symbol, object, or function which represents a type of resource. A
     * Cache can operate as a cache for different types of resources. The
     * default implementation of createResource uses the returned resource
     * itself for this argument.
     *
     * @param key
     * A string, number, symbol, or boolean which acts as a suitable Map lookup
     * key. It corresponds to a cached resource value. If no hash function is
     * provided to createResource, then the item key will be used, otherwise
     * the hash of the key will be used.
     *
     * @param miss
     * Called on a cache miss with missArg.
     *
     * @param missArg
     * Argument to pass to miss.
     */
    read<Key, Value, MissArg = Key>(
      resourceType: ResourceType,
      key: Key,
      miss: (missArg: MissArg) => Promise<Value>,
      missArg: MissArg
    ): Value;

    /**
     * Preload a value into the cache if it does not already exist.
     *
     * @param resourceType
     * A symbol, object, or function which represents a type of resource. A
     * Cache can operate as a cache for different types of resources. The
     * default implementation of createResource uses the returned resource
     * itself for this argument.
     *
     * @param key
     * A string, number, symbol, or boolean which acts as a suitable Map lookup
     * key. It corresponds to a cached resource value. If no hash function is
     * provided to createResource, then the item key will be used, otherwise
     * the hash of the key will be used.
     *
     * @param miss
     * Called on a cache miss with missArg.
     *
     * @param missArg
     * Argument to pass to miss.
     */
    preload<Key, Value, MissArg = Key>(
      resourceType: ResourceType,
      key: Key,
      miss: (missArg: MissArg) => Promise<Value>,
      missArg: MissArg
    ): void;
  }

  /**
   * A cached resource.
   */
  export interface Resource<Key, Value> {
    /**
     * Return a cached value or retrieve it if it does not exist.
     *
     * @param cache Cache to retrieve resource from.
     * @param key Key corresponding to a potentially cached value.
     */
    read(cache: Cache, key: Key): Value;

    /**
     * Retrieve a value if not already in the cache and store it for later.
     *
     * @param cache Cache to retrieve resource from.
     * @param key Key corresponding to a potentially cached value.
     */
    preload(cache: Cache, key: Key): void;
  }

  /**
   * Create a cache.
   *
   * @param invalidator Called when invalidate is invoked on the cache.
   */
  export function createCache(invalidator: () => any): Cache;

  /**
   *
   * @param loadResource
   * Function accepting a key and returning a promise containing the requested
   * value.
   *
   * @param hash
   * Optional hash function converting keys to keys suitable for use in a Map.
   */
  export function createResource<Key, Value>(
    loadResource: (key: Key) => Promise<Value>,
    hash?: (key: Key) => any
  ): Resource<Key, Value>;

  /**
   * Global cache.
   */
  export const ReactCache: Context<Cache>;
}
