import React, { FC, createContext, useReducer, ReactNode } from 'react';

interface StateData {
  account: { addr: string; shard: string } | undefined;
  balance: any;
}

const typeStateMap = {
  SET_ACCOUNT: 'account',
  SET_BALANCE: 'balance',
};

const initialState: StateData = {
  account: undefined,
  balance: 0,
};

const reducer = (state: StateData, action: { type: keyof typeof typeStateMap; payload: any }) => {
  const stateName = typeStateMap[action.type];
  if (!stateName) {
    console.warn(`Unknown action type: ${action.type}`);
    return state;
  }
  return { ...state, [stateName]: action.payload };
};

const StateContext = createContext(initialState);
const DispatchContext = createContext<any>(null);

const StateProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export { typeStateMap, StateContext, DispatchContext, StateProvider };
