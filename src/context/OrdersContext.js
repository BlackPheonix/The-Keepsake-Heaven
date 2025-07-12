import React, { createContext, useState, useContext } from 'react';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([
    { id: '#ORD-1001', customer: 'Nimal Perera', date: '2023-06-15 14:30', amount: 5200, status: 'Completed', items: 3 },
    { id: '#ORD-1002', customer: 'Kamala Silva', date: '2023-06-14 10:15', amount: 3800, status: 'Shipped', items: 2 },
    { id: '#ORD-1003', customer: 'Sunil Fernando', date: '2023-06-14 16:45', amount: 7500, status: 'Processing', items: 5 },
    { id: '#ORD-1004', customer: 'Anoma Rajapakse', date: '2023-06-13 09:20', amount: 12000, status: 'Completed', items: 4 },
    { id: '#ORD-1005', customer: 'Priyantha Bandara', date: '2023-06-12 13:05', amount: 6300, status: 'Completed', items: 2 },
    { id: '#ORD-1006', customer: 'Samantha Rathnayake', date: '2023-06-11 11:50', amount: 8900, status: 'Shipped', items: 3 },
    { id: '#ORD-1007', customer: 'Chamari Atapattu', date: '2023-06-10 15:10', amount: 4500, status: 'Processing', items: 1 },
    { id: '#ORD-1008', customer: 'Dinesh Chandimal', date: '2023-06-09 17:30', amount: 11200, status: 'Completed', items: 6 },
  ]);

  return (
    <OrdersContext.Provider value={{ orders, setOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext); 