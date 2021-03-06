import { classNamesFunc } from "classnames-generics";
import { VFC } from "react";
import styles from "./App.module.scss";
import commonStyles from "./common/common.module.css";

const classNames = classNamesFunc<keyof typeof styles>();
type Props = {
  active: boolean;
};

export const App: VFC<Props> = (props) => {
  return (
    <header
      className={classNames(
        styles["header-1"],
        { [styles.active]: props.active },
        styles.row,
        commonStyles.hoge
      )}
    >
      ts-css-modules-vite-plugin-example
    </header>
  );
};
