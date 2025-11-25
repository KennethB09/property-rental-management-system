type NavigationBarProps = {
  children: React.ReactNode;
};

export default function NavigationBar({ children }: NavigationBarProps) {
  return (
    <div className="absolute bottom-0 bg-white w-full flex justify-around py-3 rounded-t-2xl shadow-[0px_2px_5px_-1px_rgba(50,50,93,0.25),rgba(0,0,0,0.3)_0px_1px_3px_-1px] lg:flex-col lg:w-fit lg:h-fit lg:left-0 lg:bottom-auto lg:m-4 lg:p-3 lg:gap-4 lg:rounded-2xl">
      {children}
    </div>
  );
}
