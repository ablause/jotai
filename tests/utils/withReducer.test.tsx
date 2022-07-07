import { fireEvent, render } from '@testing-library/react'
import { atom, useAtom } from 'jotai'
import { withReducer } from 'jotai/utils'
import { getTestProvider } from '../testUtils'

const Provider = getTestProvider()

it('withReducer derived atom with useAtom', async () => {
  const reducer = (state: number, action?: 'INCREASE' | 'DECREASE') => {
    switch (action) {
      case 'INCREASE':
        return state + 1
      case 'DECREASE':
        return state - 1
      case undefined:
        return state
    }
  }

  const countAtom = atom(0)

  const Parent = () => {
    const [count, dispatch] = useAtom(withReducer(countAtom, reducer))

    return (
      <>
        <div>count: {count}</div>
        <button onClick={() => dispatch('INCREASE')}>dispatch INCREASE</button>
        <button onClick={() => dispatch('DECREASE')}>dispatch DECREASE</button>
        <button onClick={() => dispatch()}>dispatch empty</button>
      </>
    )
  }

  const { findByText, getByText } = render(
    <Provider>
      <Parent />
    </Provider>
  )

  await findByText('count: 0')

  fireEvent.click(getByText('dispatch INCREASE'))
  await findByText('count: 1')

  fireEvent.click(getByText('dispatch empty'))
  await findByText('count: 1')

  fireEvent.click(getByText('dispatch DECREASE'))
  await findByText('count: 0')
})

it('withReducer with non-optional action argument', async () => {
  const reducer = (state: number, action: 'INCREASE' | 'DECREASE') => {
    switch (action) {
      case 'INCREASE':
        return state + 1
      case 'DECREASE':
        return state - 1
    }
  }
  const countAtom = atom(0)

  const Parent = () => {
    const [count, dispatch] = useAtom(withReducer(countAtom, reducer))
    return (
      <>
        <div>count: {count}</div>
        <button onClick={() => dispatch('INCREASE')}>dispatch INCREASE</button>
        <button onClick={() => dispatch('DECREASE')}>dispatch DECREASE</button>
      </>
    )
  }

  const { findByText, getByText } = render(
    <Provider>
      <Parent />
    </Provider>
  )

  await findByText('count: 0')

  fireEvent.click(getByText('dispatch INCREASE'))
  await findByText('count: 1')

  fireEvent.click(getByText('dispatch DECREASE'))
  await findByText('count: 0')
})
