interface IPageWrapperProps {
  className?: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<IPageWrapperProps> = ({ className, children }) => (
  <div className={`min-h-screen w-full ${className ?? ""}`}>
    {children}
  </div>
);

export default PageWrapper;
