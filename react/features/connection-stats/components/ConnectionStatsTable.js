import React, { Component } from 'react';

import { translate } from '../../base/i18n';

/**
 * React {@code Component} for displaying connection statistics.
 *
 * @extends Component
 */
class ConnectionStatsTable extends Component {
    /**
     * {@code ConnectionStatsTable} component's property types.
     *
     * @static
     */
    static propTypes = {
        /**
         * Statistics related to bandwidth.
         * {{
         *     download: Number,
         *     upload: Number
         * }}
         */
        bandwidth: React.PropTypes.object,

        /**
         * Statistics related to bitrate.
         * {{
         *     download: Number,
         *     upload: Number
         * }}
         */
        bitrate: React.PropTypes.object,

        /**
         * Statistics related to framerates for each ssrc.
         * {{
         *     [ ssrc ]: Number
         * }}
         */
        framerate: React.PropTypes.object,

        /**
         * Whether or not the statitics are for local video.
         */
        isLocalVideo: React.PropTypes.bool,

        /**
         * Callback to invoke when the show additional stats link is clicked.
         */
        onShowMore: React.PropTypes.func,

        /**
         * Statistics related to packet loss.
         * {{
         *     download: Number,
         *     upload: Number
         * }}
         */
        packetLoss: React.PropTypes.object,

        /**
         * Statistics related to display resolutions for each ssrc.
         * {{
         *     [ ssrc ]: {
         *         height: Number,
         *         width: Number
         *     }
         * }}
         */
        resolution: React.PropTypes.object,

        /**
         * Whether or not additional stats about bandwidth and transport should
         * be displayed. Will not display even if true for remote participants.
         */
        shouldShowMore: React.PropTypes.bool,

        /**
         * Invoked to obtain translated strings.
         */
        t: React.PropTypes.func,

        /**
         * Statistics related to transports.
         */
        transport: React.PropTypes.array
    };

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { isLocalVideo } = this.props;

