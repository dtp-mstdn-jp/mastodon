import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Permalink from '../../../components/permalink';
import { displaySensitiveMedia, me } from '../../../initial_state';
import IconButton from '../../../components/icon_button';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
  reblog: { id: 'status.reblog', defaultMessage: 'Boost' },
  reblog_private: { id: 'status.reblog_private', defaultMessage: 'Boost to original audience' },
  cancel_reblog_private: { id: 'status.cancel_reblog_private', defaultMessage: 'Unboost' },
  cannot_reblog: { id: 'status.cannot_reblog', defaultMessage: 'This post cannot be boosted' },
  favourite: { id: 'status.favourite', defaultMessage: 'Favourite' },
});

export default @injectIntl
class MediaItem extends ImmutablePureComponent {

  static propTypes = {
    onFavourite: PropTypes.func,
    onReblog: PropTypes.func,
    intl: PropTypes.object.isRequired,
    media: ImmutablePropTypes.map.isRequired,
  };

  state = {
    visible: !this.props.media.getIn(['status', 'sensitive']) || displaySensitiveMedia,
  };

  handleFavouriteClick = () => {
    this.props.onFavourite(this.props.media.get('status'));
  }

  handleReblogClick = (e) => {
    this.props.onReblog(this.props.media.get('status'), e);
  }

  handleClick = () => {
    if (!this.state.visible) {
      this.setState({ visible: true });
      return true;
    }

    return false;
  }

  render () {
    const { media, intl } = this.props;
    const { visible } = this.state;
    const status = media.get('status');
    const focusX = media.getIn(['meta', 'focus', 'x']);
    const focusY = media.getIn(['meta', 'focus', 'y']);
    const x = ((focusX /  2) + .5) * 100;
    const y = ((focusY / -2) + .5) * 100;
    const style = {};
    const anonymousAccess    = !me;
    const publicStatus       = ['public', 'unlisted'].includes(status.get('visibility'));

    let reblogIcon = 'retweet';

    if (status.get('visibility') === 'direct') {
      reblogIcon = 'envelope';
    } else if (status.get('visibility') === 'private') {
      reblogIcon = 'lock';
    }

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
          <IconButton className='account-gallery__action-bar-button' disabled={anonymousAccess || !publicStatus} active={status.get('reblogged')} pressed={status.get('reblogged')} title={!publicStatus ? intl.formatMessage(messages.cannot_reblog) : intl.formatMessage(messages.reblog)} icon={reblogIcon} onClick={this.handleReblogClick} />
          <IconButton className='account-gallery__action-bar-button star-icon' disabled={anonymousAccess} animate active={status.get('favourited')} pressed={status.get('favourited')} title={intl.formatMessage(messages.favourite)} icon='star' onClick={this.handleFavouriteClick} />
        </div>
      </div>
    );
  }

}
