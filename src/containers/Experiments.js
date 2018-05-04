import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

const images = [
  'http://www.fotokraemer-wuppertal.de/images/Schloss%20Luentenbeck-016-02-24-004%20(1).jpg',
  'http://www.fotokraemer-wuppertal.de/images/Schloss%20Luentenbeck-016-02-24-005.jpg',
  'http://www.fotokraemer-wuppertal.de/images/Schloss%20Luentenbeck-016-02-24-001.jpg',
  'http://www.fotokraemer-wuppertal.de/images/Schloss%20Luentenbeck-016-02-24-003.jpg',
  'http://www.fotokraemer-wuppertal.de/images/Schloss%20Luentenbeck-016-02-24-009%20(1).jpg',
];

export default class LightboxExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photoIndex: 0,
      isOpen: false,
    };
  }

  render() {
    const { photoIndex, isOpen } = this.state;

    return (
      <div>
        <button type="button" onClick={() => this.setState({ isOpen: true })}>
          Open Lightbox
        </button>

        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length,
              })
            }
          />
        )}
      </div>
    );
  }
}