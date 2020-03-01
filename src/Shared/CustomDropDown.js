import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import { LOGIN_OPTIONS } from '../Authentication/LoginOptionsConfig';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <Button
    variant="outline-secondary"
    className="loginOption"
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </Button>
));

const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={style}
        className={`${className} loginOption`}
        aria-labelledby={labeledBy}
      >
        <FormControl
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={e => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            child =>
              !value || child.props.children.toLowerCase().includes(value),
          )}
        </ul>
      </div>
    );
  },
);

const DropDown = (props) => {
  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        { props.chosenOption !== -1 ? LOGIN_OPTIONS[props.chosenOption].FullName : "Choose a login option" }
      </Dropdown.Toggle>

      <Dropdown.Menu as={CustomMenu}>
        {
          LOGIN_OPTIONS.map((item, index) => {
            return(
              <Dropdown.Item
                key={ index }
                eventKey={ index }
                onSelect={ props.onSelect }
              >
                { item.FullName }
              </Dropdown.Item>
            );
          })
        }
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropDown;