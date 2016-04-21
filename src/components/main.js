import React from 'react';
import base64 from 'base64-arraybuffer';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';

import vision from '../apis/vision';


const styles = {
  droppable: {
    padding: '16px',
    height: '60px',
    width: '300px',
    textAlign: 'center'
  },
  preview: {
    display: 'block',
    width: '300px',
    margin: '16px 0'
  }
};

const read = (handler) => (file) => 
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    handler.call(reader, file);
  });

const readAsArrayBuffer = read(FileReader.prototype.readAsArrayBuffer);

const readAsDataUrl = read(FileReader.prototype.readAsDataURL);

export default class Main extends React.Component {

  constructor() {
    super();
    this.state = {
      image: null,
      imageUrl: null,
      result: null
    };
  }

  onDrop(event) {
    this.cancelEvent(event);
    const file = event.dataTransfer.files[0];
    Promise.all([
      readAsArrayBuffer(file),
      readAsDataUrl(file)
    ]).then(([buffer, url]) => {
      this.setState({
        image: base64.encode(buffer),
        imageUrl: url,
        result: null
      });
    });
  }

  onAnnotateButtonClicked() {
    vision.annotate({
      requests: [{
        features: {
          type: 'LABEL_DETECTION'
        },
        image: {
          content: this.state.image
        }
      }]
    }).then((responses) => {
      this.setState({result: JSON.stringify(responses, null, 2)});
    });
  }

  cancelEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  render() {
    return (
      <div className="Main">
        <Paper zDepth={1}
               style={styles.droppable}
               onDrop={this.onDrop.bind(this)}
               onDragEnter={this.cancelEvent}
               onDragOver={this.cancelEvent}>
          ここにファイルをドロップします
        </Paper>
        <img src={this.state.imageUrl} style={styles.preview} /> 
        <RaisedButton label="注釈"
                      primary={true}
                      onClick={this.onAnnotateButtonClicked.bind(this)}
                      style={{width: '300px', display: this.state.imageUrl ? 'block' : 'none'}} />
        <pre>
          {this.state.result}
        </pre>
      </div>
    ); 
  }
}
