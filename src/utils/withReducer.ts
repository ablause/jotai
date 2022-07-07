import { atom } from 'jotai'
import type { PrimitiveAtom, WritableAtom } from 'jotai'
import { createMemoizeAtom } from '../utils/weakCache'

const memoizeAtom = createMemoizeAtom()

export function withReducer<Value, Action>(
  anAtom: PrimitiveAtom<Value>,
  reducer: (value: Value, action: Action) => Value
): WritableAtom<Value, Action | undefined>

export function withReducer<Value, Action>(
  anAtom: WritableAtom<Value, Value>,
  reducer: (value: Value, action: Action) => Value
): WritableAtom<Value, Action>

export function withReducer<Value, Action>(
  anAtom: WritableAtom<Value, Value>,
  reducer: (value: Value, action: Action) => Value
) {
  return memoizeAtom(() => {
    const derivedAtom = atom(
      (get) => get(anAtom),
      (get, set, action: Action) => set(anAtom, reducer(get(anAtom), action))
    )

    return derivedAtom
  }, [anAtom])
}
