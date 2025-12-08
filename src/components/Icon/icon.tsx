import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

export type ThemeProps =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "light"
  | "dark";

export interface IconProps extends FontAwesomeIconProps {
  theme?: ThemeProps;
}

export const Icon = ({
  className,
  theme = "primary",
  ...restProps
}: IconProps) => {
  const classes = classNames("icon", className, {
    [`icon-${theme}`]: theme,
  });

  return <FontAwesomeIcon className={classes} {...restProps} />;
};

export default Icon;
