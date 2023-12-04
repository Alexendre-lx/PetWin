import Header from '@petwin/components/common/Header/Header';
import Footer from '@petwin/components/common/Footer/Footer';
import { LayoutProps } from '@petwin/components/common/Layout/Layout.props';
import styles from './layout.module.scss';

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.Container}>
      <Header />
      <div className={styles.ContentWrapper}>{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
