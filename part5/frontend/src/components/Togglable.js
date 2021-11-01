import React, { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const Togglable = forwardRef((props, ref) => {
  const [visibility, setVisibility] = useState(false);

  const hideWhenVisible = { display: visibility ? 'none' : '' };
  const showWhenVisible = { display: visibility ? '' : 'none' };

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  useImperativeHandle(ref, () => {
    return { toggleVisibility };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={() => toggleVisibility()}>{props.label}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={() => toggleVisibility()}>cancel</button>
      </div>
    </div>
  );
});

Togglable.displayName = 'Togglable';

Togglable.propTypes = {
  label: PropTypes.string.isRequired
};

export default Togglable;
