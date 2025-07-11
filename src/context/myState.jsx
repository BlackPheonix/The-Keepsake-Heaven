/* eslint-disable react/prop-types */
import MyContext from './myContext';

const MyState = ({children}) => {
    const name = "Dulneth Perera";
  return (
    <MyContext.Provider value={name}>
       {children}
    </MyContext.Provider>
  )
}

export default MyState;