        return (
            <div className = 'connection-info'>
                { this._renderStatistics() }
                { isLocalVideo ? this._renderShowMoreLink() : null }
                { isLocalVideo && this.props.shouldShowMore
                    ? this._renderAdditionalStats() : null }
            </div>
        );
    }

    /**
     * Creates a table as ReactElement that will display additional statistics
     * related to bandwidth and transport.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderAdditionalStats() {
        return (
            <table className = 'connection-info__container'>
                <tbody>
                    { this._renderBandwidth() }
                    { this._renderTransport() }
                </tbody>
            </table>
        );
    }

    /**
     * Creates a table row as a ReactElement for displaying bandwidth related
     * statistics.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderBandwidth() {
        const { download, upload } = this.props.bandwidth || {};

        return (
            <tr>
                <td>
                    { this.props.t('connectionindicator.bandwidth') }
                </td>
                <td>
                    <span className = 'connection-info__download'>
                        &darr;
                    </span>
                    { download ? `${download} Kbps` : 'N/A' }
                    <span className = 'connection-info__upload'>
                        &uarr;
                    </span>
                    { upload ? `${upload} Kbps` : 'N/A' }
                </td>
            </tr>
        );
    }

    /**
     * Creates a a table row as a ReactElement for displaying bitrate related
     * statistics.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderBitrate() {
        const { download, upload } = this.props.bitrate || {};

        return (
            <tr>
                <td>
                    <span>
                        { this.props.t('connectionindicator.bitrate') }
                    </span>
                </td>
                <td>
                    <span className = 'connection-info__download'>
                        &darr;
                    </span>
                    { download ? `${download} Kbps` : 'N/A' }
                    <span className = 'connection-info__upload'>
                        &uarr;
                    </span>
                    { upload ? `${upload} Kbps` : 'N/A' }
                </td>
            </tr>
        );
    }

    /**
     * Creates a table row as a ReactElement for displaying frame rate related
     * statistics.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderFrameRate() {
        const { framerate, t } = this.props;
        const frameRateString = Object.keys(framerate || {})
            .map(ssrc => framerate[ssrc])
            .join(', ') || 'N/A';

        return (
            <tr>
                <td>
                    <span>{ t('connectionindicator.framerate') }</span>
                </td>
                <td>{ frameRateString }</td>
            </tr>
        );
    }

    /**
     * Creates a tables row as a ReactElement for displaying packet loss related
     * statistics.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderPacketLoss() {
        const { packetLoss, t } = this.props;
        let packetLossTableData;

        if (packetLoss) {
            const { download, upload } = packetLoss;

            // eslint-disable-next-line no-extra-parens
            packetLossTableData = (
                <td>
                    <span className = 'connection-info__download'>
                        &darr;
                    </span>
                    { download === null ? 'N/A' : `${download}%` }
                    <span className = 'connection-info__upload'>
                        &uarr;
                    </span>
                    { upload === null ? 'N/A' : `${upload}%` }
                </td>
            );
        } else {
            packetLossTableData = <td>N/A</td>;
        }

        return (
            <tr>
                <td>
                    <span>
                        { t('connectionindicator.packetloss') }
                    </span>
                </td>
                { packetLossTableData }
            </tr>
        );
    }

    /**
     * Creates a table row as a ReactElement for displaying resolution related
     * statistics.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderResolution() {
        const { resolution, t } = this.props;
        const resolutionString = Object.keys(resolution || {})
            .map(ssrc => {
                const { width, height } = resolution[ssrc];

                return `${width}x${height}`;
            })
            .join(', ') || 'N/A';

        return (
            <tr>
                <td>
                    <span>{ t('connectionindicator.resolution') }</span>
                </td>
                <td>{ resolutionString }</td>
            </tr>
        );
    }

    /**
     * Creates a ReactElement for display a link to toggle showing additional
     * statistics.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderShowMoreLink() {
        const translationKey
            = this.props.shouldShowMore
            ? 'connectionindicator.less'
            : 'connectionindicator.more';

        return (
            <a
                className = 'jitsipopover__showmore link'
                onClick = { this.props.onShowMore } >
                { this.props.t(translationKey) }
            </a>
        );
    }

    /**
     * Creates a table as a ReactElement for displaying connection statistics.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderStatistics() {
        return (
            <table className = 'connection-info__container'>
                <tbody>
                    { this._renderBitrate() }
                    { this._renderPacketLoss() }
                    { this._renderResolution() }
                    { this._renderFrameRate() }
                </tbody>
            </table>
        );
    }

    /**
     * Creates table rows as ReactElements for displaying transport related
     * statistics.
     *
     * @private
     * @returns {ReactElement[]}
     */
    _renderTransport() {
        const { t, transport } = this.props;

        if (!transport || transport.length === 0) {
            // eslint-disable-next-line no-extra-parens
            const NA = (
                <tr key = 'address'>
                    <td>
                        <span>{ t('connectionindicator.address') }</span>
                    </td>
                    <td>
                        N/A
                    </td>
                </tr>
            );

            return [ NA ];
        }

        const data = {
            localIP: [],
            localPort: [],
            remoteIP: [],
            remotePort: [],
            transportType: []
        };

        for (let i = 0; i < transport.length; i++) {
            const ip = getIP(transport[i].ip);
            const localIP = getIP(transport[i].localip);
            const localPort = getPort(transport[i].localip);
            const port = getPort(transport[i].ip);

            if (!data.remoteIP.includes(ip)) {
                data.remoteIP.push(ip);
            }

            if (!data.localIP.includes(localIP)) {
                data.localIP.push(localIP);
            }

            if (!data.localPort.includes(localPort)) {
                data.localPort.push(localPort);
            }

            if (!data.remotePort.includes(port)) {
                data.remotePort.push(port);
            }

            if (!data.transportType.includes(transport[i].type)) {
                data.transportType.push(transport[i].type);
            }
        }

        // All of the transports should be either P2P or JVB
        const isP2P = transport.length ? transport[0].p2p : false;

        // First show remote statistics, then local, and then transport type.
        const tableRowConfigurations = [
            {
                additionalData: isP2P
                    ? <span>{ t('connectionindicator.peer_to_peer') }</span>
                    : null,
                data: data.remoteIP,
                key: 'remoteaddress',
                label: t('connectionindicator.remoteaddress',
                    { count: data.remoteIP.length })
            },
            {
                data: data.remotePort,
                key: 'remoteport',
                label: t('connectionindicator.remoteport',
                        { count: transport.length })
            },
            {
                data: data.localIP,
                key: 'localaddress',
                label: t('connectionindicator.localaddress',
                    { count: data.localIP.length })
            },
            {
                data: data.localPort,
                key: 'localport',
                label: t('connectionindicator.localport',
                    { count: transport.length })
            },
            {
                data: data.transportType,
                key: 'transport',
                label: t('connectionindicator.transport',
                    { count: data.transportType.length })
            }
        ];

        return tableRowConfigurations.map(this._renderTransportTableRow);
    }

    /**
     * Creates a table row as a ReactElement for displaying a transport related
     * statistic.
     *
     * @param {Object} config - Describes the contents of the row.
     * @param {ReactElement} config.additionalData - Extra data to display next
     * to the passed in config.data.
     * @param {Array} config.data - The transport statistics to display.
     * @param {string} config.key - The ReactElement's key. Must be unique for
     * iterating over multiple child rows.
     * @param {string} config.label - The text to display describing the data.
     * @private
     * @returns {ReactElement}
     */
    _renderTransportTableRow(config) {
        const { additionalData, data, key, label } = config;

        return (
            <tr key = { key }>
                <td>
                    <span>
                        { label }
                    </span>
                </td>
                <td>
                    { getStringFromArray(data) }
                    { additionalData || null }
                </td>
            </tr>
        );
    }
}

/**
 * Utility for getting the IP from a transport statistics object's
 * representation of an IP.
 *
 * @param {string} value - The transport's IP to parse.
 * @private
 * @returns {string}
 */
function getIP(value) {
    return value.substring(0, value.lastIndexOf(':'));
}

/**
 * Utility for getting the port from a transport statistics object's
 * representation of an IP.
 *
 * @param {string} value - The transport's IP to parse.
 * @private
 * @returns {string}
 */
function getPort(value) {
    return value.substring(value.lastIndexOf(':') + 1, value.length);
}

/**
 * Utility for concatenating values in an array into a comma separated string.
 *
 * @param {Array} array - Transport statistics to concatenate.
 * @private
 * @returns {string}
 */
function getStringFromArray(array) {
    let res = '';

    for (let i = 0; i < array.length; i++) {
        res += (i === 0 ? '' : ', ') + array[i];
    }

    return res;
}

export default translate(ConnectionStatsTable);
