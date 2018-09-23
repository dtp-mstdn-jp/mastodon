import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Permalink from '../../../components/permalink';
import { displaySensitiveMedia, me } from '../../../initial_state';
import IconButton from '../../../components/icon_button';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
  favourite: { id: 'status.favourite', defaultMessage: 'Favourite' },
});

export default @injectIntl
class MediaItem extends ImmutablePureComponent {

  static propTypes = {
    onFavourite: PropTypes.func,
    media: ImmutablePropTypes.map.isRequired,
  };

  state = {
    visible: !this.props.media.getIn(['status', 'sensitive']) || displaySensitiveMedia,
  };

  handleFavouriteClick = () => {
    this.props.onFavourite(this.props.status);
  }

  handleClick = () => {
    if (!this.state.visible) {
      this.setState({ visible: true });
      return true;
    }

    return false;
  }

  render () {
    const { media } = this.props;
    const { visible } = this.state;
    const status = media.get('status');
    const focusX = media.getIn(['meta', 'focus', 'x']);
    const focusY = media.getIn(['meta', 'focus', 'y']);
    const x = ((focusX /  2) + .5) * 100;
    const y = ((focusY / -2) + .5) * 100;
    const style = {};
    const anonymousAccess    = !me;

    let label, icon;

    if (media.get('type') === 'gifv') {
      label = <span className='media-gallery__gifv__label'>GIF</span>;
    }

    if (visible) {
      style.backgroundImage    = `url(${media.get('preview_url')})`;
      style.backgroundPosition = `${x}% ${y}%`;
    } else {
      icon = (
        <span className='account-gallery__item__icons'>
          <i className='fa fa-eye-slash' />
        </span>
      );
    }

    return (
      <div className='account-gallery__item'>
        <Permalink to={`/statuses/${status.get('id')}`} href={status.get('url')} style={style} onInterceptClick={this.handleClick}>
          {icon}
          {label}
        </Permalink>
        <div className='account-gallery__action-bar'>
          <IconButton className='account-gallery__action-bar-button star-icon' disabled={anonymousAccess} animate active={status.get('favourited')} pressed={status.get('favourited')} title={intl.formatMessage(messages.favourite)} icon='star' onClick={this.handleFavouriteClick} />
        </div>
      </div>
    );
  }

}
