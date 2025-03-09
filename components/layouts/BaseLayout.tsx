import type { FC, ReactNode } from 'react';

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return (
    <div className="py-[100px] pt-[175px] min-h-[500px] flex justify-center">
      <main className="w-full max-w-7xl mx-auto px-10">{children}</main>
    </div>
  );
};

export default BaseLayout;