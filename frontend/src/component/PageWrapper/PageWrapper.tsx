interface IPageWrapperProps {
  className?: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<IPageWrapperProps> = ({ className, children }) => (
  <div className={`w-full h-full px-4 py-6 ${className ?? ""}`}>
    {children}
  </div>
);

export default PageWrapper;
