type NavigationBarProps = {
  children: React.ReactNode;
};

export default function NavigationBar({ children }: NavigationBarProps) {
  return (
    <div className="absolute bottom-0 bg-white w-full flex justify-around py-3 rounded-t-2xl shadow-[0px_2px_5px_-1px_rgba(50,50,93,0.25),rgba(0,0,0,0.3)_0px_1px_3px_-1px]">
      {children}
    </div>
  );
}
