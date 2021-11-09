import { classNamesFunc } from "classnames-generics";
import { VFC } from "react";
import styles from "./App.module.scss";
import commonStyles, { ClassNames } from "./common/common.module.css";

const classNames = classNamesFunc<keyof typeof styles | ClassNames>();
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
      vite-plugin-sass-dts-example
    </header>
  );
};
