import React from 'react';
import '../styles/index.css';

class AboutBox extends React.Component {

    render() {
        return (
            <div id="aboutModal" class="modal" role="dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <center>
                    <h3 class="modal-title"><b>About SpeedScore</b></h3>
                    </center>
                    <button id="modalClose" class="close" onClick={this.props.hideAbout}>
                    &times;</button>
                </div> 
                <div class="modal-body">
                    <h3>The World's First and Only Suite of Apps for
                    Speedgolf</h3>
                    <p>Version CptS 489, Chapter 16 Solutions</p>
                    <p>SpeedScore apps support</p>
                    
                    <h4>deleted some information for simplicity sooorry</h4>
                    <p>"Its content should be identical to the About Box developed in Chapter 4" i know i know </p>
                </div>
                <div class="modal-footer">
                        <button class="close" onClick={this.props.hideAbout}>
                        OK</button>
                </div>
            </div>
            </div>
        );
    }
}

export default AboutBox;