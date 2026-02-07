import { Component } from "react";
import style from "./buttonclass.module.css";

interface ButtonProps {
  name: string;
  onClick?: () => void;
}

interface ButtonState {
  isHovered: boolean;
}

class Button extends Component<ButtonProps, ButtonState> {
  constructor(props: ButtonProps) {
    super(props);

    this.state = {
      isHovered: false,
    };

  }

  static getDerivedStateFromProps(
    nextProps: ButtonProps,
    prevState: ButtonState,
  ) {
    return null;
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps: ButtonProps, nextState: ButtonState) {
    return true;
  }

  getSnapshotBeforeUpdate(prevProps: ButtonProps, prevState: ButtonState) {
    return null;
  }

  componentDidUpdate(
    prevProps: ButtonProps,
    prevState: ButtonState,
    snapshot: any, //загуглить 
  ) {
  }

  componentWillUnmount() {
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps: ButtonProps) {
  }

  componentWillUpdate(nextProps: ButtonProps, nextState: ButtonState) {
  }

  render() {

    const { name, onClick } = this.props;

    return (
      <button onClick={onClick} className={style.templateButton}>
        {name}
      </button>
    );
  }
}

export default Button;
