'use strict';

let DIR_CONFIG = '/nest/server/config',
    obj;

module.exports = obj = {
    APPS: '/apps',
    NEST: '/nest',
    HORNBILL: '/hornbill',
    FILE_ETC: `${ DIR_CONFIG }/etc.json`,
    FILE_SITE: `${ DIR_CONFIG }/site.json`,
    FILE_VHOST: `${ DIR_CONFIG }/virtual_host.json`,
    FILE_SERVICE: '/nest/jserver/config/service.json',
    SITE_SUFFIX: '.fedevot.meilishuo.com',
    URL_SERVER: 'rabbit.fedevot.meilishuo.com',

    changeToNewPath() {
        let path = `${ obj.HORNBILL }/server/config`;

        obj.FILE_ETC = `${ path }/etc.json`;
        obj.FILE_SITE = `${ path }/site.json`;
        obj.FILE_VHOST = `${ path }/virtual_host.json`;
        obj.FILE_SERVICE = '/hornbill/jserver/config/service.json';
    }
};