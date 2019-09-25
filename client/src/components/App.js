import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Dimmer, Loader } from 'semantic-ui-react';

import Navigation from './Navigation';
import Main from './Main';
import Footer from './Footer';
import ModalView from './ModalView';
import ConfirmController from './ConfirmController';
import { openModalWindow } from '../actions/ActionCreators';

class App extends React.PureComponent {
  render() {
    const { openModal, openModalWindow, isLoading, player } = this.props;

    return (
      <Router>
        <React.Fragment>
          <Dimmer active={isLoading} page>
            <Loader content='Loading' />
          </Dimmer>
          <ModalView
            open={openModal.open}
            modalContent={openModal.body}
            modalHeader={openModal.title}
            headerIcon={openModal.headerIcon}
            handleClose={() => openModalWindow(false)}
          />
          <ConfirmController />
          <Navigation />
          <Main />
          <Footer playerRef={player} />
        </React.Fragment>
      </Router>
    )
  }
}
const mapStateToProps = state => {
  return {
    openModal: state.openModal,
    isLoading: state.isLoading,
  }
}

export default connect(mapStateToProps, { openModalWindow })(App);
