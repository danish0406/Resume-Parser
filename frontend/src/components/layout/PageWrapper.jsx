import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export const PageWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#080C10] flex">
      <Sidebar />

      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 p-8 overflow-y-auto bg-[#080C10]">
          {children}
        </main>
      </div>
    </div>
  );
};
export default PageWrapper;
