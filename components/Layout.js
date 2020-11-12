import Header from './Header';

// We use the children and place between header and footer.

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
