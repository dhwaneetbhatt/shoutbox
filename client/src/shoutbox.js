import React from 'react';

class Shoutbox extends React.Component {
  
  constructor() {
    const socket = openSocket('http://localhost:8000');
    this.state = {
      socket: socket
    };
  }
  
  render() {
    return (
      <div className="shoutbox">
        This is shoutbox
      </div>
    );
  }
}

export default Shoutbox;
