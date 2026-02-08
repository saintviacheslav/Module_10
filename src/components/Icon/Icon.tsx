import { ReactComponent as Envelope } from "../../assets/images/envelope.svg";
import { ReactComponent as Check } from "../../assets/images/check.svg";
import { ReactComponent as CrossSmall } from "../../assets/images/cross-small.svg";
import { ReactComponent as Cross } from "../../assets/images/cross.svg";
import { ReactComponent as Pencil } from "../../assets/images/pencil.svg";
import { ReactComponent as User } from "../../assets/images/user.svg";
import { ReactComponent as Info } from "../../assets/images/info.svg";
import { ReactComponent as NotFound } from "../../assets/images/404.svg";
import { ReactComponent as Trash } from "../../assets/images/trash.svg";
import { ReactComponent as Logo } from "../../assets/images/sidekick_logo.svg";
import { ReactComponent as Comment } from "../../assets/images/message.svg";
import { ReactComponent as Eye } from "../../assets/images/eye.svg";
import { ReactComponent as EyeCrossed } from "../../assets/images/eye-crossed.svg";
import { ReactComponent as Heart } from "../../assets/images/heart.svg";
import { ReactComponent as ArrowDown } from "../../assets/images/arrowdown.svg";
import { ReactComponent as ArrowUp } from "../../assets/images/arrowup.svg";
import { ReactComponent as BurgerMenu } from "../../assets/images/burgermenu.svg";
import { ReactComponent as FileDownload } from "../../assets/images/file-download.svg";

type IconName =
  | "envelope"
  | "check"
  | "cross-small"
  | "cross"
  | "pencil"
  | "user"
  | "info"
  | "notfound"
  | "trash"
  | "logo"
  | "comment"
  | "eye"
  | "eye-crossed"
  | "heart"
  | "arrow-down"
  | "arrow-up"
  | "burger-menu"
  | "file-download";

interface IconProps {
  name: IconName;
  className?: string;
  size?: number | string;
  [key: string]: any;
}

export const Icon = ({
  name,
  className = "",
  size = 20,
  ...rest
}: IconProps) => {
  const commonProps = {
    className: `icon icon--${name} ${className}`.trim(),
    width: size,
    height: size,
    ...rest,
  };

  switch (name) {
    case "envelope":
      return <Envelope {...commonProps} />;
    case "check":
      return <Check {...commonProps} />;
    case "cross-small":
      return <CrossSmall {...commonProps} />;
    case "cross":
      return <Cross {...commonProps} />;
    case "pencil":
      return <Pencil {...commonProps} />;
    case "user":
      return <User {...commonProps} />;
    case "info":
      return <Info {...commonProps} />;
    case "notfound":
      return <NotFound {...commonProps} />;
    case "trash":
      return <Trash {...commonProps} />;
    case "logo":
      return <Logo {...commonProps} />;
    case "comment":
      return <Comment {...commonProps} />;
    case "eye":
      return <Eye {...commonProps} />;
    case "eye-crossed":
      return <EyeCrossed {...commonProps} />;
    case "heart":
      return <Heart {...commonProps} />;
    case "arrow-down":
      return <ArrowDown {...commonProps} />;
    case "arrow-up":
      return <ArrowUp {...commonProps} />;
    case "burger-menu":
      return <BurgerMenu {...commonProps} />;
    case "file-download":
      return <FileDownload {...commonProps} />;
    default:
      return null;
  }
};